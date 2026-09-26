export const meta = {
  name: 'mig-p1-discovery',
  description: 'P1.1-P1.5 discovery: source DB inventory/fingerprints, parity harness build + mutation self-test + adversarial review, live baseline, DNS baseline, code audit',
  whenToUse: 'Growmax Vercel migration steps P1.1-P1.5 (A1 advisor runs separately via mig-advisor)',
  phases: [
    { title: 'Discover', detail: 'DB inventory (sonnet/high), harness (sonnet/high + opus/high review), DNS (haiku/low), audit (sonnet/medium)' },
    { title: 'Baseline', detail: 'capture live site with the reviewed harness (haiku/low) + verify (sonnet/medium)' },
  ],
}

const RESULT = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pass', 'fail', 'blocked'] },
    summary: { type: 'string' },
    evidenceFiles: { type: 'array', items: { type: 'string' } },
    facts: { type: 'object' },
    issues: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['blocker', 'major', 'minor', 'info'] }, description: { type: 'string' }, ownerAction: { type: 'string' } }, required: ['severity', 'description'] } },
  },
  required: ['status', 'summary', 'evidenceFiles', 'issues'],
}
const REVIEW = {
  type: 'object',
  properties: {
    approve: { type: 'boolean' },
    blocking: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, issue: { type: 'string' }, fix: { type: 'string' } }, required: ['issue'] } },
    nonBlocking: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, issue: { type: 'string' } }, required: ['issue'] } },
  },
  required: ['approve', 'blocking'],
}
const EV = 'docs/migration/evidence'
const a = args || {}
const paths = a.paths || {}
const only = a.only || ['P1.1', 'P1.2', 'P1.3', 'P1.4', 'P1.5']
const role = r => `Follow the role rules in .claude/agents/migration-${r}.md. `
const runnerNote = `Network paths decided in P0 (facts.paths): ${JSON.stringify(paths)}. If db=="sandbox" run DB work in the Vercel Sandbox runner per docs/migration/specs/SPEC-01-infrastructure.md §7; if web=="sandbox" run HTTP captures there. `

phase('Discover')
const tasks = {
  'P1.1': () => agent(role('db-operator') + runnerNote +
    `Step P1.1 per docs/migration/specs/SPEC-03-data-migration.md §1 and §3 (read both). Implement scripts/migration/db/{lib,inventory,fingerprint,schema-diff,sync}.mjs exactly per §1/§5 (Node 22 ESM, only the pg package; sync.mjs must enforce every §0 invariant and guard). Then, READ-ONLY against $REPLIT_DATABASE_URL: run inventory + fingerprint, write ${EV}/P1.1-source-inventory.json and ${EV}/P1.1-source-fingerprint.json (counts/md5 only), produce the no-PII fixtures docs/migration/.scratch/schema.dump and docs/migration/.scratch/blog-tables.dump in the container, and export the public DB redirect list (old_path,new_path) to ${EV}/P1.1-db-redirects.json. Compute GAP_START = max(1000000, 10*max id) and return it in facts.gapStart, plus facts.source {pgMajor, hostKind, tables, maxIds, extensions, extraTables}. Self-test sync.mjs guards against a throwaway local PG16 (see SPEC-02 local PG recipe) — never against the real source or Neon.`,
    { label: 'P1.1 db inventory', phase: 'Discover', model: 'sonnet', effort: 'high', schema: RESULT }),
  'P1.2': async () => {
    let built = await agent(role('implementer') + runnerNote +
      `Step P1.2: build the parity harness exactly per docs/migration/specs/SPEC-04-verification.md §1–§5 (read it fully): scripts/migration/package.json (+ lockfile via npm install inside scripts/migration), parity/{urls,capture,compare,selftest}.mjs, functional/run.mjs, visual/run.mjs, perf/run.mjs. Use NODE_USE_ENV_PROXY=1 for fetch in the container. Run selftest.mjs against the live site (or via the sandbox if web=="sandbox") and write ${EV}/P1.2-harness-selftest.json. Every mutation in §5.2 must be detected; determinism check must pass.`,
      { label: 'P1.2 build harness', phase: 'Discover', model: 'sonnet', effort: 'high', schema: RESULT })
    for (let round = 1; round <= 3; round++) {
      const review = await agent(role('reviewer') +
        `Adversarially review the parity harness (scripts/migration/parity, functional, visual, perf) against docs/migration/specs/SPEC-04-verification.md, and the self-test evidence ${EV}/P1.2-harness-selftest.json. Core question: can it PASS while www.growmax.io and the Vercel deployment differ in a way users or search engines would notice? Also review scripts/migration/db/*.mjs against SPEC-03 §0/§5 if present. Write your verdict to ${EV}/P1.2-harness-review.json (round ${round}).`,
        { label: `P1.2 review r${round}`, phase: 'Discover', model: 'opus', effort: 'high', schema: REVIEW })
      if (!review) return { status: 'fail', summary: 'reviewer returned nothing', evidenceFiles: [], issues: [{ severity: 'blocker', description: 'harness review missing' }] }
      if (review.approve && !review.blocking.length) return { ...built, status: built?.status === 'pass' ? 'pass' : 'fail', facts: { ...(built?.facts || {}), reviewRounds: round } }
      if (round === 3) return { status: 'fail', summary: 'harness still has blocking review findings after 2 fix rounds', evidenceFiles: [`${EV}/P1.2-harness-review.json`], issues: review.blocking.map(b => ({ severity: 'blocker', description: `${b.file || ''} ${b.issue}` })) }
      built = await agent(role('implementer') +
        `Fix these blocking review findings in the parity harness, then re-run selftest.mjs and rewrite ${EV}/P1.2-harness-selftest.json: ${JSON.stringify(review.blocking)}`,
        { label: `P1.2 fix r${round}`, phase: 'Discover', model: 'sonnet', effort: 'high', schema: RESULT })
    }
  },
  'P1.4': () => agent(role('scout') + runnerNote +
    `Step P1.4 DNS/TLS baseline. Using DNS-over-HTTPS (curl 'https://dns.google/resolve?name=NAME&type=TYPE') or dig in the sandbox, record for growmax.io and www.growmax.io: NS, SOA, A, AAAA, CNAME, MX, TXT, CAA; identify the DNS provider from NS. Also record apex/www HTTP behavior: curl -sI for http://growmax.io/, https://growmax.io/, http://www.growmax.io/, https://www.growmax.io/ (status, location, server), and the current TLS cert issuer/subject/SANs/expiry for www.growmax.io and growmax.io (openssl s_client -servername ... or curl -v). Write ${EV}/P1.4-dns-baseline.json and return facts.dns {provider, ns, wwwRecords, apexRecords, apexBehavior}.`,
    { label: 'P1.4 dns baseline', phase: 'Discover', model: 'haiku', effort: 'low', schema: RESULT }),
  'P1.5': () => agent(role('verifier') +
    `Step P1.5 code compatibility audit (read-only). Read docs/migration/specs/SPEC-02-code-changes.md, then audit the app (app/, lib/, components/, middleware.ts, next.config.ts, package.json) for anything that behaves differently on Vercel (serverless/Fluid, Edge middleware, build-time env/DB needs, fire-and-forget promises, filesystem writes, long-running timers, in-memory state, hardcoded hosts/ports, secrets in code). Confirm or refute each M/H item and list anything missing with file:line. Write ${EV}/P1.5-code-audit.json.`,
    { label: 'P1.5 code audit', phase: 'Discover', model: 'sonnet', effort: 'medium', schema: RESULT }),
}
const discovered = {}
await parallel(Object.keys(tasks).filter(k => only.includes(k)).map(k => async () => { discovered[k] = await tasks[k]() }))

phase('Baseline')
let baseline = null
const ready = discovered['P1.2']?.status === 'pass' && (discovered['P1.1']?.status === 'pass' || !only.includes('P1.1'))
if (only.includes('P1.3') && ready) {
  const cap = await agent(role('scout') + runnerNote +
    `Step P1.3: capture the live-site baseline with the reviewed harness. Run parity/urls.mjs (sitemap from https://www.growmax.io, config redirects, DB redirects from ${EV}/P1.1-db-redirects.json, special/negative routes per SPEC-04 §2) → ${EV}/P1.3-url-inventory.json; then parity/capture.mjs --base https://www.growmax.io → manifest ${EV}/P1.3-baseline-manifest.json (compact, no raw bodies; raw bodies to docs/migration/.scratch/raw-baseline). Report URL counts per source and any URL whose retries were exhausted.`,
    { label: 'P1.3 capture', phase: 'Baseline', model: 'haiku', effort: 'low', schema: RESULT })
  baseline = await agent(role('verifier') +
    `Verify the P1.3 baseline against docs/migration/VERIFICATION.md check 1.4: ≥250 URLs (or explained shortfall), 0 exhausted retries, every sitemap URL present, every config redirect source present, every DB redirect present. Capture result: ${JSON.stringify(cap)}. Write ${EV}/P1.3-baseline-summary.json.`,
    { label: 'P1.3 verify', phase: 'Baseline', model: 'sonnet', effort: 'medium', schema: RESULT })
} else if (only.includes('P1.3')) {
  log('P1.3 skipped: harness or DB inventory did not pass')
}
return { discovered, baseline }
