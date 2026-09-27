#!/usr/bin/env node
// C-A3b-5 harness self-test (A3 for P6.2, SPEC-04 §9 addendum 2026-09-27). Covers:
//   (1) a 2xx HTML page where exactly one side lacks stylesheetRefs diffs under the field
//       "stylesheetRefsMissing" (never "stylesheetRefs"), which can't be allowlisted;
//   (2) a page where BOTH sides have htmlError emits an "htmlError" diff (category "harness",
//       both values), as does a page where only one side has it; "htmlError" can't be
//       allowlisted;
//   (3) capture.mjs writes the manifest marker harness.stylesheetRefs = 1 next to
//       harness.embeddedPosts; when BOTH manifests carry it, a 2xx HTML page lacking
//       stylesheetRefs on both sides is a stylesheetRefsMissing diff, never a silent skip;
//       with one or neither marker, both-absent is still the counted stylesheetRefsBothAbsent
//       skip (and main() prints the NOTE), and one-absent is still a stylesheetRefsMissing diff.
//
// No network: synthetic manifests through the real compareManifests()/validateAllowlist(),
// capture() driven with globalThis.fetch replaced by an in-memory stub, and compare.mjs run as
// a child process on manifests written to a temp directory.
//
// Usage: node selftest-c-a3b-5.mjs [--out <evidence.json>]
// Exit code 0 only if every case passes.

import { writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { capture } from './capture.mjs'
import { compareManifests, validateAllowlist } from './compare.mjs'
import { safeFileName } from './lib/extract.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COMPARE = path.join(__dirname, 'compare.mjs')

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
const fieldDiffs = (cmp, field) => cmp.diffs.filter((d) => d.field === field)

const SHEETS = ['/_next/static/css/67ec1cc0bd707d2d.css']
// Diff values carry the compare-time normalized form (normalizeAssetRef in compare.mjs).
const SHEETS_NORM = ['/_next/static/<build>/<hash>.css']
const MARKED = { embeddedPosts: 1, stylesheetRefs: 1 }
const UNMARKED = { embeddedPosts: 1 }

/** One 2xx HTML entry. `sheets: null` omits stylesheetRefs; `htmlError` mimics a failed
 *  extraction (capture.mjs then records no HTML-derived field at all). */
function htmlEntry({ url = '/x', status = 200, sheets = SHEETS, htmlError } = {}) {
  if (htmlError !== undefined) return { url, status, contentType: 'text/html', headers: {}, htmlError }
  const e = {
    url,
    status,
    contentType: 'text/html',
    headers: {},
    html: { title: 't', externalLinks: [] },
    jsonLdHash: 'j',
    visibleTextHash: 'v',
    internalLinks: [],
    images: [],
    assetRefs: [],
  }
  if (sheets !== null) e.stylesheetRefs = sheets
  return e
}
const mk = (entries, harness) => ({ entries: Array.isArray(entries) ? entries : [entries], assets: {}, ...(harness ? { harness } : {}) })

const APPROVAL = { approvedBy: 'A3', approvedAt: '2026-09-27T09:00:00Z', reason: 'selftest: must be rejected' }

function rejects(fn) {
  try {
    fn()
    return { rejected: false }
  } catch (err) {
    return { rejected: true, message: String(err.message || err) }
  }
}

async function rejectsAsync(fn) {
  try {
    await fn()
    return { rejected: false }
  } catch (err) {
    return { rejected: true, message: String(err.message || err) }
  }
}

// --- (1) one side lacks stylesheetRefs -> stylesheetRefsMissing ---

async function testOneSideLacksIsStylesheetRefsMissing() {
  const results = {}
  let ok = true
  for (const [name, hA, hB] of [
    ['both-marked', MARKED, MARKED],
    ['a-marked-only', MARKED, UNMARKED],
    ['b-marked-only', UNMARKED, MARKED],
    ['neither-marked', UNMARKED, UNMARKED],
    ['no-harness-object', null, null],
  ]) {
    const aLacks = await compareManifests(mk(htmlEntry({ sheets: null }), hA), mk(htmlEntry(), hB), {})
    const bLacks = await compareManifests(mk(htmlEntry(), hA), mk(htmlEntry({ sheets: null }), hB), {})
    const bEmpty = await compareManifests(mk(htmlEntry({ sheets: null }), hA), mk(htmlEntry({ sheets: [] }), hB), {})
    const dA = fieldDiffs(aLacks, 'stylesheetRefsMissing')
    const dB = fieldDiffs(bLacks, 'stylesheetRefsMissing')
    const dE = fieldDiffs(bEmpty, 'stylesheetRefsMissing')
    const pass =
      [aLacks, bLacks, bEmpty].every((r) => fieldDiffs(r, 'stylesheetRefs').length === 0 && r.passed === false && r.stylesheetRefsBothAbsent === 0) &&
      dA.length === 1 && dA[0].a === null && eq(dA[0].b, SHEETS_NORM) && dA[0].category === 'other' && !dA[0].allowlisted &&
      dB.length === 1 && dB[0].b === null && eq(dB[0].a, SHEETS_NORM) && dB[0].category === 'other' &&
      dE.length === 1 && dE[0].a === null && eq(dE[0].b, []) &&
      aLacks.failedUnallowed === 1 && bLacks.failedUnallowed === 1
    results[name] = { pass, aLacks: dA, bLacks: dB, bEmpty: dE }
    ok = ok && pass
  }
  return { pass: ok, detail: results }
}

async function testStylesheetRefsMissingNotAllowlistable() {
  const entry = { ...APPROVAL, field: 'stylesheetRefsMissing', url: '/x', expected: { a: null, b: SHEETS_NORM } }
  const direct = rejects(() => validateAllowlist([entry]))
  const viaPattern = rejects(() => validateAllowlist([{ ...APPROVAL, field: 'stylesheetRefsMissing', pattern: '^/x$', expected: { a: null, b: SHEETS_NORM } }]))
  const viaMaxMatches = rejects(() => validateAllowlist([{ ...APPROVAL, field: 'stylesheetRefsMissing', url: '/x', maxMatches: 1 }]))
  const viaCompare = await rejectsAsync(() => compareManifests(mk(htmlEntry({ sheets: null }), MARKED), mk(htmlEntry(), MARKED), { allowlist: [entry] }))
  // The old way of covering it — a pinned {a: null, b: [...]} entry on the plain
  // stylesheetRefs field — is still a valid entry, but no longer matches anything here.
  const oldStyle = { ...APPROVAL, field: 'stylesheetRefs', url: '/x', expected: { a: null, b: SHEETS_NORM } }
  const oldStyleValid = !rejects(() => validateAllowlist([oldStyle])).rejected
  const cmpOld = await compareManifests(mk(htmlEntry({ sheets: null }), MARKED), mk(htmlEntry(), MARKED), { allowlist: [oldStyle] })
  const pass =
    direct.rejected && /stylesheetRefsMissing/.test(direct.message) &&
    viaPattern.rejected && viaMaxMatches.rejected && viaCompare.rejected &&
    oldStyleValid && cmpOld.passed === false && cmpOld.allowlisted === 0 && cmpOld.failedUnallowed === 1 &&
    fieldDiffs(cmpOld, 'stylesheetRefsMissing').length === 1
  return { pass, detail: { direct, viaPattern, viaMaxMatches, viaCompare, oldStyleValid, oldStyleCompare: { passed: cmpOld.passed, allowlisted: cmpOld.allowlisted, failedUnallowed: cmpOld.failedUnallowed } } }
}

// --- (2) htmlError ---

async function testBothSidesHtmlErrorDiffs() {
  const cases = {}
  let ok = true
  for (const [name, errA, errB, status, harness] of [
    ['same-error-2xx', 'boom', 'boom', 200, UNMARKED],
    ['different-errors-2xx', 'boom-a', 'boom-b', 200, UNMARKED],
    ['same-error-404-page', 'boom', 'boom', 404, UNMARKED],
    ['same-error-2xx-both-marked', 'boom', 'boom', 200, MARKED],
  ]) {
    const r = await compareManifests(mk(htmlEntry({ status, htmlError: errA }), harness), mk(htmlEntry({ status, htmlError: errB }), harness), {})
    const d = fieldDiffs(r, 'htmlError')
    let pass = d.length === 1 && d[0].category === 'harness' && d[0].a === errA && d[0].b === errB && !d[0].reportOnly && r.passed === false && r.failedUnallowed >= 1
    if (name === 'same-error-2xx-both-marked') {
      // Both markers: the absent stylesheetRefs on both sides is also flagged, not skipped.
      pass = pass && fieldDiffs(r, 'stylesheetRefsMissing').length === 1 && r.stylesheetRefsBothAbsent === 0
    }
    if (name === 'same-error-2xx') pass = pass && r.stylesheetRefsBothAbsent === 1
    cases[name] = { pass, htmlError: d, failedUnallowed: r.failedUnallowed, stylesheetRefsBothAbsent: r.stylesheetRefsBothAbsent }
    ok = ok && pass
  }
  return { pass: ok, detail: cases }
}

async function testOneSideHtmlErrorDiffs() {
  const aErr = await compareManifests(mk(htmlEntry({ htmlError: 'boom' }), MARKED), mk(htmlEntry(), MARKED), {})
  const bErr = await compareManifests(mk(htmlEntry(), MARKED), mk(htmlEntry({ htmlError: 'boom' }), MARKED), {})
  const dA = fieldDiffs(aErr, 'htmlError')
  const dB = fieldDiffs(bErr, 'htmlError')
  // Even with every OTHER field on the page allowlisted, the page still fails on htmlError.
  const otherFields = [...new Set(aErr.diffs.map((d) => d.field))].filter((f) => !['htmlError', 'stylesheetRefsMissing'].includes(f))
  const allowAll = otherFields.map((field) => ({ ...APPROVAL, field, url: '/x', maxMatches: 1 }))
  const aErrAllowed = await compareManifests(mk(htmlEntry({ htmlError: 'boom' }), MARKED), mk(htmlEntry(), MARKED), { allowlist: allowAll })
  const unallowedFields = aErrAllowed.diffs.filter((d) => !d.allowlisted && !d.reportOnly).map((d) => d.field).sort()
  const pass =
    dA.length === 1 && dA[0].a === 'boom' && dA[0].b === null && dA[0].category === 'harness' && aErr.passed === false &&
    dB.length === 1 && dB[0].a === null && dB[0].b === 'boom' && bErr.passed === false &&
    aErrAllowed.passed === false && eq(unallowedFields, ['htmlError', 'stylesheetRefsMissing'])
  return { pass, detail: { aErr: dA, bErr: dB, otherFieldsAllowlisted: otherFields, stillUnallowed: unallowedFields } }
}

async function testHtmlErrorNotAllowlistable() {
  const entry = { ...APPROVAL, field: 'htmlError', url: '/x', expected: { a: 'boom', b: 'boom' } }
  const direct = rejects(() => validateAllowlist([entry]))
  const viaPattern = rejects(() => validateAllowlist([{ ...APPROVAL, field: 'htmlError', pattern: '^/.*$', expected: { a: 'boom', b: 'boom' } }]))
  const viaMaxMatches = rejects(() => validateAllowlist([{ ...APPROVAL, field: 'htmlError', url: '/x', maxMatches: 5 }]))
  const viaCompare = await rejectsAsync(() => compareManifests(mk(htmlEntry({ htmlError: 'boom' })), mk(htmlEntry({ htmlError: 'boom' })), { allowlist: [entry] }))
  const pass = direct.rejected && /htmlError/.test(direct.message) && viaPattern.rejected && viaMaxMatches.rejected && viaCompare.rejected
  return { pass, detail: { direct, viaPattern, viaMaxMatches, viaCompare } }
}

async function testCliRejectsForbiddenAllowlistEntries() {
  const dir = await mkdtemp(path.join(tmpdir(), 'c-a3b-5-cli-'))
  const runs = {}
  try {
    const aFile = path.join(dir, 'a.json')
    const bFile = path.join(dir, 'b.json')
    await writeFile(aFile, JSON.stringify(mk(htmlEntry({ sheets: null }), MARKED)))
    await writeFile(bFile, JSON.stringify(mk(htmlEntry(), MARKED)))
    for (const field of ['stylesheetRefsMissing', 'htmlError']) {
      const al = path.join(dir, `allow-${field}.json`)
      await writeFile(al, JSON.stringify([{ ...APPROVAL, field, url: '/x', maxMatches: 1 }]))
      const r = spawnSync(process.execPath, [COMPARE, '--a', aFile, '--b', bFile, '--out', path.join(dir, 'ev', `${field}.json`), '--scratch', path.join(dir, 'scratch'), '--allowlist', al], { encoding: 'utf8' })
      runs[field] = { exit: r.status, rejected: r.status === 2 && /may not be allowlisted/.test(r.stderr) && r.stderr.includes(field) }
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
  return { pass: Object.values(runs).every((r) => r.rejected), detail: runs }
}

// --- (3) harness.stylesheetRefs marker ---

const BASE = 'https://parity-selftest.invalid'
const PAGE_HTML =
  '<!DOCTYPE html><html lang="en"><head><title>T</title>' +
  `<link rel="stylesheet" href="${SHEETS[0]}" data-precedence="next"/></head><body><h1>T</h1></body></html>`

async function withStubFetch(routes, fn) {
  const realFetch = globalThis.fetch
  const log = []
  globalThis.fetch = async (input) => {
    const u = new URL(String(input))
    log.push(u.host + u.pathname)
    const route = routes[u.toString()]
    if (!route) return new Response('not found', { status: 404, headers: [['content-type', 'text/plain']] })
    return new Response(route.body, { status: 200, headers: route.headers })
  }
  try {
    return { result: await fn(), log }
  } finally {
    globalThis.fetch = realFetch
  }
}

const ROUTES = {
  [`${BASE}/x`]: { headers: [['content-type', 'text/html; charset=utf-8']], body: PAGE_HTML },
  [`${BASE}${SHEETS[0]}`]: { headers: [['content-type', 'text/css']], body: 'body{margin:0}' },
}

async function testCaptureWritesMarker() {
  const out = {}
  for (const compact of [false, true]) {
    const { result, log } = await withStubFetch(ROUTES, () => capture({ base: BASE, urls: [{ url: '/x', source: 'sitemap' }], concurrency: 1, compact }))
    out[compact ? 'compact' : 'full'] = {
      harness: result.harness,
      stylesheetRefs: result.entries[0].stylesheetRefs,
      offHost: log.filter((l) => !l.startsWith(new URL(BASE).host)),
    }
  }
  const pass = ['full', 'compact'].every(
    (k) => eq(out[k].harness, { embeddedPosts: 1, stylesheetRefs: 1 }) && eq(out[k].stylesheetRefs, SHEETS) && out[k].offHost.length === 0,
  )
  return { pass, detail: out }
}

/** capture() end to end with a failed HTML extraction on both sides: the `.text.txt` raw-dir
 *  target is pre-created as a DIRECTORY, so capture's in-extraction writeFile throws and the
 *  entry records htmlError (the same catch every extraction failure lands in). */
async function testCapturedHtmlErrorBothSidesDiffs() {
  const dirs = []
  const manifests = []
  try {
    for (const side of ['a', 'b']) {
      const rawDir = await mkdtemp(path.join(tmpdir(), `c-a3b-5-raw-${side}-`))
      dirs.push(rawDir)
      await mkdir(path.join(rawDir, `${safeFileName('/x')}.text.txt`), { recursive: true })
      const { result } = await withStubFetch(ROUTES, () => capture({ base: BASE, urls: [{ url: '/x', source: 'sitemap' }], concurrency: 1, rawDir }))
      manifests.push(result)
    }
  } finally {
    for (const d of dirs) await rm(d, { recursive: true, force: true })
  }
  const [a, b] = manifests
  const r = await compareManifests(a, b, {})
  const d = fieldDiffs(r, 'htmlError')
  const pass =
    typeof a.entries[0].htmlError === 'string' && typeof b.entries[0].htmlError === 'string' &&
    d.length === 1 && d[0].category === 'harness' && d[0].a === a.entries[0].htmlError && d[0].b === b.entries[0].htmlError &&
    r.passed === false
  // Error text is a local EISDIR message on a temp path; only its presence is recorded.
  return { pass, detail: { htmlErrorA: !!a.entries[0].htmlError, htmlErrorB: !!b.entries[0].htmlError, htmlErrorDiffs: d.length, failedUnallowed: r.failedUnallowed } }
}

async function testBothMarkedBothAbsentIsDiff() {
  const r = await compareManifests(mk(htmlEntry({ sheets: null }), MARKED), mk(htmlEntry({ sheets: null }), MARKED), {})
  const d = fieldDiffs(r, 'stylesheetRefsMissing')
  // Several pages: every one is flagged, none is counted as a skip.
  const many = await compareManifests(
    mk([htmlEntry({ url: '/p1', sheets: null }), htmlEntry({ url: '/p2', sheets: null }), htmlEntry({ url: '/p3' })], MARKED),
    mk([htmlEntry({ url: '/p1', sheets: null }), htmlEntry({ url: '/p2', sheets: null }), htmlEntry({ url: '/p3' })], MARKED),
    {},
  )
  const manyD = fieldDiffs(many, 'stylesheetRefsMissing')
  const pass =
    d.length === 1 && d[0].a === null && d[0].b === null && d[0].category === 'other' &&
    r.passed === false && r.failedUnallowed === 1 && r.stylesheetRefsBothAbsent === 0 &&
    eq(manyD.map((x) => x.url).sort(), ['/p1', '/p2']) && many.failedUnallowed === 2 && many.stylesheetRefsBothAbsent === 0
  return { pass, detail: { single: d, many: manyD, bothAbsent: [r.stylesheetRefsBothAbsent, many.stylesheetRefsBothAbsent] } }
}

async function testOneOrNoMarkerBothAbsentStillCounted() {
  const res = {}
  let ok = true
  for (const [name, hA, hB] of [
    ['a-marked-only', MARKED, UNMARKED],
    ['b-marked-only', UNMARKED, MARKED],
    ['neither-marked', UNMARKED, UNMARKED],
    ['no-harness-object', null, null],
    ['marker-not-exactly-1', { embeddedPosts: 1, stylesheetRefs: true }, MARKED],
  ]) {
    const r = await compareManifests(mk(htmlEntry({ sheets: null }), hA), mk(htmlEntry({ sheets: null }), hB), {})
    const pass = r.diffs.length === 0 && r.passed === true && r.stylesheetRefsBothAbsent === 1
    res[name] = { pass, diffs: r.diffs, stylesheetRefsBothAbsent: r.stylesheetRefsBothAbsent }
    ok = ok && pass
  }
  return { pass: ok, detail: res }
}

async function testCliNoteOnlyWithoutBothMarkers() {
  const dir = await mkdtemp(path.join(tmpdir(), 'c-a3b-5-note-'))
  const runs = {}
  try {
    for (const [name, hA, hB, wantExit, wantNote] of [
      ['both-marked', MARKED, MARKED, 1, false],
      ['a-marked-only', MARKED, UNMARKED, 0, true],
      ['neither-marked', UNMARKED, UNMARKED, 0, true],
    ]) {
      const aFile = path.join(dir, `${name}-a.json`)
      const bFile = path.join(dir, `${name}-b.json`)
      await writeFile(aFile, JSON.stringify(mk(htmlEntry({ sheets: null }), hA)))
      await writeFile(bFile, JSON.stringify(mk(htmlEntry({ sheets: null }), hB)))
      const r = spawnSync(process.execPath, [COMPARE, '--a', aFile, '--b', bFile, '--out', path.join(dir, 'ev', `${name}.json`), '--scratch', path.join(dir, 'scratch')], { encoding: 'utf8' })
      const note = /NOTE: stylesheetRefs not compared on 1 HTML page/.test(r.stdout)
      runs[name] = { exit: r.status, note, pass: r.status === wantExit && note === wantNote }
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
  return { pass: Object.values(runs).every((r) => r.pass), detail: runs }
}

async function testNoFalsePositives() {
  // Both marked, both present and equal: no diff. A both-404 HTML page and a non-HTML 2xx
  // entry without stylesheetRefs are outside the rule: no stylesheetRefsMissing either.
  const eqPages = await compareManifests(mk(htmlEntry(), MARKED), mk(htmlEntry(), MARKED), {})
  const notFound = await compareManifests(mk(htmlEntry({ status: 404, sheets: null }), MARKED), mk(htmlEntry({ status: 404, sheets: null }), MARKED), {})
  const txt = { url: '/robots.txt', status: 200, contentType: 'text/plain', headers: {}, text: 'User-agent: *' }
  const plain = await compareManifests(mk(txt, MARKED), mk({ ...txt }, MARKED), {})
  const pass = [eqPages, notFound, plain].every((r) => r.diffs.length === 0 && r.passed === true && r.stylesheetRefsBothAbsent === 0)
  return { pass, detail: { equal: eqPages.diffs, both404: notFound.diffs, textPlain: plain.diffs } }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const cases = [
    ['one-side-lacks-stylesheetRefs-is-stylesheetRefsMissing', testOneSideLacksIsStylesheetRefsMissing],
    ['stylesheetRefsMissing-allowlist-entry-rejected', testStylesheetRefsMissingNotAllowlistable],
    ['both-sides-htmlError-diffs', testBothSidesHtmlErrorDiffs],
    ['one-side-htmlError-diffs', testOneSideHtmlErrorDiffs],
    ['htmlError-allowlist-entry-rejected', testHtmlErrorNotAllowlistable],
    ['cli-rejects-forbidden-allowlist-entries', testCliRejectsForbiddenAllowlistEntries],
    ['capture-writes-harness-stylesheetRefs-marker', testCaptureWritesMarker],
    ['captured-htmlError-both-sides-diffs', testCapturedHtmlErrorBothSidesDiffs],
    ['both-marked-both-absent-is-diff-not-skip', testBothMarkedBothAbsentIsDiff],
    ['one-or-no-marker-both-absent-still-counted', testOneOrNoMarkerBothAbsentStillCounted],
    ['cli-note-only-without-both-markers', testCliNoteOnlyWithoutBothMarkers],
    ['no-false-positives', testNoFalsePositives],
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
    await writeFile(args.out, JSON.stringify({ kind: 'C-A3b-5-harness-selftest', generatedAt: new Date().toISOString(), pass, passed, total: checks.length, checks }, null, 2))
  }
  console.log(`C-A3b-5 harness self-test: ${pass ? 'PASS' : 'FAIL'} (${passed}/${checks.length})`)
  for (const c of checks) {
    console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}`)
    if (!c.pass) console.log(`        ${JSON.stringify(c.detail).slice(0, 1500)}`)
  }
  // One final, unambiguous count line. No case here can be deferred.
  console.log(`SUMMARY selftest-c-a3b-5.mjs: ${passed}/${checks.length} PASS, ${checks.length - passed} FAIL, 0 DEFERRED`)
  process.exit(pass ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
