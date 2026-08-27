---
name: GitHub connector versus Git CLI
description: Distinguishes authenticated GitHub connector access from Git command-line HTTPS authentication in Replit.
---

The attached GitHub connector and the repository's Git HTTPS credential are separate authentication paths. A healthy or freshly reauthorized connector may support authenticated API writes while `git push` still rejects the stored HTTPS credential.

**Why:** Reauthorizing the GitHub connector did not repair Git command-line authentication, but the connector successfully created and verified an exact repository tree through GitHub's API.

**How to apply:** If an HTTPS push fails after one justified connector reauthorization, do not loop on reconnects. Use the authenticated GitHub API for a verified tree/commit update when appropriate, or have the repository's Git credential repaired through the platform.