export const meta = {
  name: 'mig-sync-delta',
  description: 'One check-in: DNS/TLS state probe, additive delta sync Replit->Neon + verify, and health checks (used every P7/P8 check-in and for the P8.3 final audit)',
  whenToUse: 'Growmax Vercel migration P7.1 / P8.3 check-ins',
  phases: [
    { title: 'Check-in', detail: 'probe: DNS/TLS + health (haiku/low); full: + delta sync (sonnet/medium)' },
    { title: 'Audit', detail: 'final missing-row audit (sonnet/medium), only when args.finalAudit' },
  ],
}
const RESULT = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["pass", "fail", "blocked"] },
    summary: { type: "string" },
    evidenceFiles: { type: "array", items: { type: "string" } },
    facts: { type: "object" },
    issues: { type: "array", items: { type: "object", properties: { severity: { type: "string", enum: ["blocker", "major", "minor", "info"] }, description: { type: "string" }, ownerAction: { type: "string" } }, required: ["severity", "description"] } },
  },
  required: ["status", "summary", "evidenceFiles", "issues"],
}
const EV = "docs/migration/evidence"
const role = r => `Follow the role rules in .claude/agents/migration-${r}.md. `
const a = args || {}
const mode = a.mode || 'full'   // 'probe' = cheap hourly DNS/TLS/health only; 'full' = probe + delta sync (cadence: SPEC-05 §4)
if (!['probe', 'full'].includes(mode)) throw new Error('args.mode must be probe | full')
const ctx = `Check-in ${a.runLabel || ''}. Current cutover state: ${a.cutoverState || '(STATE.facts.cutover.state)'}; expected Vercel targets: ${JSON.stringify(a.dnsTarget || '(STATE.facts.dns.target)')}; authoritative NS: ${JSON.stringify(a.ns || '(STATE.facts.dns.ns)')}; GAP_START=${a.gapStart || '(STATE.sync.gapStart)'}; paths=${JSON.stringify(a.paths || {})}. `

const DNSPROMPT = `DNS/TLS + health probe per docs/migration/specs/SPEC-05-cutover-dns.md §3–§4 (read them). Use the two DoH resolvers from the container (dns.google, cloudflare-dns.com); authoritative NS only via the sandbox runner and only to confirm a SWITCHED transition. Check: project domain verification state; TXT _acme-challenge.www.growmax.io and _acme-challenge.growmax.io; www.growmax.io CNAME/A; growmax.io A. Determine the next state (DOMAIN_UNVERIFIED | WAITING_TXT | TXT_PRESENT | SWITCHED | PROPAGATING | PROPAGATED | ROLLED_BACK if www points back to 34.111.179.208 after SWITCHED). If www serves from Vercel, check the TLS cert (valid, SAN includes www.growmax.io, issuer, expiry). Health: GET /, /blog, one post, /sitemap.xml, /api/blog on ${a.healthBase || 'the production alias with the x-vercel-protection-bypass header (pre-cutover) or https://www.growmax.io (post-cutover)'} → expect 200. Return facts {dnsState, domainVerified, wwwAnswer, acmePresent, tls, health}. Write ${EV}/${a.step || 'P7.1'}-checkin-dns-${a.runLabel || 'x'}.json only if the state changed or health failed.`

phase('Check-in')
const [dns, sync] = await parallel(mode === 'probe' ? [
  () => agent(role('scout') + ctx + DNSPROMPT, { label: 'dns+health', phase: 'Check-in', model: 'haiku', effort: 'low', schema: RESULT }),
] : [
  () => agent(role('scout') + ctx + DNSPROMPT, { label: 'dns+health', phase: 'Check-in', model: 'haiku', effort: 'low', schema: RESULT }),
  () => agent(role('verifier') + ctx +
    `Run scripts/migration/db/sync.mjs delta then sync.mjs verify --below-gap${a.postCutover ? ' --exclude-target-newer' : ''} per docs/migration/specs/SPEC-03-data-migration.md §5 (additive only; watermarks in _migration.sync_state; source read-only; transport per paths.db; secrets only via env — never in a tool call). Return facts {inserted:{table:n}, updated:{table:n}, keyConflicts:{table:n}, lateCommits:{table:n}, targetDeleted:{table:n}, blogChanged, newestSourceRowAt, verifyMatch}. Write ${EV}/${a.step || 'P7.1'}-sync-delta-${a.runLabel || 'x'}.json only if any row moved, verify mismatched, or keyConflicts/lateCommits/targetDeleted > 0.`,
    { label: 'delta sync', phase: 'Check-in', model: 'sonnet', effort: 'medium', schema: RESULT }),
])

let audit = null
if (a.finalAudit) {
  phase('Audit')
  audit = await agent(role('verifier') + ctx +
    `Final reconciliation audit (VERIFICATION.md G8b checks 8b.2–8b.3, SPEC-03 §7): every source row with id < GAP_START must be reconciled — same id with equal hash, OR same id with target newer (blog_posts), OR matched by natural key, OR logged target_deleted in _migration.sync_log; report the timestamp of the newest source row and any unreconciled ids. Use fingerprint.mjs --rows (ids + hashes only). Write ${EV}/P8.3-final-audit.json.`,
    { label: 'final audit', phase: 'Audit', model: 'sonnet', effort: 'medium', schema: RESULT })
}
return { dns, sync, audit }
