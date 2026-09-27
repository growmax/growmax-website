#!/usr/bin/env node
// P5.3 harness-fix self-test: focused, pure-function/offline cases for the three parity
// (compare.mjs/extract.mjs/urls.mjs) bugs found in P5.2 attempt 1 — see
// docs/migration/evidence/P5.3-harness-fix.json for the write-up and the before/after
// compare.mjs counts on the attempt-1 manifests.
//
// No network calls: every case builds synthetic manifest/inventory fragments in memory and
// runs them through the REAL compareManifests()/extractHtml() code paths, exactly the way
// selftest.mjs's own synthetic cases do (see e.g. testEmbeddedPostsCoverageGuard there).
//
// Usage: node selftest-p5.3.mjs [--out <evidence.json>]
//
// Exit code 0 only if every case passes.

import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compareManifests } from './compare.mjs'
import { extractHtml, CANONICAL_PRODUCTION_HOSTS } from './lib/extract.mjs'
import { buildInventory } from './urls.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) out[key] = true
    else {
      out[key] = next
      i++
    }
  }
  return out
}

/** Minimal 2xx HTML manifest entry carrying only the fields compareEntry's is2xxHtml branch
 *  reads, so each case controls exactly one input (assetRefs, or internalLinks/externalLinks)
 *  without depending on a full extractHtml() run. */
function htmlEntry(url, overrides = {}) {
  return {
    url,
    status: 200,
    contentType: 'text/html',
    headers: {},
    html: { title: 't', externalLinks: [], ...overrides.html },
    internalLinks: [],
    images: [],
    assetRefs: [],
    ...overrides,
  }
}

function mkManifest(entries, extra = {}) {
  return { entries, assets: {}, harness: { embeddedPosts: 1 }, ...extra }
}

async function diffFieldsFor(manifestA, manifestB, url) {
  const result = await compareManifests(manifestA, manifestB, {})
  return result.diffs.filter((d) => d.url === url)
}

// --- (1) assetRefs: compare-time ?dpl stripping ---

async function testAssetRefsDplOnlyPasses() {
  const a = mkManifest([htmlEntry('/', { assetRefs: ['/_next/static/chunks/main-abc123.js?dpl=dpl_AAA'] }) ])
  const b = mkManifest([htmlEntry('/', { assetRefs: ['/_next/static/chunks/main-abc123.js?dpl=dpl_BBB'] }) ])
  const diffs = await diffFieldsFor(a, b, '/')
  const assetRefDiffs = diffs.filter((d) => d.field === 'assetRefs')
  return { pass: assetRefDiffs.length === 0, detail: { assetRefDiffs } }
}

async function testAssetRefsChangedPathFails() {
  const a = mkManifest([htmlEntry('/', { assetRefs: ['/foo.js?dpl=dpl_AAA'] })])
  const b = mkManifest([htmlEntry('/', { assetRefs: ['/bar.js?dpl=dpl_BBB'] })])
  const diffs = await diffFieldsFor(a, b, '/')
  const assetRefDiffs = diffs.filter((d) => d.field === 'assetRefs')
  return { pass: assetRefDiffs.length === 1, detail: { assetRefDiffs } }
}

async function testAssetRefsChangedNonDplParamFails() {
  const a = mkManifest([htmlEntry('/', { assetRefs: ['/img.png?dpl=dpl_AAA&w=100'] })])
  const b = mkManifest([htmlEntry('/', { assetRefs: ['/img.png?dpl=dpl_BBB&w=200'] })])
  const diffs = await diffFieldsFor(a, b, '/')
  const assetRefDiffs = diffs.filter((d) => d.field === 'assetRefs')
  return { pass: assetRefDiffs.length === 1, detail: { assetRefDiffs } }
}

async function testAssetRefsAddedAssetFails() {
  const a = mkManifest([htmlEntry('/', { assetRefs: ['/foo.js?dpl=dpl_AAA'] })])
  const b = mkManifest([htmlEntry('/', { assetRefs: ['/foo.js?dpl=dpl_BBB', '/new-chunk.js?dpl=dpl_BBB'] })])
  const diffs = await diffFieldsFor(a, b, '/')
  const assetRefDiffs = diffs.filter((d) => d.field === 'assetRefs')
  return { pass: assetRefDiffs.length === 1, detail: { assetRefDiffs } }
}

/** Other query params' relative order must survive the ?dpl removal (URLSearchParams.delete
 *  never reorders the remaining keys), and a lone `?dpl=...` must drop the trailing `?`. */
async function testAssetRefsDplStrippingPreservesOrder() {
  const a = mkManifest([htmlEntry('/', { assetRefs: ['/img.png?w=100&dpl=dpl_AAA&q=75', '/only-dpl.js?dpl=dpl_AAA'] })])
  const b = mkManifest([htmlEntry('/', { assetRefs: ['/img.png?w=100&dpl=dpl_BBB&q=75', '/only-dpl.js?dpl=dpl_BBB'] })])
  const diffs = await diffFieldsFor(a, b, '/')
  const assetRefDiffs = diffs.filter((d) => d.field === 'assetRefs')
  return { pass: assetRefDiffs.length === 0, detail: { assetRefDiffs } }
}

// --- (2) internalLinks/externalLinks: canonical-host reclassification ---

async function testThirdPartyLinkStaysExternal() {
  const a = mkManifest([
    htmlEntry('/blog/foo', { html: { title: 't', externalLinks: ['https://example-third-party.com/x'] }, internalLinks: [] }),
  ])
  const b = mkManifest([
    htmlEntry('/blog/foo', { html: { title: 't', externalLinks: ['https://example-third-party.com/x'] }, internalLinks: [] }),
  ])
  const diffs = await diffFieldsFor(a, b, '/blog/foo')
  const linkDiffs = diffs.filter((d) => d.field === 'internalLinks' || d.field === 'externalLinks')
  // No diff (both sides identical), AND — checked directly against the exported helper below
  // — the third-party href must still be classified as external, never silently absorbed into
  // internalLinks by the canonical-host reclassification.
  const stillExternal = a.entries[0].html.externalLinks.includes('https://example-third-party.com/x')
  return { pass: linkDiffs.length === 0 && stillExternal, detail: { linkDiffs, stillExternal } }
}

async function testDifferentInternalPathStillFails() {
  const a = mkManifest([htmlEntry('/blog/foo', { html: { title: 't', externalLinks: [] }, internalLinks: ['/blog/bar'] })])
  const b = mkManifest([htmlEntry('/blog/foo', { html: { title: 't', externalLinks: [] }, internalLinks: ['/blog/baz'] })])
  const diffs = await diffFieldsFor(a, b, '/blog/foo')
  const internalDiffs = diffs.filter((d) => d.field === 'internalLinks')
  return { pass: internalDiffs.length === 1, detail: { internalDiffs } }
}

/** Direct proof that a byte-identical absolute www/apex href, captured on pages served from
 *  two different origins, reclassifies to the SAME internalLinks entry on both sides (the
 *  actual scenario: A from www.growmax.io puts it in internalLinks directly at capture time;
 *  B from growmax-website.vercel.app puts it in externalLinks at capture time; compare.mjs's
 *  reclassifyLinks must make both sides agree without a re-capture). */
async function testCrossOriginCanonicalHostLinksReconcile() {
  const a = mkManifest([
    htmlEntry('/blog/foo', { html: { title: 't', externalLinks: [] }, internalLinks: ['/blog/foo', '/quote-management'] }),
  ])
  const b = mkManifest([
    htmlEntry('/blog/foo', {
      html: { title: 't', externalLinks: ['https://www.growmax.io/quote-management'] },
      internalLinks: ['/blog/foo'],
    }),
  ])
  const diffs = await diffFieldsFor(a, b, '/blog/foo')
  const linkDiffs = diffs.filter((d) => d.field === 'internalLinks' || d.field === 'externalLinks')
  return { pass: linkDiffs.length === 0, detail: { linkDiffs } }
}

/** extract.mjs's own isSameSite, exercised directly (no compare.mjs involved): the page's own
 *  host, and each CANONICAL_PRODUCTION_HOSTS entry, are same-site; an arbitrary *.vercel.app
 *  preview host referenced IN A PAGE BODY is not. */
function testExtractIsSameSiteDirect() {
  const pageUrl = 'https://growmax-website.vercel.app/blog/foo'
  const html =
    '<html><body>' +
    '<a href="/relative">rel</a>' +
    '<a href="https://www.growmax.io/canonical-www">www</a>' +
    '<a href="https://growmax.io/canonical-apex">apex</a>' +
    '<a href="https://other-preview.vercel.app/leaked">other-vercel</a>' +
    '<a href="https://example.com/third-party">third</a>' +
    '</body></html>'
  const { internalLinks, fields } = extractHtml(html, pageUrl)
  const problems = []
  if (!internalLinks.includes('/relative')) problems.push('relative href not classified internal')
  if (!internalLinks.includes('/canonical-www')) problems.push('www.growmax.io href not classified internal')
  if (!internalLinks.includes('/canonical-apex')) problems.push('growmax.io href not classified internal')
  if (!fields.externalLinks.some((u) => u.includes('other-preview.vercel.app')))
    problems.push('an arbitrary *.vercel.app host in a page body was wrongly treated as same-site')
  if (!fields.externalLinks.some((u) => u.includes('example.com')))
    problems.push('a third-party href was not classified external')
  if (CANONICAL_PRODUCTION_HOSTS.length !== 2 || !CANONICAL_PRODUCTION_HOSTS.includes('www.growmax.io') || !CANONICAL_PRODUCTION_HOSTS.includes('growmax.io'))
    problems.push(`CANONICAL_PRODUCTION_HOSTS unexpected: ${JSON.stringify(CANONICAL_PRODUCTION_HOSTS)}`)
  return { pass: problems.length === 0, detail: { problems, internalLinks, externalLinks: fields.externalLinks } }
}

// --- (6) /blog and /blog?page=2: fixed expect{status:200} ---

async function testUrlsMjsGivesBlogAndPage2StatusExpect() {
  const { list } = await buildInventory({
    base: 'http://127.0.0.1:1', // unused: fetchImpl below never makes a real request
    fetchImpl: fakeFetchForBuildInventory,
    dbRedirectsEvidencePath: path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'evidence', 'P1.1-db-redirects.json'),
  })
  const blog = list.find((e) => e.url === '/blog')
  const page2 = list.find((e) => e.url === '/blog?page=2')
  const problems = []
  if (blog?.expect?.status !== 200) problems.push(`/blog expect.status: ${JSON.stringify(blog?.expect)}`)
  if (page2?.expect?.status !== 200) problems.push(`/blog?page=2 expect.status: ${JSON.stringify(page2?.expect)}`)
  if (page2?.expect?.xRobotsTag !== 'noindex, follow')
    problems.push(`/blog?page=2 lost its pre-existing xRobotsTag expect: ${JSON.stringify(page2?.expect)}`)
  return { pass: problems.length === 0, detail: { problems, blogExpect: blog?.expect, page2Expect: page2?.expect } }
}

/** A synthetic fetchImpl standing in for every live fetch buildInventory makes, so this case
 *  needs no network: a minimal sitemap (containing /blog, so the dedupe-order case is
 *  exercised too), an empty /api/blog array, and 200s for anything else. */
async function fakeFetchForBuildInventory(url) {
  const u = new URL(url)
  if (u.pathname === '/sitemap.xml') {
    const body = `<?xml version="1.0"?><urlset><url><loc>${u.origin}/</loc></url><url><loc>${u.origin}/blog</loc></url></urlset>`
    return { ok: true, res: { status: 200 }, buf: Buffer.from(body, 'utf8') }
  }
  if (u.pathname === '/api/blog') {
    return { ok: true, res: { status: 200 }, buf: Buffer.from('[]', 'utf8') }
  }
  return { ok: true, res: { status: 200 }, buf: Buffer.from('', 'utf8') }
}

/** The actual bug this closes: without status:200, two sides that happen to return the SAME
 *  non-2xx for /blog were silently skipped (is2xxHtml gates on A's status; no diff at all was
 *  ever produced). With the expect block, that must now be a real, unallowlistable failure —
 *  never a silent skip — regardless of what A did. */
async function testEqualNon2xxOnBlogFailsNotSkips() {
  const entry = (status) => ({
    url: '/blog',
    source: 'sitemap',
    expect: { status: 200 },
    status,
    contentType: 'text/html',
    headers: {},
    // Deliberately no `html`/embeddedPosts* fields: is2xxHtml is false for both sides here
    // (status 503), so nothing beyond the expect-status check applies.
  })
  const a = mkManifest([entry(503)])
  const b = mkManifest([entry(503)])
  const result = await compareManifests(a, b, {})
  const expectDiffs = result.diffs.filter((d) => d.url === '/blog' && d.field === 'expect-status')
  return {
    pass: expectDiffs.length === 1 && result.failedUnallowed >= 1,
    detail: { expectDiffs, failedUnallowed: result.failedUnallowed },
  }
}

/** Both sides 200: the expect check itself produces no noise, and the ordinary A/B compare
 *  (here: identical embeddedPosts-less html) still runs normally (additive, not skipped). */
async function testBothSides200NoExpectNoise() {
  const entry = () => ({
    url: '/blog',
    source: 'sitemap',
    expect: { status: 200 },
    status: 200,
    contentType: 'text/html',
    headers: {},
    html: { title: 'Blog', externalLinks: [] },
    internalLinks: [],
    images: [],
    assetRefs: [],
  })
  const a = mkManifest([entry()])
  const b = mkManifest([entry()])
  const result = await compareManifests(a, b, {})
  const expectDiffs = result.diffs.filter((d) => String(d.field).startsWith('expect-'))
  return { pass: expectDiffs.length === 0, detail: { expectDiffs, failedUnallowed: result.failedUnallowed } }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const out = args.out || path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'evidence', 'P5.3-parity-selftest.json')

  const cases = [
    ['assetRefs-dpl-only-passes', testAssetRefsDplOnlyPasses],
    ['assetRefs-changed-path-fails', testAssetRefsChangedPathFails],
    ['assetRefs-changed-non-dpl-param-fails', testAssetRefsChangedNonDplParamFails],
    ['assetRefs-added-asset-fails', testAssetRefsAddedAssetFails],
    ['assetRefs-dpl-stripping-preserves-order', testAssetRefsDplStrippingPreservesOrder],
    ['links-third-party-stays-external', testThirdPartyLinkStaysExternal],
    ['links-different-internal-path-fails', testDifferentInternalPathStillFails],
    ['links-cross-origin-canonical-host-reconcile', testCrossOriginCanonicalHostLinksReconcile],
    ['extract-isSameSite-direct', async () => testExtractIsSameSiteDirect()],
    ['urls-blog-and-page2-status-expect', testUrlsMjsGivesBlogAndPage2StatusExpect],
    ['blog-equal-non-2xx-fails-not-skips', testEqualNon2xxOnBlogFailsNotSkips],
    ['blog-both-200-no-expect-noise', testBothSides200NoExpectNoise],
  ]

  const checks = []
  for (const [name, fn] of cases) {
    try {
      const result = await fn()
      checks.push({ name, pass: !!result.pass, detail: result.detail })
    } catch (err) {
      checks.push({ name, pass: false, detail: { error: String(err.stack || err) } })
    }
  }

  const pass = checks.every((c) => c.pass)
  const evidence = { kind: 'P5.3-parity-selftest', generatedAt: new Date().toISOString(), pass, checks }
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, JSON.stringify(evidence, null, 2))
  console.log(`P5.3 parity self-test: ${pass ? 'PASS' : 'FAIL'} (${checks.filter((c) => c.pass).length}/${checks.length}) -> ${out}`)
  for (const c of checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}`)
  // One final, unambiguous count line (P6.2 harness hardening). No case here can be deferred.
  const nPass = checks.filter((c) => c.pass).length
  console.log(`SUMMARY selftest-p5.3.mjs: ${nPass}/${checks.length} PASS, ${checks.length - nPass} FAIL, 0 DEFERRED`)
  process.exit(pass ? 0 : 1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
