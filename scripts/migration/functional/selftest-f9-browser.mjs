#!/usr/bin/env node
// P6.1 self-test for F9 decided by a real browser (functional/run.mjs checkLogoutInBrowser).
//
// Everything runs against LOCAL https mocks on 127.0.0.1 (a throwaway self-signed certificate
// made with openssl under os.tmpdir(), so Secure cookies behave as on a real https origin; the
// browser context gets ignoreHTTPSErrors for it). Never a real endpoint, never F2.
//
// The mock stands in for the app: POST /api/admin/login checks the password and sets an
// iron-session-like sealed cookie (as Next serializes it); GET /api/admin/session reports
// isAdmin:true whenever the request's Cookie header still carries growmax-admin=<sealed>
// (iron-session is stateless), read the way Next reads it (parseCookie: split on /; */, first
// '=', value percent-decoded, last duplicate wins) OR leniently (any pair, raw or decoded), so
// the mock errs toward admin; GET /api/admin/posts answers the same way (a second admin
// endpoint, the target of narrow-Path smuggling); POST /api/admin/logout returns whatever Set-Cookie lines the case
// under test gives it. Every broken logout the three P6.1 review rounds found must FAIL because
// Chromium itself stays logged in, and the correct clears must pass. Each case also asserts that
// no cookie value, password or bypass secret appears in the F9 result.
//
// Usage: node selftest-f9-browser.mjs [--out <evidence.json>] [--only <substring of a check name>]
// Exit code 0 only if every check passes.

import { createServer } from 'node:https'
import { writeFile, mkdir, rm, mkdtemp, readFile } from 'node:fs/promises'
import { realpathSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as runModule from './run.mjs'

const { ADMIN_COOKIE_NAME } = runModule
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RUN_MJS = path.join(__dirname, 'run.mjs')

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

// Per-run random test values (never real secrets). The sealed value has iron-session's shape.
const SEALED = `Fe26.2*1*${randomBytes(16).toString('hex')}*selftest~2`
// The sealed value with * written as %2A: a cookie value Next decodes back to SEALED.
const SEALED_PCT = SEALED.replace(/\*/g, '%2A')
const TEST_PASSWORD = `selftest-password-${randomBytes(8).toString('hex')}`
const TEST_BYPASS = `selftest-bypass-${randomBytes(12).toString('hex')}`
const n = ADMIN_COOKIE_NAME
const NBSP = ' '
const PAST = 'Thu, 01 Jan 1970 00:00:00 GMT'
const FUTURE = new Date(Date.now() + 86400000).toUTCString()
// What the real app's login sends: iron-session 8 via Next's ResponseCookies serializer.
const NEXT_LOGIN = `${n}=${SEALED}; Path=/; Expires=${FUTURE}; Max-Age=86400; Secure; HttpOnly; SameSite=lax`
// The real app's logout (iron-session destroy(): maxAge 0), and Next's Expires=1970 form.
const REAL_APP_LOGOUT = `${n}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
const NEXT_LOGOUT = `${n}=; Path=/; Expires=${PAST}; Max-Age=0; Secure; HttpOnly; SameSite=lax`

// Chromium goes through the container proxy exactly as a real run does (and gets the proxy-CA
// pin), but the local mocks must bypass it: Playwright proxies loopback unless it is listed.
const SELFTEST_PROXY = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' } : undefined

let TLS = null
async function makeCertificate() {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'f9-browser-selftest-'))
  const keyPath = path.join(dir, 'key.pem')
  const certPath = path.join(dir, 'cert.pem')
  await new Promise((resolve, reject) =>
    execFile(
      'openssl',
      ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', keyPath, '-out', certPath, '-days', '1', '-subj', '/CN=localhost',
        '-addext', 'subjectAltName=IP:127.0.0.1,DNS:localhost'],
      (err) => (err ? reject(err) : resolve()),
    ),
  )
  const tls = { key: await readFile(keyPath), cert: await readFile(certPath) }
  await rm(dir, { recursive: true, force: true })
  return tls
}

/** Next's parseCookie (@edge-runtime/cookies): split on '; ' (any spaces), first '=', value decoded with
 *  decodeURIComponent (a pair that fails to decode is skipped), a pair without '=' reads "true",
 *  the last duplicate wins. */
function nextParseCookie(header) {
  const map = new Map()
  for (const pair of String(header || '').split(/; */)) {
    if (!pair) continue
    const eq = pair.indexOf('=')
    if (eq === -1) {
      map.set(pair, 'true')
      continue
    }
    try {
      map.set(pair.slice(0, eq), decodeURIComponent(pair.slice(eq + 1)))
    } catch {}
  }
  return map
}

function safeDecode(v) {
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
}

/** Does the app see the admin session in this Cookie header? Next's reading, or any pair whose
 *  value (raw or decoded) is the sealed value under the admin name. */
function adminSeen(header) {
  if (nextParseCookie(header).get(n) === SEALED) return true
  return cookiePairs(header).some(([k, v]) => k === n && (v === SEALED || safeDecode(v) === SEALED))
}

function cookiePairs(header) {
  const out = []
  for (const part of String(header || '').split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    out.push([part.slice(0, eq).trim(), part.slice(eq + 1).trim()])
  }
  return out
}

/** A local https mock of the app's admin endpoints. `requests` records method, path and
 *  whether the bypass header was present (and equal to the test secret), never header values. */
async function startMockApp({ login = NEXT_LOGIN, logout = REAL_APP_LOGOUT, vercel = true, loginRedirect = null } = {}) {
  const requests = []
  const server = createServer(TLS, (req, res) => {
    const bypass = req.headers['x-vercel-protection-bypass']
    requests.push({ method: req.method, path: req.url, bypassPresent: bypass !== undefined, bypassMatches: bypass === TEST_BYPASS })
    const headers = { 'content-type': 'application/json', 'cache-control': 'no-store' }
    if (vercel) headers.server = 'Vercel'
    let body = ''
    req.on('data', (c) => {
      body += c
    })
    req.on('end', () => {
      if (req.method === 'POST' && req.url === '/api/admin/login') {
        if (loginRedirect) {
          res.writeHead(302, { ...headers, location: loginRedirect })
          res.end()
          return
        }
        let password = null
        try {
          password = JSON.parse(body).password
        } catch {
          password = null
        }
        if (password !== TEST_PASSWORD) {
          res.writeHead(401, headers)
          res.end(JSON.stringify({ error: 'Invalid password' }))
          return
        }
        if (login) headers['set-cookie'] = login
        res.writeHead(200, headers)
        res.end(JSON.stringify({ success: true }))
        return
      }
      if (req.method === 'POST' && req.url === '/api/admin/logout') {
        if (logout) headers['set-cookie'] = logout
        res.writeHead(200, headers)
        res.end(JSON.stringify({ success: true }))
        return
      }
      if (req.method === 'GET' && (req.url === '/api/admin/session' || req.url === '/api/admin/posts')) {
        const isAdmin = adminSeen(req.headers.cookie)
        requests[requests.length - 1].adminSeen = isAdmin
        res.writeHead(200, headers)
        res.end(JSON.stringify({ isAdmin }))
        return
      }
      res.writeHead(200, { ...headers, 'access-control-allow-origin': '*' })
      res.end('{}')
    })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return { server, requests, port: server.address().port, close: () =>
      new Promise((r) => {
        server.close(r)
        server.closeAllConnections()
      }) }
}

async function runF9(mockOpts, { bypassSecret, adminPassword = TEST_PASSWORD, executablePath } = {}) {
  const mock = await startMockApp(mockOpts)
  try {
    const base = `https://127.0.0.1:${mock.port}`
    const result = await runModule.checkLogoutInBrowser({
      base,
      bypassSecret,
      adminPassword,
      executablePath,
      proxy: SELFTEST_PROXY,
      ignoreHTTPSErrors: true,
    })
    return { result, requests: mock.requests }
  } finally {
    await mock.close()
  }
}

function leakProblems(label, result) {
  const s = JSON.stringify(result)
  const p = []
  if (s.includes(SEALED)) p.push(`${label}: the sealed cookie value leaked into the F9 result`)
  if (s.includes(SEALED_PCT)) p.push(`${label}: the %-escaped sealed cookie value leaked into the F9 result`)
  if (s.includes(TEST_PASSWORD)) p.push(`${label}: the password leaked into the F9 result`)
  if (s.includes(TEST_BYPASS)) p.push(`${label}: the bypass secret leaked into the F9 result`)
  if (s.includes('x'.repeat(64))) p.push(`${label}: a long cookie value leaked into the F9 result`)
  return p
}

/** Common expectations. A failing case must fail BECAUSE Chromium stayed logged in: login
 *  worked (session isAdmin:true), and afterwards the session still reads isAdmin:true or the
 *  jar still holds a session value. */
function expectF9(label, { result }, expectedPass) {
  const p = [...leakProblems(label, result)]
  const d = result.detail || {}
  if (result.pass !== expectedPass) p.push(`${label}: expected pass:${expectedPass}, got ${result.pass} (failures ${JSON.stringify(d.failures)}; error ${JSON.stringify(d.error)})`)
  if (d.decidedBy !== 'chromium') p.push(`${label}: expected decidedBy 'chromium', got ${JSON.stringify(d.decidedBy)}`)
  if (d.parserDiagnostics?.decidesF9 !== false) p.push(`${label}: expected parserDiagnostics.decidesF9 false`)
  if (d.steps?.sessionAfterLogin?.isAdmin !== true) p.push(`${label}: login did not make Chromium admin (the case would not test logout)`)
  if (d.steps?.logout?.status !== 200) p.push(`${label}: expected logout status 200, got ${d.steps?.logout?.status}`)
  if (!expectedPass) {
    const stillAdmin = d.steps?.sessionAfterLogout?.isAdmin === true
    const leftovers = d.steps?.jarAfterLogout?.leftoverCount > 0
    if (!stillAdmin && !leftovers) p.push(`${label}: failed, but not because Chromium stayed logged in (failures ${JSON.stringify(d.failures)})`)
  } else {
    if (d.steps?.sessionAfterLogout?.isAdmin !== false) p.push(`${label}: expected isAdmin:false after logout`)
    if (d.steps?.jarAfterLogout?.leftoverCount !== 0) p.push(`${label}: expected no leftover session cookie`)
  }
  return p
}

async function runCases(cases, extra) {
  const problems = []
  const results = {}
  for (const [label, mockOpts, expectedPass, opts] of cases) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9(mockOpts, opts)
    results[label] = outcome.result
    problems.push(...expectF9(label, outcome, expectedPass))
    if (extra) problems.push(...extra(label, outcome, expectedPass))
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

// --- correct clears pass ---

async function testCorrectClearPasses() {
  return runCases(
    [
      ['real app: growmax-admin=; Path=/; Max-Age=0', { logout: REAL_APP_LOGOUT }, true],
      ['Next-shaped: Expires=1970 and Max-Age=0', { logout: NEXT_LOGOUT }, true],
      ['Expires=1970 only', { logout: `${n}=; Path=/; Expires=${PAST}; HttpOnly; Secure; SameSite=Lax` }, true],
      ['real app, with a bypass secret', { logout: REAL_APP_LOGOUT }, true, { bypassSecret: TEST_BYPASS }],
      ['Next-shaped, with a bypass secret', { logout: NEXT_LOGOUT }, true, { bypassSecret: TEST_BYPASS }],
    ],
    (label, { result, requests }, _expected) => {
      const p = []
      const diag = result.detail?.parserDiagnostics
      if (diag?.verdictClearsAdminCookie !== true) p.push(`${label}: expected the parser diagnostics to read a clear`)
      const logoutLines = diag?.logoutSetCookie
      if (!Array.isArray(logoutLines) || logoutLines.length !== 1 || logoutLines[0].name !== n || logoutLines[0].path !== '/')
        p.push(`${label}: expected one logout Set-Cookie summary for ${n} with Path /, got ${JSON.stringify(logoutLines)}`)
      if (logoutLines?.[0] && !('maxAge' in logoutLines[0] && 'expires' in logoutLines[0] && 'sameSite' in logoutLines[0] && 'secure' in logoutLines[0] && 'partitioned' in logoutLines[0] && 'domain' in logoutLines[0]))
        p.push(`${label}: the logout Set-Cookie summary lacks an attribute field`)
      if (label.includes('bypass')) {
        if (requests.length < 4 || !requests.every((r) => r.bypassMatches)) p.push(`${label}: every base-origin request must carry the bypass header (${JSON.stringify(requests)})`)
      } else if (requests.some((r) => r.bypassPresent)) p.push(`${label}: a bypass header was sent without a bypass secret`)
      // The blank page is fulfilled by the route, never fetched from the network.
      if (requests.some((r) => r.path.startsWith(runModule.F9_BLANK_PATH))) p.push(`${label}: the F9 blank page reached the network`)
      return p
    },
  )
}

// --- broken logouts fail because Chromium stays logged in ---

async function testNeverClearedFails() {
  return runCases([
    ['no Set-Cookie on logout', { logout: null }, false],
    ['logout re-sets the sealed value', { logout: NEXT_LOGIN }, false],
  ])
}

async function testNbspFails() {
  return runCases([
    ['(a) NBSP after the name', { logout: `${n}${NBSP}=; Path=/; Max-Age=0` }, false],
    ['(b) NBSP after the Path key', { logout: `${n}=; Path${NBSP}=/; Max-Age=0` }, false],
    ['(c) NBSP before the Path value', { logout: `${n}=; Path=${NBSP}/; Max-Age=0` }, false],
    ['(d) Domain=NBSP', { logout: `${n}=; Path=/; Max-Age=0; Domain=${NBSP}` }, false],
  ])
}

async function testWrongPathFails() {
  return runCases([
    ['Path=/api/admin', { logout: `${n}=; Path=/api/admin; Max-Age=0; HttpOnly; Secure; SameSite=Lax` }, false],
    ['no Path (default-path /api/admin)', { logout: `${n}=; Max-Age=0; HttpOnly; Secure; SameSite=Lax` }, false],
    ['Path not starting with /', { logout: `${n}=; Path=api; Max-Age=0` }, false],
  ])
}

async function testWithoutSecureFails() {
  const PARTITIONED_LOGIN = `${NEXT_LOGIN}; Partitioned`
  return runCases([
    ['(e) SameSite=None without Secure', { logout: `${n}=; Path=/; Max-Age=0; SameSite=None` }, false],
    ['(e3) SameSite=None; Secure=<1025 chars>', { logout: `${n}=; Path=/; Max-Age=0; SameSite=None; Secure=${'x'.repeat(1025)}` }, false],
    ['(f) Partitioned login, Partitioned clear without Secure', { login: PARTITIONED_LOGIN, logout: `${n}=; Path=/; Max-Age=0; Partitioned` }, false],
    ['Partitioned clear without Secure, unpartitioned login', { logout: `${n}=; Path=/; Max-Age=0; Partitioned` }, false],
  ])
}

async function testOver4096Fails() {
  return runCases([
    ['(g) name+value 5013 bytes', { logout: `${n}=${'x'.repeat(5000)}; Path=/; Max-Age=0` }, false],
    ['(g2) name+value 4097 bytes', { logout: `${n}=${'x'.repeat(4097 - n.length)}; Path=/; Max-Age=0` }, false],
  ])
}

async function testDomainDotFails() {
  return runCases([
    ["'Domain=.'", { logout: `${n}=; Path=/; Max-Age=0; Domain=.` }, false],
    ["'Domain= . '", { logout: `${n}=; Path=/; Max-Age=0; Domain= . ` }, false],
    ["'Domain=; Domain=.'", { logout: `${n}=; Path=/; Max-Age=0; Domain=; Domain=.` }, false],
    ["real app plus 'Domain=.'", { logout: `${REAL_APP_LOGOUT}; Domain=.` }, false],
  ])
}

/** An empty-named cookie smuggles the sealed value back: Chrome stores `=growmax-admin=<sealed>`
 *  as a cookie with an empty name and sends it as `growmax-admin=<sealed>`. The exact-name
 *  clear next to it is a proper clear, so the parser (which ignores empty-named entries) reads a
 *  clear; Chromium stays admin and F9 must fail anyway: the parser does not decide. */
async function testEmptyNameSmugglingFails() {
  return runCases(
    [
      ['real-app clear plus =growmax-admin=<sealed>', { logout: [REAL_APP_LOGOUT, `=${n}=${SEALED}; Path=/; Secure; HttpOnly`] }, false],
      ['real-app clear plus " =growmax-admin=<sealed>"', { logout: [REAL_APP_LOGOUT, ` =${n}=${SEALED}; Path=/`] }, false],
      ['growmax-admin without = (empty-named cookie), login kept', { logout: `${n}; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` }, false],
    ],
    (label, { result }) => {
      const p = []
      if (label.startsWith('real-app clear plus') && result.detail?.parserDiagnostics?.verdictClearsAdminCookie !== true)
        p.push(`${label}: expected the parser to (wrongly) read a clear, showing Chromium decides`)
      if (label.startsWith('real-app clear plus') && result.detail?.parserDiagnostics?.agreesWithChromium !== false)
        p.push(`${label}: expected agreesWithChromium:false`)
      return p
    },
  )
}

/** Review round 1 of the browser F9 (blocking): the correct clear plus an empty-named
 *  `=growmax-admin=<sealed with * as %2A>; Path=/api/admin/posts`. Chromium stores name '' and
 *  sends it to /api/admin/posts only, as growmax-admin=Fe26.2%2A..., which Next decodes back to the
 *  sealed value; /api/admin/session never sees it. F9 must fail on the jar (judged by the wire
 *  pair). A live control shows each case really leaves /api/admin/posts admin in Chromium. */
async function probePostsAfterLogout(mockOpts) {
  const mock = await startMockApp(mockOpts)
  let session = null
  try {
    session = await runModule.openF9BrowserContext({ base: `https://127.0.0.1:${mock.port}`, proxy: SELFTEST_PROXY, ignoreHTTPSErrors: true })
    const login = await runModule.f9PageFetch(session.page, { method: 'POST', pathname: '/api/admin/login', jsonBody: JSON.stringify({ password: TEST_PASSWORD }) })
    const logout = await runModule.f9PageFetch(session.page, { method: 'POST', pathname: '/api/admin/logout' })
    const sessionAfter = await runModule.f9PageFetch(session.page, { pathname: '/api/admin/session' })
    const posts = await runModule.f9PageFetch(session.page, { pathname: '/api/admin/posts' })
    return { loginStatus: login.status, logoutStatus: logout.status, sessionIsAdmin: sessionAfter.json?.isAdmin, postsIsAdmin: posts.json?.isAdmin }
  } finally {
    if (session) await session.close().catch(() => {})
    await mock.close()
  }
}

async function testNarrowPathEncodedSmugglingFails() {
  const narrow = (v) => [REAL_APP_LOGOUT, `=${n}=${v}; Path=/api/admin/posts; Secure; HttpOnly`]
  const cases = [
    ['real-app clear plus =growmax-admin=<%2A-encoded sealed>; Path=/api/admin/posts', { logout: narrow(SEALED_PCT) }, false],
    ['real-app clear plus =growmax-admin=<a different non-empty value>; Path=/api/admin/posts', { logout: narrow(`Fe26.2*1*${randomBytes(16).toString('hex')}*fresh~2`) }, false],
    ['real-app clear plus =growmax-admin=<raw sealed>; Path=/api/admin/posts', { logout: narrow(SEALED) }, false],
    ['real-app clear plus growmax-admin=<%2A-encoded sealed>; Path=/api/admin/posts', { logout: [REAL_APP_LOGOUT, `${n}=${SEALED_PCT}; Path=/api/admin/posts; Secure; HttpOnly`] }, false],
    ['real-app clear plus =growmax-admin=<%2A-encoded sealed>; Path=/', { logout: [REAL_APP_LOGOUT, `=${n}=${SEALED_PCT}; Path=/; Secure; HttpOnly`] }, false],
  ]
  const out = await runCases(cases, (label, { result }) => {
    const p = []
    const lo = result.detail?.steps?.jarAfterLogout
    if (!(lo?.leftoverCount > 0)) p.push(`${label}: expected the jar check to find the smuggled cookie`)
    return p
  })
  // Live controls: without the fix F9 would pass these, while Chromium stays admin at posts.
  const controls = {}
  for (const [label, mockOpts] of cases.slice(0, 4)) {
    // eslint-disable-next-line no-await-in-loop
    const c = await probePostsAfterLogout(mockOpts)
    controls[label] = c
    const shouldBeAdmin = !label.includes('different non-empty value')
    if (c.loginStatus !== 200 || c.logoutStatus !== 200) out.detail.problems.push(`${label}: control login/logout not 200 (${JSON.stringify(c)})`)
    if (c.sessionIsAdmin !== false) out.detail.problems.push(`${label}: control expected /api/admin/session isAdmin:false (the escape bypasses it), got ${c.sessionIsAdmin}`)
    if (shouldBeAdmin && c.postsIsAdmin !== true) out.detail.problems.push(`${label}: control expected /api/admin/posts still admin in Chromium, got ${c.postsIsAdmin} (probe not live?)`)
  }
  // Correct clear control: posts is not admin either.
  const clean = await probePostsAfterLogout({ logout: REAL_APP_LOGOUT })
  controls['real-app clear alone'] = clean
  if (clean.sessionIsAdmin !== false || clean.postsIsAdmin !== false) out.detail.problems.push(`correct clear control: expected neither endpoint admin, got ${JSON.stringify(clean)}`)
  out.detail.controls = controls
  out.pass = out.detail.problems.length === 0
  return out
}

/** Unit test of the wire-pair jar judgement (run.mjs f9LeftoverReason). */
async function testLeftoverReasonUnit() {
  const problems = []
  const r = (c) => runModule.f9LeftoverReason(c, [SEALED])
  const expectLeft = [
    ['admin name, non-empty', { name: n, value: 'x' }],
    ['empty name, growmax-admin=<pct sealed>', { name: '', value: `${n}=${SEALED_PCT}` }],
    ['empty name, growmax-admin=<other>', { name: '', value: `${n}=other` }],
    ['empty name, " growmax-admin =<other>" (SP/HTAB trimmed key)', { name: '', value: ` ${n}\t=other` }],
    ['empty name, growmax-admin (no =, Next reads "true")', { name: '', value: n }],
    ['other name, value is pct sealed', { name: 'x', value: SEALED_PCT }],
    ['other name, value is double-encoded sealed', { name: 'x', value: encodeURIComponent(SEALED_PCT) }],
    ['name contains sealed', { name: `a${SEALED}`, value: '' }],
    ['pct-encoded key growmax%2Dadmin', { name: 'growmax%2Dadmin', value: 'x' }],
  ]
  const expectClean = [
    ['admin name, empty value', { name: n, value: '' }],
    ['empty name, growmax-admin= (empty)', { name: '', value: `${n}=` }],
    ['unrelated cookie', { name: 'theme', value: 'dark' }],
    ['undecodable value', { name: 'x', value: '%E0%A4%A' }],
  ]
  for (const [label, c] of expectLeft) if (r(c) === null) problems.push(`${label}: expected a leftover`)
  for (const [label, c] of expectClean) if (r(c) !== null) problems.push(`${label}: expected no leftover, got ${r(c)}`)
  return { pass: problems.length === 0, detail: { problems, leftCases: expectLeft.length, cleanCases: expectClean.length } }
}

async function testSealedValueWithBadExpiresFails() {
  return runCases(
    ['0', '2020', '-1'].map((e) => [
      `sealed value re-sent with Expires=${e}`,
      { logout: `${n}=${SEALED}; Path=/; Expires=${e}; HttpOnly; Secure; SameSite=Lax` },
      false,
    ]),
  )
}

/** Controls: variants a browser accepts still pass (SameSite=None with Secure, Partitioned with
 *  Secure on both sides, name+value exactly 4096 bytes), and two where the parser fails closed
 *  but Chromium really clears ('Domain=127.0.0.1; Domain=': the last, empty Domain makes it
 *  host-only in Chrome; 'SameSite=None; SameSite=Lax' without Secure: Chrome uses the last
 *  SameSite) pass too: the parser does not decide. */
async function testAcceptedVariantsPass() {
  const PARTITIONED_LOGIN = `${NEXT_LOGIN}; Partitioned`
  return runCases(
    [
      ['SameSite=None; Secure', { logout: `${n}=; Path=/; Max-Age=0; SameSite=None; Secure` }, true],
      ['Partitioned; Secure on both', { login: PARTITIONED_LOGIN, logout: `${n}=; Path=/; Max-Age=0; Secure; Partitioned` }, true],
      ['name+value exactly 4096 bytes', { logout: `${n}=${'x'.repeat(4096 - n.length)}; Path=/; Max-Age=0` }, true],
      ["parser fails closed, Chromium clears: 'Domain=127.0.0.1; Domain='", { logout: `${n}=; Path=/; Max-Age=0; Domain=127.0.0.1; Domain=` }, true],
      // Review round 1 (e2): the parser fails closed on any SameSite=None without Secure, but
      // Chromium uses the LAST SameSite (Lax), accepts the entry and clears the cookie.
      ['parser fails closed, Chromium clears: (e2) SameSite=None then SameSite=Lax, no Secure', { logout: `${n}=; Path=/; Max-Age=0; SameSite=None; SameSite=Lax` }, true],
    ],
    (label, { result }) => {
      const p = []
      if (label.startsWith('parser fails closed')) {
        if (result.detail?.parserDiagnostics?.verdictClearsAdminCookie !== false) p.push(`${label}: expected the parser verdict false`)
        if (result.detail?.parserDiagnostics?.agreesWithChromium !== false) p.push(`${label}: expected agreesWithChromium:false`)
      }
      return p
    },
  )
}

// --- bypass header reaches the base origin only ---

async function testBypassHeaderBaseOriginOnly() {
  const problems = []
  const detail = {}
  const app = await startMockApp()
  const other = await startMockApp()
  let session = null
  try {
    const base = `https://127.0.0.1:${app.port}`
    session = await runModule.openF9BrowserContext({ base, bypassSecret: TEST_BYPASS, proxy: SELFTEST_PROXY, ignoreHTTPSErrors: true })
    // F9's page (fulfilled by the route) has no loopback address space, so Chromium 141's Local
    // Network Access checks would hold its loopback requests to ANOTHER origin; a real run's
    // origins are public. Granting the permission lets this probe reach the second origin.
    await session.context.grantPermissions(['local-network-access'], { origin: session.baseOrigin })
    const otherOrigins = [`https://127.0.0.1:${other.port}`, `https://localhost:${other.port}`]
    const probe = await session.page.evaluate(
      async ({ otherOrigins }) => {
        const out = {}
        out.base = await fetch('/probe-base', { signal: AbortSignal.timeout(10000) }).then((r) => r.status, (e) => String(e))
        for (const o of otherOrigins) {
          out[`${o}/probe-fetch`] = await fetch(`${o}/probe-fetch`, { mode: 'no-cors', signal: AbortSignal.timeout(10000) }).then((r) => r.type, (e) => String(e))
          out[`${o}/probe-img`] = await new Promise((resolve) => {
            const img = new Image()
            img.onload = () => resolve('load')
            img.onerror = () => resolve('error')
            setTimeout(() => resolve('timeout'), 10000)
            img.src = `${o}/probe-img`
          })
        }
        return out
      },
      { otherOrigins },
    )
    detail.probe = probe
    detail.baseRequests = [...app.requests]
    detail.otherRequests = [...other.requests]
    const baseProbe = app.requests.filter((r) => r.path === '/probe-base')
    if (baseProbe.length !== 1 || !baseProbe[0].bypassMatches) problems.push('the base origin did not receive the bypass header')
    // Positive control: each second-origin probe arrived (so "no header" is not vacuous).
    for (const p of ['/probe-fetch', '/probe-img']) {
      const got = other.requests.filter((r) => r.path === p).length
      if (got !== otherOrigins.length) problems.push(`the second origin received ${got} ${p} requests, expected ${otherOrigins.length}`)
    }
    if (other.requests.some((r) => r.bypassPresent)) problems.push('a second origin received the bypass header')
  } catch (err) {
    problems.push(`probe failed: ${String(err.message || err)}`)
  } finally {
    if (session) await session.close().catch(() => {})
    await app.close()
    await other.close()
  }

  // Redirects: Playwright applies route.continue() header overrides to the redirects a routed
  // request follows, so a base-origin response redirecting to another origin WOULD carry the
  // header there if followed. F9's own fetch (f9PageFetch, redirect:'manual') never follows one.
  // The control (a plain redirect:'follow' fetch in the same context) shows the probe is live.
  const other2 = await startMockApp()
  const app2 = await startMockApp({ loginRedirect: `https://127.0.0.1:${other2.port}/elsewhere` })
  session = null
  try {
    const base = `https://127.0.0.1:${app2.port}`
    session = await runModule.openF9BrowserContext({ base, bypassSecret: TEST_BYPASS, proxy: SELFTEST_PROXY, ignoreHTTPSErrors: true })
    await session.context.grantPermissions(['local-network-access'], { origin: session.baseOrigin })
    const f9 = await runModule.f9PageFetch(session.page, { method: 'POST', pathname: '/api/admin/login', jsonBody: '{}' })
    const afterF9 = [...other2.requests]
    const control = await session.page.evaluate(() =>
      fetch('/api/admin/login', { method: 'POST', body: '{}', redirect: 'follow', mode: 'cors', signal: AbortSignal.timeout(10000) }).then((r) => r.status, (e) => String(e)),
    )
    detail.redirect = { f9PageFetch: { status: f9.status, type: f9.type }, otherRequestsAfterF9Fetch: afterF9, control, otherRequestsAfterControl: [...other2.requests] }
    if (f9.type !== 'opaqueredirect') problems.push(`expected F9's fetch to stop at the redirect (opaqueredirect), got ${JSON.stringify(f9)}`)
    if (afterF9.length !== 0) problems.push(`F9's fetch followed a redirect to another origin (${afterF9.length} requests)`)
    const controlReqs = other2.requests.slice(afterF9.length)
    if (!(controlReqs.length === 1 && controlReqs[0].bypassMatches))
      problems.push(`control: a followed redirect was expected to reach the other origin carrying the header (probe not live?): ${JSON.stringify(controlReqs)}`)
  } catch (err) {
    problems.push(`redirect probe failed: ${String(err.message || err)}`)
  } finally {
    if (session) await session.close().catch(() => {})
    await app2.close()
    await other2.close()
  }

  // And the whole F9 run against that redirecting login fails.
  const other3 = await startMockApp()
  try {
    const outcome = await runF9({ loginRedirect: `https://127.0.0.1:${other3.port}/elsewhere` }, { bypassSecret: TEST_BYPASS })
    detail.redirectF9 = { pass: outcome.result.pass, failures: outcome.result.detail?.failures, otherRequests: other3.requests }
    problems.push(...leakProblems('redirecting login', outcome.result))
    if (outcome.result.pass !== false) problems.push('a login that redirects to another origin must fail F9')
    if (other3.requests.length !== 0) problems.push(`F9 followed a redirect to another origin (${other3.requests.length} requests)`)
  } finally {
    await other3.close()
  }
  return { pass: problems.length === 0, detail: { problems, ...detail } }
}

// --- F9 fails, never falls back, when Chromium cannot run or the inputs are wrong ---

async function testLaunchFailureFails() {
  const outcome = await runF9({}, { executablePath: '/nonexistent/f9-selftest/chrome' })
  const { result, requests } = outcome
  const problems = [...leakProblems('launch failure', result)]
  if (result.pass !== false) problems.push('expected pass:false when Chromium cannot launch')
  if (!/Chromium could not launch/.test(result.detail?.error || '')) problems.push(`expected a clear launch error, got ${JSON.stringify(result.detail?.error)}`)
  if ('parserDiagnostics' in (result.detail || {})) problems.push('a launch failure must not produce a parser verdict (no fallback)')
  if (requests.length !== 0) problems.push(`expected no request to the app, got ${requests.length}`)
  return { pass: problems.length === 0, detail: { problems, result } }
}

async function testPasswordInputs() {
  const problems = []
  const results = {}
  for (const [label, adminPassword, expectRequests] of [
    ['"[SENSITIVE]" placeholder fails fast', '[SENSITIVE]', 0],
    ['missing password fails fast', '', 0],
    ['wrong password fails', 'definitely-wrong-password', null],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const { result, requests } = await runF9({}, { adminPassword })
    results[label] = result
    problems.push(...leakProblems(label, result))
    if (result.pass !== false) problems.push(`${label}: expected pass:false`)
    if (expectRequests === 0 && requests.length !== 0) problems.push(`${label}: expected no request before failing, got ${requests.length}`)
    if (expectRequests === null && result.detail?.steps?.login?.status !== 401) problems.push(`${label}: expected login 401`)
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

async function testNonVercelResponseFails() {
  const { result } = await runF9({ vercel: false })
  const problems = [...leakProblems('non-Vercel', result)]
  if (result.pass !== false) problems.push('expected pass:false without a Vercel origin signature')
  if (!(result.detail?.failures || []).some((f) => /Vercel origin signature/.test(f))) problems.push('expected a Vercel-origin failure')
  return { pass: problems.length === 0, detail: { problems, result } }
}

/** Static wiring: runTests decides F9 with checkLogoutInBrowser, never the parser's checkLogout,
 *  and run.mjs uses no all-requests header mechanism. */
async function testRunTestsWiring() {
  const src = await readFile(RUN_MJS, 'utf8')
  // Code only: block comments and whole-line // comments are stripped (they may name what F9
  // deliberately does not use).
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '')
  const problems = []
  const runTestsSrc = src.slice(src.indexOf('async function runTests('), src.indexOf('async function fetchWithTimeout('))
  if (!/results\.push\(await checkLogoutInBrowser\(\{ base, bypassSecret, adminPassword \}\)\)/.test(runTestsSrc)) problems.push('runTests does not push checkLogoutInBrowser for F9')
  if (/checkLogout\(A\)/.test(runTestsSrc)) problems.push('runTests still calls the parser checkLogout(A)')
  if (/extraHTTPHeaders|setExtraHTTPHeaders/.test(code)) problems.push('run.mjs uses an all-requests header mechanism')
  if (/APIRequestContext|\.request\.(get|post|fetch)\(|context\.request|request\.newContext/.test(code)) problems.push("run.mjs uses Playwright's APIRequestContext")
  return { pass: problems.length === 0, detail: { problems } }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const out = args.out || path.join(os.tmpdir(), 'selftest-f9-browser.json')
  TLS = await makeCertificate()

  const cases = [
    ['f9b-correct-clear-passes', testCorrectClearPasses],
    ['f9b-never-cleared-fails', testNeverClearedFails],
    ['f9b-nbsp-fails', testNbspFails],
    ['f9b-wrong-path-fails', testWrongPathFails],
    ['f9b-samesite-none-or-partitioned-without-secure-fails', testWithoutSecureFails],
    ['f9b-over-4096-fails', testOver4096Fails],
    ['f9b-domain-dot-fails', testDomainDotFails],
    ['f9b-empty-name-smuggling-fails', testEmptyNameSmugglingFails],
    ['f9b-sealed-value-with-expires-0-2020-minus1-fails', testSealedValueWithBadExpiresFails],
    ['f9b-narrow-path-encoded-empty-name-smuggling-fails', testNarrowPathEncodedSmugglingFails],
    ['f9b-leftover-wire-pair-unit', testLeftoverReasonUnit],
    ['f9b-accepted-variants-pass', testAcceptedVariantsPass],
    ['f9b-bypass-header-base-origin-only', testBypassHeaderBaseOriginOnly],
    ['f9b-launch-failure-fails-no-fallback', testLaunchFailureFails],
    ['f9b-password-inputs', testPasswordInputs],
    ['f9b-non-vercel-response-fails', testNonVercelResponseFails],
    ['f9b-runTests-wiring', testRunTestsWiring],
  ]

  const checks = []
  for (const [name, fn] of cases) {
    if (typeof args.only === 'string' && !name.includes(args.only)) continue
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await fn()
      checks.push({ name, pass: !!result.pass, detail: result.detail })
    } catch (err) {
      checks.push({ name, pass: false, detail: { error: String(err.stack || err) } })
    }
  }
  const pass = checks.every((c) => c.pass)
  const evidence = { kind: 'P6.1-f9-browser-selftest', generatedAt: new Date().toISOString(), pass, checks }
  const serialized = JSON.stringify(evidence, null, 2)
  // Last line of defence: the evidence file itself never carries a test secret.
  for (const secret of [SEALED, SEALED_PCT, TEST_PASSWORD, TEST_BYPASS]) if (serialized.includes(secret)) throw new Error('a test secret reached the evidence; refusing to write it')
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, serialized)
  console.log(`P6.1 F9 browser self-test: ${pass ? 'PASS' : 'FAIL'} (${checks.filter((c) => c.pass).length}/${checks.length}) -> ${out}`)
  for (const c of checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}`)
  process.exit(pass ? 0 : 1)
}

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
