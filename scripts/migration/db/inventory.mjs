#!/usr/bin/env node
// scripts/migration/db/inventory.mjs
//
// Catalog snapshot (SPEC-03 §1, §3): server_version, encoding/collation,
// extensions, schemas, tables (exact counts, sizes), columns, constraints,
// indexes, sequences, views, functions, triggers, role names.
//
// Usage:
//   node inventory.mjs --db src|dst [--env SRC_URL] [--transport neon-https|container-tcp] [--out file]
//
// Never prints a connection string. Read-only by default for --db src.

// Callers using the neon-https transport must invoke this script with
// NODE_USE_ENV_PROXY=1 set as a real environment variable BEFORE the node
// process starts (SPEC-03 §1): undici's env-proxy support is read once at
// startup, so setting process.env here would be too late.

import { writeFileSync } from "node:fs";
import { connect, discoverTables, maskUrl, orderColumn } from "./lib.mjs";

function parseArgs(argv) {
  const args = { db: null, env: null, transport: "neon-https", out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--db") args.db = argv[++i];
    else if (a === "--env") args.env = argv[++i];
    else if (a === "--transport") args.transport = argv[++i];
    else if (a === "--out") args.out = argv[++i];
  }
  if (!["src", "dst"].includes(args.db)) {
    throw new Error("--db src|dst is required");
  }
  if (!args.env) {
    args.env = args.db === "src" ? (process.env.SRC_URL ? "SRC_URL" : "REPLIT_DATABASE_URL") : "DST_URL";
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // inventory never writes to either side (src or dst): always open
  // read-only, not just for the source.
  const conn = await connect(args.env, { readOnly: true, transport: args.transport });

  try {
    const [{ rows: verRows }] = await Promise.all([
      conn.query(`select version() as version, current_setting('server_version_num') as num,
                         pg_encoding_to_char(encoding) as encoding, datcollate as collation
                  from pg_database where datname = current_database()`),
    ]);
    const v = verRows[0];
    const serverVersionNum = Number(v.num);
    const pgMajor = Math.floor(serverVersionNum / 10000);

    const { rows: extensionRows } = await conn.query(
      `select extname as name, extversion as version from pg_extension order by extname`
    );

    const { rows: schemaRows } = await conn.query(
      `select nspname as name from pg_namespace
       where nspname not in ('pg_catalog','information_schema') and nspname not like 'pg_toast%'
       order by nspname`
    );

    const tables = await discoverTables(conn);

    // One consistent snapshot for all per-table counts / sizes / max ids.
    const perTableQueries = tables.flatMap((t) => {
      const pkCol = t.primaryKey[0];
      return [
        { text: `select count(*)::bigint as count from "${t.name}"` },
        { text: `select pg_total_relation_size($1)::bigint as size`, params: [`public."${t.name}"`] },
        pkCol
          ? { text: `select max("${pkCol}")::bigint as max_id from "${t.name}"` }
          : { text: `select null::bigint as max_id` },
      ];
    });
    const snapshot = perTableQueries.length ? await conn.batch(perTableQueries) : [];

    const tableInfo = {};
    tables.forEach((t, i) => {
      const [countRes, sizeRes, maxIdRes] = snapshot.slice(i * 3, i * 3 + 3);
      tableInfo[t.name] = {
        count: Number(countRes.rows[0].count),
        sizeBytes: Number(sizeRes.rows[0].size),
        maxId: maxIdRes.rows[0].max_id === null ? null : Number(maxIdRes.rows[0].max_id),
        primaryKey: t.primaryKey,
        naturalKeys: t.naturalKeys,
        orderColumn: orderColumn(t),
        columns: t.columns.map((c) => ({
          name: c.column_name,
          type: c.data_type,
          nullable: c.is_nullable === "YES",
          default: c.column_default,
        })),
      };
    });

    const { rows: indexRows } = await conn.query(
      `select c.relname as table, i.relname as index, pg_get_indexdef(i.oid) as def
       from pg_index ix
       join pg_class i on i.oid = ix.indexrelid
       join pg_class c on c.oid = ix.indrelid
       join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public'
       order by c.relname, i.relname`
    );

    const { rows: constraintDefRows } = await conn.query(
      `select c.relname as table, con.conname as name, con.contype as type, pg_get_constraintdef(con.oid) as def
       from pg_constraint con
       join pg_class c on c.oid = con.conrelid
       join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public'
       order by c.relname, con.conname`
    );

    const { rows: sequenceRows } = await conn.query(
      `select s.relname as name,
              case when dep.refobjid is not null
                   then dep.refobjid::regclass::text || '.' || a.attname
                   else null end as owned_by_expr
       from pg_class s
       join pg_namespace n on n.oid = s.relnamespace
       left join pg_depend dep on dep.objid = s.oid and dep.deptype = 'a' and dep.classid = 'pg_class'::regclass
       left join pg_attribute a on a.attrelid = dep.refobjid and a.attnum = dep.refobjsubid
       where n.nspname = 'public' and s.relkind = 'S'
       order by s.relname`
    );
    const seqDetails = [];
    for (const s of sequenceRows) {
      const { rows } = await conn.query(`select last_value, is_called from "${s.name}"`);
      seqDetails.push({
        name: s.name,
        ownedBy: s.owned_by_expr,
        lastValue: Number(rows[0].last_value),
        isCalled: rows[0].is_called,
      });
    }

    const { rows: viewRows } = await conn.query(
      `select viewname as name from pg_views where schemaname = 'public' order by viewname`
    );

    const { rows: functionRows } = await conn.query(
      `select p.proname as name, pg_get_function_identity_arguments(p.oid) as args
       from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public'
       order by p.proname`
    );

    const { rows: triggerRows } = await conn.query(
      `select tg.tgname as name, c.relname as table, pg_get_triggerdef(tg.oid) as def
       from pg_trigger tg
       join pg_class c on c.oid = tg.tgrelid
       join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public' and not tg.tgisinternal
       order by c.relname, tg.tgname`
    );

    const { rows: roleRows } = await conn.query(
      `select rolname as name from pg_roles where rolname !~ '^pg_' order by rolname`
    );

    const knownTables = new Set(["blog_posts", "blog_redirects", "demo_requests", "newsletter_subscriptions"]);
    const extraTables = tables.map((t) => t.name).filter((n) => !knownTables.has(n));

    const result = {
      checkedAt: new Date().toISOString(),
      db: args.db,
      envVar: args.env,
      transport: conn.transport,
      serverVersion: v.version,
      serverVersionNum,
      pgMajor,
      encoding: v.encoding,
      collation: v.collation,
      extensions: extensionRows,
      schemas: schemaRows.map((r) => r.name),
      tables: tableInfo,
      extraTables,
      indexes: indexRows,
      constraints: constraintDefRows,
      sequences: seqDetails,
      views: viewRows.map((r) => r.name),
      functions: functionRows,
      triggers: triggerRows,
      roles: roleRows.map((r) => r.name),
    };

    const json = JSON.stringify(result, null, 2);
    if (args.out) {
      writeFileSync(args.out, json);
      console.error(`[inventory] wrote ${args.out}`);
    }
    process.stdout.write(json + "\n");
  } catch (err) {
    console.error("[inventory] error:", maskUrl(err?.message ?? String(err)));
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

main();
