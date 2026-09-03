---
name: GitHub Pages cross-origin login
description: How the static GitHub Pages mirror got real, working login against the Vercel API
---

`seedcreativeworks-onthegrid.github.io/northstar-starnorth` calls the Vercel-hosted API cross-origin
instead of staying a static-only shell. This was an explicit, informed choice after the tradeoffs were
laid out (weaker CSRF posture, third-party-cookie blocking in some browsers, more surface area) -- not a
default anyone should reach for without re-reading those tradeoffs first.

**How it works:**
- `api/_lib/origin-policy.cjs`: `TRUSTED_CROSS_ORIGINS` is an explicit allowlist (currently just the
  github.io origin). `isAllowedOrigin()` replaces the old `sameOrigin()` gate everywhere; `corsHeaders()`
  returns `Access-Control-Allow-Origin`/`-Credentials` only for that allowlisted origin, `{}` for everyone
  else -- never a wildcard.
- Every handler now calls `handlePreflight()` (answers OPTIONS directly, before
  `rejectUnsupportedMethod` would reject it) and `applyCors()` at the top, before any other logic.
- The session cookie's `SameSite` is chosen per-request (`sameSiteFor()` in `_lib/auth.js`): `None` only
  when the request came from the trusted cross-origin, `Lax` for everything else -- a same-origin Vercel
  request never gets the relaxed cookie, so the primary site's CSRF posture is unchanged.
- `lib/api-client-react/src/custom-fetch.ts`: sets `credentials: "include"` automatically once
  `setBaseUrl()` is configured (fetch defaults to `"same-origin"`, which never sends cookies cross-site).
- `artifacts/northstar-dashboard/src/main.tsx` calls `setBaseUrl(import.meta.env.VITE_API_BASE_URL)`,
  which is only set by `build:pages` (root `package.json`) -- the Vercel build never sets it, so this is
  entirely inert there.

**Why the cookie split matters:** `SameSite=None` disables the browser's own CSRF backstop for that
cookie. Scoping it to only fire on requests that already passed the origin allowlist means the primary
site keeps `SameSite=Lax` (real protection) and only the one trusted mirror gets the relaxed cookie.

**Known, unfixable-from-here limitation:** Safari (ITP) and increasingly Chrome/Firefox restrict or block
third-party cookies by default. Even with everything above correct, some visitors to the GitHub Pages
mirror may see login silently fail to persist across the cross-origin request. This can only be observed
with real browsers against the real deployed site, not from this sandbox.

**How to apply / extend:** add any further trusted origin to `TRUSTED_CROSS_ORIGINS` in
`origin-policy.cjs` only -- every handler, the cookie logic, and CORS all key off that one set.
Keep `api/*` and `artifacts/northstar-dashboard/vercel/api/*` byte-identical as always
(`vercel-api-sync.integration.mjs` enforces this). Tested with a new case in
`vercel-auth.integration.mjs` covering: preflight response, a successful cross-origin login with
`SameSite=None`, a same-origin login in the same run still getting `SameSite=Lax`, and an origin *not* on
the allowlist still getting rejected with no CORS headers at all.
