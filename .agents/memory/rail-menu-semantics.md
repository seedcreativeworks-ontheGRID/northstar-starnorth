---
name: Rail menu semantics
description: Accessibility and state rules for the dashboard's rail-style compact navigation menu
---

The compact "Menu" dropdown in the dashboard header is a sidebar-rail layout: left tablist of 4 groups, right tabpanel with the active group's items.

Rules to preserve:
- Reset the active group to Quick Access every time the menu opens, so entry state is deterministic.
- Rail buttons are `role="tab"` with `aria-selected`, roving tabindex, and arrow-key/Home/End navigation; panels are `role="tabpanel"`.
- **Why:** a code review flagged stale active-group state and misuse of `aria-current` on a mutually-exclusive selector; tab semantics are the correct model.
- **How to apply:** keep Playwright locators using `getByRole("tab")` for rail groups; recent Chrome makes scrollable containers keyboard-focusable, so the tablist container needs `tabIndex={-1}` or the first Tab stop lands on the scroller.
