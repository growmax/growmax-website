#!/usr/bin/env node
// P6.2 harness self-test for the two SPEC-04 §3 addenda dated 2026-09-27:
//   - "Link header preloads": extract.mjs's RFC 8288 parser + capture.mjs's merge into
//     assetRefs (recorded as linkHeaderRefs), in full and compact mode;
//   - "compare.mjs outputs": the full and trimmed diff.json copies never share a path;
// plus the P6.2 harness hardening: stylesheetRefs (a header preload can no longer stand in
// for a missing <link rel=stylesheet>) and the unterminated-target parser case.
//
// No network: pure-function cases, plus capture() driven end to end with globalThis.fetch
// replaced by an in-memory stub (every request is logged, so the bypass-header and
// asset-fetch invariants are asserted on what capture() actually asked for), plus compare.mjs
// run as a child process on in-memory manifests written to a temp directory.
//
// Usage: node selftest-link-header.mjs [--out <evidence.json>]
// Exit code 0 only if every case passes.

import { writeFile, mkdir, mkdtemp, readFile, symlink, rm, access } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { capture } from './capture.mjs'
import { compareManifests, diffOutputPaths } from './compare.mjs'
import { extractHtml, parseLinkHeader, linkHeaderPreloadRefs, mergeLinkHeaderAssetRefs } from './lib/extract.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PAGE_WWW = 'https://www.growmax.io/blog/some-post'
const PAGE_VERCEL = 'https://growmax-website.vercel.app/blog/some-post'
const BASE_A = 'https://www.growmax.io'
const BASE_B = 'https://growmax-website.vercel.app'

// Real shape of Replit's dynamic blog-post response (public build asset names, observed
// 2026-09-27): 5 root-layout fonts and the 2 route stylesheets as a Link header.
const REPLIT_FONTS = [
  '/_next/static/media/26d4368bf94c0ec4-s.p.woff2',
  '/_next/static/media/37786be940ec402b-s.p.woff2',
  '/_next/static/media/98e207f02528a563-s.p.woff2',
  '/_next/static/media/d3ebbfd689654d3a-s.p.woff2',
  '/_next/static/media/db96af6b531dc71f-s.p.woff2',
]
const REPLIT_CSS = ['/_next/static/css/e0e0fae895f3fff8.css', '/_next/static/css/67ec1cc0bd707d2d.css']
const VERCEL_CSS = ['/_next/static/css/b05e81efd48e3db7.css', '/_next/static/css/67ec1cc0bd707d2d.css']
const DPL = 'dpl_SelftestOnly000000000000000'

const fontLink = (href) => `<${href}>; rel=preload; as="font"; crossorigin=""; type="font/woff2"`
const cssLink = (href) => `<${href}>; rel=preload; as="style"`
// Two header lines, as a server may send them; undici joins them with ", " on get().
const REPLIT_LINK_LINES = [REPLIT_FONTS.map(fontLink).join(', '), REPLIT_CSS.map(cssLink).join(', ')]

function postHtml(headLinks) {
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/>' +
    headLinks.join('') +
    '<title>Some post | Growmax</title><meta name="description" content="d"/>' +
    '<link rel="canonical" href="https://www.growmax.io/blog/some-post"/></head>' +
    '<body><h1>Some post</h1><p>Body text.</p><a href="/blog">Blog</a></body></html>'
  )
}
const stylesheetTag = (href) => `<link rel="stylesheet" href="${href}" data-precedence="next"/>`
const fontPreloadTag = (href) => `<link rel="preload" href="${href}" as="font" crossorigin="" type="font/woff2"/>`

const REPLIT_POST_HTML = postHtml(REPLIT_CSS.map(stylesheetTag))
const VERCEL_POST_HTML = postHtml([...REPLIT_FONTS.map(fontPreloadTag), ...VERCEL_CSS.map((c) => stylesheetTag(`${c}?dpl=${DPL}`))])

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

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// --- In-memory fetch stub for capture() ---

/** Replace globalThis.fetch for the duration of `fn` with a stub serving `routes`
 *  (absolute URL -> { status, headers: [[k, v], ...], body }). Every request is logged with
 *  its host, path and whether the bypass header was sent (never its value). Unknown URLs get
 *  a 404 so an unexpected fetch is visible rather than a network call. */
async function withStubFetch(routes, fn) {
  const log = []
  const realFetch = globalThis.fetch
  globalThis.fetch = async (input, init = {}) => {
    const u = new URL(String(input))
    const headers = init.headers || {}
    log.push({ host: u.host, path: u.pathname + u.search, bypass: Object.prototype.hasOwnProperty.call(headers, 'x-vercel-protection-bypass') })
    const route = routes[u.toString()]
    if (!route) return new Response('not found', { status: 404, headers: [['content-type', 'text/plain']] })
    return new Response(route.body, { status: route.status ?? 200, headers: route.headers || [] })
  }
  try {
    return { result: await fn(), log }
  } finally {
    globalThis.fetch = realFetch
  }
}

const CSS_BODY = 'body{margin:0}'
const FONT_BODY = Buffer.from('wOF2-selftest-font-bytes')

/** Asset routes for `base`: every font and CSS path (with and without the dpl query). */
function assetRoutes(base, cssPaths, extraPaths = []) {
  const routes = {}
  for (const f of [...REPLIT_FONTS, ...extraPaths]) routes[new URL(f, base).toString()] = { headers: [['content-type', 'font/woff2']], body: FONT_BODY }
  for (const c of cssPaths) {
    routes[new URL(c, base).toString()] = { headers: [['content-type', 'text/css; charset=utf-8']], body: CSS_BODY }
    routes[new URL(`${c}?dpl=${DPL}`, base).toString()] = { headers: [['content-type', 'text/css; charset=utf-8']], body: CSS_BODY }
  }
  return routes
}

function htmlRoute(body, linkLines = []) {
  return { headers: [['content-type', 'text/html; charset=utf-8'], ...linkLines.map((l) => ['link', l])], body }
}

async function captureReplitPost({ linkLines = REPLIT_LINK_LINES, compact = false } = {}) {
  const routes = { [`${BASE_A}/blog/some-post`]: htmlRoute(REPLIT_POST_HTML, linkLines), ...assetRoutes(BASE_A, REPLIT_CSS, ['/_next/static/media/aaaa1111bbbb2222-s.p.woff2']) }
  return withStubFetch(routes, () => capture({ base: BASE_A, urls: [{ url: '/blog/some-post', source: 'sitemap' }], concurrency: 2, compact }))
}

async function captureVercelPost({ compact = false } = {}) {
  const routes = { [`${BASE_B}/blog/some-post`]: htmlRoute(VERCEL_POST_HTML), ...assetRoutes(BASE_B, VERCEL_CSS) }
  return withStubFetch(routes, () => capture({ base: BASE_B, urls: [{ url: '/blog/some-post', source: 'sitemap' }], concurrency: 2, compact }))
}

// --- Parser / extraction cases ---

function testTwoHeadersJoined() {
  const joined = new Headers([
    ['link', '</_next/static/css/a.css>; rel=preload; as="style"'],
    ['link', '</_next/static/media/f-s.p.woff2>; rel=preload; as="font"; crossorigin=""'],
  ]).get('link')
  const refs = linkHeaderPreloadRefs(joined, PAGE_WWW)
  const want = ['/_next/static/css/a.css', '/_next/static/media/f-s.p.woff2']
  return { pass: joined.includes(', ') && eq(refs, want), detail: { joined, refs, want } }
}

function testCommasInsideUriAndQuotes() {
  const header =
    '</assets/a,b.css>; rel=preload; as="style"; title="one, two; three", ' +
    '</assets/c.js>; rel="modulepreload"; title="x\\"y, z", ' +
    '</assets/d.woff2?v=1,2>; rel=preload; as=font'
  const parsed = parseLinkHeader(header)
  const refs = linkHeaderPreloadRefs(header, PAGE_WWW)
  const want = ['/assets/a,b.css', '/assets/c.js', '/assets/d.woff2?v=1,2']
  const titlesOk = parsed[0]?.params.title === 'one, two; three' && parsed[1]?.params.title === 'x"y, z'
  return { pass: parsed.length === 3 && titlesOk && eq(refs, want), detail: { parsed, refs, want } }
}

function testRelVariants() {
  const cases = [
    ['</r/1.css>; rel="preload"', ['/r/1.css']],
    ['</r/2.css>; REL=PreLoad', ['/r/2.css']],
    ['</r/3.css>; rel="preload prefetch"', ['/r/3.css']],
    ['</r/4.css>; rel="prefetch  PRELOAD"', ['/r/4.css']],
    ['</r/5.js>; rel="modulepreload"', ['/r/5.js']],
    ['</r/6.js>; rel=ModulePreload', ['/r/6.js']],
    ['</r/7.js> ;rel = preload', ['/r/7.js']],
    ['</r/8.css>; rel="prefetch"', []],
    // RFC 8288 §3.3: only the first rel counts.
    ['</r/9.css>; rel=preconnect; rel=preload', []],
    ['</r/10.css>; rel=preload; rel=preconnect', ['/r/10.css']],
    // No rel at all.
    ['</r/11.css>; as="style"', []],
  ]
  const results = cases.map(([h, want]) => ({ h, want, got: linkHeaderPreloadRefs(h, PAGE_WWW) }))
  const bad = results.filter((r) => !eq(r.got, r.want))
  return { pass: bad.length === 0, detail: { bad, total: results.length } }
}

function testNonPreloadRelsAddNothing() {
  const header =
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin, ' +
    '</p/1.css>; rel=preconnect, </p/2.css>; rel="dns-prefetch", </p/3.css>; rel=stylesheet, ' +
    '</p/4.css>; rel="prefetch", </p/5.css>; rel=next, </p/6.css>; rel=canonical, </p/7.css>; rel=alternate'
  const refs = linkHeaderPreloadRefs(header, PAGE_WWW)
  const merged = mergeLinkHeaderAssetRefs(['/existing.css'], header, PAGE_WWW)
  return { pass: refs.length === 0 && eq(merged.assetRefs, ['/existing.css']) && merged.linkHeaderRefs.length === 0, detail: { refs, merged } }
}

function testTargets() {
  const header = [
    '</abs-path.css>',
    '<relative.css>',
    '<../up.css>',
    '<https://www.growmax.io/www.css?x=1>',
    '<https://growmax.io/apex.css>',
    '<https://growmax-website.vercel.app/own-deploy.css>',
    '<https://other-preview.vercel.app/other-deploy.css>',
    '<https://fonts.gstatic.com/s/inter.woff2>',
    '<//cdn.example.com/lib.js>',
    '<http://www.growmax.io/http-www.css>',
  ]
    .map((t) => `${t}; rel=preload; as=style`)
    .join(', ')
  // Page on www: own host + canonical hosts are same-site; any *.vercel.app host is not.
  const onWww = linkHeaderPreloadRefs(header, PAGE_WWW)
  const wantWww = ['/abs-path.css', '/blog/relative.css', '/up.css', '/www.css?x=1', '/apex.css', '/http-www.css']
  // Page on the Vercel deployment: its own host is same-site too; another deployment is not.
  const onVercel = linkHeaderPreloadRefs(header, PAGE_VERCEL)
  const wantVercel = ['/abs-path.css', '/blog/relative.css', '/up.css', '/www.css?x=1', '/apex.css', '/own-deploy.css', '/http-www.css']
  // Same filter and form as an HTML <link rel=preload> element.
  const htmlForm = extractHtml(
    '<html><head>' +
      ['/abs-path.css', 'relative.css', 'https://other-preview.vercel.app/o.css', 'https://growmax.io/apex.css', 'https://fonts.gstatic.com/s/inter.woff2']
        .map((h) => `<link rel="preload" as="style" href="${h}"/>`)
        .join('') +
      '</head><body></body></html>',
    PAGE_WWW,
  ).assetRefs
  const headerForm = linkHeaderPreloadRefs(
    ['</abs-path.css>', '<relative.css>', '<https://other-preview.vercel.app/o.css>', '<https://growmax.io/apex.css>', '<https://fonts.gstatic.com/s/inter.woff2>']
      .map((t) => `${t}; rel=preload`)
      .join(', '),
    PAGE_WWW,
  ).sort()
  const pass = eq(onWww, wantWww) && eq(onVercel, wantVercel) && eq(htmlForm, headerForm)
  return { pass, detail: { onWww, wantWww, onVercel, wantVercel, htmlForm, headerForm } }
}

function testDplDedupAgainstHtml() {
  // HTML has ?dpl, header doesn't: not added.
  const m1 = mergeLinkHeaderAssetRefs([`/_next/static/css/a.css?dpl=${DPL}`], '</_next/static/css/a.css>; rel=preload; as="style"', PAGE_VERCEL)
  // Header has ?dpl, HTML doesn't: not added.
  const m2 = mergeLinkHeaderAssetRefs(['/_next/static/css/a.css'], `</_next/static/css/a.css?dpl=${DPL}>; rel=preload`, PAGE_VERCEL)
  // Differs by another query parameter: a different asset, added.
  const m3 = mergeLinkHeaderAssetRefs([`/_next/static/css/a.css?dpl=${DPL}`], '</_next/static/css/a.css?v=2>; rel=preload', PAGE_VERCEL)
  // Exact equal: not added.
  const m4 = mergeLinkHeaderAssetRefs(['/f.woff2'], '</f.woff2>; rel=preload; as=font', PAGE_VERCEL)
  const pass =
    eq(m1.assetRefs, [`/_next/static/css/a.css?dpl=${DPL}`]) &&
    eq(m1.linkHeaderRefs, ['/_next/static/css/a.css']) &&
    eq(m2.assetRefs, ['/_next/static/css/a.css']) &&
    eq(m3.assetRefs, [`/_next/static/css/a.css?dpl=${DPL}`, '/_next/static/css/a.css?v=2']) &&
    eq(m4.assetRefs, ['/f.woff2'])
  return { pass, detail: { m1, m2, m3, m4 } }
}

function testDuplicatesInsideHeader() {
  const header = [
    '</d/f.woff2>; rel=preload; as=font',
    '</d/f.woff2>; rel="preload"; as="font"',
    `</d/f.woff2?dpl=${DPL}>; rel=preload`,
    '<https://www.growmax.io/d/f.woff2>; rel=modulepreload',
    '</d/g.css>; rel=preload',
    '</d/g.css>; rel=preload',
  ].join(', ')
  const refs = linkHeaderPreloadRefs(header, PAGE_WWW)
  const merged = mergeLinkHeaderAssetRefs([], header, PAGE_WWW)
  const pass = eq(refs, ['/d/f.woff2', '/d/g.css']) && eq(merged.assetRefs, ['/d/f.woff2', '/d/g.css'])
  return { pass, detail: { refs, merged } }
}

function testMalformedNeverThrowsAddsNothing() {
  const inputs = [
    undefined,
    null,
    42,
    {},
    ['</a.css>; rel=preload'],
    '',
    ' ',
    ',,, ,',
    'garbage',
    'rel=preload',
    '/a.css; rel=preload',
    '<unterminated; rel=preload',
    '</a.css; rel=preload',
    '</a.css>; rel="preload',
    '</a.css>; rel="preload; as=style, </b.css>; rel=preload',
    '</a.css> rel=preload',
    '</a.css>; rel=preload junk',
    '</a.css>; =preload',
    '</a.css>; rel=preload; @bad=1',
    '<>; rel=preload',
    '<   >; rel=preload',
    ';;;',
    '<http://[::1>; rel=preload',
    '<https://exa mple.com/x>; rel=preload',
    '\u0000￿<\u0000>; rel=\u0000preload',
  ]
  const problems = []
  for (const input of inputs) {
    try {
      const refs = linkHeaderPreloadRefs(input, PAGE_WWW)
      const merged = mergeLinkHeaderAssetRefs(['/keep.css'], input, PAGE_WWW)
      if (refs.length !== 0) problems.push({ input: String(input), refs })
      if (!eq(merged.assetRefs, ['/keep.css']) || merged.linkHeaderRefs.length !== 0) problems.push({ input: String(input), merged })
      parseLinkHeader(input)
    } catch (err) {
      problems.push({ input: String(input), threw: String(err) })
    }
  }
  // A malformed link-value on its own adds nothing, and doesn't poison a later valid one.
  const recovered = linkHeaderPreloadRefs('garbage; rel=preload, </ok.css>; rel=preload', PAGE_WWW)
  const recovered2 = linkHeaderPreloadRefs('</bad.css> junk, </ok2.css>; rel=preload', PAGE_WWW)
  if (!eq(recovered, ['/ok.css'])) problems.push({ case: 'recovery-after-garbage', recovered })
  if (!eq(recovered2, ['/ok2.css'])) problems.push({ case: 'recovery-after-junk', recovered2 })
  // P6.2 hardening (reviewer's case): a link-value with no closing '>' must not borrow a later
  // value's '>' ('/blog/unterminated;%20rel=preload,%20%3C/ok.css' used to be added). A target
  // containing '<' or whitespace is dropped; the later valid value is still parsed.
  const reviewerCase = '<unterminated; rel=preload, </ok.css>; rel=preload'
  const unterminated = linkHeaderPreloadRefs(reviewerCase, PAGE_WWW)
  const unterminatedMerged = mergeLinkHeaderAssetRefs(['/keep.css'], reviewerCase, PAGE_WWW)
  const unterminatedParsed = parseLinkHeader(reviewerCase)
  if (!eq(unterminated, ['/ok.css'])) problems.push({ case: 'unterminated-target-borrows-later-close', unterminated })
  if (!eq(unterminatedMerged.assetRefs, ['/keep.css', '/ok.css'])) problems.push({ case: 'unterminated-target-merge', unterminatedMerged })
  if (unterminatedParsed.some((v) => /[<\s]/.test(v.target))) problems.push({ case: 'unterminated-target-parsed', unterminatedParsed })
  const spaced = linkHeaderPreloadRefs('<bad target.css>; rel=preload, <\t/tab.css>; rel=preload, </ok3.css>; rel=preload', PAGE_WWW)
  if (!eq(spaced, ['/ok3.css'])) problems.push({ case: 'whitespace-in-target-dropped', spaced })
  // Invalid page URL: no throw.
  try {
    mergeLinkHeaderAssetRefs(['/k.css'], '</a.css>; rel=preload', 'not a url')
  } catch (err) {
    problems.push({ case: 'invalid-page-url', threw: String(err) })
  }
  return { pass: problems.length === 0, detail: { problems, inputs: inputs.length } }
}

// --- capture() end to end (stubbed fetch) ---

async function testCaptureRecordsReplitShape() {
  const { result: m, log } = await captureReplitPost()
  const e = m.entries[0]
  const problems = []
  const wantAll = [...REPLIT_FONTS, ...REPLIT_CSS].sort()
  if (!eq(e.assetRefs, wantAll)) problems.push({ field: 'assetRefs', got: e.assetRefs, want: wantAll })
  if (!eq(e.linkHeaderRefs, wantAll)) problems.push({ field: 'linkHeaderRefs', got: e.linkHeaderRefs, want: wantAll })
  // Header-derived refs are fetched by captureAssets like any other same-site ref.
  for (const f of REPLIT_FONTS) {
    if (m.assets[f]?.status !== 200) problems.push({ asset: f, entry: m.assets[f] || null })
    if (!log.some((r) => r.host === 'www.growmax.io' && r.path === f)) problems.push({ notFetched: f })
  }
  // One request per unique ref: the stylesheets named twice (HTML + header) are fetched once.
  for (const c of REPLIT_CSS) {
    const n = log.filter((r) => r.path === c).length
    if (n !== 1) problems.push({ css: c, fetchCount: n })
  }
  return { pass: problems.length === 0, detail: { problems, requests: log.length } }
}

async function testCompactModeSameRefs() {
  const { result: full } = await captureReplitPost({ compact: false })
  const { result: compact } = await captureReplitPost({ compact: true })
  const f = full.entries[0]
  const c = compact.entries[0]
  const pass =
    compact.compact === true &&
    Array.isArray(c.linkHeaderRefs) &&
    c.linkHeaderRefs.length === 7 &&
    eq(f.assetRefs, c.assetRefs) &&
    eq(f.linkHeaderRefs, c.linkHeaderRefs) &&
    // P6.2 hardening: stylesheetRefs recorded in both modes, identically.
    eq(f.stylesheetRefs, [...REPLIT_CSS].sort()) &&
    eq(f.stylesheetRefs, c.stylesheetRefs) &&
    eq(Object.keys(full.assets).sort(), Object.keys(compact.assets).sort())
  return {
    pass,
    detail: {
      full: { assetRefs: f.assetRefs, linkHeaderRefs: f.linkHeaderRefs, stylesheetRefs: f.stylesheetRefs },
      compact: { assetRefs: c.assetRefs, linkHeaderRefs: c.linkHeaderRefs, stylesheetRefs: c.stylesheetRefs },
    },
  }
}

async function testReplitVsVercelIsrEqual() {
  const { result: a } = await captureReplitPost()
  const { result: b } = await captureVercelPost()
  const eB = b.entries[0]
  const shapeOk = eq(eB.linkHeaderRefs, []) && eB.assetRefs.length === 7
  const cmp = await compareManifests(a, b, {})
  const assetRefDiffs = cmp.diffs.filter((d) => d.field === 'assetRefs')
  // Negative control: the same Replit page without its Link header differs from Vercel's ISR
  // page by exactly the 5 font preloads, i.e. the header merge is what makes them equal.
  const { result: aNoHeader } = await captureReplitPost({ linkLines: [] })
  const cmpNo = await compareManifests(aNoHeader, b, {})
  const controlDiff = cmpNo.diffs.filter((d) => d.field === 'assetRefs')
  // Mutation: a 6th font in Replit's header (not on Vercel) must still be detected.
  const { result: aExtra } = await captureReplitPost({ linkLines: [...REPLIT_LINK_LINES, fontLink('/_next/static/media/aaaa1111bbbb2222-s.p.woff2')] })
  const cmpExtra = await compareManifests(aExtra, b, {})
  const extraDiff = cmpExtra.diffs.filter((d) => d.field === 'assetRefs')
  const pass =
    shapeOk &&
    assetRefDiffs.length === 0 &&
    cmp.failedUnallowed === 0 &&
    cmp.passed === true &&
    controlDiff.length === 1 &&
    cmpNo.failedUnallowed >= 1 &&
    extraDiff.length === 1 &&
    cmpExtra.failedUnallowed >= 1
  return {
    pass,
    detail: {
      shapeOk,
      equal: { failedUnallowed: cmp.failedUnallowed, diffs: cmp.diffs },
      withoutHeader: { failedUnallowed: cmpNo.failedUnallowed, assetRefDiffs: controlDiff.length },
      extraFont: { failedUnallowed: cmpExtra.failedUnallowed, assetRefDiffs: extraDiff.length },
    },
  }
}

async function testLinkHeaderRefsNotCompared() {
  // linkHeaderRefs is diagnostics only: equal assetRefs with different linkHeaderRefs -> no diff.
  const entry = (linkHeaderRefs) => ({
    url: '/x',
    status: 200,
    contentType: 'text/html',
    headers: {},
    html: { title: 't', externalLinks: [] },
    internalLinks: [],
    images: [],
    assetRefs: ['/a.css', '/f.woff2'],
    linkHeaderRefs,
  })
  const m = (e) => ({ entries: [e], assets: {}, harness: { embeddedPosts: 1 } })
  const r = await compareManifests(m(entry(['/a.css', '/f.woff2'])), m(entry([])), {})
  return { pass: r.diffs.length === 0 && r.failedUnallowed === 0, detail: { diffs: r.diffs } }
}

async function testBypassOnlyToBaseHost() {
  const dir = await mkdtemp(path.join(tmpdir(), 'lh-selftest-'))
  const secretFile = path.join(dir, 'bypass')
  await writeFile(secretFile, 'selftest-placeholder-not-a-secret\n')
  const header = [
    fontLink('/_next/static/media/26d4368bf94c0ec4-s.p.woff2'),
    '<https://www.growmax.io/fonts/canonical.woff2>; rel=preload; as=font',
    '<https://fonts.gstatic.com/s/third.woff2>; rel=preload; as=font',
    '<https://other-preview.vercel.app/other.css>; rel=preload; as=style',
  ].join(', ')
  const routes = {
    [`${BASE_B}/blog/some-post`]: htmlRoute(postHtml([]), [header]),
    'https://growmax.io/': htmlRoute(postHtml([]), ['</_next/static/media/37786be940ec402b-s.p.woff2>; rel=preload; as=font']),
    ...assetRoutes(BASE_B, [], ['/fonts/canonical.woff2']),
  }
  let out
  try {
    out = await withStubFetch(routes, () =>
      capture({
        base: BASE_B,
        urls: [
          { url: '/blog/some-post', source: 'sitemap' },
          { url: 'https://growmax.io/', source: 'post-cutover' },
        ],
        bypassSecretFile: secretFile,
        concurrency: 2,
      }),
    )
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
  const { result: m, log } = out
  const problems = []
  if (m.base !== BASE_B) problems.push({ base: m.base })
  for (const r of log) {
    if (r.host === 'growmax-website.vercel.app' && !r.bypass) problems.push({ missingBypass: r })
    if (r.host !== 'growmax-website.vercel.app' && r.bypass) problems.push({ bypassLeak: r })
    if (r.host === 'fonts.gstatic.com' || r.host === 'other-preview.vercel.app') problems.push({ thirdPartyFetched: r })
  }
  if (!log.some((r) => r.host === 'growmax.io' && r.path === '/' && !r.bypass)) problems.push('absolute non-base page not fetched without bypass')
  for (const ref of ['/_next/static/media/26d4368bf94c0ec4-s.p.woff2', '/fonts/canonical.woff2', '/_next/static/media/37786be940ec402b-s.p.woff2']) {
    if (!log.some((r) => r.host === 'growmax-website.vercel.app' && r.path === ref && r.bypass)) problems.push({ headerRefNotFetchedFromBase: ref })
    if (m.assets[ref]?.status !== 200) problems.push({ asset: ref, entry: m.assets[ref] || null })
  }
  const post = m.entries.find((e) => e.url === '/blog/some-post')
  if (!eq(post.linkHeaderRefs, ['/_next/static/media/26d4368bf94c0ec4-s.p.woff2', '/fonts/canonical.woff2'])) problems.push({ linkHeaderRefs: post.linkHeaderRefs })
  return { pass: problems.length === 0, detail: { problems, requests: log } }
}

// --- stylesheetRefs (P6.2 harness hardening) ---
//
// assetRefs can't tell an applied stylesheet from a preload of the same file, so these cases
// check the separate stylesheetRefs field end to end: extract.mjs records HTML
// <link rel~=stylesheet> (not alternate) hrefs only, capture.mjs stores them, compare.mjs
// compares them as an exact multiset after the assetRefs normalization.

/** Capture one page `/blog/some-post` from `base` with `html` and `linkLines`, via the stub. */
async function capturePage(base, html, linkLines = [], cssPaths = REPLIT_CSS) {
  const routes = { [`${base}/blog/some-post`]: htmlRoute(html, linkLines), ...assetRoutes(base, cssPaths) }
  return withStubFetch(routes, () => capture({ base, urls: [{ url: '/blog/some-post', source: 'sitemap' }], concurrency: 2 }))
}

const fieldDiffs = (cmp, field) => cmp.diffs.filter((d) => d.field === field)

async function testMissingStylesheetMaskedByPreloadNowFails() {
  // A: the stylesheet elements plus the header (Replit's dynamic render).
  const { result: a } = await captureReplitPost()
  // B: same header, NO stylesheet elements: the header's rel=preload as=style entries put the
  // same CSS paths into assetRefs, which is exactly what used to mask the missing elements.
  const { result: b } = await capturePage(BASE_A, postHtml([]), REPLIT_LINK_LINES)
  // B2: the HTML-only form of the same gap (<link rel=preload as=style> instead of stylesheet).
  const { result: b2 } = await capturePage(BASE_A, postHtml(REPLIT_CSS.map((c) => `<link rel="preload" as="style" href="${c}"/>`)), [REPLIT_LINK_LINES[0]])
  const cmp = await compareManifests(a, b, {})
  const cmp2 = await compareManifests(a, b2, {})
  const eB = b.entries[0]
  const pass =
    // Header entries never contribute to stylesheetRefs.
    eq(eB.stylesheetRefs, []) &&
    eq(eB.linkHeaderRefs.filter((r) => r.endsWith('.css')).sort(), [...REPLIT_CSS].sort()) &&
    // The masking still holds for assetRefs (so the new field is what catches it)...
    fieldDiffs(cmp, 'assetRefs').length === 0 &&
    fieldDiffs(cmp2, 'assetRefs').length === 0 &&
    // ...and stylesheetRefs now fails the compare.
    fieldDiffs(cmp, 'stylesheetRefs').length === 1 &&
    fieldDiffs(cmp, 'stylesheetRefs')[0].category === 'content' &&
    eq(fieldDiffs(cmp, 'stylesheetRefs')[0].b, []) &&
    cmp.failedUnallowed >= 1 &&
    cmp.passed === false &&
    fieldDiffs(cmp2, 'stylesheetRefs').length === 1 &&
    cmp2.passed === false
  return {
    pass,
    detail: {
      bStylesheetRefs: eB.stylesheetRefs,
      headerOnly: { failedUnallowed: cmp.failedUnallowed, diffs: cmp.diffs.map((d) => d.field) },
      htmlPreloadOnly: { failedUnallowed: cmp2.failedUnallowed, diffs: cmp2.diffs.map((d) => d.field) },
    },
  }
}

async function testEqualStylesheetsPass() {
  const { result: a } = await captureReplitPost()
  const { result: a2 } = await captureReplitPost()
  const cmp = await compareManifests(a, a2, {})
  const pass = eq(a.entries[0].stylesheetRefs, [...REPLIT_CSS].sort()) && cmp.diffs.length === 0 && cmp.passed === true && cmp.stylesheetRefsBothAbsent === 0
  return { pass, detail: { stylesheetRefs: a.entries[0].stylesheetRefs, diffs: cmp.diffs } }
}

async function testDplVariantPasses() {
  // Replit (plain, different content hashes) vs Vercel ISR (?dpl= on every stylesheet): equal
  // after the hashed-name placeholder + dpl strip.
  const { result: a } = await captureReplitPost()
  const { result: b } = await captureVercelPost()
  const cmp = await compareManifests(a, b, {})
  // The same file with and without ?dpl only (no hash change), on synthetic entries.
  const sheet = '/_next/static/css/67ec1cc0bd707d2d.css'
  const cmp2 = await compareManifests(mkSheetManifest([sheet]), mkSheetManifest([`${sheet}?dpl=${DPL}`]), {})
  // Negative control: a changed non-dpl query is a different stylesheet.
  const cmp3 = await compareManifests(mkSheetManifest(['/styles/site.css?v=1']), mkSheetManifest([`/styles/site.css?v=2&dpl=${DPL}`]), {})
  const pass =
    b.entries[0].stylesheetRefs.every((r) => r.includes(`dpl=${DPL}`)) &&
    fieldDiffs(cmp, 'stylesheetRefs').length === 0 &&
    cmp.passed === true &&
    cmp2.diffs.length === 0 &&
    fieldDiffs(cmp3, 'stylesheetRefs').length === 1
  return {
    pass,
    detail: { aSheets: a.entries[0].stylesheetRefs, bSheets: b.entries[0].stylesheetRefs, isr: cmp.diffs, dplOnly: cmp2.diffs, changedQuery: cmp3.diffs },
  }
}

function mkSheetManifest(stylesheetRefs, { omit = false } = {}) {
  const entry = {
    url: '/x',
    status: 200,
    contentType: 'text/html',
    headers: {},
    html: { title: 't', externalLinks: [] },
    internalLinks: [],
    images: [],
    assetRefs: [],
  }
  if (!omit) entry.stylesheetRefs = stylesheetRefs
  return { entries: [entry], assets: {}, harness: { embeddedPosts: 1 } }
}

async function testAlternateStylesheetIgnored() {
  const alt = '<link rel="alternate stylesheet" href="/_next/static/css/aaaa0000bbbb1111.css" title="print"/>'
  const altUpper = '<link rel="Stylesheet ALTERNATE" href="/alt2.css"/>'
  const ex = extractHtml(postHtml([...REPLIT_CSS.map(stylesheetTag), alt, altUpper]), PAGE_WWW)
  const { result: a } = await captureReplitPost()
  const { result: b } = await capturePage(BASE_A, postHtml([...REPLIT_CSS.map(stylesheetTag), alt, altUpper]), REPLIT_LINK_LINES)
  const cmp = await compareManifests(a, b, {})
  const pass = eq(ex.stylesheetRefs, [...REPLIT_CSS].sort()) && eq(b.entries[0].stylesheetRefs, [...REPLIT_CSS].sort()) && fieldDiffs(cmp, 'stylesheetRefs').length === 0
  return { pass, detail: { extracted: ex.stylesheetRefs, captured: b.entries[0].stylesheetRefs, diffs: cmp.diffs } }
}

async function testMultiTokenRelCounted() {
  const tags = ['<link rel="Stylesheet preload" href="/_next/static/css/e0e0fae895f3fff8.css"/>', '<link rel="  STYLESHEET\tfoo " href="/_next/static/css/67ec1cc0bd707d2d.css"/>']
  const ex = extractHtml(postHtml(tags), PAGE_WWW)
  // Third-party and cross-deployment stylesheets never enter (same filter as assetRefs).
  const ex3p = extractHtml(postHtml(['<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter"/>', '<link rel="stylesheet" href="https://other-preview.vercel.app/o.css"/>', '<link rel="stylesheet" href="https://growmax.io/apex.css"/>']), PAGE_WWW)
  const { result: a } = await captureReplitPost()
  const { result: b } = await capturePage(BASE_A, postHtml(tags), REPLIT_LINK_LINES)
  const cmp = await compareManifests(a, b, {})
  // Duplicate element on one side: kept by extraction, and the multiset differs.
  const exDup = extractHtml(postHtml([stylesheetTag('/s.css'), stylesheetTag('/s.css')]), PAGE_WWW)
  const cmpDup = await compareManifests(mkSheetManifest(['/s.css']), mkSheetManifest(['/s.css', '/s.css']), {})
  const pass =
    eq(ex.stylesheetRefs, [...REPLIT_CSS].sort()) &&
    eq(ex3p.stylesheetRefs, ['/apex.css']) &&
    fieldDiffs(cmp, 'stylesheetRefs').length === 0 &&
    eq(exDup.stylesheetRefs, ['/s.css', '/s.css']) &&
    fieldDiffs(cmpDup, 'stylesheetRefs').length === 1
  return { pass, detail: { extracted: ex.stylesheetRefs, thirdParty: ex3p.stylesheetRefs, diffs: cmp.diffs, duplicateExtracted: exDup.stylesheetRefs, duplicate: cmpDup.diffs } }
}

async function testOneSideLacksFieldFails() {
  const sheets = ['/_next/static/css/67ec1cc0bd707d2d.css']
  const aOld = await compareManifests(mkSheetManifest(null, { omit: true }), mkSheetManifest(sheets), {})
  const bOld = await compareManifests(mkSheetManifest(sheets), mkSheetManifest(null, { omit: true }), {})
  // An empty array is a real value (a page with no stylesheet), not "lacking the field".
  const aOldEmpty = await compareManifests(mkSheetManifest(null, { omit: true }), mkSheetManifest([]), {})
  const dA = fieldDiffs(aOld, 'stylesheetRefs')
  const dB = fieldDiffs(bOld, 'stylesheetRefs')
  const dE = fieldDiffs(aOldEmpty, 'stylesheetRefs')
  const pass =
    dA.length === 1 && dA[0].a === null && Array.isArray(dA[0].b) && dA[0].category === 'content' && aOld.passed === false &&
    dB.length === 1 && dB[0].b === null && Array.isArray(dB[0].a) && bOld.passed === false &&
    dE.length === 1 && dE[0].a === null && eq(dE[0].b, []) && aOldEmpty.passed === false
  return { pass, detail: { aLacks: dA, bLacks: dB, aLacksBEmpty: dE } }
}

async function testBothSidesLackFieldSkipped() {
  const r = await compareManifests(mkSheetManifest(null, { omit: true }), mkSheetManifest(null, { omit: true }), {})
  // The skip is counted and reported, never silent.
  const pass = r.diffs.length === 0 && r.passed === true && r.stylesheetRefsBothAbsent === 1
  return { pass, detail: { diffs: r.diffs, stylesheetRefsBothAbsent: r.stylesheetRefsBothAbsent } }
}

// --- compare.mjs outputs ---

async function testDiffOutputPaths() {
  const dir = await mkdtemp(path.join(tmpdir(), 'lh-outputs-'))
  const problems = []
  try {
    const ev = path.join(dir, 'docs', 'migration', 'evidence')
    const scratch = path.join(dir, 'docs', 'migration', '.scratch')
    await mkdir(ev, { recursive: true })
    await mkdir(scratch, { recursive: true })
    const out = path.join(ev, 'P6.2-parity-diff.json')
    const check = (name, got, want) => {
      if (!eq(got, want)) problems.push({ name, got, want })
      if (got.full === got.committed) problems.push({ name, samePath: got.full })
    }
    // Default scratch (<out dir>/../.scratch): unchanged behavior.
    check('default', diffOutputPaths(out, undefined), { scratchDir: scratch, full: path.join(scratch, 'P6.2-parity-diff.json'), committed: out })
    // A different --scratch: unchanged behavior.
    check('other-dir', diffOutputPaths(out, scratch), { scratchDir: scratch, full: path.join(scratch, 'P6.2-parity-diff.json'), committed: out })
    // --scratch = the directory of --out, spelled several ways.
    const wantSame = { scratchDir: ev, full: path.join(ev, 'P6.2-parity-diff.full.json'), committed: out }
    check('same-dir', diffOutputPaths(out, ev), wantSame)
    check('same-dir-trailing-slash', diffOutputPaths(out, ev + path.sep), wantSame)
    check('same-dir-dotdot', diffOutputPaths(out, path.join(ev, '..', 'evidence')), wantSame)
    const link = path.join(dir, 'ev-link')
    await symlink(ev, link)
    check('same-dir-symlink', diffOutputPaths(out, link), { scratchDir: link, full: path.join(link, 'P6.2-parity-diff.full.json'), committed: out })
    // Relative paths against the cwd.
    const relOut = path.relative(process.cwd(), out)
    const relEv = path.relative(process.cwd(), ev)
    check('same-dir-relative', diffOutputPaths(relOut, relEv), wantSame)

    // End to end: compare.mjs with --scratch = --out's directory and more than 200 diffs.
    const mk = (title) => ({
      entries: Array.from({ length: 250 }, (_, i) => ({
        url: `/p${i}`,
        status: 200,
        contentType: 'text/html',
        headers: {},
        html: { title: `${title}${i}`, externalLinks: [] },
        internalLinks: [],
        images: [],
        assetRefs: [],
      })),
      assets: {},
      harness: { embeddedPosts: 1 },
    })
    const aFile = path.join(dir, 'a.json')
    const bFile = path.join(dir, 'b.json')
    await writeFile(aFile, JSON.stringify(mk('A')))
    await writeFile(bFile, JSON.stringify(mk('B')))
    const run = spawnSync(process.execPath, [path.join(__dirname, 'compare.mjs'), '--a', aFile, '--b', bFile, '--out', out, '--scratch', ev], { encoding: 'utf8' })
    const committed = JSON.parse(await readFile(out, 'utf8'))
    const fullPath = path.join(ev, 'P6.2-parity-diff.full.json')
    const full = JSON.parse(await readFile(fullPath, 'utf8'))
    if (run.status !== 1) problems.push({ e2eExit: run.status, stderr: run.stderr.slice(0, 500) })
    if (committed.diffs.length !== 200) problems.push({ e2eCommittedDiffs: committed.diffs.length })
    if (full.diffs.length !== 250) problems.push({ e2eFullDiffs: full.diffs.length })
    if (committed.failedUnallowed !== full.failedUnallowed) problems.push({ e2eCountsDiffer: [committed.failedUnallowed, full.failedUnallowed] })
    // Default layout still writes the full copy to ../.scratch/<basename>.
    const run2 = spawnSync(process.execPath, [path.join(__dirname, 'compare.mjs'), '--a', aFile, '--b', bFile, '--out', out], { encoding: 'utf8' })
    const full2 = JSON.parse(await readFile(path.join(scratch, 'P6.2-parity-diff.json'), 'utf8'))
    if (run2.status !== 1 || full2.diffs.length !== 250) problems.push({ e2eDefault: { exit: run2.status, diffs: full2.diffs.length } })
    try {
      await access(path.join(scratch, 'P6.2-parity-diff.full.json'))
      problems.push('default layout unexpectedly wrote a .full.json')
    } catch {
      // expected: no .full.json when the directories differ
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
  return { pass: problems.length === 0, detail: { problems } }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const cases = [
    ['two-link-headers-joined-by-undici', testTwoHeadersJoined],
    ['commas-inside-uri-and-quoted-params', testCommasInsideUriAndQuotes],
    ['rel-quoted-mixed-case-multi-value', testRelVariants],
    ['non-preload-rels-add-nothing', testNonPreloadRelsAddNothing],
    ['targets-relative-same-site-third-party', testTargets],
    ['dedup-against-html-ref-with-dpl-stripped', testDplDedupAgainstHtml],
    ['duplicates-inside-header', testDuplicatesInsideHeader],
    ['malformed-never-throws-adds-nothing', testMalformedNeverThrowsAddsNothing],
    ['capture-records-replit-header-shape', testCaptureRecordsReplitShape],
    ['compact-mode-records-same-refs', testCompactModeSameRefs],
    ['replit-header-vs-vercel-isr-html-equal-multisets', testReplitVsVercelIsrEqual],
    ['linkHeaderRefs-diagnostic-not-compared', testLinkHeaderRefsNotCompared],
    ['bypass-only-to-base-host-header-refs-fetched', testBypassOnlyToBaseHost],
    ['compare-outputs-never-share-a-path', testDiffOutputPaths],
    ['stylesheet-missing-element-masked-by-header-preload-fails', testMissingStylesheetMaskedByPreloadNowFails],
    ['stylesheet-equal-passes', testEqualStylesheetsPass],
    ['stylesheet-dpl-variant-passes', testDplVariantPasses],
    ['stylesheet-alternate-ignored', testAlternateStylesheetIgnored],
    ['stylesheet-multi-token-rel-counted', testMultiTokenRelCounted],
    ['stylesheet-one-side-lacks-field-fails', testOneSideLacksFieldFails],
    ['stylesheet-both-sides-lack-field-skipped', testBothSidesLackFieldSkipped],
  ]
  const checks = []
  for (const [name, fn] of cases) {
    try {
      const r = await fn()
      checks.push({ name, pass: !!r.pass, detail: r.detail })
    } catch (err) {
      checks.push({ name, pass: false, detail: { error: String(err.stack || err) } })
    }
  }
  const pass = checks.every((c) => c.pass)
  const passed = checks.filter((c) => c.pass).length
  if (args.out) {
    await mkdir(path.dirname(args.out), { recursive: true })
    await writeFile(args.out, JSON.stringify({ kind: 'P6.2-link-header-selftest', generatedAt: new Date().toISOString(), pass, passed, total: checks.length, checks }, null, 2))
  }
  console.log(`P6.2 Link-header/outputs self-test: ${pass ? 'PASS' : 'FAIL'} (${passed}/${checks.length})`)
  for (const c of checks) {
    console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}`)
    if (!c.pass) console.log(`        ${JSON.stringify(c.detail).slice(0, 1500)}`)
  }
  // One final, unambiguous count line (P6.2 harness hardening). No case here can be deferred.
  console.log(`SUMMARY selftest-link-header.mjs: ${passed}/${checks.length} PASS, ${checks.length - passed} FAIL, 0 DEFERRED`)
  process.exit(pass ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
