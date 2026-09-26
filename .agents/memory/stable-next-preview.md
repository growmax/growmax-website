---
name: Stable Next.js preview
description: Why the visible Replit workflow uses a production Next.js server instead of development HMR.
---

Keep the user-visible workflow on `npm run start` against an already completed production build. Build separately while the workflow is stopped.

**Why:** Through the proxied preview, both development HMR and build-on-start workflows caused chunk failures. Build-on-start could leave an orphaned old server reading `.next` while a new process deleted and rebuilt it, so live pages referenced chunks that disappeared.

**How to apply:** Stop the visible workflow and confirm no orphaned Next processes remain, run the production build once, then start the workflow with `npm run start`. Never delete or rebuild `.next` while any Next server is using it.