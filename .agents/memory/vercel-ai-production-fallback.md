---
name: Vercel AI production fallback
description: Why the Vercel deployment has both AI Gateway and grounded local response paths.
---

Keep the Vercel Business Insights function’s grounded response path available even when the AI Gateway path is configured with project OIDC.

**Why:** The project-scoped Vercel OIDC token is valid, but AI Gateway rejects inference until the Vercel team has a verified payment card. A production deployment without the fallback leaves the visible chat returning 503.

**How to apply:** Attempt AI Gateway first and retain the bounded, profile-aware fallback for provider or account failures. If Vercel account verification later enables AI Gateway, confirm live generated replies but do not remove the fallback solely because one request succeeds.