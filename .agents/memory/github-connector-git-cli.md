---
name: GitHub connector versus Git CLI
description: Distinguishes authenticated GitHub connector access from Git command-line HTTPS authentication in Replit.
---

The attached GitHub connector and the repository's Git HTTPS credential are separate authentication paths. A healthy or freshly reauthorized connector may support authenticated API writes while `git push` still rejects the stored HTTPS credential.

**Why:** Reauthorizing the GitHub connector did not repair Git command-line authentication, but the connector successfully created and verified an exact repository tree through GitHub's API.

**How to apply:** If HTTPS push authentication is unavailable, create local safety refs and require a clean tree. Use the authenticated GitHub API with the current remote commit as the non-force parent, verify the candidate and final tree SHA against local, require the Vercel release gate to pass, then fetch and align local `main` to `github/main`. Never force-push or reset across different trees.