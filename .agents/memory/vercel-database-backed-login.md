---
name: Vercel database-backed login
description: How the Vercel login handler moved from env-var credential comparison to a real users table
---

`api/auth/login.js` (and its source at `artifacts/northstar-dashboard/vercel/api/`) no longer compares
against `NORTHSTAR_DEMO_USERNAME`/`PASSWORD`/`NORTHSTAR_GUIDED_USERNAME`/`PASSWORD` directly. It now looks
up a `users` row (`lib/db/src/schema/users.ts`: username, argon2id `password_hash`, `flow`, `profile`) via
`api/_lib/db.js` (plain `pg`, module-scope pooled connection, `max: 1`) and verifies with
`api/_lib/password.js` (`@node-rs/argon2`, constant-time-ish against a dummy hash when the username
doesn't exist, to avoid leaking which usernames are registered via response timing).

**Why:** SHA-256-compared env-var credentials are fast-hash, not slow-hash -- cheap to brute-force offline
if ever leaked -- and don't support per-user accounts. argon2id + a real users table is the standard fix.

**Before merging this to `main`, the live Vercel deployment WILL break on login** without these steps, in
order:
1. Provision Postgres (Neon free tier recommended) and set `DATABASE_URL` on the Vercel project -- use the
   **pooled** connection string (Neon's `-pooler` host), since each function instance opens its own
   connection.
2. `pnpm --filter db run push` against that `DATABASE_URL` to create the `users` table.
3. `pnpm --filter db run seed:users` (still reads `NORTHSTAR_DEMO_USERNAME`/`PASSWORD` and
   `NORTHSTAR_GUIDED_USERNAME`/`PASSWORD` from the environment, but only to hash and insert them once --
   those env vars are no longer read at login time and can be removed from the Vercel project after seeding
   if desired).

Login rate-limiting is now backed by Upstash Redis (`api/_lib/rate-limit.js`, `@upstash/redis`) instead of
an in-memory `Map` -- the old approach reset on every cold start and didn't share state across concurrent
function instances. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` on the Vercel project (free
tier); without them, `rate-limit.js` falls back to the same weak in-memory behavior automatically, so
nothing breaks if this is skipped -- it's a hardening step, not a hard requirement like `DATABASE_URL`.
This session's sandbox network blocks both `neon.tech` and `upstash.io` outright (org policy denial, not a
timeout), so the Redis path was validated by mocking `@upstash/redis`'s real HTTP pipeline calls rather than
against a live instance -- worth a real smoke test (5 wrong-password attempts, expect a 429) once deployed.

**How to apply:** Keep `api/_lib/db.js` and `artifacts/northstar-dashboard/vercel/api/_lib/db.js` (and
`password.js`) byte-identical -- `artifacts/api-server/test/vercel-api-sync.integration.mjs` enforces this.
`artifacts/api-server/test/vercel-auth.integration.mjs` now requires a real reachable `DATABASE_URL` to run
(creates a throwaway `users` table via `CREATE TABLE IF NOT EXISTS`, seeds two argon2-hashed test accounts,
deletes them in `after()`) -- point it at a local Postgres or a free-tier Neon branch, same as any other
`@workspace/db` consumer.
