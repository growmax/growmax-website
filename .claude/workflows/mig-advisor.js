export const meta = {
  name: 'mig-advisor',
  description: 'Migration advisor checkpoint (A1/A2/A3/A4): Fable 5.1 at max effort reviews evidence and returns a GO / GO_WITH_CONDITIONS / NO_GO verdict',
  whenToUse: 'Growmax Vercel migration advisor checkpoints only',
  phases: [{ title: 'Advise', detail: 'fable / max, read-only', model: 'fable' }],
}

const VERDICT = {
  type: 'object',
  properties: {
    checkpoint: { type: 'string', enum: ['A1', 'A2', 'A3', 'A4'] },
    verdict: { type: 'string', enum: ['GO', 'GO_WITH_CONDITIONS', 'NO_GO'] },
    conditions: { type: 'array', items: { type: 'string' } },
    risks: { type: 'array', items: { type: 'object', properties: { risk: { type: 'string' }, severity: { type: 'string', enum: ['high', 'medium', 'low'] }, mitigation: { type: 'string' } }, required: ['risk', 'severity'] } },
    planChanges: { type: 'array', items: { type: 'string' } },
    allowlistApprovals: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, field: { type: 'string' }, reason: { type: 'string' } }, required: ['url', 'field', 'reason'] } },
    rationale: { type: 'string' },
  },
  required: ['checkpoint', 'verdict', 'conditions', 'risks', 'rationale'],
}

const a = args || {}
if (!['A1', 'A2', 'A3', 'A4'].includes(a.checkpoint)) throw new Error('args.checkpoint must be A1|A2|A3|A4')

phase('Advise')
const verdict = await agent(
  `Act as the migration advisor defined in .claude/agents/migration-advisor.md (read it first and follow it exactly). ` +
  `Checkpoint: ${a.checkpoint}. Question from the orchestrator: ${a.question || '(standard checkpoint review)'}\n` +
  `Evidence files to review: ${JSON.stringify(a.evidenceFiles || [])}. Also read docs/migration/STATE.json and whatever plan/spec sections the checkpoint needs.\n` +
  `You are READ-ONLY: do not create or edit files, do not deploy, do not connect to databases. Return the verdict JSON only.`,
  { label: `advisor:${a.checkpoint}`, phase: 'Advise', model: 'fable', effort: 'max', schema: VERDICT },
)
return verdict
