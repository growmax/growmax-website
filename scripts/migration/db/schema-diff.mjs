#!/usr/bin/env node
// scripts/migration/db/schema-diff.mjs
//
// Compares two inventory.mjs JSON snapshots, ignoring owner/ACL/comments,
// Neon-managed objects, and the `_migration` schema (SPEC-03 §1, §7 G4).
//
// Usage:
//   node schema-diff.mjs --a inventoryA.json --b inventoryB.json [--out file]
//
// Exit code 0 if no differences, 1 otherwise (so callers can gate on it).

import { readFileSync, writeFileSync } from "node:fs";

const NEON_MANAGED_SCHEMAS = new Set(["neon_auth", "_migration"]);
const NEON_MANAGED_ROLES = new Set([
  "neon_superuser",
  "neondb_owner",
  "authenticated",
  "anonymous",
  "authenticator",
  "service_role",
]);

function parseArgs(argv) {
  const args = { a: null, b: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--a") args.a = argv[++i];
    else if (t === "--b") args.b = argv[++i];
    else if (t === "--out") args.out = argv[++i];
  }
  if (!args.a || !args.b) throw new Error("--a inventoryA.json --b inventoryB.json are required");
  return args;
}

function load(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function normColumns(columns) {
  return columns
    .map((c) => `${c.name}:${c.type}:${c.nullable ? "null" : "notnull"}:${c.default ?? ""}`)
    .sort();
}

function diffArraysBy(a, b, keyFn, label, diffs, ignoreSchemas = true) {
  const filt = (arr) => (ignoreSchemas ? arr.filter((x) => !NEON_MANAGED_SCHEMAS.has(x.schema)) : arr);
  const A = new Map(filt(a).map((x) => [keyFn(x), x]));
  const B = new Map(filt(b).map((x) => [keyFn(x), x]));
  for (const [k, v] of A) {
    if (!B.has(k)) diffs.push({ type: `${label}_missing_in_b`, key: k, a: v });
  }
  for (const [k, v] of B) {
    if (!A.has(k)) diffs.push({ type: `${label}_missing_in_a`, key: k, b: v });
  }
}

export function diffInventories(a, b) {
  const diffs = [];

  if (a.pgMajor !== b.pgMajor) {
    diffs.push({ type: "pgMajor", a: a.pgMajor, b: b.pgMajor });
  }

  const extA = a.extensions.filter((e) => e.name !== "plpgsql");
  const extB = b.extensions.filter((e) => e.name !== "plpgsql");
  diffArraysBy(extA, extB, (e) => e.name, "extension", diffs, false);

  const schemasA = a.schemas.filter((s) => !NEON_MANAGED_SCHEMAS.has(s));
  const schemasB = b.schemas.filter((s) => !NEON_MANAGED_SCHEMAS.has(s));
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

  // Constraints: compare defs ignoring constraint name (names can differ across
  // dumps/restores) but matching on (table, type, def).
  const constraintKey = (c) => `${c.table}::${c.type}::${c.def}`;
  diffArraysBy(
    a.constraints.map((c) => ({ ...c, schema: undefined })),
    b.constraints.map((c) => ({ ...c, schema: undefined })),
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

  return diffs;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const a = load(args.a);
  const b = load(args.b);
  const diffs = diffInventories(a, b);

  const out = {
    checkedAt: new Date().toISOString(),
    a: args.a,
    b: args.b,
    empty: diffs.length === 0,
    diffCount: diffs.length,
    diffs,
  };

  const json = JSON.stringify(out, null, 2);
  if (args.out) writeFileSync(args.out, json);
  process.stdout.write(json + "\n");
  process.exitCode = diffs.length === 0 ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
