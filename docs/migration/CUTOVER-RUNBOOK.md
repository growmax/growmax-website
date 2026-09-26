# Cutover runbook: www.growmax.io → Vercel

> **TEMPLATE.** The orchestrator renders this file at step P6.5 with live values; every `{{…}}` gets replaced. Don't act on it while placeholders remain.
> Rendered: {{RENDERED_AT}} · Verified production deployment: {{DEPLOYMENT_URL}} (SHA {{VERIFIED_SHA}}) · Advisor A2: {{A2_VERDICT}}

## Before you start: conditions from the go/no-go review
{{A2_CONDITIONS}}

## What stays the same
Email (MX), SPF/DKIM/DMARC, Google/Microsoft verification TXT records — by name, `_dmarc.growmax.io` TXT and `google._domainkey.growmax.io` TXT — and **Replit's verification TXT record** (needed for rollback, at `www.growmax.io`). **Don't touch any record not listed below.**

DNS console: **{{DNS_PROVIDER}}** (Squarespace Domains, `domains.squarespace.com`). Nameservers: **{{NAMESERVERS}}** (Google Cloud DNS, `ns-cloud-a1.googledomains.com` .. `ns-cloud-a4.googledomains.com`).

## Step 0: lower the TTL (≥ 24 h before step B; skip if already done)
| Host | Type | Current value | Current TTL | Set TTL to |
|---|---|---|---|---|
| `www` | {{WWW_CURRENT_TYPE}} | {{WWW_CURRENT_VALUE}} | {{WWW_CURRENT_TTL}} | 300 |
{{APEX_TTL_ROW}}

**A2 TTL precondition** (`evidence/P6.3-ttl-precheck.json`, authoritative query against `ns-cloud-a1.googledomains.com`; DoH only shows remaining TTL, not the record's own value, so it isn't used for this check): {{TTL_PRECONDITION_STATUS}}. As last captured (P6.3, see that evidence file for the exact timestamp), the `www` A record's authoritative TTL was **14400 s**, not the required <= 300 s — re-check at render time, and if it's still above 300 s either lower it now and wait for it to take effect, or plan Step B for at least 14400 s (4 h) after Step 0.

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
2. Add: `www` **A** `{{WWW_RECOMMENDED_IPV4}}` (TTL 300)

This is an **A record, not a CNAME** — `www.growmax.io` also holds the Replit verification TXT record, and a CNAME can't coexist with any other record at the same name (Google Cloud DNS enforces this), so a CNAME here would either be rejected by the DNS console or force deleting the TXT the rollback path needs.

Traffic moves to Vercel as resolvers refresh, and both sites serve identical content in the meantime. Within the hour, the orchestrator detects the switch (authoritative `www` A == `{{WWW_RECOMMENDED_IPV4}}`), verifies the live site and starts reconciling data.

## Step C (RECOMMENDED): apex `growmax.io`
{{APEX_GUIDANCE}}

The P1.4 baseline already shows `https://growmax.io` 301-ing to `http://www.growmax.io` — that's SPEC-05's own criterion for doing this step, so do it unless you have a specific reason to leave the apex on Squarespace. If you skip it, say so; post-cutover checks compare the apex against today's baseline behavior instead of expecting it to point at Vercel.

## Check it yourself (optional)
```bash
dig +short www.growmax.io        # expect {{WWW_RECOMMENDED_IPV4}}
curl -sI https://www.growmax.io | head -5   # expect HTTP/2 200, a Vercel server header
```

## If anything looks wrong: roll back in minutes
1. At the DNS console (Squarespace Domains), delete the Vercel `www` **A** `{{WWW_RECOMMENDED_IPV4}}` record and restore **`www` A `34.111.179.208`** (TTL 300).
2. {{APEX_ROLLBACK}}
3. Replit is untouched and serves again straight away. Data written on Vercel in the meantime stays safe in Neon (details: `specs/SPEC-07-rollback.md`).
4. **TLS window:** Replit's certificate for `www.growmax.io` (Let's Encrypt) expires **2026-11-03** and can't renew via HTTP-01 once `www` points at Vercel. Rolling back **before 2026-11-03** is safe; rolling back **after** that date serves an invalid certificate on Replit until it re-issues (details: `specs/SPEC-07-rollback.md` R2). The Replit verification TXT record and the Replit custom domain stay in place until decommission either way, so rollback is always possible.

## During and after the cutover
- Content freeze in the Replit admin until 24 h after step B.
- Keep the Replit deployment running for ≥ 7 days after the orchestrator reports **G8 passed**. Then follow the decommission checklist in `FINAL-REPORT.md`.
- Keep the Replit verification TXT record and the Replit custom domain configured until decommission, regardless of how long after cutover that is.
- From now on, site changes go through GitHub → Vercel. Ask `@growmax/guardians` to merge PR {{PR_URL}}.
