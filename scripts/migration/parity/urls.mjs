#!/usr/bin/env node
// SPEC-04 §2: build the URL inventory.
//
// Usage:
//   node urls.mjs --base https://www.growmax.io --out ../../../docs/migration/evidence/P1.3-url-inventory.json \
//     [--base-b <B origin, P5.2+>] [--include-post-cutover] \
//     [--previous <inventory.json> [--explain "reason a source shrank"]]
//
// Importable as a module via `buildInventory(opts)`.
//
// The DB-redirect source (SPEC-04 §2.3) is read from P1.1's committed, read-only evidence
// file (docs/migration/evidence/P1.1-db-redirects.json), never queried live: a live query
// can fail or return nothing (missing REPLIT_DATABASE_URL, a transient error) and silently
// drop 95 URLs with only a console.warn, which used to let a shrunk inventory pass.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchOnce } from './lib/fetcher.mjs'
import { extractSitemap } from './lib/extract.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..')
const MIN_INVENTORY_SIZE = 250

/** Mask anything that looks like a credential in a URL before it ever hits stderr/evidence. */
function maskUrl(input) {
  if (input == null) return input
  return String(input).replace(/:\/\/([^:@/\s]+):([^@/\s]+)@/g, '://$1:***@')
}

function push(list, seen, url, source, expect) {
  if (seen.has(url)) return false
  seen.add(url)
  const entry = { url, source }
  if (expect) entry.expect = expect
  list.push(entry)
  return true
}

/** Statically parse `export const gscIndexingRedirects = [ {source: '...', ...}, ... ]`. */
async function parseGscRedirectSources() {
  const filePath = path.join(REPO_ROOT, 'gsc-indexing-redirects.ts')
  const text = await readFile(filePath, 'utf8')
  const sources = []
  const re = /source:\s*'([^']+)'/g
  let m
  while ((m = re.exec(text))) sources.push(m[1])
  return sources
}

/** Statically parse the `source:` fields inside next.config.ts's redirects() array. */
async function parseNextConfigRedirectSources() {
  const filePath = path.join(REPO_ROOT, 'next.config.ts')
  const text = await readFile(filePath, 'utf8')
  const match = text.match(/async redirects\(\)\s*{\s*return\s*\[([\s\S]*?)\n\s*\]\s*\n\s*}/)
  if (!match) return []
  const body = match[1]
  // Exclude the spread of gscIndexingRedirects; only literal { source: '...' } entries here.
  const sources = []
  const re = /\{\s*source:\s*'([^']+)'/g
  let m
  while ((m = re.exec(body))) sources.push(m[1])
  return sources
}

/**
 * blog_redirects (old_path -> new_path), from P1.1's committed evidence file, never a live
 * DB query. Required and non-empty: SPEC-04 §2.3's DB-redirect source (95 URLs) is exactly
 * the middleware/Neon path most likely to break on Vercel, so a missing or empty evidence
 * file is a hard failure here, not a silent [].
 */
let _dbRedirectsCache = null
async function readDbRedirectsEvidence({ dbRedirectsEvidencePath }) {
  if (_dbRedirectsCache) return _dbRedirectsCache
  const evidencePath = dbRedirectsEvidencePath || path.join(REPO_ROOT, 'docs', 'migration', 'evidence', 'P1.1-db-redirects.json')

  let raw
  try {
    raw = await readFile(evidencePath, 'utf8')
  } catch (err) {
    throw new Error(
      `Required P1.1 DB-redirects evidence is missing at ${evidencePath}: ${maskUrl(err.message)}. ` +
        `The DB-redirect source is not queried live (SPEC-04 §2.3); run P1.1 first.`,
    )
  }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    throw new Error(`P1.1 DB-redirects evidence at ${evidencePath} is not valid JSON: ${maskUrl(err.message)}`)
  }

  const rows = Array.isArray(parsed.redirects) ? parsed.redirects : []
  const redirects = rows
    .map((r) => ({ oldPath: r.oldPath ?? r.old_path }))
    .filter((r) => !!r.oldPath)

  if (redirects.length === 0) {
    throw new Error(
      `P1.1 DB-redirects evidence at ${evidencePath} has zero redirects; refusing to build an ` +
        `inventory that would silently drop the entire DB-redirect source.`,
    )
  }

  _dbRedirectsCache = redirects
  return _dbRedirectsCache
}

/** Fetch and parse a sitemap.xml, converting each <loc> to a fetchable path. Throws loudly
 *  on any fetch/parse failure — never returns an empty list silently (see the addendum:
 *  a silent 0 here is exactly the failure mode the reviewer flagged before). `bypassSecret`,
 *  when given, is sent ONLY as `x-vercel-protection-bypass` to this exact `sitemapBase` — the
 *  caller must never pass it for A's fetch (see buildInventory: only B's ever gets one). */
async function fetchSitemapPaths(sitemapBase, fetchImpl, label, bypassSecret) {
  const r = await fetchImpl(new URL('/sitemap.xml', sitemapBase).toString(), bypassSecret ? { bypassSecret } : {})
  if (!r.ok) {
    throw new Error(`${label} sitemap.xml fetch failed: ${maskUrl(String(r.error?.message || r.error || 'unknown error'))}`)
  }
  if (r.res.status !== 200) {
    throw new Error(`${label} sitemap.xml returned HTTP ${r.res.status}, expected 200`)
  }
  const entries = extractSitemap(r.buf.toString('utf8'))
  if (entries.length === 0) {
    throw new Error(`${label} sitemap.xml parsed to zero <loc> entries`)
  }
  const paths = []
  for (const e of entries) {
    if (!e.loc) continue
    let fetchPath
    try {
      const u = new URL(e.loc)
      fetchPath = u.pathname + (u.search || '')
    } catch {
      fetchPath = e.loc
    }
    paths.push(fetchPath)
  }
  return paths
}

export async function buildInventory(opts) {
  const {
    base,
    baseB = null,
    // Sent ONLY as x-vercel-protection-bypass, and ONLY to `baseB` (never to `base`,
    // www.growmax.io, or any other host) — see fetchSitemapPaths and its one call site below.
    baseBBypassSecret = null,
    includePostCutover = false,
    fetchImpl = fetchOnce,
    dbRedirectsEvidencePath = null,
  } = opts

  const list = []
  const seen = new Set()
  const counts = {}
  const record = (source, url, expect) => {
    // Only count a URL toward its source when it's actually new: previously counts[source]
    // was incremented unconditionally, so a source whose URLs all collide with one recorded
    // earlier (e.g. every db-blog-redirect old_path already appears in the sitemap) reported
    // a nonzero count while contributing zero distinct URLs — which would make the shrink
    // check below compare against numbers that were never real per-source counts.
    if (push(list, seen, url, source, expect)) {
      counts[source] = (counts[source] || 0) + 1
    }
  }

  // 1. sitemap.xml — a non-200 or empty sitemap is a hard failure: it silently drops the
  // largest single source (203 URLs in the last known-good inventory) and search engines
  // treat the sitemap as authoritative, so parity must too.
  for (const p of await fetchSitemapPaths(base, fetchImpl, 'A')) record('sitemap', p)

  // 1b/1c's REQUIRED fetches happen here (still hard-fail-loudly, never a silent []) so
  // apiBlogPosts is available for the special-api 3-slug sample below (section 4) — but per
  // review, the actual `record(...)` calls for these two sources are deferred to AFTER every
  // expect-bearing source (sections 4's admin URLs and section 6's /blog?page=2), so a
  // (currently impossible, but not provably so forever) URL collision can never let a
  // non-expect source claim a URL first and silently shadow its `expect` block — see the
  // recordDeferred1bAnd1c() call after section 6.
  //
  // Addendum 2026-09-26 (orchestrator): A's sitemap.xml is a build-time snapshot (its newest
  // lastmod was ~2026-09-22T01:56Z), so posts published after that build are missing from
  // it — 7 of the 9 newest were missing from the P1.3 inventory. Every published slug in A's
  // live /api/blog becomes /blog/<slug>, tagged 'blog-api-slug'.
  let apiBlogPosts
  const blogApiSlugUrls = []
  {
    const r = await fetchImpl(new URL('/api/blog', base).toString(), {})
    if (!r.ok) {
      throw new Error(`/api/blog fetch failed: ${maskUrl(String(r.error?.message || r.error || 'unknown error'))}`)
    }
    if (r.res.status !== 200) {
      throw new Error(`/api/blog returned HTTP ${r.res.status}, expected 200`)
    }
    try {
      apiBlogPosts = JSON.parse(r.buf.toString('utf8'))
    } catch (err) {
      throw new Error(`/api/blog did not parse as JSON: ${maskUrl(err.message)}`)
    }
    if (!Array.isArray(apiBlogPosts)) {
      throw new Error('/api/blog did not parse to an array')
    }
    for (const post of apiBlogPosts) {
      if (post && post.slug) blogApiSlugUrls.push(`/blog/${post.slug}`)
    }
  }

  // 1c. From P5.2 on, when a B base is given, every <loc> in B's /sitemap.xml too (source
  // 'sitemap-b'). Same hard-fail-on-error behavior as source 1. Per review: this must work
  // against the PROTECTED Vercel deployment, so `baseBBypassSecret` (if given) is sent as
  // `x-vercel-protection-bypass` — and ONLY to `baseB`, never to `base`/www.growmax.io or any
  // third party (fetchSitemapPaths's own call for A above never receives it).
  const sitemapBUrls = baseB ? await fetchSitemapPaths(baseB, fetchImpl, 'B', baseBBypassSecret) : []

  // 2. gsc-indexing-redirects.ts + next.config.ts redirects()
  for (const src of await parseGscRedirectSources()) record('next-config-gsc', src)
  for (const src of await parseNextConfigRedirectSources()) record('next-config-literal', src)

  // 3. DB redirects: SPEC-04 §2.3 says "/blog/<old_path>", which assumes old_path is a
  // bare slug. In the live data old_path is already a full path (e.g. "/blog/foo"), so
  // prefixing unconditionally would double it up (and would not be the URL a visitor
  // actually requests). Build the real public URL: use old_path as-is when it already
  // starts with /blog/, otherwise prefix it.
  const dbRedirects = await readDbRedirectsEvidence({ dbRedirectsEvidencePath })
  for (const { oldPath } of dbRedirects) {
    const p = oldPath.startsWith('/') ? oldPath : `/${oldPath}`
    const url = p.startsWith('/blog/') ? p : `/blog${p}`
    record('db-blog-redirect', url)
  }

  // 4. Special routes
  const specials = [
    '/robots.txt',
    '/sitemap.xml',
    '/llms.txt',
    '/llms-full.txt',
    '/favicon.png',
    '/opengraph.jpg',
    '/icon-512.png',
    '/logo-color.png',
    '/replay/index.json',
  ]
  for (const s of specials) record('special', s)

  // /api/blog + first 3 slugs + missing probe. Reuses the already-fetched (and
  // required-to-succeed, see 1b above) apiBlogPosts rather than fetching /api/blog again.
  record('special-api', '/api/blog')
  {
    const slugs = apiBlogPosts.map((p) => p.slug).filter(Boolean).slice(0, 3)
    for (const slug of slugs) record('special-api', `/api/blog/${slug}`)
  }
  record('special-api', '/api/blog/__parity_missing__')

  // /api/blog-redirects?slug=<first old_path> + nope probe
  record('special-api', `/api/blog-redirects?slug=${encodeURIComponent(dbRedirects[0].oldPath)}`)
  record('special-api', '/api/blog-redirects?slug=__nope__')

  // SPEC-04 §2.4: unauthenticated admin API behavior is a fixed expectation asserted against
  // B. It is additive: compare.mjs also A/B-compares these URLs (capture sends no cookies),
  // so a fixed-expectation pass never hides an A/B difference.
  record('special-api', '/api/admin/session', { status: 200, json: { isAdmin: false } })
  record('special-api', '/api/admin/posts', { status: 401 })

  // 5. Pages not in the sitemap
  const notInSitemap = [
    '/minori-ai/original',
    '/minori-ai-2',
    '/admin',
    '/admin/login',
    '/revenue-platform/dealer-portals',
  ]
  // No expect block here (P1.2 review r4): SPEC-04 §2.5 lists /admin and /admin/login with
  // no fixed expectation, and neither site sends X-Robots-Tag on them (middleware.ts only
  // matches /blog paths). They get the ordinary A/B compare (status, title, robots meta,
  // content, links), so a broken /admin on B still fails parity.
  for (const p of notInSitemap) record('not-in-sitemap', p)

  // 6. Variants. SPEC-04 §2.6: /blog?page=2 expects `X-Robots-Tag: noindex, follow`
  // (middleware.ts sets it for /blog?page=N, N>1). The expect block is additive: compare.mjs
  // still A/B-compares this URL as well (see compareManifests).
  record('variant', '/blog?page=2', { xRobotsTag: 'noindex, follow' })
  record('variant', '/demo/')
  record('variant', '/blog/')

  // 1b/1c recorded HERE (per review): after every expect-bearing source above (section 4's
  // /api/admin/session /api/admin/posts, section 6's /blog?page=2), so those sources always
  // win any URL collision and keep their `expect` block — push()'s dedupe is first-write-wins,
  // and neither of these two sources ever carries an `expect` itself.
  for (const url of blogApiSlugUrls) record('blog-api-slug', url)
  for (const url of sitemapBUrls) record('sitemap-b', url)

  // 7. Negatives
  record('negative', '/__parity_404_probe__')
  record('negative', '/blog/__parity_404_probe__')

  // 8. Post-cutover only (SPEC-04 §2.8). These are checked against a fixed `expect` in
  // compare.mjs, never against the pre-cutover A baseline: A has no meaningful redirect
  // behavior to diff against here (pre-cutover, http://www.growmax.io/ and the apex are
  // still Squarespace/Replit; see P1.4-dns-baseline.json and P1.4-http-behavior.json), and
  // a bare A-vs-B diff on `status`/`location` can never be allowlisted (compare.mjs forbids
  // it), which used to leave the only way to reach exit 0 as dropping these URLs entirely.
  // Location values use the exact tokens normalizeLocation() produces: requesting
  // http://www.growmax.io/ itself keeps the same host, so a same-host scheme-upgrade
  // redirect normalizes to `<self>`, not `<www>`; a request to the apex that redirects to
  // the (different) www host normalizes to `<www>`.
  // These are expect-only: compare.mjs skips the A/B compare for source 'post-cutover'.
  if (includePostCutover) {
    for (const { url, expect } of POST_CUTOVER_ENTRIES) record('post-cutover', url, expect)
  }

  return { list, counts }
}

/** SPEC-04 §2.8 post-cutover URLs and their fixed expectations (see buildInventory step 8).
 *  Exported so selftest.mjs can exercise the expect-only path without a live post-cutover
 *  capture. */
export const POST_CUTOVER_ENTRIES = Object.freeze([
  { url: 'http://www.growmax.io/', expect: { status: 308, location: 'https://<self>/' } },
  { url: 'http://growmax.io/', expect: { status: [301, 308], location: 'https://<www>/' } },
  { url: 'https://growmax.io/', expect: { status: [301, 308], location: 'https://<www>/' } },
  { url: 'https://growmax.io/demo', expect: { status: [301, 308], location: 'https://<www>/demo' } },
])

/**
 * "Shrinking inventory between runs is a failure" (SPEC-04 §2): compare against a previous
 * inventory file's counts and refuse silently. `--explain` documents an intentional shrink
 * (e.g. a page was legitimately removed) instead of suppressing the check.
 */
function checkForShrinkage(previous, current, explain) {
  const problems = []
  const prevUrls = new Set((previous.urls || []).map((u) => u.url))
  const currUrls = new Set(current.list.map((u) => u.url))
  const removed = [...prevUrls].filter((u) => !currUrls.has(u))

  const prevCounts = previous.counts || {}
  for (const [source, prevCount] of Object.entries(prevCounts)) {
    const currCount = current.counts[source] || 0
    if (currCount < prevCount) {
      problems.push(`source "${source}" shrank: ${prevCount} -> ${currCount}`)
    }
  }
  if (removed.length > 0) {
    problems.push(`${removed.length} URL(s) present before are now missing: ${removed.slice(0, 10).join(', ')}${removed.length > 10 ? ', ...' : ''}`)
  }

  if (problems.length > 0 && !explain) {
    throw new Error(
      `Inventory shrank vs --previous without --explain:\n  ${problems.join('\n  ')}\n` +
        `Pass --explain "<reason>" if this shrink is intentional.`,
    )
  }
  return problems
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) {
      out[key] = true
    } else {
      out[key] = next
      i++
    }
  }
  return out
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.base || !args.out) {
    console.error(
      'Usage: node urls.mjs --base <origin> --out <file> [--base-b <origin> [--bypass-secret-file <f>]] ' +
        '[--include-post-cutover] [--previous <inventory.json> [--explain "reason"]]',
    )
    process.exit(2)
  }

  // --bypass-secret-file is sent ONLY as x-vercel-protection-bypass to --base-b (source 1c's
  // sitemap fetch, for a protected Vercel deployment) — never to --base.
  const baseBBypassSecret = args['bypass-secret-file'] ? (await readFile(args['bypass-secret-file'], 'utf8')).trim() : null

  const { list, counts } = await buildInventory({
    base: args.base,
    baseB: typeof args['base-b'] === 'string' ? args['base-b'] : null,
    baseBBypassSecret,
    includePostCutover: !!args['include-post-cutover'],
  })

  console.log(`URL inventory: ${list.length} URLs`)
  for (const [source, n] of Object.entries(counts).sort()) {
    console.log(`  ${source}: ${n}`)
  }
  if (list.length < MIN_INVENTORY_SIZE) {
    console.error(`FAIL: inventory has only ${list.length} URLs, expected at least ${MIN_INVENTORY_SIZE}`)
    process.exit(1)
  }

  if (args.previous) {
    let previous
    try {
      previous = JSON.parse(await readFile(args.previous, 'utf8'))
    } catch (err) {
      console.error(`FAIL: could not read --previous ${maskUrl(args.previous)}: ${maskUrl(err.message)}`)
      process.exit(1)
    }
    try {
      const problems = checkForShrinkage(previous, { list, counts }, typeof args.explain === 'string' ? args.explain : null)
      if (problems.length > 0) {
        console.warn(`WARNING: inventory shrank vs --previous but was explained: ${args.explain}`)
        for (const p of problems) console.warn(`  ${p}`)
      }
    } catch (err) {
      console.error(`FAIL: ${maskUrl(err.message)}`)
      process.exit(1)
    }
  }

  const { writeFile, mkdir } = await import('node:fs/promises')
  await mkdir(path.dirname(args.out), { recursive: true })
  await writeFile(
    args.out,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), base: args.base, baseB: args['base-b'] || null, counts, urls: list },
      null,
      2,
    ),
  )
  console.log(`Wrote ${args.out}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(maskUrl(String(err?.stack || err)))
    process.exit(1)
  })
}
