#!/usr/bin/env node
// scripts/migration/db/schema-diff.mjs
//
// Compares two inventory.mjs JSON snapshots, ignoring owner/ACL/comments,
// Neon-managed objects, and platform-managed schemas (SPEC-03 §1, §7 G4).
//
// NOT NULL is compared by semantics, not ignored: PG >= 18 (and any side that
// already carries pg_constraint contype='n' rows) has its `n` rows parsed and
// checked against each column's `nullable` flag; only rows that check out are
// then excluded from the generic constraint comparison. A PG major mismatch
// is a diff unless the caller passes --accept-pg-major <N> and the target
// (b) is exactly that major and is an upgrade over the source (a).
//
// Usage:
//   node schema-diff.mjs --a inventoryA.json --b inventoryB.json \
//     [--accept-pg-major N] [--out file]
//
// Exit code 0 if no differences, 1 if there are differences, 2 on a usage
// error, unreadable JSON, or JSON that isn't a real inventory (missing
// pgMajor/tables/etc. -- checked structurally before diffing, not just a
// parse error), or a failed --out write (message on stderr in every case).

import { readFileSync, writeFileSync } from "node:fs";

// Schemas that exist only because of the platform (Neon or Replit), not
// because of migrated application data. Ignored symmetrically on both sides.
const PLATFORM_MANAGED_SCHEMAS = new Set([
  "neon_auth", // Neon-managed auth schema; absent from the Replit source
  "_migration", // sync bookkeeping schema created on the target (SPEC-03 "Sync bookkeeping"); dropped at P9.2
  "_system", // Replit platform bookkeeping schema (replit_database_migrations_v1); source-only, outside pg_dump --schema=public (SPEC-03 §4)
]);
const NEON_MANAGED_ROLES = new Set([
  "neon_superuser",
  "neondb_owner",
  "authenticated",
  "anonymous",
  "authenticator",
  "service_role",
]);

// Strict parse of a pg_constraint contype='n' `def` string, e.g.
// `NOT NULL author` or `NOT NULL "weird col"`. Group 1 is the (possibly
// quoted) column identifier; group 2 is whatever follows it verbatim (empty
// for a plain NOT NULL, non-empty for something a PG16 schema can't express,
// like ` NOT VALID` or ` NO INHERIT`).
const NOT_NULL_DEF_RE = /^NOT NULL ("(?:[^"]|"")+"|[A-Za-z_][A-Za-z0-9_$]*)(.*)$/;

function unquoteIdent(raw) {
  if (raw.startsWith('"') && raw.endsWith('"') && raw.length >= 2) {
    return raw.slice(1, -1).replace(/""/g, '"');
  }
  return raw;
}

function parseArgs(argv) {
  const args = { a: null, b: null, out: null, acceptPgMajor: null };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--a") args.a = argv[++i];
    else if (t === "--b") args.b = argv[++i];
    else if (t === "--out") args.out = argv[++i];
    else if (t === "--accept-pg-major") {
      const raw = argv[++i];
      if (raw === undefined || !/^-?\d+$/.test(raw)) {
        throw new Error(`--accept-pg-major requires an integer argument, got ${JSON.stringify(raw)}`);
      }
      args.acceptPgMajor = Number(raw);
    }
  }
  if (!args.a || !args.b) throw new Error("--a inventoryA.json --b inventoryB.json are required");
  return args;
}

function load(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

// Validates that a parsed JSON value looks like an inventory.mjs snapshot
// before diffInventories() touches it. Valid JSON that isn't a real
// inventory (e.g. `{}` or `null`) must fail loudly with exit 2, not crash
// with an uncaught TypeError that main() would otherwise report as exit 1
// ("diffs found") -- see P4.3 attempt-2 review round 1, blocking finding.
// Returns an error message string, or null when the shape checks out.
function validateInventory(inv, label) {
  if (inv === null || typeof inv !== "object" || Array.isArray(inv)) {
    return `${label}: expected a JSON object, got ${Array.isArray(inv) ? "an array" : typeof inv}`;
  }
  if (!Number.isInteger(inv.pgMajor)) {
    return `${label}: pgMajor must be an integer, got ${JSON.stringify(inv.pgMajor)}`;
  }
  const arrayFields = ["extensions", "schemas", "constraints", "indexes", "sequences", "views", "functions", "triggers", "roles"];
  for (const field of arrayFields) {
    if (!Array.isArray(inv[field])) {
      return `${label}: ${field} must be an array, got ${JSON.stringify(inv[field])}`;
    }
  }
  if (inv.tables === null || typeof inv.tables !== "object" || Array.isArray(inv.tables)) {
    return `${label}: tables must be an object, got ${Array.isArray(inv.tables) ? "an array" : typeof inv.tables}`;
  }
  for (const [t, def] of Object.entries(inv.tables)) {
    if (def === null || typeof def !== "object" || Array.isArray(def)) {
      return `${label}: tables.${t} must be an object, got ${Array.isArray(def) ? "an array" : typeof def}`;
    }
    if (!Array.isArray(def.columns)) {
      return `${label}: tables.${t}.columns must be an array, got ${JSON.stringify(def.columns)}`;
    }
    if (!Array.isArray(def.primaryKey)) {
      return `${label}: tables.${t}.primaryKey must be an array, got ${JSON.stringify(def.primaryKey)}`;
    }
  }
  return null;
}

function normColumns(columns) {
  return columns
    .map((c) => `${c.name}:${c.type}:${c.nullable ? "null" : "notnull"}:${c.default ?? ""}`)
    .sort();
}

function diffArraysBy(a, b, keyFn, label, diffs, ignoreSchemas = true) {
  const filt = (arr) => (ignoreSchemas ? arr.filter((x) => !PLATFORM_MANAGED_SCHEMAS.has(x.schema)) : arr);
  const A = new Map(filt(a).map((x) => [keyFn(x), x]));
  const B = new Map(filt(b).map((x) => [keyFn(x), x]));
  for (const [k, v] of A) {
    if (!B.has(k)) diffs.push({ type: `${label}_missing_in_b`, key: k, a: v });
  }
  for (const [k, v] of B) {
    if (!A.has(k)) diffs.push({ type: `${label}_missing_in_a`, key: k, b: v });
  }
}

// Builds N_X: the set of `table.column` strings a side's pg_constraint
// contype='n' rows describe, per §A. Emits not_null_constraint_unparsed /
// not_null_constraint_nonstandard diffs along the way; an unparsable row
// contributes nothing to N_X (its column identifier isn't known), a
// nonstandard one still does (it is still a NOT NULL on that column).
function computeNotNullSet(inv, side, diffs) {
  const N = new Set();
  for (const c of inv.constraints) {
    if (c.type !== "n") continue;
    const m = NOT_NULL_DEF_RE.exec(c.def ?? "");
    if (!m) {
      diffs.push({ type: "not_null_constraint_unparsed", side, table: c.table, name: c.name, def: c.def });
      continue;
    }
    const column = unquoteIdent(m[1]);
    const remainder = m[2];
    if (remainder.length > 0) {
      diffs.push({ type: "not_null_constraint_nonstandard", side, table: c.table, column, remainder });
    }
    N.add(`${c.table}.${column}`);
  }
  return N;
}

// C_X: the set of `table.column` strings whose column has nullable === false.
function computeNullableFalseSet(inv) {
  const C = new Set();
  for (const [t, def] of Object.entries(inv.tables)) {
    for (const col of def.columns) {
      if (col.nullable === false) C.add(`${t}.${col.name}`);
    }
  }
  return C;
}

// Enforces N_X === C_X for one side, per §A, whenever that side is PG >= 18
// or already carries any 'n' rows at all (a PG16 side with none is exempt:
// it simply can't express NOT NULL as a constraint row).
function reconcileNotNull(inv, N, C, side, diffs) {
  if (!(inv.pgMajor >= 18 || N.size > 0)) return;
  for (const key of C) {
    if (!N.has(key)) diffs.push({ type: "not_null_constraint_missing", side, key });
  }
  for (const key of N) {
    if (!C.has(key)) diffs.push({ type: "not_null_constraint_orphan", side, key });
  }
}

export function diffInventories(a, b, opts = {}) {
  const diffs = [];
  const accepted = [];

  if (a.pgMajor !== b.pgMajor) {
    if (opts.acceptPgMajor != null && b.pgMajor === opts.acceptPgMajor && b.pgMajor > a.pgMajor) {
      accepted.push({ type: "pgMajor", a: a.pgMajor, b: b.pgMajor });
    } else {
      diffs.push({ type: "pgMajor", a: a.pgMajor, b: b.pgMajor });
    }
  }

  const extA = a.extensions.filter((e) => e.name !== "plpgsql");
  const extB = b.extensions.filter((e) => e.name !== "plpgsql");
  diffArraysBy(extA, extB, (e) => e.name, "extension", diffs, false);

  const ignoredSchemasA = a.schemas.filter((s) => PLATFORM_MANAGED_SCHEMAS.has(s)).sort();
  const ignoredSchemasB = b.schemas.filter((s) => PLATFORM_MANAGED_SCHEMAS.has(s)).sort();
  const schemasA = a.schemas.filter((s) => !PLATFORM_MANAGED_SCHEMAS.has(s));
  const schemasB = b.schemas.filter((s) => !PLATFORM_MANAGED_SCHEMAS.has(s));
  const schemaSetA = new Set(schemasA);
  const schemaSetB = new Set(schemasB);
  for (const s of schemaSetA) if (!schemaSetB.has(s)) diffs.push({ type: "schema_missing_in_b", key: s });
  for (const s of schemaSetB) if (!schemaSetA.has(s)) diffs.push({ type: "schema_missing_in_a", key: s });

  const tablesA = Object.keys(a.tables).sort();
  const tablesB = Object.keys(b.tables).sort();
  const tableSetA = new Set(tablesA);
  const tableSetB = new Set(tablesB);
  for (const t of tablesA) {
    if (!tableSetB.has(t)) {
      diffs.push({ type: "table_missing_in_b", key: t });
      continue;
    }
    const ta = a.tables[t];
    const tb = b.tables[t];
    const colsA = normColumns(ta.columns);
    const colsB = normColumns(tb.columns);
    if (JSON.stringify(colsA) !== JSON.stringify(colsB)) {
      diffs.push({ type: "table_columns_differ", key: t, a: colsA, b: colsB });
    }
    const pkA = [...ta.primaryKey].sort();
    const pkB = [...tb.primaryKey].sort();
    if (JSON.stringify(pkA) !== JSON.stringify(pkB)) {
      diffs.push({ type: "table_primary_key_differs", key: t, a: pkA, b: pkB });
    }
  }
  for (const t of tablesB) {
    if (!tableSetA.has(t)) diffs.push({ type: "table_missing_in_a", key: t });
  }

  // NOT NULL semantics (§A): build N_X/C_X per side, reconcile each side
  // against itself, then drop 'n' rows from the generic constraint diff
  // below so a version-only representation difference isn't reported twice.
  const N_A = computeNotNullSet(a, "a", diffs);
  const N_B = computeNotNullSet(b, "b", diffs);
  const C_A = computeNullableFalseSet(a);
  const C_B = computeNullableFalseSet(b);
  reconcileNotNull(a, N_A, C_A, "a", diffs);
  reconcileNotNull(b, N_B, C_B, "b", diffs);

  // Constraints: compare defs ignoring constraint name (names can differ across
  // dumps/restores) but matching on (table, type, def). 'n' rows are handled
  // above and excluded here.
  const constraintKey = (c) => `${c.table}::${c.type}::${c.def}`;
  diffArraysBy(
    a.constraints.filter((c) => c.type !== "n").map((c) => ({ ...c, schema: undefined })),
    b.constraints.filter((c) => c.type !== "n").map((c) => ({ ...c, schema: undefined })),
    constraintKey,
    "constraint",
    diffs,
    false
  );

  // Indexes: compare by def with the index name normalized out (Neon/pg_dump can
  // rename indexes deterministically but the definition should match).
  const indexDefKey = (i) => `${i.table}::${i.def.replace(/INDEX\s+\S+\s+ON/, "INDEX ON")}`;
  diffArraysBy(a.indexes, b.indexes, indexDefKey, "index", diffs, false);

  // Sequences: compare ownership only (values are expected to differ after a
  // fresh restore, pre-`gap`).
  const seqKey = (s) => `${s.name}::${s.ownedBy}`;
  diffArraysBy(a.sequences, b.sequences, seqKey, "sequence", diffs, false);

  diffArraysBy(a.views.map((v) => ({ name: v })), b.views.map((v) => ({ name: v })), (v) => v.name, "view", diffs, false);

  const fnKey = (f) => `${f.name}(${f.args})`;
  diffArraysBy(a.functions, b.functions, fnKey, "function", diffs, false);

  const trigKey = (t) => `${t.table}::${t.name}::${t.def}`;
  diffArraysBy(a.triggers, b.triggers, trigKey, "trigger", diffs, false);

  const rolesA = a.roles.filter((r) => !NEON_MANAGED_ROLES.has(r));
  const rolesB = b.roles.filter((r) => !NEON_MANAGED_ROLES.has(r));
  diffArraysBy(rolesA.map((r) => ({ name: r })), rolesB.map((r) => ({ name: r })), (r) => r.name, "role", diffs, false);

  return {
    diffs,
    accepted,
    ignored: { schemas: { a: ignoredSchemasA, b: ignoredSchemasB } },
    normalized: { notNullConstraints: { a: N_A.size, b: N_B.size } },
  };
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    process.stderr.write(`${e.message}\n`);
    process.exitCode = 2;
    return;
  }

  let a, b;
  try {
    a = load(args.a);
    b = load(args.b);
  } catch (e) {
    process.stderr.write(`failed to read/parse inventory file: ${e.message}\n`);
    process.exitCode = 2;
    return;
  }

  const invalidA = validateInventory(a, args.a);
  const invalidB = validateInventory(b, args.b);
  if (invalidA || invalidB) {
    process.stderr.write(`invalid inventory: ${invalidA ?? invalidB}\n`);
    process.exitCode = 2;
    return;
  }

  let diffs, accepted, ignored, normalized;
  try {
    ({ diffs, accepted, ignored, normalized } = diffInventories(a, b, { acceptPgMajor: args.acceptPgMajor }));
  } catch (e) {
    process.stderr.write(`schema-diff failed: ${e.stack || e.message}\n`);
    process.exitCode = 2;
    return;
  }

  const out = {
    checkedAt: new Date().toISOString(),
    a: args.a,
    b: args.b,
    empty: diffs.length === 0,
    diffCount: diffs.length,
    diffs,
    pgMajor: { a: a.pgMajor, b: b.pgMajor },
    accepted,
    ignored,
    normalized,
  };

  const json = JSON.stringify(out, null, 2);
  try {
    if (args.out) writeFileSync(args.out, json);
  } catch (e) {
    process.stderr.write(`failed to write --out file: ${e.message}\n`);
    process.exitCode = 2;
    return;
  }
  process.stdout.write(json + "\n");
  process.exitCode = diffs.length === 0 ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
