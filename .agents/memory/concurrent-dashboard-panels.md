---
name: Concurrent dashboard panels
description: Required desktop layout when Business Insights and Help & Support are open together.
---

When Business Insights and Help & Support are both open on desktop, render them as two independent side-by-side windows in the right rail. The dashboard must remain visible and contract to the left rather than being covered.

**Why:** The user explicitly asked to restore the earlier concurrent-panel implementation and rejected the version where the second panel appeared below the first.

**How to apply:** Preserve the horizontal two-panel rail at desktop widths, give each panel its own bounded scrolling region and visual frame, and reserve vertical stacking for narrower responsive layouts where two usable windows cannot fit.