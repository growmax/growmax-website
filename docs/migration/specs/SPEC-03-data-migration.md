# SPEC-03: Data migration (Replit Postgres → Neon via Vercel)

Steps: P0.2 (identity), P1.1, P4.1–P4.3, P6.4, P7/P8 delta sync. Gates: G0 (identity), G1, G4, G6 (final refresh), G8b.

## 0. Invariants (never violate)

1. **The source is read-only.** Every automated source session runs `SET default_transaction_read_only = on` straight after connecting, and does its reads inside `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY`. `pg_dump` is inherently read-only. The only source writes allowed anywhere are in `reverse-delta`, and only when the **owner** requests a rollback (SPEC-07). That mode needs both `--i-understand-this-writes-to-replit` and `ALLOW_SOURCE_WRITES=1`.
2. **No PII leaves the database hosts** except transiently in `docs/migration/.scratch/` (gitignored) or the Sandbox runner's `/tmp`. Evidence contains counts, ids and md5 hashes only.
3. **Never print connection strings.** Scripts mask `://user:pass@` → `://user:***@` in every log line and error message.
4. **Before cutover, Neon is disposable** (full refresh allowed). **After the `www` switch is detected, Neon is authoritative:** only additive operations, and `full-refresh` refuses to run.
5. Seed/import/enhance scripts and `drizzle-kit push` are **never** run against the source or Neon.

## 1. Scripts to build (P1.1 implements them; the reviewer checks them in P1.2)

All live in `scripts/migration/db/`. They're Node 22 ESM, use only `pg` (already a dependency) and built-ins, and output JSON to stdout plus `--out <file>`.

| Script | Purpose |
|---|---|
| `lib.mjs` | `maskUrl()`, `connect(url, {readOnly})`, deterministic session settings (`datestyle='ISO, MDY'`, `timezone='UTC'`, `intervalstyle='postgres'`, `extra_float_digits=3`, `bytea_output='hex'`), table discovery (public schema, PK detection) |
| `inventory.mjs --url-env SRC_URL` | Read-only catalog snapshot: `server_version_num`, encoding/collation, extensions, schemas, tables (exact counts, sizes), columns (type, nullability, default), constraints (`pg_get_constraintdef`), indexes (`pg_get_indexdef`), sequences (owner column, `last_value`, `is_called`), views, functions, triggers, and role **names** |
| `fingerprint.mjs --url-env X [--below-gap N] [--rows]` | Per table: `count(*)` and `md5(string_agg(t::text, E'\n' ORDER BY <pk>))`. For tables without a PK, order by `t::text`. `--below-gap` restricts to `id < N`. `--rows` adds `{id: md5(t::text)}` maps, used only to locate mismatches |
| `sync.mjs <mode>` | Modes `verify`, `full-refresh`, `gap`, `delta`, `reverse-delta` (§5). Idempotent. |
| `schema-diff.mjs` | Compares two `inventory` JSONs, ignoring owner/ACL/comments and the target's Neon-managed objects. Lists every column/constraint/index/sequence difference |

The runner environment gets secrets **only via env**: `SRC_URL` (= `REPLIT_DATABASE_URL`), `DST_URL` (Neon pooled), `DST_URL_UNPOOLED` (Neon direct, used for DDL, restore and `setval`).

## 2. Identity check: is this really production? (P0.2, gate G0)

1. Source (read-only): `SELECT slug, updated_at FROM blog_posts WHERE published ORDER BY slug`.
2. Live: `GET https://www.growmax.io/api/blog` (force-dynamic, so it reflects the production DB right now) → `[{slug, updatedAt}]`.
3. Remove the code-injected fallback article from the live list if its slug (`ARC_AI_ARTICLE_SLUG` in `lib/arcAiArticle.ts`) isn't in the source result.
4. **Pass** only if the slug sets are identical **and** every `updatedAt` equals `updated_at` (normalized to ISO ms, UTC). Any mismatch fails G0 → blocker `B-SRCDB`: "REPLIT_DATABASE_URL doesn't match the live site's data. Provide the *production* database URL used by the deployment."
5. Also record `server_version`, host kind (`neon` if the host ends with `.neon.tech`, else `other`), and whether the host looks internal (`helium`, no dots) → fallback F-EXPORT (§6).

## 3. Discovery (P1.1, gate G1)

- Run `inventory.mjs` and `fingerprint.mjs` on the source → `evidence/P1.1-source-inventory.json` and `evidence/P1.1-source-fingerprint.json`.
- Record `facts.source = {pgMajor, hostKind, tables: {name: count}, maxIds: {table: max}, extensions, extraTables: [non-Drizzle tables]}`.
- Produce local-verification fixtures (no PII): `pg_dump --schema-only --no-owner --no-privileges --schema=public` → `.scratch/schema.dump`, and `pg_dump --data-only -t public.blog_posts -t public.blog_redirects` → `.scratch/blog-tables.dump`. Download them from the runner into the container `.scratch/`.
- Compute `GAP_START = max(1_000_000, 10 × max(maxIds))` and record `sync.gapStart` (it's fixed from here on).

## 4. Full copy (P4.2) and final refresh (P6.4): db-operator, opus/high

**Pre-checks (P4.1):**
- Target reachable via `DST_URL_UNPOOLED`.
- `server_version` major ≥ source major.
- The target `public` schema has no user tables. On a refresh, instead check that it contains only the objects from the last restore TOC.
- Every non-`plpgsql` source extension is creatable on Neon (`CREATE EXTENSION IF NOT EXISTS …` before restore).

**Copy** (in the runner; `pg_dump` major ≥ source major):
```bash
pg_dump "$SRC_URL" --format=custom --no-owner --no-privileges --schema=public --file=/tmp/src.dump
pg_restore --list /tmp/src.dump > /tmp/src.toc          # keep; attach a summary to evidence
pg_restore --no-owner --no-privileges --exit-on-error --single-transaction \
           [--clean --if-exists  # refresh mode only] \
           --dbname="$DST_URL_UNPOOLED" /tmp/src.dump
psql "$DST_URL_UNPOOLED" -c 'ANALYZE'
```
- If restore trips over `SCHEMA public` / `COMMENT ON SCHEMA public` entries, filter them out of the TOC (`grep -v`) and restore with `-L`.
- **Node ETL fallback**, only if `pg_dump` can't be installed in any runner:
  - Create the schema from the source `inventory` (tables, columns, defaults, constraints, indexes, sequences, owned-by), then run `schema-diff` until it's empty.
  - Copy data table by table with `SELECT row_to_json(t) FROM t ORDER BY pk` → `INSERT INTO t SELECT * FROM json_populate_record(NULL::t, $1)`.
  - Set sequences from the source values.

**Refresh-mode guard (P6.4):** `sync.mjs full-refresh` runs only with `--confirm-pre-cutover`. The orchestrator passes it only after checking that `www.growmax.io` still resolves to the Replit IP (`34.111.179.208`), not to Vercel. The script re-checks that itself through `getaddrinfo`.

**After the P6.4 refresh:**
1. `sync.mjs gap`: for every sequence owned by a `public` column, set `setval(seq, GAP_START, false)`, so the next id is `GAP_START`. Only do this if the sequence's current next value is < `GAP_START`. **Never move a sequence backwards.**
2. Redeploy production with the same SHA, so build-time and ISR pages (`/blog`, `/sitemap.xml`, `/llms*.txt`) regenerate from the final data.
3. Quick parity check on the DB-driven URLs.

The P6.4 refresh also wipes any P5 test rows.

## 5. Sync modes (`sync.mjs`)

| Mode | When | Behavior |
|---|---|---|
| `verify [--below-gap]` | P4.3, after every sync | Fingerprints both sides (target restricted to `id < GAP_START` once the gap exists). Output: per-table `{srcCount, dstCount, srcMd5, dstMd5, match}`, plus the differing ids when `--rows`. |
| `full-refresh --confirm-pre-cutover` | P6.4 only (and P4 re-runs) | §4 with `--clean --if-exists`, then `gap`, then `verify`. |
| `gap` | P6.4 | As above. Records the final sequence values. |
| `delta` | Every P7/P8 check-in | **Additive only.** For each table, in order `blog_redirects`, `blog_posts`, `newsletter_subscriptions`, `demo_requests`, then any extra tables: (1) `tmax` = target `max(id) WHERE id < GAP_START`. (2) Source (read-only): rows with `tmax < id < GAP_START`. (3) Insert into the target with **original ids** via `INSERT INTO t SELECT * FROM json_populate_record(NULL::t, $1) ON CONFLICT DO NOTHING`; count `inserted` and `conflicts` (unique email/slug/old_path collisions are logged by table and id only). (4) `blog_posts` only: for ids in both with `id < GAP_START` and source `updated_at` > target `updated_at`, update the target row from the source. (5) Report the count of `id < GAP_START` rows present in the target but missing in the source (**never** auto-delete). Output includes `blogChanged: bool`. If true, the orchestrator redeploys production (same SHA) so static/ISR pages pick up the change. |
| `reverse-delta` | Rollback only, owner-requested | Target rows with `id ≥ GAP_START` → source (same insert technique, `ON CONFLICT DO NOTHING`). Plus `blog_posts` edited on the target after `facts.cutover.detectedAt` → update the source. Requires the two write-enabling guards from §0. |

Every mode writes `evidence/<step>-sync-<mode>-<n>.json` and exits non-zero on any mismatch or error.

## 6. Fallback F-EXPORT: source not reachable from any runner

This happens if the host is Replit-internal or the connection is refused from both the container and the Sandbox.

1. Add blocker `B-EXPORT` with these owner instructions. In the Replit project's **Shell**, using the production database URL, run:
   `pg_dump "$PROD_DATABASE_URL" --format=custom --no-owner --no-privileges --schema=public -f growmax-prod.dump`
   Then upload the file to a **private** Google Drive folder named `growmax-migration`.
2. The orchestrator finds and downloads it through the Google Drive connector into `.scratch/`, restores it (§4), and verifies it against the dump itself (restore → `fingerprint` → compare with `pg_restore --data-only -f - | md5`-style counts).
3. Automatic delta sync isn't possible. Instead:
   - The runbook requires a **content freeze** from the final dump until DNS propagation completes.
   - The owner provides a second dump right before switching DNS, and it's imported with `delta` semantics (import into a scratch schema, then additive copy).
   - Google Chat notifications still cover demo requests during the window.

## 7. Gate criteria summary (details in VERIFICATION.md)

- **G4:**
  - Table set is equal.
  - For every table, `srcCount == dstCount` and `srcMd5 == dstMd5`.
  - `schema-diff` is empty (ignoring owner/ACL/comments).
  - Every sequence's next value > max id.
  - Extensions match.
  - Verified by the **verifier** from a fresh run, not from the operator's output.
- **G6 (data part):** same as G4 after the refresh, plus every sequence's next value is `GAP_START`.
- **G8b:** At the end of reconciliation:
  - For every table, the set of source ids `< GAP_START` ⊆ target ids.
  - For every shared id, the rows hash-equal (or the target is newer for `blog_posts`).
  - No new source rows for 24 h.
  - ≥ 72 h since cutover.
