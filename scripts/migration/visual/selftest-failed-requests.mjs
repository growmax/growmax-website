#!/usr/bin/env node
// P5.3 visual-harness fix self-test: focused, pure-function/offline cases for the
// normalized failed-request comparison in run.mjs (normalizeFailedRequestKey /
// diffNewFailedRequests) — see docs/migration/evidence/P5.3-visual-fix.json for the
// write-up.
//
// Background: a P5.2 attempt-2 run (docs/migration/evidence/P5.2-visual-attempt2.json)
// flagged all 20/20 page/viewport combinations as having "new failed requests on B" purely
// because run.mjs compared failed requests by exact full URL. The failures were
// net::ERR_ABORTED Google Analytics / Google Ads / DoubleClick beacons
// (analytics.google.com/g/collect, www.google.com/ccm|rmkt/collect,
// ad.doubleclick.net/ccm/s/collect) that also abort on A, but their query strings are
// randomized per page load (cid/auid session ids, rnd/tft timestamps, cache-busters), so
// they never matched exactly.
//
// No network calls and no browser: every case builds synthetic failed-request entries in
// memory and runs them through the REAL normalizeFailedRequestKey/diffNewFailedRequests
// code paths exported by run.mjs — the same functions the main loop calls.
//
// Usage: node selftest-failed-requests.mjs [--out <evidence.json>]
//
// Exit code 0 only if every case passes.

import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeFailedRequestKey, diffNewFailedRequests } from './run.mjs'

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

/** Builds a failed-request entry the way captureShots does: raw fields plus the key,
 *  computed against `pageOrigin` (the base the page was captured from). */
function req(url, { method = 'GET', failure = 'net::ERR_ABORTED', pageOrigin } = {}) {
  const entry = { url, method, failure }
  entry.key = normalizeFailedRequestKey(entry, pageOrigin)
  return entry
}

const BASE_A = 'https://www.growmax.io'
const BASE_B = 'https://growmax-website.vercel.app'

// --- (1) GA/Ads/DoubleClick beacons with different query strings on A and B: not new ---

function testAnalyticsBeaconsDifferentQueryNotNew() {
  const failedA = [
    req('https://www.google-analytics.com/g/collect?v=2&cid=aaa111&tft=1000', { pageOrigin: BASE_A }),
    req('https://www.google.com/ccm/collect?gclid=xxx&rnd=1111', { pageOrigin: BASE_A }),
    req('https://ad.doubleclick.net/ccm/s/collect?tag=1&rcb=2222', { pageOrigin: BASE_A }),
  ]
  const failedB = [
    req('https://www.google-analytics.com/g/collect?v=2&cid=bbb999&tft=9999', { pageOrigin: BASE_B }),
    req('https://www.google.com/ccm/collect?gclid=yyy&rnd=3333', { pageOrigin: BASE_B }),
    req('https://ad.doubleclick.net/ccm/s/collect?tag=1&rcb=4444', { pageOrigin: BASE_B }),
  ]
  const newOnes = diffNewFailedRequests(failedA, failedB)
  return { pass: newOnes.length === 0, detail: { newOnes } }
}

// --- (2) third-party failure on a NEW path: is new ---

function testThirdPartyNewPathIsNew() {
  const failedA = [req('https://analytics.google.com/g/collect?cid=aaa', { pageOrigin: BASE_A })]
  const failedB = [
    req('https://analytics.google.com/g/collect?cid=bbb', { pageOrigin: BASE_B }),
    req('https://analytics.google.com/g/some-other-endpoint?cid=bbb', { pageOrigin: BASE_B }),
  ]
  const newOnes = diffNewFailedRequests(failedA, failedB)
  return {
    pass: newOnes.length === 1 && newOnes[0].url.includes('some-other-endpoint'),
    detail: { newOnes },
  }
}

// --- (3) same third-party path, different failure text: is new ---

function testThirdPartyDifferentFailureTextIsNew() {
  const failedA = [
    req('https://analytics.google.com/g/collect?cid=aaa', { failure: 'net::ERR_ABORTED', pageOrigin: BASE_A }),
  ]
  const failedB = [
    req('https://analytics.google.com/g/collect?cid=bbb', {
      failure: 'net::ERR_CONNECTION_RESET',
      pageOrigin: BASE_B,
    }),
  ]
  const newOnes = diffNewFailedRequests(failedA, failedB)
  return { pass: newOnes.length === 1, detail: { newOnes } }
}

// --- (4) first-party /_next/static/... failure only on B: is new ---

function testFirstPartyOnlyOnBIsNew() {
  const failedA = []
  const failedB = [req(`${BASE_B}/_next/static/chunks/main-abc123.js`, { pageOrigin: BASE_B })]
  const newOnes = diffNewFailedRequests(failedA, failedB)
  return { pass: newOnes.length === 1, detail: { newOnes } }
}

// --- (5) same first-party path+search failing on both sides, different hosts: not new ---

function testFirstPartySamePathAcrossHostsNotNew() {
  const failedA = [req(`${BASE_A}/_next/static/chunks/main-abc123.js?dpl=dpl_AAA`, { pageOrigin: BASE_A })]
  const failedB = [req(`${BASE_B}/_next/static/chunks/main-abc123.js?dpl=dpl_AAA`, { pageOrigin: BASE_B })]
  const newOnes = diffNewFailedRequests(failedA, failedB)
  return { pass: newOnes.length === 0, detail: { newOnes } }
}

// --- (6) first-party failure with a different search: is new ---

function testFirstPartyDifferentSearchIsNew() {
  const failedA = [req(`${BASE_A}/_next/static/chunks/main-abc123.js?w=100`, { pageOrigin: BASE_A })]
  const failedB = [req(`${BASE_B}/_next/static/chunks/main-abc123.js?w=200`, { pageOrigin: BASE_B })]
  const newOnes = diffNewFailedRequests(failedA, failedB)
  return { pass: newOnes.length === 1, detail: { newOnes } }
}

// --- extra: a request to a CANONICAL_PRODUCTION_HOSTS host (www.growmax.io/growmax.io) on B
// reconciles with the same path+search captured directly on A, even though B's own page host
// is the vercel.app deployment (mirrors parity's canonical-host reclassification). ---

function testCanonicalHostOnBReconcilesWithA() {
  const failedA = [req(`${BASE_A}/some-asset.js?v=1`, { pageOrigin: BASE_A })]
  // B's page is served from the vercel.app host, but this particular failed request happened
  // to go out to the canonical www host (e.g. an absolute same-site reference) — still
  // first-party, and should reconcile with A's same path+search.
  const failedB = [req('https://www.growmax.io/some-asset.js?v=1', { pageOrigin: BASE_B })]
  const newOnes = diffNewFailedRequests(failedA, failedB)
  return { pass: newOnes.length === 0, detail: { newOnes } }
}

// --- extra: an unparseable URL never throws and still compares (exactly) rather than being
// silently dropped. ---

function testUnparseableUrlDoesNotThrowAndComparesExactly() {
  const failedA = [req('not a url', { pageOrigin: BASE_A })]
  const failedBSame = [req('not a url', { pageOrigin: BASE_B })]
  const failedBDifferent = [req('also not a url', { pageOrigin: BASE_B })]
  const sameNewOnes = diffNewFailedRequests(failedA, failedBSame)
  const differentNewOnes = diffNewFailedRequests(failedA, failedBDifferent)
  return {
    pass: sameNewOnes.length === 0 && differentNewOnes.length === 1,
    detail: { sameNewOnes, differentNewOnes },
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const out = args.out || path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'evidence', 'P5.3-visual-selftest.json')

  const cases = [
    ['analytics-beacons-different-query-not-new', testAnalyticsBeaconsDifferentQueryNotNew],
    ['third-party-new-path-is-new', testThirdPartyNewPathIsNew],
    ['third-party-different-failure-text-is-new', testThirdPartyDifferentFailureTextIsNew],
    ['first-party-only-on-b-is-new', testFirstPartyOnlyOnBIsNew],
    ['first-party-same-path-across-hosts-not-new', testFirstPartySamePathAcrossHostsNotNew],
    ['first-party-different-search-is-new', testFirstPartyDifferentSearchIsNew],
    ['canonical-host-on-b-reconciles-with-a', testCanonicalHostOnBReconcilesWithA],
    ['unparseable-url-does-not-throw-and-compares-exactly', testUnparseableUrlDoesNotThrowAndComparesExactly],
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
  const evidence = { kind: 'P5.3-visual-selftest', generatedAt: new Date().toISOString(), pass, checks }
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, JSON.stringify(evidence, null, 2))
  console.log(`P5.3 visual self-test: ${pass ? 'PASS' : 'FAIL'} (${checks.filter((c) => c.pass).length}/${checks.length}) -> ${out}`)
  for (const c of checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}`)
  process.exit(pass ? 0 : 1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
