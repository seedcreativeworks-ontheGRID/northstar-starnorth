---
name: Testing Vercel CommonJS handlers
description: How to execute the dashboard's Vercel handlers in Node integration tests despite the surrounding ESM package
---

The Vercel functions use CommonJS even though the dashboard package declares ESM. To execute the exact handler sources in Node tests, copy the function tree to a temporary directory outside the package scope and require the copied files there.

**Why:** Directly requiring the in-place `.js` handlers makes Node classify them as ESM because of the nearest package metadata, then fail on their CommonJS syntax. Renaming production handlers solely for tests risks changing Vercel routing behavior.

**How to apply:** Keep relative helper imports intact by copying the whole API tree. Load handlers only after test environment variables are set, and remove the temporary directory after the suite.