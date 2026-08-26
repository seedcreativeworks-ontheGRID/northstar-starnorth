---
name: Dashboard persistence scope
description: Why the Northstar simulation keeps interaction state inside the current browser tab
---

The Northstar dashboard's simulated transfers, approvals, notifications, completed insight actions, active profile, and sign-out state live in browser `sessionStorage`, scoped to the current tab. State survives refreshes in that tab but is cleared when the session ends or the user signs out.

**Why:** The product is an honest interactive demo, not a banking system. Tab scope makes feedback and reload behavior realistic without implying permanent account changes or sharing simulation state between visitors.

**How to apply:** Keep demo mutations tab-scoped and clearly labeled as simulation. If product requirements change to include cross-device continuity, multi-user collaboration, or real banking activity, replace the session model with authenticated shared transactional storage and an audited backend.