import assert from "node:assert/strict";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { sameOrigin: vercelSameOrigin } = require(
  "../../northstar-dashboard/vercel/api/_lib/origin-policy.cjs",
);

const port = 19000 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;
const secret = crypto.randomBytes(32).toString("hex");
const username = `test-user-${crypto.randomUUID()}`;
const password = crypto.randomBytes(24).toString("base64url");
const guidedUsername = `guided-user-${crypto.randomUUID()}`;
const guidedPassword = crypto.randomBytes(24).toString("base64url");
const server = spawn("node", ["--enable-source-maps", "./dist/index.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(port),
    SESSION_SECRET: secret,
    NORTHSTAR_DEMO_USERNAME: username,
    NORTHSTAR_DEMO_PASSWORD: password,
    NORTHSTAR_GUIDED_USERNAME: guidedUsername,
    NORTHSTAR_GUIDED_PASSWORD: guidedPassword,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) break;
    try {
      const response = await request("/api/healthz");
      if (response.ok) return;
    } catch {
      // The listener is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  server.kill();
  throw new Error("API server did not start");
}

function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, options);
}

function loginBody(user = username, pass = password) {
  return JSON.stringify({ username: user, password: pass });
}

function originHeaders() {
  return { Origin: baseUrl, "Content-Type": "application/json" };
}

test.before(async () => {
  await waitForServer();
});

test.after(() => {
  server.kill();
});

test("auth sessions enforce origin, signatures, expiry, and logout", async () => {
  const missingOrigin = await request("/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: loginBody(),
  });
  assert.equal(missingOrigin.status, 403);

  const maliciousOrigin = await request("/api/auth/login", {
    method: "POST", headers: { ...originHeaders(), Origin: "https://attacker.invalid" }, body: loginBody(),
  });
  assert.equal(maliciousOrigin.status, 403);

  const invalid = await request("/api/auth/login", {
    method: "POST", headers: originHeaders(), body: loginBody(username, "not-the-password"),
  });
  assert.equal(invalid.status, 401);

  const login = await request("/api/auth/login", {
    method: "POST", headers: originHeaders(), body: loginBody(),
  });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Lax/);
  assert.match(setCookie, /Path=\//);
  assert.match(setCookie, /Secure/);
  const cookie = setCookie.split(";")[0];

  const session = await request("/api/auth/session", { headers: { Cookie: cookie } });
  assert.deepEqual(await session.json(), {
    authenticated: true,
    flow: "direct",
    profile: "ben",
    questionnaireRequired: false,
    profileLocked: false,
  });

  const noCookie = await request("/api/dashboard-state");
  assert.equal(noCookie.status, 401);
  const tampered = await request("/api/dashboard-state", { headers: { Cookie: `${cookie}x` } });
  assert.equal(tampered.status, 401);

  const expiredPayload = Buffer.from(JSON.stringify({ v: 1, exp: 1 })).toString("base64url");
  const expiredSignature = crypto.createHmac("sha256", secret).update(expiredPayload).digest("hex");
  const expired = await request("/api/dashboard-state", {
    headers: { Cookie: `northstar_demo_session=${expiredPayload}.${expiredSignature}` },
  });
  assert.equal(expired.status, 401);

  const logout = await request("/api/auth/logout", {
    method: "POST", headers: { Origin: baseUrl, Cookie: cookie },
  });
  assert.equal(logout.status, 200);
  assert.match(
    logout.headers.get("set-cookie"),
    /(?:Max-Age=0|Expires=Thu, 01 Jan 1970 00:00:00 GMT)/,
  );
});

test("guided credentials require questionnaire completion and persist the selected profile", async () => {
  const guidedLogin = await request("/api/auth/login", {
    method: "POST",
    headers: originHeaders(),
    body: loginBody(guidedUsername, guidedPassword),
  });
  assert.equal(guidedLogin.status, 200);
  assert.deepEqual(await guidedLogin.json(), {
    authenticated: true,
    flow: "guided",
    profile: null,
    questionnaireRequired: true,
  });
  const cookie = guidedLogin.headers.get("set-cookie").split(";")[0];

  const pendingSession = await request("/api/auth/session", { headers: { Cookie: cookie } });
  assert.deepEqual(await pendingSession.json(), {
    authenticated: true,
    flow: "guided",
    profile: null,
    questionnaireRequired: true,
    profileLocked: false,
  });
  assert.equal((await request("/api/dashboard-state", { headers: { Cookie: cookie } })).status, 401);

  const selected = await request("/api/auth/profile", {
    method: "POST",
    headers: { ...originHeaders(), Cookie: cookie },
    body: JSON.stringify({
      answers: {
        role: "executive",
        responsibility: "risk_oversight",
        authority: "final_authority",
        priority: "strategic_outlook",
      },
    }),
  });
  assert.equal(selected.status, 200);
  assert.deepEqual(await selected.json(), {
    authenticated: true,
    profile: "james",
    questionnaireRequired: false,
  });
  const selectedCookie = selected.headers.get("set-cookie").split(";")[0];
  const repeated = await request("/api/auth/profile", {
    method: "POST",
    headers: { ...originHeaders(), Cookie: selectedCookie },
    body: JSON.stringify({
      answers: {
        role: "accountant",
        responsibility: "reconciliation",
        authority: "prepare",
        priority: "reconcile_activity",
      },
    }),
  });
  assert.equal(repeated.status, 409);
  const restored = await request("/api/auth/session", { headers: { Cookie: selectedCookie } });
  assert.equal((await restored.json()).profile, "james");
  assert.equal((await request("/api/dashboard-state", { headers: { Cookie: selectedCookie } })).status, 200);

  const malformedLogin = await request("/api/auth/login", {
    method: "POST",
    headers: originHeaders(),
    body: loginBody(guidedUsername, guidedPassword),
  });
  const malformedCookie = malformedLogin.headers.get("set-cookie").split(";")[0];
  const malformed = await request("/api/auth/profile", {
    method: "POST",
    headers: { ...originHeaders(), Cookie: malformedCookie },
    body: JSON.stringify({
      answers: {
        role: "toString",
        responsibility: "reconciliation",
        authority: "prepare",
        priority: "reconcile_activity",
      },
    }),
  });
  assert.equal(malformed.status, 400);
});

test("failed logins are throttled per instance", async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await request("/api/auth/login", {
      method: "POST", headers: originHeaders(), body: loginBody(username, "wrong-password"),
    });
    assert.equal(response.status, 401);
  }
  const throttled = await request("/api/auth/login", {
    method: "POST", headers: originHeaders(), body: loginBody(username, "wrong-password"),
  });
  assert.equal(throttled.status, 429);
});

test("Vercel same-origin policy matches unsafe and safe request rules", () => {
  const baseHeaders = { host: "preview.example.test", "x-forwarded-proto": "https" };
  assert.equal(vercelSameOrigin({ method: "POST", headers: baseHeaders }), false);
  assert.equal(vercelSameOrigin({ method: "GET", headers: baseHeaders }), true);
  assert.equal(vercelSameOrigin({
    method: "POST",
    headers: { ...baseHeaders, origin: "https://preview.example.test" },
  }), true);
  assert.equal(vercelSameOrigin({
    method: "POST",
    headers: { ...baseHeaders, origin: "https://attacker.invalid" },
  }), false);
  assert.equal(vercelSameOrigin({
    method: "POST",
    headers: { ...baseHeaders, origin: "https://preview.example.test", "sec-fetch-site": "cross-site" },
  }), false);
});