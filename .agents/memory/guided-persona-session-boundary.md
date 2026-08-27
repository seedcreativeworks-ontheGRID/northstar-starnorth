---
name: Guided persona session boundary
description: Security boundary and persistence expectations for the guided Ben/James persona flow
---

Ben and James are presentation-only personas over the same fictional dashboard data and identical API permissions. Questionnaire-selected guided sessions lock their assigned persona, while direct-login sessions default to Ben and remain switchable between Ben and James.

**Why:** The demo deliberately uses stateless HMAC cookies and excludes persistent questionnaire state. Preventing deliberate replay of an overwritten pending bearer cookie would require shared server-side persistence without protecting additional data or permissions.

**How to apply:** Derive profile locking from the guided flow, not merely from the presence of a profile claim. Keep the guided switcher hidden, direct switcher available, current direct view stable across refresh checks, and logout reset intact. If personas ever gain different permissions or persistent data access, add shared revocable session state before treating the profile claim as an authorization boundary.