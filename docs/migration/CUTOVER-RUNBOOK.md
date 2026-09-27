# Cutover runbook: www.growmax.io → Vercel

> Rendered: 2026-09-27T10:38Z (post-cutover, step P8.4) · Production deployment: `dpl_339kQmG3CM2dPKGjfNiDLZDpdkKx` serving https://www.growmax.io (SHA `dc5405357441870b9315a28a7cbb93a201278453`)
> Advisor A2: not held; the owner switched www at about 09:00Z before the go/no-go review; the post-cutover checks (G8a) and the final sign-off (A4) cover it.

## Status
| Step | Status | Evidence |
|---|---|---|
| Step 0: lower the TTL | **Done** for `www`: TTL 300 s verified at the authoritative NS `ns-cloud-a1.googledomains.com` at 2026-09-26T19:59:42Z. The 4 apex A records were still 14400 s then. | `STATE.json` facts.dns.ttlAfterOwnerChange; `evidence/P6.3-ttl-precheck.json` (14400 s before) |
| Step A: pre-issue the TLS certificate | **Not needed.** The ACME TXT records were never added; Vercel issued a Let's Encrypt certificate (issuer CN=YR1, SAN `www.growmax.io`) itself after DNS moved, valid until 2026-12-26T07:54:46Z; Vercel renews it automatically. | `evidence/P8.1-dns-tls-sandbox.json` |
| Step B: switch `www` | **Done by the owner at about 09:00Z** (switched between 08:50:40Z and 09:00:37Z): `www` A `216.150.1.1`, TTL 300, on all 4 authoritative nameservers. | `evidence/P8.1-dns-tls-sandbox.json` |
| Step C: apex `growmax.io` | **Open** (owner blocker B-APEX). The apex still points at Squarespace and `https://growmax.io` 301s to `http://www.growmax.io`. | `evidence/P8.2-suite-summary.json` |

## What stays the same
Email (MX), SPF/DKIM/DMARC, Google/Microsoft verification TXT records — by name, `_dmarc.growmax.io` TXT and `google._domainkey.growmax.io` TXT — and **Replit's verification TXT record** (needed for rollback, at `www.growmax.io`). **Don't touch any record not listed below.**

The apex holds 5 Google Workspace MX records (`aspmx.l.google.com` and `alt1`..`alt4.aspmx.l.google.com`) and the SPF TXT record `v=spf1 include:_spf.google.com ~all` (`evidence/P1.4-dns-baseline.json`). They stay exactly as they are.

DNS console: **Squarespace Domains** (`domains.squarespace.com`). Nameservers: **Google Cloud DNS**, `ns-cloud-a1.googledomains.com` .. `ns-cloud-a4.googledomains.com`.

## Step 0: lower the TTL (done for `www`)
| Host | Type | Value before the cutover | TTL before | TTL now |
|---|---|---|---|---|
| `www` | A | `34.111.179.208` | 14400 | 300 (verified 2026-09-26T19:59:42Z) |
| `@` (apex) | A ×4 | `198.185.159.144`, `198.185.159.145`, `198.49.23.144`, `198.49.23.145` | 14400 | 14400 (last checked 2026-09-26T19:59:42Z) |

The apex TTL no longer matters once Step C replaces those records; set the new apex records to TTL 300 if the console lets you.

## Step A: pre-issue the TLS certificate (not needed)
Skipped. Vercel issued the `www.growmax.io` certificate itself over HTTP-01 once `www` pointed at it (valid to 2026-12-26). It will do the same for `growmax.io` after Step C. **Don't add any `_acme-challenge` TXT records.**

## Step B: switch `www` (done)
Done by the owner at about 09:00Z. The current record is:
- `www` **A** `216.150.1.1` (TTL 300)

This is an **A record, not a CNAME** — `www.growmax.io` also holds the Replit verification TXT record, and a CNAME can't coexist with any other record at the same name (Google Cloud DNS enforces this), so a CNAME here would either be rejected by the DNS console or force deleting the TXT the rollback path needs.

**Optional:** add a second record `www` **A** `216.150.16.1` (TTL 300). Vercel recommends both IPs (`216.150.1.1` and `216.150.16.1`); one works, two add redundancy.

## Step C (open): apex `growmax.io`
Why: the old Squarespace forward sends `https://growmax.io` to `http://www.growmax.io`, an insecure hop that fails the post-cutover check G8a 8a.2. Vercel is already set up to answer `growmax.io` with a 308 redirect to `https://www.growmax.io` and issues the apex certificate itself.

Squarespace locks the apex DNS records while domain forwarding is active, which is why they can't be deleted from the DNS panel. Remove the forward first:
1. In the Squarespace domains dashboard, open **growmax.io → Website → Domain Forwarding**.
2. Click the red trash can next to the forward, re-authenticate, then click **Continue**.
3. Open **DNS settings**. The current apex (`@`) A records are Squarespace's:
   `198.185.159.144`, `198.185.159.145`, `198.49.23.144`, `198.49.23.145`.
   If any of them are still listed after the forward is gone, delete them.
4. Add two A records for `@`: **`216.150.1.1`** and **`216.150.16.1`** (TTL 300 if offered).
5. **Do NOT touch the MX records (Google Workspace email) or the TXT (SPF) record.**
6. Tell the orchestrator when done; it re-runs P8.1 and P8.2 for the apex.

Some visitors typing `growmax.io` may see errors for up to about 4 h (the old apex TTL is 14400 s); `www` is unaffected.

If you decide to leave the apex on Squarespace, say so: the advisor can then explicitly accept the pre-existing insecure hop at A4 instead.

## Check it yourself (optional)
```bash
dig +short www.growmax.io        # expect 216.150.1.1 (and 216.150.16.1 if you added it)
dig +short growmax.io            # after Step C: expect 216.150.1.1 and 216.150.16.1
curl -sI https://www.growmax.io | head -5   # expect HTTP/2 200, server: Vercel
curl -sI https://growmax.io | head -5       # after Step C: expect 308, location: https://www.growmax.io/
```

## If anything looks wrong: roll back
**Before any DNS rollback, fix Replit first.** As of 2026-09-27T09:55Z, Replit answers `www.growmax.io` with a 404 "This app isn't live yet" page on every URL checked (the deployment no longer serves the custom domain). A DNS-only rollback today would bring up that 404 page, not the old site. So:

1. In Replit, re-publish the deployment or re-link the custom domain `www.growmax.io`, and confirm it serves the site (for example `curl -sI --resolve www.growmax.io:443:34.111.179.208 https://www.growmax.io/` returns 200).
2. Then, at the DNS console (Squarespace Domains), delete the Vercel `www` **A** `216.150.1.1` record (and `216.150.16.1` if you added it) and restore **`www` A `34.111.179.208`** (TTL 300).
3. Apex: only if the apex had been moved in Step C, delete the `@` A records `216.150.1.1` and `216.150.16.1` and re-create the Squarespace forward `growmax.io` → `www.growmax.io` (Website → Domain Forwarding). If Step C was never done, leave the apex alone.
4. Data written on Vercel since the cutover (new demo requests, newsletter sign-ups, blog edits) stays in Neon. It is copied back to Replit only if you explicitly ask for that (details: `specs/SPEC-07-rollback.md`).
5. **TLS window:** Replit's certificate for `www.growmax.io` (Let's Encrypt) expires **2026-11-03** and can't renew via HTTP-01 once `www` points at Vercel. Rolling back **before 2026-11-03** is safe; rolling back **after** that date serves an invalid certificate on Replit until it re-issues (details: `specs/SPEC-07-rollback.md` R2). The Replit verification TXT record and the Replit custom domain stay in place until decommission either way, so rollback is always possible.

## During and after the cutover
- Content freeze in the Replit admin until 24 h after Step B, that is until about **2026-09-28T09:00Z**.
- Keep the Replit deployment running for ≥ 7 days after the orchestrator reports **G8 passed**. Then follow the decommission checklist in `FINAL-REPORT.md`.
- Keep the Replit verification TXT record and the Replit custom domain configured until decommission, regardless of how long after cutover that is.
- Before the PR merges or Replit redeploys from the new `main`, set `GOOGLE_CHAT_WEBHOOK_URL` in Replit Secrets; otherwise Replit's demo-request notifications stop silently (the webhook moved from code to an env var).
- From now on, site changes go through GitHub → Vercel. Ask `@growmax/guardians` to merge PR https://github.com/growmax/growmax-website/pull/1.

## Monitoring after the merge
**What runs.** `.github/workflows/uptime.yml` (workflow name "Uptime") runs every 15 minutes, at minutes 4, 19, 34 and 49 of each hour (offset from the top of the hour, when GitHub's scheduler is busiest), and on demand. Each run fetches, with a 20-second limit and one retry:
- `https://www.growmax.io/`, `/blog` and `/demo`: HTTP 200 and a `<title>` containing "Growmax";
- `/sitemap.xml`: HTTP 200, `<urlset` and the home page `<loc>`;
- `/robots.txt`: HTTP 200 and the `Sitemap: https://www.growmax.io/sitemap.xml` line;
- `/api/blog`: HTTP 200 and a non-empty JSON array whose entries all have a `slug`;
- one blog post: the first slug from `/api/blog` (so renaming a post can't cause a false alarm), HTTP 200, a Growmax `<title>` and its canonical link.

Every check runs even if an earlier one fails; the log prints one PASS or FAIL line per URL, and the run fails if any check failed. It only reads public pages and has no access to the database or to Vercel.

**When it starts.** Only after PR #1 is merged to `main`: GitHub runs scheduled workflows only from the default branch, and the **Run workflow** button (Actions tab → Uptime) appears only then. After the merge, click Run workflow once to confirm it passes.

**Who gets told.** GitHub emails failed runs to the workflow's owner; for a scheduled workflow that is the user who created the workflow or last changed its cron line. Check that your notifications are on: GitHub → Settings → Notifications → Actions. GitHub sends that email to one account only, and after the merge it may be whoever merged the PR. If more than one person should hear about an outage, or you are not sure the email reaches you, add the chat alert below.

**Optional chat alert.** If you want a message in a chat room too, create the repository secret `ALERT_WEBHOOK_URL`: repository Settings → Secrets and variables → Actions → New repository secret. For example a Google Chat incoming webhook URL. Create it yourself and never paste it anywhere else (not in chat, issues or files). When the secret exists, a failed run posts a short message naming the failed checks and linking the run. Without it, only the GitHub email is sent.

**Keep it alive.** GitHub disables scheduled workflows in public repositories after 60 days without repository activity. It emails a warning first; re-enable it from the Actions tab (Uptime → Enable workflow).

**Recommended owner settings (SPEC-06 §3):**
- Vercel: spend management and usage alerts.
- Neon: usage alerts for `growmax-db-iad1`.
- Optional: a Vercel log drain (Pro) and the Vercel Firewall bot-protection managed ruleset.
