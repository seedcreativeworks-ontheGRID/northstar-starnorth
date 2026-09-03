---
name: Vercel Git deployment contract
description: Build scope and serverless-function layout required for automatic GitHub-to-Vercel deployments
---

Vercel deployments triggered from GitHub must use the dedicated dashboard build instead of the workspace-wide recursive build. Vercel serverless handlers must exist as committed files under the repository-root `api/` directory before the build starts.

**Why:** The recursive root build tried to compile Canvas-only tooling and failed because its preview-server environment was absent. A later attempt to generate root API files during the build produced a healthy frontend but no functions because Vercel discovers functions before that generated directory is collected.

**How to apply:** Keep the Vercel build command scoped to the Northstar dashboard with production `PORT` and `BASE_PATH` values. Keep root `api/` handlers synchronized with their tested source -- `artifacts/api-server/test/vercel-api-sync.integration.mjs` (run via `pnpm --filter @workspace/api-server run test:auth`) fails if the two trees diverge, so re-copy `artifacts/northstar-dashboard/vercel/api` over `api/` whenever either changes. After GitHub updates, require Vercel status `READY` and verify the production homepage, `/api/healthz`, and `/api/auth/session`. Root `vercel.json` also carries an SPA rewrite (`/((?!api/).*) -> /index.html`) so direct navigation to client-side routes doesn't 404.
