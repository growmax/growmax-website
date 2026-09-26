# Cutover runbook: www.growmax.io → Vercel

> **TEMPLATE.** The orchestrator renders this file at step P6.5 with live values; every `{{…}}` gets replaced. Don't act on it while placeholders remain.
> Rendered: {{RENDERED_AT}} · Verified production deployment: {{DEPLOYMENT_URL}} (SHA {{VERIFIED_SHA}}) · Advisor A2: {{A2_VERDICT}}

## Before you start: conditions from the go/no-go review
{{A2_CONDITIONS}}

## What stays the same
Email (MX), SPF/DKIM/DMARC, Google/Microsoft verification TXT records, and **Replit's verification TXT record** (needed for rollback). **Don't touch any record not listed below.**

DNS host detected: {{DNS_PROVIDER}} (nameservers: {{NAMESERVERS}}).

## Step 0: lower the TTL (≥ 24 h before step B; skip if already done)
| Host | Type | Current value | Set TTL to |
|---|---|---|---|
| `www` | {{WWW_CURRENT_TYPE}} | {{WWW_CURRENT_VALUE}} | 300 |
{{APEX_TTL_ROW}}

## Step A: pre-issue the TLS certificate (no traffic impact)
Add these TXT records:
| Host | Type | Value |
|---|---|---|
{{ACME_TXT_ROWS}}
{{VERCEL_VERIFY_TXT_ROWS}}

The orchestrator checks every hour. When it sees these records, it issues the certificate on Vercel, verifies it, and sends you **"certificate ready"**.

## Step B: switch `www` (the cutover)
Once you get "certificate ready":
1. Delete: `www` **A** `34.111.179.208`
2. Add: `www` **CNAME** `{{WWW_CNAME_TARGET}}` (TTL 300)

Traffic moves to Vercel as resolvers refresh, and both sites serve identical content in the meantime. Within the hour, the orchestrator detects the switch, verifies the live site and starts reconciling data.

## Step C (optional): apex `growmax.io`
{{APEX_GUIDANCE}}

## Check it yourself (optional)
```bash
dig +short www.growmax.io        # expect {{WWW_CNAME_TARGET}} / Vercel IPs
curl -sI https://www.growmax.io | head -5   # expect HTTP/2 200, a Vercel server header
```

## If anything looks wrong: roll back in minutes
1. Delete the `www` CNAME and restore **`www` A `34.111.179.208`** (TTL 300).
2. {{APEX_ROLLBACK}}
3. Replit is untouched and serves again straight away. Data written on Vercel in the meantime stays safe in Neon (details: `specs/SPEC-07-rollback.md`).

## During and after the cutover
- Content freeze in the Replit admin until 24 h after step B.
- Keep the Replit deployment running for ≥ 7 days after the orchestrator reports **G8 passed**. Then follow the decommission checklist in `FINAL-REPORT.md`.
- From now on, site changes go through GitHub → Vercel. Ask `@growmax/guardians` to merge PR {{PR_URL}}.
