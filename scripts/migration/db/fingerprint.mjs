#!/usr/bin/env node
// scripts/migration/db/fingerprint.mjs
//
// Per-table count(*) and md5(string_agg(t::text, E'\n' ORDER BY pk)) (SPEC-03 §1, §3).
//
// Usage:
//   node fingerprint.mjs --db src|dst [--env SRC_URL] [--transport neon-https|container-tcp]
//                         [--below-gap N] [--rows] [--exclude-target-newer] [--out file]
//
// --below-gap N   only rows with id < N (used on the target once the gap exists)
// --rows          also emit {id: md5(t::text)} per row (bigger output; for diagnosis)
// --exclude-target-newer  (--db dst only) blog_posts rows where target updated_at is
//                          newer than watermark time are reported separately, not as
//                          part of the comparable hash (post-cutover verify).

// Callers using the neon-https transport must invoke this script with
// NODE_USE_ENV_PROXY=1 set as a real environment variable BEFORE the node
// process starts (SPEC-03 §1): undici's env-proxy support is read once at
// startup, so setting process.env here would be too late.

import { writeFileSync } from "node:fs";
import { connect, discoverTables, maskUrl, orderColumn } from "./lib.mjs";

function parseArgs(argv) {
  const args = {
    db: null,
    env: null,
    transport: "neon-https",
    out: null,
    belowGap: null,
    rows: false,
    excludeTargetNewer: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--db") args.db = argv[++i];
    else if (a === "--env") args.env = argv[++i];
    else if (a === "--transport") args.transport = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--below-gap") args.belowGap = Number(argv[++i]);
    else if (a === "--rows") args.rows = true;
    else if (a === "--exclude-target-newer") args.excludeTargetNewer = true;
  }
  if (!["src", "dst"].includes(args.db)) throw new Error("--db src|dst is required");
  if (!args.env) {
    args.env = args.db === "src" ? (process.env.SRC_URL ? "SRC_URL" : "REPLIT_DATABASE_URL") : "DST_URL";
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // fingerprint never writes to either side (src or dst): always open
  // read-only, not just for the source.
  const conn = await connect(args.env, { readOnly: true, transport: args.transport });

  try {
    const tables = await discoverTables(conn);
    const knownTables = new Set(["blog_posts", "blog_redirects", "demo_requests", "newsletter_subscriptions"]);

    const queries = tables.map((t) => {
      const pk = orderColumn(t);
      const whereClauses = [];
      const params = [];
      if (args.belowGap != null) {
        whereClauses.push(`"${pk}" < $${params.length + 1}`);
        params.push(args.belowGap);
      }
      const where = whereClauses.length ? `where ${whereClauses.join(" and ")}` : "";
      const text = `
        select count(*)::bigint as count,
               md5(coalesce(string_agg(t::text, E'\\n' order by "${pk}"), '')) as hash
        from (select * from "${t.name}" ${where}) t`;
      return { name: t.name, pk, text, params };
    });

    const results = await conn.batch(queries.map(({ text, params }) => ({ text, params })));

    const tables_out = {};
    for (let i = 0; i < tables.length; i++) {
      const t = tables[i];
      const r = results[i].rows[0];
      tables_out[t.name] = {
        count: Number(r.count),
        md5: r.hash,
      };
      if (args.rows) {
        const pk = queries[i].pk;
        const belowGapClause = args.belowGap != null ? `where "${pk}" < ${Number(args.belowGap)}` : "";
        const hasUpdatedAt = t.columns.some((c) => c.column_name === "updated_at");
        const extraCol = hasUpdatedAt ? `, updated_at::text as updated_at` : "";
        const rowsRes = await conn.query(
          `select "${pk}" as id, md5(t::text) as hash ${extraCol} from (select * from "${t.name}" ${belowGapClause}) t order by "${pk}"`
        );
        tables_out[t.name].rows = Object.fromEntries(
          rowsRes.rows.map((rr) => [
            String(rr.id),
            hasUpdatedAt ? { hash: rr.hash, updatedAt: rr.updated_at } : rr.hash,
          ])
        );
      }
    }

    const extraTables = tables.map((t) => t.name).filter((n) => !knownTables.has(n));

    const out = {
      checkedAt: new Date().toISOString(),
      db: args.db,
      envVar: args.env,
      transport: conn.transport,
      belowGap: args.belowGap,
      excludeTargetNewer: args.excludeTargetNewer,
      tables: tables_out,
      extraTables,
    };

    const json = JSON.stringify(out, null, 2);
    if (args.out) {
      writeFileSync(args.out, json);
      console.error(`[fingerprint] wrote ${args.out}`);
    }
    process.stdout.write(json + "\n");
  } catch (err) {
    console.error("[fingerprint] error:", maskUrl(err?.message ?? String(err)));
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

main();
