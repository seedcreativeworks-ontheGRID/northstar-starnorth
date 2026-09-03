import assert from "node:assert/strict";
import crypto from "node:crypto";
import { cp, mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

let tempRoot;
let modulePath;

before(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), "northstar-rate-limit-"));
  const source = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../northstar-dashboard/vercel/api/_lib/rate-limit.js",
  );
  modulePath = path.join(tempRoot, "rate-limit.js");
  await cp(source, modulePath);
  await symlink(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../northstar-dashboard/node_modules",
    ),
    path.join(tempRoot, "node_modules"),
  );
});

after(async () => {
  if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
});

function freshRateLimit() {
  const require = createRequire(import.meta.url);
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath);
}

test("in-memory fallback throttles after 5 failures and resets on success", async () => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  const { isThrottled, retryAfterSeconds, recordFailure, clearFailures } = freshRateLimit();
  const key = `test-${crypto.randomUUID()}`;

  for (let i = 0; i < 4; i += 1) {
    await recordFailure(key);
    assert.equal(await isThrottled(key), false, `should not be throttled after ${i + 1} failures`);
  }
  await recordFailure(key);
  assert.equal(await isThrottled(key), true, "should be throttled after 5 failures");
  assert.ok((await retryAfterSeconds(key)) > 0, "retryAfterSeconds should be positive while throttled");

  await clearFailures(key);
  assert.equal(await isThrottled(key), false, "clearFailures should lift the throttle");
});

test("Redis path calls Upstash via the SDK and respects its returned counts", async (t) => {
  process.env.UPSTASH_REDIS_REST_URL = "https://fake-instance.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";

  const state = { count: 0 };
  const calls = [];

  // The SDK batches commands into POST {url}/pipeline with a JSON array of
  // [COMMAND, ...args] tuples, returning an array of { result } objects in
  // the same order -- rather than one endpoint per command.
  function runCommand([command, ...args]) {
    switch (command.toLowerCase()) {
      case "incr":
        state.count += 1;
        return { result: state.count };
      case "expire":
        return { result: 1 };
      case "get":
        return { result: state.count === 0 ? null : String(state.count) };
      case "ttl":
        return { result: state.count > 0 ? 900 : -2 };
      case "del":
        state.count = 0;
        return { result: 1 };
      default:
        throw new Error(`Unexpected Upstash command: ${command} ${JSON.stringify(args)}`);
    }
  }

  t.mock.method(globalThis, "fetch", async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    calls.push({ url, body: init?.body });
    if (!url.endsWith("/pipeline")) {
      throw new Error(`Unexpected Upstash call: ${url}`);
    }
    const commands = JSON.parse(init.body);
    const results = commands.map(runCommand);
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });

  const { isThrottled, retryAfterSeconds, recordFailure, clearFailures } = freshRateLimit();
  const key = `test-${crypto.randomUUID()}`;

  assert.equal(await isThrottled(key), false);
  for (let i = 0; i < 5; i += 1) {
    await recordFailure(key);
  }
  assert.equal(state.count, 5);
  assert.equal(await isThrottled(key), true, "should be throttled once Upstash reports 5 failures");
  assert.equal(await retryAfterSeconds(key), 900);

  await clearFailures(key);
  assert.equal(state.count, 0);
  assert.equal(await isThrottled(key), false);

  assert.ok(calls.length > 0, "expected the SDK to actually call fetch against the configured Upstash URL");
  assert.ok(
    calls.every((call) => call.url.startsWith(process.env.UPSTASH_REDIS_REST_URL)),
    "every Upstash call should target the configured UPSTASH_REDIS_REST_URL",
  );

  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});
