# SPEC-03: Data migration (Replit Postgres → Neon via Vercel)

Steps: P0.2 (identity), P1.1, P4.1–P4.3, P6.4, P7/P8 delta sync. Gates: G0 (identity), G1, G4, G6 (final refresh), G8b.

## 0. Invariants (never violate)

1. **The source is read-only.**
   - Every automated source session enforces read-only mode: `SET default_transaction_read_only = on`, or with the Neon HTTP driver `sql.transaction([...], {readOnly: true, isolationLevel: 'RepeatableRead'})`.
   - `pg_dump` is inherently read-only.
   - The only allowed source writes are in `reverse-delta`, and only for an **owner-requested** rollback (SPEC-07). That mode needs `--i-understand-this-writes-to-replit` **and** `ALLOW_SOURCE_WRITES=1`.
2. **Secret values never enter the model's context.** Agents never type a connection string, password or token into a tool call. That includes MCP `env` / `args` fields, and `mcp__Vercel__run_session_command` in particular.
   - Secrets flow only through process environment variables read by scripts: `REPLIT_DATABASE_URL` from the cloud environment, and the target URLs pulled with `vercel env pull` into `docs/migration/.scratch/.env.production` (gitignored), loaded with `node --env-file`.
   - The Vercel Sandbox is driven from a container Node script through the `@vercel/sandbox` SDK (`runCommand({ env: { SRC_URL: process.env.REPLIT_DATABASE_URL } })`). It is never driven through MCP when a secret is involved.
3. **No PII leaves the database hosts,** except transiently in `docs/migration/.scratch/` or the Sandbox `/tmp`. Evidence holds counts, ids and md5s only.
4. **Scripts mask** `://user:pass@` → `://user:***@` in every log line and error message.
5. **Before cutover Neon is disposable** (full refresh allowed). **Once `facts.cutover.detectedAt` is set, Neon is authoritative:** only additive operations run, and `full-refresh` refuses to run.
6. Seed/import/enhance scripts and `drizzle-kit push` are **never** run against the source or Neon.

## 1. Transports and scripts

**Transport selection** is decided in P0 and stored in `facts.paths.db`:

| Transport | When | Used for |
|---|---|---|
| `neon-https` (**preferred**) | The source host ends with `.neon.tech` (it almost certainly does: `middleware.ts` already uses `neon()` on the same URL) and `*.neon.tech` is reachable from the container | Everything except `pg_dump`/`pg_restore`: inventory, fingerprints, identity, delta, verify, audit. Uses `@neondatabase/serverless` (`Pool` over WebSocket for multi-statement work; `neon()` HTTP for one-shot reads). Run with `NODE_USE_ENV_PROXY=1` behind the container proxy |
| `container-tcp` | P0 proves raw TCP 5432 works | Everything |
| `sandbox-sdk` | Needed for `pg_dump`/`pg_restore`; also fallback for everything if neither of the above works | `scripts/migration/db/runner.mjs` creates/reuses the named Sandbox through `@vercel/sandbox` (auth: `VERCEL_TOKEN` + team/project ids), uploads `scripts/migration/`, and runs commands with secrets taken from `process.env` |

**Scripts** live in `scripts/migration/db/`. They're Node 22 ESM, use the dependencies in `scripts/migration/package.json` (`npm --prefix scripts/migration ci`), and output JSON to stdout plus `--out <file>`. P1.1 owns this directory. The harness (P1.2) never edits it.

| Script | Purpose |
|---|---|
| `lib.mjs` | `maskUrl()`, `connect(envName, {readOnly, transport})`, deterministic session settings (`datestyle='ISO, MDY'`, `timezone='UTC'`, `intervalstyle='postgres'`, `extra_float_digits=3`, `bytea_output='hex'`), table discovery (public schema, PK, natural unique keys) |
| `inventory.mjs --db src\|dst` | Catalog snapshot: `server_version_num`, encoding/collation, extensions, schemas, tables (exact counts, sizes), columns, constraints (`pg_get_constraintdef`), indexes (`pg_get_indexdef`), sequences, views, functions, triggers, role names |
| `fingerprint.mjs --db src\|dst [--below-gap N] [--rows] [--exclude-target-newer]` | Per table: `count(*)` and `md5(string_agg(t::text, E'\n' ORDER BY pk))`. `--rows` adds `{id: md5(t::text)}` |
| `sync.mjs <mode>` | `verify`, `full-refresh`, `gap`, `delta`, `reverse-delta` (§5) |
| `schema-diff.mjs [--accept-pg-major N]` | Compares two inventories, ignoring owner/ACL/comments and platform-managed schemas: Neon's `neon_auth`, our `_migration`, and Replit's `_system` bookkeeping schema, which exists only on the source and is outside the `--schema=public` copy. **Amended at P4.3 attempt 2 (opus-reviewed):** NOT NULL is compared by meaning across majors. PG 18 stores each NOT NULL as a `pg_constraint` row (`contype 'n'`) and PG 16 does not, so on each side those rows must match that side's NOT NULL columns exactly, and a `NOT VALID` or `NO INHERIT` not-null is a difference. A PG major difference passes only with `--accept-pg-major <target major>`, and only for an upgrade (A1 C2 accepts 16 → 18). Exit 0 = empty, 1 = diffs, 2 = usage or input error; callers require its JSON output with empty === true, not just exit 0 |
| `runner.mjs <script> [args]` | Runs any of the above (or `pg_dump`/`pg_restore`) inside the Sandbox via the SDK. Pulls result files back into `.scratch/` |

**Timestamps:** the columns are `timestamp without time zone`. Treat naive values as UTC everywhere: set `types.setTypeParser(1114, s => s)` for `pg`, and compare them as strings, never through the local JS time zone.

## 2. Identity check: is this really production? (P0.2 → G0 check 0.4)

1. Source (read-only): `SELECT slug, updated_at::text FROM blog_posts WHERE published ORDER BY slug`.
2. Live: `GET https://www.growmax.io/api/blog` (force-dynamic, so it reflects the production DB right now).
3. Drop the code-injected fallback article (`ARC_AI_ARTICLE_SLUG` in `lib/arcAiArticle.ts`) from the live list if its slug isn't in the source.
4. **Pass** only if the slug sets are identical **and** every `updatedAt` equals `updated_at`, both normalized as UTC ISO to the millisecond.
   - Mismatch → G0 fails → blocker `B-SRCDB`: "REPLIT_DATABASE_URL doesn't match the live site's data; provide the *production* database URL of the deployment."
5. **Deferred mode:** if no transport can reach the source from the container in P0 (not Neon, or `*.neon.tech` blocked), record 0.4 as `deferred`. **P4.1 must run the identity check first**, through the runner, before any copy. G4 can't pass without it.
6. Record `server_version`, `hostKind` (`neon` / `internal` = no dots → F-EXPORT, §6 / `other`) and `pgMajor`.

## 3. Discovery (P1.1, gate G1)

- Build the scripts in §1. Run `inventory` and `fingerprint` on the source → `evidence/P1.1-source-inventory.json`, `evidence/P1.1-source-fingerprint.json`.
- Record `facts.source = {pgMajor, hostKind, tables: {name: count}, maxIds, naturalKeys: {table: [cols]}, extensions, extraTables}`.
- Local-verification fixtures, no PII: a schema-only dump → `.scratch/schema.dump`; `blog_posts` + `blog_redirects` data → `.scratch/blog-tables.dump`. Either use `pg_dump` via the runner, or the `row_to_json` export with the Neon transport, restored locally with `json_populate_record`.
- Export the public redirect list `(old_path, new_path)` → `evidence/P1.1-db-redirects.json` (public URL fragments).
- `GAP_START = max(1_000_000, 10 × max(maxIds))` → `sync.gapStart` (fixed from here on).
- Self-test every `sync.mjs` mode and guard against a throwaway local PG16 (the SPEC-02 recipe) that has two databases acting as source and target. Include deletion, late-commit and natural-key-conflict scenarios. **Never** self-test against the real source or Neon.
- The scripts get an adversarial opus review (in `mig-p1-discovery`, after they're built) **before** they touch Neon in P4.

## 4. Full copy (P4.2) and final refresh (P6.4): db-operator, opus/high

**Pre-checks (P4.1):**
- The identity check has passed (it's run here if it was deferred).
- Target reachable via `DST_URL_UNPOOLED`; target major version ≥ source major.
- The target `public` schema has no user tables.
- Every non-`plpgsql` source extension is creatable (`CREATE EXTENSION IF NOT EXISTS …`).

**Copy** (`runner.mjs`, so secrets come from env; `pg_dump` major ≥ source major):
```bash
pg_dump "$SRC_URL" --format=custom --no-owner --no-privileges --schema=public --file=/tmp/src.dump
pg_restore --list /tmp/src.dump > /tmp/src.toc
pg_restore --no-owner --no-privileges --exit-on-error --single-transaction \
           [--clean --if-exists   # refresh mode only] --dbname="$DST_URL_UNPOOLED" /tmp/src.dump
psql "$DST_URL_UNPOOLED" -c 'ANALYZE'
```
- If the restore trips over `SCHEMA public` / `COMMENT ON SCHEMA public` entries, filter them out of the TOC and restore with `-L`.
- **Node ETL fallback**, only if `pg_dump` is impossible everywhere:
  - Create the schema from the source inventory, then iterate until `schema-diff` is empty.
  - Copy each table by id range with `row_to_json` → `json_populate_record`.
  - Copy the sequence values.

**Refresh guard (P6.4):** `sync.mjs full-refresh --confirm-pre-cutover` refuses unless **all** of these hold:
- `STATE.status ∉ {POST_CUTOVER, ROLLED_BACK}` and `facts.cutover.detectedAt` is null.
- The DoH answers (dns.google **and** cloudflare-dns) for `www.growmax.io` are the Replit IP `34.111.179.208`.
- The script's own `getaddrinfo` agrees.

**After the P6.4 refresh:**
1. `sync.mjs gap`: `setval(seq, GAP_START, false)` for every sequence owned by a `public` column whose next value is < `GAP_START`. **Never move a sequence backwards.**
2. Initialize the watermarks (§5) to the current source max ids.
3. Redeploy production with the same SHA, so `/blog`, the sitemap and `/llms*.txt` rebuild from final data.
4. Quick parity check on the DB-driven URLs.

The refresh also wipes every P5 test row.

## 5. Sync modes

**Sync bookkeeping lives in the target**, so it survives container loss and is atomic with the data. It's in schema `_migration` (created at the first `delta`/`gap`, excluded from `verify` and `schema-diff`, dropped at P9.2):
`_migration.sync_state(table_name text primary key, watermark bigint not null, last_run_at timestamptz not null)`
`_migration.sync_log(run_at timestamptz, table_name text, inserted int, updated int, key_conflicts int, target_deleted int, late_commits int)`

| Mode | When | Behavior |
|---|---|---|
| `verify [--below-gap]` | P4.3, after every sync | Fingerprints both sides (target limited to `id < GAP_START` once the gap exists). **Post-cutover** it also passes `--exclude-target-newer`: `blog_posts` rows where target `updated_at` > source `updated_at` are reported as `targetNewer` and don't count as mismatches. Rows reconciled by natural key (below) are reported as `keyReconciled`. Anything else that differs is a mismatch, and the script exits non-zero. |
| `full-refresh --confirm-pre-cutover` | P6.4 (and P4 re-runs) | §4 with `--clean --if-exists`, then `gap`, then `verify`, then watermark init |
| `gap` | P6.4 | As in §4 |
| `delta` | P7/P8 check-ins (cadence in SPEC-05 §4) | **Additive only.** See the per-table rules below |
| `reverse-delta [--dry-run]` | Rollback only (SPEC-07 R2) | Target rows `id ≥ GAP_START` → source, keyed the same way; `blog_posts` edited on the target after `detectedAt` → source. Needs both write guards (§0.1) unless `--dry-run` |

**`delta` per-table rules.** Tables are processed in order: `blog_redirects`, `blog_posts`, `newsletter_subscriptions`, `demo_requests`, then any extra tables.

1. `w` = `_migration.sync_state.watermark` for the table.
2. **New source rows:** source rows with `w < id < GAP_START`. Insert each with its **original id** via `INSERT INTO t SELECT * FROM json_populate_record(NULL::t, $1) ON CONFLICT DO NOTHING`.
   - If the insert is skipped because of a **natural-key** conflict (`newsletter_subscriptions.email`, `blog_posts.slug`, `blog_redirects.old_path`, or any other unique key found in the inventory), the source row counts as **reconciled by natural key**. Record the pair `(sourceId, targetId)` (ids only) as `key_conflicts`.
3. **Late commits:** source rows with `id ≤ w`, missing on the target (by id **and** by natural key), and `created_at > last_run_at − 1 h`. Insert them as in step 2 and count them as `late_commits`.
4. **Target deletions:** source rows with `id ≤ w`, missing on the target, and older than that window. They were deleted on the target (by an editor or a test cleanup). **Never re-insert them**; report them as `target_deleted`.
5. **`blog_posts` edits:** for ids present on both sides with `id < GAP_START` where source `updated_at` > target `updated_at`, update the target row from the source. Where the target is newer, keep the target.
6. Set `w` = the max source id seen in this run (never decrease it). Write `sync_log`.
7. Output: `{inserted, updated, keyConflicts, lateCommits, targetDeleted, sourceMissing, blogChanged, newestSourceRowAt}`.
   - If `blogChanged`, the orchestrator redeploys production (same SHA) so the static and ISR pages pick up the change.

## 6. Fallback F-EXPORT: source not reachable from any transport

1. Blocker `B-EXPORT`: in the Replit project **Shell**, with the production database URL, run
   `pg_dump "$PROD_DATABASE_URL" --format=custom --no-owner --no-privileges --schema=public -f growmax-prod.dump`
   and upload the file to a **private** Google Drive folder `growmax-migration`.
2. The orchestrator downloads it via the Google Drive connector into `.scratch/`, restores it (§4), and verifies it against the dump (counts and per-table md5 from a scratch restore).
3. Automatic delta sync isn't possible. Instead:
   - The runbook requires a **content freeze** from the final dump until propagation completes.
   - A second owner dump right before step B is imported with `delta` semantics (restore into schema `_migration_import`, then run the §5 rules).
   - Google Chat notifications still cover demo requests during the window.

## 7. Gate criteria summary (details in VERIFICATION.md)

- **G4:**
  - The identity check passed.
  - Table sets are equal.
  - Counts and md5 are equal for every table.
  - `schema-diff --accept-pg-major 18` is empty (A1 C2; tool rules in §1).
  - Every sequence's next value > max id.
  - Extensions match.
  - Verified by the verifier from a fresh run.
- **G6 (data part):** the same after the refresh, plus every sequence's next value == `GAP_START`, and the watermarks are initialized.
- **G8b:** for every table, every source row with `id < GAP_START` is **reconciled**:
  - same id with an equal hash; or the same id with a newer target (`blog_posts` only); or
  - matched by natural key; or
  - listed as `target_deleted` with its deletion visible in `_migration.sync_log`.
  
  Plus no new source rows for 24 h, and ≥ 72 h since cutover (or the 7-day hard stop in SPEC-05 §4).
