#!/usr/bin/env node
// SPEC-04 §6: functional tests (form, admin and API behavior).
//
// Usage:
//   node run.mjs --base <origin> --mode pre|post --run-label <id> \
//     [--bypass-secret-file <f>] [--allow-demo-test] [--out <evidence.json>]
//
// Secrets (ADMIN_PASSWORD) come from env only, never argv. Test data is always
// labeled vercel-migration-test-<runLabel>; writes are cleaned up immediately after
// each assertion. DB assertions/cleanup prefer scripts/migration/db/ (P1.1's runner
// helper) when present, and fall back to a direct read-only-safe Neon HTTP query
// against --target-database-url-env otherwise (P1.2 does not own scripts/migration/db/,
// so it never creates files there; it only calls in).

import { writeFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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

class Assertions {
  constructor({ base, bypassSecret, targetDatabaseUrl, dbHelper }) {
    this.base = base
    this.bypassSecret = bypassSecret
    this.targetDatabaseUrl = targetDatabaseUrl
    this.dbHelper = dbHelper
    this.cookie = null
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

  captureSetCookie(res) {
    const raw = res.headers.get('set-cookie')
    if (raw) this.cookie = raw.split(';')[0]
    return raw
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

  // F2: demo request (guarded, at most 3 per migration, caller-supplied counter).
  if (allowDemoTest) {
    if ((demoTestsSent ?? 0) >= 3) {
      rec('F2-demo-request', false, { skipped: true, reason: 'demoTestsSent >= 3, refusing to send another' })
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
        const { res } = await A.requestJson('/api/demo-requests', { method: 'POST', body: JSON.stringify(payload) })
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
    const cookieOk =
      !!setCookie &&
      /growmax-admin=/.test(setCookie) &&
      /HttpOnly/i.test(setCookie) &&
      /Secure/i.test(setCookie) &&
      /SameSite=Lax/i.test(setCookie) &&
      /Max-Age=86400/i.test(setCookie)
    rec('F4-admin-correct-password', res.status === 200 && cookieOk, { status: res.status, setCookie: setCookie ? '<present>' : null, cookieOk })
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

  // F9: logout, then session -> isAdmin false.
  try {
    const { res: logoutRes } = await A.requestJson('/api/admin/logout', { method: 'POST' })
    const { res: sessionRes, body } = await A.requestJson('/api/admin/session')
    rec('F9-logout', logoutRes.status === 200 && sessionRes.status === 200 && body?.isAdmin === false, {
      logoutStatus: logoutRes.status,
      sessionAfter: body,
    })
  } catch (err) {
    rec('F9-logout', false, { error: String(err.message || err) })
  }

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
    if (Number.isInteger(val)) return val
    console.warn('WARNING: docs/migration/STATE.json has no integer flags.demoTestsSent; defaulting to 0')
  } catch (err) {
    console.warn(`WARNING: could not read docs/migration/STATE.json flags.demoTestsSent (${err.message}); defaulting to 0`)
  }
  return 0
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

  const demoTestsSent =
    args['demo-tests-sent'] !== undefined ? Number(args['demo-tests-sent']) : await readDemoTestsSentFromState()

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

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
