# SPEC-02: Code changes

Two batches, verified separately:

- **M (minimal).** What Vercel needs for correct behavior. Steps P2.1–P2.4, gate G2 (and then G5).
- **H (hardening).** Availability and cost resilience on serverless. Step P6.1, gate G6a.

Rules for both batches:

- Change **only** what's listed here. User-visible output must stay byte-identical except where noted.
- Keep Replit compatibility (the `dev`/`start` scripts on port 5000 stay), so a rollback never needs a code change.
- Never touch `scripts/seed-*`, content files, or the design system.

---

## M-series (minimal, required)

### M1: Node version and dependency (`package.json`, `package-lock.json`)
- Add `"engines": { "node": "22.x" }`. Node 20 is EOL; the Vercel project uses 22.x. Replit's Node 20 only gets an npm warning.
- `npm install @vercel/functions@^3 --save` (latest verified at plan time: 3.9.9). Commit the lockfile change. `npm ci` must pass afterwards.

### M2: Fluid compute pool hygiene (`lib/db.ts`)
```ts
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { attachDatabasePool } from '@vercel/functions'
import * as schema from './schema'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set.')
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// Release idle clients before a Vercel Fluid compute instance suspends.
if (process.env.VERCEL) attachDatabasePool(pool)
export const db = drizzle(pool, { schema })
```
The guard keeps local/Replit behavior identical. Runtime uses the **pooled** `DATABASE_URL` from the Neon integration.

### M3: Demo-request webhook must survive serverless suspension (`app/api/demo-requests/route.ts`)
Today `fetch(webhookUrl…)` is fired without being awaited, and the response returns straight away. On Vercel the instance can suspend before delivery, which would silently drop sales notifications. Change it to:
- `import { NextResponse, after } from 'next/server'` (`after` is stable in Next ≥ 15.1; the lockfile pins 15.5.18).
- Read the URL from `process.env.GOOGLE_CHAT_WEBHOOK_URL`. **Delete the hardcoded URL** (key and token) from the source.
- If set: `after(async () => { … })` performs the **same** POST with the **byte-identical** `text` payload. Log `console.log('[webhook] delivered', res.status)` on 2xx, and `console.error('[webhook] Failed:', status | message)` otherwise. Never throw out of `after`.
- If unset: `console.warn('[webhook] GOOGLE_CHAT_WEBHOOK_URL not set; skipping notification')`.
- Response status and body stay unchanged (201 + created row; 400 on validation; 500 on error).

### M4: Ignore rules (`.gitignore`)
Must contain these entries (the plan-authoring commit already added them; verify they're present): `.vercel`, `.env`, `.env*.local`, `docs/migration/.scratch/`, `*.dump`.

### M5: No-change confirmations (audit only, record in evidence)
- `next.config.ts` redirects, including the duplicated `/arc` and `/arc/ai/connect` entries. First match wins; **keep as-is**. `allowedDevOrigins` is dev-only and harmless.
- `middleware.ts` works unchanged on the Edge runtime with a Neon URL. The only change is in H3.
- Nothing in `app/`, `components/` or `lib/` reads files from `attached_assets/` or `screenshots/`. Only `scripts/import-missing-blogs.ts` does, and it isn't part of the build.
- `app/layout.tsx` fonts (`next/font/google`) are fetched at build. Vercel builders reach Google Fonts.

---

## H-series (hardening, after G5)

### H1: ISR for blog posts with correct error semantics (`app/blog/[slug]/page.tsx`)
- Add `export const revalidate = 3600`.
- In both `generateMetadata` and the page, **don't swallow DB errors**. Call `storage.getBlogPostBySlug(slug)` without try/catch, and call `notFound()` only when the result is `undefined`.
  - Why: with ISR, a swallowed transient DB error would cache a 404 or a generic title for an hour. That's a real SEO hazard. A thrown error makes Next serve the last good (stale) page, or a 500 on first render.
- Output for existing slugs is unchanged. Unpublished posts stay reachable by slug, which is pre-existing behavior. Report it to the owner, but don't change it.

### H2: On-demand revalidation after admin edits (`app/api/admin/posts/route.ts`, `app/api/admin/posts/[id]/route.ts`)
- After a successful create/update/delete, call `revalidatePath` (from `next/cache`) for:
  - `/blog/<slug>`, including the **old** slug when an update renames it; fetch the post before update/delete to learn it.
  - `/blog`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/api/blog`.
- Wrap each call in try/catch. A revalidation failure must never fail the mutation or change its response.
- Benefit: editors see changes immediately. Today `/blog` can be stale for up to an hour.

### H3: Bounded database waits
- `middleware.ts`: race the `blog_redirects` lookup against a 1500 ms timeout. On timeout, fail open exactly like the existing `catch`.
- `lib/db.ts`: `new Pool({ connectionString, connectionTimeoutMillis: 10_000 })`. The node-postgres default is to wait forever.

### H4: Edge-cache the public posts list (`app/api/blog/route.ts`)
- Replace `export const dynamic = 'force-dynamic'` with `export const revalidate = 300`.
- Let errors throw so a stale response is served on regeneration failure.
- The body stays byte-identical. Only caching headers change, and they're allowlisted in SPEC-04.
- Why: `BlogPostClient` fetches this full list on **every** blog view. Uncached, that's one function invocation, one DB query and a multi-MB payload per view. It's the biggest cost and quota risk on Vercel/Neon.
- `/api/blog/[slug]` has no client usage; leave it unchanged.

---

## Local verification (P2.2, and again in P6.1): verifier, sonnet/medium

Everything runs in the container with no external network except the npm registry. Write the result to `evidence/P2.2-local-verify.json` (or `P6.1-…`).

1. `npm ci` and `npm run check` (tsc) both pass.
2. Local PG16:
   ```bash
   export PGB=/usr/lib/postgresql/16/bin S=docs/migration/.scratch/localpg
   install -d -o postgres "$S"
   runuser -u postgres -- $PGB/initdb -D "$S/data" -A trust -U postgres
   runuser -u postgres -- $PGB/pg_ctl -D "$S/data" -o "-p 54329 -k /tmp" -l "$S/log" start
   ```
   (initdb refuses root.) Create DB `growmax`. Load the **blog tables only** (`blog_posts`, `blog_redirects`, schema + data, no PII) from the P1.1 artifact `docs/migration/.scratch/blog-tables.dump`. Create the other tables schema-only from the P1.1 schema dump.
3. Build with `DATABASE_URL=postgresql://postgres@127.0.0.1:54329/growmax SESSION_SECRET=<random 48> ADMIN_PASSWORD=local-test npm run build`. It must pass.
4. `npx next start -p 3100`, then run the smoke list:
   - Every route in `lib/seo/indexableRoutes.ts` → 200.
   - 5 random published slugs → 200.
   - `/blog/does-not-exist-xyz` → 404.
   - Every `source` in `next.config.ts` + `gsc-indexing-redirects.ts` → expected status (308 permanent / 307 temporary) and `Location`, with the first-match semantics.
   - `/sitemap.xml` URL count = static routes + published posts (+ the fallback article if absent from the DB).
   - `/robots.txt`, `/llms.txt`, `/llms-full.txt` → 200.
   - `/api/blog` array length as above.
   - Admin: login with `local-test` → 200 + `growmax-admin` cookie; `/api/admin/posts` → 200; wrong password → 401.
5. M3 behavior with a **local mock** webhook (never the real one in local tests). Start a tiny HTTP listener on `127.0.0.1:39999`.
   - With `GOOGLE_CHAT_WEBHOOK_URL=http://127.0.0.1:39999/hook`, `POST /api/demo-requests` (valid body) → 201, and the mock receives exactly one POST whose `text` equals the original template.
   - With the variable unset → 201 plus the warning log.
6. H-only checks (P6.1):
   - Editing a post via the admin API makes `/blog/<slug>` reflect the change on the next request.
   - A killed DB (`pg_ctl stop`) makes an **already cached** `/blog/<slug>` still return 200, never 404.
   - `/api/blog` still returns 200 from cache.
7. Stop PG and remove `.scratch/localpg`.

## Review checklist (P2.3 / P6.1): reviewer, opus/high

- The diff touches only the files named above. No formatting churn. The webhook `text` template is byte-identical.
- No secret remains in the tree: `grep -rn "chat.googleapis.com" app lib components` is empty.
- `after` comes from `next/server`. `revalidatePath` comes from `next/cache`. `attachDatabasePool` is guarded by `process.env.VERCEL`.
- Error semantics: no path can cache a 404 because of a DB error (H1). Revalidation errors are swallowed (H2).
- `package-lock.json` is consistent (`npm ci` clean) and there are no unrelated dependency bumps.
- Verdict JSON: `{blocking: [...], nonBlocking: [...], approve: bool}`. Blocking findings go back to the implementer (max 2 rounds, then the escalation ladder).
