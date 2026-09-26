#!/usr/bin/env node
// Migration state ledger CLI (Replit -> Vercel + Neon). Zero dependencies, Node >= 18.
// The orchestrator is the ONLY writer of docs/migration/STATE.json and LOG.md, and only through this tool.
//
//   node scripts/migration/state.mjs resume [--hook]        where am I / what's next (hook mode: compact, silent when COMPLETE)
//   node scripts/migration/state.mjs next [--all]           next actionable step(s)
//   node scripts/migration/state.mjs step <id> <status> [--evidence <path>]... [--note "<text>"]
//   node scripts/migration/state.mjs gate <id> <pending|passed|failed> [--evidence <path>]... [--by <role>] [--note "<text>"]
//   node scripts/migration/state.mjs status <NOT_STARTED|IN_PROGRESS|BLOCKED|AWAITING_DNS|POST_CUTOVER|ROLLED_BACK|COMPLETE>
//   node scripts/migration/state.mjs blocker add <ID> --step <id> --action "<owner instructions>" [--note "<text>"]
//   node scripts/migration/state.mjs blocker resolve <ID> [--note "<text>"]
//   node scripts/migration/state.mjs set <dot.path> <json-value>      e.g. set facts.vercel.projectId '"prj_123"'
//   node scripts/migration/state.mjs get [dot.path]
//   node scripts/migration/state.mjs log "<message>" [--step <id>]
//   node scripts/migration/state.mjs scan                   secret/PII scan of changed + untracked files (exit 1 on findings)
//   node scripts/migration/state.mjs validate               structural sanity check of STATE.json

import { readFileSync, writeFileSync, renameSync, existsSync, appendFileSync, statSync, openSync, readSync, closeSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const STATE_PATH = join(ROOT, 'docs/migration/STATE.json')
const LOG_PATH = join(ROOT, 'docs/migration/LOG.md')

const STEP_STATUSES = ['pending', 'in_progress', 'done', 'failed', 'blocked', 'skipped']
const GATE_STATUSES = ['pending', 'passed', 'failed']
const OVERALL = ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'AWAITING_DNS', 'POST_CUTOVER', 'ROLLED_BACK', 'COMPLETE']
const DONE = new Set(['done', 'skipped'])

const now = () => new Date().toISOString()
const die = (msg, code = 2) => { console.error(`state.mjs: ${msg}`); process.exit(code) }

function load() {
  if (!existsSync(STATE_PATH)) die(`missing ${STATE_PATH}`)
  try { return JSON.parse(readFileSync(STATE_PATH, 'utf8')) } catch (e) { die(`STATE.json is not valid JSON: ${e.message}`) }
}
function save(s) {
  s.updatedAt = now()
  const tmp = `${STATE_PATH}.tmp`
  writeFileSync(tmp, JSON.stringify(s, null, 2) + '\n')
  renameSync(tmp, STATE_PATH)
}
function appendLog(msg, stepId) {
  appendFileSync(LOG_PATH, `- ${now()}${stepId ? ` [${stepId}]` : ''} ${String(msg).replace(/\s*\n\s*/g, ' ')}\n`)
}

function parseArgs(argv) {
  const out = { _: [], flags: {} }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      const val = next === undefined || next.startsWith('--') ? true : (i++, next)
      ;(out.flags[key] ||= []).push(val)
    } else out._.push(a)
  }
  return out
}
const flag = (a, k) => a.flags[k]?.at(-1)
const flagList = (a, k) => (a.flags[k] || []).filter(v => v !== true)

function getPath(obj, path) {
  if (!path) return obj
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}
function setPath(obj, path, value) {
  const keys = path.split('.')
  let o = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (o[keys[i]] == null || typeof o[keys[i]] !== 'object') o[keys[i]] = {}
    o = o[keys[i]]
  }
  o[keys.at(-1)] = value
}
const uniquePush = (arr, items) => { for (const it of items) if (!arr.includes(it)) arr.push(it) }

function findStep(s, id) {
  const st = s.steps.find(x => x.id === id)
  if (!st) die(`unknown step "${id}" (valid: ${s.steps.map(x => x.id).join(', ')})`)
  return st
}

function computeNext(s) {
  const byId = Object.fromEntries(s.steps.map(x => [x.id, x]))
  const inProgress = s.steps.filter(x => x.status === 'in_progress')
  const ready = s.steps.filter(x => (x.status === 'pending' || x.status === 'failed') && x.deps.every(d => DONE.has(byId[d]?.status)))
  const blocked = s.steps.filter(x => x.status === 'blocked')
  return { inProgress, ready, blocked }
}

function fmtStep(x) {
  return `${x.id} [${x.status}${x.attempts ? `, attempts ${x.attempts}` : ''}] ${x.title}${x.workflow ? `  → ${x.workflow}` : ''}${x.gate ? `  (gate ${x.gate})` : ''}`
}

function lastLogLines(n) {
  if (!existsSync(LOG_PATH)) return []
  return readFileSync(LOG_PATH, 'utf8').split('\n').filter(l => l.startsWith('- ')).slice(-n)
}

function keyFacts(s) {
  const f = s.facts || {}
  const pick = {
    paths: f.paths,
    vercel: f.vercel && { projectId: f.vercel.projectId, deployMode: f.vercel.deployMode, plan: f.vercel.plan ?? f.vercel.planAtPlanTime, productionUrl: f.vercel.productionUrl, verifiedSha: f.vercel.verifiedSha },
    neon: f.neon && { resourceName: f.neon.resourceName, region: f.neon.region, pgVersion: f.neon.pgVersion, plan: f.neon.plan },
    source: f.source && { pgMajor: f.source.pgMajor, hostKind: f.source.hostKind },
    git: f.git,
    cutover: f.cutover,
    gapStart: s.sync?.gapStart,
    pr: s.flags?.prUrl,
  }
  return JSON.stringify(pick, (k, v) => (v === undefined ? undefined : v))
}

function cmdResume(a) {
  const s = load()
  const hook = !!flag(a, 'hook')
  if (hook && s.status === 'COMPLETE') return
  if (hook && s.status === 'NOT_STARTED') {
    console.log('[migration] A Replit → Vercel migration plan exists (docs/migration/, status NOT_STARTED). ' +
      'If you are the migration orchestrator, follow docs/migration/ORCHESTRATOR.md §1. Otherwise ignore this note.')
    return
  }
  const { inProgress, ready, blocked } = computeNext(s)
  const lines = []
  lines.push(`=== Growmax Vercel migration: state resume (${hook ? 'auto-injected after start/resume/compaction' : 'manual'}) ===`)
  lines.push(`Status: ${s.status} | Branch: ${s.branch} | Updated: ${s.updatedAt} | Current step: ${s.currentStep ?? '—'}`)
  if (inProgress.length) lines.push('In progress (resume these first):', ...inProgress.map(x => '  ' + fmtStep(x)))
  lines.push('Next actionable:', ...(ready.length ? ready.slice(0, 6).map(x => '  ' + fmtStep(x)) : ['  (none)']))
  if (blocked.length) lines.push('Blocked steps:', ...blocked.map(x => '  ' + fmtStep(x)))
  const openBlockers = (s.blockers || []).filter(b => !b.resolvedAt)
  if (openBlockers.length) lines.push('Open blockers (owner action):', ...openBlockers.map(b => `  ${b.id} (step ${b.step}, since ${b.since}): ${b.action}`))
  lines.push('Gates: ' + Object.entries(s.gates).map(([k, v]) => `${k}=${v.status}`).join(' | '))
  lines.push('Key facts: ' + keyFacts(s))
  lines.push('Recent log:', ...lastLogLines(hook ? 6 : 12).map(l => '  ' + l))
  lines.push('Rules: STATE.json is the truth (reality wins on conflict: log the correction). Only state.mjs writes state. ' +
    'Commit + push after every step (run `state.mjs scan` first). Every agent() call sets model + effort explicitly. ' +
    'Never ask the owner questions; use the blocker protocol. Details: docs/migration/ORCHESTRATOR.md.')
  console.log(lines.join('\n'))
}

function cmdNext(a) {
  const s = load()
  const { inProgress, ready } = computeNext(s)
  const list = [...inProgress, ...ready]
  if (!list.length) { console.log('(no actionable step)'); return }
  if (flag(a, 'all')) list.forEach(x => console.log(fmtStep(x)))
  else console.log(fmtStep(list[0]))
}

function cmdStep(a) {
  const [, id, status] = a._
  if (!id || !status) die('usage: step <id> <status> [--evidence p]... [--note text]')
  if (!STEP_STATUSES.includes(status)) die(`invalid step status "${status}" (valid: ${STEP_STATUSES.join(', ')})`)
  const s = load()
  const st = findStep(s, id)
  const prev = st.status
  st.status = status
  if (status === 'in_progress') {
    st.attempts = (st.attempts || 0) + 1
    st.startedAt = now()
    s.currentStep = id
    if (s.status === 'NOT_STARTED') s.status = 'IN_PROGRESS'
  }
  if (DONE.has(status)) { st.completedAt = now(); if (s.currentStep === id) s.currentStep = null }
  if (status === 'failed' || status === 'blocked') st.lastFailureAt = now()
  uniquePush(st.evidence ||= [], flagList(a, 'evidence'))
  const note = flag(a, 'note')
  if (typeof note === 'string') (st.notes ||= []).push(`${now()} ${note}`)
  save(s)
  appendLog(`step ${prev} → ${status}${typeof note === 'string' ? ` — ${note}` : ''}`, id)
  console.log(fmtStep(st))
}

function cmdGate(a) {
  const [, id, status] = a._
  if (!id || !status) die('usage: gate <id> <pending|passed|failed> [--evidence p]... [--by role] [--note text]')
  if (!GATE_STATUSES.includes(status)) die(`invalid gate status "${status}"`)
  const s = load()
  const g = s.gates[id]
  if (!g) die(`unknown gate "${id}" (valid: ${Object.keys(s.gates).join(', ')})`)
  if (status === 'passed') {
    const fresh = flagList(a, 'evidence')
    if (!fresh.length) die(`gate ${id} passed requires --evidence <file> (fresh evidence for this pass)`)
    const problems = []
    for (const rel of fresh) problems.push(...validateEvidence(rel))
    if (problems.length) die(`gate ${id} NOT passed — evidence problems:\n` + problems.map(p => '  ' + p).join('\n'), 1)
  }
  g.status = status
  g.at = now()
  const by = flag(a, 'by'); if (typeof by === 'string') g.by = by
  const note = flag(a, 'note'); if (typeof note === 'string') g.note = note
  uniquePush(g.evidence ||= [], flagList(a, 'evidence'))
  save(s)
  appendLog(`gate ${id} → ${status}${typeof by === 'string' ? ` (by ${by})` : ''}${typeof note === 'string' ? ` — ${note}` : ''}`)
  console.log(`${id}: ${status}`)
}

function validateEvidence(rel) {
  const abs = join(ROOT, rel)
  const out = []
  if (!existsSync(abs)) return [`${rel}: file not found`]
  let j
  try { j = JSON.parse(readFileSync(abs, 'utf8')) } catch (e) { return [`${rel}: not valid JSON (${e.message})`] }
  const isAdvisor = typeof j.verdict === 'string'
  if (isAdvisor) {
    if (!['GO', 'GO_WITH_CONDITIONS'].includes(j.verdict)) out.push(`${rel}: advisor verdict is ${j.verdict}`)
    return out
  }
  if (j.status !== 'pass') out.push(`${rel}: status is "${j.status}" (need "pass")`)
  if (!j.verifier) out.push(`${rel}: missing "verifier"`)
  if (!j.checkedAt || Number.isNaN(Date.parse(j.checkedAt))) out.push(`${rel}: missing/invalid "checkedAt"`)
  if (!Array.isArray(j.checks) || !j.checks.length) out.push(`${rel}: no "checks" array`)
  else j.checks.forEach((c, i) => { if (c.pass !== true) out.push(`${rel}: check #${i + 1} "${c.name ?? '?'}" did not pass`) })
  return out
}

function cmdStatus(a) {
  const v = a._[1]
  if (!OVERALL.includes(v)) die(`invalid status "${v}" (valid: ${OVERALL.join(', ')})`)
  const s = load(); const prev = s.status; s.status = v; save(s)
  appendLog(`status ${prev} → ${v}`)
  console.log(v)
}

function cmdBlocker(a) {
  const [, sub, id] = a._
  const s = load()
  s.blockers ||= []
  if (sub === 'add') {
    const step = flag(a, 'step'); const action = flag(a, 'action')
    if (!id || typeof step !== 'string' || typeof action !== 'string') die('usage: blocker add <ID> --step <id> --action "<text>"')
    const existing = s.blockers.find(b => b.id === id && !b.resolvedAt)
    if (existing) { existing.action = action; existing.step = step } else s.blockers.push({ id, step, action, since: now(), note: flag(a, 'note') ?? null, resolvedAt: null })
    save(s); appendLog(`blocker ${id} added: ${action}`, step); console.log(`blocker ${id} open`)
  } else if (sub === 'resolve') {
    const b = s.blockers.find(x => x.id === id && !x.resolvedAt)
    if (!b) die(`no open blocker "${id}"`)
    b.resolvedAt = now(); const note = flag(a, 'note'); if (typeof note === 'string') b.resolution = note
    save(s); appendLog(`blocker ${id} resolved${typeof note === 'string' ? ` — ${note}` : ''}`, b.step); console.log(`blocker ${id} resolved`)
  } else die('usage: blocker add|resolve <ID> ...')
}

function cmdSet(a) {
  const [, path, raw] = a._
  if (!path || raw === undefined) die('usage: set <dot.path> <json-value>   (strings need JSON quotes: \'"value"\')')
  if (/^(steps|gates|status)(\.|$)/.test(path)) die('use the step/gate/status commands for steps, gates and status')
  let value
  try { value = JSON.parse(raw) } catch { die(`value is not valid JSON: ${raw}   (strings need quotes, e.g. '"prj_123"')`) }
  const s = load(); setPath(s, path, value); save(s)
  appendLog(`set ${path}`)
  console.log(`${path} = ${JSON.stringify(value)}`)
}

function cmdGet(a) {
  const v = getPath(load(), a._[1])
  console.log(v === undefined ? 'undefined' : JSON.stringify(v, null, 2))
}

function cmdLog(a) {
  const msg = a._.slice(1).join(' ')
  if (!msg) die('usage: log "<message>" [--step <id>]')
  const step = flag(a, 'step')
  appendLog(msg, typeof step === 'string' ? step : undefined)
  console.log('logged')
}

function git(args) {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }) } catch { return '' }
}
function isBinary(path) {
  const fd = openSync(path, 'r'); const buf = Buffer.alloc(8192); const n = readSync(fd, buf, 0, 8192, 0); closeSync(fd)
  return buf.subarray(0, n).includes(0)
}

function cmdScan() {
  const files = new Set()
  const add = out => out.split('\n').map(x => x.trim()).filter(Boolean).forEach(f => files.add(f))
  add(git(['diff', '--name-only', 'HEAD']))
  add(git(['diff', '--name-only', '--cached']))
  add(git(['ls-files', '--others', '--exclude-standard']))
  const patterns = [
    [/postgres(?:ql)?:\/\/[^\s:@\/'"`]+:[^\s@'"`]+@/i, 'Postgres URL with embedded password'],
    [/\bvc[pk]_[A-Za-z0-9]{20,}/, 'Vercel token'],
    [/chat\.googleapis\.com\/v1\/spaces\/[^\s'"`]*(?:key|token)=/i, 'Google Chat webhook URL (key/token)'],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
    [/\bgh[pousr]_[A-Za-z0-9]{36,}\b/, 'GitHub token'],
    [/\bgithub_pat_[A-Za-z0-9_]{40,}/, 'GitHub fine-grained token'],
    [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
    [/\bnpg_[A-Za-z0-9]{10,}\b/, 'Neon password'],
    [/x-vercel-protection-bypass["']?\s*[:=]\s*["'][A-Za-z0-9]{20,}/i, 'protection-bypass secret'],
  ]
  const secretEnv = ['REPLIT_DATABASE_URL', 'VERCEL_TOKEN', 'ADMIN_PASSWORD', 'SESSION_SECRET', 'GOOGLE_CHAT_WEBHOOK_URL', 'VERCEL_AUTOMATION_BYPASS_SECRET']
    .map(k => [k, process.env[k]]).filter(([, v]) => v && v.length >= 8)
  const emailRe = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
  const allowedEmail = e => /^vercel-migration-test(\+[^@]*)?@growmax\.io$/i.test(e) || /@(anthropic\.com|example\.(com|org))$/i.test(e)
  const findings = []
  for (const rel of files) {
    const abs = join(ROOT, rel)
    if (rel.startsWith('docs/migration/.scratch/')) { findings.push(`${rel}: scratch file must never be committed`); continue }
    if (/\.(dump|sql\.gz|backup)$/i.test(rel)) { findings.push(`${rel}: database dump must never be committed`); continue }
    if (/(^|\/)\.env(\.|$)/.test(rel)) { findings.push(`${rel}: .env file must never be committed`); continue }
    if (!existsSync(abs) || !statSync(abs).isFile() || isBinary(abs)) continue
    if (statSync(abs).size > 5 * 1024 * 1024) { findings.push(`${rel}: larger than 5 MB (evidence must stay compact)`); continue }
    const text = readFileSync(abs, 'utf8')
    const lines = text.split('\n')
    lines.forEach((line, i) => {
      for (const [re, label] of patterns) if (re.test(line)) findings.push(`${rel}:${i + 1}: ${label}`)
      for (const [k, v] of secretEnv) if (line.includes(v)) findings.push(`${rel}:${i + 1}: literal value of $${k}`)
      if (rel.startsWith('docs/migration/evidence/')) {
        for (const e of line.match(emailRe) || []) if (!allowedEmail(e)) findings.push(`${rel}:${i + 1}: email address in evidence (PII)`)
      }
    })
  }
  if (findings.length) {
    console.error(`scan: ${findings.length} finding(s) — do NOT commit until fixed:\n` + findings.map(f => '  ' + f).join('\n'))
    process.exit(1)
  }
  console.log(`scan: clean (${files.size} changed/untracked file(s) checked)`)
}

function cmdValidate() {
  const s = load()
  const errs = []
  if (!OVERALL.includes(s.status)) errs.push(`bad status ${s.status}`)
  const ids = new Set()
  for (const st of s.steps) {
    if (ids.has(st.id)) errs.push(`duplicate step ${st.id}`)
    ids.add(st.id)
    if (!STEP_STATUSES.includes(st.status)) errs.push(`step ${st.id}: bad status ${st.status}`)
    if (st.gate && !s.gates[st.gate]) errs.push(`step ${st.id}: unknown gate ${st.gate}`)
    if (st.workflow && !existsSync(join(ROOT, st.workflow))) errs.push(`step ${st.id}: workflow file missing ${st.workflow}`)
  }
  for (const st of s.steps) for (const d of st.deps) if (!ids.has(d)) errs.push(`step ${st.id}: unknown dep ${d}`)
  for (const [k, g] of Object.entries(s.gates)) if (!GATE_STATUSES.includes(g.status)) errs.push(`gate ${k}: bad status ${g.status}`)
  if (errs.length) { console.error('validate: FAIL\n' + errs.map(e => '  ' + e).join('\n')); process.exit(1) }
  console.log(`validate: OK (${s.steps.length} steps, ${Object.keys(s.gates).length} gates)`)
}

const args = parseArgs(process.argv.slice(2))
const cmds = { resume: cmdResume, next: cmdNext, step: cmdStep, gate: cmdGate, status: cmdStatus, blocker: cmdBlocker, set: cmdSet, get: cmdGet, log: cmdLog, scan: cmdScan, validate: cmdValidate }
const fn = cmds[args._[0]]
if (!fn) {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 17).map(l => l.replace(/^\/\/ ?/, '')).join('\n'))
  process.exit(args._[0] ? 2 : 0)
}
fn(args)
