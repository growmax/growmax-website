#!/usr/bin/env node
// P5.3 harness-fix self-test: focused cases for the functional/run.mjs bugs found in P5.2
// attempt 1 and in review round 1 — see docs/migration/evidence/P5.3-harness-fix.json.
//
// - F9 (logout cookie clearing): against a local mock HTTP server on 127.0.0.1 (never a real
//   endpoint), exercising the REAL exported `checkLogout`/`Assertions` from run.mjs. Round 1
//   added three false-pass regressions the original mock set never exercised: a growmax-admin
//   cookie re-set right after an unrelated cookie is cleared, a clear on the wrong Path, and a
//   clear of a similarly-named-but-wrong cookie (`xgrowmax-admin`).
//   P6.1 (A3 C-A3-4, review round 3) adds: a name-value pair with no '=' or an empty name
//   never matches; Expires only via the RFC 6265 §5.1.1 cookie-date algorithm (the sealed value
//   re-sent with Expires=0/2020/-1 must fail); the follow-up session GET carries
//   growmax-admin=<the clearing entry's value> instead of an emptied jar; Partitioned must match.
//   P6.1 review round 1 adds: U+00A0 (NBSP) is not cookie whitespace (only SP/HTAB are
//   stripped), and a clearing entry a browser rejects outright (SameSite=None or Partitioned
//   without Secure, name+value over 4096 octets, CTLs, fail-closed non-ASCII; an attribute-value
//   over 1024 octets is ignored) is never a clear.
//   P6.1 review round 2 adds: a clear whose last Domain attribute is '.' (`Domain=.`, which
//   Chromium rejects outright) or empty after a real Domain (`Domain=x; Domain=`, where Chrome and
//   RFC 6265 disagree) is never a clear, and F4 requires a login entry a browser accepts.
//   Each of those cases is its own named check, so a run against an older run.mjs shows which
//   of them that version fails.
//   P6.1 (F9 decided by a real browser): runTests no longer uses checkLogout for F9. F9 is
//   decided by a real Chromium context (checkLogoutInBrowser, tested in selftest-f9-browser.mjs)
//   and the parser checked here only feeds F9's diagnostics, so these f9-* checks now guard the
//   diagnostics parser, not the F9 verdict.
// - F2 (demo-test marker + counter): pure fs-based, against the REAL exported marker helpers,
//   pointed at a throwaway temp directory via DEMO_TEST_MARKER_DIR_OVERRIDE (never the real
//   docs/migration/.scratch/demo-tests, and never a real send). Round 1 added a case that
//   reproduces the exact staleness bug the reviewer found: STATE.json stuck at an old count,
//   plus a marker for one run under a different runLabel, must still refuse before ever
//   exceeding the cap of 3.
// - Env-hygiene fail-fast ([SENSITIVE] placeholder): spawns `node run.mjs` as a subprocess
//   with just enough args to reach the check, and an env var set to the placeholder — the
//   process must exit 2 before ever attempting a network call.
//
// Usage: node selftest-p5.3.mjs [--out <evidence.json>]
// Exit code 0 only if every case passes.

import { createServer } from 'node:http'
import { writeFile, mkdir, rm, mkdtemp, readFile, readdir, copyFile, symlink } from 'node:fs/promises'
import { realpathSync } from 'node:fs'
import { execFile } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  Assertions,
  checkLogout,
  ADMIN_COOKIE_NAME,
  isClearingSetCookie,
  parseCookieAttrs,
  isClearingCookieAttrs,
  resolveDemoTestsSentCount,
  cookieDefaultPath,
  effectiveCookiePath,
  DEMO_TEST_CAP,
} from './run.mjs'
// P6.1: symbols added after P5.3 are read off the namespace, so this file still loads against an
// older run.mjs (e.g. HEAD copied under os.tmpdir()) and just reports those checks as failing.
import * as runModule from './run.mjs'

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

// Every F2 case below needs its own ISOLATED marker directory — sharing one across cases would
// let, say, the lifecycle test's leftover marker feed into the cap-simulation test's counts.
// Node treats a distinct import specifier (the query string) as a distinct module instance, so
// re-importing run.mjs with a fresh query AFTER setting DEMO_TEST_MARKER_DIR_OVERRIDE gives that
// instance its own DEMO_TEST_MARKER_DIR, bound at that import's module-evaluation time — never
// the real docs/migration/.scratch/demo-tests. `fn` receives that module's own exports plus its
// tmp dir; the dir (and the env override) is cleaned up unconditionally afterwards.
let freshMarkerImportCounter = 0
async function withFreshMarkerDir(fn) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'p5.3-f2-selftest-'))
  const prevOverride = process.env.DEMO_TEST_MARKER_DIR_OVERRIDE
  process.env.DEMO_TEST_MARKER_DIR_OVERRIDE = dir
  try {
    freshMarkerImportCounter += 1
    const mod = await import(`./run.mjs?p53marker=${freshMarkerImportCounter}`)
    if (path.resolve(mod.DEMO_TEST_MARKER_DIR) !== path.resolve(dir)) {
      throw new Error(`run.mjs did not honor DEMO_TEST_MARKER_DIR_OVERRIDE (got ${mod.DEMO_TEST_MARKER_DIR}, expected ${dir})`)
    }
    return await fn(mod, dir)
  } finally {
    if (prevOverride === undefined) delete process.env.DEMO_TEST_MARKER_DIR_OVERRIDE
    else process.env.DEMO_TEST_MARKER_DIR_OVERRIDE = prevOverride
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}

const SEALED = 'selftest-sealed-token'
const VALID_SESSION_COOKIE = `${ADMIN_COOKIE_NAME}=${SEALED}`
// What the real app's login sends (iron-session 8 via Next's cookie serializer): Path=/, 24h.
const LOGIN_SET_COOKIE = `${ADMIN_COOKIE_NAME}=${SEALED}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`
// What the real app's logout sends: iron-session 8.0.4 destroy() sets maxAge:0, and Next's
// cookie normalizer adds Path=/.
const REAL_APP_LOGOUT = `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
const PAST = 'Thu, 01 Jan 1970 00:00:00 GMT'

/** Parses a request Cookie header into exact name -> value pairs (never a substring match, so
 *  `xgrowmax-admin=<sealed>` is not mistaken for the admin cookie). */
function cookiePairs(header) {
  const out = new Map()
  for (const part of String(header || '').split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    out.set(part.slice(0, eq).trim(), part.slice(eq + 1).trim())
  }
  return out
}

/**
 * A tiny local mock (127.0.0.1 only, never a real endpoint) of /api/admin/login,
 * /api/admin/logout and /api/admin/session, standing in for the real app. `login` and `logout`
 * are the literal Set-Cookie header value(s) (a string, an array, or null for none) each
 * endpoint returns. The session handler reports isAdmin:true whenever the request still carries
 * growmax-admin=<sealed> (iron-session is stateless: nothing is invalidated server-side), so a
 * client that keeps the stale cookie genuinely reads isAdmin:true.
 */
function startMockAdminServer({ login = LOGIN_SET_COOKIE, logout = REAL_APP_LOGOUT } = {}) {
  const server = createServer((req, res) => {
    const headers = { server: 'Vercel', 'content-type': 'application/json' }
    if (req.method === 'POST' && req.url === '/api/admin/login') {
      if (login) headers['set-cookie'] = login
      res.writeHead(200, headers)
      res.end(JSON.stringify({ ok: true }))
      return
    }
    if (req.method === 'POST' && req.url === '/api/admin/logout') {
      if (logout) headers['set-cookie'] = logout
      res.writeHead(200, headers)
      res.end(JSON.stringify({ ok: true }))
      return
    }
    if (req.method === 'GET' && req.url === '/api/admin/session') {
      const isAdmin = cookiePairs(req.headers['cookie']).get(ADMIN_COOKIE_NAME) === SEALED
      res.writeHead(200, headers)
      res.end(JSON.stringify({ isAdmin }))
      return
    }
    res.writeHead(404, { server: 'Vercel' })
    res.end('not found')
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

/** Runs the real F4 capture path (Assertions.requestJson + captureSetCookie on the mock's login
 *  response — never hand-set loginCookieAttrs) and then the real checkLogout. `afterLogin` can
 *  adjust the client (e.g. put the sealed cookie in the jar when the login response had no
 *  exact-name entry, as a browser holding an older cookie would). */
async function runF9(mockOpts, { afterLogin } = {}) {
  const server = await startMockAdminServer(mockOpts)
  try {
    const { port } = server.address()
    const A = new Assertions({ base: `http://127.0.0.1:${port}` })
    const { res } = await A.requestJson('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: 'x' }) })
    A.captureSetCookie(res)
    if (afterLogin) afterLogin(A)
    const jarBeforeLogout = A.cookie
    const result = await checkLogout(A)
    return { result, A, jarBeforeLogout }
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

function expectF9(label, outcome, expectedPass, extra = () => []) {
  const problems = []
  const { result } = outcome
  if (result.pass !== expectedPass) problems.push(`${label}: expected pass:${expectedPass}, got ${JSON.stringify(result)}`)
  if (!expectedPass && result.detail?.clearsAdminCookie !== false)
    problems.push(`${label}: expected clearsAdminCookie:false, got ${result.detail?.clearsAdminCookie}`)
  if (!expectedPass && outcome.A.cookie !== outcome.jarBeforeLogout)
    problems.push(`${label}: a clear a browser would not honor must leave the stale cookie in the jar (got ${outcome.A.cookie})`)
  problems.push(...extra(outcome))
  return problems
}

async function testF9PassesWhenCookieActuallyCleared() {
  const cases = {
    'real-app (Path=/; Max-Age=0)': { logout: REAL_APP_LOGOUT },
    'expires-only (Path=/; past Expires)': { logout: `${ADMIN_COOKIE_NAME}=; Path=/; Expires=${PAST}; HttpOnly; Secure; SameSite=Lax` },
    'max-age=0 wins over a future Expires': {
      logout: `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0; Expires=Fri, 01 Jan 2100 00:00:00 GMT`,
    },
    'invalid Max-Age ignored, past Expires decides': { logout: `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=abc; Expires=${PAST}` },
    // Login and logout both without Path: both get the default-path /api/admin, so it matches.
    'no Path on login and logout (both /api/admin)': {
      login: `${ADMIN_COOKIE_NAME}=${SEALED}; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`,
      logout: `${ADMIN_COOKIE_NAME}=; Max-Age=0`,
    },
    'Domain=.growmax.io vs Domain=growmax.io (leading dot ignored)': {
      login: `${ADMIN_COOKIE_NAME}=${SEALED}; Path=/; Domain=.growmax.io; Max-Age=86400`,
      logout: `${ADMIN_COOKIE_NAME}=; Path=/; Domain=growmax.io; Max-Age=0`,
    },
  }
  const problems = []
  const results = {}
  for (const [label, opts] of Object.entries(cases)) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9(opts)
    results[label] = outcome.result
    problems.push(...expectF9(label, outcome, true))
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** The original bug: the OLD F9 never looked at logout's own Set-Cookie. */
async function testF9FailsWhenCookieNotCleared() {
  const outcome = await runF9({ logout: null })
  const problems = expectF9('no Set-Cookie on logout', outcome, false)
  return { pass: problems.length === 0, detail: { problems, result: outcome.result } }
}

/** Review round 1, regression 1: an unrelated cookie cleared, growmax-admin RE-SET. */
async function testF9FailsWhenAdminCookieReSetAfterUnrelatedClear() {
  const outcome = await runF9({
    logout: ['other=; Path=/; Max-Age=0', `${ADMIN_COOKIE_NAME}=freshsealedvalue; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`],
  })
  const problems = expectF9('re-set after unrelated clear', outcome, false)
  return { pass: problems.length === 0, detail: { problems, result: outcome.result } }
}

/** Review round 1, regression 2: cleared under Path=/api/admin while the login cookie is Path=/. */
async function testF9FailsOnWrongPathClear() {
  const outcome = await runF9({ logout: `${ADMIN_COOKIE_NAME}=; Path=/api/admin; Max-Age=0; HttpOnly; Secure; SameSite=Lax` })
  const problems = expectF9('wrong Path', outcome, false, ({ result }) =>
    result.detail.pathMatches !== false ? ['wrong Path: expected pathMatches:false'] : [],
  )
  return { pass: problems.length === 0, detail: { problems, result: outcome.result } }
}

/** Review round 1, regression 3: only `xgrowmax-admin` cleared. */
async function testF9FailsWhenWrongCookieNameCleared() {
  const outcome = await runF9({ logout: 'xgrowmax-admin=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax' })
  const problems = expectF9('wrong name', outcome, false, ({ result }) =>
    result.detail.adminEntryCount !== 0 ? [`wrong name: expected adminEntryCount:0, got ${result.detail.adminEntryCount}`] : [],
  )
  return { pass: problems.length === 0, detail: { problems, result: outcome.result } }
}

/** Review round 2 (a): logout clears with NO Path attribute. A browser stores that clear under
 *  the default-path of POST /api/admin/logout (/api/admin, RFC 6265 §5.1.4), so it misses the
 *  Path=/ login cookie. Also: a Path that does not start with '/' is the same as no Path. */
async function testF9FailsOnClearWithoutPath() {
  const problems = []
  const results = {}
  for (const [label, logout] of [
    ['no Path attribute', `${ADMIN_COOKIE_NAME}=; Max-Age=0`],
    ['Path not starting with /', `${ADMIN_COOKIE_NAME}=; Path=foo; Max-Age=0`],
    ['empty Path', `${ADMIN_COOKIE_NAME}=; Path=; Max-Age=0`],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9({ logout })
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, false, ({ result }) => {
        const p = []
        if (result.detail.logoutEffectivePath !== '/api/admin') p.push(`${label}: expected logoutEffectivePath /api/admin, got ${result.detail.logoutEffectivePath}`)
        if (result.detail.loginEffectivePath !== '/') p.push(`${label}: expected loginEffectivePath /, got ${result.detail.loginEffectivePath}`)
        return p
      }),
    )
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** Review round 2 (b): a valid Max-Age takes precedence over Expires (RFC 6265 §5.3 step 3), so
 *  `Max-Age=86400; Expires=<1970>` keeps the cookie for 24h. */
async function testF9FailsWhenPositiveMaxAgeWithPastExpires() {
  const outcome = await runF9({ logout: `${ADMIN_COOKIE_NAME}=${SEALED}; Path=/; Max-Age=86400; Expires=${PAST}` })
  const problems = expectF9('Max-Age=86400 + past Expires', outcome, false, ({ result }) =>
    result.detail.clearsValue !== false ? ['expected clearsValue:false (Max-Age wins over Expires)'] : [],
  )
  return { pass: problems.length === 0, detail: { problems, result: outcome.result } }
}

/** Review round 2 (c): an empty, blank or non-integer Max-Age is ignored by browsers (the old
 *  Number('') === 0 read it as a clear). */
async function testF9FailsOnInvalidMaxAge() {
  const problems = []
  const results = {}
  for (const [label, logout] of [
    ['empty Max-Age=', `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=`],
    ['blank Max-Age', `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=   `],
    ['Max-Age=0x0', `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0x0`],
    ['Max-Age=0.0', `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0.0`],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9({ logout })
    results[label] = outcome.result
    problems.push(...expectF9(label, outcome, false))
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** Review round 2 (d): the login response carried no single exact-name growmax-admin entry, so
 *  captureSetCookie recorded no loginCookieAttrs. F9 must fail closed with a clear detail —
 *  both for a wrong-Path clear (the reviewer's case) and even for an otherwise-perfect clear,
 *  since there is nothing to compare it against. The jar is given the sealed cookie afterwards,
 *  as a browser still holding it would. */
async function testF9FailsClosedWithoutLoginCookieAttrs() {
  const problems = []
  const results = {}
  const putSealedInJar = (A) => {
    A.cookie = VALID_SESSION_COOKIE
  }
  for (const [label, opts] of [
    ['no growmax-admin on login, wrong-Path clear', { login: 'other=1; Path=/', logout: `${ADMIN_COOKIE_NAME}=; Path=/api/admin; Max-Age=0` }],
    ['no growmax-admin on login, correct clear', { login: 'other=1; Path=/', logout: REAL_APP_LOGOUT }],
    ['two growmax-admin entries on login (ambiguous)', { login: [LOGIN_SET_COOKIE, `${ADMIN_COOKIE_NAME}=${SEALED}; Path=/api; Max-Age=86400`], logout: REAL_APP_LOGOUT }],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9(opts, { afterLogin: putSealedInJar })
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, false, ({ A, result }) => {
        const p = []
        if (A.loginCookieAttrs !== null) p.push(`${label}: expected loginCookieAttrs null from captureSetCookie, got ${JSON.stringify(A.loginCookieAttrs)}`)
        if (!/no login cookie attributes were captured/.test(result.detail?.error || '')) p.push(`${label}: expected a 'no login cookie attributes' detail, got ${JSON.stringify(result.detail)}`)
        return p
      }),
    )
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

// --- P6.1 F9 hardening (A3 C-A3-4 / P5.3 review round 3) ---

/** (1) RFC 6265 §5.2 step 2: a name-value pair without '=' makes the whole entry ignored (Chrome
 *  stores it as an empty-named cookie instead), so `growmax-admin; Max-Age=0` is not a clear of
 *  growmax-admin. The old parser read the whole pair as the name. */
async function testF9FailsOnNameValueWithoutEquals() {
  const problems = []
  const results = {}
  for (const [label, logout] of [
    ['no = (Path=/; Max-Age=0)', `${ADMIN_COOKIE_NAME}; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`],
    ['no =, trailing space before ;', `${ADMIN_COOKIE_NAME} ; Path=/; Max-Age=0`],
    ['no =, past Expires', `${ADMIN_COOKIE_NAME}; Path=/; Expires=${PAST}`],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9({ logout })
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, false, ({ result }) =>
        result.detail.adminEntryCount !== 0 ? [`${label}: expected adminEntryCount:0, got ${result.detail.adminEntryCount}`] : [],
      ),
    )
  }
  const parsed = parseCookieAttrs(`${ADMIN_COOKIE_NAME}; Path=/; Max-Age=0`)
  if (parsed.name === ADMIN_COOKIE_NAME) problems.push(`parseCookieAttrs read a pair without '=' as name ${ADMIN_COOKIE_NAME}`)
  return { pass: problems.length === 0, detail: { problems, results, parsed } }
}

/** (1) An empty (or whitespace-only) trimmed name is never the admin cookie either. */
async function testF9FailsOnEmptyName() {
  const problems = []
  const results = {}
  for (const [label, logout] of [
    ['=growmax-admin (empty name)', `=${ADMIN_COOKIE_NAME}; Path=/; Max-Age=0`],
    ['whitespace name', `  =; Path=/; Max-Age=0`],
    ['empty name, value growmax-admin=', `=${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0`],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9({ logout })
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, false, ({ result }) =>
        result.detail.adminEntryCount !== 0 ? [`${label}: expected adminEntryCount:0, got ${result.detail.adminEntryCount}`] : [],
      ),
    )
  }
  for (const raw of [`=${ADMIN_COOKIE_NAME}; Max-Age=0`, '  =x']) {
    const a = parseCookieAttrs(raw)
    if (a.name !== '' || a.ignoredNameValue !== true) problems.push(`${JSON.stringify(raw)}: expected name '' and ignoredNameValue:true, got ${JSON.stringify(a)}`)
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** (2) The sealed value re-sent with an Expires that V8's Date.parse accepts but the §5.1.1
 *  cookie-date algorithm rejects: a browser ignores that Expires and keeps the (session) cookie
 *  with the sealed value, so the user is still admin. */
async function testF9FailsOnSealedValueWithNonCookieDateExpires() {
  const problems = []
  const results = {}
  for (const expires of ['0', '2020', '-1']) {
    const label = `sealed value, Expires=${expires}`
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9({ logout: `${ADMIN_COOKIE_NAME}=${SEALED}; Path=/; Expires=${expires}; HttpOnly; Secure; SameSite=Lax` })
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, false, ({ result }) => (result.detail.clearsValue !== false ? [`${label}: expected clearsValue:false`] : [])),
    )
    const a = parseCookieAttrs(`${ADMIN_COOKIE_NAME}=; Expires=${expires}`)
    if (a.expires !== undefined) problems.push(`${label}: parseCookieAttrs kept Expires ${JSON.stringify(a.expires)}; §5.1.1 rejects it`)
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** (3) Defence in depth: the follow-up session GET carries growmax-admin=<the clearing entry's
 *  value>, never an emptied jar. A logout that re-sends the sealed value with an expiry the
 *  harness counts as a clear (here a valid past IMF-fixdate) therefore still reads isAdmin:true
 *  on the follow-up and F9 fails, so a misread expiry can never on its own pass F9. */
async function testF9DefenceInDepthSealedValueInFollowUp() {
  const outcome = await runF9({ logout: `${ADMIN_COOKIE_NAME}=${SEALED}; Path=/; Expires=${PAST}` })
  const { result, A } = outcome
  const problems = []
  if (result.pass !== false) problems.push(`expected pass:false, got ${JSON.stringify(result)}`)
  if (result.detail?.clearsAdminCookie !== true) problems.push(`expected clearsAdminCookie:true (valid past Expires), got ${result.detail?.clearsAdminCookie}`)
  if (A.cookie !== VALID_SESSION_COOKIE) problems.push(`expected the follow-up jar to hold the logout entry's (sealed) value, got ${A.cookie === null ? 'null (emptied jar)' : JSON.stringify(A.cookie)}`)
  if (result.detail?.sessionAfter?.isAdmin !== true) problems.push(`expected the follow-up to read isAdmin:true, got ${JSON.stringify(result.detail?.sessionAfter)}`)
  return { pass: problems.length === 0, detail: { problems, result } }
}

/** (2)+(3) Valid clears still pass, including an Expires-only clear in IMF-fixdate form, and the
 *  follow-up jar holds exactly growmax-admin= (the clearing entry's empty value). */
async function testF9PassesImfFixdateExpiresOnlyClearAndJarHoldsClearedValue() {
  const problems = []
  const results = {}
  for (const [label, logout] of [
    ['real-app (Path=/; Max-Age=0)', REAL_APP_LOGOUT],
    ['IMF-fixdate Expires only (1970)', `${ADMIN_COOKIE_NAME}=; Path=/; Expires=${PAST}; HttpOnly; Secure; SameSite=Lax`],
    ['IMF-fixdate Expires only (2000)', `${ADMIN_COOKIE_NAME}=; Path=/; Expires=Sat, 01 Jan 2000 00:00:00 GMT`],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9({ logout })
    results[label] = outcome.result
    problems.push(...expectF9(label, outcome, true))
    if (outcome.A.cookie !== `${ADMIN_COOKIE_NAME}=`)
      problems.push(`${label}: expected the follow-up jar ${ADMIN_COOKIE_NAME}= (clearing entry's value), got ${outcome.A.cookie === null ? 'null (emptied jar)' : JSON.stringify(outcome.A.cookie)}`)
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** (4) Partitioned must match: a partitioned clear does not clear an unpartitioned cookie in
 *  Chrome (different partition), nor the other way round. Both partitioned still passes. */
async function testF9PartitionedMustMatch() {
  const problems = []
  const results = {}
  const PARTITIONED_LOGIN = `${LOGIN_SET_COOKIE}; Partitioned`
  for (const [label, opts, expectedPass] of [
    ['login unpartitioned, clear Partitioned', { logout: `${REAL_APP_LOGOUT}; Partitioned` }, false],
    ['login Partitioned, clear unpartitioned', { login: PARTITIONED_LOGIN, logout: REAL_APP_LOGOUT }, false],
    ['both Partitioned', { login: PARTITIONED_LOGIN, logout: `${REAL_APP_LOGOUT}; Partitioned` }, true],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9(opts)
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, expectedPass, ({ result, A }) => {
        const p = []
        if (result.detail.partitionedMatches !== expectedPass) p.push(`${label}: expected partitionedMatches:${expectedPass}, got ${result.detail.partitionedMatches}`)
        if (expectedPass && A.cookie !== `${ADMIN_COOKIE_NAME}=`) p.push(`${label}: expected the follow-up jar ${ADMIN_COOKIE_NAME}=, got ${JSON.stringify(A.cookie)}`)
        return p
      }),
    )
  }
  return { pass: problems.length === 0, detail: { problems, results } }
}

// --- P6.1 review round 1 (blocking A and B) ---

const NBSP = ' '

/** Round 1 (A): U+00A0 (NBSP) is not cookie whitespace. RFC 6265 §5.2 and Chrome strip only SP
 *  and HTAB, so each logout below leaves Chrome admin (reviewer's Chromium 1194 probe), while
 *  JS .trim() read it as a proper clear. The mock sends the header through writeHead, which
 *  writes U+00A0 as the single latin1 byte 0xA0; undici hands it back as U+00A0. */
async function testF9NbspIsNotCookieWhitespace() {
  const problems = []
  const results = {}
  for (const [label, logout] of [
    ['(a) NBSP after the name', `${ADMIN_COOKIE_NAME}${NBSP}=; Path=/; Max-Age=0`],
    ['(b) NBSP after the Path key', `${ADMIN_COOKIE_NAME}=; Path${NBSP}=/; Max-Age=0`],
    ['(c) NBSP before the Path value', `${ADMIN_COOKIE_NAME}=; Path=${NBSP}/; Max-Age=0`],
    ['(d) Domain=NBSP', `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0; Domain=${NBSP}`],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9({ logout })
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, false, ({ result }) => {
        const got = result.detail?.setCookieEntryCount === 1 ? null : `${label}: the NBSP entry did not reach the harness as one entry (setCookieEntryCount ${result.detail?.setCookieEntryCount})`
        return got ? [got] : []
      }),
    )
  }
  // Parser level (independent of the fail-closed non-ASCII rule): only SP/HTAB are stripped.
  const n = ADMIN_COOKIE_NAME
  const eq = (label, got, want) => {
    if (got !== want) problems.push(`${label}: expected ${JSON.stringify(want)}, got ${JSON.stringify(got)}`)
  }
  eq('name with trailing NBSP', parseCookieAttrs(`${n}${NBSP}=x`).name, `${n}${NBSP}`)
  eq('name with leading NBSP', parseCookieAttrs(`${NBSP}${n}=x`).name, `${NBSP}${n}`)
  eq('Path NBSP key ignored', parseCookieAttrs(`${n}=; Path${NBSP}=/`).path, undefined)
  eq('Path NBSP value is not /-prefixed', parseCookieAttrs(`${n}=; Path=${NBSP}/`).path, undefined)
  eq('Domain=NBSP is not empty', parseCookieAttrs(`${n}=; Domain=${NBSP}`).domain, NBSP)
  eq('Partitioned NBSP key is not Partitioned', parseCookieAttrs(`${n}=; Partitioned${NBSP}`).partitioned, false)
  eq('Max-Age NBSP value ignored', parseCookieAttrs(`${n}=; Max-Age=0${NBSP}`).maxAge, undefined)
  eq('SP/HTAB still stripped: name', parseCookieAttrs(` \t${n} \t=x`).name, n)
  eq('SP/HTAB still stripped: value', parseCookieAttrs(`${n}= \tx\t `).value, 'x')
  eq('SP/HTAB still stripped: Path', parseCookieAttrs(`${n}=; \tPath\t = /x\t`).path, '/x')
  eq('SP/HTAB still stripped: Max-Age', parseCookieAttrs(`${n}=; Max-Age=\t0 `).maxAge, 0)
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** Round 1 (B): entries a browser rejects outright (Chrome 80+ / RFC 6265bis): nothing is
 *  stored, the sealed login cookie is kept, so none of them is a clear. The defence-in-depth jar
 *  cannot catch these (the entry's value is not the sealed one), so checkLogout must. Controls:
 *  the same entries made acceptable (Secure added, name+value exactly 4096) still pass. */
async function testF9FailsOnEntryTheBrowserRejects() {
  const problems = []
  const results = {}
  const SECURE_PARTITIONED_LOGIN = `${LOGIN_SET_COOKIE}; Partitioned`
  const n = ADMIN_COOKIE_NAME
  const fill = (len) => 'x'.repeat(len)
  for (const [label, opts, expectedPass, reason] of [
    ['(e) SameSite=None without Secure', { logout: `${n}=; Path=/; Max-Age=0; SameSite=None` }, false, 'samesite-none-without-secure'],
    ['(e2) SameSite=None then SameSite=Lax, no Secure', { logout: `${n}=; Path=/; Max-Age=0; SameSite=None; SameSite=Lax` }, false, 'samesite-none-without-secure'],
    ['(e3) SameSite=None; Secure=<1025 chars> (over-long attribute ignored)', { logout: `${n}=; Path=/; Max-Age=0; SameSite=None; Secure=${fill(1025)}` }, false, 'samesite-none-without-secure'],
    ['(f) Partitioned login, Partitioned clear without Secure', { login: SECURE_PARTITIONED_LOGIN, logout: `${n}=; Path=/; Max-Age=0; Partitioned` }, false, 'partitioned-without-secure'],
    ['(g) name+value 5013 bytes', { logout: `${n}=${fill(5000)}; Path=/; Max-Age=0` }, false, 'name-value-over-4096'],
    ['(g2) name+value 4097 bytes', { logout: `${n}=${fill(4097 - n.length)}; Path=/; Max-Age=0` }, false, 'name-value-over-4096'],
    ['control: SameSite=None; Secure', { logout: `${n}=; Path=/; Max-Age=0; SameSite=None; Secure` }, true, null],
    ['control: Partitioned; Secure both', { login: SECURE_PARTITIONED_LOGIN, logout: `${n}=; Path=/; Max-Age=0; Secure; Partitioned` }, true, null],
    ['control: name+value exactly 4096 bytes', { logout: `${n}=${fill(4096 - n.length)}; Path=/; Max-Age=0` }, true, null],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9(opts)
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, expectedPass, ({ result }) => {
        const p = []
        if (result.detail?.acceptedByBrowserRules !== expectedPass) p.push(`${label}: expected acceptedByBrowserRules:${expectedPass}, got ${result.detail?.acceptedByBrowserRules}`)
        const reasons = result.detail?.browserRejectionReasons
        if (reason && !(Array.isArray(reasons) && reasons.includes(reason))) p.push(`${label}: expected browserRejectionReasons to include ${reason}, got ${JSON.stringify(reasons)}`)
        if (!reason && !(Array.isArray(reasons) && reasons.length === 0)) p.push(`${label}: expected no browserRejectionReasons, got ${JSON.stringify(reasons)}`)
        return p
      }),
    )
  }
  // No cookie value ever reaches the detail (only codes and booleans).
  if (JSON.stringify(results).includes(fill(64))) problems.push('a cookie value leaked into the F9 detail')
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** Review round 2 (blocking): a clear whose LAST Domain attribute is '.' (`Domain=.`,
 *  `Domain= . `) is rejected outright by Chromium (the sealed login cookie is kept), while the
 *  RFC reading (drop the '.', empty = host-only) calls it a host-only clear. The defence-in-depth
 *  jar cannot catch it (the value is empty), so checkLogout must. Also fails closed on
 *  `Domain=x; Domain=` (Chrome: host-only; RFC: Domain=x). Controls: a later empty Domain
 *  (`Domain=.; Domain=`, host-only in both readings), a lone empty `Domain=`, and a Domain value
 *  over 1024 octets (ignored by both) still clear. Mock-driven through runF9. */
async function testF9FailsOnDomainDotClear() {
  const problems = []
  const results = {}
  const n = ADMIN_COOKIE_NAME
  const DOMAIN_LOGIN = `${n}=${SEALED}; Path=/; Domain=growmax.io; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`
  for (const [label, opts, expectedPass, reason] of [
    ["'Domain=.'", { logout: `${n}=; Path=/; Max-Age=0; Domain=.` }, false, 'domain-empty-after-dot'],
    ["'Domain= . '", { logout: `${n}=; Path=/; Max-Age=0; Domain= . ` }, false, 'domain-empty-after-dot'],
    ["'Domain=\\t.\\t'", { logout: `${n}=; Path=/; Max-Age=0; Domain=\t.\t` }, false, 'domain-empty-after-dot'],
    ["'Domain=; Domain=.' (last is '.')", { logout: `${n}=; Path=/; Max-Age=0; Domain=; Domain=.` }, false, 'domain-empty-after-dot'],
    ["real-app shape plus 'Domain=.'", { logout: `${REAL_APP_LOGOUT}; Domain=.` }, false, 'domain-empty-after-dot'],
    ["Domain login, 'Domain=growmax.io; Domain=' (Chrome host-only)", { login: DOMAIN_LOGIN, logout: `${n}=; Path=/; Max-Age=0; Domain=growmax.io; Domain=` }, false, 'domain-last-empty-after-domain'],
    ["control: 'Domain=.; Domain=' (last empty: host-only)", { logout: `${n}=; Path=/; Max-Age=0; Domain=.; Domain=` }, true, null],
    ["control: 'Domain=' alone (host-only)", { logout: `${n}=; Path=/; Max-Age=0; Domain=` }, true, null],
    ['control: Domain over 1024 octets (ignored)', { logout: `${n}=; Path=/; Max-Age=0; Domain=.${'a'.repeat(1024)}` }, true, null],
    ['control: Domain login, same Domain clear', { login: DOMAIN_LOGIN, logout: `${n}=; Path=/; Max-Age=0; Domain=.growmax.io` }, true, null],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const outcome = await runF9(opts)
    results[label] = outcome.result
    problems.push(
      ...expectF9(label, outcome, expectedPass, ({ result, A }) => {
        const p = []
        if (result.detail?.acceptedByBrowserRules !== expectedPass) p.push(`${label}: expected acceptedByBrowserRules:${expectedPass}, got ${result.detail?.acceptedByBrowserRules}`)
        const reasons = result.detail?.browserRejectionReasons
        if (reason && !(Array.isArray(reasons) && reasons.includes(reason))) p.push(`${label}: expected browserRejectionReasons to include ${reason}, got ${JSON.stringify(reasons)}`)
        if (!reason && !(Array.isArray(reasons) && reasons.length === 0)) p.push(`${label}: expected no browserRejectionReasons, got ${JSON.stringify(reasons)}`)
        if (expectedPass && A.cookie !== `${n}=`) p.push(`${label}: expected the follow-up jar '${n}=', got ${A.cookie}`)
        return p
      }),
    )
  }
  // Direct parser/rule assertions.
  const fn = runModule.setCookieRejectionReasons
  if (typeof fn !== 'function') problems.push('run.mjs exports no setCookieRejectionReasons')
  else {
    const want = (label, entry, expected) => {
      const got = fn(entry)
      if (JSON.stringify(got) !== JSON.stringify(expected)) problems.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`)
    }
    want('Domain=.', `${n}=; Max-Age=0; Domain=.`, ['domain-empty-after-dot'])
    want('Domain=.; Domain=.', `${n}=; Max-Age=0; Domain=.; Domain=.`, ['domain-empty-after-dot'])
    want('Domain=.; Domain=', `${n}=; Max-Age=0; Domain=.; Domain=`, [])
    want('Domain=x; Domain=', `${n}=; Max-Age=0; Domain=growmax.io; Domain=`, ['domain-last-empty-after-domain'])
    want('Domain=; Domain=x', `${n}=; Max-Age=0; Domain=; Domain=growmax.io`, [])
    want('Domain=.growmax.io', `${n}=; Max-Age=0; Domain=.growmax.io`, [])
    want('Domain over 1024 octets ignored', `${n}=; Max-Age=0; Domain=${'.'.repeat(1025)}`, [])
  }
  const a = parseCookieAttrs(`${n}=; Domain=.`)
  if (a.domainLast !== '.') problems.push(`parseCookieAttrs('Domain=.').domainLast: expected '.', got ${JSON.stringify(a.domainLast)}`)
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** Review round 2 (non-blocking, closed): F4's login-cookie check (checkLoginCookieEntry, run on
 *  the exact-name entry of a mock login response via the real requestJson/adminCookieEntry)
 *  also requires an entry a browser accepts, so a login Chromium rejects (`Domain=.`) fails F4
 *  instead of counting as logged in. The real app's login, as Next serializes it, passes. */
async function testF4LoginCookieEntryMustBeAccepted() {
  const problems = []
  const results = {}
  const check = runModule.checkLoginCookieEntry
  if (typeof check !== 'function') return { pass: false, detail: { problems: ['run.mjs exports no checkLoginCookieEntry'] } }
  const n = ADMIN_COOKIE_NAME
  const future = 'Mon, 01 Jan 2100 00:00:00 GMT'
  for (const [label, login, expectedOk, reason] of [
    ['real-app login (Next ResponseCookies shape)', `${n}=${SEALED}; Path=/; Expires=${future}; Max-Age=86400; Secure; HttpOnly; SameSite=lax`, true, null],
    ['selftest login', LOGIN_SET_COOKIE, true, null],
    ["login with 'Domain=.'", `${LOGIN_SET_COOKIE}; Domain=.`, false, 'domain-empty-after-dot'],
    ["login with 'Domain= . '", `${LOGIN_SET_COOKIE}; Domain= . `, false, 'domain-empty-after-dot'],
    ['login with Partitioned but no Secure', `${n}=${SEALED}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax; Partitioned`, false, 'partitioned-without-secure'],
  ]) {
    // eslint-disable-next-line no-await-in-loop
    const server = await startMockAdminServer({ login })
    try {
      const { port } = server.address()
      const A = new Assertions({ base: `http://127.0.0.1:${port}` })
      // eslint-disable-next-line no-await-in-loop
      const { res } = await A.requestJson('/api/admin/login', { method: 'POST', body: '{}' })
      A.captureSetCookie(res)
      const got = check(Assertions.adminCookieEntry(res))
      results[label] = got
      if (got.cookieOk !== expectedOk) problems.push(`${label}: expected cookieOk:${expectedOk}, got ${JSON.stringify(got)}`)
      const reasons = got.loginRejectionReasons
      if (reason && !(Array.isArray(reasons) && reasons.includes(reason))) problems.push(`${label}: expected loginRejectionReasons to include ${reason}, got ${JSON.stringify(reasons)}`)
      if (!reason && !(Array.isArray(reasons) && reasons.length === 0)) problems.push(`${label}: expected no loginRejectionReasons, got ${JSON.stringify(reasons)}`)
    } finally {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => server.close(resolve))
    }
  }
  if (check(null).cookieOk !== false) problems.push('no login entry must fail F4')
  if (JSON.stringify(results).includes(SEALED)) problems.push('a cookie value leaked into the F4 detail')
  return { pass: problems.length === 0, detail: { problems, results } }
}

/** Round 1 (B): setCookieRejectionReasons itself, including the CTL rule that no mock can send
 *  (Node's http server refuses CTL bytes in a header, and undici throws on VT/FF). */
function testSetCookieRejectionReasons() {
  const problems = []
  const fn = runModule.setCookieRejectionReasons
  if (typeof fn !== 'function') return { pass: false, detail: { problems: ['run.mjs exports no setCookieRejectionReasons'] } }
  const n = ADMIN_COOKIE_NAME
  const want = (label, entry, expected) => {
    const got = fn(entry)
    if (JSON.stringify(got) !== JSON.stringify(expected)) problems.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`)
  }
  want('real-app clear', REAL_APP_LOGOUT, [])
  want('real-app login', LOGIN_SET_COOKIE, [])
  want('HTAB is allowed', `${n}=;\tPath=/;\tMax-Age=0`, [])
  want('NUL', `${n}=\x00; Path=/; Max-Age=0`, ['ctl'])
  want('0x01', `${n}=; Path=/\x01; Max-Age=0`, ['ctl'])
  want('LF', `${n}=; Path=/; Max-Age=0\n`, ['ctl'])
  want('DEL', `${n}=\x7f; Path=/; Max-Age=0`, ['ctl'])
  want('NBSP', `${n}=${NBSP}; Path=/; Max-Age=0`, ['non-ascii'])
  want('SameSite=none (case-insensitive), no Secure', `${n}=; Max-Age=0; samesite=NONE`, ['samesite-none-without-secure'])
  want('SameSite=None, Secure', `${n}=; Max-Age=0; SameSite=None; Secure`, [])
  want('SameSite=Lax, no Secure', `${n}=; Max-Age=0; SameSite=Lax`, [])
  want('Partitioned, no Secure', `${n}=; Max-Age=0; Partitioned`, ['partitioned-without-secure'])
  want('Partitioned + SameSite=None, no Secure', `${n}=; Max-Age=0; Partitioned; SameSite=None`, ['samesite-none-without-secure', 'partitioned-without-secure'])
  want('Secure with a 1024-byte value still counts', `${n}=; Max-Age=0; SameSite=None; Secure=${'x'.repeat(1024)}`, [])
  want('Secure with a 1025-byte value is ignored', `${n}=; Max-Age=0; SameSite=None; Secure=${'x'.repeat(1025)}`, ['samesite-none-without-secure'])
  want('name+value 4096', `${n}=${'x'.repeat(4096 - n.length)}`, [])
  want('name+value 4097', `${n}=${'x'.repeat(4097 - n.length)}`, ['name-value-over-4096'])
  // An over-long attribute-value is ignored by parseCookieAttrs (RFC 6265bis §5.6).
  if (parseCookieAttrs(`${n}=; Path=/${'a'.repeat(1024)}`).path !== undefined) problems.push('a 1025-byte Path value must be ignored')
  if (parseCookieAttrs(`${n}=; Max-Age=${'0'.repeat(1025)}`).maxAge !== undefined) problems.push('a 1025-byte Max-Age value must be ignored')
  if (parseCookieAttrs(`${n}=; Max-Age=${'0'.repeat(1024)}`).maxAge !== 0) problems.push('a 1024-byte Max-Age value must still count')
  return { pass: problems.length === 0, detail: { problems } }
}

/** (2) The RFC 6265 §5.1.1 cookie-date algorithm itself. */
function testParseCookieDateRfc6265() {
  const problems = []
  const parseCookieDate = runModule.parseCookieDate
  if (typeof parseCookieDate !== 'function') return { pass: false, detail: { problems: ['run.mjs exports no parseCookieDate'] } }
  const want = (input, expected) => {
    const got = parseCookieDate(input)
    if (got !== expected) problems.push(`${JSON.stringify(input)}: expected ${expected}, got ${got}`)
  }
  want('Thu, 01 Jan 1970 00:00:00 GMT', 0)
  want('Sat, 01 Jan 2000 00:00:00 GMT', Date.UTC(2000, 0, 1))
  want('Sunday, 06-Nov-94 08:49:37 GMT', Date.UTC(1994, 10, 6, 8, 49, 37)) // RFC 850, 2-digit year 94 -> 1994
  want('Sun Nov  6 08:49:37 1994', Date.UTC(1994, 10, 6, 8, 49, 37)) // asctime
  want('Thu, 01 Jan 70 00:00:00 GMT', 0) // 70 -> 1970
  want('Mon, 01 Jan 69 00:00:00 GMT', Date.UTC(2069, 0, 1)) // 69 -> 2069
  want('1 january 2020 1:2:3', Date.UTC(2020, 0, 1, 1, 2, 3)) // month by its first 3 letters, 1-digit fields
  for (const bad of ['0', '2020', '-1', '', 'yesterday-ish', 'Thu, 01 Jan 1970 GMT', 'Thu, Jan 1970 00:00:00 GMT', 'Thu, 01 1970 00:00:00 GMT',
    'Thu, 01 Jan 00:00:00 GMT', 'Thu, 32 Jan 1970 00:00:00 GMT', 'Thu, 00 Jan 1970 00:00:00 GMT', 'Sun, 30 Feb 2020 00:00:00 GMT',
    'Sat, 01 Jan 1600 00:00:00 GMT', 'Thu, 01 Jan 1970 24:00:00 GMT', 'Thu, 01 Jan 1970 00:60:00 GMT', 'Thu, 01 Jan 1970 00:00:60 GMT',
    '1970-01-01T00:00:00Z', 'Thu, 01 Jan 19700 00:00:00 GMT']) {
    want(bad, null)
  }
  return { pass: problems.length === 0, detail: { problems } }
}

/** captureSetCookie on a real-shaped login: records Path/effectivePath and puts the admin
 *  cookie itself (not whichever Set-Cookie came first) in the jar. */
async function testCaptureSetCookieOnMockLogin() {
  const server = await startMockAdminServer({ login: ['other=1; Path=/', LOGIN_SET_COOKIE] })
  try {
    const { port } = server.address()
    const A = new Assertions({ base: `http://127.0.0.1:${port}` })
    const { res } = await A.requestJson('/api/admin/login', { method: 'POST', body: '{}' })
    A.captureSetCookie(res)
    const problems = []
    if (A.cookie !== VALID_SESSION_COOKIE) problems.push(`expected jar ${VALID_SESSION_COOKIE}, got ${A.cookie}`)
    if (A.loginCookieAttrs?.path !== '/') problems.push(`expected login path /, got ${A.loginCookieAttrs?.path}`)
    if (A.loginCookieAttrs?.effectivePath !== '/') problems.push(`expected login effectivePath /, got ${A.loginCookieAttrs?.effectivePath}`)
    if (A.loginCookieAttrs?.maxAge !== 86400) problems.push(`expected login maxAge 86400, got ${A.loginCookieAttrs?.maxAge}`)
    return { pass: problems.length === 0, detail: { problems, loginCookieAttrs: A.loginCookieAttrs } }
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

function testIsClearingSetCookieDirect() {
  const problems = []
  if (!isClearingSetCookie(`${ADMIN_COOKIE_NAME}=; Max-Age=0; Path=/`)) problems.push('Max-Age=0 not detected as clearing')
  if (!isClearingSetCookie(`${ADMIN_COOKIE_NAME}=; Max-Age=-1; Path=/`)) problems.push('negative Max-Age not detected as clearing')
  if (!isClearingSetCookie(`${ADMIN_COOKIE_NAME}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT`))
    problems.push('past Expires not detected as clearing')
  if (isClearingSetCookie(`${ADMIN_COOKIE_NAME}=freshvalue; Max-Age=86400`)) problems.push('a normal re-set cookie was wrongly treated as clearing')
  if (isClearingSetCookie(null)) problems.push('a missing Set-Cookie was wrongly treated as clearing')
  return { pass: problems.length === 0, detail: { problems } }
}

function testParseCookieAttrsAndEntrySelection() {
  const problems = []
  const attrs = parseCookieAttrs(`${ADMIN_COOKIE_NAME}=abc123; Path=/api/admin; Domain=growmax.io; Max-Age=0`)
  if (attrs.name !== ADMIN_COOKIE_NAME) problems.push(`expected name ${ADMIN_COOKIE_NAME}, got ${attrs.name}`)
  if (attrs.path !== '/api/admin') problems.push(`expected path /api/admin, got ${attrs.path}`)
  if (attrs.domain !== 'growmax.io') problems.push(`expected domain growmax.io, got ${attrs.domain}`)
  if (attrs.maxAge !== 0) problems.push(`expected maxAge 0, got ${attrs.maxAge}`)
  if (!isClearingCookieAttrs(attrs)) problems.push('parsed attrs with Max-Age=0 should be clearing')
  // Never mis-selects a substring match: 'xgrowmax-admin' must not be treated as ADMIN_COOKIE_NAME.
  const wrongName = parseCookieAttrs('xgrowmax-admin=; Max-Age=0')
  if (wrongName.name === ADMIN_COOKIE_NAME) problems.push('xgrowmax-admin was wrongly parsed as growmax-admin')
  return { pass: problems.length === 0, detail: { problems, attrs, wrongName } }
}

/** Review round 2: attribute parsing per RFC 6265 §5.2 / §5.3 and the §5.1.4 default-path. */
function testRfc6265AttributeParsing() {
  const problems = []
  const n = ADMIN_COOKIE_NAME
  const eq = (label, got, want) => {
    if (got !== want) problems.push(`${label}: expected ${JSON.stringify(want)}, got ${JSON.stringify(got)}`)
  }
  // Max-Age: only /^-?\d+$/ after trimming counts.
  eq('Max-Age= (empty)', parseCookieAttrs(`${n}=; Max-Age=`).maxAge, undefined)
  eq('Max-Age=  (blank)', parseCookieAttrs(`${n}=; Max-Age=  `).maxAge, undefined)
  eq('Max-Age (no =)', parseCookieAttrs(`${n}=; Max-Age`).maxAge, undefined)
  eq('Max-Age=1e3', parseCookieAttrs(`${n}=; Max-Age=1e3`).maxAge, undefined)
  eq('Max-Age=0x0', parseCookieAttrs(`${n}=; Max-Age=0x0`).maxAge, undefined)
  eq('Max-Age=+0', parseCookieAttrs(`${n}=; Max-Age=+0`).maxAge, undefined)
  eq('Max-Age= 0 (trimmed)', parseCookieAttrs(`${n}=; Max-Age= 0 `).maxAge, 0)
  eq('Max-Age=-1', parseCookieAttrs(`${n}=; Max-Age=-1`).maxAge, -1)
  eq('valid then invalid Max-Age keeps the valid one', parseCookieAttrs(`${n}=; Max-Age=0; Max-Age=`).maxAge, 0)
  eq('last valid Max-Age wins', parseCookieAttrs(`${n}=; Max-Age=0; Max-Age=86400`).maxAge, 86400)
  // Clearing: a valid Max-Age alone decides; Expires only without one.
  eq('Max-Age=86400 + past Expires is not a clear', isClearingSetCookie(`${n}=x; Max-Age=86400; Expires=Thu, 01 Jan 1970 00:00:00 GMT`), false)
  eq('Max-Age=0 + future Expires is a clear', isClearingSetCookie(`${n}=; Max-Age=0; Expires=Fri, 01 Jan 2100 00:00:00 GMT`), true)
  eq('empty Max-Age alone is not a clear', isClearingSetCookie(`${n}=; Path=/; Max-Age=`), false)
  eq('invalid Max-Age + past Expires is a clear', isClearingSetCookie(`${n}=; Max-Age=abc; Expires=Thu, 01 Jan 1970 00:00:00 GMT`), true)
  eq('unparseable Expires alone is not a clear', isClearingSetCookie(`${n}=; Expires=yesterday-ish`), false)
  // Path: empty or not starting with '/' means "no Path" (default-path applies).
  eq('Path=foo', parseCookieAttrs(`${n}=; Path=foo`).path, undefined)
  eq('Path= (empty)', parseCookieAttrs(`${n}=; Path=`).path, undefined)
  eq('Path=/ then Path=foo (last wins, invalid = default)', parseCookieAttrs(`${n}=; Path=/; Path=foo`).path, undefined)
  eq('Path= /x (trimmed)', parseCookieAttrs(`${n}=; Path= /x`).path, '/x')
  // Domain: leading dot dropped, lower-cased, empty ignored.
  eq('Domain=.GrowMax.io', parseCookieAttrs(`${n}=; Domain=.GrowMax.io`).domain, 'growmax.io')
  eq('Domain= (empty)', parseCookieAttrs(`${n}=; Domain=`).domain, undefined)
  // default-path (§5.1.4) and effective path.
  eq('default-path /api/admin/logout', cookieDefaultPath('https://h.example/api/admin/logout'), '/api/admin')
  eq('default-path /api/admin/login', cookieDefaultPath('https://h.example/api/admin/login'), '/api/admin')
  eq('default-path /x', cookieDefaultPath('https://h.example/x'), '/')
  eq('default-path /', cookieDefaultPath('https://h.example/'), '/')
  eq('default-path unparseable', cookieDefaultPath('not a url'), '/')
  eq('effective path, no Path', effectiveCookiePath(parseCookieAttrs(`${n}=; Max-Age=0`), 'https://h.example/api/admin/logout'), '/api/admin')
  eq('effective path, Path=/', effectiveCookiePath(parseCookieAttrs(`${n}=; Path=/`), 'https://h.example/api/admin/logout'), '/')
  return { pass: problems.length === 0, detail: { problems } }
}

// --- F2: demo-test marker + counter (each case gets its own isolated tmp dir, never real state) ---

async function testDemoTestMarkerLifecycle() {
  return withFreshMarkerDir(async (mod) => {
    const { demoTestMarkerPath, demoTestMarkerExists, countDemoTestMarkers, writeDemoTestMarker } = mod
    const runLabel = `p5.3-selftest-${Date.now()}`
    const problems = []
    const existedBefore = await demoTestMarkerExists(runLabel)
    if (existedBefore) problems.push('marker unexpectedly already existed for a fresh runLabel')

    const countBefore = await countDemoTestMarkers()
    await writeDemoTestMarker(runLabel, 'https://example-deployment.vercel.app', { countBefore: 2, status: 'pending' })
    const existedAfterPending = await demoTestMarkerExists(runLabel)
    if (!existedAfterPending) problems.push('marker did not exist right after the pending writeDemoTestMarker')
    await writeDemoTestMarker(runLabel, 'https://example-deployment.vercel.app', { countBefore: 2, status: 'sent' })
    const countAfter = await countDemoTestMarkers()
    if (countAfter !== countBefore + 1) problems.push(`countDemoTestMarkers did not increase by exactly 1: ${countBefore} -> ${countAfter}`)

    // No PII: runLabel, sentAt, base, and the two harness-internal counters.
    const marker = JSON.parse(await readFile(demoTestMarkerPath(runLabel), 'utf8'))
    const keys = Object.keys(marker).sort()
    if (JSON.stringify(keys) !== JSON.stringify(['base', 'countBefore', 'runLabel', 'sentAt', 'status']))
      problems.push(`marker has unexpected keys: ${JSON.stringify(keys)}`)
    if (marker.countBefore !== 2) problems.push(`expected countBefore 2, got ${marker.countBefore}`)
    if (marker.status !== 'sent') problems.push(`expected status 'sent' after finalizing, got ${marker.status}`)

    return { pass: problems.length === 0, detail: { problems, countBefore, countAfter, marker } }
  })
}

function testResolveDemoTestsSentCountUsesMax() {
  const problems = []
  if (resolveDemoTestsSentCount(0, []) !== 0) problems.push('0,[] should be 0')
  if (resolveDemoTestsSentCount(1, [{ countBefore: 0 }, { countBefore: 0 }]) !== 2) problems.push('a higher marker count (STATE stale) should win')
  if (resolveDemoTestsSentCount(0, [{ countBefore: 0 }, { countBefore: 0 }, { countBefore: 0 }]) !== 3)
    problems.push('three markers should resolve to 3 even with STATE at 0')
  // The exact fix: a single marker recorded at countBefore:2 must resolve to 3 (2+1), not 2 —
  // this is what lets a marker alone, without STATE ever being updated, close the cap.
  if (resolveDemoTestsSentCount(2, [{ countBefore: 2 }]) !== 3) problems.push('a marker with countBefore:2 should resolve to 3, not 2')
  if (resolveDemoTestsSentCount(0, [{ countBefore: 0 }, { countBefore: 2 }]) !== 3)
    problems.push('resolveDemoTestsSentCount should take the MAX countBefore+1 across markers')
  return { pass: problems.length === 0, detail: { problems } }
}

/** Review round 1, blocking finding: reproduces the exact scenario the reviewer's own
 *  simulation used. STATE.json is stale at 2 (2 real historical sends, no markers on disk
 *  yet — the pre-fix state of the world). Send #3 under runLabel L must succeed and write a
 *  marker recording countBefore. A same-label re-run must refuse (existing behavior). A
 *  DIFFERENT runLabel L2, with STATE.json STILL reading 2 (the orchestrator hasn't caught up
 *  yet — the entire point of the bug), must ALSO refuse: the marker from L alone must be
 *  enough to hit the cap, regardless of what STATE.json still says. This never touches the
 *  real docs/migration/.scratch/demo-tests (DEMO_TEST_MARKER_DIR_OVERRIDE), and issues no
 *  network calls — it drives the same resolveDemoTestsSentCount/writeDemoTestMarker/
 *  demoTestMarkerExists helpers runTests uses, standing in for the POST itself. */
async function testF2CapNeverExceedsWithStaleStateAndNewRunLabel() {
  return withFreshMarkerDir(async (mod) => {
    const { readDemoTestMarkers, writeDemoTestMarker, demoTestMarkerExists } = mod
    const problems = []
    const staleState = 2
    const runLabelL = `p5.3-selftest-cap-L-${Date.now()}`
    const runLabelL2 = `p5.3-selftest-cap-L2-${Date.now()}`

    // Send #3 under L: effective count is max(2, 0 markers, 0) = 2, under the cap of 3 -> allowed.
    const markersBeforeL = await readDemoTestMarkers()
    const effectiveBeforeL = resolveDemoTestsSentCount(staleState, markersBeforeL)
    if (effectiveBeforeL !== 2) problems.push(`expected effective count 2 before send #3, got ${effectiveBeforeL}`)
    const sendAllowedForL = effectiveBeforeL < 3
    if (!sendAllowedForL) problems.push('send #3 under L should have been allowed (this is the real send-3-of-3 case)')
    // Mirrors runTests: a pending marker is written before the "POST", finalized after.
    await writeDemoTestMarker(runLabelL, 'https://example-deployment.vercel.app', { countBefore: effectiveBeforeL, status: 'pending' })
    await writeDemoTestMarker(runLabelL, 'https://example-deployment.vercel.app', { countBefore: effectiveBeforeL, status: 'sent' })

    // A same-label re-run must refuse outright, before ever consulting the counter.
    const sameLabelRefused = await demoTestMarkerExists(runLabelL)
    if (!sameLabelRefused) problems.push('a marker for runLabel L should exist and refuse a same-label re-run')

    // The bug: a re-run under a DIFFERENT runLabel L2, with STATE.json STILL stale at 2 (the
    // orchestrator has not yet updated it to 3). The OLD formula, max(fromState, markerCount) =
    // max(2, 1) = 2, is UNDER the cap and would incorrectly allow send #4. The fixed formula
    // must fold in L's own countBefore (2) + 1 = 3, hitting the cap.
    const markersBeforeL2 = await readDemoTestMarkers()
    const effectiveBeforeL2 = resolveDemoTestsSentCount(staleState, markersBeforeL2)
    if (effectiveBeforeL2 !== 3) problems.push(`expected effective count 3 before a new-runLabel send under stale STATE, got ${effectiveBeforeL2}`)
    const sendAllowedForL2 = effectiveBeforeL2 < 3
    if (sendAllowedForL2) problems.push('send under a NEW runLabel with stale STATE.json must be refused (this is the exact bug being closed)')
    const alreadySentForL2 = await demoTestMarkerExists(runLabelL2)
    if (alreadySentForL2) problems.push('runLabel L2 should never have had a marker written (it must never have been sent)')

    return {
      pass: problems.length === 0,
      detail: { problems, staleState, effectiveBeforeL, sendAllowedForL, effectiveBeforeL2, sendAllowedForL2 },
    }
  })
}

/** Review round 2 (non-blocking): anything unknowable resolves to the cap, never under it. */
function testResolveDemoTestsSentCountFailsClosed() {
  const problems = []
  const eq = (label, got, want) => {
    if (got !== want) problems.push(`${label}: expected ${want}, got ${got}`)
  }
  eq('NaN fromState (e.g. --demo-tests-sent two)', resolveDemoTestsSentCount(Number('two'), []), DEMO_TEST_CAP)
  eq('null fromState (STATE unreadable)', resolveDemoTestsSentCount(null, []), DEMO_TEST_CAP)
  eq('undefined fromState', resolveDemoTestsSentCount(undefined, []), DEMO_TEST_CAP)
  eq('negative fromState', resolveDemoTestsSentCount(-1, []), DEMO_TEST_CAP)
  eq('fractional fromState', resolveDemoTestsSentCount(1.5, []), DEMO_TEST_CAP)
  eq('NaN fromState with markers already at 3', resolveDemoTestsSentCount(NaN, [{ countBefore: 2 }]), DEMO_TEST_CAP)
  eq('corrupt marker with STATE=2 (reviewer case)', resolveDemoTestsSentCount(2, [{ corrupt: true }]), DEMO_TEST_CAP)
  eq('marker without integer countBefore', resolveDemoTestsSentCount(0, [{}]), DEMO_TEST_CAP)
  eq('marker with countBefore:null', resolveDemoTestsSentCount(0, [{ countBefore: null }]), DEMO_TEST_CAP)
  return { pass: problems.length === 0, detail: { problems } }
}

/** A truncated/unparseable marker on disk is read back as corrupt and counts as the cap; marker
 *  writes are atomic (no tmp leftovers, never a partial file). */
async function testCorruptMarkerAndAtomicWrite() {
  return withFreshMarkerDir(async (mod, dir) => {
    const problems = []
    // Simulates a kill mid-write under the OLD non-atomic writer: a truncated JSON file.
    await writeFile(path.join(dir, 'truncated.sent'), '{"runLabel":"trunc","countBe')
    const markers = await mod.readDemoTestMarkers()
    if (markers.length !== 1 || !markers[0].corrupt) problems.push(`expected one corrupt marker, got ${JSON.stringify(markers)}`)
    const resolved = mod.resolveDemoTestsSentCount(2, markers)
    if (resolved !== mod.DEMO_TEST_CAP) problems.push(`corrupt marker with STATE=2 should resolve to the cap, got ${resolved}`)
    await rm(path.join(dir, 'truncated.sent'))

    await mod.writeDemoTestMarker('atomic-a', 'https://example-deployment.vercel.app', { countBefore: 0, status: 'pending' })
    await mod.writeDemoTestMarker('atomic-a', 'https://example-deployment.vercel.app', { countBefore: 0, status: 'sent' })
    const files = await readdir(dir)
    if (JSON.stringify(files) !== JSON.stringify(['atomic-a.sent'])) problems.push(`expected only atomic-a.sent, got ${JSON.stringify(files)}`)
    return { pass: problems.length === 0, detail: { problems, files } }
  })
}

/** Review round 2 (non-blocking): a runLabel with a path separator or '.'/'..' never becomes a
 *  marker path, and reserveDemoTestSend refuses it (nothing sent). */
async function testUnsafeRunLabelRefused() {
  return withFreshMarkerDir(async (mod, dir) => {
    const problems = []
    for (const label of ['../escape', 'a/b', 'a\\b', '..', '.', '', 'nul\0byte']) {
      let threw = false
      try {
        mod.demoTestMarkerPath(label)
      } catch {
        threw = true
      }
      if (!threw) problems.push(`demoTestMarkerPath(${JSON.stringify(label)}) should throw`)
      // eslint-disable-next-line no-await-in-loop
      const r = await mod.reserveDemoTestSend(label, 'https://example-deployment.vercel.app', 0)
      if (!r.refusal) problems.push(`reserveDemoTestSend(${JSON.stringify(label)}) should refuse`)
    }
    for (const ok of ['p5.2-20260926', 'run_1', 'a..b']) {
      try {
        mod.demoTestMarkerPath(ok)
      } catch (err) {
        problems.push(`safe label ${ok} wrongly rejected: ${err.message}`)
      }
    }
    const leftovers = await readdir(dir)
    if (leftovers.length !== 0) problems.push(`no marker may be written for unsafe labels, found ${JSON.stringify(leftovers)}`)
    const outside = await readdir(path.dirname(dir))
    if (outside.includes('escape.sent')) problems.push('a marker escaped the marker directory')
    return { pass: problems.length === 0, detail: { problems } }
  })
}

/** reserveDemoTestSend end to end (no POST ever happens here): duplicate label, cap, exclusive
 *  create, pending-elsewhere refusal (the missing lock), recount raise, and cleanup on refusal. */
async function testReserveDemoTestSend() {
  return withFreshMarkerDir(async (mod, dir) => {
    const problems = []
    const base = 'https://example-deployment.vercel.app'
    const listSent = async () => (await readdir(dir)).filter((f) => f.endsWith('.sent')).sort()

    // Cap: refused, and no marker left behind.
    const atCap = await mod.reserveDemoTestSend('cap', base, 3)
    if (!atCap.refusal) problems.push('count 3 should refuse')
    const unknown = await mod.reserveDemoTestSend('unknown', base, NaN)
    if (!unknown.refusal) problems.push('NaN count should refuse')
    if ((await listSent()).length !== 0) problems.push(`refusals must leave no marker, found ${JSON.stringify(await listSent())}`)

    // Concurrency: run X reserved (pending, POST "in flight"); a concurrent run Y under a new
    // label that read the count before X wrote anything must refuse, and remove its own marker.
    const x = await mod.reserveDemoTestSend('X', base, 1)
    if (x.refusal || x.countBefore !== 1) problems.push(`X should reserve at countBefore 1, got ${JSON.stringify(x)}`)
    const y = await mod.reserveDemoTestSend('Y', base, 1)
    if (!y.refusal || !/pending/.test(y.refusal)) problems.push(`Y must refuse while X is pending, got ${JSON.stringify(y)}`)
    if (JSON.stringify(await listSent()) !== JSON.stringify(['X.sent'])) problems.push(`Y must remove its own pending marker, dir: ${JSON.stringify(await listSent())}`)

    // Exclusive create: a same-label racer that passed the exists-check loses the link().
    const lost = await mod.createPendingDemoTestMarker('X', base, { countBefore: 1 })
    if (lost !== false) problems.push('a second exclusive create of X must return false')

    // X finishes; a later sequential run Z with STATE still stale at 1 re-counts to 2 and records
    // countBefore 2 (so a run after Z resolves to 3 and refuses).
    await mod.writeDemoTestMarker('X', base, { countBefore: x.countBefore, status: 'sent' })
    const z = await mod.reserveDemoTestSend('Z', base, 1)
    if (z.refusal || z.countBefore !== 2) problems.push(`Z should reserve with the re-counted countBefore 2, got ${JSON.stringify(z)}`)
    const zMarker = JSON.parse(await readFile(path.join(dir, 'Z.sent'), 'utf8'))
    if (zMarker.countBefore !== 2 || zMarker.status !== 'pending') problems.push(`Z marker should be pending/countBefore 2, got ${JSON.stringify(zMarker)}`)
    await mod.writeDemoTestMarker('Z', base, { countBefore: z.countBefore, status: 'sent' })
    const after = mod.resolveDemoTestsSentCount(1, await mod.readDemoTestMarkers())
    if (after !== 3) problems.push(`after X and Z with STATE stale at 1 the count must be 3, got ${after}`)
    const w = await mod.reserveDemoTestSend('W', base, after)
    if (!w.refusal) problems.push('a 4th send must refuse')

    // Duplicate label.
    const dup = await mod.reserveDemoTestSend('X', base, 0)
    if (!dup.refusal || !/already sent/.test(dup.refusal)) problems.push(`same label X must refuse as duplicate, got ${JSON.stringify(dup)}`)
    return { pass: problems.length === 0, detail: { problems, x, y, z, w, dup } }
  })
}

// --- Env-hygiene fail-fast: ADMIN_PASSWORD/SESSION_SECRET === "[SENSITIVE]" ---

function runChild(env, extraArgs = []) {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [RUN_MJS, '--base', 'http://127.0.0.1:1', '--mode', 'pre', '--run-label', 'p5.3-selftest-env-hygiene', ...extraArgs],
      { env: { ...process.env, ...env }, timeout: 10_000 },
      (error, stdout, stderr) => {
        resolve({ code: error ? error.code : 0, stdout, stderr })
      },
    )
  })
}

async function testFailsFastOnSensitivePlaceholder() {
  const problems = []
  const adminCase = await runChild({ ADMIN_PASSWORD: '[SENSITIVE]', SESSION_SECRET: 'real-secret' })
  if (adminCase.code !== 2) problems.push(`ADMIN_PASSWORD=[SENSITIVE]: expected exit 2, got ${adminCase.code}`)
  if (!adminCase.stderr.includes('ADMIN_PASSWORD') || !adminCase.stderr.includes('[SENSITIVE]'))
    problems.push(`ADMIN_PASSWORD case: stderr missing expected message: ${adminCase.stderr}`)

  const sessionCase = await runChild({ ADMIN_PASSWORD: 'real-password', SESSION_SECRET: '[SENSITIVE]' })
  if (sessionCase.code !== 2) problems.push(`SESSION_SECRET=[SENSITIVE]: expected exit 2, got ${sessionCase.code}`)
  if (!sessionCase.stderr.includes('SESSION_SECRET') || !sessionCase.stderr.includes('[SENSITIVE]'))
    problems.push(`SESSION_SECRET case: stderr missing expected message: ${sessionCase.stderr}`)

  // A real (non-placeholder) pair must NOT trip this specific guard — it should fail later,
  // for a DIFFERENT, unrelated reason (no --target-database-url-env was given here), never
  // with the placeholder message.
  const realCase = await runChild({ ADMIN_PASSWORD: 'real-password', SESSION_SECRET: 'real-secret' })
  if (realCase.stderr.includes('[SENSITIVE]')) problems.push(`real secrets case unexpectedly hit the placeholder guard: ${realCase.stderr}`)
  if (realCase.code !== 2 || !realCase.stderr.includes('--target-database-url-env'))
    problems.push(`real secrets case: expected the unrelated --target-database-url-env failure, got: ${JSON.stringify(realCase)}`)

  return { pass: problems.length === 0, detail: { problems, adminCase, sessionCase, realCase } }
}

/** Review round 2 (non-blocking): CLI guards that exit 2 before any DB or network step. No
 *  --target-database-url-env is passed, so even a broken guard would stop at that check (exit 2
 *  with a different message) and never reach the network; the stderr text tells them apart. */
async function testCliGuards() {
  const problems = []
  const env = { ADMIN_PASSWORD: 'real-password', SESSION_SECRET: 'real-secret', DEMO_TEST_MARKER_DIR_OVERRIDE: '' }
  const nan = await runChild(env, ['--demo-tests-sent', 'two'])
  if (nan.code !== 2 || !nan.stderr.includes('--demo-tests-sent must be a non-negative integer'))
    problems.push(`--demo-tests-sent two: expected exit 2 with the integer message, got ${JSON.stringify(nan)}`)
  const neg = await runChild(env, ['--demo-tests-sent', '-1'])
  if (neg.code !== 2 || !neg.stderr.includes('--demo-tests-sent must be a non-negative integer'))
    problems.push(`--demo-tests-sent -1: expected exit 2 with the integer message, got ${JSON.stringify(neg)}`)
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'p5.3-override-'))
  try {
    const ov = await runChild({ ...env, DEMO_TEST_MARKER_DIR_OVERRIDE: tmpDir }, ['--allow-demo-test'])
    if (ov.code !== 2 || !ov.stderr.includes('DEMO_TEST_MARKER_DIR_OVERRIDE'))
      problems.push(`override + --allow-demo-test: expected exit 2 naming the override, got ${JSON.stringify(ov)}`)
    const leftovers = await readdir(tmpDir)
    if (leftovers.length !== 0) problems.push(`override run wrote markers: ${JSON.stringify(leftovers)}`)
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {})
  }
  return { pass: problems.length === 0, detail: { problems, nan, neg } }
}

/** Review round 2 (non-blocking): run.mjs's entry-point guard compares real file URLs, so it
 *  still runs main() from a path with a space or through a symlink (the old `file://${argv[1]}`
 *  string never matched and exited 0 silently). A copy of run.mjs under such a path is started
 *  with no args: main() must run and print its usage (exit 2). The copy imports
 *  ../parity/lib/fetcher.mjs, so the tmp tree mirrors that relative layout. */
async function testEntrypointGuard() {
  const problems = []
  const root = await mkdtemp(path.join(os.tmpdir(), 'p5.3 entry '))
  try {
    const fnDir = path.join(root, 'functional dir')
    await mkdir(fnDir, { recursive: true })
    await mkdir(path.join(root, 'parity', 'lib'), { recursive: true })
    await copyFile(RUN_MJS, path.join(fnDir, 'run.mjs'))
    // fnDir is root/'functional dir', so the copy's '../parity/lib/fetcher.mjs' resolves here.
    await copyFile(path.join(__dirname, '..', 'parity', 'lib', 'fetcher.mjs'), path.join(root, 'parity', 'lib', 'fetcher.mjs'))
    await symlink(path.join(fnDir, 'run.mjs'), path.join(root, 'run-link.mjs'))
    for (const [label, target] of [
      ['path with a space', path.join(fnDir, 'run.mjs')],
      ['symlink', path.join(root, 'run-link.mjs')],
    ]) {
      // eslint-disable-next-line no-await-in-loop
      const r = await new Promise((resolve) => {
        execFile(process.execPath, [target], { timeout: 10_000, cwd: root, env: { ...process.env, NODE_PATH: path.join(__dirname, '..', 'node_modules') } }, (error, stdout, stderr) =>
          resolve({ code: error ? error.code : 0, stdout, stderr }),
        )
      })
      if (r.code !== 2 || !r.stderr.includes('Usage: node run.mjs')) problems.push(`${label}: expected main() to run (exit 2 + usage), got ${JSON.stringify(r)}`)
    }
  } finally {
    await rm(root, { recursive: true, force: true }).catch(() => {})
  }
  return { pass: problems.length === 0, detail: { problems } }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const out = args.out || path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'evidence', 'P5.3-functional-selftest.json')

  const cases = [
    ['f9-passes-when-cookie-cleared', testF9PassesWhenCookieActuallyCleared],
    ['f9-fails-when-cookie-not-cleared', testF9FailsWhenCookieNotCleared],
    ['f9-fails-when-admin-cookie-re-set-after-unrelated-clear', testF9FailsWhenAdminCookieReSetAfterUnrelatedClear],
    ['f9-fails-on-wrong-path-clear', testF9FailsOnWrongPathClear],
    ['f9-fails-when-wrong-cookie-name-cleared', testF9FailsWhenWrongCookieNameCleared],
    ['f9-fails-on-clear-without-path (r2 a)', testF9FailsOnClearWithoutPath],
    ['f9-fails-when-positive-max-age-with-past-expires (r2 b)', testF9FailsWhenPositiveMaxAgeWithPastExpires],
    ['f9-fails-on-invalid-max-age (r2 c)', testF9FailsOnInvalidMaxAge],
    ['f9-fails-closed-without-login-cookie-attrs (r2 d)', testF9FailsClosedWithoutLoginCookieAttrs],
    ['f9-fails-on-name-value-without-equals (p6.1)', testF9FailsOnNameValueWithoutEquals],
    ['f9-fails-on-empty-name (p6.1)', testF9FailsOnEmptyName],
    ['f9-fails-on-sealed-value-with-expires-0-2020-minus1 (p6.1)', testF9FailsOnSealedValueWithNonCookieDateExpires],
    ['f9-follow-up-jar-carries-logout-value-defence-in-depth (p6.1)', testF9DefenceInDepthSealedValueInFollowUp],
    ['f9-passes-imf-fixdate-expires-only-clear-and-jar-holds-cleared-value (p6.1)', testF9PassesImfFixdateExpiresOnlyClearAndJarHoldsClearedValue],
    ['f9-partitioned-must-match (p6.1)', testF9PartitionedMustMatch],
    ['parseCookieDate-rfc6265-5.1.1 (p6.1)', async () => testParseCookieDateRfc6265()],
    ['f9-nbsp-is-not-cookie-whitespace (p6.1 r1-A)', testF9NbspIsNotCookieWhitespace],
    ['f9-fails-on-entry-the-browser-rejects (p6.1 r1-B)', testF9FailsOnEntryTheBrowserRejects],
    ['setCookieRejectionReasons-and-attribute-value-limit (p6.1 r1-B)', async () => testSetCookieRejectionReasons()],
    ['f9-fails-on-domain-dot-clear (p6.1 r2)', testF9FailsOnDomainDotClear],
    ['f4-login-cookie-entry-must-be-accepted (p6.1 r2)', testF4LoginCookieEntryMustBeAccepted],
    ['captureSetCookie-on-mock-login', testCaptureSetCookieOnMockLogin],
    ['isClearingSetCookie-direct', async () => testIsClearingSetCookieDirect()],
    ['parseCookieAttrs-and-entry-selection', async () => testParseCookieAttrsAndEntrySelection()],
    ['rfc6265-attribute-parsing', async () => testRfc6265AttributeParsing()],
    ['f2-demo-test-marker-lifecycle', testDemoTestMarkerLifecycle],
    ['f2-resolveDemoTestsSentCount-uses-max', async () => testResolveDemoTestsSentCountUsesMax()],
    ['f2-resolveDemoTestsSentCount-fails-closed', async () => testResolveDemoTestsSentCountFailsClosed()],
    ['f2-cap-never-exceeds-with-stale-state-and-new-runlabel', testF2CapNeverExceedsWithStaleStateAndNewRunLabel],
    ['f2-corrupt-marker-and-atomic-write', testCorruptMarkerAndAtomicWrite],
    ['f2-unsafe-runlabel-refused', testUnsafeRunLabelRefused],
    ['f2-reserveDemoTestSend-lock-and-recount', testReserveDemoTestSend],
    ['env-hygiene-fails-fast-on-sensitive-placeholder', testFailsFastOnSensitivePlaceholder],
    ['cli-guards-demo-tests-sent-and-override', testCliGuards],
    ['entrypoint-guard-space-and-symlink', testEntrypointGuard],
  ]

  const checks = []
  for (const [name, fn] of cases) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await fn()
      checks.push({ name, pass: !!result.pass, detail: result.detail })
    } catch (err) {
      checks.push({ name, pass: false, detail: { error: String(err.stack || err) } })
    }
  }

  const pass = checks.every((c) => c.pass)
  const evidence = {
    kind: 'P5.3-functional-selftest',
    generatedAt: new Date().toISOString(),
    pass,
    checks,
  }
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, JSON.stringify(evidence, null, 2))
  console.log(`P5.3 functional self-test: ${pass ? 'PASS' : 'FAIL'} (${checks.filter((c) => c.pass).length}/${checks.length}) -> ${out}`)
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
