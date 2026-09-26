export const meta = {
  name: 'mig-p6a-harden',
  description: 'P6.1: implement SPEC-02 H-series hardening, verify locally incl. H-only checks, adversarial review with up to 2 fix rounds (no commits)',
  whenToUse: 'Growmax Vercel migration step P6.1 (after G5)',
  phases: [
    { title: 'Implement', detail: 'implementer sonnet/high' },
    { title: 'Verify', detail: 'verifier sonnet/medium' },
    { title: 'Review', detail: 'reviewer opus/high' },
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
const REVIEW = {
  type: "object",
  properties: {
    approve: { type: "boolean" },
    blocking: { type: "array", items: { type: "object", properties: { file: { type: "string" }, issue: { type: "string" }, fix: { type: "string" } }, required: ["issue"] } },
    nonBlocking: { type: "array", items: { type: "object", properties: { file: { type: "string" }, issue: { type: "string" } }, required: ["issue"] } },
  },
  required: ["approve", "blocking"],
}
const SPEC = 'docs/migration/specs/SPEC-02-code-changes.md'

phase('Implement')
let impl = await agent(role('implementer') +
  `Step P6.1: implement the H-series (H1–H4) from ${SPEC} exactly — nothing else; M-series is already committed. Record changed files in ${EV}/P6.1-implement.json.`,
  { label: 'P6.1 implement', phase: 'Implement', model: 'sonnet', effort: 'high', schema: RESULT })
let verify = null, review = null
for (let round = 1; round <= 3; round++) {
  phase('Verify')
  verify = await agent(role('verifier') +
    `Step P6.1 local verification per ${SPEC} "Local verification" items 1–7 INCLUDING the H-only item 6 (cached post survives a DB stop; admin edit revalidates; /api/blog cached). Write ${EV}/P6.1-local-verify.json (round ${round}).`,
    { label: `P6.1 verify r${round}`, phase: 'Verify', model: 'sonnet', effort: 'medium', schema: RESULT })
  phase('Review')
  review = await agent(role('reviewer') +
    `Review the working-tree diff against the H-series and "Review checklist" in ${SPEC}; in particular prove no DB error can produce a cached 404 or generic title, and revalidation failures never break mutations. Verification: ${JSON.stringify(verify)}. Write ${EV}/P6.1-review.json (round ${round}).`,
    { label: `P6.1 review r${round}`, phase: 'Review', model: 'opus', effort: 'high', schema: REVIEW })
  if (verify?.status === 'pass' && review?.approve && !review.blocking.length) return { status: 'pass', impl, verify, review, rounds: round }
  if (round === 3) break
  phase('Implement')
  impl = await agent(role('implementer') +
    `Fix within ${SPEC} H-series: verification issues ${JSON.stringify(verify?.issues || [])}; blocking review findings ${JSON.stringify(review?.blocking || [])}.`,
    { label: `P6.1 fix r${round}`, phase: 'Implement', model: 'sonnet', effort: 'high', schema: RESULT })
}
return { status: 'fail', impl, verify, review, rounds: 3 }
