---
name: Vercel manual deploy recipe
description: How the Northstar dashboard is redeployed to Vercel from this workspace
---

The Vercel site is NOT auto-updated. To push changes live:

1. Build: `PORT=4173 BASE_PATH=/ pnpm --filter @workspace/northstar-dashboard run build`
2. In a `"use impure"` CodeExecution block: read `dist/public/*` (root) and `artifacts/northstar-dashboard/vercel/api/*` (under `api/`) as base64, `listConnections("vercel")`, POST to `/v13/deployments` with `{ name: "northstar-business-dashboard", project: "prj_a3uii4W66lwwMCDuadfggCMxgGbQ", target: "production", files, projectSettings: { framework: null } }`, then poll `/v13/deployments/<id>` until READY.
3. Verify `https://northstar-business-dashboard.vercel.app/api/healthz` and that `index.html` references the new asset hash.

**Why:** shellExec base64 output gets truncated for large bundles — read files with fs inside the impure block instead. Asset filenames are hashed; list `dist/public` fresh each deploy.
