#!/usr/bin/env node
// scripts/migration/db/schema-diff.selftest.mjs
//
// Pure self-test for schema-diff.mjs's diffInventories() (SPEC-03 §1 / P4.3
// attempt-2 fix): synthetic fixtures built in code, no database access. Also
// exercises the CLI's exit codes via child_process on temp files under
// os.tmpdir(), and -- only if the two gitignored P4.3 evidence inventories
// are present on disk -- a real-data case built from them (never copied into
// this file).
//
// Usage: node schema-diff.selftest.mjs

import { existsSync, readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { diffInventories } from "./schema-diff.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.join(__dirname, "schema-diff.mjs");

const checks = [];
function check(name, expected, actual) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  checks.push({ name, expected, actual, pass });
  return pass;
}
function checkTrue(name, actual, note) {
  const pass = actual === true;
  checks.push({ name, expected: true, actual: note !== undefined ? note : actual, pass });
  return pass;
}

function hasDiffType(diffs, type) {
  return diffs.some((d) => d.type === type);
}
function countDiffType(diffs, type) {
  return diffs.filter((d) => d.type === type).length;
}

// ---------------------------------------------------------------------------
// Fixture builders
// ---------------------------------------------------------------------------

function notNullRow(table, column, { name, suffix = "" } = {}) {
  return {
    table,
    name: name ?? `${table}_${column}_not_null`,
    type: "n",
    def: `NOT NULL ${column}${suffix}`,
  };
}

function baseInventory(pgMajor, overrides = {}) {
  const inv = {
    checkedAt: "2026-01-01T00:00:00Z",
    db: "test",
    envVar: "TEST_URL",
    transport: "direct",
    serverVersion: `PostgreSQL ${pgMajor}.0`,
    serverVersionNum: pgMajor * 10000,
    pgMajor,
    encoding: "UTF8",
    collation: "en_US.UTF-8",
    extensions: [{ name: "plpgsql" }],
    schemas: ["public"],
    tables: {
      widgets: {
        columns: [
          { name: "id", type: "integer", nullable: false, default: null },
          { name: "name", type: "text", nullable: false, default: null },
          { name: "note", type: "text", nullable: true, default: null },
        ],
        primaryKey: ["id"],
      },
    },
    extraTables: [],
    indexes: [{ table: "widgets", def: "CREATE INDEX widgets_name_idx ON widgets (name)" }],
    constraints: [{ table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" }],
    sequences: [{ name: "widgets_id_seq", ownedBy: "widgets.id" }],
    views: [],
    functions: [],
    triggers: [{ table: "widgets", name: "widgets_touch", def: "BEFORE UPDATE ON widgets EXECUTE FUNCTION touch()" }],
    roles: ["app_owner"],
  };
  return { ...inv, ...overrides };
}

function pg18WithMatchingNRows(overrides = {}) {
  return baseInventory(18, {
    constraints: [
      { table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" },
      notNullRow("widgets", "id"),
      notNullRow("widgets", "name"),
    ],
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// 1. Identical PG16 vs PG16 -> empty
// ---------------------------------------------------------------------------
{
  const r = diffInventories(baseInventory(16), baseInventory(16), {});
  check("PG16 vs PG16 identical -> empty diffs", 0, r.diffs.length);
}

// ---------------------------------------------------------------------------
// 2. PG16 vs PG18 with matching 'n' rows + acceptPgMajor 18 -> empty,
//    accepted has the pgMajor entry, normalized counts correct
// ---------------------------------------------------------------------------
{
  const pg16 = baseInventory(16);
  const pg18 = pg18WithMatchingNRows();
  const r = diffInventories(pg16, pg18, { acceptPgMajor: 18 });
  check("PG16 vs PG18 (matching n rows, accepted) -> empty diffs", 0, r.diffs.length);
  checkTrue(
    "accepted contains pgMajor 16 -> 18",
    r.accepted.some((e) => e.type === "pgMajor" && e.a === 16 && e.b === 18)
  );
  check("normalized.notNullConstraints.a === 0 (PG16 side)", 0, r.normalized.notNullConstraints.a);
  check("normalized.notNullConstraints.b === 2 (PG18 side)", 2, r.normalized.notNullConstraints.b);

  // 3. Same fixtures without the flag -> exactly 1 diff (pgMajor)
  const rNoFlag = diffInventories(pg16, pg18, {});
  check("same fixtures without --accept-pg-major -> exactly 1 diff", 1, rNoFlag.diffs.length);
  checkTrue("that 1 diff is type pgMajor", rNoFlag.diffs.length === 1 && rNoFlag.diffs[0].type === "pgMajor");

  // 4. flag 17 with b=18 -> pgMajor diff (wrong major accepted)
  const rWrongFlag = diffInventories(pg16, pg18, { acceptPgMajor: 17 });
  checkTrue("--accept-pg-major 17 with b=18 still yields a pgMajor diff", hasDiffType(rWrongFlag.diffs, "pgMajor"));

  // 5. downgrade a=18 b=16 with flag 16 -> pgMajor diff (not an upgrade)
  const rDowngrade = diffInventories(pg18, pg16, { acceptPgMajor: 16 });
  checkTrue("downgrade a=18,b=16 with --accept-pg-major 16 still yields a pgMajor diff", hasDiffType(rDowngrade.diffs, "pgMajor"));
}

// ---------------------------------------------------------------------------
// 6. PG18 side missing one 'n' row -> not_null_constraint_missing
// ---------------------------------------------------------------------------
{
  const pg18Missing = baseInventory(18, {
    constraints: [
      { table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" },
      notNullRow("widgets", "id"),
      // "name" column is nullable:false but has no matching 'n' row
    ],
  });
  const r = diffInventories(baseInventory(16), pg18Missing, { acceptPgMajor: 18 });
  checkTrue("PG18 missing one n row -> not_null_constraint_missing", hasDiffType(r.diffs, "not_null_constraint_missing"));
  checkTrue(
    "the missing diff is for side b, key widgets.name",
    r.diffs.some((d) => d.type === "not_null_constraint_missing" && d.side === "b" && d.key === "widgets.name")
  );
}

// ---------------------------------------------------------------------------
// 7. an 'n' row for a nullable column -> not_null_constraint_orphan
// ---------------------------------------------------------------------------
{
  const pg18Orphan = baseInventory(18, {
    constraints: [
      { table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" },
      notNullRow("widgets", "id"),
      notNullRow("widgets", "name"),
      notNullRow("widgets", "note"), // "note" is nullable:true in the fixture
    ],
  });
  const r = diffInventories(baseInventory(16), pg18Orphan, { acceptPgMajor: 18 });
  checkTrue("n row for a nullable column -> not_null_constraint_orphan", hasDiffType(r.diffs, "not_null_constraint_orphan"));
  checkTrue(
    "the orphan diff is for side b, key widgets.note",
    r.diffs.some((d) => d.type === "not_null_constraint_orphan" && d.side === "b" && d.key === "widgets.note")
  );
}

// ---------------------------------------------------------------------------
// 8/9. NOT VALID / NO INHERIT -> not_null_constraint_nonstandard
// ---------------------------------------------------------------------------
{
  const pg18NotValid = pg18WithMatchingNRows({
    constraints: [
      { table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" },
      notNullRow("widgets", "id", { suffix: " NOT VALID" }),
      notNullRow("widgets", "name"),
    ],
  });
  const r = diffInventories(baseInventory(16), pg18NotValid, { acceptPgMajor: 18 });
  checkTrue("NOT VALID suffix -> not_null_constraint_nonstandard", hasDiffType(r.diffs, "not_null_constraint_nonstandard"));

  const pg18NoInherit = pg18WithMatchingNRows({
    constraints: [
      { table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" },
      notNullRow("widgets", "id", { suffix: " NO INHERIT" }),
      notNullRow("widgets", "name"),
    ],
  });
  const r2 = diffInventories(baseInventory(16), pg18NoInherit, { acceptPgMajor: 18 });
  checkTrue("NO INHERIT suffix -> not_null_constraint_nonstandard", hasDiffType(r2.diffs, "not_null_constraint_nonstandard"));
}

// ---------------------------------------------------------------------------
// 10. a quoted identifier containing a space and an embedded "" parses and
//     matches -> no diff at all (fully consistent on both sides)
// ---------------------------------------------------------------------------
{
  const quotedCol = 'weird col "quoted"'; // real column name, contains a space and an embedded quote
  const defQuoted = `NOT NULL "${quotedCol.replace(/"/g, '""')}"`;
  const withQuotedColumn = (pgMajor, extraConstraints) =>
    baseInventory(pgMajor, {
      tables: {
        widgets: {
          columns: [
            { name: "id", type: "integer", nullable: false, default: null },
            { name: "name", type: "text", nullable: false, default: null },
            { name: "note", type: "text", nullable: true, default: null },
            { name: quotedCol, type: "text", nullable: false, default: null },
          ],
          primaryKey: ["id"],
        },
      },
      constraints: [{ table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" }, ...extraConstraints],
    });
  const a16 = withQuotedColumn(16, []);
  const b18 = withQuotedColumn(18, [notNullRow("widgets", "id"), notNullRow("widgets", "name"), { table: "widgets", name: "q", type: "n", def: defQuoted }]);
  const r = diffInventories(a16, b18, { acceptPgMajor: 18 });
  check("quoted identifier with space + embedded \"\" parses and matches -> empty diffs", 0, r.diffs.length);
}

// ---------------------------------------------------------------------------
// 11. an unparsable def -> not_null_constraint_unparsed
// ---------------------------------------------------------------------------
{
  const pg18Unparsable = baseInventory(18, {
    constraints: [
      { table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" },
      { table: "widgets", name: "widgets_weird_not_null", type: "n", def: "NOT NULL 123abc" }, // invalid identifier start
      notNullRow("widgets", "id"),
      notNullRow("widgets", "name"),
    ],
  });
  const r = diffInventories(baseInventory(16), pg18Unparsable, { acceptPgMajor: 18 });
  checkTrue("unparsable n def -> not_null_constraint_unparsed", hasDiffType(r.diffs, "not_null_constraint_unparsed"));
}

// ---------------------------------------------------------------------------
// 12. a PG16 side carrying non-matching 'n' rows -> diff
// ---------------------------------------------------------------------------
{
  const pg16Weird = baseInventory(16, {
    constraints: [
      { table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" },
      { table: "widgets", name: "widgets_bogus_not_null", type: "n", def: "NOT NULL bogus_col" },
    ],
  });
  const r = diffInventories(pg16Weird, baseInventory(16), {});
  checkTrue(
    "PG16 side with non-matching n rows still yields a diff",
    hasDiffType(r.diffs, "not_null_constraint_orphan") || hasDiffType(r.diffs, "not_null_constraint_missing")
  );
}

// ---------------------------------------------------------------------------
// 13. genuine nullability difference between sides (a NOT NULL, b nullable,
//     b's 'n' rows consistent with b) -> table_columns_differ
// ---------------------------------------------------------------------------
{
  const withNoteNullable = (nullable) =>
    baseInventory(16, {
      tables: {
        widgets: {
          columns: [
            { name: "id", type: "integer", nullable: false, default: null },
            { name: "name", type: "text", nullable: false, default: null },
            { name: "note", type: "text", nullable, default: null },
          ],
          primaryKey: ["id"],
        },
      },
    });
  const r = diffInventories(withNoteNullable(false), withNoteNullable(true), {});
  checkTrue("genuine cross-side nullability difference -> table_columns_differ", hasDiffType(r.diffs, "table_columns_differ"));
}

// ---------------------------------------------------------------------------
// 14. _system on the source only -> empty and listed in ignored.schemas.a
// ---------------------------------------------------------------------------
{
  const a = baseInventory(16, { schemas: ["public", "_system"] });
  const b = baseInventory(16, { schemas: ["public"] });
  const r = diffInventories(a, b, {});
  check("_system source-only -> empty diffs", 0, r.diffs.length);
  check("_system reported in ignored.schemas.a", ["_system"], r.ignored.schemas.a);
  check("ignored.schemas.b is empty (not present on b)", [], r.ignored.schemas.b);
}

// ---------------------------------------------------------------------------
// 15. an unknown source-only schema -> schema_missing_in_b
// ---------------------------------------------------------------------------
{
  const a = baseInventory(16, { schemas: ["public", "extra_schema"] });
  const b = baseInventory(16, { schemas: ["public"] });
  const r = diffInventories(a, b, {});
  checkTrue("unknown source-only schema -> schema_missing_in_b", hasDiffType(r.diffs, "schema_missing_in_b"));
}

// ---------------------------------------------------------------------------
// 16. missing unique constraint, index, sequence, trigger each still diff
// ---------------------------------------------------------------------------
{
  const withUnique = baseInventory(16, {
    constraints: [
      { table: "widgets", name: "widgets_pkey", type: "p", def: "PRIMARY KEY (id)" },
      { table: "widgets", name: "widgets_name_unique", type: "u", def: "UNIQUE (name)" },
    ],
  });
  const r = diffInventories(withUnique, baseInventory(16), {});
  checkTrue("missing unique constraint -> constraint_missing_in_b", hasDiffType(r.diffs, "constraint_missing_in_b"));

  const withIndex = baseInventory(16, {
    indexes: [
      { table: "widgets", def: "CREATE INDEX widgets_name_idx ON widgets (name)" },
      { table: "widgets", def: "CREATE INDEX widgets_note_idx ON widgets (note)" },
    ],
  });
  const rIdx = diffInventories(withIndex, baseInventory(16), {});
  checkTrue("missing index -> index_missing_in_b", hasDiffType(rIdx.diffs, "index_missing_in_b"));

  const withSeq = baseInventory(16, {
    sequences: [
      { name: "widgets_id_seq", ownedBy: "widgets.id" },
      { name: "widgets_extra_seq", ownedBy: "widgets.extra" },
    ],
  });
  const rSeq = diffInventories(withSeq, baseInventory(16), {});
  checkTrue("missing sequence -> sequence_missing_in_b", hasDiffType(rSeq.diffs, "sequence_missing_in_b"));

  const withTrigger = baseInventory(16, {
    triggers: [
      { table: "widgets", name: "widgets_touch", def: "BEFORE UPDATE ON widgets EXECUTE FUNCTION touch()" },
      { table: "widgets", name: "widgets_audit", def: "AFTER INSERT ON widgets EXECUTE FUNCTION audit()" },
    ],
  });
  const rTrig = diffInventories(withTrigger, baseInventory(16), {});
  checkTrue("missing trigger -> trigger_missing_in_b", hasDiffType(rTrig.diffs, "trigger_missing_in_b"));
}

// ---------------------------------------------------------------------------
// 17. CLI exit codes 0/1/2 via child_process on temp files (os.tmpdir() only)
// ---------------------------------------------------------------------------
{
  const dir = mkdtempSync(path.join(tmpdir(), "schema-diff-selftest-"));
  try {
    const fileA = path.join(dir, "a.json");
    const fileB = path.join(dir, "b.json");
    writeFileSync(fileA, JSON.stringify(baseInventory(16)));
    writeFileSync(fileB, JSON.stringify(baseInventory(16)));

    function runCli(argv) {
      try {
        execFileSync(process.execPath, [SCRIPT_PATH, ...argv], { stdio: ["ignore", "pipe", "pipe"] });
        return 0;
      } catch (e) {
        return typeof e.status === "number" ? e.status : -1;
      }
    }

    check("CLI exit 0 on identical inventories", 0, runCli(["--a", fileA, "--b", fileB]));

    writeFileSync(fileB, JSON.stringify(baseInventory(16, { schemas: ["public", "extra_schema"] })));
    check("CLI exit 1 when diffs are present", 1, runCli(["--a", fileA, "--b", fileB]));

    check("CLI exit 2 on missing --b (usage error)", 2, runCli(["--a", fileA]));
    check("CLI exit 2 on non-integer --accept-pg-major", 2, runCli(["--a", fileA, "--b", fileB, "--accept-pg-major", "abc"]));

    const missingFile = path.join(dir, "does-not-exist.json");
    check("CLI exit 2 on unreadable input file", 2, runCli(["--a", missingFile, "--b", fileB]));

    // Round-1 review, blocking finding: valid JSON that isn't a real
    // inventory must exit 2 (invalid input), not crash with an uncaught
    // TypeError and exit 1 ("diffs found").
    const emptyObjFile = path.join(dir, "empty-obj.json");
    writeFileSync(emptyObjFile, "{}");
    check("CLI exit 2 when --b is {} (structurally invalid)", 2, runCli(["--a", fileA, "--b", emptyObjFile]));

    const nullFile = path.join(dir, "null.json");
    writeFileSync(nullFile, "null");
    check("CLI exit 2 when --b is null", 2, runCli(["--a", fileA, "--b", nullFile]));

    const noPgMajorA = path.join(dir, "no-pgmajor-a.json");
    const noPgMajorB = path.join(dir, "no-pgmajor-b.json");
    const { pgMajor: _dropA, ...invNoPgMajorA } = baseInventory(16);
    const { pgMajor: _dropB, ...invNoPgMajorB } = baseInventory(16);
    writeFileSync(noPgMajorA, JSON.stringify(invNoPgMajorA));
    writeFileSync(noPgMajorB, JSON.stringify(invNoPgMajorB));
    check(
      "CLI exit 2 when pgMajor is missing on both sides (was: silent 0 diffs via undefined === undefined)",
      2,
      runCli(["--a", noPgMajorA, "--b", noPgMajorB])
    );

    // An unwritable --out path must also exit 2, not crash with exit 1.
    const unwritableOut = path.join(dir, "no-such-subdir", "out.json");
    check("CLI exit 2 when --out cannot be written", 2, runCli(["--a", fileA, "--b", fileB, "--out", unwritableOut]));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// 18. Real-data case: only if the two P4.3 .scratch inventories exist.
// ---------------------------------------------------------------------------
{
  const scratchDir = path.join(__dirname, "../../../docs/migration/.scratch");
  const srcPath = path.join(scratchDir, "p43r2-inv-src.json");
  const dstPath = path.join(scratchDir, "p43r2-inv-dst.json");
  if (existsSync(srcPath) && existsSync(dstPath)) {
    const src = JSON.parse(readFileSync(srcPath, "utf8"));
    const dst = JSON.parse(readFileSync(dstPath, "utf8"));

    const real = diffInventories(src, dst, { acceptPgMajor: 18 });
    check("real-data: 0 diffs with --accept-pg-major 18", 0, real.diffs.length);
    check("real-data: accepted = [pgMajor 16 -> 18]", [{ type: "pgMajor", a: 16, b: 18 }], real.accepted);
    check("real-data: ignored.schemas.a = [\"_system\"]", ["_system"], real.ignored.schemas.a);
    check("real-data: normalized.notNullConstraints.b === 27", 27, real.normalized.notNullConstraints.b);
    check("real-data: normalized.notNullConstraints.a === 0", 0, real.normalized.notNullConstraints.a);

    // Mutation 1: drop one 'n' row on b -> at least one diff.
    const dstMut1 = JSON.parse(JSON.stringify(dst));
    const nIdx1 = dstMut1.constraints.findIndex((c) => c.type === "n");
    dstMut1.constraints.splice(nIdx1, 1);
    const r1 = diffInventories(src, dstMut1, { acceptPgMajor: 18 });
    checkTrue("real-data mutation: drop one n row on b -> >=1 diff", r1.diffs.length >= 1, r1.diffs.length);

    // Mutation 2: flip one column to nullable on b -> at least one diff.
    const dstMut2 = JSON.parse(JSON.stringify(dst));
    const t0 = Object.keys(dstMut2.tables)[0];
    dstMut2.tables[t0].columns[0].nullable = true;
    const r2 = diffInventories(src, dstMut2, { acceptPgMajor: 18 });
    checkTrue("real-data mutation: flip a column nullable on b -> >=1 diff", r2.diffs.length >= 1, r2.diffs.length);

    // Mutation 3: append " NOT VALID" to one 'n' def on b -> at least one diff.
    const dstMut3 = JSON.parse(JSON.stringify(dst));
    const nIdx3 = dstMut3.constraints.findIndex((c) => c.type === "n");
    dstMut3.constraints[nIdx3].def += " NOT VALID";
    const r3 = diffInventories(src, dstMut3, { acceptPgMajor: 18 });
    checkTrue("real-data mutation: append NOT VALID to one n def on b -> >=1 diff", r3.diffs.length >= 1, r3.diffs.length);
  } else {
    checks.push({
      name: "real-data case (P4.3 .scratch inventories)",
      expected: "run",
      actual: "skipped: docs/migration/.scratch/p43r2-inv-{src,dst}.json not present",
      pass: true,
    });
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const anyFail = checks.some((c) => !c.pass);
const result = { name: "schema-diff.selftest", status: anyFail ? "fail" : "pass", checks };
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
process.exitCode = anyFail ? 1 : 0;
