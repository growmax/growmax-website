// scripts/migration/db/lib.mjs
//
// Shared helpers for the migration DB toolkit (SPEC-03 §1).
// - maskUrl(): never let a connection string reach a log line or error message.
// - connect(): one uniform { query, batch, end } interface over three transports:
//     container-tcp   -> plain `pg` over TCP (local self-test, and the Sandbox's
//                         direct-to-Neon path once inside the Sandbox).
//     neon-https      -> `@neondatabase/serverless` HTTP driver (one-shot / batched
//                         reads over fetch; works through an HTTPS-only egress proxy).
//     neon-https-pool -> `@neondatabase/serverless` Pool over WebSocket, for
//                         interactive multi-statement writes (future P4+ use).
// - Deterministic session settings + read-only enforcement (SPEC-03 §0.1, §1).
// - Table discovery: public-schema tables, primary keys, natural (unique) keys.
//
// Node 22 ESM. No secret value is ever printed: callers must route all output
// through maskUrl() first.

import pg from "pg";
import { neon, Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

/** Mask `://user:pass@` -> `://user:***@` in any string that might contain a URL. */
export function maskUrl(input) {
  if (input == null) return input;
  const s = String(input);
  return s.replace(/:\/\/([^:@/\s]+):([^@/\s]+)@/g, "://$1:***@");
}

/** Deep-mask connection strings anywhere inside an object/array (for safe logging). */
export function maskDeep(value) {
  if (typeof value === "string") return maskUrl(value);
  if (Array.isArray(value)) return value.map(maskDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = maskDeep(v);
    return out;
  }
  return value;
}

export function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var ${name} (secrets are read from the environment only, never typed)`);
  }
  return v;
}

// Deterministic session settings (SPEC-03 §1) so fingerprints/inventories are
// reproducible regardless of client locale/timezone.
export const SESSION_SQL = [
  "SET datestyle = 'ISO, MDY'",
  "SET timezone = 'UTC'",
  "SET intervalstyle = 'postgres'",
  "SET extra_float_digits = 3",
  "SET bytea_output = 'hex'",
];

// Treat `timestamp without time zone` as opaque strings (naive = UTC), never
// parsed through the local JS time zone. OID 1114 = timestamp, 1082 = date.
pg.types.setTypeParser(1114, (s) => s);
pg.types.setTypeParser(1082, (s) => s);

function readOnlyPrefixSql(readOnly) {
  return readOnly ? "SET default_transaction_read_only = on" : null;
}

// ---------------------------------------------------------------------------
// container-tcp: plain `pg` over TCP
// ---------------------------------------------------------------------------

function connectContainerTcp(url, { readOnly }) {
  const pool = new pg.Pool({ connectionString: url, max: 4 });
  pool.on("error", (err) => {
    // Idle client errors shouldn't crash the process; surface masked.
    console.error("[lib] pg pool error:", maskUrl(err?.message ?? String(err)));
  });

  async function runOnClient(client, queries) {
    const results = [];
    const ro = readOnlyPrefixSql(readOnly);
    if (ro) await client.query(ro);
    for (const s of SESSION_SQL) await client.query(s);
    await client.query(readOnly ? "BEGIN TRANSACTION READ ONLY" : "BEGIN");
    try {
      for (const q of queries) {
        const r = await client.query(q.text, q.params ?? []);
        results.push({ rows: r.rows, rowCount: r.rowCount });
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK").catch(() => {});
      throw err;
    }
    return results;
  }

  return {
    transport: "container-tcp",
    async batch(queries) {
      const client = await pool.connect();
      try {
        return await runOnClient(client, queries);
      } finally {
        client.release();
      }
    },
    async query(text, params = []) {
      const [r] = await this.batch([{ text, params }]);
      return r;
    },
    /** Interactive transaction for callers that need branching logic (sync.mjs). */
    async withTransaction(fn) {
      const client = await pool.connect();
      try {
        const ro = readOnlyPrefixSql(readOnly);
        if (ro) await client.query(ro);
        for (const s of SESSION_SQL) await client.query(s);
        await client.query(readOnly ? "BEGIN TRANSACTION READ ONLY" : "BEGIN");
        const tx = {
          async query(text, params = []) {
            const r = await client.query(text, params);
            return { rows: r.rows, rowCount: r.rowCount };
          },
        };
        const out = await fn(tx);
        await client.query("COMMIT");
        return out;
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },
    async end() {
      await pool.end();
    },
  };
}

// ---------------------------------------------------------------------------
// neon-https: one-shot / batched reads over fetch (HTTP driver)
// ---------------------------------------------------------------------------

function connectNeonHttp(url, { readOnly }) {
  const sql = neon(url, { fullResults: true });

  return {
    transport: "neon-https",
    /** Runs every query as ONE consistent snapshot (single Postgres transaction over HTTP). */
    async batch(queries) {
      const calls = [...SESSION_SQL.map((s) => sql.query(s)), ...queries.map((q) => sql.query(q.text, q.params ?? []))];
      const results = await sql.transaction(calls, {
        readOnly: !!readOnly,
        isolationLevel: "RepeatableRead",
      });
      // Drop the SESSION_SQL results, keep one entry per caller query.
      return results.slice(SESSION_SQL.length).map((r) => ({ rows: r.rows, rowCount: r.rowCount }));
    },
    async query(text, params = []) {
      const [r] = await this.batch([{ text, params }]);
      return r;
    },
    async withTransaction() {
      throw new Error(
        "neon-https is a one-shot/batched HTTP transport and cannot run an interactive transaction; use neon-https-pool or container-tcp"
      );
    },
    async end() {
      /* no persistent connection to close */
    },
  };
}

// ---------------------------------------------------------------------------
// neon-https-pool: WebSocket pool, for interactive multi-statement writes
// ---------------------------------------------------------------------------

function connectNeonPool(url, { readOnly }) {
  const pool = new NeonPool({ connectionString: url, max: 4 });
  pool.on("error", (err) => {
    console.error("[lib] neon pool error:", maskUrl(err?.message ?? String(err)));
  });

  return {
    transport: "neon-https-pool",
    async batch(queries) {
      const client = await pool.connect();
      try {
        const ro = readOnlyPrefixSql(readOnly);
        if (ro) await client.query(ro);
        for (const s of SESSION_SQL) await client.query(s);
        await client.query(readOnly ? "BEGIN TRANSACTION READ ONLY" : "BEGIN");
        const results = [];
        try {
          for (const q of queries) {
            const r = await client.query(q.text, q.params ?? []);
            results.push({ rows: r.rows, rowCount: r.rowCount });
          }
          await client.query("COMMIT");
        } catch (err) {
          await client.query("ROLLBACK").catch(() => {});
          throw err;
        }
        return results;
      } finally {
        client.release();
      }
    },
    async query(text, params = []) {
      const [r] = await this.batch([{ text, params }]);
      return r;
    },
    async withTransaction(fn) {
      const client = await pool.connect();
      try {
        const ro = readOnlyPrefixSql(readOnly);
        if (ro) await client.query(ro);
        for (const s of SESSION_SQL) await client.query(s);
        await client.query(readOnly ? "BEGIN TRANSACTION READ ONLY" : "BEGIN");
        const tx = {
          async query(text, params = []) {
            const r = await client.query(text, params);
            return { rows: r.rows, rowCount: r.rowCount };
          },
        };
        const out = await fn(tx);
        await client.query("COMMIT");
        return out;
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },
    async end() {
      await pool.end();
    },
  };
}

/** host+path identity of a connection string, normalized so equivalent Neon
 * endpoints compare equal regardless of cosmetic differences, for comparing
 * "is this URL actually the source" independent of which env var name a
 * caller used. Ignores port, userinfo and query string; lowercases the whole
 * identity (WHATWG URL does NOT lowercase the host for the non-special
 * `postgresql:` scheme, so two spellings of the same host would otherwise
 * compare unequal); and strips a `-pooler` suffix from the first host label,
 * since Neon's pooled and direct endpoints for the SAME database are that one
 * label apart (e.g. `ep-foo-pooler.us-east-2.aws.neon.tech` vs
 * `ep-foo.us-east-2.aws.neon.tech`) and must be treated as the same identity.
 * Falls back to a lowercased raw string if it doesn't parse as a URL. */
export function connectionIdentity(urlStr) {
  try {
    const u = new URL(urlStr);
    const labels = u.hostname.toLowerCase().split(".");
    if (labels.length > 0) labels[0] = labels[0].replace(/-pooler$/, "");
    const host = labels.join(".");
    const pathname = u.pathname.replace(/\/+$/, "").toLowerCase();
    return `${host}${pathname}`;
  } catch {
    return String(urlStr).toLowerCase();
  }
}

/**
 * @param {string} envName e.g. "SRC_URL", "DST_URL", "DST_URL_UNPOOLED"
 * @param {{readOnly?: boolean, transport?: 'container-tcp'|'neon-https'|'neon-https-pool', allowSourceWrites?: boolean}} opts
 *
 * SPEC-03 §0.1: the source is read-only. This is enforced HERE, not left to
 * each caller, so a caller can't get a writable session on Replit just by
 * passing readOnly:false (by mistake, or by pointing a DST_* env var at a
 * value that happens to equal REPLIT_DATABASE_URL). The one legitimate
 * exception is an owner-requested rollback (reverse-delta), which must pass
 * BOTH `allowSourceWrites: true` here AND have `ALLOW_SOURCE_WRITES=1` set in
 * the real environment.
 */
export async function connect(envName, opts = {}) {
  const { readOnly = false, transport = "neon-https", allowSourceWrites = false } = opts;
  const url = requireEnv(envName);

  const isSourceByName = envName === "SRC_URL" || envName === "REPLIT_DATABASE_URL";
  let isSourceByValue = false;
  if (!isSourceByName) {
    const urlIdentity = connectionIdentity(url);
    // Compare against BOTH REPLIT_DATABASE_URL and SRC_URL when set: the
    // Sandbox runner passes the source as SRC_URL, which is what a caller's
    // DST_* value could accidentally be pointed at, and the two are not
    // always textually identical (SRC_URL may be a read-only-scoped or
    // otherwise-derived variant), so checking only one of them would miss
    // the other.
    const sourceCandidates = [process.env.REPLIT_DATABASE_URL, process.env.SRC_URL].filter(Boolean);
    isSourceByValue = sourceCandidates.some((candidate) => connectionIdentity(candidate) === urlIdentity);
  }
  const isSource = isSourceByName || isSourceByValue;

  let effectiveReadOnly = readOnly;
  if (isSource && !readOnly) {
    const allowed = allowSourceWrites === true && process.env.ALLOW_SOURCE_WRITES === "1";
    if (!allowed) {
      throw new Error(
        `connect(${envName}): refusing a writable session against the source (SPEC-03 §0.1 -- the source is ` +
          `read-only). Pass { readOnly: true }, or for an owner-requested rollback pass ` +
          `{ allowSourceWrites: true } with ALLOW_SOURCE_WRITES=1 set in the real environment.`
      );
    }
    // Allowed writer (reverse-delta only): proceed with readOnly:false as requested.
    effectiveReadOnly = false;
  }

  switch (transport) {
    case "container-tcp":
      return connectContainerTcp(url, { readOnly: effectiveReadOnly });
    case "neon-https":
      return connectNeonHttp(url, { readOnly: effectiveReadOnly });
    case "neon-https-pool":
      return connectNeonPool(url, { readOnly: effectiveReadOnly });
    default:
      throw new Error(`Unknown transport: ${transport}`);
  }
}

// ---------------------------------------------------------------------------
// Table discovery: public-schema tables, primary keys, natural (unique) keys
// ---------------------------------------------------------------------------

/**
 * @param {{query: Function}} conn
 * @returns {Promise<Array<{name:string, columns:Array, primaryKey:string[], uniqueKeys:string[][], naturalKeys:string[][]}>>}
 */
export async function discoverTables(conn) {
  const { rows: tableRows } = await conn.query(`
    select c.relname as name
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r'
    order by c.relname
  `);

  const tables = [];
  for (const { name } of tableRows) {
    const { rows: columns } = await conn.query(
      `select column_name, data_type, is_nullable, column_default
       from information_schema.columns
       where table_schema = 'public' and table_name = $1
       order by ordinal_position`,
      [name]
    );

    const { rows: constraintRows } = await conn.query(
      `select con.contype as type, con.conname as name,
              array(select a.attname::text
                    from unnest(con.conkey) with ordinality as k(attnum, ord)
                    join pg_attribute a on a.attnum = k.attnum and a.attrelid = con.conrelid
                    order by k.ord) as cols
       from pg_constraint con
       join pg_class c on c.oid = con.conrelid
       join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public' and c.relname = $1 and con.contype in ('p','u')`,
      [name]
    );

    const pkRow = constraintRows.find((r) => r.type === "p");
    const primaryKey = pkRow ? pkRow.cols : [];
    const uniqueKeys = constraintRows.filter((r) => r.type === "u").map((r) => r.cols);

    // Also treat single-column unique INDEXES (not just constraints) as natural keys,
    // since a `.unique()` Drizzle column can be either depending on migration path.
    const { rows: uniqueIndexRows } = await conn.query(
      `select array(
         select a.attname::text
         from unnest(ix.indkey) with ordinality as k(attnum, ord)
         join pg_attribute a on a.attnum = k.attnum and a.attrelid = ix.indrelid
         order by k.ord
       ) as cols
       from pg_index ix
       join pg_class ic on ic.oid = ix.indexrelid
       join pg_class tc on tc.oid = ix.indrelid
       join pg_namespace n on n.oid = tc.relnamespace
       where n.nspname = 'public' and tc.relname = $1 and ix.indisunique and not ix.indisprimary`,
      [name]
    );

    const sameSet = (a, b) => a.length === b.length && [...a].sort().join(",") === [...b].sort().join(",");
    const seen = [];
    for (const cols of [...uniqueKeys, ...uniqueIndexRows.map((r) => r.cols)]) {
      if (!seen.some((c) => sameSet(c, cols))) seen.push(cols);
    }
    const naturalKeys = seen.filter((cols) => !sameSet(cols, primaryKey));

    tables.push({ name, columns, primaryKey, uniqueKeys: seen, naturalKeys });
  }
  return tables;
}

/** Best pk-ish order column for deterministic string_agg ordering. */
export function orderColumn(table) {
  return table.primaryKey[0] ?? table.columns[0]?.column_name ?? "1";
}
