# SPEC-04: Verification (parity harness, functional, visual, performance, logs)

Steps: P1.2 (build + self-test), P1.3 (baseline), P5.2 / P6.2 / P8.2 (suites). Gates: G1, G5, G6a, G8a.

The harness is the backbone of the "100% verification" requirement. **A harness that can false-pass is worse than none**, so it's built with a self-test that must catch deliberate mutations, and it's adversarially reviewed (opus/high) before it's used for any gate.

## 1. Layout

A separate package keeps the app's dependencies untouched:

```
scripts/migration/package.json       # own deps + lockfile: e.g. linkedom or node-html-parser, pixelmatch, pngjs, playwright-core
scripts/migration/parity/urls.mjs     # build the URL inventory
scripts/migration/parity/capture.mjs  # fetch + extract → manifest.json
scripts/migration/parity/compare.mjs  # manifest A vs B (+ allowlist) → diff.json, exit≠0 on unallowed diffs
scripts/migration/parity/selftest.mjs # mutation self-test (must pass before any gate use)
scripts/migration/functional/run.mjs  # form, admin and API behavior tests
scripts/migration/visual/run.mjs      # Playwright screenshots + pixel diff (container only)
scripts/migration/perf/run.mjs        # TTFB sampling (report-only)
```
Install with `npm --prefix scripts/migration ci`. Node's `fetch` must use the proxy in the container: run with `NODE_USE_ENV_PROXY=1`. The root `node_modules` ignore rule covers `scripts/migration/node_modules`.

## 2. URL inventory (`urls.mjs`)

Build the union of the following sources, deduplicated, and store it as `evidence/P1.3-url-inventory.json`. URLs are public, so they're safe to commit.

> **Addendum 2026-09-26 (orchestrator; makes coverage stricter).** Replit's `/sitemap.xml` is a build-time snapshot: its newest `lastmod` was ~2026-09-22T01:56Z, so it lacked 9 posts published later, and 7 of them were missing from the P1.3 inventory. So two sources are added: **1b.** every published slug in A's live `/api/blog`, as `/blog/<slug>` (tagged `blog-api-slug`); **1c.** from P5.2 on, every `<loc>` in B's `/sitemap.xml` too (tagged `sitemap-b`). The compact baseline-manifest mode (advisor A1 C9) is described in §3 (capture) and §4 (compare).

1. Every `<loc>` in the live `/sitemap.xml`, converted to paths.
2. Every `source` in `gsc-indexing-redirects.ts` and in `next.config.ts` `redirects()`. Parse the files statically. Don't import `next.config.ts`.
3. Every DB redirect as `/blog/<old_path>`. The list comes from P1.1: `old_path → new_path` pairs are public URL fragments and may be committed.
4. Special routes:
   - `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`
   - `/favicon.png`, `/opengraph.jpg`, `/icon-512.png`, `/logo-color.png`, `/replay/index.json`
   - `/api/blog`, `/api/blog/<first 3 slugs>`, `/api/blog/__parity_missing__`
   - `/api/blog-redirects?slug=<first old_path>`, `/api/blog-redirects?slug=__nope__`
   - `/api/admin/session` (expect `{"isAdmin":false}`), `/api/admin/posts` (expect 401)
5. Pages not in the sitemap: `/minori-ai/original`, `/minori-ai-2`, `/admin`, `/admin/login`, `/revenue-platform/dealer-portals`.
6. Variants: `/blog?page=2` (expect `X-Robots-Tag: noindex, follow`), `/demo/`, `/blog/` (trailing slash).
7. Negatives: `/__parity_404_probe__`, `/blog/__parity_404_probe__`.
8. **Post-cutover only:** `http://www.growmax.io/`, `http://growmax.io/`, `https://growmax.io/`, `https://growmax.io/demo`.

**Baselines:**
- `P1.3-baseline-manifest.json` is the discovery baseline.
- **`P6.5-baseline-manifest.json`** is a fresh capture of live Replit taken at P6.5, after the `main` merge and the final refresh, while Replit is still serving. **P8.2 compares against the P6.5 baseline**, with the IP-pinned Replit capture as secondary.

Expect at least 250 URLs. Log the count per source. A shrinking inventory between runs is a failure unless it's explained, because it would mean silent coverage loss.

## 3. Capture (`capture.mjs`)

- Options: `--base <origin>`, `--urls <file>`, `--out <manifest.json>`, `--raw-dir <.scratch/raw-X>`, `--bypass-secret-file <f>` (adds **only** `x-vercel-protection-bypass` to every request; never `x-vercel-set-bypass-cookie`, which triggers a cookie-setting redirect), `--resolve <host:443:ip>` (**Sandbox runner only**: behind the container's proxy, DNS happens in the proxy), `--concurrency 4`, `--ua "growmax-migration-verifier/1.0"`.
- `redirect: 'manual'`. Retry 3× on network errors and 502/503/504, with backoff; never retry other 4xx/5xx. Record the attempt count.
- Record per URL:
  - `status`
  - `location`, normalized: absolute → path + query when the host is any known alias of the site (`www.growmax.io`, `growmax.io`, `*.vercel.app` deployment aliases, the Replit host)
  - `contentType` (mime only)
  - headers `x-robots-tag`, `cache-control`, `content-encoding`, `strict-transport-security`
  - `bytes`, `sha256(rawBody)`
- **HTML extraction:**
  - Page fields: `title`, meta `description`, `robots`, link `canonical`, all `og:*` / `twitter:*` metas, `html[lang]`, all `h1` texts.
  - JSON-LD blocks: parse each, canonicalize (sorted keys), then hash the array.
  - Visible text: body text excluding `script`, `style`, `noscript` and `template`; whitespace collapsed; sha256, and keep the text in `raw-dir` for diffing.
  - Internal link set: `href`s normalized to paths.
  - Image sources: `/_next/image?url=X&w=W&q=Q` → `img:X:W:Q`.
  - Strip or normalize build-specific noise before hashing: `/_next/static/<buildId>/…`, `?dpl=…`, `nonce=`, RSC `self.__next_f` payloads (they're scripts, so dropped).
- **XML** (`sitemap.xml`): the set of `{loc, changefreq, priority}`, plus `lastmod` **for blog URLs only** (static routes stamp generation time).
- **JSON:** canonical stringify with sorted keys. `/api/blog` is compared per slug, with **every** field (ids and timestamps are preserved by the copy).
- **Text** (`robots.txt`, `llms*.txt`): exact after normalizing line endings.
- **Binary:** sha256.
- **Compact mode** (`--compact`; addendum 2026-09-26, A1 C9): same capture path. `/api/blog` is stored as `jsonArrayLength`, a per-slug sha256 of each item's canonical JSON (`jsonBySlugHash`) and the slug multiset. The duplicated canonical strings are dropped. Large text bodies are stored as a hash plus a short preview. Raw bodies still go to `--raw-dir`. Use it for any manifest that must be committed (the P6.5 baseline) and stay under 5 MB.
- **`/api/blog` size** (A1 C10): every capture records its status, decoded byte size and array length.
- **`Link` header preloads** (added 2026-09-27 at P6.2). A page's `assetRefs` are every same-site asset the response tells the browser to fetch.
  - That includes the HTML elements extracted today, plus each `Link` response-header entry (RFC 8288) whose `rel` tokens include `preload` or `modulepreload`.
  - Parse `rel` case-insensitively; it may be quoted, and it may carry several space-separated values.
  - Resolve each target against the page URL. Apply the same same-site filter and path+search form as HTML refs.
  - Deduplicate a header target against the page's existing refs, compared with `dpl` stripped, so one asset never counts twice.
  - Record the header-derived subset separately as `linkHeaderRefs` for diagnostics.
  - Other `rel` values (`preconnect`, `dns-prefetch`, …), third-party targets, and a malformed header add nothing and never fail the capture.
  - Why: Next.js sends a dynamic render's preload hints as a `Link` header (Replit's blog posts: 2 CSS files and 5 fonts), but inlines them as `<link rel="preload">` in prerendered HTML (the ISR posts on Vercel after H1). The browser acts on both the same way, so counting only one form reports a difference no visitor can see.
- **compare.mjs outputs** (added 2026-09-27 at P6.2): the full `diff.json` copy and the trimmed committed copy never share a path. If `--scratch` resolves to the directory of `--out`, the full copy is written as `<basename>.full.json`.

## 4. Compare (`compare.mjs`) rules

| Field | Rule |
|---|---|
| status, normalized location, contentType, `x-robots-tag` | **exact** |
| title, description, robots, canonical, og/twitter, lang, h1s, JSON-LD hash, visible-text hash, internal links, image set | **exact** (HTML 2xx) |
| 404 responses | status + title only |
| sitemap / JSON / text / binary | as in §3 |
| `cache-control`, `content-encoding`, `strict-transport-security`, `bytes`, `server`, `age`, `x-vercel-*`, `date`, `etag` | **report-only** (expected platform differences) |
| URL present in A but missing in B (or the reverse) | **fail** |

- On a text-hash mismatch, write a unified diff of the normalized text to `.scratch/`. Summarize the first 5 lines per URL in the diff JSON.
- Classify each diff as `seo` / `content` / `redirect` / `status` / `data-freshness` / `date-render` / `other`.
  - `data-freshness`: the text differs only in content that comes from a DB row changed between captures. Re-sync and re-capture once before failing.
  - `date-render`: the only difference is a date string (R11). It needs advisor approval to allowlist.
- **Allowlist:** `docs/migration/evidence/allowlist.json` holds `[{url|pattern, field, reason, approvedBy: "A1|A2|A3", approvedAt}]`. Only advisor-approved entries are valid; compare rejects entries without `approvedBy`.
- Output:
  - `diff.json`: `{urlsA, urlsB, compared, passed, failedUnallowed, allowlisted, byCategory, diffs:[…≤200]}`. The committed copy stays under 200 KB; the full copy goes to `.scratch/`.
  - Exit code 0 only if `failedUnallowed == 0`.
- **Addendum 2026-09-26 (A1 C8–C10):**
  - **Mixed modes:** compare works for full/full, compact/full and full/compact. A full side is hashed on the fly with exactly the canonicalization compact capture uses, and sha256 allowlist pins work in every mode. When a text side is compact, the diff is built from the raw body in `--raw-dir` if it's present.
  - **`/api/blog` size:** the output always reports bytes and array length for both sides. Above 3,500,000 bytes it prints a WARNING, which never changes pass/fail.
  - **Tie order:** a diff on `/`, `/blog`, `/llms.txt`, `/llms-full.txt` or `/sitemap.xml` may be allowlisted only when `parity/tie-permutation.mjs` proves, on the page's own raw bodies, that B differs from A only by reordering posts with an identical `created_at`, and the residual text check is byte-identical. The entry must pin both observed values.
  - **A-side build-time staleness** (added 2026-09-27 per A3 for P5.3): a diff on `/` or `/sitemap.xml` may be allowlisted only when all of these hold: A's response carries a prerender/cache marker that predates the content (`x-nextjs-prerender` or `x-nextjs-cache: HIT` with a long `s-maxage`); every differing item is present in A's own live `/api/blog`; the set decomposition is exact (B-only additions, or a swap of the N latest posts); both observed values are pinned; and the unified text diff is attached. Approved per consult (A2/A3), never as a pattern. The pins break as soon as Replit publishes or edits a post or B is rebuilt on different data; re-pin only with the same proof.

## 5. Self-test (`selftest.mjs`), required before G1

1. Capture the live site once, then compare the manifest with itself → 0 diffs.
2. Clone it and apply **each** mutation separately. Each one must be detected (`failedUnallowed ≥ 1`):
   - change a title
   - drop a canonical
   - flip 308→301 on a redirect
   - change a `Location`
   - edit one JSON-LD field
   - change one word of body text
   - remove a URL
   - change a sitemap `lastmod` for a blog URL
   - reorder the `/api/blog` array (must be **not** detected, since it's order-insensitive by slug)
   - change one field of one `/api/blog` element (**must** be detected)
3. Capture the live site twice about 60 s apart and compare → 0 diffs, or only `data-freshness` diffs that are explained. This proves determinism.
4. **Protected-deployment probe (first run in P5.2, before any comparison):** capture `/` and one redirect source from the Vercel deployment with the bypass header. The result must be the app's own response (200, and the redirect with its configured status), not a 401 or a Vercel auth redirect. If it's wrong, the suite fails as `harness`, not as parity.
5. Write `evidence/P1.2-harness-selftest.json`. The reviewer (opus/high) then reads the harness source and this evidence and answers "could this harness pass while the sites differ in a way users or search engines would notice?" Any credible path is a blocking finding.

## 6. Functional tests (`functional/run.mjs`)

Options: `--base`, `--bypass-secret-file`, `--mode pre|post`, `--run-label <id>`, `--allow-demo-test`. DB assertions and cleanup go through `scripts/migration/db/` on the runner. Secrets come from env (`ADMIN_PASSWORD`). **Test data is always labeled** `vercel-migration-test-<runLabel>`.

| # | Test | Pass criteria |
|---|---|---|
| F1 | Newsletter `POST /api/newsletter {email: "vercel-migration-test+<runLabel>@growmax.io"}` | 201; row exists in Neon; then delete it by id; row gone |
| F2 | Demo request, **only** with `--allow-demo-test`. **At most 3 per migration**, one per verification attempt after a fix (`STATE.flags.demoTestsSent`, a counter the orchestrator increments before each attempt; never run it when the counter is ≥ 3). Body: firstName `MIGRATION`, lastName `TEST`, email as above, company `Growmax — automated Vercel migration test, please ignore`, companySize `1-10`, modules `["Migration test"]`, message `Automated post-migration verification. Please ignore.` | 201; row in Neon; within 90 s the Vercel runtime logs (`mcp__Vercel__get_runtime_logs`, query `[webhook]`) show `[webhook] delivered 200`; then delete the row |
| F3 | Admin: wrong password | 401 |
| F4 | Admin: correct `ADMIN_PASSWORD` | 200; `Set-Cookie: growmax-admin` with HttpOnly, Secure, SameSite=Lax, Max-Age=86400 |
| F5 | `GET /api/admin/session` with the cookie | `{"isAdmin":true}` |
| F6 | `GET /api/admin/posts` | 200; length = `SELECT count(*) FROM blog_posts` |
| F7 | Create draft `vercel-migration-test-<runLabel>` (`published:false`) | 201; `GET /api/blog/<slug>` → 404 |
| F8 | Update its title; then delete it | 200 / 200; no residue in Neon |
| F9 | Logout | then session → `{"isAdmin":false}`. The logout response must clear the exact `growmax-admin` cookie (RFC 6265 attributes, same Path and Domain as the login cookie). **Standing since A3 (P5.3):** corroborate in a real Chromium context (login through `/admin/login`, logout, `isAdmin:false`, no `growmax-admin` cookie left in `context.cookies()`) on every suite run (P6.2, P8.2) |
| F10 | Unauthenticated admin API: GET, POST, PUT, DELETE | all 401 |
| F11 | `/api/blog-redirects?slug=<old>` | `{"newSlug":"<new>"}` |

Write the result to `evidence/<step>-functional.json`. It holds statuses and booleans only, never PII.

## 7. Visual (`visual/run.mjs`), container only, secondary evidence

- Playwright via `playwright-core` with Chromium from `/opt/pw-browsers`. Pass the proxy (`HTTPS_PROXY`) to the browser launch, plus the bypass header on the Vercel side.
- Pages:
  - `/`, `/revenue-platform`, `/minori-ai`, `/demo`, `/blog`
  - one blog post, one comparison page, one industry page
  - `/company/about`, `/privacy`
- Viewports: 1440×900 and 390×844.
- Setup: `reducedMotion: 'reduce'`, inject `*{animation:none!important;transition:none!important;caret-color:transparent!important}`, wait for `networkidle` plus fonts.
- `pixelmatch` ratio per page:
  - ≤ 0.5% pass
  - 0.5–3% the verifier inspects the diff PNG (it can read images) and explains
  - \> 3% fail unless the difference is explained by data freshness
- Also collect console errors and failed requests. **New** errors on Vercel that don't happen on Replit fail the check.
  - Failed requests compare by a normalized key (A3, P5.3): third-party = method + `scheme://host` + pathname + failure text (query and fragment ignored, since analytics beacons randomize them); first-party (the page host, `www.growmax.io`, `growmax.io`) = method + pathname + search + failure text. Raw URLs stay in the evidence. A residual entry passes only when it is listed by key and explained with evidence (for example a Next.js RSC prefetch cancelled at page teardown that answers 200 when requested directly and that A issues too).
- If the container can't reach both sites, record `status: "not_run"` with the reason (it doesn't block G5 if parity and functional passed).

## 8. Performance (report-only) and logs

- `perf/run.mjs`: 20 URLs (the home page, the key product pages, the blog index, 5 posts, `/api/blog`, `/sitemap.xml`) × 3 samples per side; median TTFB and total time. Flag it for the advisor if Vercel's median TTFB is more than 1.5× Replit's on more than 3 URLs.
- Logs (scout): Vercel build log warnings summary, plus runtime errors since the deployment (`mcp__Vercel__get_runtime_errors`, or `get_runtime_logs` with `level: ["error","fatal"]`). **Pass** only if there are zero errors, or every error is explained by a test we ran deliberately.
- **Addendum 2026-09-27 (A3 for P6.2):**
  - **Logs, strictly.** The scout passes the logs check only on the two literal conditions: zero error-level lines, or every error-level line caused by a test we ran deliberately. Any other error- or warning-level line fails, with a root-cause note. The scout never passes it as "benign" or "informational". Only an advisor consult (A2/A3) may accept such a line, by named class, with its fix or filter tracked to a step. At G5, 42 pg `sslmode` notices were passed as informational; H6 fixed that class. The SPEC-06 uptime workflow filters nothing by default.
  - **Perf hygiene.**
    - Record `x-vercel-cache` (B) and `x-nextjs-cache` / `cache-control` (A) for every sample.
    - Send one discarded warm-up GET per URL.
    - Run perf before the functional writes, or after the paths H2 revalidates (`/blog`, `/sitemap.xml`, `/llms*.txt`, `/api/blog`) have each been re-fetched once.
    - Attribute every flag in the gate note.
    - At P8.2, if the flag recurs on ISR or static pages with B medians above 100 ms, take one sample set from the Sandbox, which removes the container proxy from the path, before A4.

## 9. Suite composition (`.claude/workflows/mig-verify-suite.js`)

Parity (verifier), functional (verifier) and visual (verifier) run in parallel. **Raw bodies are always retained** (`capture.mjs --raw-dir` on both sides, `compare.mjs --raw-dir-a/--raw-dir-b`) so the §4 unified text diff is written on every text-hash mismatch; no allowlist approval without it (A3, P5.3). For P8.2, `/` and `/sitemap.xml` compared with the P6.5 live-Replit baseline are expected to differ by A-side staleness: A2 either approves pinned entries for them or specifies comparing those two URLs with B's own P6.4 quick-parity capture. Logs+perf (scout) runs **after** functional finishes. It records the `since`/`until` window and the plan's log retention, and treats "no log lines at all while the tests ran" as a **fail**, because an empty window proves nothing. **Addendum 2026-09-27 (A3 for P6.2, C-A3b-5):**
- The P6.5 live-Replit baseline must be captured with the parity harness at `2565667` or later, and the P6.5 verifier asserts that every 2xx HTML entry carries `stylesheetRefs`.
- P8.2's compare must report `stylesheetRefsBothAbsent` = 0; otherwise the stylesheet check has silently skipped.
- Before P8.2, compare.mjs gains three things, with a short opus review:
  - a `stylesheetRefsMissing` field (one side null) in `FORBIDDEN_ALLOWLIST_FIELDS`;
  - a diff for a page where both sides hit `htmlError`;
  - a `harness.stylesheetRefs` manifest marker.
- No consult ever approves an allowlist entry for `stylesheetRefs` or for any one-side-null field.

Synthesis (verifier) then writes `evidence/<step>-suite-summary.json`:

```json
{
  "step": "P5.2",
  "baseA": "https://www.growmax.io",
  "baseB": "https://growmax-website.vercel.app",
  "parity": {"status": "pass|fail", "urls": 0, "failedUnallowed": 0},
  "functional": {"status": "pass|fail", "failed": []},
  "visual": {"status": "pass|fail|not_run", "flagged": []},
  "logs": {"status": "pass|fail", "errors": 0},
  "perf": {"flagged": []},
  "overall": "pass|fail",
  "blockingIssues": []
}
```
