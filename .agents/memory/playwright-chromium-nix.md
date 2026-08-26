---
name: Playwright Chromium on Nix
description: Browser runtime dependency needed for Playwright regression tests in this workspace.
---

Treat the explicit `libgbm` Nix package as a required Chromium runtime dependency alongside `mesa`.

**Why:** Installing `mesa` still left `libgbm.so.1` unresolved, so Chromium exited before any browser test could reach the application.

**How to apply:** Retain both packages when updating Playwright or the browser runtime unless the underlying Nix image is confirmed to provide `libgbm.so.1` through another dependency.