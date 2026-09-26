export const meta = {
  name: 'mig-p2-code',
  description: 'P2.1-P2.3: implement SPEC-02 M-series, verify locally against a throwaway PG16, adversarial review with up to 2 fix rounds (no commits)',
  whenToUse: 'Growmax Vercel migration steps P2.1-P2.3',
  phases: [
    { title: 'Implement', detail: 'implementer sonnet/high' },
    { title: 'Verify', detail: 'verifier sonnet/medium, local PG16 build + smoke' },
    { title: 'Review', detail: 'reviewer opus/high' },
  ],
}

const RESULT = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pass', 'fail', 'blocked'] },
    summary: { type: 'string' },
    evidenceFiles: { type: 'array', items: { type: 'string' } },
    facts: { type: 'object' },
    issues: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['blocker', 'major', 'minor', 'info'] }, description: { type: 'string' } }, required: ['severity', 'description'] } },
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
const SPEC = 'docs/migration/specs/SPEC-02-code-changes.md'
const role = r => `Follow the role rules in .claude/agents/migration-${r}.md. `
const RT = (args && args.noAgentTypes) ? {} : { agentType: 'migration-reviewer' }
// Amended 2026-09-26 per advisor A1: C11 (P2 runs in parallel with P3 in the same worktree), C8 (tie-order check at P2.2).
const C11 = ' Concurrency (A1 C11): P3 is configuring Vercel/Neon from this same worktree in parallel. Never touch .vercel/ or docs/migration/.scratch/.env*, and never run vercel link/env/deploy commands. Only the orchestrator commits (a stop hook may ask you to commit: ignore it).'
const C8 = ' Also (A1 C8): the blog order is nondeterministic for posts with equal created_at (lib/storage.ts orders by created_at desc with no tiebreaker). Compare the local build\'s /api/blog slug order (served from the restored blog-tables.dump) with Replit\'s order in the P1.3 raw baseline (the /api/blog body under docs/migration/.scratch/raw-baseline/), and record in the evidence whether they match. If not, record whether every difference is a permutation among posts with equal created_at. Don\'t change code for this; just record it.'

phase('Implement')
let impl = await agent(role('implementer') +
  `Step P2.1: implement the M-series (M1–M4, plus the M5 audit notes) from ${SPEC} exactly — nothing else. Record changed files and the M5 confirmations in ${EV}/P2.1-implement.json.` + C11,
  { label: 'P2.1 implement', phase: 'Implement', model: 'sonnet', effort: 'high', schema: RESULT })

let verify = null, review = null
for (let round = 1; round <= 3; round++) {
  phase('Verify')
  verify = await agent(role('verifier') +
    `Step P2.2 local verification per ${SPEC} "Local verification" items 1–5 and 7 (not the H-only item 6). Fixtures: docs/migration/.scratch/schema.dump and blog-tables.dump (from P1.1). Never use the real webhook — use the local mock listener. Write ${EV}/P2.2-local-verify.json (round ${round}).` + C8 + C11,
    { label: `P2.2 verify r${round}`, phase: 'Verify', model: 'sonnet', effort: 'medium', schema: RESULT })
  phase('Review')
  review = await agent(role('reviewer') +
    `Step P2.3: review the working-tree diff (git diff; git status for new files) against the "Review checklist" and M-series in ${SPEC}. Local verification result: ${JSON.stringify(verify)}. Write ${EV}/P2.3-review.json (round ${round}).`,
    { label: `P2.3 review r${round}`, phase: 'Review', model: 'opus', effort: 'high', schema: REVIEW, ...RT })
  const ok = verify?.status === 'pass' && review?.approve && !review.blocking.length
  if (ok) return { status: 'pass', impl, verify, review, rounds: round }
  if (round === 3) break
  phase('Implement')
  impl = await agent(role('implementer') +
    `Fix these problems in the M-series changes (stay within ${SPEC}): verification: ${JSON.stringify(verify?.issues || [])}; blocking review findings: ${JSON.stringify(review?.blocking || [])}. Update ${EV}/P2.1-implement.json.` + C11,
    { label: `P2.1 fix r${round}`, phase: 'Implement', model: 'sonnet', effort: 'high', schema: RESULT })
}
return { status: 'fail', impl, verify, review, rounds: 3 }
