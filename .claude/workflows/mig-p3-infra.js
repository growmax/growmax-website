export const meta = {
  name: 'mig-p3-infra',
  description: 'P3.1-P3.5: Vercel project + settings + ignore guard, Neon via Vercel Marketplace, sensitive env vars via stdin, protection bypass, then independent read-back',
  whenToUse: 'Growmax Vercel migration steps P3.1-P3.5',
  phases: [
    { title: 'Provision', detail: 'implementer sonnet/high, sequential' },
    { title: 'Read-back', detail: 'scout haiku/low, independent (G3)' },
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
// Amended 2026-09-26 per advisor A1 conditions C1 (new Neon resource), C3 (settings + guard-before-Git) and C11 (P2 || P3).
const ctx = `Config: team slug growmax1 (id ${a.teamId || 'team_r7yanNuXwyp3P3jzhnxkDNaD'}), region iad1, source PG major=${a.pgMajor || '(see STATE.facts.source.pgMajor)'}, control plane=${a.vercelApi || '(see STATE.facts.paths.vercelApi)'}. ` +
  `Project growmax-website ALREADY EXISTS (prj_nSpDPuYWavGmtXm4nmcwiVWWgVXu): it was created bare and unlinked at P1 only to host the Sandbox growmax-migration-runner. Reuse it (SPEC-01 §2 step 1) and never delete that Sandbox. ` +
  `Neon (A1 C1, binding; it supersedes the 'adopt rapid-recipe-07132564' text; see the 2026-09-26 addendum at the top of SPEC-01 §3): PROVISION A NEW Neon resource through the Vercel Marketplace on the existing Neon installation icfg_tEtDWAPJTdmHAD8eL9GtfV5H, which is already on plan launch_v3 (owner-authorized): --name growmax-db-iad1, region metadata = the iad1 / us-east-1 value read from \`npx --yes vercel@latest integration add neon --help\`, no -m version flag, Neon Auth off, -e production only, --no-env-pull. If the CLI shows any purchase or plan-change confirmation other than the already-applied launch_v3, stop and return status "blocked" with the exact prompt text; never choose free. Never delete, modify, connect or pull env from the owner's sin1 resource store_IsJjgV1qX1w7nvrP / rapid-recipe-07132564 (also named growmax-website). A target PG major >= 16 is accepted (A1 C2); record pgVersion from the Neon side. ` +
  `Project settings (A1 C3): functionDefaultRegions must equal the Neon resource region (iad1); nodeVersion 22.x (the bare project is on 24.x); framework nextjs; fluid on; skew protection on (team is Pro). Set commandForIgnoringBuildStep and read it back byte-exact BEFORE connecting Git (vercel git connect / create_git_project link); record that ordering with timestamps in ${EV}/P3.1-project.json. ` +
  `Concurrency (A1 C11): P2 is editing app code in this same worktree right now. Touch no source, package or lockfile. .vercel/ is gitignored. Env pulls go only into docs/migration/.scratch/. For P3.3 take the Google Chat webhook URL from \`git show origin/main:app/api/demo-requests/route.ts\` (never the working tree), pass it via stdin, never print it. Only the orchestrator commits. `

phase('Provision')
const prov = await agent(role('implementer') + ctx +
  `Steps P3.1–P3.4 exactly per docs/migration/specs/SPEC-01-infrastructure.md §1–§5 (read it fully), in order, idempotently (read first, create only if missing, converge settings). Secrets only via env/stdin; never print values; never use --token in argv; never put a secret value in an MCP tool call (use the CLI with stdin, not mcp__Vercel__create_project_env, for secret values). Production target only (no preview). Prove \`vercel env pull --environment=production docs/migration/.scratch/.env.production\` yields pooled + unpooled target URLs (record hosts only). If Neon provisioning needs an interactive terms acceptance, return status "blocked" with ownerAction for B-NEON-TERMS but still finish P3.1, P3.3, P3.4. Write ${EV}/P3.1-project.json, ${EV}/P3.2-neon.json, ${EV}/P3.3-env.json (names/targets/types only), ${EV}/P3.4-bypass.json (never the secret; store it only in docs/migration/.scratch/bypass-secret mode 600). Return facts {vercel:{projectId, projectName, deployMode, productionAliases}, neon:{resourceName, resourceId, region, pgVersion, plan, pooledHost, unpooledHost}}.`,
  { label: 'P3.1-3.4 provision', phase: 'Provision', model: 'sonnet', effort: 'high', schema: RESULT })

phase('Read-back')
const readback = await agent(role('scout') +
  `Step P3.5: independently read back the Vercel/Neon configuration (Vercel MCP tools via ToolSearch and/or \`npx --yes vercel@latest project inspect growmax-website\`, \`vercel env ls production\`, \`vercel env ls preview\`) and check EVERY item of docs/migration/specs/SPEC-01-infrastructure.md §8 (including the production-only ignore guard and that the env pull yields target URLs — hosts only). Do not trust the provisioning report: ${JSON.stringify(prov?.facts || {})}. Env var values must never be printed. Assert explicitly (A1 C3): functionDefaultRegions equals the connected Neon resource's region (iad1); nodeVersion 22.x; framework nextjs; fluid on; skew protection on; P3.1-project.json shows the ignore-step command read back byte-exact BEFORE Git was connected; the connected Neon resource is growmax-db-iad1 (not store_IsJjgV1qX1w7nvrP), production only, and its hosts are in us-east-1. Write ${EV}/P3.5-infra-readback.json with one check per §8 bullet, in the standard evidence shape (status, checkedAt from date -u, verifier, checks[] with pass booleans).`,
  { label: 'P3.5 read-back', phase: 'Read-back', model: 'haiku', effort: 'low', schema: RESULT })
return { provision: prov, readback }
