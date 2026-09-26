#!/usr/bin/env node
// scripts/migration/db/sync.mjs
//
// Sync modes (SPEC-03 §5): verify, full-refresh, gap, delta, reverse-delta.
// Sync bookkeeping lives in the TARGET, in schema `_migration`
// (sync_state, sync_log), so it survives container loss and is atomic with
// the data.
//
// Usage:
//   node sync.mjs verify [--below-gap N] [--exclude-target-newer]
//   node sync.mjs full-refresh --confirm-pre-cutover [--gap-start N]   (local/self-test only: needs a copyFn)
//   node sync.mjs init-watermarks --confirm-pre-cutover [--gap-start N]  (real path: run the copy via
//                                                                          runner.mjs pg_dump/pg_restore first)
//   node sync.mjs gap [--gap-start N]
//   node sync.mjs delta [--gap-start N]     (refuses if any table has no _migration.sync_state row)
//   node sync.mjs reverse-delta [--dry-run] [--i-understand-this-writes-to-replit]
//
// All modes take --src-env (default SRC_URL), --dst-env (default DST_URL),
// --src-transport / --dst-transport (default neon-https), --out <file>.
//
// Invariants enforced here (SPEC-03 §0):
//  - The source is opened read-only for every mode except reverse-delta,
//    which additionally requires ALLOW_SOURCE_WRITES=1 and
//    --i-understand-this-writes-to-replit (an owner-requested rollback only).
//  - A sequence is never moved backwards.
//  - Rows deleted on the target are never resurrected by `delta`.
//  - Connection strings are never printed.

// Callers using the neon-https transport must invoke this script with
// NODE_USE_ENV_PROXY=1 set as a real environment variable BEFORE the node
// process starts (SPEC-03 §1): undici's env-proxy support is read once at
// startup, so setting process.env here would be too late.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns/promises";
import { connect, discoverTables, maskUrl, orderColumn, SESSION_SQL } from "./lib.mjs";

const KNOWN_TABLE_ORDER = ["blog_redirects", "blog_posts", "newsletter_subscriptions", "demo_requests"];

// docs/migration/STATE.json is a repo-relative path by convention. Resolve it
// against the repo root (not process.cwd()), so the STATE guard below still
// applies when this script is invoked from scripts/migration/, from inside
// the Sandbox, or from any other working directory.
const DB_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(DB_DIR, "../../..");

function parseArgs(argv) {
  const mode = argv[0];
  const args = {
    mode,
    srcEnv: process.env.SRC_URL ? "SRC_URL" : "REPLIT_DATABASE_URL",
    dstEnv: "DST_URL",
    srcTransport: "neon-https",
    dstTransport: "neon-https",
    out: null,
    belowGap: null,
    excludeTargetNewer: false,
    confirmPreCutover: false,
    gapStart: null,
    dryRun: false,
    iUnderstand: false,
    stateFile: "docs/migration/STATE.json",
  };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--src-env") args.srcEnv = argv[++i];
    else if (a === "--dst-env") args.dstEnv = argv[++i];
    else if (a === "--src-transport") args.srcTransport = argv[++i];
    else if (a === "--dst-transport") args.dstTransport = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--below-gap") args.belowGap = Number(argv[++i]);
    else if (a === "--exclude-target-newer") args.excludeTargetNewer = true;
    else if (a === "--confirm-pre-cutover") args.confirmPreCutover = true;
    else if (a === "--gap-start") args.gapStart = Number(argv[++i]);
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--i-understand-this-writes-to-replit") args.iUnderstand = true;
    else if (a === "--state-file") args.stateFile = argv[++i];
  }
  return args;
}

function resolveStatePath(stateFile) {
  return path.isAbsolute(stateFile) ? stateFile : path.join(REPO_ROOT, stateFile);
}

/** Returns null if STATE.json doesn't exist; throws if it exists but isn't
 * readable/valid JSON (never silently treated as "no guard needed"). */
function readState(stateFile) {
  const resolved = resolveStatePath(stateFile);
  if (!existsSync(resolved)) return null;
  let raw;
  try {
    raw = readFileSync(resolved, "utf8");
  } catch (e) {
    throw new Error(`STATE.json at ${resolved} exists but could not be read: ${e.message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`STATE.json at ${resolved} is not valid JSON: ${e.message}`);
  }
}

function resolveGapStart(args) {
  if (args.gapStart != null) return args.gapStart;
  const state = readState(args.stateFile);
  const g = state?.sync?.gapStart;
  if (g == null) throw new Error("GAP_START is not known: pass --gap-start N or set sync.gapStart in STATE.json");
  return g;
}

// ---------------------------------------------------------------------------
// _migration bookkeeping (lives in the target)
// ---------------------------------------------------------------------------

async function ensureMigrationSchema(dst) {
  await dst.query(`create schema if not exists _migration`);
  await dst.query(`
    create table if not exists _migration.sync_state (
      table_name text primary key,
      watermark bigint not null,
      last_run_at timestamptz not null
    )`);
  await dst.query(`
    create table if not exists _migration.sync_log (
      run_at timestamptz not null default now(),
      table_name text not null,
      inserted int not null default 0,
      updated int not null default 0,
      key_conflicts int not null default 0,
      target_deleted int not null default 0,
      late_commits int not null default 0
    )`);
  // Every id delta has ever inserted into the target (recorded in the same
  // statement as the insert), reconciled onto a target twin by natural key,
  // or that was already on the TARGET below the gap when
  // init-watermarks/full-refresh set the initial watermark (SPEC-03 §5 step
  // 3/4). This is what lets `delta` tell a true late commit
  // (an id it has genuinely never synced before) apart from a row it DID
  // sync earlier that an editor then deleted on the target -- without this,
  // both look identical ("missing on target, id <= watermark") and the
  // late-commit heuristic alone would resurrect the deleted row (SPEC-03 §5
  // step 4: "Never re-insert them").
  await dst.query(`
    create table if not exists _migration.synced_ids (
      table_name text not null,
      id bigint not null,
      primary key (table_name, id)
    )`);
}

async function markSynced(dst, table, ids) {
  if (ids.length === 0) return;
  const values = ids.map((_, i) => `($1, $${i + 2})`).join(", ");
  await dst.query(
    `insert into _migration.synced_ids (table_name, id) values ${values} on conflict do nothing`,
    [table, ...ids]
  );
}

async function alreadySyncedIds(dst, table, ids) {
  if (ids.length === 0) return new Set();
  const { rows } = await dst.query(
    `select id from _migration.synced_ids where table_name = $1 and id = any($2::bigint[])`,
    [table, ids]
  );
  return new Set(rows.map((r) => String(r.id)));
}

/** `initialized: false` means there is no _migration.sync_state row for this
 * table yet -- callers must NOT treat that the same as "watermark is 0"
 * (that would make every existing source row look new and delta would
 * re-insert anything already deleted on the target). */
async function getWatermark(dst, table) {
  const { rows } = await dst.query(`select watermark, last_run_at from _migration.sync_state where table_name = $1`, [
    table,
  ]);
  if (rows.length === 0) return { initialized: false, watermark: 0, lastRunAt: new Date(0) };
  return { initialized: true, watermark: Number(rows[0].watermark), lastRunAt: new Date(rows[0].last_run_at) };
}

const SET_WATERMARK_SQL = `insert into _migration.sync_state (table_name, watermark, last_run_at) values ($1, $2, $3)
     on conflict (table_name) do update set
       watermark = greatest(_migration.sync_state.watermark, excluded.watermark),
       last_run_at = excluded.last_run_at`;

const WRITE_SYNC_LOG_SQL = `insert into _migration.sync_log (table_name, inserted, updated, key_conflicts, target_deleted, late_commits)
     values ($1, $2, $3, $4, $5, $6)`;

/** Advances the watermark (never backwards) and writes the sync_log row in ONE
 * transaction (`batch` is a single Postgres transaction on every transport,
 * including neon-https), so a crash can never leave an advanced watermark
 * without its log row or vice versa. */
async function advanceWatermarkAndLog(dst, { table, watermark, lastRunAt, inserted, updated, keyConflicts, targetDeleted, lateCommits }) {
  await dst.batch([
    { text: SET_WATERMARK_SQL, params: [table, watermark, lastRunAt.toISOString()] },
    { text: WRITE_SYNC_LOG_SQL, params: [table, inserted, updated, keyConflicts, targetDeleted, lateCommits] },
  ]);
}

/** Initializes _migration.sync_state and _migration.synced_ids for every
 * public table from what is ACTUALLY ON THE TARGET below the gap after the
 * verified copy (SPEC-03 §4 step 2 / §5). Used by full-refresh and
 * init-watermarks.
 *
 * Why the target and not the source: Replit is still live and taking signups
 * while P4.2/P6.4 run. A source row that commits after pg_dump's snapshot (or
 * after verify fingerprinted its table) was never copied. Recording SOURCE ids
 * here would mark such a row synced with watermark >= its id, and the next
 * delta would then treat it as "deleted on the target" and never insert it
 * (SPEC-03 invariant (b): a lost lead/PII row). Using the target's own ids
 * means any source row the copy missed is either > w (inserted by delta step
 * 2) or <= w and NOT in synced_ids (inserted by delta as a late commit).
 *
 * Per table this is ONE statement (ids read, synced_ids filled and watermark
 * set atomically, server-side, with no id list shipped through parameters).
 * The target is quiescent below the gap here: gap has already run, so any
 * new target row gets id >= GAP_START and is excluded by the filter.
 *
 * @param {{gapStart: number}} opts
 * @returns {Promise<Record<string, number>>} the watermark now stored per table */
async function initWatermarksForTables(args, { gapStart }) {
  if (gapStart == null || !Number.isFinite(Number(gapStart))) {
    throw new Error("initWatermarksForTables: gapStart is required");
  }
  const dst = await connect(args.dstEnv, { readOnly: false, transport: args.dstTransport });
  const watermarks = {};
  try {
    await ensureMigrationSchema(dst);
    const now = new Date().toISOString();
    const tables = await discoverTables(dst);
    for (const t of orderTables(tables.map((x) => x.name))) {
      const table = tables.find((x) => x.name === t);
      const pk = orderColumn(table);
      const { rows } = await dst.query(
        `with ids as (
           select "${pk}"::bigint as id from "${t}" where "${pk}" < $2
         ), marked as (
           insert into _migration.synced_ids (table_name, id)
           select $1, id from ids
           on conflict do nothing
         ), st as (
           insert into _migration.sync_state (table_name, watermark, last_run_at)
           values ($1, (select coalesce(max(id), 0) from ids), $3)
           on conflict (table_name) do update set
             watermark = greatest(_migration.sync_state.watermark, excluded.watermark),
             last_run_at = excluded.last_run_at
           returning watermark
         )
         select watermark from st`,
        [t, gapStart, now]
      );
      watermarks[t] = Number(rows[0].watermark);
    }
  } finally {
    await dst.end();
  }
  return watermarks;
}

// ---------------------------------------------------------------------------
// Shared table ordering / metadata
// ---------------------------------------------------------------------------

function orderTables(tableNames) {
  const known = KNOWN_TABLE_ORDER.filter((t) => tableNames.includes(t));
  const extra = tableNames.filter((t) => !KNOWN_TABLE_ORDER.includes(t)).sort();
  return [...known, ...extra];
}

function firstNaturalKey(table) {
  return table.naturalKeys[0] ?? null;
}

function hasColumn(table, name) {
  return table.columns.some((c) => c.column_name === name);
}

// ---------------------------------------------------------------------------
// verify
// ---------------------------------------------------------------------------

async function fingerprintTable(conn, table, { belowGap } = {}) {
  const pk = orderColumn(table);
  const params = [];
  let where = "";
  if (belowGap != null) {
    where = `where "${pk}" < $1`;
    params.push(belowGap);
  }
  const hasUpdatedAt = hasColumn(table, "updated_at");
  const extraCol = hasUpdatedAt ? `, updated_at::text as updated_at` : "";
  const { rows } = await conn.query(
    `select "${pk}" as id, md5(t::text) as hash ${extraCol} from (select * from "${table.name}" ${where}) t order by "${pk}"`,
    params
  );
  const byId = new Map();
  for (const r of rows) byId.set(String(r.id), { hash: r.hash, updatedAt: r.updated_at ?? null });
  return byId;
}

async function naturalKeyValue(conn, tableName, pk, id, nkCols) {
  if (!nkCols) return null;
  const cols = nkCols.map((c) => `"${c}"`).join(", ");
  const { rows } = await conn.query(`select ${cols} from "${tableName}" where "${pk}" = $1`, [id]);
  if (rows.length === 0) return null;
  return nkCols.map((c) => rows[0][c]).join("␟");
}

async function naturalKeyIndex(conn, tableName, nkCols) {
  const map = new Map();
  if (!nkCols) return map;
  const cols = nkCols.map((c) => `"${c}"`).join(", ");
  const pkGuess = "id";
  const { rows } = await conn.query(`select "${pkGuess}" as id, ${cols} from "${tableName}"`);
  for (const r of rows) {
    const key = nkCols.map((c) => r[c]).join("␟");
    map.set(key, String(r.id));
  }
  return map;
}

async function verify(args) {
  const src = await connect(args.srcEnv, { readOnly: true, transport: args.srcTransport });
  // Always read-only: verify only ever reads both sides, regardless of
  // --exclude-target-newer (that flag changes comparison logic below, not
  // what access the connection needs).
  const dst = await connect(args.dstEnv, { readOnly: true, transport: args.dstTransport });
  try {
    const srcTables = await discoverTables(src);
    const dstTables = await discoverTables(dst);
    const srcNames = srcTables.map((t) => t.name);
    const dstNames = dstTables.map((t) => t.name);

    const report = {
      checkedAt: new Date().toISOString(),
      belowGap: args.belowGap,
      excludeTargetNewer: args.excludeTargetNewer,
      tableSetsEqual: JSON.stringify([...srcNames].sort()) === JSON.stringify([...dstNames].sort()),
      tables: {},
      mismatchCount: 0,
    };

    if (!report.tableSetsEqual) {
      report.tables._tableSetDiff = { src: srcNames, dst: dstNames };
      report.mismatchCount += 1;
    }

    for (const name of orderTables(srcNames.filter((n) => dstNames.includes(n)))) {
      const srcTable = srcTables.find((t) => t.name === name);
      const dstTable = dstTables.find((t) => t.name === name);
      const srcRows = await fingerprintTable(src, srcTable, { belowGap: args.belowGap });
      const dstRows = await fingerprintTable(dst, dstTable, { belowGap: args.belowGap });

      const nk = firstNaturalKey(srcTable);
      let dstNkIndex = null;

      let matched = 0;
      let targetNewer = 0;
      let keyReconciled = 0;
      let extraOnTarget = 0;
      const mismatches = [];
      // dst ids that were reconciled against a *different* source id via
      // natural key during the source-side loop below. These must not also
      // be flagged as "extra on target" in the target-side loop.
      const reconciledDstIds = new Set();

      for (const [id, srcInfo] of srcRows) {
        const dstInfo = dstRows.get(id);
        if (dstInfo && dstInfo.hash === srcInfo.hash) {
          matched++;
          continue;
        }
        if (dstInfo && args.excludeTargetNewer && name === "blog_posts" && dstInfo.updatedAt && srcInfo.updatedAt) {
          if (dstInfo.updatedAt > srcInfo.updatedAt) {
            targetNewer++;
            continue;
          }
        }
        if (!dstInfo && nk) {
          if (!dstNkIndex) dstNkIndex = await naturalKeyIndex(dst, name, nk);
          const nkVal = await naturalKeyValue(src, name, orderColumn(srcTable), id, nk);
          if (nkVal != null && dstNkIndex.has(nkVal)) {
            keyReconciled++;
            reconciledDstIds.add(dstNkIndex.get(nkVal));
            continue;
          }
        }
        mismatches.push({ id, reason: dstInfo ? "hash_differs" : "missing_on_target" });
      }

      // Target rows with no source counterpart by id (and not already
      // reconciled by natural key above) are extra rows on the target --
      // leftover test rows, duplicates, or junk below the gap. `verify` must
      // catch these: G4 requires "counts and md5 equal for every table", which
      // a source-only scan can't establish on its own.
      for (const [id] of dstRows) {
        if (srcRows.has(id)) continue; // handled above
        if (reconciledDstIds.has(id)) continue; // reconciled by natural key
        extraOnTarget++;
        mismatches.push({ id, reason: "extra_on_target" });
      }

      report.tables[name] = {
        srcCount: srcRows.size,
        dstCount: dstRows.size,
        countsEqual: srcRows.size === dstRows.size,
        matched,
        targetNewer,
        keyReconciled,
        extraOnTarget,
        mismatches: mismatches.slice(0, 50),
        mismatchCount: mismatches.length,
      };
      report.mismatchCount += mismatches.length;
    }

    report.pass = report.mismatchCount === 0;
    return report;
  } finally {
    await src.end();
    await dst.end();
  }
}

// ---------------------------------------------------------------------------
// gap
// ---------------------------------------------------------------------------

async function runGap(args) {
  const GAP_START = resolveGapStart(args);
  const dst = await connect(args.dstEnv, { readOnly: false, transport: args.dstTransport });
  try {
    const tables = await discoverTables(dst);
    const results = [];
    for (const t of tables) {
      const pkCol = t.primaryKey[0];
      if (!pkCol) continue;
      const { rows: defRows } = await dst.query(
        `select pg_get_serial_sequence($1, $2) as seq`,
        [t.name, pkCol]
      );
      const seq = defRows[0]?.seq;
      if (!seq) continue;
      const { rows } = await dst.query(`select last_value, is_called from ${seq}`);
      const nextVal = rows[0].is_called ? Number(rows[0].last_value) + 1 : Number(rows[0].last_value);
      if (nextVal < GAP_START) {
        await dst.query(`select setval($1, $2, false)`, [seq, GAP_START]);
        results.push({ table: t.name, sequence: seq, previousNext: nextVal, newNext: GAP_START, moved: true });
      } else {
        results.push({ table: t.name, sequence: seq, previousNext: nextVal, newNext: nextVal, moved: false });
      }
    }
    return { checkedAt: new Date().toISOString(), gapStart: GAP_START, sequences: results };
  } finally {
    await dst.end();
  }
}

// ---------------------------------------------------------------------------
// delta
// ---------------------------------------------------------------------------

async function rowToJson(conn, tableName, pkCol, id) {
  const { rows } = await conn.query(`select row_to_json(t) as data from (select * from "${tableName}" where "${pkCol}" = $1) t`, [
    id,
  ]);
  return rows[0]?.data ?? null;
}

async function insertViaJson(dst, tableName, pkCol, rowJson) {
  const { rowCount, rows } = await dst.query(
    `insert into "${tableName}" select * from json_populate_record(NULL::"${tableName}", $1::json)
     on conflict do nothing returning "${pkCol}"`,
    [JSON.stringify(rowJson)]
  );
  return { inserted: rowCount > 0, returnedId: rows[0]?.[pkCol] ?? null };
}

/** delta's target insert: inserts the row AND records its id in
 * _migration.synced_ids in ONE statement (a data-modifying CTE), so the data
 * write and its bookkeeping are atomic on every transport -- including
 * neon-https, where each query() is its own HTTP transaction. A crash can
 * never leave a row on the target that delta doesn't know it synced. */
async function insertAndMarkSynced(dst, tableName, pkCol, rowJson) {
  const { rowCount, rows } = await dst.query(
    `with ins as (
       insert into "${tableName}" select * from json_populate_record(NULL::"${tableName}", $1::json)
       on conflict do nothing returning "${pkCol}"
     ), marked as (
       insert into _migration.synced_ids (table_name, id)
       select $2, "${pkCol}"::bigint from ins
       on conflict do nothing
     )
     select "${pkCol}" from ins`,
    [JSON.stringify(rowJson), tableName]
  );
  return { inserted: rowCount > 0, returnedId: rows[0]?.[pkCol] ?? null };
}

/** Returns the actual rowCount affected, so callers count only rows that were
 * really updated rather than every attempt. */
async function updateFromJson(conn, tableName, pkCol, id, rowJson, columns) {
  const setCols = columns.filter((c) => c !== pkCol && c !== "created_at");
  const colList = setCols.map((c) => `"${c}"`).join(", ");
  const { rowCount } = await conn.query(
    `update "${tableName}" as tgt set (${colList}) =
       (select ${colList} from json_populate_record(NULL::"${tableName}", $1::json))
     where "${pkCol}" = $2`,
    [JSON.stringify(rowJson), id]
  );
  return rowCount;
}

async function findByNaturalKey(dst, tableName, pkCol, nkCols, rowJson) {
  if (!nkCols) return null;
  const whereParts = nkCols.map((c, i) => `"${c}" = $${i + 1}`);
  const params = nkCols.map((c) => rowJson[c]);
  const { rows } = await dst.query(`select "${pkCol}" as id from "${tableName}" where ${whereParts.join(" and ")}`, params);
  return rows[0]?.id ?? null;
}

async function runDeltaForTable(src, dst, srcTable, GAP_START, watermarkInfo, hooks = {}) {
  const name = srcTable.name;
  const pkCol = orderColumn(srcTable);
  const nk = firstNaturalKey(srcTable);
  const hasCreatedAt = hasColumn(srcTable, "created_at");
  const hasUpdatedAt = hasColumn(srcTable, "updated_at");
  const columns = srcTable.columns.map((c) => c.name ?? c.column_name);

  const { watermark: w } = watermarkInfo;

  let inserted = 0;
  let updated = 0;
  let keyConflicts = 0;
  let lateCommits = 0;
  let targetDeleted = 0;
  let sourceMissing = 0;
  let blogChanged = false;
  let newestSourceRowAt = null;
  const conflictPairs = [];
  const targetDeletedIds = [];
  // Every id read in step 2 below, in THIS run's own src snapshot -- step 6
  // advances the watermark only to the max of these, never to a fresh,
  // separately-queried max(id) (a row committed between step 2's read and a
  // later query would otherwise get silently skipped: the watermark would
  // already be past it, but step 2 never actually read or inserted it).
  let maxSeenId = w;

  // --- Step 2: new source rows (w < id < GAP_START) ---
  const { rows: newRows } = await src.query(
    `select "${pkCol}" as id from "${name}" where "${pkCol}" > $1 and "${pkCol}" < $2 order by "${pkCol}"`,
    [w, GAP_START]
  );
  // Ids above w that an EARLIER run already accounted for: a run that crashed
  // after inserting (insert and synced_ids are one atomic statement) but
  // before step 6 advanced the watermark. If such a row is now missing on the
  // target, an editor deleted it in between -- it must not be re-inserted just
  // because the watermark never moved past it (SPEC-03 §5 step 4).
  const syncedAboveW = await alreadySyncedIds(
    dst,
    name,
    newRows.map((r) => r.id)
  );
  for (const { id } of newRows) {
    if (Number(id) > maxSeenId) maxSeenId = Number(id);
    const rowJson = await rowToJson(src, name, pkCol, id);
    if (syncedAboveW.has(String(id))) {
      const { rows: onTarget } = await dst.query(`select "${pkCol}" as id from "${name}" where "${pkCol}" = $1`, [id]);
      if (onTarget.length > 0) continue; // already synced, still there
      const twinId = nk ? await findByNaturalKey(dst, name, pkCol, nk, rowJson) : null;
      if (twinId != null) {
        // reconciled by natural key in the crashed run; report the pair again
        keyConflicts++;
        conflictPairs.push({ sourceId: id, targetId: twinId });
        continue;
      }
      targetDeleted++;
      targetDeletedIds.push(id);
      continue;
    }
    const { inserted: didInsert } = await insertAndMarkSynced(dst, name, pkCol, rowJson);
    if (didInsert) {
      inserted++;
      if (name === "blog_posts") blogChanged = true;
    } else {
      // `on conflict do nothing` fires on ANY conflicting constraint. Check
      // the primary key itself first: a re-run after a mid-run crash (the
      // previous attempt inserted this id but the process died before
      // logging it) means the row is simply already there, not a genuine
      // conflict -- and for a table with no natural key, that's the only way
      // to tell the two apart (findByNaturalKey below would otherwise always
      // report `targetId: null` for a real conflict too).
      const { rows: existingById } = await dst.query(`select "${pkCol}" as id from "${name}" where "${pkCol}" = $1`, [id]);
      if (existingById.length > 0) {
        await markSynced(dst, name, [id]);
        continue;
      }
      const targetId = nk ? await findByNaturalKey(dst, name, pkCol, nk, rowJson) : null;
      keyConflicts++;
      conflictPairs.push({ sourceId: id, targetId });
      // SPEC-03 §5 step 2: the source row is now "reconciled by natural key",
      // i.e. accounted for. Record it as synced so that if its target twin is
      // later deleted by an editor, steps 3/4 report a target deletion instead
      // of inserting this source row as a "late commit". Only when the twin
      // was actually found: a conflict on some other constraint (targetId
      // null) is unresolved and stays unsynced for the operator to look at.
      if (targetId != null) await markSynced(dst, name, [id]);
    }
  }

  // --- Steps 3 & 4: rows with id <= w missing on the target ---
  if (w > 0) {
    const { rows: oldRows } = await src.query(
      `select "${pkCol}" as id from "${name}" where "${pkCol}" <= $1 and "${pkCol}" < $2 order by "${pkCol}"`,
      [w, GAP_START]
    );
    const missingIds = [];
    const missingRowJsonById = new Map();
    for (const row of oldRows) {
      const { rows: dstById } = await dst.query(`select "${pkCol}" as id from "${name}" where "${pkCol}" = $1`, [row.id]);
      if (dstById.length > 0) continue; // present by id: nothing to do

      const rowJson = await rowToJson(src, name, pkCol, row.id);
      const targetIdByNk = nk ? await findByNaturalKey(dst, name, pkCol, nk, rowJson) : null;
      if (targetIdByNk != null) continue; // present by natural key: already reconciled

      missingIds.push(row.id);
      missingRowJsonById.set(row.id, rowJson);
    }

    if (missingIds.length > 0) {
      // The ONLY signal for "was this ever synced before" is
      // _migration.synced_ids, populated at init time and on every insert
      // this function makes (SPEC-03 §5 steps 3/4): a missing id we've never
      // synced is a true late commit; a missing id we HAVE synced before was
      // deleted on the target and must never be resurrected.
      const synced = await alreadySyncedIds(dst, name, missingIds);
      for (const id of missingIds) {
        if (synced.has(String(id))) {
          targetDeleted++;
          targetDeletedIds.push(id);
          continue;
        }
        const rowJson = missingRowJsonById.get(id);
        const { inserted: didInsert } = await insertAndMarkSynced(dst, name, pkCol, rowJson);
        if (didInsert) {
          lateCommits++;
          if (name === "blog_posts") blogChanged = true;
        }
      }
    }
  }

  // --- Step 5: blog_posts edits (source newer wins) ---
  if (name === "blog_posts" && hasUpdatedAt) {
    const { rows: bothSides } = await src.query(
      `select s."${pkCol}" as id, s.updated_at::text as src_updated_at
       from "${name}" s where s."${pkCol}" < $1`,
      [GAP_START]
    );
    for (const row of bothSides) {
      let targetPk = row.id;
      let { rows: dstRow } = await dst.query(`select updated_at::text as updated_at from "${name}" where "${pkCol}" = $1`, [
        row.id,
      ]);
      if (dstRow.length === 0) {
        // Not on target by id -- if this source row was reconciled onto a
        // DIFFERENT target id via natural key (SPEC-03 §5 steps 2-4), its
        // edits must still propagate there rather than being silently
        // dropped just because the ids differ between source and target.
        if (!nk) continue;
        const rowJsonForNk = await rowToJson(src, name, pkCol, row.id);
        const targetIdByNk = await findByNaturalKey(dst, name, pkCol, nk, rowJsonForNk);
        if (targetIdByNk == null) continue; // genuinely not on target, or an unresolved key-conflict row
        targetPk = targetIdByNk;
        ({ rows: dstRow } = await dst.query(`select updated_at::text as updated_at from "${name}" where "${pkCol}" = $1`, [
          targetPk,
        ]));
        if (dstRow.length === 0) continue;
      }
      if (row.src_updated_at > dstRow[0].updated_at) {
        const rowJson = await rowToJson(src, name, pkCol, row.id);
        const rc = await updateFromJson(dst, name, pkCol, targetPk, rowJson, columns);
        if (rc > 0) {
          updated++;
          blogChanged = true;
        }
      }
      // else: target is newer (or equal) -- keep the target.
    }
  }

  // --- diagnostic: target rows below the gap with no source counterpart at all ---
  {
    const { rows: dstIds } = await dst.query(`select "${pkCol}" as id from "${name}" where "${pkCol}" < $1`, [GAP_START]);
    for (const { id } of dstIds) {
      const { rows: srcById } = await src.query(`select "${pkCol}" as id from "${name}" where "${pkCol}" = $1`, [id]);
      if (srcById.length > 0) continue;
      if (nk) {
        const dstRowJson = await rowToJson(dst, name, pkCol, id);
        const srcIdByNk = await findByNaturalKey(src, name, pkCol, nk, dstRowJson);
        if (srcIdByNk != null) continue;
      }
      sourceMissing++;
    }
  }

  // --- Step 6: advance the watermark (never backwards, never past what
  // step 2 actually read in this run's own snapshot) ---
  if (hooks?.beforeAdvanceWatermark) await hooks.beforeAdvanceWatermark(name);
  await advanceWatermarkAndLog(dst, {
    table: name,
    watermark: maxSeenId,
    lastRunAt: new Date(),
    inserted,
    updated,
    keyConflicts,
    targetDeleted,
    lateCommits,
  });

  if (hasCreatedAt) {
    const { rows: newestRows } = await src.query(`select max(created_at)::text as newest from "${name}"`);
    const newest = newestRows[0]?.newest ?? null;
    if (newest && (!newestSourceRowAt || newest > newestSourceRowAt)) newestSourceRowAt = newest;
  }

  return {
    table: name,
    inserted,
    updated,
    keyConflicts,
    lateCommits,
    targetDeleted,
    targetDeletedIds,
    sourceMissing,
    blogChanged,
    newestSourceRowAt,
    conflictPairs,
  };
}

/** @param {{hooks?: {beforeAdvanceWatermark?: (table: string) => Promise<void>}}} [deps] test-only fault
 * injection (selftest.mjs simulates a crash before step 6); the CLI never passes it. */
async function runDelta(args, { hooks } = {}) {
  const GAP_START = resolveGapStart(args);
  const src = await connect(args.srcEnv, { readOnly: true, transport: args.srcTransport });
  const dst = await connect(args.dstEnv, { readOnly: false, transport: args.dstTransport });
  try {
    await ensureMigrationSchema(dst);
    const srcTables = await discoverTables(src);
    const ordered = orderTables(srcTables.map((t) => t.name));

    // Pre-flight (SPEC-03 §5): delta is additive-only and must never guess a
    // starting point. Every table must already have a _migration.sync_state
    // row, written by full-refresh / init-watermarks right after the initial
    // copy. Without this check, an uninitialized table's watermark silently
    // defaults to 0 and every existing source row looks "new", which would
    // resurrect anything already deleted on the target.
    const watermarks = {};
    const uninitialized = [];
    for (const name of ordered) {
      const w = await getWatermark(dst, name);
      watermarks[name] = w;
      if (!w.initialized) uninitialized.push(name);
    }
    if (uninitialized.length > 0) {
      throw new Error(
        `delta refused: no _migration.sync_state row for [${uninitialized.join(", ")}]. ` +
          `Run full-refresh (or init-watermarks) after the initial copy before running delta.`
      );
    }

    const perTable = [];
    let blogChanged = false;
    let newestSourceRowAt = null;
    for (const name of ordered) {
      const table = srcTables.find((t) => t.name === name);
      const r = await runDeltaForTable(src, dst, table, GAP_START, watermarks[name], hooks);
      perTable.push(r);
      if (r.blogChanged) blogChanged = true;
      if (r.newestSourceRowAt && (!newestSourceRowAt || r.newestSourceRowAt > newestSourceRowAt)) {
        newestSourceRowAt = r.newestSourceRowAt;
      }
    }
    return {
      checkedAt: new Date().toISOString(),
      gapStart: GAP_START,
      blogChanged,
      newestSourceRowAt,
      tables: perTable,
    };
  } finally {
    await src.end();
    await dst.end();
  }
}

// ---------------------------------------------------------------------------
// full-refresh
// ---------------------------------------------------------------------------

async function dohLookup(host, doHUrl) {
  const url = `${doHUrl}?name=${host}&type=A`;
  const res = await fetch(url, { headers: { accept: "application/dns-json" } });
  if (!res.ok) throw new Error(`DoH ${doHUrl} returned ${res.status}`);
  const body = await res.json();
  return (body.Answer ?? []).filter((a) => a.type === 1).map((a) => a.data);
}

const REPLIT_IP = "34.111.179.208";

/**
 * @param {{lookups?: {google: () => Promise<string[]>, cloudflare: () => Promise<string[]>, node: () => Promise<string[]>}}} deps
 * Injectable lookups let selftest.mjs exercise the "mixed A-record set"
 * refusal deterministically, without depending on real DNS state.
 */
async function checkReplitDnsGuard({ lookups } = {}) {
  const host = "www.growmax.io";
  const doLookups = lookups ?? {
    google: () => dohLookup(host, "https://dns.google/resolve"),
    cloudflare: () => dohLookup(host, "https://cloudflare-dns.com/dns-query"),
    node: async () => (await dns.lookup(host, { all: true })).map((r) => r.address),
  };
  const [google, cloudflare, nodeIps] = await Promise.all([
    doLookups.google().catch((e) => ({ error: String(e) })),
    doLookups.cloudflare().catch((e) => ({ error: String(e) })),
    doLookups.node().catch((e) => ({ error: String(e) })),
  ]);
  // Every answer set must equal EXACTLY [REPLIT_IP]: a mixed A-record set
  // (e.g. the Replit IP alongside a newly-added Neon/Vercel IP mid-cutover)
  // must fail the guard, not silently pass because REPLIT_IP is merely present.
  const ok = (ips) => Array.isArray(ips) && ips.length === 1 && ips[0] === REPLIT_IP;
  const pass = ok(google) && ok(cloudflare) && ok(nodeIps);
  return { pass, google, cloudflare, node: nodeIps, expected: REPLIT_IP };
}

/** Guards shared by full-refresh and init-watermarks -- and by runner.mjs
 * before it runs a destructive pg_restore against the target directly (SPEC-03
 * §0.5/§4): --confirm-pre-cutover, the STATE guard (refuses if STATE.json is
 * missing/unreadable, or says POST_CUTOVER/ROLLED_BACK/cutover already
 * detected), and the DNS guard. `lookups` (same shape as
 * checkReplitDnsGuard's) lets callers -- selftest.mjs in particular -- run
 * this deterministically offline instead of depending on live DNS
 * reachability from wherever this process happens to execute. */
async function runPreCopyGuards(args, label, { lookups } = {}) {
  if (!args.confirmPreCutover) {
    throw new Error(`${label} requires --confirm-pre-cutover`);
  }
  const statePath = resolveStatePath(args.stateFile);
  // readState() throws on unreadable/invalid JSON; returns null only if the
  // file genuinely doesn't exist. Either way, no STATE.json means no guard,
  // so refuse rather than silently proceeding.
  let state;
  try {
    state = readState(args.stateFile);
  } catch (e) {
    throw new Error(`${label} refused: ${e.message}`);
  }
  if (!state) {
    throw new Error(`${label} refused: STATE.json not found at ${statePath} (refusing to run without it)`);
  }
  if (["POST_CUTOVER", "ROLLED_BACK", "COMPLETE"].includes(state.status)) {
    throw new Error(`${label} refused: STATE.status is ${state.status}`);
  }
  if (state.facts?.cutover?.detectedAt) {
    throw new Error(`${label} refused: facts.cutover.detectedAt is set (Neon is authoritative)`);
  }
  const dnsGuard = await checkReplitDnsGuard({ lookups });
  if (!dnsGuard.pass) {
    throw new Error(`${label} refused: www.growmax.io does not resolve to the Replit IP everywhere: ${JSON.stringify(dnsGuard)}`);
  }
  return { state, dnsGuard };
}

/** SPEC-03 §4 steps after the copy: gap -> verify -> initialize watermarks.
 * Never initializes watermarks when verify fails: a failed verify must block
 * init, not just get reported alongside a (wrongly) initialized target. */
async function runGapVerifyInit(args, { hooks } = {}) {
  const gapResult = await runGap(args);
  const verifyResult = await verify({ ...args, belowGap: gapResult.gapStart });
  if (!verifyResult.pass) {
    throw new Error(
      `refusing to initialize watermarks: verify failed after the copy (mismatchCount=${verifyResult.mismatchCount}). ` +
        `Diagnose and re-run the copy before initializing watermarks.`
    );
  }
  // Test-only seam: selftest.mjs commits a source row HERE to reproduce a
  // signup landing on the live source after verify, before init.
  if (hooks?.afterVerify) await hooks.afterVerify();

  // Watermarks and synced_ids come from the TARGET's own ids below the gap,
  // never from a (later, separately-read) source id list -- see
  // initWatermarksForTables for why that would lose rows.
  const watermarks = await initWatermarksForTables(args, { gapStart: gapResult.gapStart });

  return { gap: gapResult, verify: verifyResult, watermarks };
}

/** full-refresh: guards -> caller-supplied copy -> gap -> verify -> watermark
 * init. Real (non-test) runs go through runner.mjs pg_dump/pg_restore inside
 * the Sandbox (raw TCP 5432 is blocked from this container), so there is no
 * copyFn this script can run directly in production -- the operator runs the
 * copy via runner.mjs, then uses `init-watermarks` (below) instead of this
 * mode. `full-refresh` with a copyFn stays for local/self-test use with a
 * throwaway PG16 where a direct pg_dump/pg_restore copy is possible. */
async function runFullRefresh(args, { copyFn, lookups, hooks } = {}) {
  const { dnsGuard } = await runPreCopyGuards(args, "full-refresh", { lookups });
  if (!copyFn) {
    throw new Error(
      "full-refresh: no copy step provided (real runs go through runner.mjs pg_dump/pg_restore, §4; " +
        "after copying, run `sync.mjs init-watermarks --confirm-pre-cutover` instead of full-refresh)"
    );
  }
  await copyFn(args);
  const { gap, verify: verifyResult, watermarks } = await runGapVerifyInit(args, { hooks });
  return { checkedAt: new Date().toISOString(), dnsGuard, gap, verify: verifyResult, watermarks };
}

/** init-watermarks: same guards and gap/verify/init sequence as full-refresh,
 * but assumes the copy has ALREADY happened externally (via runner.mjs
 * pg_dump/pg_restore in the Sandbox). This is the real production path for
 * P4.2/P6.4: this container can't run pg_dump/pg_restore itself. */
async function runInitWatermarks(args, { lookups, hooks } = {}) {
  const { dnsGuard } = await runPreCopyGuards(args, "init-watermarks", { lookups });
  const { gap, verify: verifyResult, watermarks } = await runGapVerifyInit(args, { hooks });
  return { checkedAt: new Date().toISOString(), dnsGuard, gap, verify: verifyResult, watermarks };
}

// ---------------------------------------------------------------------------
// reverse-delta (rollback only, SPEC-07 R2)
// ---------------------------------------------------------------------------

async function runReverseDelta(args) {
  const GAP_START = resolveGapStart(args);
  if (!args.dryRun) {
    if (!args.iUnderstand || process.env.ALLOW_SOURCE_WRITES !== "1") {
      throw new Error(
        "reverse-delta writes to the source and needs BOTH --i-understand-this-writes-to-replit and ALLOW_SOURCE_WRITES=1 (or --dry-run)"
      );
    }
  }
  const dst = await connect(args.dstEnv, { readOnly: true, transport: args.dstTransport });
  const src = await connect(args.srcEnv, {
    readOnly: args.dryRun,
    transport: args.srcTransport,
    allowSourceWrites: !args.dryRun,
  });
  try {
    // Read STATE up front and, for a real (non-dry-run) rollback, refuse
    // before any write happens: a rollback that can't confirm
    // facts.cutover.detectedAt must not silently skip the blog_posts
    // backfill later and still exit 0 after already having moved rows to
    // the source (that would look like a clean rollback while quietly
    // losing every post-cutover blog edit). --dry-run may still proceed and
    // report this as a soft "skipped", for inspection.
    let state;
    let stateReadError = null;
    try {
      state = readState(args.stateFile);
    } catch (e) {
      stateReadError = e.message;
      state = null;
    }
    const detectedAt = state?.facts?.cutover?.detectedAt;
    if (!args.dryRun && (stateReadError || !detectedAt)) {
      throw new Error(
        `reverse-delta refused: cannot confirm facts.cutover.detectedAt (${
          stateReadError ? `STATE.json unreadable: ${stateReadError}` : "not set in STATE.json"
        }). A non-dry-run rollback must not silently skip the blog_posts backfill. Pass --dry-run to inspect, or fix STATE.json first.`
      );
    }

    const dstTables = await discoverTables(dst);
    const plan = [];
    for (const t of orderTables(dstTables.map((x) => x.name))) {
      const table = dstTables.find((x) => x.name === t);
      const pk = orderColumn(table);
      const { rows } = await dst.query(`select "${pk}" as id from "${t}" where "${pk}" >= $1 order by "${pk}"`, [GAP_START]);
      let moved = 0;
      const conflicts = [];
      for (const { id } of rows) {
        const rowJson = await rowToJson(dst, t, pk, id);
        if (!args.dryRun) {
          const { inserted } = await insertViaJson(src, t, pk, rowJson);
          if (inserted) moved++;
          else conflicts.push(id);
        }
      }
      plan.push({ table: t, rowsAboveGap: rows.length, moved: args.dryRun ? 0 : moved, conflicts: args.dryRun ? [] : conflicts });
    }

    // SPEC-03 §5 second half: blog_posts rows BELOW the gap (id < GAP_START,
    // so already present pre-cutover on both sides) that were edited on the
    // target after cutover must also go back to the source. Without this, an
    // owner-requested rollback silently loses every post-cutover blog edit.
    // (state/stateReadError/detectedAt were already read above, before the
    // above-gap plan loop ran.)
    let blogBackfill = null;
    const blogTable = dstTables.find((x) => x.name === "blog_posts");
    if (!detectedAt) {
      blogBackfill = {
        skipped: true,
        reason: stateReadError ? `STATE.json unreadable: ${stateReadError}` : "facts.cutover.detectedAt is not set in STATE",
      };
    } else if (!blogTable || !hasColumn(blogTable, "updated_at")) {
      blogBackfill = { skipped: true, reason: "no blog_posts table with updated_at" };
    } else {
      const pk = orderColumn(blogTable);
      const columns = blogTable.columns.map((c) => c.name ?? c.column_name);
      // `updated_at` is a naive `timestamp without time zone` (treated as UTC
      // everywhere, per SPEC-03 §1); `detectedAt` from STATE.json is a real
      // ISO-8601/UTC string. Comparing their ::text forms directly (space- vs
      // T-separated, no/with a trailing Z) would never match, so compare as
      // Date values instead.
      const { rows: allBelowGap } = await dst.query(
        `select "${pk}" as id, updated_at::text as updated_at from "blog_posts" where "${pk}" < $1 order by "${pk}"`,
        [GAP_START]
      );
      const detectedAtMs = new Date(detectedAt).getTime();
      const afterCutover = allBelowGap.filter((row) => new Date(row.updated_at + "Z").getTime() > detectedAtMs);
      let updated = 0;
      const conflicts = [];
      for (const row of afterCutover) {
        const { rows: srcRow } = await src.query(`select updated_at::text as updated_at from "blog_posts" where "${pk}" = $1`, [
          row.id,
        ]);
        if (srcRow.length === 0) continue; // no source counterpart to update
        const srcUpdatedMs = new Date(srcRow[0].updated_at + "Z").getTime();
        if (!(new Date(row.updated_at + "Z").getTime() > srcUpdatedMs)) continue; // source already as new/newer
        if (args.dryRun) {
          updated++;
          continue;
        }
        const rowJson = await rowToJson(dst, "blog_posts", pk, row.id);
        const rc = await updateFromJson(src, "blog_posts", pk, row.id, rowJson, columns);
        if (rc > 0) updated++;
        else conflicts.push(row.id);
      }
      blogBackfill = { candidates: afterCutover.length, updated: args.dryRun ? 0 : updated, conflicts };
    }

    return { checkedAt: new Date().toISOString(), dryRun: args.dryRun, gapStart: GAP_START, plan, blogBackfill };
  } finally {
    await src.end();
    await dst.end();
  }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let out;
  try {
    switch (args.mode) {
      case "verify":
        out = await verify(args);
        break;
      case "gap":
        out = await runGap(args);
        break;
      case "delta":
        out = await runDelta(args);
        break;
      case "full-refresh":
        out = await runFullRefresh(args);
        break;
      case "init-watermarks":
        out = await runInitWatermarks(args);
        break;
      case "reverse-delta":
        out = await runReverseDelta(args);
        break;
      default:
        throw new Error(`Unknown mode: ${args.mode}. Use verify|full-refresh|init-watermarks|gap|delta|reverse-delta`);
    }
  } catch (err) {
    console.error(`[sync:${args.mode}] error:`, maskUrl(err?.message ?? String(err)));
    process.exitCode = 1;
    return;
  }

  const json = JSON.stringify(out, null, 2);
  if (args.out) writeFileSync(args.out, json);
  process.stdout.write(json + "\n");
  if (args.mode === "verify" && out && out.pass === false) process.exitCode = 1;
}

export {
  verify,
  runGap,
  runDelta,
  runFullRefresh,
  runInitWatermarks,
  runReverseDelta,
  ensureMigrationSchema,
  initWatermarksForTables,
  checkReplitDnsGuard,
  runPreCopyGuards,
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
