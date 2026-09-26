#!/usr/bin/env node
// scripts/migration/db/selftest.mjs
//
// Self-test for every sync.mjs mode against a throwaway LOCAL PostgreSQL 16
// with two databases (migtest_src / migtest_dst), per SPEC-03 §3 / SPEC-02's
// local-PG recipe. NEVER run this against the real source or Neon: it takes
// its URLs from MIGTEST_SRC_URL / MIGTEST_DST_URL, not SRC_URL/DST_URL/
// REPLIT_DATABASE_URL, as a mechanical guard against pointing it at anything
// else by accident.
//
// Usage: node selftest.mjs [--out file]


import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import pg from "pg";
import { maskUrl, connect, connectionIdentity } from "./lib.mjs";
import {
  verify,
  runGap,
  runDelta,
  runFullRefresh,
  runInitWatermarks,
  runReverseDelta,
  ensureMigrationSchema,
  checkReplitDnsGuard,
} from "./sync.mjs";

// Injectable DNS lookups (same shape checkReplitDnsGuard already accepts)
// that always report the Replit IP everywhere, so scenarios that exercise
// full-refresh/init-watermarks's pre-copy guards run deterministically
// offline instead of depending on this process being able to reach
// dns.google/cloudflare-dns.com. The DNS guard's OWN logic (a mixed
// A-record set, an exact match) is covered separately in scenario 16.
const FAKE_DNS_ALL_REPLIT = {
  google: async () => ["34.111.179.208"],
  cloudflare: async () => ["34.111.179.208"],
  node: async () => ["34.111.179.208"],
};

const KNOWN_TABLES = ["blog_redirects", "blog_posts", "newsletter_subscriptions", "demo_requests"];

// No default connection strings on purpose (even throwaway-local ones): the
// caller must set up its own disposable PG16 role/databases and point these
// env vars at them. See docs/migration/specs/SPEC-02 for the local-PG recipe.
const SRC_URL = process.env.MIGTEST_SRC_URL;
const DST_URL = process.env.MIGTEST_DST_URL;
if (!SRC_URL || !DST_URL) {
  throw new Error("Set MIGTEST_SRC_URL and MIGTEST_DST_URL to a throwaway local PG16's two databases before running selftest.mjs");
}

if (/neon\.tech|replit/i.test(SRC_URL) || /neon\.tech/i.test(DST_URL)) {
  throw new Error("selftest refuses to run against anything that looks like the real source or Neon");
}

const SCHEMA_SQL = `
CREATE TABLE demo_requests (
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  company_size text NOT NULL,
  modules text[] NOT NULL,
  message text,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE newsletter_subscriptions (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE blog_posts (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL,
  date text NOT NULL,
  author text NOT NULL,
  author_team text NOT NULL DEFAULT 'Growmax Core Team',
  read_time text NOT NULL DEFAULT '5 Min Read',
  excerpt text NOT NULL,
  sections jsonb,
  related_slugs text[] DEFAULT '{}'::text[],
  published boolean NOT NULL DEFAULT false,
  legacy_url text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE blog_redirects (
  id serial PRIMARY KEY,
  old_path text NOT NULL UNIQUE,
  new_path text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);
`;

function client(url) {
  return new pg.Client({ connectionString: url });
}

/**
 * @param {{initWatermarksAtZero?: boolean}} opts Every real scenario here
 * represents a target that was already initialized by full-refresh /
 * init-watermarks (SPEC-03 §4 step 2) before any delta runs -- watermark 0
 * means "nothing was in the source yet when the target was initialized",
 * which is exactly what these throwaway databases start as. Pass
 * `initWatermarksAtZero: false` only to test delta's refusal when a table is
 * NOT initialized.
 */
async function resetDatabases({ initWatermarksAtZero = true } = {}) {
  for (const url of [SRC_URL, DST_URL]) {
    const c = client(url);
    await c.connect();
    await c.query(`drop schema public cascade; create schema public;`);
    await c.query(`drop schema if exists _migration cascade;`);
    await c.query(SCHEMA_SQL);
    await c.end();
  }
  if (initWatermarksAtZero) {
    const dc = client(DST_URL);
    await dc.connect();
    await dc.query(`create schema if not exists _migration`);
    await dc.query(`
      create table if not exists _migration.sync_state (
        table_name text primary key,
        watermark bigint not null,
        last_run_at timestamptz not null
      )`);
    await dc.query(`
      create table if not exists _migration.sync_log (
        run_at timestamptz not null default now(),
        table_name text not null,
        inserted int not null default 0,
        updated int not null default 0,
        key_conflicts int not null default 0,
        target_deleted int not null default 0,
        late_commits int not null default 0
      )`);
    for (const t of KNOWN_TABLES) {
      await dc.query(`insert into _migration.sync_state (table_name, watermark, last_run_at) values ($1, 0, now())`, [t]);
    }
    await dc.end();
  }
}

async function seedSrc(rows) {
  const c = client(SRC_URL);
  await c.connect();
  for (const r of rows) {
    if (r.table === "blog_posts") {
      await c.query(
        `insert into blog_posts (id, slug, title, category, date, author, excerpt, published, created_at, updated_at)
         overriding system value
         values ($1,$2,$3,'Eng','2026-01-01','A',$4,true,$5,$6)`,
        [r.id, r.slug, r.title ?? r.slug, r.slug, r.createdAt ?? new Date(), r.updatedAt ?? r.createdAt ?? new Date()]
      );
    } else if (r.table === "blog_redirects") {
      await c.query(
        `insert into blog_redirects (id, old_path, new_path, created_at) overriding system value values ($1,$2,$3,$4)`,
        [r.id, r.oldPath, r.newPath ?? "/new", r.createdAt ?? new Date()]
      );
    } else if (r.table === "newsletter_subscriptions") {
      await c.query(
        `insert into newsletter_subscriptions (id, email, created_at) overriding system value values ($1,$2,$3)`,
        [r.id, r.email, r.createdAt ?? new Date()]
      );
    } else if (r.table === "demo_requests") {
      await c.query(
        `insert into demo_requests (id, first_name, last_name, email, company, company_size, modules, created_at)
         overriding system value values ($1,'Jane','Doe',$2,'Acme','50-200',$3,$4)`,
        [r.id, r.email, r.modules ?? ["crm"], r.createdAt ?? new Date()]
      );
    }
  }
  // Advance the sequences past any explicit ids we just inserted.
  for (const t of ["blog_posts", "blog_redirects", "newsletter_subscriptions", "demo_requests"]) {
    await c.query(`select setval(pg_get_serial_sequence($1,'id'), greatest((select coalesce(max(id),1) from ${t}), 1))`, [t]);
  }
  await c.end();
}

async function seedDstDirect(table, cols, values) {
  const c = client(DST_URL);
  await c.connect();
  const placeholders = values.map((_, i) => `$${i + 1}`).join(",");
  await c.query(`insert into ${table} (${cols.join(",")}) overriding system value values (${placeholders})`, values);
  await c.end();
}

async function deleteFromDst(table, id) {
  const c = client(DST_URL);
  await c.connect();
  await c.query(`delete from ${table} where id = $1`, [id]);
  await c.end();
}

async function countRows(url, table) {
  const c = client(url);
  await c.connect();
  const { rows } = await c.query(`select count(*)::int as n from ${table}`);
  await c.end();
  return rows[0].n;
}

function baseArgs(extra = {}) {
  return {
    srcEnv: "MIGTEST_SRC_URL",
    dstEnv: "MIGTEST_DST_URL",
    srcTransport: "container-tcp",
    dstTransport: "container-tcp",
    belowGap: null,
    excludeTargetNewer: false,
    gapStart: 1000,
    dryRun: false,
    iUnderstand: false,
    confirmPreCutover: false,
    stateFile: "/nonexistent-state-for-selftest.json",
    ...extra,
  };
}

/** Local stand-in for runner.mjs's pg_dump/pg_restore copy (SPEC-03 §4),
 * against the throwaway PG16 only. */
async function localCopy() {
  const dumpFile = "/tmp/selftest-full-refresh.dump";
  const tocFile = "/tmp/selftest-full-refresh.toc";
  execFileSync("pg_dump", [SRC_URL, "--format=custom", "--no-owner", "--no-privileges", "--schema=public", "--file=" + dumpFile]);
  execFileSync("psql", [DST_URL, "-c", "drop schema public cascade; create schema public;"]);
  // SPEC-03 §4: if the restore trips over `SCHEMA public` / `COMMENT ON
  // SCHEMA public` entries (they already exist on a fresh target), filter
  // them out of the TOC and restore with `-L`.
  const rawToc = execFileSync("pg_restore", ["--list", dumpFile]).toString();
  const filteredToc = rawToc
    .split("\n")
    .filter((line) => !/;\s*\d+\s+\d+\s+SCHEMA\s+-\s+public\b/.test(line) && !/;\s*\d+\s+\d+\s+COMMENT\s+-\s+SCHEMA public\b/.test(line))
    .join("\n");
  writeFileSync(tocFile, filteredToc);
  execFileSync("pg_restore", [
    "--no-owner",
    "--no-privileges",
    "--exit-on-error",
    "--single-transaction",
    "-L",
    tocFile,
    "--dbname=" + DST_URL,
    dumpFile,
  ]);
}

async function dstQuery(text, params = []) {
  const c = client(DST_URL);
  await c.connect();
  try {
    return (await c.query(text, params)).rows;
  } finally {
    await c.end();
  }
}

async function srcExec(text, params = []) {
  const c = client(SRC_URL);
  await c.connect();
  try {
    return (await c.query(text, params)).rows;
  } finally {
    await c.end();
  }
}

const results = [];
/** `ok` is true/false for an executed scenario, or `null` for one that could
 * not be exercised (a genuine skip). A null is NEVER treated as a pass:
 * allPass below requires every scenario's `ok` to be strictly `true`, so a
 * skip recorded here still fails the overall self-test rather than silently
 * passing alongside scenarios that did run. */
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const label = ok === null ? "SKIP" : ok ? "PASS" : "FAIL";
  console.error(`${label} ${name}`);
}

async function main() {
  process.env.MIGTEST_SRC_URL = SRC_URL;
  process.env.MIGTEST_DST_URL = DST_URL;

  // =========================================================================
  // Scenario 1: first delta run populates an empty target from scratch.
  // =========================================================================
  await resetDatabases();
  const now = new Date();
  const old = new Date(now.getTime() - 6 * 3600 * 1000); // 6h ago: outside the 1h late-commit window
  await seedSrc([
    { table: "blog_redirects", id: 1, oldPath: "/old-1", createdAt: old },
    { table: "blog_redirects", id: 2, oldPath: "/old-2", createdAt: old },
    { table: "blog_posts", id: 1, slug: "post-1", createdAt: old, updatedAt: old },
    { table: "blog_posts", id: 2, slug: "post-2", createdAt: old, updatedAt: old },
    { table: "newsletter_subscriptions", id: 1, email: "a@example.com", createdAt: old },
    { table: "demo_requests", id: 1, email: "jane@example.com", createdAt: old },
  ]);

  let d1;
  try {
    d1 = await runDelta(baseArgs());
    const t = Object.fromEntries(d1.tables.map((t) => [t.table, t]));
    const ok =
      t.blog_redirects.inserted === 2 &&
      t.blog_posts.inserted === 2 &&
      t.newsletter_subscriptions.inserted === 1 &&
      t.demo_requests.inserted === 1 &&
      (await countRows(DST_URL, "blog_posts")) === 2;
    record("delta: initial populate from empty target", ok, t);
  } catch (e) {
    record("delta: initial populate from empty target", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 2: new source rows since the watermark.
  // =========================================================================
  try {
    await seedSrc([{ table: "blog_posts", id: 3, slug: "post-3", createdAt: new Date(), updatedAt: new Date() }]);
    const d2 = await runDelta(baseArgs());
    const t = d2.tables.find((x) => x.table === "blog_posts");
    const ok = t.inserted === 1 && t.blogChanged === true && (await countRows(DST_URL, "blog_posts")) === 3;
    record("delta: new source row inserted with original id", ok, t);
  } catch (e) {
    record("delta: new source row inserted with original id", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 3: natural-key conflict. A row with post-4's slug already exists
  // on the target (different id) before post-4 is synced from the source.
  // =========================================================================
  try {
    await seedDstDirect(
      "blog_posts",
      ["id", "slug", "title", "category", "date", "author", "excerpt", "published", "created_at", "updated_at"],
      [999, "post-4", "Manually created", "Eng", "2026-01-01", "Editor", "excerpt", true, new Date(), new Date()]
    );
    await seedSrc([{ table: "blog_posts", id: 4, slug: "post-4", createdAt: new Date(), updatedAt: new Date() }]);
    const d3 = await runDelta(baseArgs());
    const t = d3.tables.find((x) => x.table === "blog_posts");
    const ok =
      t.keyConflicts === 1 &&
      t.conflictPairs.length === 1 &&
      t.conflictPairs[0].sourceId === 4 &&
      String(t.conflictPairs[0].targetId) === "999" &&
      (await countRows(DST_URL, "blog_posts")) === 4; // no duplicate row inserted
    record("delta: natural-key conflict reconciled (no duplicate)", ok, t);
  } catch (e) {
    record("delta: natural-key conflict reconciled (no duplicate)", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 4: late commit. A row with id <= watermark, missing on target,
  // but created_at recent (a transaction that committed after id allocation
  // but whose commit only became visible after the watermark had already
  // advanced past its id).
  // =========================================================================
  try {
    // Bump the source sequence and insert id=2 worth of "gap" then a genuinely
    // late id that is numerically <= the current watermark.
    const c = client(SRC_URL);
    await c.connect();
    // Current watermark for blog_redirects is 2 (from scenario 1). Insert id=2
    // is already taken; use blog_redirects and manually force an id below an
    // artificially-advanced watermark by first advancing it with a normal row,
    // then "late" inserting one with a lower id that slipped through.
    await c.query(`insert into blog_redirects (id, old_path, new_path, created_at) overriding system value values (10, '/old-10', '/new-10', now())`);
    await c.end();
    const d4a = await runDelta(baseArgs()); // watermark for blog_redirects -> 10
    // Now simulate the late commit: id=5, created_at is "now" (within the window),
    // committed after id 10 was already synced and the watermark moved past it.
    const c2 = client(SRC_URL);
    await c2.connect();
    await c2.query(`insert into blog_redirects (id, old_path, new_path, created_at) overriding system value values (5, '/old-5', '/new-5', now())`);
    await c2.end();
    const d4b = await runDelta(baseArgs());
    const t = d4b.tables.find((x) => x.table === "blog_redirects");
    const ok = t.lateCommits === 1 && t.targetDeleted === 0 && (await countRows(DST_URL, "blog_redirects")) === 4; // 2 + id10 + id5
    record("delta: late commit inserted within the 1h window", ok, { d4a: d4a.tables.find((x) => x.table === "blog_redirects"), d4b: t });
  } catch (e) {
    record("delta: late commit inserted within the 1h window", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 5: target deletion. A previously-synced row is deleted on the
  // target (editor/test cleanup); delta must NEVER resurrect it, and must
  // count it as target_deleted, not late_commits (its created_at is old).
  // =========================================================================
  try {
    await deleteFromDst("newsletter_subscriptions", 1); // synced in scenario 1, created_at = 6h ago
    const d5 = await runDelta(baseArgs());
    const t = d5.tables.find((x) => x.table === "newsletter_subscriptions");
    const ok =
      t.targetDeleted === 1 &&
      t.lateCommits === 0 &&
      t.inserted === 0 &&
      t.targetDeletedIds.map(String).includes("1") &&
      (await countRows(DST_URL, "newsletter_subscriptions")) === 0;
    record("delta: target deletion is reported and never resurrected", ok, t);
  } catch (e) {
    record("delta: target deletion is reported and never resurrected", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 5b: target deletion of a RECENTLY-synced row (the exact bug the
  // synced_ids tracking closes). A row is created and synced by run N
  // (recent created_at -- inside what used to be the 1h late-commit window),
  // then deleted on the target before run N+1. The old created_at-based
  // heuristic could not tell this apart from a true late commit and would
  // resurrect it; delta must now report it as target_deleted (using
  // _migration.synced_ids, not the row's age) and never re-insert it.
  // =========================================================================
  try {
    const c = client(SRC_URL);
    await c.connect();
    await c.query(
      `insert into newsletter_subscriptions (id, email, created_at) overriding system value values (20, 'recent@example.com', now())`
    );
    await c.end();
    const dInsert = await runDelta(baseArgs()); // inserts id=20, marks it synced
    const insertedOk = dInsert.tables.find((x) => x.table === "newsletter_subscriptions").inserted === 1;

    await deleteFromDst("newsletter_subscriptions", 20); // deleted moments after being synced
    const dAfterDelete = await runDelta(baseArgs());
    const t = dAfterDelete.tables.find((x) => x.table === "newsletter_subscriptions");
    // id=1 (deleted in scenario 5, above) is still missing and still
    // recorded as synced, so it is correctly re-reported as target_deleted
    // on every subsequent run alongside id=20.
    const ok =
      insertedOk &&
      t.lateCommits === 0 &&
      t.inserted === 0 &&
      t.targetDeletedIds.map(String).includes("20") &&
      (await countRows(DST_URL, "newsletter_subscriptions")) === 0; // never resurrected
    record("delta: a recently-synced row deleted on the target is never resurrected as a late commit", ok, {
      insertedOk,
      afterDelete: t,
    });
  } catch (e) {
    record(
      "delta: a recently-synced row deleted on the target is never resurrected as a late commit",
      false,
      String(e.stack || e)
    );
  }

  // =========================================================================
  // Scenario 6: blog_posts edits -- source newer wins, target newer is kept.
  // =========================================================================
  try {
    const c = client(SRC_URL);
    await c.connect();
    await c.query(`update blog_posts set title = 'Post 1 (edited on source)', updated_at = now() where id = 1`);
    await c.end();
    const d6a = await runDelta(baseArgs());
    const dc = client(DST_URL);
    await dc.connect();
    const { rows: r1 } = await dc.query(`select title from blog_posts where id = 1`);
    await dc.end();
    const okSourceWins = d6a.tables.find((x) => x.table === "blog_posts").updated >= 1 && r1[0].title === "Post 1 (edited on source)";
    record("delta: blog_posts source-newer edit propagates", okSourceWins, { title: r1[0].title });

    // Target newer: edit the target directly with a later updated_at; source
    // edit must NOT be applied since target's updated_at is now newer.
    const dc2 = client(DST_URL);
    await dc2.connect();
    await dc2.query(`update blog_posts set title = 'Post 1 (edited on target, newer)', updated_at = now() + interval '1 hour' where id = 1`);
    await dc2.end();
    const c2 = client(SRC_URL);
    await c2.connect();
    await c2.query(`update blog_posts set title = 'Post 1 (older source edit)', updated_at = now() where id = 1`);
    await c2.end();
    const d6b = await runDelta(baseArgs());
    const dc3 = client(DST_URL);
    await dc3.connect();
    const { rows: r2 } = await dc3.query(`select title from blog_posts where id = 1`);
    await dc3.end();
    const okTargetKept = r2[0].title === "Post 1 (edited on target, newer)";
    record("delta: blog_posts target-newer edit is kept (not overwritten)", okTargetKept, { title: r2[0].title });
  } catch (e) {
    record("delta: blog_posts edits (source/target newer)", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 7: watermark never decreases even if called with stale data,
  // and re-running delta with nothing new is a no-op.
  // =========================================================================
  try {
    const d7a = await runDelta(baseArgs());
    const noopOk = d7a.tables.every((t) => t.inserted === 0 && t.updated === 0 && t.lateCommits === 0);
    record(
      "delta: idempotent re-run with no new data is a no-op",
      noopOk,
      d7a.tables.map((t) => ({ table: t.table, inserted: t.inserted, updated: t.updated }))
    );
  } catch (e) {
    record("delta: idempotent re-run with no new data is a no-op", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 8: gap mode moves sequences forward, never backward.
  // =========================================================================
  try {
    const g1 = await runGap(baseArgs({ gapStart: 1000 }));
    const c = client(DST_URL);
    await c.connect();
    const { rows } = await c.query(`select nextval(pg_get_serial_sequence('blog_posts','id')) as n`);
    await c.end();
    const okForward = Number(rows[0].n) === 1000 && g1.sequences.every((s) => !s.moved || s.newNext === 1000);
    // Calling gap again with a LOWER gapStart must never move it backwards.
    const g2 = await runGap(baseArgs({ gapStart: 500 }));
    const c2 = client(DST_URL);
    await c2.connect();
    const { rows: rows2 } = await c2.query(`select last_value from ${(await c2.query(`select pg_get_serial_sequence('blog_posts','id') as s`)).rows[0].s}`);
    await c2.end();
    const okNeverBackward = Number(rows2[0].last_value) >= 1000;
    record("gap: sequences move forward to GAP_START and never backward", okForward && okNeverBackward, { g1, g2, afterSecondCall: rows2[0] });
  } catch (e) {
    record("gap: sequences move forward to GAP_START and never backward", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 9: verify mode. Reset to two identical databases -> pass; then
  // introduce a real mismatch -> fail with mismatchCount > 0.
  // =========================================================================
  try {
    await resetDatabases();
    await seedSrc([
      { table: "blog_posts", id: 1, slug: "v-1" },
      { table: "blog_posts", id: 2, slug: "v-2" },
    ]);
    await runDelta(baseArgs());
    const vOk = await verify(baseArgs());
    const passOk = vOk.pass === true && vOk.mismatchCount === 0;
    record("verify: identical databases pass with zero mismatches", passOk, {
      mismatchCount: vOk.mismatchCount,
      tables: vOk.tables,
    });

    const c = client(DST_URL);
    await c.connect();
    await c.query(`update blog_posts set title = 'tampered' where id = 1`);
    await c.end();
    const vBad = await verify(baseArgs());
    const failOk = vBad.pass === false && vBad.mismatchCount === 1;
    record("verify: a real mismatch is detected and fails", failOk, { mismatchCount: vBad.mismatchCount });
  } catch (e) {
    record("verify: mode behaves correctly", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 10: full-refresh guard rejects when STATE says post-cutover or
  // cutover has been detected (no network / no real copy needed for this).
  // =========================================================================
  try {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    const tmpState = path.join(os.tmpdir(), `selftest-state-${Date.now()}.json`);

    fs.writeFileSync(tmpState, JSON.stringify({ status: "POST_CUTOVER", facts: { cutover: { detectedAt: null } } }));
    let refusedPostCutover = false;
    try {
      await runFullRefresh(baseArgs({ confirmPreCutover: true, stateFile: tmpState }));
    } catch (e) {
      refusedPostCutover = /POST_CUTOVER/.test(e.message);
    }

    fs.writeFileSync(tmpState, JSON.stringify({ status: "IN_PROGRESS", facts: { cutover: { detectedAt: "2026-09-26T00:00:00Z" } } }));
    let refusedDetectedAt = false;
    try {
      await runFullRefresh(baseArgs({ confirmPreCutover: true, stateFile: tmpState }));
    } catch (e) {
      refusedDetectedAt = /detectedAt/.test(e.message);
    }

    let refusedNoConfirm = false;
    try {
      await runFullRefresh(baseArgs({ confirmPreCutover: false, stateFile: tmpState }));
    } catch (e) {
      refusedNoConfirm = /--confirm-pre-cutover/.test(e.message);
    }

    fs.unlinkSync(tmpState);
    record("full-refresh: refuses post-cutover / detectedAt / missing confirm flag", refusedPostCutover && refusedDetectedAt && refusedNoConfirm, {
      refusedPostCutover,
      refusedDetectedAt,
      refusedNoConfirm,
    });
  } catch (e) {
    record("full-refresh: refuses post-cutover / detectedAt / missing confirm flag", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 11: full-refresh happy path end-to-end (local pg_dump/pg_restore
  // copy fn), including the DNS guard. Runs fully offline: the DNS guard is
  // exercised with injected lookups (FAKE_DNS_ALL_REPLIT) instead of live
  // dns.google/cloudflare-dns.com reachability, so this scenario is never
  // skipped -- its guard logic being untestable from a sandboxed process was
  // exactly the false-pass this fixes.
  // =========================================================================
  try {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    const tmpState = path.join(os.tmpdir(), `selftest-state-happy-${Date.now()}.json`);
    fs.writeFileSync(tmpState, JSON.stringify({ status: "IN_PROGRESS", facts: { cutover: { detectedAt: null } } }));

    await resetDatabases();
    await seedSrc([
      { table: "blog_posts", id: 1, slug: "fr-1" },
      { table: "blog_redirects", id: 1, oldPath: "/fr-old-1" },
    ]);

    const result = await runFullRefresh(baseArgs({ confirmPreCutover: true, stateFile: tmpState, gapStart: 5000 }), {
      copyFn: localCopy,
      lookups: FAKE_DNS_ALL_REPLIT,
    });
    const ok =
      result.dnsGuard.pass === true &&
      result.verify.pass === true &&
      result.watermarks.blog_posts === 1 &&
      result.gap.gapStart === 5000;
    record("full-refresh: happy path (copy -> gap -> verify -> watermark init)", ok, {
      dnsGuardPass: result.dnsGuard.pass,
      verifyPass: result.verify.pass,
      watermarks: result.watermarks,
    });
    fs.unlinkSync(tmpState);
  } catch (e) {
    record("full-refresh: happy path (copy -> gap -> verify -> watermark init)", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 12: reverse-delta dry-run plans without writing, and refuses to
  // write for real without both guards.
  // =========================================================================
  try {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    // A real (non-dry-run) reverse-delta now hard-refuses unless STATE.json
    // confirms facts.cutover.detectedAt (a rollback with no confirmed cutover
    // must not silently skip the blog_posts backfill and still exit 0), so
    // this scenario needs a real state file, not the default nonexistent one.
    const tmpState = path.join(os.tmpdir(), `selftest-state-reversedelta-${Date.now()}.json`);
    fs.writeFileSync(
      tmpState,
      JSON.stringify({ status: "IN_PROGRESS", facts: { cutover: { detectedAt: new Date().toISOString() } } })
    );

    await resetDatabases();
    await seedSrc([{ table: "blog_posts", id: 1, slug: "keep-on-source" }]);
    await runDelta(baseArgs({ gapStart: 1000 }));
    // Simulate post-cutover target rows above the gap.
    await seedDstDirect(
      "blog_posts",
      ["id", "slug", "title", "category", "date", "author", "excerpt", "published", "created_at", "updated_at"],
      [1000, "post-cutover-new", "New", "Eng", "2026-01-01", "Editor", "excerpt", true, new Date(), new Date()]
    );

    const dry = await runReverseDelta(baseArgs({ gapStart: 1000, dryRun: true, stateFile: tmpState }));
    const postCount = await countRows(SRC_URL, "blog_posts");
    const dryOk = dry.plan.find((p) => p.table === "blog_posts").rowsAboveGap === 1 && postCount === 1; // source untouched

    let refusedWithoutGuards = false;
    try {
      await runReverseDelta(baseArgs({ gapStart: 1000, dryRun: false, iUnderstand: false, stateFile: tmpState }));
    } catch (e) {
      refusedWithoutGuards = /ALLOW_SOURCE_WRITES|i-understand/.test(e.message);
    }

    delete process.env.ALLOW_SOURCE_WRITES;
    let refusedWithOnlyFlag = false;
    try {
      await runReverseDelta(baseArgs({ gapStart: 1000, dryRun: false, iUnderstand: true, stateFile: tmpState }));
    } catch (e) {
      refusedWithOnlyFlag = /ALLOW_SOURCE_WRITES/.test(e.message);
    }

    process.env.ALLOW_SOURCE_WRITES = "1";
    const real = await runReverseDelta(baseArgs({ gapStart: 1000, dryRun: false, iUnderstand: true, stateFile: tmpState }));
    delete process.env.ALLOW_SOURCE_WRITES;
    const afterCount = await countRows(SRC_URL, "blog_posts");
    const realOk = real.plan.find((p) => p.table === "blog_posts").moved === 1 && afterCount === 2;

    // A real rollback with NO confirmed cutover (the default nonexistent
    // state file) must hard-refuse rather than silently skip the blog
    // backfill and exit 0.
    process.env.ALLOW_SOURCE_WRITES = "1";
    let refusedNoDetectedAt = false;
    try {
      await runReverseDelta(baseArgs({ gapStart: 1000, dryRun: false, iUnderstand: true }));
    } catch (e) {
      refusedNoDetectedAt = /detectedAt/.test(e.message);
    } finally {
      delete process.env.ALLOW_SOURCE_WRITES;
    }

    record(
      "reverse-delta: dry-run plans without writing; refuses without both guards; writes with both; refuses a real run with no confirmed cutover",
      dryOk && refusedWithoutGuards && refusedWithOnlyFlag && realOk && refusedNoDetectedAt,
      { dryOk, refusedWithoutGuards, refusedWithOnlyFlag, realOk, refusedNoDetectedAt }
    );
    fs.unlinkSync(tmpState);
  } catch (e) {
    record("reverse-delta: dry-run plans without writing; refuses without both guards; writes with both", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 13: verify detects a row that exists on the target but has no
  // source counterpart at all (not even by natural key) -- leftover test
  // rows, duplicates, or junk below the gap must not silently pass G4.
  // =========================================================================
  try {
    await resetDatabases();
    await seedSrc([{ table: "blog_posts", id: 1, slug: "extra-1" }]);
    await runDelta(baseArgs());
    await seedDstDirect(
      "blog_posts",
      ["id", "slug", "title", "category", "date", "author", "excerpt", "published", "created_at", "updated_at"],
      [777, "extra-only-on-target", "Extra", "Eng", "2026-01-01", "Editor", "excerpt", true, new Date(), new Date()]
    );
    const vExtra = await verify(baseArgs());
    const t = vExtra.tables.blog_posts;
    const ok =
      vExtra.pass === false &&
      t.extraOnTarget === 1 &&
      t.mismatches.some((m) => m.id === "777" && m.reason === "extra_on_target");
    record("verify: an extra row on the target with no source counterpart is detected", ok, {
      mismatchCount: vExtra.mismatchCount,
      table: t,
    });
  } catch (e) {
    record("verify: an extra row on the target with no source counterpart is detected", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 14: delta refuses to run when any table has no
  // _migration.sync_state row, instead of silently defaulting its watermark
  // to 0 (which would resurrect anything already deleted on the target).
  // =========================================================================
  try {
    await resetDatabases({ initWatermarksAtZero: false });
    await seedSrc([{ table: "blog_posts", id: 1, slug: "uninit-1" }]);
    let refused = false;
    let message = "";
    try {
      await runDelta(baseArgs());
    } catch (e) {
      refused = /delta refused/.test(e.message) && /sync_state/.test(e.message);
      message = e.message;
    }
    record("delta: refuses to run when a table has no sync_state row", refused, { message });
  } catch (e) {
    record("delta: refuses to run when a table has no sync_state row", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 15: the STATE guard is resolved against the repo root (not
  // process.cwd()) and refuses full-refresh/init-watermarks outright when
  // STATE.json is missing or unreadable, rather than silently skipping it.
  // =========================================================================
  try {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    const missingState = path.join(os.tmpdir(), `selftest-missing-state-${Date.now()}.json`);
    let refusedMissing = false;
    try {
      await runInitWatermarks(baseArgs({ confirmPreCutover: true, stateFile: missingState }));
    } catch (e) {
      refusedMissing = /STATE\.json not found/.test(e.message);
    }

    const invalidState = path.join(os.tmpdir(), `selftest-invalid-state-${Date.now()}.json`);
    fs.writeFileSync(invalidState, "{ not valid json");
    let refusedInvalid = false;
    try {
      await runInitWatermarks(baseArgs({ confirmPreCutover: true, stateFile: invalidState }));
    } catch (e) {
      refusedInvalid = /not valid JSON/.test(e.message);
    }
    fs.unlinkSync(invalidState);

    record("init-watermarks: refuses when STATE.json is missing or invalid", refusedMissing && refusedInvalid, {
      refusedMissing,
      refusedInvalid,
    });
  } catch (e) {
    record("init-watermarks: refuses when STATE.json is missing or invalid", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 16: the DNS guard requires each answer set to equal EXACTLY
  // [REPLIT_IP] -- a mixed A-record set (e.g. mid-cutover, Replit's IP
  // alongside a newly-added one) must fail, not pass just because the
  // Replit IP is present somewhere in the set.
  // =========================================================================
  try {
    const mixed = await checkReplitDnsGuard({
      lookups: {
        google: async () => ["34.111.179.208", "1.2.3.4"],
        cloudflare: async () => ["34.111.179.208"],
        node: async () => ["34.111.179.208"],
      },
    });
    const clean = await checkReplitDnsGuard({
      lookups: {
        google: async () => ["34.111.179.208"],
        cloudflare: async () => ["34.111.179.208"],
        node: async () => ["34.111.179.208"],
      },
    });
    const ok = mixed.pass === false && clean.pass === true;
    record("DNS guard: a mixed A-record set is refused; an exact single-IP match passes", ok, { mixed, clean });
  } catch (e) {
    record("DNS guard: a mixed A-record set is refused; an exact single-IP match passes", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 17: init-watermarks must NOT initialize watermarks when verify
  // (after the copy) fails -- a failed verify blocks init rather than just
  // getting reported alongside a wrongly-initialized target. Runs fully
  // offline via injected DNS lookups (FAKE_DNS_ALL_REPLIT), so this scenario
  // is never skipped and always exercises the real refusal path.
  // =========================================================================
  try {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    const tmpState = path.join(os.tmpdir(), `selftest-state-failverify-${Date.now()}.json`);
    fs.writeFileSync(tmpState, JSON.stringify({ status: "IN_PROGRESS", facts: { cutover: { detectedAt: null } } }));

    await resetDatabases();
    await seedSrc([{ table: "blog_posts", id: 1, slug: "fv-1" }]);
    await runDelta(baseArgs());

    const c = client(DST_URL);
    await c.connect();
    await c.query(`update blog_posts set title = 'tampered-before-init' where id = 1`);
    await c.end();

    let refused = false;
    let message = "";
    try {
      await runInitWatermarks(baseArgs({ confirmPreCutover: true, stateFile: tmpState, gapStart: 5000 }), {
        lookups: FAKE_DNS_ALL_REPLIT,
      });
    } catch (e) {
      message = e.message;
      refused = /refusing to initialize watermarks/.test(e.message);
    }
    record("init-watermarks: a failed verify blocks watermark init", refused, { message });
    fs.unlinkSync(tmpState);
  } catch (e) {
    record("init-watermarks: a failed verify blocks watermark init", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 18: reverse-delta's second half (SPEC-03 §5) -- a blog_posts row
  // BELOW the gap that was edited directly on the target after cutover must
  // be backfilled to the source, not silently lost on rollback.
  // =========================================================================
  try {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    const tmpState = path.join(os.tmpdir(), `selftest-state-rollback-${Date.now()}.json`);
    const detectedAt = new Date(Date.now() - 2 * 3600 * 1000).toISOString(); // 2h ago
    fs.writeFileSync(tmpState, JSON.stringify({ status: "IN_PROGRESS", facts: { cutover: { detectedAt } } }));

    await resetDatabases();
    const old = new Date(Date.now() - 3 * 3600 * 1000); // 3h ago: before detectedAt
    await seedSrc([{ table: "blog_posts", id: 1, slug: "rb-1", createdAt: old, updatedAt: old }]);
    await runDelta(baseArgs({ gapStart: 1000 }));

    const dc = client(DST_URL);
    await dc.connect();
    await dc.query(`update blog_posts set title = 'Edited on target after cutover', updated_at = now() where id = 1`);
    await dc.end();

    process.env.ALLOW_SOURCE_WRITES = "1";
    const result = await runReverseDelta(baseArgs({ gapStart: 1000, dryRun: false, iUnderstand: true, stateFile: tmpState }));
    delete process.env.ALLOW_SOURCE_WRITES;

    const c = client(SRC_URL);
    await c.connect();
    const { rows } = await c.query(`select title from blog_posts where id = 1`);
    await c.end();

    const ok = result.blogBackfill?.updated === 1 && rows[0].title === "Edited on target after cutover";
    record("reverse-delta: a target-edited post below the gap is backfilled to the source", ok, {
      blogBackfill: result.blogBackfill,
      sourceTitle: rows[0].title,
    });
    fs.unlinkSync(tmpState);
  } catch (e) {
    record("reverse-delta: a target-edited post below the gap is backfilled to the source", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 19: connect()'s source-identity guard is not fooled by a pooled
  // alias, a differently-cased host, or DST_URL literally equal to
  // REPLIT_DATABASE_URL -- and a readOnly source session actually rejects a
  // write at the Postgres level, not just at this module's own guard.
  // =========================================================================
  try {
    const savedEnv = {
      SRC_URL: process.env.SRC_URL,
      DST_URL: process.env.DST_URL,
      DST_URL_UNPOOLED: process.env.DST_URL_UNPOOLED,
      REPLIT_DATABASE_URL: process.env.REPLIT_DATABASE_URL,
    };
    const restoreEnv = () => {
      for (const [k, v] of Object.entries(savedEnv)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    };

    let identityHelperOk = false;
    let poolerRefused = false;
    let caseRefused = false;
    let replitMatchRefused = false;
    let distinctAllowed = false;

    try {
      identityHelperOk =
        connectionIdentity("postgresql://ep-foo-pooler.us-east-2.aws.neon.tech:5432/db?sslmode=require") ===
          connectionIdentity("postgresql://EP-FOO.us-east-2.AWS.NEON.TECH/db") &&
        connectionIdentity("postgresql://host.example.com/db") !== connectionIdentity("postgresql://other.example.com/db");

      // Pooler variant: DST_URL is the "-pooler" alias of SRC_URL's host.
      process.env.SRC_URL = "postgresql://ep-foo.us-east-2.aws.neon.tech/db";
      process.env.DST_URL = "postgresql://ep-foo-pooler.us-east-2.aws.neon.tech/db";
      delete process.env.DST_URL_UNPOOLED;
      delete process.env.REPLIT_DATABASE_URL;
      try {
        await connect("DST_URL", { readOnly: false });
      } catch (e) {
        poolerRefused = /refusing a writable session against the source/.test(e.message);
      }

      // Case variant: same host, different letter case.
      process.env.SRC_URL = "postgresql://ep-foo.us-east-2.aws.neon.tech/db";
      process.env.DST_URL = "postgresql://EP-FOO.US-EAST-2.AWS.NEON.TECH/db";
      try {
        await connect("DST_URL", { readOnly: false });
      } catch (e) {
        caseRefused = /refusing a writable session against the source/.test(e.message);
      }

      // DST_URL literally equal to REPLIT_DATABASE_URL (source referenced by
      // value, not by the env var name "SRC_URL"/"REPLIT_DATABASE_URL").
      delete process.env.SRC_URL;
      process.env.REPLIT_DATABASE_URL = "postgresql://replit-host.example.com/db";
      process.env.DST_URL = "postgresql://replit-host.example.com/db";
      try {
        await connect("DST_URL", { readOnly: false });
      } catch (e) {
        replitMatchRefused = /refusing a writable session against the source/.test(e.message);
      }

      // Sanity: a genuinely distinct DST_URL must NOT be refused. Uses
      // container-tcp (pg.Pool), which -- unlike neon-https's `neon()` --
      // doesn't eagerly validate the connection string's shape, so a
      // credential-free placeholder host is enough; nothing is actually
      // dialed since this only checks the guard let the call through.
      process.env.DST_URL = "postgresql://totally-different-host.example.com/db";
      try {
        const conn = await connect("DST_URL", { readOnly: false, transport: "container-tcp" });
        distinctAllowed = conn.transport === "container-tcp";
        await conn.end();
      } catch {
        distinctAllowed = false;
      }
    } finally {
      restoreEnv();
    }

    // A readOnly session against the REAL throwaway source actually rejects a
    // write at the Postgres level (SPEC-03 §0.1), not just at this module's
    // own pre-connect guard.
    let readOnlyWriteRejected = false;
    process.env.SRC_URL = SRC_URL;
    try {
      const roConn = await connect("SRC_URL", { readOnly: true, transport: "container-tcp" });
      try {
        await roConn.query(`insert into blog_redirects (old_path, new_path) values ('/ro-test', '/ro-test-new')`);
      } catch (e) {
        readOnlyWriteRejected = /read-only/i.test(e.message);
      } finally {
        await roConn.end();
      }
    } finally {
      delete process.env.SRC_URL;
    }

    const ok = identityHelperOk && poolerRefused && caseRefused && replitMatchRefused && distinctAllowed && readOnlyWriteRejected;
    record(
      "connect(): pooler/case/REPLIT_DATABASE_URL identity bypass is refused; readOnly source session rejects writes",
      ok,
      { identityHelperOk, poolerRefused, caseRefused, replitMatchRefused, distinctAllowed, readOnlyWriteRejected }
    );
  } catch (e) {
    record(
      "connect(): pooler/case/REPLIT_DATABASE_URL identity bypass is refused; readOnly source session rejects writes",
      false,
      String(e.stack || e)
    );
  }

  // =========================================================================
  // Scenario 20: a re-run after a mid-run crash. demo_requests has no
  // natural key, so `on conflict do nothing` firing on the primary key alone
  // (the row was already inserted by an earlier attempt that crashed before
  // logging) must be reported as "already synced", not as a spurious
  // keyConflict with targetId: null.
  // =========================================================================
  try {
    await resetDatabases();
    await seedSrc([{ table: "demo_requests", id: 1, email: "crash@example.com" }]);
    // Simulate the crashed run: the row already made it onto the target by
    // id, but the process died before setWatermark/writeSyncLog ran, so the
    // watermark is still 0 and demo_requests looks un-synced from here.
    await seedDstDirect(
      "demo_requests",
      ["id", "first_name", "last_name", "email", "company", "company_size", "modules", "created_at"],
      [1, "Jane", "Doe", "crash@example.com", "Acme", "50-200", ["crm"], new Date()]
    );
    const d20 = await runDelta(baseArgs());
    const t = d20.tables.find((x) => x.table === "demo_requests");
    const ok =
      t.keyConflicts === 0 &&
      t.conflictPairs.length === 0 &&
      t.inserted === 0 &&
      (await countRows(DST_URL, "demo_requests")) === 1; // no duplicate, no spurious conflict
    record("delta: a re-run after a mid-run crash reports already-synced, not a spurious key conflict", ok, t);
  } catch (e) {
    record(
      "delta: a re-run after a mid-run crash reports already-synced, not a spurious key conflict",
      false,
      String(e.stack || e)
    );
  }

  // =========================================================================
  // Scenario 21: blog_posts edits on a row reconciled by natural key (source
  // id differs from target id, per scenario 3's conflict-reconciliation
  // path) must still propagate to the target, not be silently dropped just
  // because the ids differ.
  // =========================================================================
  try {
    await resetDatabases();
    const old = new Date(Date.now() - 6 * 3600 * 1000);
    // Target already has a row with the same slug under a DIFFERENT id (as
    // if it were created directly on the target pre-migration, or restored
    // under a different id sequence).
    await seedDstDirect(
      "blog_posts",
      ["id", "slug", "title", "category", "date", "author", "excerpt", "published", "created_at", "updated_at"],
      [500, "nk-edit", "Original title", "Eng", "2026-01-01", "Editor", "excerpt", true, old, old]
    );
    await seedSrc([{ table: "blog_posts", id: 1, slug: "nk-edit", title: "Original title", createdAt: old, updatedAt: old }]);
    const d21a = await runDelta(baseArgs());
    const reconciled = d21a.tables.find((x) => x.table === "blog_posts").keyConflicts === 1;

    // Now edit the SOURCE row (newer updated_at) and re-run delta: the edit
    // must reach the target row at id=500, even though the source's own id
    // (1) was never inserted (it was reconciled away).
    const c = client(SRC_URL);
    await c.connect();
    await c.query(`update blog_posts set title = 'Edited via natural-key reconciliation', updated_at = now() where id = 1`);
    await c.end();
    const d21b = await runDelta(baseArgs());
    const t = d21b.tables.find((x) => x.table === "blog_posts");

    const dc = client(DST_URL);
    await dc.connect();
    const { rows } = await dc.query(`select title from blog_posts where id = 500`);
    await dc.end();

    const ok = reconciled && t.updated === 1 && rows[0].title === "Edited via natural-key reconciliation";
    record("delta: a source edit on a natural-key-reconciled row propagates to the target's own id", ok, {
      reconciled,
      updated: t.updated,
      title: rows[0].title,
    });
  } catch (e) {
    record(
      "delta: a source edit on a natural-key-reconciled row propagates to the target's own id",
      false,
      String(e.stack || e)
    );
  }

  // =========================================================================
  // Scenario 22 (review r4 blocking): a source row that commits AFTER verify
  // (or after pg_dump's snapshot) but before watermark init was never copied.
  // init must not mark it synced / put the watermark past it; the next delta
  // must insert it (step 2 if its id is above every copied id, a late commit
  // if below), never report it as target_deleted.
  // =========================================================================
  try {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    const tmpState = path.join(os.tmpdir(), `selftest-state-initrace-${Date.now()}.json`);
    fs.writeFileSync(tmpState, JSON.stringify({ status: "IN_PROGRESS", facts: { cutover: { detectedAt: null } } }));

    // No pre-seeded sync_state: init itself must create every row.
    await resetDatabases({ initWatermarksAtZero: false });
    await seedSrc([
      { table: "blog_posts", id: 1, slug: "race-1" },
      { table: "newsletter_subscriptions", id: 1, email: "copied@example.com" },
      { table: "demo_requests", id: 1, email: "copied-1@example.com" },
      { table: "demo_requests", id: 3, email: "copied-3@example.com" },
    ]);
    await localCopy();

    // Signups landing on the live source after verify passed, before init:
    // newsletter id 2 (above every copied id) and demo_requests id 2 (below
    // the copied max 3, i.e. an id allocated earlier whose commit only
    // became visible now).
    const hooks = {
      afterVerify: async () => {
        await srcExec(
          `insert into newsletter_subscriptions (id, email, created_at) overriding system value values (2, 'race-high@example.com', now())`
        );
        await srcExec(
          `insert into demo_requests (id, first_name, last_name, email, company, company_size, modules, created_at)
           overriding system value values (2, 'Jane', 'Doe', 'race-low@example.com', 'Acme', '50-200', '{crm}', now())`
        );
      },
    };
    const init = await runInitWatermarks(baseArgs({ confirmPreCutover: true, stateFile: tmpState, gapStart: 5000 }), {
      lookups: FAKE_DNS_ALL_REPLIT,
      hooks,
    });
    const syncedAfterInit = await dstQuery(
      `select table_name, id::int as id from _migration.synced_ids where table_name in ('newsletter_subscriptions', 'demo_requests') order by 1, 2`
    );
    const raceIdsMarked = syncedAfterInit.some(
      (r) => (r.table_name === "newsletter_subscriptions" && r.id === 2) || (r.table_name === "demo_requests" && r.id === 2)
    );
    const initOk =
      init.verify.pass === true &&
      init.watermarks.newsletter_subscriptions === 1 &&
      init.watermarks.demo_requests === 3 &&
      !raceIdsMarked;

    const d = await runDelta(baseArgs({ gapStart: 5000 }));
    const nl = d.tables.find((x) => x.table === "newsletter_subscriptions");
    const dr = d.tables.find((x) => x.table === "demo_requests");
    const nlOnTarget = (await dstQuery(`select id from newsletter_subscriptions where id = 2`)).length === 1;
    const drOnTarget = (await dstQuery(`select id from demo_requests where id = 2`)).length === 1;
    const deltaOk =
      nl.inserted === 1 &&
      nl.targetDeleted === 0 &&
      dr.lateCommits === 1 &&
      dr.targetDeleted === 0 &&
      nlOnTarget &&
      drOnTarget;
    record("init-watermarks: a source row committed after verify, before init, is not lost (inserted by the next delta)", initOk && deltaOk, {
      initWatermarks: init.watermarks,
      raceIdsMarked,
      newsletter: { inserted: nl.inserted, targetDeleted: nl.targetDeleted, onTarget: nlOnTarget },
      demoRequests: { lateCommits: dr.lateCommits, targetDeleted: dr.targetDeleted, onTarget: drOnTarget },
    });
    fs.unlinkSync(tmpState);
  } catch (e) {
    record(
      "init-watermarks: a source row committed after verify, before init, is not lost (inserted by the next delta)",
      false,
      String(e.stack || e)
    );
  }

  // =========================================================================
  // Scenario 23 (r4 non-blocking 1): delta crashes after step 2 inserted rows
  // but before step 6 advanced the watermark; an editor then deletes one of
  // those rows on the target. The re-run must NOT re-insert it just because
  // its id is still above the (unadvanced) watermark.
  // =========================================================================
  try {
    await resetDatabases();
    await seedSrc([
      { table: "newsletter_subscriptions", id: 1, email: "c1@example.com" },
      { table: "newsletter_subscriptions", id: 2, email: "c2@example.com" },
      { table: "newsletter_subscriptions", id: 3, email: "c3@example.com" },
    ]);
    let crashed = false;
    try {
      await runDelta(baseArgs(), {
        hooks: {
          beforeAdvanceWatermark: async (table) => {
            if (table === "newsletter_subscriptions") throw new Error("simulated crash before step 6");
          },
        },
      });
    } catch (e) {
      crashed = /simulated crash/.test(e.message);
    }
    const wmAfterCrash = (await dstQuery(`select watermark::int as w from _migration.sync_state where table_name = 'newsletter_subscriptions'`))[0].w;
    const rowsAfterCrash = await countRows(DST_URL, "newsletter_subscriptions");
    await deleteFromDst("newsletter_subscriptions", 2);
    const d = await runDelta(baseArgs());
    const t = d.tables.find((x) => x.table === "newsletter_subscriptions");
    const ok =
      crashed &&
      wmAfterCrash === 0 &&
      rowsAfterCrash === 3 &&
      t.inserted === 0 &&
      t.lateCommits === 0 &&
      t.targetDeleted === 1 &&
      t.targetDeletedIds.map(String).includes("2") &&
      (await countRows(DST_URL, "newsletter_subscriptions")) === 2;
    record("delta: after a crash before step 6, a row deleted on the target is not re-inserted on re-run", ok, {
      crashed,
      wmAfterCrash,
      rowsAfterCrash,
      rerun: t,
    });
  } catch (e) {
    record("delta: after a crash before step 6, a row deleted on the target is not re-inserted on re-run", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 24 (r4 non-blocking 2): a source row reconciled by natural key
  // onto a target twin; the twin is later deleted on the target. The source
  // row must be reported as target_deleted, not inserted as a "late commit".
  // =========================================================================
  try {
    await resetDatabases();
    await seedDstDirect("newsletter_subscriptions", ["id", "email", "created_at"], [999, "twin@example.com", new Date()]);
    await seedSrc([{ table: "newsletter_subscriptions", id: 1, email: "twin@example.com" }]);
    const d1 = await runDelta(baseArgs());
    const t1 = d1.tables.find((x) => x.table === "newsletter_subscriptions");
    const reconciled = t1.keyConflicts === 1 && String(t1.conflictPairs[0]?.targetId) === "999";
    await deleteFromDst("newsletter_subscriptions", 999);
    const d2 = await runDelta(baseArgs());
    const t2 = d2.tables.find((x) => x.table === "newsletter_subscriptions");
    const ok =
      reconciled &&
      t2.lateCommits === 0 &&
      t2.inserted === 0 &&
      t2.targetDeleted === 1 &&
      t2.targetDeletedIds.map(String).includes("1") &&
      (await countRows(DST_URL, "newsletter_subscriptions")) === 0;
    record("delta: a key-reconciled source row whose target twin is deleted is not resurrected as a late commit", ok, {
      first: { keyConflicts: t1.keyConflicts, conflictPairs: t1.conflictPairs },
      second: t2,
    });
  } catch (e) {
    record(
      "delta: a key-reconciled source row whose target twin is deleted is not resurrected as a late commit",
      false,
      String(e.stack || e)
    );
  }

  // =========================================================================
  // Scenario 25 (r4 non-blocking 3a): the target insert and its synced_ids
  // bookkeeping are atomic. A failure recording synced_ids (forced by a
  // trigger) must roll back the data row too, never leave a row on the
  // target that delta doesn't know it synced.
  // =========================================================================
  try {
    await resetDatabases();
    await seedSrc([
      { table: "demo_requests", id: 1, email: "atomic-1@example.com" },
      { table: "demo_requests", id: 2, email: "atomic-2@example.com" },
    ]);
    const conn = await connect("MIGTEST_DST_URL", { readOnly: false, transport: "container-tcp" });
    try {
      await ensureMigrationSchema(conn);
    } finally {
      await conn.end();
    }
    await dstQuery(`create or replace function _migration.selftest_fail_mark() returns trigger language plpgsql as $$
      begin
        if new.table_name = 'demo_requests' and new.id = 2 then raise exception 'selftest: synced_ids write failed'; end if;
        return new;
      end $$`);
    await dstQuery(
      `create trigger selftest_fail_mark before insert on _migration.synced_ids for each row execute function _migration.selftest_fail_mark()`
    );
    let failed = false;
    try {
      await runDelta(baseArgs());
    } catch (e) {
      failed = /synced_ids write failed/.test(e.message);
    }
    const id1Present = (await dstQuery(`select 1 from demo_requests where id = 1`)).length === 1;
    const id2Present = (await dstQuery(`select 1 from demo_requests where id = 2`)).length === 1;
    const id1Marked = (await dstQuery(`select 1 from _migration.synced_ids where table_name = 'demo_requests' and id = 1`)).length === 1;
    await dstQuery(`drop trigger selftest_fail_mark on _migration.synced_ids`);
    const d = await runDelta(baseArgs());
    const t = d.tables.find((x) => x.table === "demo_requests");
    const ok = failed && id1Present && id1Marked && !id2Present && t.inserted === 1 && (await countRows(DST_URL, "demo_requests")) === 2;
    record("delta: a target insert and its synced_ids record commit or roll back together", ok, {
      failed,
      id1Present,
      id1Marked,
      id2PresentAfterFailedMark: id2Present,
      rerunInserted: t.inserted,
    });
  } catch (e) {
    record("delta: a target insert and its synced_ids record commit or roll back together", false, String(e.stack || e));
  }

  // =========================================================================
  // Scenario 26 (r4 non-blocking 3b): the watermark advance and its sync_log
  // row are one transaction. A failing sync_log write must leave the
  // watermark where it was.
  // =========================================================================
  try {
    await resetDatabases();
    await seedSrc([{ table: "demo_requests", id: 1, email: "log-1@example.com" }]);
    await dstQuery(`create or replace function _migration.selftest_fail_log() returns trigger language plpgsql as $$
      begin
        if new.table_name = 'demo_requests' then raise exception 'selftest: sync_log write failed'; end if;
        return new;
      end $$`);
    await dstQuery(
      `create trigger selftest_fail_log before insert on _migration.sync_log for each row execute function _migration.selftest_fail_log()`
    );
    let failed = false;
    try {
      await runDelta(baseArgs());
    } catch (e) {
      failed = /sync_log write failed/.test(e.message);
    }
    const wmAfterFail = (await dstQuery(`select watermark::int as w from _migration.sync_state where table_name = 'demo_requests'`))[0].w;
    await dstQuery(`drop trigger selftest_fail_log on _migration.sync_log`);
    const d = await runDelta(baseArgs());
    const t = d.tables.find((x) => x.table === "demo_requests");
    const wmAfterRerun = (await dstQuery(`select watermark::int as w from _migration.sync_state where table_name = 'demo_requests'`))[0].w;
    const logRows = (await dstQuery(`select count(*)::int as n from _migration.sync_log where table_name = 'demo_requests'`))[0].n;
    const ok =
      failed &&
      wmAfterFail === 0 &&
      wmAfterRerun === 1 &&
      logRows === 1 &&
      t.inserted === 0 &&
      t.targetDeleted === 0 &&
      (await countRows(DST_URL, "demo_requests")) === 1;
    record("delta: the watermark advance and its sync_log row commit or roll back together", ok, {
      failed,
      wmAfterFail,
      wmAfterRerun,
      logRows,
      rerun: { inserted: t.inserted, targetDeleted: t.targetDeleted },
    });
  } catch (e) {
    record("delta: the watermark advance and its sync_log row commit or roll back together", false, String(e.stack || e));
  }

  // `ok` must be strictly `true` for every scenario: a skip recorded as
  // `null` (see `record` above) fails the run just like an explicit `false`,
  // so a scenario that can't be exercised is never mistaken for one that
  // passed.
  const allPass = results.every((r) => r.ok === true);
  const out = {
    checkedAt: new Date().toISOString(),
    note: "Self-test against a throwaway local PostgreSQL 16 (migtest_src/migtest_dst), never the real source or Neon.",
    allPass,
    scenarios: results,
  };
  const json = JSON.stringify(out, null, 2);
  process.stdout.write(json + "\n");

  const outIdx = process.argv.indexOf("--out");
  if (outIdx !== -1) writeFileSync(process.argv[outIdx + 1], json);

  process.exitCode = allPass ? 0 : 1;
}

main().catch((e) => {
  console.error(maskUrl(e?.stack || String(e)));
  process.exitCode = 1;
});
