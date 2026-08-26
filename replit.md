# Northstar Business Dashboard

A fictional-brand business finance dashboard for reviewing balances, transactions, approvals, reports, cash flow, transfers, support resources, and contextual insights.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/northstar-dashboard/src/` — dashboard application and interactive flows
- `artifacts/northstar-dashboard/src/components/dashboard/` — balances, activity, approvals, reports, insights, and transfers
- `artifacts/northstar-dashboard/src/index.css` — visual tokens and global theme

## Architecture decisions

- The first build is frontend-only and uses local state so every demonstrated dashboard interaction works without external services.
- The product uses an original Northstar identity and avoids real-bank logos, names, and official marks.

## Product

Users can review business accounts and cash flow, search and filter activity, fund an account through a validated transfer flow, approve or reject requests, download reports, use navigation and support menus, and explore contextual business insights.

## User preferences

- Keep all branding fictional; do not use official logos or bank marks.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
