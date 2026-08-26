---
name: Dashboard profile parity
description: The interaction and data expectations for the Ben and James dashboard toggle.
---

Treat Ben and James as distinct dashboard views with profile-specific insights, balances, activity presentation, and greetings. Keep the underlying controls and workflows equally functional in both views.

**Why:** The user explicitly expects clicking James to produce a visibly different dashboard while carrying over all of the working interactions available in the Ben experience.

**How to apply:** Build shared behavior in reusable components or shared state, then supply profile-specific content and layout where needed. Test new dashboard interactions in both profile states before shipping.