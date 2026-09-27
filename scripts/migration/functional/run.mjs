#!/usr/bin/env node
// SPEC-04 §6: functional tests (form, admin and API behavior).
//
// Usage:
//   node run.mjs --base <origin> --mode pre|post --run-label <id> \
//     [--bypass-secret-file <f>] [--allow-demo-test] [--out <evidence.json>] \
//     [--expect-cache-hit <path>, e.g. /api/blog]
//
// --expect-cache-hit (A1 C10, used at P6.2): fetches the given path twice and asserts the
// SECOND response carries `x-vercel-cache: HIT` — proof that H4 is actually caching on
// Vercel, not just configured to. Report-only in the sense that it's opt-in via the flag,
// but once requested it's a normal pass/fail result like F1-F11.
//
// Secrets (ADMIN_PASSWORD) come from env only, never argv. Test data is always
// labeled vercel-migration-test-<runLabel>; writes are cleaned up immediately after
// each assertion. DB assertions/cleanup prefer scripts/migration/db/ (P1.1's runner
// helper) when present, and fall back to a direct read-only-safe Neon HTTP query
// against --target-database-url-env otherwise (P1.2 does not own scripts/migration/db/,
// so it never creates files there; it only calls in).

import { writeFile, mkdir, readFile, readdir, access, rename, link, unlink } from 'node:fs/promises'
import { realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { fetchOnce } from '../parity/lib/fetcher.mjs'

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

const PRODUCTION_REPLIT_HOSTS = new Set(['www.growmax.io', 'growmax.io'])

export const ADMIN_COOKIE_NAME = 'growmax-admin'

/** Parses ONE Set-Cookie header entry (never Node's ', '-joined multi-cookie string — see
 *  getSetCookieEntries below) into its name, value and attributes. Per review (blocking): the
 *  old code matched the cookie by `.includes('growmax-admin=')` over the joined string and ran
 *  its Max-Age/Expires regexes over the WHOLE joined string too, so e.g. an unrelated cookie's
 *  `Max-Age=0` could satisfy the clearing check for growmax-admin, or a re-set growmax-admin
 *  cookie elsewhere in the same response could still match the substring. Matching by the
 *  cookie's own name (exactly, not a substring) and reading attributes off THAT entry alone
 *  closes both. */
//
// Per review round 2 (blocking): attributes are read the way RFC 6265 §5.2 (and browsers) read
// them, not loosely:
//  - Max-Age (§5.2.2) counts only when its trimmed value matches /^-?\d+$/; an empty, blank or
//    otherwise non-integer Max-Age is IGNORED (the old `Number('')` read '' as 0, i.e. as a
//    clear, while a browser keeps the cookie). An ignored Max-Age never overwrites an earlier
//    valid one; among valid ones the last wins (§5.3: the last attribute of a name wins).
//  - Expires (§5.2.1) counts only when it parses; an unparseable Expires is ignored likewise.
//  - Path (§5.2.4): a value that is empty or does not start with '/' is the same as no Path at
//    all — the cookie then gets the request's default-path (see cookieDefaultPath), NOT '/'.
//    `path` is left undefined in that case; effectiveCookiePath() fills in the default.
//  - Domain (§5.2.3): an empty value is ignored; a leading '.' is dropped; lower-cased.
//
// P6.1 F9 hardening (A3 C-A3-4 / P5.3 review round 3):
//  - Name-value pair (§5.2 steps 2-5): a pair with no '=' makes RFC 6265 ignore the whole
//    Set-Cookie entry (Chrome instead stores it as an EMPTY-named cookie whose value is the
//    pair), and an empty trimmed name is likewise ignored or stored empty-named. Either way it
//    is never the growmax-admin cookie: such an entry gets `name: ''` and `ignoredNameValue:
//    true`, so no exact-name match against ADMIN_COOKIE_NAME can ever select it (the old code
//    read `growmax-admin; Max-Age=0` as a growmax-admin clear).
//  - Expires (§5.2.1) is parsed ONLY with the §5.1.1 cookie-date algorithm (parseCookieDate
//    below), never V8's lenient Date.parse (which read `0`, `2020` and `-1` as past dates, so
//    a logout re-sending the sealed value with such an Expires counted as a clear). An Expires
//    the algorithm rejects is the same as no Expires. `expires` keeps the raw string and
//    `expiresAt` the parsed epoch ms.
//  - Partitioned (RFC 6265bis / CHIPS): a boolean; its value, if any, is ignored. A
//    partitioned clear does not clear an unpartitioned cookie (and vice versa), so checkLogout
//    compares it between the login cookie and the clearing entry.
//
// P6.1 review round 1 (blocking A): whitespace is stripped with cookieWsp (SP and HTAB only,
// RFC 6265 §5.2 steps 4-5 and attribute parsing; what Chrome/Firefox do), never JS .trim(),
// which also strips U+00A0 (NBSP) and other Unicode spaces. So `growmax-admin =`,
// `Path =/`, `Path= /` and `Domain= ` are NOT read as growmax-admin / Path / '/'
// / an empty Domain; attribute names are lower-cased ASCII-only (asciiLower). Round 1
// (blocking B): Secure and SameSite are recorded so setCookieRejectionReasons() can tell
// whether a browser would accept the entry at all; an attribute-value over 1024 octets is
// ignored (RFC 6265bis §5.6, Chrome's kMaxCookieAttributeValueSize), so `Secure=<1025 chars>`
// is not Secure.
//
// P6.1 review round 2 (blocking): `domainLast` records the LAST Domain attribute's value exactly
// as read (SP/HTAB stripped, before dropping a leading '.'; '' for an empty `Domain=`), because
// Chrome's ParsedCookie keeps the last occurrence of each attribute, empty or not, while RFC
// 6265 §5.2.3 ignores an empty one. `domain` keeps the RFC reading. setCookieRejectionReasons
// uses `domainLast` to reject `Domain=.` (Chrome rejects the whole entry; the old code read it
// as host-only) and to fail closed where Chrome and the RFC disagree.
const cookieWsp = (s) => String(s).replace(/^[ \t]+|[ \t]+$/g, '')
const asciiLower = (s) => String(s).replace(/[A-Z]/g, (c) => c.toLowerCase())
export const COOKIE_MAX_ATTRIBUTE_VALUE_BYTES = 1024
export const COOKIE_MAX_NAME_VALUE_BYTES = 4096
export function parseCookieAttrs(entry) {
  const parts = String(entry || '').split(';')
  const nameValue = parts[0] || ''
  const eq = nameValue.indexOf('=')
  let name = cookieWsp(eq === -1 ? '' : nameValue.slice(0, eq))
  const value = cookieWsp(eq === -1 ? nameValue : nameValue.slice(eq + 1))
  const ignoredNameValue = eq === -1 || name === ''
  if (ignoredNameValue) name = ''
  const attrs = {
    name,
    value,
    ignoredNameValue,
    path: undefined,
    domain: undefined,
    domainLast: undefined,
    maxAge: undefined,
    expires: undefined,
    expiresAt: undefined,
    partitioned: false,
    secure: false,
    sameSite: undefined,
    sameSiteNoneSeen: false,
  }
  for (const rawPart of parts.slice(1)) {
    const eqIdx = rawPart.indexOf('=')
    const key = asciiLower(cookieWsp(eqIdx === -1 ? rawPart : rawPart.slice(0, eqIdx)))
    const val = eqIdx === -1 ? '' : cookieWsp(rawPart.slice(eqIdx + 1))
    if (Buffer.byteLength(val, 'utf8') > COOKIE_MAX_ATTRIBUTE_VALUE_BYTES) continue
    if (key === 'path') {
      attrs.path = val.startsWith('/') ? val : undefined
    } else if (key === 'domain') {
      attrs.domainLast = val
      if (val !== '') attrs.domain = (val.startsWith('.') ? val.slice(1) : val).toLowerCase()
    } else if (key === 'max-age') {
      if (/^-?\d+$/.test(val)) attrs.maxAge = Number(val)
    } else if (key === 'expires') {
      const t = parseCookieDate(val)
      if (t !== null) {
        attrs.expires = val
        attrs.expiresAt = t
      }
    } else if (key === 'partitioned') {
      attrs.partitioned = true
    } else if (key === 'secure') {
      attrs.secure = true
    } else if (key === 'samesite') {
      const v = asciiLower(val)
      attrs.sameSite = v === 'none' || v === 'lax' || v === 'strict' ? v : undefined
      // Fail closed whatever order a browser resolves duplicate SameSite attributes in.
      if (v === 'none') attrs.sameSiteNoneSeen = true
    }
  }
  return attrs
}

/** P6.1 review round 1 (blocking B): reasons a browser would REJECT this Set-Cookie entry
 *  outright (no cookie is stored, so the login cookie is kept), as short codes, never values.
 *  Empty array = accepted by these rules. RFC 6265bis §5.6/§5.7 and Chrome 80+:
 *  - 'ctl': a CTL other than HTAB (%x00-08, %x0A-1F, %x7F) anywhere in the entry.
 *  - 'non-ascii': any character above %x7F. Browsers differ (Chrome keeps some, rejects
 *    others) and the harness cannot model it, so it fails closed; the real app's clear is ASCII.
 *  - 'name-value-over-4096': name + value longer than 4096 octets.
 *  - 'samesite-none-without-secure': a SameSite=None attribute without Secure.
 *  - 'partitioned-without-secure': Partitioned without Secure.
 *  P6.1 review round 2 (blocking), on the LAST Domain attribute (attrs.domainLast):
 *  - 'domain-empty-after-dot': it is '.' (e.g. `Domain=.` or `Domain= . `). Chrome's
 *    GetCookieDomainWithString finds '.' matches neither the host nor its registrable domain
 *    and rejects the whole Set-Cookie, so the sealed login cookie is kept; the RFC reading
 *    (drop the '.', empty = host-only) would call it a host-only clear. A later empty
 *    `Domain=` (`Domain=.; Domain=`) is host-only in both readings and is not rejected.
 *  - 'domain-last-empty-after-domain': it is empty but an earlier Domain set a real domain
 *    (`Domain=x; Domain=`). Chrome makes the cookie host-only, RFC 6265 keeps Domain=x; the
 *    harness cannot know which the browser does, so it fails closed. */
export function setCookieRejectionReasons(entry, attrs = parseCookieAttrs(entry)) {
  const raw = String(entry ?? '')
  const reasons = []
  if (/[\x00-\x08\x0A-\x1F\x7F]/.test(raw)) reasons.push('ctl')
  if (/[^\x00-\x7F]/.test(raw)) reasons.push('non-ascii')
  if (Buffer.byteLength(attrs.name, 'utf8') + Buffer.byteLength(attrs.value, 'utf8') > COOKIE_MAX_NAME_VALUE_BYTES)
    reasons.push('name-value-over-4096')
  if ((attrs.sameSiteNoneSeen || attrs.sameSite === 'none') && !attrs.secure) reasons.push('samesite-none-without-secure')
  if (attrs.partitioned && !attrs.secure) reasons.push('partitioned-without-secure')
  if (attrs.domainLast === '.') reasons.push('domain-empty-after-dot')
  if (attrs.domainLast === '' && attrs.domain) reasons.push('domain-last-empty-after-domain')
  return reasons
}

/** RFC 6265 §5.1.1 cookie-date algorithm. Returns epoch ms (UTC), or null when the algorithm
 *  fails (then the Expires attribute is ignored, §5.2.1). Tokens are split on the §5.1.1
 *  delimiter set; the first token matching each of time (hh:mm:ss), day-of-month (1-2 digits),
 *  month (first three letters) and year (2-4 digits) is taken, in that priority order per
 *  token. All four are required; year 70-99 -> 19xx, 0-69 -> 20xx; the date must exist and
 *  day 1-31, year >= 1601, hour <= 23, minute <= 59, second <= 59. */
const COOKIE_DATE_DELIMITER = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]+/
const COOKIE_DATE_MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
export function parseCookieDate(input) {
  const tokens = String(input ?? '').split(COOKIE_DATE_DELIMITER).filter((t) => t !== '')
  let time = null
  let day = null
  let month = null
  let year = null
  for (const token of tokens) {
    let m
    if (time === null && (m = /^(\d{1,2}):(\d{1,2}):(\d{1,2})(?:[^0-9][\s\S]*)?$/.exec(token))) {
      time = [Number(m[1]), Number(m[2]), Number(m[3])]
      continue
    }
    if (day === null && (m = /^(\d{1,2})(?:[^0-9][\s\S]*)?$/.exec(token))) {
      day = Number(m[1])
      continue
    }
    if (month === null && token.length >= 3 && COOKIE_DATE_MONTHS.includes(token.slice(0, 3).toLowerCase())) {
      month = COOKIE_DATE_MONTHS.indexOf(token.slice(0, 3).toLowerCase())
      continue
    }
    if (year === null && (m = /^(\d{2,4})(?:[^0-9][\s\S]*)?$/.exec(token))) {
      year = Number(m[1])
      continue
    }
  }
  if (year !== null && year >= 70 && year <= 99) year += 1900
  if (year !== null && year >= 0 && year <= 69) year += 2000
  if (time === null || day === null || month === null || year === null) return null
  const [hour, minute, second] = time
  if (day < 1 || day > 31 || year < 1601 || hour > 23 || minute > 59 || second > 59) return null
  const t = Date.UTC(year, month, day, hour, minute, second)
  const d = new Date(t)
  // "If no such date exists" (e.g. 30 Feb): Date.UTC would roll it over into the next month.
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month || d.getUTCDate() !== day) return null
  return t
}

/** RFC 6265 §5.1.4 default-path of the request URL that set a cookie: the directory part of
 *  its path (up to, not including, the right-most '/'), or '/' if that would be empty. For
 *  POST /api/admin/login and POST /api/admin/logout both, that is '/api/admin'. */
export function cookieDefaultPath(requestUrl) {
  let uriPath = ''
  try {
    uriPath = new URL(requestUrl).pathname
  } catch {
    uriPath = ''
  }
  if (!uriPath.startsWith('/')) return '/'
  const lastSlash = uriPath.lastIndexOf('/')
  if (lastSlash <= 0) return '/'
  return uriPath.slice(0, lastSlash)
}

/** The Path a browser actually stores a cookie under: its own (valid) Path attribute, else the
 *  default-path of the request that set it. */
export function effectiveCookiePath(attrs, requestUrl) {
  if (attrs?.path && attrs.path.startsWith('/')) return attrs.path
  return cookieDefaultPath(requestUrl)
}

/** True when a single cookie entry's OWN attributes actually clear it, rather than just
 *  re-setting it. RFC 6265 §5.3 step 3: a valid Max-Age takes precedence over Expires, so when
 *  one is present it alone decides (<= 0 clears; `Max-Age=86400; Expires=<1970>` keeps the
 *  cookie for 24h and is NOT a clear). Only without a valid Max-Age does a parsed Expires in the
 *  past clear it. iron-session is stateless, so a logout response that doesn't clear the cookie
 *  leaves the pre-logout cookie fully valid if replayed — F9 below must fail, not pass, then. */
export function isClearingCookieAttrs(attrs) {
  if (!attrs) return false
  if (Number.isInteger(attrs.maxAge)) return attrs.maxAge <= 0
  // P6.1: only a §5.1.1 cookie-date counts (parseCookieDate), never V8's Date.parse. `expiresAt`
  // is set by parseCookieAttrs; a hand-built attrs object with just `expires` is re-parsed.
  if (attrs.expires !== undefined) {
    const t = Number.isFinite(attrs.expiresAt) ? attrs.expiresAt : parseCookieDate(attrs.expires)
    if (t !== null && t <= Date.now()) return true
  }
  return false
}

/** Back-compat convenience: same clearing test, but taking a single raw Set-Cookie string
 *  (e.g. `growmax-admin=; Max-Age=0; Path=/`) directly, as opposed to a pre-parsed attrs
 *  object. Never call this on Node's ', '-joined multi-cookie header — use
 *  getSetCookieEntries()+parseCookieAttrs() to split it into entries first. */
export function isClearingSetCookie(rawSetCookie) {
  if (!rawSetCookie) return false
  return isClearingCookieAttrs(parseCookieAttrs(rawSetCookie))
}

/** Node's fetch (undici) exposes each Set-Cookie header as its own entry via
 *  `headers.getSetCookie()`, unlike `headers.get('set-cookie')` which comma/space-joins them
 *  into one unparseable string. Falls back to the single-header form only if getSetCookie is
 *  somehow unavailable (older undici). */
export function getSetCookieEntries(headers) {
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie()
  const raw = headers.get('set-cookie')
  return raw ? [raw] : []
}

// F2 (SPEC-04 §6): a real demo request fires a real Google Chat message and is capped at 3
// sends for the whole migration. A marker file per runLabel (no PII: just the label, a
// timestamp, and which deployment was hit) makes a duplicate run for the SAME runLabel refuse
// outright, instead of relying solely on the caller-supplied/STATE.json counter, which can
// still read stale if the verifier re-runs the suite before the orchestrator's own counter is
// updated (the bug this closes: F2 fired twice in one run because of exactly that staleness).
// DEMO_TEST_MARKER_DIR_OVERRIDE (env, test-only): lets selftest-p5.3.mjs point this at a throwaway
// temp directory instead of the real docs/migration/.scratch/demo-tests, so its F2 simulations
// (including a multi-"run" cap simulation) never read or write real migration marker state.
// Per review round 2 (non-blocking): main() refuses to run with --allow-demo-test while this
// override is set, so a stray env var can never move the real cap's markers elsewhere.
export const DEMO_TEST_CAP = 3
export const DEMO_TEST_MARKER_DIR = process.env.DEMO_TEST_MARKER_DIR_OVERRIDE
  ? path.resolve(process.env.DEMO_TEST_MARKER_DIR_OVERRIDE)
  : path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', '.scratch', 'demo-tests')

/** Per review round 2 (non-blocking): a runLabel becomes a file name, so it must be one plain
 *  path segment — no '/', '\\', NUL, and not '.' or '..' — or a marker could land outside the
 *  directory countDemoTestMarkers/readDemoTestMarkers read. Throws (so F2 never sends). */
export function assertSafeRunLabel(runLabel) {
  const label = String(runLabel ?? '')
  if (label === '' || label === '.' || label === '..' || /[\/\\\0]/.test(label)) {
    throw new Error(`unsafe runLabel for a demo-test marker file name: ${JSON.stringify(label)}`)
  }
  return label
}

export function demoTestMarkerPath(runLabel) {
  return path.join(DEMO_TEST_MARKER_DIR, `${assertSafeRunLabel(runLabel)}.sent`)
}

export async function demoTestMarkerExists(runLabel) {
  try {
    await access(demoTestMarkerPath(runLabel))
    return true
  } catch {
    return false
  }
}

export async function countDemoTestMarkers() {
  try {
    const files = await readdir(DEMO_TEST_MARKER_DIR)
    return files.filter((f) => f.endsWith('.sent')).length
  } catch {
    return 0
  }
}

/** Reads every marker's own JSON, for resolveDemoTestsSentCount below. Per review round 2
 *  (non-blocking): a marker that exists but fails to parse (or has no integer countBefore) is
 *  kept as `{ corrupt: true }`, which resolveDemoTestsSentCount counts as the CAP itself — an
 *  unreadable marker proves a send was attempted but not how many came before it, so it must
 *  never let the count go under the cap. `excludeRunLabel` leaves out that label's own marker
 *  (used by F2's post-create re-count). */
export async function readDemoTestMarkers({ excludeRunLabel } = {}) {
  const excluded = excludeRunLabel === undefined ? null : `${assertSafeRunLabel(excludeRunLabel)}.sent`
  try {
    const files = await readdir(DEMO_TEST_MARKER_DIR)
    const markers = []
    for (const f of files.filter((name) => name.endsWith('.sent') && name !== excluded)) {
      try {
        const m = JSON.parse(await readFile(path.join(DEMO_TEST_MARKER_DIR, f), 'utf8'))
        markers.push(m && typeof m === 'object' && Number.isInteger(m.countBefore) ? m : { ...(m && typeof m === 'object' ? m : {}), corrupt: true })
      } catch {
        markers.push({ corrupt: true })
      }
    }
    return markers
  } catch {
    return []
  }
}

function demoTestMarkerJson(runLabel, base, { countBefore, status } = {}) {
  return JSON.stringify(
    {
      runLabel,
      sentAt: new Date().toISOString(),
      base,
      countBefore: Number.isInteger(countBefore) ? countBefore : null,
      status: status === 'pending' ? 'pending' : 'sent',
    },
    null,
    2,
  )
}

function tmpMarkerPath(finalPath) {
  // Never ends in '.sent', so a leftover tmp file is never counted as a marker.
  return `${finalPath}.tmp-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Writes/overwrites the marker for `runLabel`. `countBefore` is the effective demo-test count
 *  resolveDemoTestsSentCount() reported immediately before this send was attempted — recording
 *  it here is what lets a LATER run recover the correct post-send count (countBefore + 1) from
 *  the marker alone, even if STATE.json is stale and this is the only marker that exists yet
 *  (see resolveDemoTestsSentCount). `status` is 'pending' (written BEFORE the POST, so a
 *  process killed mid-request still leaves a marker — fail-safe: an orphaned pending marker can
 *  only inflate the count) or 'sent' (written after, whatever the response was: a real send may
 *  have already reached the server even on a non-201 or a parse failure). No PII: just the
 *  label, timing, which deployment, and these two harness-internal counters. Per review round 2
 *  (non-blocking): written atomically (tmp file + rename), so a kill mid-write can never leave a
 *  truncated marker behind. */
export async function writeDemoTestMarker(runLabel, base, { countBefore, status } = {}) {
  await mkdir(DEMO_TEST_MARKER_DIR, { recursive: true })
  const finalPath = demoTestMarkerPath(runLabel)
  const tmp = tmpMarkerPath(finalPath)
  await writeFile(tmp, demoTestMarkerJson(runLabel, base, { countBefore, status }))
  await rename(tmp, finalPath)
}

/** Creates the 'pending' marker for `runLabel` EXCLUSIVELY and atomically: the full JSON is
 *  written to a tmp file first, then hard-linked into place (link() fails with EEXIST if the
 *  marker already exists, and the marker never appears half-written). Returns false if a marker
 *  for this runLabel already existed (a duplicate run: refuse), true if this call created it.
 *  Per review round 2 (non-blocking): this is the lock that closes the check-then-write race
 *  between two runs started at the same time. */
export async function createPendingDemoTestMarker(runLabel, base, { countBefore } = {}) {
  await mkdir(DEMO_TEST_MARKER_DIR, { recursive: true })
  const finalPath = demoTestMarkerPath(runLabel)
  const tmp = tmpMarkerPath(finalPath)
  await writeFile(tmp, demoTestMarkerJson(runLabel, base, { countBefore, status: 'pending' }), { flag: 'wx' })
  try {
    await link(tmp, finalPath)
    return true
  } catch (err) {
    if (err && err.code === 'EEXIST') return false
    throw err
  } finally {
    await unlink(tmp).catch(() => {})
  }
}

/** Removes this run's own 'pending' marker — only ever called when F2 refuses AFTER creating
 *  it but BEFORE the POST (so nothing was sent and the marker must not inflate later counts). */
export async function removePendingDemoTestMarker(runLabel) {
  await unlink(demoTestMarkerPath(runLabel)).catch(() => {})
}

/** The cap-vs-3 count uses the HIGHEST of: the caller-supplied/STATE.json counter, the number
 *  of .sent marker files on disk, and (marker.countBefore + 1) for every marker — pulled out as
 *  its own function so the self-test can exercise the exact formula directly.
 *
 *  Per review (blocking): `Math.max(fromState, markerCount)` alone undercounts whenever
 *  STATE.json is stale AND a marker exists for a send STATE doesn't know about yet — e.g.
 *  STATE=2 (2 real historical sends, no markers), send #3 under label L writes a marker, a
 *  same-label re-run correctly refuses, but a re-run under a NEW label L2 before the
 *  orchestrator updates STATE.json recomputes max(2, 1)=2, which is UNDER the cap and sends
 *  #4 — the exact staleness bug 4 already describes, just one send later. Folding in each
 *  marker's own countBefore closes this: L's marker recorded countBefore=2 (the resolved count
 *  right before send #3), so max(fromState, markerCount, countBefore+1) = max(2, 1, 3) = 3,
 *  which is AT the cap and correctly refuses #4 regardless of what STATE.json still says.
 *
 *  Per review round 2 (non-blocking), fail closed on anything unknowable: a non-integer (or
 *  negative) `fromState` — e.g. `--demo-tests-sent two`, which Number() turns into NaN, and
 *  Math.max(NaN, ...) is NaN, and NaN >= 3 is false — resolves to the cap, and so does any
 *  marker without an integer countBefore (corrupt/truncated). */
export function resolveDemoTestsSentCount(fromState, markers) {
  if (!Number.isInteger(fromState) || fromState < 0) return DEMO_TEST_CAP
  const markerList = Array.isArray(markers) ? markers : []
  const markerCount = markerList.length
  const maxCountBeforePlusOne = markerList.reduce((acc, m) => {
    if (!Number.isInteger(m?.countBefore) || m?.corrupt) return Math.max(acc, DEMO_TEST_CAP)
    return Math.max(acc, m.countBefore + 1)
  }, 0)
  return Math.max(fromState, markerCount, maxCountBeforePlusOne)
}

/** F2's whole pre-send decision, exported so selftest-p5.3.mjs can drive it against a temp
 *  marker dir (never a real send). Returns `{ refusal: null, countBefore }` when this run now
 *  holds its own 'pending' marker and may POST exactly once (and must then write the 'sent'
 *  marker with that countBefore), or `{ refusal: '<reason>' }` when it must not send — in which
 *  case any pending marker it created has already been removed, since nothing was POSTed.
 *
 *  Order: (1) this runLabel's marker exists -> duplicate, refuse; (2) the resolved count is not
 *  an integer or is >= the cap -> refuse; (3) exclusively create this run's pending marker
 *  (EEXIST = a concurrent same-label run won -> refuse); (4) per review round 2 (non-blocking,
 *  the missing lock): re-count over every OTHER marker now that ours is visible to them. Any
 *  other marker still 'pending' (or unreadable) means a send may be in flight whose outcome is
 *  unknown, so refuse (fail closed; an orphaned pending marker from a killed process blocks
 *  until the orchestrator resolves it by hand). A re-count at the cap refuses; a higher
 *  re-count under the cap is recorded as this send's countBefore. Because each run creates its
 *  marker before it re-counts, whichever of two concurrent runs creates second always sees the
 *  first's marker, so two concurrent runs never both send on the same count. */
export async function reserveDemoTestSend(runLabel, base, demoTestsSent) {
  let countBefore = demoTestsSent ?? DEMO_TEST_CAP
  let createdPending = false
  let refusal = null
  try {
    if (await demoTestMarkerExists(runLabel)) {
      refusal =
        `a demo test was already sent for runLabel ${runLabel} ` +
        `(marker ${demoTestMarkerPath(runLabel)} exists); refusing to send a duplicate`
    } else if (!Number.isInteger(countBefore) || countBefore >= DEMO_TEST_CAP) {
      refusal = `demoTestsSent (${countBefore}) >= ${DEMO_TEST_CAP} (or unknown), refusing to send another`
    } else if (!(await createPendingDemoTestMarker(runLabel, base, { countBefore }))) {
      refusal = `a marker for runLabel ${runLabel} appeared concurrently (${demoTestMarkerPath(runLabel)}); refusing to send a duplicate`
    } else {
      createdPending = true
      const others = await readDemoTestMarkers({ excludeRunLabel: runLabel })
      const recount = resolveDemoTestsSentCount(countBefore, others)
      const otherPending = others.filter((m) => m.status === 'pending' || m.corrupt)
      if (otherPending.length > 0) {
        refusal =
          `${otherPending.length} other demo-test marker(s) are pending or unreadable in ${DEMO_TEST_MARKER_DIR} ` +
          '(a concurrent or killed F2 run); refusing to send until that is resolved'
      } else if (recount >= DEMO_TEST_CAP) {
        refusal = `demoTestsSent re-counted after taking the marker is ${recount} >= ${DEMO_TEST_CAP}, refusing to send another`
      } else if (recount > countBefore) {
        countBefore = recount
        await writeDemoTestMarker(runLabel, base, { countBefore, status: 'pending' })
      }
    }
  } catch (err) {
    refusal = `demo-test marker bookkeeping failed before any send (${String(err.message || err)}); refusing to send`
  }
  if (refusal) {
    // Nothing was POSTed, so this run's own pending marker must not inflate later counts.
    if (createdPending) await removePendingDemoTestMarker(runLabel)
    return { refusal }
  }
  return { refusal: null, countBefore }
}

/** Best-effort hostname of a Postgres connection string, without ever printing the string. */
function hostOfConnString(connString) {
  try {
    return new URL(connString).hostname.toLowerCase()
  } catch {
    return null
  }
}

async function loadDbHelper(targetDbEnvName) {
  try {
    // P1.1's shared DB helper (scripts/migration/db/lib.mjs, SPEC-03 §1). This file only
    // calls into it — P1.2 does not own scripts/migration/db/ and never writes there.
    // connect() returns { query(sql, params?) -> Promise<{rows}>, batch, end() }.
    const { connect } = await import('../db/lib.mjs')
    // Not readOnly: F1/F2/F7/F8 write and then delete their own labeled test rows.
    const conn = await connect(targetDbEnvName, { readOnly: false, transport: 'neon-https' })
    return conn
  } catch (err) {
    console.warn(`WARNING: scripts/migration/db/lib.mjs unavailable (${err.message}); falling back to a direct Neon query`)
    return null
  }
}

// Per review: this used to be called as `sql(strings, ...values)` — treating `sql` as if it
// were invoked as a real tagged template — but `whereSql`/`text` here is a single already-
// built string containing literal `$1`-style placeholders, not a template-strings array, so
// `values` was silently dropped on every fallback call (findRow/deleteRow's `params` never
// reached the query). `sql.query(text, params)` is the driver's actual parameterized-query
// entry point (see db/lib.mjs's connectNeonHttp, which uses the same call).
async function directNeonQuery(databaseUrl, text, params = []) {
  const { neon } = await import('@neondatabase/serverless')
  const sql = neon(databaseUrl)
  return sql.query(text, params)
}

/** Raised when a response doesn't carry a Vercel origin signature where one is required. */
class VercelOriginError extends Error {}

export class Assertions {
  constructor({ base, bypassSecret, targetDatabaseUrl, dbHelper }) {
    this.base = base
    this.bypassSecret = bypassSecret
    this.targetDatabaseUrl = targetDatabaseUrl
    this.dbHelper = dbHelper
    this.cookie = null
    // The admin cookie's OWN Path/Domain as F4's login response set them (captureSetCookie
    // below), so F9's checkLogout can require logout's clearing Set-Cookie to match the same
    // Path/Domain the browser actually has the cookie under — a clear on a different Path (a
    // browser keeps the Path=/ login cookie) or Domain is not a real clear. null until F4 runs.
    this.loginCookieAttrs = null
  }

  url(p) {
    return new URL(p, this.base).toString()
  }

  /** Every Vercel response, protected or not, carries `x-vercel-id`; most also say
   *  `server: Vercel`. Checking both is defense against either header being stripped by an
   *  intermediary. */
  static isVercelResponse(res) {
    const vercelId = res.headers.get('x-vercel-id')
    const server = (res.headers.get('server') || '').toLowerCase()
    return !!vercelId || server.includes('vercel')
  }

  async request(pathname, init = {}) {
    const headers = { ...(init.headers || {}) }
    if (this.bypassSecret) headers['x-vercel-protection-bypass'] = this.bypassSecret
    if (this.cookie) headers['cookie'] = this.cookie
    const res = await fetch(this.url(pathname), { ...init, headers, redirect: 'manual' })
    // Per review: the container's resolver/DoH cache can still answer `base`'s host with
    // Replit's IP for up to its 300s TTL after cutover, and `--mode pre`'s hostname guard
    // (below) only fires for the two literal production hostnames — a --base pointed
    // anywhere else (a Vercel preview alias that has NOT actually cut over, a stale alias,
    // a typo) sails through it. Refusing to send/trust a state-changing request whose
    // response isn't demonstrably from Vercel closes that gap for every write this suite
    // makes (F1/F2/F7/F8's DELETE/PUT/POST, and F3/F4/F9's admin session writes).
    const method = (init.method || 'GET').toUpperCase()
    if (method !== 'GET' && method !== 'HEAD' && !Assertions.isVercelResponse(res)) {
      throw new VercelOriginError(
        `${method} ${this.url(pathname)} response has no Vercel origin signature (x-vercel-id absent, ` +
          `server=${JSON.stringify(res.headers.get('server'))}). Refusing to trust this write: --base may ` +
          'still resolve to Replit or another origin.',
      )
    }
    return res
  }

  async requestJson(pathname, init = {}) {
    const res = await this.request(pathname, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init.headers || {}) },
    })
    let body = null
    try {
      body = await res.json()
    } catch {
      body = null
    }
    return { res, body }
  }

  /** `requestUrl` is the URL the response answers (defaults to `res.url`, which with
   *  redirect:'manual' is the request URL); it is needed for the RFC 6265 default-path of a
   *  cookie set without a (valid) Path attribute. */
  captureSetCookie(res, requestUrl = res.url) {
    const raw = res.headers.get('set-cookie')
    if (raw) {
      this.cookie = raw.split(';')[0]
      // Record the admin cookie's own Path/Domain, matched by exact name (not the first
      // Set-Cookie header, in case there's ever more than one) — F9's checkLogout compares
      // logout's clearing Set-Cookie against these same attributes. `effectivePath` is the
      // Path the browser really stores it under (attribute, else the login URL's default-path).
      const entries = getSetCookieEntries(res.headers)
      const adminEntries = entries.filter((e) => parseCookieAttrs(e).name === ADMIN_COOKIE_NAME)
      if (adminEntries.length === 1) {
        const attrs = parseCookieAttrs(adminEntries[0])
        this.loginCookieAttrs = { ...attrs, effectivePath: effectiveCookiePath(attrs, requestUrl) }
        // The jar holds the admin cookie itself, never whichever Set-Cookie happened to be first.
        this.cookie = `${attrs.name}=${attrs.value}`
      }
    }
    return raw
  }

  /** The exact-name growmax-admin Set-Cookie entry of `res`, or null if there is none or more
   *  than one (ambiguous). */
  static adminCookieEntry(res) {
    const entries = getSetCookieEntries(res.headers).filter((e) => parseCookieAttrs(e).name === ADMIN_COOKIE_NAME)
    return entries.length === 1 ? entries[0] : null
  }

  /** Row lookup in the TARGET (Neon) database. Read-only. */
  async findRow(table, whereSql, params) {
    if (this.dbHelper?.query) {
      const { rows } = await this.dbHelper.query(`SELECT * FROM ${table} WHERE ${whereSql}`, params)
      return rows
    }
    if (!this.targetDatabaseUrl) throw new Error('No DB access available: neither scripts/migration/db/ nor --target-database-url-env is set')
    const rows = await directNeonQuery(this.targetDatabaseUrl, `SELECT * FROM ${table} WHERE ${whereSql}`, params)
    return rows
  }

  async deleteRow(table, whereSql, params) {
    if (this.dbHelper?.query) {
      return this.dbHelper.query(`DELETE FROM ${table} WHERE ${whereSql}`, params)
    }
    if (!this.targetDatabaseUrl) throw new Error('No DB access available for cleanup')
    return directNeonQuery(this.targetDatabaseUrl, `DELETE FROM ${table} WHERE ${whereSql}`, params)
  }
}

/** F4's check of the login response's ONE exact-name growmax-admin Set-Cookie entry (or null).
 *  The attribute regexes run over that entry alone, never Node's comma-joined header string.
 *  P6.1 review round 2 (non-blocking, closed here): the entry must also be one a browser
 *  accepts (setCookieRejectionReasons), so e.g. a login with `Domain=.`, which Chromium rejects
 *  (the browser is never logged in), fails F4 instead of being put in the jar as if it had
 *  been stored. Returns reason codes only, never the cookie value. */
export function checkLoginCookieEntry(adminEntry) {
  const adminAttrs = adminEntry ? parseCookieAttrs(adminEntry) : null
  const loginRejectionReasons = adminEntry ? setCookieRejectionReasons(adminEntry, adminAttrs) : null
  const cookieOk =
    !!adminEntry &&
    loginRejectionReasons.length === 0 &&
    adminAttrs.value !== '' &&
    /;\s*HttpOnly\s*(;|$)/i.test(adminEntry) &&
    /;\s*Secure\s*(;|$)/i.test(adminEntry) &&
    /;\s*SameSite=Lax\s*(;|$)/i.test(adminEntry) &&
    adminAttrs.maxAge === 86400
  return { cookieOk, loginRejectionReasons }
}

/** The parser's reading of one logout response's Set-Cookie entries against the login cookie's
 *  captured attributes: the whole clearing decision checkLogout makes, as a pure function (no
 *  network), so F9's browser run (checkLogoutInBrowser below) can record the same verdict as
 *  DIAGNOSTICS from the Set-Cookie headers Chromium itself received. Since P6.1 (F9 decided by
 *  a real browser) this verdict never decides F9. Returns attributes and booleans, and
 *  `adminAttrs`, which does hold the cookie value: callers must not put it in any detail. */
export function diagnoseLogoutSetCookies({ loginAttrs, setCookieEntries, logoutUrl, loginUrl }) {
  // Per review (blocking): Node's `headers.get('set-cookie')` comma-joins every Set-Cookie
  // header into one string, and the old code matched the cookie by `.includes('growmax-
  // admin=')` over that joined string — so an UNRELATED cookie's Max-Age=0 could satisfy the
  // clearing regexes, or a re-set growmax-admin cookie appearing anywhere in the joined
  // string would still substring-match. Use getSetCookie() to get each header as its own
  // entry, then select the ONE entry whose name (before '=') is EXACTLY 'growmax-admin'.
  const adminEntries = setCookieEntries.filter((entry) => parseCookieAttrs(entry).name === ADMIN_COOKIE_NAME)
  // If the server ever sent more than one growmax-admin Set-Cookie in the same response,
  // treat it as ambiguous/untrusted rather than picking one arbitrarily — a regression that
  // clears it once and re-sets it again must not accidentally pick the clearing entry.
  const adminEntry = adminEntries.length === 1 ? adminEntries[0] : null
  const adminAttrs = adminEntry ? parseCookieAttrs(adminEntry) : null
  const clearsValue = isClearingCookieAttrs(adminAttrs)
  // The clearing entry's own EFFECTIVE Path (and Domain, if either side sets one) must match
  // the login cookie's (captured at F4): a clear on the wrong Path (e.g. Path=/api/admin, while
  // the browser holds the cookie under the login's Path=/) or a mismatched Domain does not
  // actually clear the cookie the browser is sending on every request. Per review round 2
  // (blocking): the effective Path follows RFC 6265 — a logout Set-Cookie with NO (valid) Path
  // gets the default-path of POST /api/admin/logout, i.e. /api/admin, never '/', so it misses a
  // Path=/ login cookie exactly like an explicit Path=/api/admin does. And with no captured
  // login attributes there is nothing to compare against: fail closed, never skip the check.
  loginAttrs = loginAttrs || null
  const logoutEffectivePath = adminAttrs ? effectiveCookiePath(adminAttrs, logoutUrl) : null
  const loginEffectivePath = loginAttrs ? loginAttrs.effectivePath || effectiveCookiePath(loginAttrs, loginUrl) : null
  const pathMatches = !!loginAttrs && !!adminAttrs && logoutEffectivePath === loginEffectivePath
  const domainMatches =
    !!loginAttrs && !!adminAttrs && ((!adminAttrs.domain && !loginAttrs.domain) || adminAttrs.domain === loginAttrs.domain)
  // P6.1 (A3 C-A3-4): a Partitioned (CHIPS) clear lives in a different cookie jar partition
  // from an unpartitioned login cookie, so Chrome keeps the login cookie (and vice versa).
  const partitionedMatches = !!loginAttrs && !!adminAttrs && !!adminAttrs.partitioned === !!loginAttrs.partitioned
  // P6.1 review round 1 (blocking B): an entry the browser rejects outright (SameSite=None or
  // Partitioned without Secure, name+value over 4096 octets, a CTL, or fail-closed non-ASCII)
  // stores nothing, so the sealed login cookie is kept: never a clear, whatever it says.
  const browserRejectionReasons = adminEntry ? setCookieRejectionReasons(adminEntry, adminAttrs) : null
  const acceptedByBrowserRules = !!adminEntry && browserRejectionReasons.length === 0
  const clearsAdminCookie =
    !!loginAttrs && !!adminEntry && acceptedByBrowserRules && clearsValue && pathMatches && domainMatches && partitionedMatches
  return {
    adminEntries,
    adminEntry,
    adminAttrs,
    clearsValue,
    loginEffectivePath,
    logoutEffectivePath,
    pathMatches,
    domainMatches,
    partitionedMatches,
    browserRejectionReasons,
    acceptedByBrowserRules,
    clearsAdminCookie,
  }
}

/**
 * The parser-based F9: logout, then session -> isAdmin false. iron-session is STATELESS: replaying the
 * pre-logout cookie after logout still decrypts to isAdmin:true (nothing server-side is
 * invalidated), so the old version of this check — which read `A.cookie` unchanged from F4's
 * login and never looked at logout's own Set-Cookie — passed even when logout didn't clear
 * anything. This now requires BOTH: logout's response actually clears the admin cookie
 * (Max-Age<=0, or without a valid Max-Age an RFC 6265 §5.1.1 Expires in the past, on the same
 * effective Path, Domain and Partitioned state as the login cookie, in an entry a browser would
 * accept at all: see setCookieRejectionReasons), AND a follow-up GET
 * /api/admin/session sent with growmax-admin=<the clearing entry's own value> in the jar (never
 * the stale cookie, and never an emptied jar) reports isAdmin:false. An app regression that stops clearing the cookie fails this outright,
 * regardless of what /api/admin/session then reports. Exported and unit-tested against a
 * local mock server (never a real endpoint) in functional/selftest-p5.3.mjs.
 *
 * P6.1 (F9 decided by a real browser): kept exported and unchanged in behaviour for those unit
 * tests, but runTests no longer uses it. F9 is decided by a real Chromium context in
 * checkLogoutInBrowser below, which records diagnoseLogoutSetCookies' verdict as diagnostics.
 */
export async function checkLogout(A) {
  try {
    const { res: logoutRes } = await A.requestJson('/api/admin/logout', { method: 'POST' })
    const setCookieEntries = getSetCookieEntries(logoutRes.headers)
    const loginAttrs = A.loginCookieAttrs || null
    const {
      adminEntries,
      adminAttrs,
      clearsValue,
      loginEffectivePath,
      logoutEffectivePath,
      pathMatches,
      domainMatches,
      partitionedMatches,
      browserRejectionReasons,
      acceptedByBrowserRules,
      clearsAdminCookie,
    } = diagnoseLogoutSetCookies({
      loginAttrs,
      setCookieEntries,
      logoutUrl: logoutRes.url || A.url('/api/admin/logout'),
      loginUrl: A.url('/api/admin/login'),
    })
    // Apply the clearing Set-Cookie to the jar so the follow-up request can never replay the
    // stale pre-logout session cookie. Only a clear that a browser would honor (all of the
    // above) replaces it; otherwise the stale cookie stays in the jar, as it would in a browser.
    // P6.1 (A3 C-A3-4, defence in depth): the jar is NOT emptied. It gets
    // growmax-admin=<the clearing entry's own value>, which is what a browser would still hold
    // if this harness had misread the expiry. The real app clears with an empty value
    // (growmax-admin=; Path=/; Max-Age=0), which /api/admin/session reads as not admin; a
    // regression that re-sends the sealed value then fails on isAdmin even if some expiry
    // syntax were misread above.
    if (clearsAdminCookie) A.cookie = `${ADMIN_COOKIE_NAME}=${adminAttrs.value}`
    const { res: sessionRes, body } = await A.requestJson('/api/admin/session')
    return {
      name: 'F9-logout',
      pass: logoutRes.status === 200 && clearsAdminCookie && sessionRes.status === 200 && body?.isAdmin === false,
      detail: {
        logoutStatus: logoutRes.status,
        setCookieEntryCount: setCookieEntries.length,
        adminEntryCount: adminEntries.length,
        ...(loginAttrs
          ? {}
          : { error: 'no login cookie attributes were captured (F4 recorded no single exact-name growmax-admin Set-Cookie); failing closed' }),
        clearsValue,
        loginEffectivePath,
        logoutEffectivePath,
        pathMatches,
        domainMatches,
        partitionedMatches,
        acceptedByBrowserRules,
        browserRejectionReasons,
        clearsAdminCookie,
        clearingValueEmpty: clearsAdminCookie ? adminAttrs.value === '' : null,
        sessionAfter: body,
      },
    }
  } catch (err) {
    return { name: 'F9-logout', pass: false, detail: { error: String(err.message || err) } }
  }
}

// ---------------------------------------------------------------------------------------------
// P6.1 (F9 decided by a real browser). Three review rounds each found another way a browser
// cookie jar re-implemented in this harness disagreed with Chrome (NBSP trimming, SameSite=None
// or Partitioned without Secure, entries over 4096 bytes, `Domain=.`, an empty-named cookie that
// smuggles the sealed value back), and each one let F9 pass while a browser stayed logged in.
// So F9 is now decided by a REAL headless Chromium (playwright-core): login, session, logout and
// session again all go through Chromium's own network stack and cookie jar, as in-page fetch()
// calls from a page at the base origin (never Playwright's APIRequestContext, whose cookie jar
// is not Chromium's). The parser verdict (diagnoseLogoutSetCookies) and the logout Set-Cookie
// attributes are recorded as diagnostics only. If Chromium cannot launch, F9 fails; there is no
// fallback to the parser.

// Same agent-proxy CA handling as scripts/migration/visual/run.mjs (copied, not imported: that
// helper is not exported, and visual/run.mjs is not changed): Playwright's headless Chromium
// does no NSS/desktop trust-store integration, so it is pinned to exactly this one CA with
// --ignore-certificate-errors-spki-list instead of disabling TLS verification.
const F9_PROXY_CA_PATH = '/root/.ccr/agent-proxy-ca.crt'
export const F9_DEFAULT_CHROMIUM_PATH = '/opt/pw-browsers/chromium'
/** The page F9 runs its fetch() calls from. It is fulfilled by the route handler itself, so it
 *  never reaches the network: the page's origin is the base origin without a navigation that
 *  could be redirected elsewhere. */
export const F9_BLANK_PATH = '/__migration-f9-blank__'
const F9_STEP_TIMEOUT_MS = 20000
const F9_LAUNCH_TIMEOUT_MS = 60000

export async function f9ProxyCaSpkiPinArgs() {
  if (!process.env.HTTPS_PROXY) return []
  try {
    const pem = await readFile(F9_PROXY_CA_PATH, 'utf8')
    const { X509Certificate, createHash } = await import('node:crypto')
    const cert = new X509Certificate(pem)
    const spki = cert.publicKey.export({ type: 'spki', format: 'der' })
    const pin = createHash('sha256').update(spki).digest('base64')
    return [`--ignore-certificate-errors-spki-list=${pin}`]
  } catch {
    // No proxy CA here: launch without the pin; a real TLS failure then still fails closed.
    return []
  }
}

export function f9ChromiumExecutablePath() {
  return process.env.PLAYWRIGHT_CHROMIUM_PATH || F9_DEFAULT_CHROMIUM_PATH
}

export function f9DefaultProxy() {
  return process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
}

/**
 * Launches headless Chromium and opens a fresh context with one page at `base`'s origin.
 * The protection-bypass header, when a secret is given, is added by a context.route whose URL
 * predicate matches ONLY requests whose origin equals the base origin; every other request is
 * not routed at all and goes out unmodified. No all-requests header mechanism is used.
 * Playwright applies route.continue() header overrides to the redirects a routed request
 * follows too, so F9's own fetch() calls use redirect:'manual' and never follow one, and the
 * page itself is fulfilled locally (F9_BLANK_PATH), never navigated over the network.
 * Service workers are blocked so none can answer a request outside the route.
 * Options other than base/bypassSecret exist for selftest-f9-browser.mjs (a local https mock
 * with a self-signed certificate needs ignoreHTTPSErrors; a real run never sets it).
 */
export async function openF9BrowserContext({
  base,
  bypassSecret,
  executablePath = f9ChromiumExecutablePath(),
  proxy = f9DefaultProxy(),
  ignoreHTTPSErrors = false,
} = {}) {
  const baseOrigin = new URL(base).origin
  const blankUrl = new URL(F9_BLANK_PATH, baseOrigin).href
  const { chromium } = await import('playwright-core')
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    proxy,
    args: await f9ProxyCaSpkiPinArgs(),
    timeout: F9_LAUNCH_TIMEOUT_MS,
  })
  try {
    const context = await browser.newContext({ ignoreHTTPSErrors, serviceWorkers: 'block' })
    await context.route(
      (url) => url.origin === baseOrigin,
      async (route) => {
        const request = route.request()
        if (request.url() === blankUrl) {
          await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<!doctype html><title>F9</title>' })
          return
        }
        // Defence in depth on top of the URL predicate: re-check the origin here too.
        let origin = null
        try {
          origin = new URL(request.url()).origin
        } catch {
          origin = null
        }
        if (bypassSecret && origin === baseOrigin) {
          await route.continue({ headers: { ...request.headers(), 'x-vercel-protection-bypass': bypassSecret } })
        } else {
          await route.continue()
        }
      },
    )
    const page = await context.newPage()
    await page.goto(blankUrl, { waitUntil: 'load', timeout: F9_STEP_TIMEOUT_MS })
    return { browser, context, page, baseOrigin, close: () => browser.close() }
  } catch (err) {
    await browser.close().catch(() => {})
    throw err
  }
}

/** One same-origin fetch() inside the page, through Chromium's own network stack and cookie
 *  jar (credentials:'include'; redirect:'manual', so a redirect is never followed and shows up
 *  as status 0 / type 'opaqueredirect'). Returns status, whether the response carries a Vercel
 *  origin signature, and the parsed JSON body. */
export async function f9PageFetch(page, { method = 'GET', pathname, jsonBody }) {
  return page.evaluate(
    async ({ method, pathname, jsonBody, timeoutMs }) => {
      try {
        const init = { method, credentials: 'include', redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) }
        if (jsonBody !== undefined) {
          init.headers = { 'content-type': 'application/json' }
          init.body = jsonBody
        }
        const res = await fetch(pathname, init)
        let json = null
        try {
          json = JSON.parse(await res.text())
        } catch {
          json = null
        }
        const server = (res.headers.get('server') || '').toLowerCase()
        return { status: res.status, type: res.type, vercel: !!res.headers.get('x-vercel-id') || server.includes('vercel'), json }
      } catch (e) {
        return { error: String((e && e.message) || e) }
      }
    },
    { method, pathname, jsonBody, timeoutMs: F9_STEP_TIMEOUT_MS },
  )
}

/** The Set-Cookie header lines of a Playwright Response exactly as Chromium received them
 *  (headersArray keeps one entry per Set-Cookie line). Diagnostics only. */
async function f9SetCookieLines(response) {
  if (!response) return null
  try {
    const headers = await response.headersArray()
    return headers.filter((h) => h.name.toLowerCase() === 'set-cookie').flatMap((h) => String(h.value).split('\n'))
  } catch {
    return null
  }
}

function f9StatusText(r) {
  if (r.error) return 'a network error'
  if (r.type === 'opaqueredirect') return 'a redirect (never followed by F9)'
  return String(r.status)
}

const F9_MAX_DIAG_STRING = 64
function f9DiagString(s, secrets) {
  if (s === undefined || s === null) return s
  const str = String(s)
  if (f9DecodedForms(str).some((form) => secrets.some((x) => x && form.includes(x)))) return { redacted: 'contains the sealed login value', length: str.length }
  return str.length > F9_MAX_DIAG_STRING ? { truncated: str.slice(0, F9_MAX_DIAG_STRING), length: str.length } : str
}

/** Attributes of each Set-Cookie line (name, Path, Domain, Max-Age, Expires, SameSite, Secure,
 *  Partitioned, HttpOnly), never a value: only its length, whether it is empty and whether it
 *  contains the sealed login value. Any string that contains the sealed value is redacted. */
export function f9SetCookieAttributeSummary(lines, sealedValues = []) {
  if (!Array.isArray(lines)) return null
  const secrets = sealedValues.filter((v) => typeof v === 'string' && v !== '')
  return lines.map((line) => {
    const a = parseCookieAttrs(line)
    return {
      name: f9DiagString(a.name, secrets),
      nameIgnored: a.ignoredNameValue,
      valueLength: a.value.length,
      valueEmpty: a.value === '',
      valueContainsSealedLoginValue: secrets.some((x) => a.value.includes(x)),
      path: f9DiagString(a.path, secrets),
      domain: f9DiagString(a.domain, secrets),
      domainLast: f9DiagString(a.domainLast, secrets),
      maxAge: a.maxAge,
      expires: f9DiagString(a.expires, secrets),
      sameSite: a.sameSite,
      sameSiteNoneSeen: a.sameSiteNoneSeen,
      secure: a.secure,
      partitioned: a.partitioned,
      httpOnly: /;[ \t]*httponly[ \t]*(;|$)/i.test(line),
      entryBytes: Buffer.byteLength(line, 'utf8'),
      parserRejectionReasons: setCookieRejectionReasons(line, a),
    }
  })
}

/** The string plus its percent-decoded forms (decodeURIComponent, repeated while it changes and
 *  succeeds, at most 3 times). A cookie value that is %-escaped on the wire (for example * as %2A)
 *  reaches the app decoded: Next's parseCookie (@edge-runtime/cookies) decodes every value. */
export function f9DecodedForms(str) {
  const forms = [String(str)]
  let cur = String(str)
  for (let i = 0; i < 3; i++) {
    let next
    try {
      next = decodeURIComponent(cur)
    } catch {
      break
    }
    if (next === cur) break
    forms.push(next)
    cur = next
  }
  return forms
}

/** What a stored cookie puts on the wire, as the app reads it. Chromium sends a cookie with an
 *  empty name as its value alone, so `=growmax-admin=<x>` (stored as name '' and value
 *  'growmax-admin=<x>') arrives as `growmax-admin=<x>`. The pair is split at its first '=' and
 *  only the key is trimmed of SP/HTAB; a pair with no '=' is a key whose value Next reads as
 *  "true" (parseCookie), so it is never an empty value. */
export function f9WirePair(c) {
  const name = String(c?.name ?? '')
  const value = String(c?.value ?? '')
  const pair = name === '' ? value : `${name}=${value}`
  const eq = pair.indexOf('=')
  const key = (eq === -1 ? pair : pair.slice(0, eq)).replace(/^[ \t]+|[ \t]+$/g, '')
  const wireValue = eq === -1 ? 'true' : pair.slice(eq + 1)
  return { pair, key, value: wireValue, hasEquals: eq !== -1 }
}

/** Why a cookie left in Chromium's jar after logout still carries a session, or null. Judged by
 *  what the cookie puts on the wire (f9WirePair), not by its stored name: a wire key equal to
 *  growmax-admin (also after percent-decoding) with a non-empty value is a leftover, and so is any
 *  cookie whose name, value or wire pair contains a sealed login value, raw or percent-decoded. */
export function f9LeftoverReason(c, sealedValues) {
  const w = f9WirePair(c)
  const keyForms = f9DecodedForms(w.key).map((k) => k.replace(/^[ \t]+|[ \t]+$/g, ''))
  if (keyForms.includes(ADMIN_COOKIE_NAME) && w.value !== '') {
    return String(c.name) === ADMIN_COOKIE_NAME
      ? `${ADMIN_COOKIE_NAME} with a non-empty value`
      : `sent on the wire as ${ADMIN_COOKIE_NAME}=<non-empty> (stored name ${String(c.name) === '' ? 'empty' : 'differs'})`
  }
  const secrets = f9SealedForms(sealedValues)
  const candidates = [String(c.name ?? ''), String(c.value ?? ''), w.pair, w.value].flatMap((x) => f9DecodedForms(x))
  if (candidates.some((x) => secrets.some((v) => x.includes(v)))) return 'name, value or wire pair contains the sealed login value (raw or percent-decoded)'
  return null
}

/** The sealed login values plus their percent-decoded forms (never empty strings). */
export function f9SealedForms(sealedValues) {
  return [...new Set((sealedValues || []).filter((v) => typeof v === 'string' && v !== '').flatMap((v) => f9DecodedForms(v)))].filter((v) => v !== '')
}

function f9CookieSummary(c, secrets) {
  return {
    name: f9DiagString(c.name, secrets),
    domain: c.domain,
    path: c.path,
    valueLength: String(c.value ?? '').length,
    secure: c.secure,
    httpOnly: c.httpOnly,
    sameSite: c.sameSite,
    partitioned: !!c.partitionKey,
    session: c.expires === -1,
  }
}

/**
 * F9, decided by a real Chromium context. Passes only when, all inside one fresh context:
 *  - login (POST /api/admin/login with ADMIN_PASSWORD) returns 200 with a Vercel origin
 *    signature, and Chromium's jar then holds a growmax-admin cookie with a non-empty value
 *    (the "sealed login value");
 *  - GET /api/admin/session reports isAdmin:true;
 *  - POST /api/admin/logout returns 200 with a Vercel origin signature;
 *  - GET /api/admin/session then reports isAdmin:false;
 *  - context.cookies() (every cookie in the context, a superset of context.cookies(base)) holds
 *    no cookie that goes on the wire as growmax-admin=<non-empty> (an empty-named cookie is
 *    sent as its value alone) and no cookie whose name, value or wire pair contains the sealed
 *    login value, raw or percent-decoded (f9LeftoverReason).
 * The detail records the parser's verdict (diagnoseLogoutSetCookies on the Set-Cookie lines
 * Chromium received) and the logout Set-Cookie attributes, never values; they never decide F9.
 * No cookie value, password or bypass secret is ever put in the result.
 */
export async function checkLogoutInBrowser({ base, bypassSecret, adminPassword, executablePath, proxy, ignoreHTTPSErrors } = {}) {
  const name = 'F9-logout'
  const secretsToRedact = [adminPassword, bypassSecret].filter((x) => typeof x === 'string' && x.length >= 4)
  const redact = (s) => secretsToRedact.reduce((acc, x) => acc.split(x).join('<redacted>'), String(s))
  const detail = {
    decidedBy: 'chromium',
    bypassHeader: bypassSecret ? 'base origin only (context.route origin predicate)' : 'none (no bypass secret)',
    cookieScope: 'context.cookies(): every cookie in the F9 context, a superset of context.cookies(base)',
    failures: [],
  }
  const fail = (msg) => {
    detail.failures.push(msg)
  }
  if (!adminPassword) return { name, pass: false, detail: { ...detail, error: 'ADMIN_PASSWORD is not set; F9 needs it to log in' } }
  if (adminPassword === '[SENSITIVE]')
    return {
      name,
      pass: false,
      detail: { ...detail, error: 'ADMIN_PASSWORD is the literal "[SENSITIVE]" placeholder (vercel env pull redaction), not the real value' },
    }

  let session = null
  try {
    try {
      session = await openF9BrowserContext({ base, bypassSecret, executablePath, proxy, ignoreHTTPSErrors })
    } catch (err) {
      return {
        name,
        pass: false,
        detail: {
          ...detail,
          error: `Chromium could not launch or open the F9 page (${redact(err.message || err).split('\n')[0]}). F9 fails; it never falls back to the cookie parser.`,
          executablePath: executablePath || f9ChromiumExecutablePath(),
        },
      }
    }
    const { browser, context, page, baseOrigin } = session
    detail.chromiumVersion = browser.version()
    const loginUrl = new URL('/api/admin/login', baseOrigin).href
    const logoutUrl = new URL('/api/admin/logout', baseOrigin).href

    // Each POST's own response (for its Set-Cookie lines, diagnostics only).
    const postTo = async (url, jsonBody) => {
      const responseP = page
        .waitForResponse((r) => r.url() === url && r.request().method() === 'POST', { timeout: F9_STEP_TIMEOUT_MS })
        .catch(() => null)
      const r = await f9PageFetch(page, { method: 'POST', pathname: new URL(url).pathname, jsonBody })
      const response = r.error ? null : await responseP
      return { r, setCookieLines: await f9SetCookieLines(response) }
    }
    const steps = {}
    detail.steps = steps

    const login = await postTo(loginUrl, JSON.stringify({ password: adminPassword }))
    steps.login = { status: login.r.status ?? null, type: login.r.type ?? null, vercel: login.r.vercel ?? null, ...(login.r.error ? { error: redact(login.r.error) } : {}) }
    if (login.r.status !== 200) fail(`login returned ${f9StatusText(login.r)}, expected 200`)
    if (!login.r.error && login.r.type !== 'opaqueredirect' && !login.r.vercel) fail('login response has no Vercel origin signature (x-vercel-id absent, server not Vercel); --base may not be Vercel')

    const cookiesAfterLogin = await context.cookies()
    const sealedValues = [...new Set(cookiesAfterLogin.filter((c) => c.name === ADMIN_COOKIE_NAME && c.value !== '').map((c) => c.value))]
    steps.jarAfterLogin = {
      adminCookieCount: cookiesAfterLogin.filter((c) => c.name === ADMIN_COOKIE_NAME).length,
      sealedLoginValueCount: sealedValues.length,
      sealedLoginValueLengths: sealedValues.map((v) => v.length),
      cookies: cookiesAfterLogin.map((c) => f9CookieSummary(c, sealedValues)),
    }
    if (sealedValues.length === 0) fail(`after login Chromium's jar holds no ${ADMIN_COOKIE_NAME} cookie with a non-empty value`)

    const s1 = await f9PageFetch(page, { pathname: '/api/admin/session' })
    steps.sessionAfterLogin = { status: s1.status ?? null, isAdmin: s1.json?.isAdmin, ...(s1.error ? { error: redact(s1.error) } : {}) }
    if (!(s1.status === 200 && s1.json?.isAdmin === true)) fail('session after login did not report isAdmin:true')

    const logout = await postTo(logoutUrl, undefined)
    steps.logout = { status: logout.r.status ?? null, type: logout.r.type ?? null, vercel: logout.r.vercel ?? null, ...(logout.r.error ? { error: redact(logout.r.error) } : {}) }
    if (logout.r.status !== 200) fail(`logout returned ${f9StatusText(logout.r)}, expected 200`)
    if (!logout.r.error && logout.r.type !== 'opaqueredirect' && !logout.r.vercel) fail('logout response has no Vercel origin signature (x-vercel-id absent, server not Vercel); --base may not be Vercel')

    const s2 = await f9PageFetch(page, { pathname: '/api/admin/session' })
    steps.sessionAfterLogout = { status: s2.status ?? null, isAdmin: s2.json?.isAdmin, ...(s2.error ? { error: redact(s2.error) } : {}) }
    if (!(s2.status === 200 && s2.json?.isAdmin === false)) fail('session after logout did not report isAdmin:false (Chromium is still logged in, or the session call failed)')

    // Judged by what each cookie puts on the wire (review round 1 of this change): an
    // empty-named `=growmax-admin=<sealed, %-escaped>` at a narrow Path is stored as name ''
    // and never reaches /api/admin/session, yet every request under its Path arrives as
    // growmax-admin=<sealed> once Next decodes the value.
    const cookiesAfterLogout = await context.cookies()
    const sealedForms = f9SealedForms(sealedValues)
    const leftovers = cookiesAfterLogout
      .map((c) => ({ c, reason: f9LeftoverReason(c, sealedValues) }))
      .filter((x) => x.reason !== null)
    steps.jarAfterLogout = {
      judgedBy: 'wire pair (empty name sends the value alone; split at the first =, key trimmed of SP/HTAB; raw and percent-decoded forms)',
      cookies: cookiesAfterLogout.map((c) => f9CookieSummary(c, sealedForms)),
      leftoverCount: leftovers.length,
      leftovers: leftovers.map(({ c, reason }) => ({ ...f9CookieSummary(c, sealedForms), reason })),
    }
    if (leftovers.length > 0) fail(`after logout Chromium's jar still holds ${leftovers.length} cookie(s) carrying a session value`)

    // Diagnostics only: the parser's verdict on the Set-Cookie lines Chromium received.
    let loginAttrs = null
    const loginAdminLines = (login.setCookieLines || []).filter((l) => parseCookieAttrs(l).name === ADMIN_COOKIE_NAME)
    if (loginAdminLines.length === 1) {
      const attrs = parseCookieAttrs(loginAdminLines[0])
      loginAttrs = { ...attrs, effectivePath: effectiveCookiePath(attrs, loginUrl) }
    }
    const diag = logout.setCookieLines
      ? diagnoseLogoutSetCookies({ loginAttrs, setCookieEntries: logout.setCookieLines, logoutUrl, loginUrl })
      : null
    const browserLoggedOut = detail.failures.length === 0
    detail.parserDiagnostics = {
      decidesF9: false,
      verdictClearsAdminCookie: diag ? diag.clearsAdminCookie : null,
      agreesWithChromium: diag ? diag.clearsAdminCookie === browserLoggedOut : null,
      ...(diag
        ? {
            adminEntryCount: diag.adminEntries.length,
            clearsValue: diag.clearsValue,
            loginEffectivePath: diag.loginEffectivePath,
            logoutEffectivePath: diag.logoutEffectivePath,
            pathMatches: diag.pathMatches,
            domainMatches: diag.domainMatches,
            partitionedMatches: diag.partitionedMatches,
            acceptedByBrowserRules: diag.acceptedByBrowserRules,
            browserRejectionReasons: diag.browserRejectionReasons,
          }
        : { error: 'the Set-Cookie lines of the logout response were not available from Chromium' }),
      loginSetCookie: f9SetCookieAttributeSummary(login.setCookieLines, sealedValues),
      logoutSetCookie: f9SetCookieAttributeSummary(logout.setCookieLines, sealedValues),
    }
    return { name, pass: browserLoggedOut, detail }
  } catch (err) {
    return { name, pass: false, detail: { ...detail, error: `F9 browser run failed: ${redact(err.message || err).split('\n')[0]}` } }
  } finally {
    if (session) await session.close().catch(() => {})
  }
}

async function runTests({ base, mode, runLabel, bypassSecret, allowDemoTest, targetDatabaseUrl, dbHelper, demoTestsSent }) {
  const A = new Assertions({ base, bypassSecret, targetDatabaseUrl, dbHelper })
  const results = []
  const email = `vercel-migration-test+${runLabel}@growmax.io`
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) throw new Error('ADMIN_PASSWORD env var is required for the functional suite')

  // Per review (blocking): the only existing guard against writing to the source is the
  // `--mode pre` hostname check in main() below, which only fires for the two literal
  // production hostnames. Nothing checked that `--base` actually resolves to Vercel before
  // F1/F2/F7/F8 write and delete rows — if the container's resolver/DoH cache still answers
  // it with Replit's IP (up to the 300s TTL after cutover), those tests would write to and
  // read back from the wrong database while looking like they passed. Send one real GET
  // first and require a Vercel origin signature on it before any test — write or not — runs;
  // Assertions.request() then re-checks the signature on every write response too, as
  // defense against the origin flipping mid-run.
  {
    const headers = bypassSecret ? { 'x-vercel-protection-bypass': bypassSecret } : {}
    let preflightRes
    try {
      preflightRes = await fetch(A.url('/'), { headers, redirect: 'manual' })
    } catch (err) {
      return [
        {
          name: 'harness-vercel-origin-check',
          pass: false,
          harness: true,
          detail: { error: `preflight GET ${A.url('/')} failed: ${String(err.message || err)}` },
        },
      ]
    }
    if (!Assertions.isVercelResponse(preflightRes)) {
      return [
        {
          name: 'harness-vercel-origin-check',
          pass: false,
          harness: true,
          detail: {
            error:
              `Preflight GET ${A.url('/')} has no Vercel origin signature (x-vercel-id absent, ` +
              `server=${JSON.stringify(preflightRes.headers.get('server'))}). Refusing to run write ` +
              'tests: --base may still resolve to Replit or another origin.',
          },
        },
      ]
    }
  }

  const rec = (name, pass, detail) => results.push({ name, pass, detail })

  // F1: newsletter signup + cleanup.
  try {
    const { res, body } = await A.requestJson('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
    let rowExists = false
    let cleaned = false
    if (res.status === 201) {
      const rows = await A.findRow('newsletter_subscriptions', 'email = $1', [email])
      rowExists = rows.length > 0
      if (rowExists) {
        await A.deleteRow('newsletter_subscriptions', 'email = $1', [email])
        const after = await A.findRow('newsletter_subscriptions', 'email = $1', [email])
        cleaned = after.length === 0
      }
    }
    rec('F1-newsletter-signup', res.status === 201 && rowExists && cleaned, { status: res.status, rowExists, cleaned })
  } catch (err) {
    rec('F1-newsletter-signup', false, { error: String(err.message || err) })
  }

  // F2: demo request (guarded, at most 3 per migration, caller-supplied counter). A real send
  // fires a real Google Chat message, so this must never fire twice for the same run: a marker
  // file (docs/migration/.scratch/demo-tests/<runLabel>.sent) is checked BEFORE sending, and a
  // 'pending' marker is written BEFORE the POST too (not just after) — recording countBefore,
  // the effective count resolveDemoTestsSentCount() reported right now — so a process killed
  // mid-request still leaves a marker, and so a LATER run under a different runLabel can never
  // undercount off a stale STATE.json alone (see resolveDemoTestsSentCount's docstring for the
  // exact staleness scenario this closes). The marker is updated to 'sent' once the POST
  // resolves, whatever its outcome: even a non-2xx or a parse failure means the request already
  // reached the server and may have dispatched the webhook, so a re-run for this exact runLabel
  // must still refuse.
  if (allowDemoTest) {
    const { refusal, countBefore } = await reserveDemoTestSend(runLabel, base, demoTestsSent)
    if (refusal) {
      rec('F2-demo-request', false, { skipped: true, reason: refusal })
    } else {
      try {
        const payload = {
          firstName: 'MIGRATION',
          lastName: 'TEST',
          email,
          company: 'Growmax — automated Vercel migration test, please ignore',
          companySize: '1-10',
          modules: ['Migration test'],
          message: 'Automated post-migration verification. Please ignore.',
        }
        let res
        try {
          ;({ res } = await A.requestJson('/api/demo-requests', { method: 'POST', body: JSON.stringify(payload) }))
        } finally {
          // Written even if the request above throws after the POST reached the server (e.g. a
          // body-parse failure): the real send already happened server-side by that point.
          await writeDemoTestMarker(runLabel, base, { countBefore, status: 'sent' })
        }
        let rowExists = false
        if (res.status === 201) {
          const rows = await A.findRow('demo_requests', 'email = $1', [email])
          rowExists = rows.length > 0
        }
        // SPEC-04 §6: F2's pass criteria includes a `[webhook] delivered 200` runtime log
        // within 90s, which this script cannot itself observe (it isn't a caller of
        // mcp__Vercel__get_runtime_logs). Recording this as pass:true on the API+DB checks
        // alone would let a missing/misconfigured webhook env var on Vercel (the Google Chat
        // webhook moves to an env var under SPEC-02) silently pass functional evidence while
        // demo-request notifications are actually being lost. So: pass:null ("pending",
        // neither pass nor fail) when the API+DB half succeeded, and the caller MUST attach
        // the runtime-log check (mcp__Vercel__get_runtime_logs query "[webhook]" within 90s)
        // before this suite's overall status can be treated as anything but incomplete.
        const apiAndDbOk = res.status === 201 && rowExists
        rec('F2-demo-request', apiAndDbOk ? null : false, {
          status: res.status,
          rowExists,
          ...(apiAndDbOk ? { pendingWebhook: true } : {}),
          webhookCheck: 'pending-external: mcp__Vercel__get_runtime_logs query "[webhook]" within 90s; not yet attached',
        })
        if (rowExists) await A.deleteRow('demo_requests', 'email = $1', [email])
      } catch (err) {
        rec('F2-demo-request', false, { error: String(err.message || err) })
      }
    }
  } else {
    rec('F2-demo-request', true, { skipped: true, reason: '--allow-demo-test not set' })
  }

  // F3: wrong admin password.
  try {
    const { res } = await A.requestJson('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: 'definitely-wrong' }) })
    rec('F3-admin-wrong-password', res.status === 401, { status: res.status })
  } catch (err) {
    rec('F3-admin-wrong-password', false, { error: String(err.message || err) })
  }

  // F4: correct admin password.
  try {
    const { res } = await A.requestJson('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: adminPassword }) })
    const setCookie = A.captureSetCookie(res)
    // Per review round 2 (non-blocking, but F9 now depends on it): the attribute regexes run
    // over the ONE exact-name growmax-admin entry, never Node's comma-joined header string (in
    // which e.g. `xgrowmax-admin=` would satisfy /growmax-admin=/, or another cookie's
    // attributes could satisfy the rest).
    const { cookieOk, loginRejectionReasons } = checkLoginCookieEntry(Assertions.adminCookieEntry(res))
    rec('F4-admin-correct-password', res.status === 200 && cookieOk, {
      status: res.status,
      setCookie: setCookie ? '<present>' : null,
      cookieOk,
      loginRejectionReasons,
    })
  } catch (err) {
    rec('F4-admin-correct-password', false, { error: String(err.message || err) })
  }

  // F5: session reflects isAdmin true.
  try {
    const { res, body } = await A.requestJson('/api/admin/session')
    rec('F5-admin-session-true', res.status === 200 && body?.isAdmin === true, { status: res.status, body })
  } catch (err) {
    rec('F5-admin-session-true', false, { error: String(err.message || err) })
  }

  // F6: admin posts count matches blog_posts count. A failed DB lookup must fail this check,
  // not pass it — the whole point is cross-checking the API against the DB.
  let createdDraftId = null
  const draftSlug = `vercel-migration-test-${runLabel}`
  try {
    const { res, body } = await A.requestJson('/api/admin/posts')
    let dbCount = null
    try {
      const rows = await A.findRow('blog_posts', '1 = 1', [])
      dbCount = rows.length
    } catch {
      dbCount = null
    }
    const pass = res.status === 200 && Array.isArray(body) && dbCount !== null && body.length === dbCount
    rec('F6-admin-posts-count', pass, { status: res.status, returned: Array.isArray(body) ? body.length : null, dbCount })
  } catch (err) {
    rec('F6-admin-posts-count', false, { error: String(err.message || err) })
  }

  // F7: create a draft (published:false); GET /api/blog/<slug> -> 404 (public route reads only published).
  try {
    const { res, body } = await A.requestJson('/api/admin/posts', {
      method: 'POST',
      body: JSON.stringify({
        slug: draftSlug,
        title: `Migration test draft ${runLabel}`,
        excerpt: 'Automated migration verification draft.',
        content: 'Automated migration verification draft.',
        published: false,
        category: 'Migration Test',
        author: 'Migration Bot',
      }),
    })
    createdDraftId = body?.id ?? null
    const draftRes = await A.request(`/api/blog/${draftSlug}`)
    rec('F7-create-draft-not-public', res.status === 201 && draftRes.status === 404, {
      createStatus: res.status,
      publicGetStatus: draftRes.status,
    })
  } catch (err) {
    rec('F7-create-draft-not-public', false, { error: String(err.message || err) })
  }

  // F8: update the draft's title, then delete it; confirm no residue. Cleanup-by-slug always
  // runs in `finally`, even if the PUT/DELETE assertions above throw, so a failed run never
  // leaves the draft row behind. Per review: the old code threw ("F7 did not produce a draft
  // id") BEFORE entering the try/finally when F7's response had no `.id` — which is exactly
  // the case (F7 created a row but the response body didn't carry its id) where the row is
  // still there and cleanup is needed most. The id-null check now lives INSIDE the
  // try/finally, so the slug-based cleanup always runs regardless of why PUT/DELETE by id
  // couldn't happen.
  try {
    let putStatus = null
    let delStatus = null
    try {
      if (createdDraftId == null) throw new Error('F7 did not produce a draft id; skipping PUT/DELETE by id')
      const { res: putRes } = await A.requestJson(`/api/admin/posts/${createdDraftId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: `Migration test draft ${runLabel} (updated)` }),
      })
      putStatus = putRes.status
      const { res: delRes } = await A.requestJson(`/api/admin/posts/${createdDraftId}`, { method: 'DELETE' })
      delStatus = delRes.status
    } finally {
      await A.deleteRow('blog_posts', 'slug = $1', [draftSlug]).catch(() => {})
    }
    const rows = await A.findRow('blog_posts', 'slug = $1', [draftSlug])
    rec('F8-update-then-delete-draft', putStatus === 200 && delStatus === 200 && rows.length === 0, {
      putStatus,
      deleteStatus: delStatus,
      residue: rows.length,
    })
  } catch (err) {
    rec('F8-update-then-delete-draft', false, { error: String(err.message || err) })
  }

  // F9: logout, then session -> isAdmin false, decided by a real Chromium context (P6.1): see
  // checkLogoutInBrowser above (unit-tested against local mocks in
  // functional/selftest-f9-browser.mjs). The parser's verdict is in its detail as diagnostics.
  results.push(await checkLogoutInBrowser({ base, bypassSecret, adminPassword }))

  // F10: unauthenticated admin API calls all return 401. Uses an id that cannot be a real
  // row (INT4_MAX) rather than post id 1: if the auth check under test were ever broken,
  // sending a real, unauthenticated PUT/DELETE would overwrite or delete a real post —
  // and post-cutover Neon is authoritative, so that damage cannot be undone by re-seeding.
  const UNAUTH_PROBE_ID = 2147483647
  try {
    A.cookie = null // ensure logged out for this check regardless of F9's outcome
    const [g, p, put, del] = await Promise.all([
      A.request('/api/admin/posts', { method: 'GET' }),
      A.request('/api/admin/posts', { method: 'POST', body: JSON.stringify({}), headers: { 'content-type': 'application/json' } }),
      A.request(`/api/admin/posts/${UNAUTH_PROBE_ID}`, { method: 'PUT', body: JSON.stringify({}), headers: { 'content-type': 'application/json' } }),
      A.request(`/api/admin/posts/${UNAUTH_PROBE_ID}`, { method: 'DELETE' }),
    ])
    const statuses = [g.status, p.status, put.status, del.status]
    rec('F10-unauthenticated-401', statuses.every((s) => s === 401), { statuses })
  } catch (err) {
    rec('F10-unauthenticated-401', false, { error: String(err.message || err) })
  }

  // F11: blog-redirects lookup for a known old_path.
  try {
    let oldPath = null
    let expectedNewSlug = null
    if (dbHelper?.query) {
      const { rows } = await dbHelper.query('SELECT old_path, new_path FROM blog_redirects LIMIT 1')
      oldPath = rows[0]?.old_path
      expectedNewSlug = rows[0]?.new_path
    } else if (targetDatabaseUrl) {
      const rows = await directNeonQuery(targetDatabaseUrl, 'SELECT old_path, new_path FROM blog_redirects LIMIT 1')
      oldPath = rows[0]?.old_path
      expectedNewSlug = rows[0]?.new_path
    }
    if (!oldPath) {
      // Per review: an empty blog_redirects table on the target is a real migration defect
      // (SPEC-04 §2.3's DB-redirect source is 95 URLs), not something F11 should pass on.
      rec('F11-blog-redirects-lookup', false, { reason: 'no blog_redirects row available to test against — target table is empty or unreachable' })
    } else {
      const { res, body } = await A.requestJson(`/api/blog-redirects?slug=${encodeURIComponent(oldPath)}`)
      rec('F11-blog-redirects-lookup', res.status === 200 && body?.newSlug === expectedNewSlug, {
        status: res.status,
        body,
        expectedNewSlug,
      })
    }
  } catch (err) {
    rec('F11-blog-redirects-lookup', false, { error: String(err.message || err) })
  }

  return results
}

/**
 * A1 C10: fetch `targetPath` twice and assert the SECOND response carries
 * `x-vercel-cache: HIT` — proof that H4 is actually caching on Vercel, not just configured
 * to (a misconfigured/absent cache would otherwise silently drop /api/blog's availability
 * benefit). Never sends the bypass cookie-setting header, matching the rest of this harness.
 */
const CACHE_HIT_FETCH_TIMEOUT_MS = 20000

/** A fetch with a hard timeout (per review): without one, a hung connection would leave
 *  checkCacheHit — and the whole functional suite — stuck indefinitely instead of failing.
 *  Per review (round 3): the timeout must cover the BODY read too, not just headers — a
 *  response whose headers arrive promptly but whose body streams forever (or never
 *  completes) would otherwise still hang past the intended deadline. Returns `{res, body}`;
 *  `body` is null if the body read itself fails (e.g. aborted), same as the old
 *  `.arrayBuffer().catch(() => null)` pattern this replaces. */
async function fetchWithTimeout(target, init, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(target, { ...init, signal: controller.signal })
    const body = await res.arrayBuffer().catch(() => null)
    return { res, body }
  } finally {
    clearTimeout(timer)
  }
}

async function checkCacheHit(base, bypassSecret, targetPath) {
  const headers = bypassSecret ? { 'x-vercel-protection-bypass': bypassSecret } : {}
  const target = new URL(targetPath, base).toString()
  try {
    const { res: first } = await fetchWithTimeout(target, { headers, redirect: 'manual' }, CACHE_HIT_FETCH_TIMEOUT_MS)
    const { res: second, body: secondBody } = await fetchWithTimeout(target, { headers, redirect: 'manual' }, CACHE_HIT_FETCH_TIMEOUT_MS)
    const secondCacheHeader = second.headers.get('x-vercel-cache')
    const secondBodyBytes = secondBody ? secondBody.byteLength : 0
    // Per review: a HIT header alone doesn't prove H4 is actually serving usable content — a
    // cached error page or an empty body would still carry x-vercel-cache: HIT. Require the
    // second response to also be status 200 with a non-empty body.
    return {
      pass: secondCacheHeader === 'HIT' && second.status === 200 && secondBodyBytes > 0,
      detail: {
        path: targetPath,
        firstStatus: first.status,
        secondStatus: second.status,
        firstCacheHeader: first.headers.get('x-vercel-cache'),
        secondCacheHeader,
        secondBodyBytes,
      },
    }
  } catch (err) {
    // A timed-out or otherwise failed fetch is a real failure (e.g. a hung connection),
    // never a silent pass — reported the same way every other check here reports an error.
    return { pass: false, detail: { path: targetPath, error: String(err.message || err) } }
  }
}

/** docs/migration/STATE.json's flags.demoTestsSent is the orchestrator's running count of
 *  real demo-request sends across the whole migration (F2 is capped at 3 total, see
 *  runTests). This script never writes STATE.json (that's the orchestrator's alone, see
 *  CLAUDE.md) — it only reads the counter so a caller who forgets --demo-tests-sent doesn't
 *  silently get treated as "0 sent so far", which would let F2 exceed the real cap. */
async function readDemoTestsSentFromState() {
  try {
    const statePath = path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'STATE.json')
    const state = JSON.parse(await readFile(statePath, 'utf8'))
    const val = state?.flags?.demoTestsSent
    if (Number.isInteger(val) && val >= 0) return val
    console.warn('WARNING: docs/migration/STATE.json has no non-negative integer flags.demoTestsSent; F2 will refuse to send (fail closed)')
  } catch (err) {
    console.warn(`WARNING: could not read docs/migration/STATE.json flags.demoTestsSent (${err.message}); F2 will refuse to send (fail closed)`)
  }
  // Per review round 2: unknown is NOT 0 — resolveDemoTestsSentCount turns null into the cap.
  return null
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.base || !args.mode || !args['run-label']) {
    console.error(
      'Usage: node run.mjs --base <origin> --mode pre|post --run-label <id> --target-database-url-env NAME ' +
        '[--bypass-secret-file <f>] [--allow-demo-test] ' +
        '[--demo-tests-sent N (default: docs/migration/STATE.json flags.demoTestsSent)] [--out <file>]',
    )
    process.exit(2)
  }

  // Harness env hygiene (P5.2 finding): `vercel env pull` writes ADMIN_PASSWORD,
  // SESSION_SECRET and GOOGLE_CHAT_WEBHOOK_URL to docs/migration/.scratch/.env.production as
  // the literal string "[SENSITIVE]" (Vercel's own redaction), never the real value. Sourcing
  // that file wholesale (e.g. `node --env-file=...`) would silently clobber the real container
  // env vars with that placeholder. Fail fast and loudly rather than let F3/F4/F9 run against
  // (and "pass" or "fail" meaninglessly on) a password/secret that was never real.
  for (const name of ['ADMIN_PASSWORD', 'SESSION_SECRET']) {
    if (process.env[name] === '[SENSITIVE]') {
      console.error(
        `FAIL: ${name} is the literal placeholder "[SENSITIVE]" (vercel env pull's redacted ` +
          'output for a sensitive var), not the real value. Refusing to run: pass the real ' +
          'secret via the container env (or stdin/env to whatever loads it), never by sourcing ' +
          'docs/migration/.scratch/.env.production wholesale.',
      )
      process.exit(2)
    }
  }

  // Per review round 2 (non-blocking): DEMO_TEST_MARKER_DIR_OVERRIDE exists only for
  // selftest-p5.3.mjs. In a real run that may send F2 it would silently move the cap's markers
  // away from docs/migration/.scratch/demo-tests, so refuse; otherwise just say it loudly.
  if (process.env.DEMO_TEST_MARKER_DIR_OVERRIDE) {
    if (args['allow-demo-test']) {
      console.error(
        'FAIL: DEMO_TEST_MARKER_DIR_OVERRIDE is set (a self-test-only variable) together with --allow-demo-test. ' +
          'Refusing: the F2 cap markers must live in docs/migration/.scratch/demo-tests. Unset it.',
      )
      process.exit(2)
    }
    console.warn(`WARNING: DEMO_TEST_MARKER_DIR_OVERRIDE is set (self-test only); demo-test markers read from ${DEMO_TEST_MARKER_DIR}`)
  }

  // Per review round 2 (non-blocking): a --demo-tests-sent that is not a plain non-negative
  // integer (e.g. `two`, which Number() made NaN, and NaN >= 3 is false) is rejected outright.
  let demoTestsSentArg
  if (args['demo-tests-sent'] !== undefined) {
    const raw = String(args['demo-tests-sent']).trim()
    if (!/^\d+$/.test(raw)) {
      console.error(`FAIL: --demo-tests-sent must be a non-negative integer, got ${JSON.stringify(args['demo-tests-sent'])}.`)
      process.exit(2)
    }
    demoTestsSentArg = Number(raw)
  }

  // No default target env: a caller must say explicitly which env var holds the target
  // (Neon) connection string. A silent DATABASE_URL default makes it too easy to run write
  // tests against whatever happens to be set, including the source.
  if (!args['target-database-url-env']) {
    console.error(
      'FAIL: --target-database-url-env is required (e.g. DST_URL). There is no default — ' +
        'F1/F2/F7/F8 write and delete rows, and a silent default risks writing to the wrong database.',
    )
    process.exit(2)
  }
  const targetDbEnv = args['target-database-url-env']
  if (targetDbEnv === 'REPLIT_DATABASE_URL' || targetDbEnv === 'SRC_URL') {
    console.error(
      `FAIL: --target-database-url-env must not be ${targetDbEnv}. The source database is read-only ` +
        'for automation (SET default_transaction_read_only = on); the functional suite writes and ' +
        'deletes rows and must never target it.',
    )
    process.exit(2)
  }

  // Refuse write tests against the still-Replit production site pre-cutover, before touching
  // any DB connection: the natural way to make a `--mode pre` run "pass" against
  // www.growmax.io is to point --target-database-url-env at the source, which SPEC-03 §0.1
  // forbids, and F1/F7 would leave rows in production that this suite may not delete from a
  // Replit-hosted site.
  if (args.mode === 'pre') {
    let baseHost = null
    try {
      baseHost = new URL(args.base).hostname.toLowerCase()
    } catch {
      // fall through; an unparseable --base fails elsewhere
    }
    if (baseHost && PRODUCTION_REPLIT_HOSTS.has(baseHost)) {
      console.error(
        `FAIL: refusing --mode pre against ${baseHost} while it is still Replit production. ` +
          'F1/F2/F7/F8 write real rows there and this suite may not delete from production. ' +
          'Target the Vercel preview/deployment instead.',
      )
      process.exit(2)
    }
  }

  const bypassSecret = args['bypass-secret-file'] ? (await readFile(args['bypass-secret-file'], 'utf8')).trim() : undefined
  const dbHelper = await loadDbHelper(targetDbEnv)
  const targetDatabaseUrl = process.env[targetDbEnv] || null

  if (targetDatabaseUrl && process.env.REPLIT_DATABASE_URL) {
    const targetHost = hostOfConnString(targetDatabaseUrl)
    const srcHost = hostOfConnString(process.env.REPLIT_DATABASE_URL)
    if (targetHost && srcHost && targetHost === srcHost) {
      console.error(
        `FAIL: ${targetDbEnv} resolves to the same host as REPLIT_DATABASE_URL. Refusing to run ` +
          'write tests against the source database.',
      )
      process.exit(2)
    }
  }

  // Per review (blocking, round 1): the cap against 3 must use the HIGHEST of the caller-
  // supplied/STATE counter, the number of .sent marker files on disk, and each marker's own
  // countBefore+1 — the STATE counter can be stale (a re-run before the orchestrator updates
  // it), the marker count alone says nothing about sends from before this fix existed, and
  // markerCount+STATE together can still undercount a run under a NEW runLabel before STATE
  // catches up (see resolveDemoTestsSentCount's docstring). See runTests's F2 for the per-
  // runLabel refusal this pairs with. (--demo-tests-sent itself was validated at the top of
  // main, before any DB/network step; an unreadable STATE counter is null, i.e. the cap.)
  const demoTestsSentFromState = demoTestsSentArg !== undefined ? demoTestsSentArg : await readDemoTestsSentFromState()
  const demoTestMarkers = await readDemoTestMarkers()
  const demoTestsSent = resolveDemoTestsSentCount(demoTestsSentFromState, demoTestMarkers)

  const results = await runTests({
    base: args.base,
    mode: args.mode,
    runLabel: args['run-label'],
    bypassSecret,
    allowDemoTest: !!args['allow-demo-test'],
    targetDatabaseUrl,
    dbHelper,
    demoTestsSent,
  })

  if (dbHelper?.end) await dbHelper.end().catch(() => {})

  // A1 C10 (opt-in, used at P6.2): prove H4's /api/blog caching is actually delivering a
  // HIT on the second request, not just configured. Runs after the DB helper closes since
  // it needs no DB access; added to `results` so a miss counts as a normal test failure.
  if (typeof args['expect-cache-hit'] === 'string' && args['expect-cache-hit'].length > 0) {
    const cachePath = args['expect-cache-hit']
    const cacheCheck = await checkCacheHit(args.base, bypassSecret, cachePath)
    results.push({ name: `cache-hit-${cachePath}`, pass: cacheCheck.pass, detail: cacheCheck.detail })
  }

  // pass: false is a real failure; pass: null is deferred (F2, pending the runtime-log
  // webhook check — see runTests). Neither may be silently folded into "pass": a run with a
  // pending check is 'incomplete', not 'pass', until the caller attaches that evidence.
  const failed = results.filter((r) => r.pass === false).map((r) => r.name)
  const pending = results.filter((r) => r.pass === null).map((r) => r.name)
  const status = failed.length > 0 ? 'fail' : pending.length > 0 ? 'incomplete' : 'pass'
  const evidence = {
    step: args.mode === 'pre' ? 'pre' : args.mode,
    kind: 'functional',
    base: args.base,
    runLabel: args['run-label'],
    results,
    failed,
    pending,
    status,
  }

  const out = args.out || path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'evidence', `${args.mode}-functional.json`)
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, JSON.stringify(evidence, null, 2))
  console.log(`Functional suite: ${evidence.status} (${failed.length} failed, ${pending.length} pending) -> ${out}`)
  for (const r of results) console.log(`  ${r.pass === null ? 'PENDING' : r.pass ? 'PASS' : 'FAIL'}  ${r.name}`)
  // Exit 0 only on a genuine pass. 'incomplete' (a pending check, e.g. F2's webhook log) is
  // not success and must not look like one to a caller checking the exit code.
  process.exit(evidence.status === 'pass' ? 0 : 1)
}

// Per review (P5.3): this file exports Assertions/checkLogout/the demo-test marker helpers so
// selftest-p5.3.mjs can unit-test them directly against a local mock server — which means this
// file can now be `import`ed as a library, not just run as a CLI. Every sibling harness script
// (urls.mjs, capture.mjs, compare.mjs, selftest.mjs) already guards its own `main()` this way;
// this one previously called `main()` unconditionally at module scope, so merely importing it
// would immediately parse argv, fail its own arg checks, and process.exit(2) — killing whatever
// process imported it. Behavior when run directly (`node run.mjs ...`) is unchanged.
// Per review round 2 (non-blocking): compare real file URLs, not a hand-built `file://` string,
// so a path with a space (URL-encoded in import.meta.url) or reached through a symlink still
// runs main() instead of silently exiting 0 with no evidence file.
function isMainModule() {
  try {
    return !!process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
  } catch {
    return false
  }
}

if (isMainModule()) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
