import assert from "node:assert/strict";
import crypto from "node:crypto";
import { cp, mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { hash } from "@node-rs/argon2";
// Importing @workspace/db throws immediately if DATABASE_URL isn't set --
// this test needs a real (local or free-tier) Postgres to seed real,
// argon2-hashed users, since the Vercel login handler now checks the
// database instead of comparing against env-var credentials directly.
import { db, pool, usersTable } from "@workspace/db";

const username = `test-user-${crypto.randomUUID()}`;
const password = `test-password-${crypto.randomUUID()}`;
const guidedUsername = `guided-user-${crypto.randomUUID()}`;
const guidedPassword = `guided-password-${crypto.randomUUID()}`;
const configuredUsername = `configured-user-${crypto.randomUUID()}`;
const configuredPassword = `configured-password-${crypto.randomUUID()}`;
const configuredGuidedUsername = `configured-guided-user-${crypto.randomUUID()}`;
const configuredGuidedPassword = `configured-guided-password-${crypto.randomUUID()}`;
const sessionSecret = crypto.randomBytes(32).toString("hex");
const origin = "https://northstar-business-dashboard.vercel.app";
const trustedCrossOrigin = "https://seedcreativeworks-onthegrid.github.io";
const cookieName = "northstar_demo_session";

process.env.SESSION_SECRET = sessionSecret;
process.env.NORTHSTAR_DEMO_USERNAME = configuredUsername;
process.env.NORTHSTAR_DEMO_PASSWORD = configuredPassword;
process.env.NORTHSTAR_GUIDED_USERNAME = configuredGuidedUsername;
process.env.NORTHSTAR_GUIDED_PASSWORD = configuredGuidedPassword;

let tempRoot;
let handlers;

function responseMock() {
  return {
    statusCode: 200,
    headers: new Map(),
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers.set(name.toLowerCase(), value);
    },
    end(value) {
      this.body = value ? JSON.parse(value) : undefined;
    },
  };
}

function requestMock({
  method = "GET",
  headers = {},
  body,
  query = {},
} = {}) {
  return {
    method,
    body,
    query,
    headers: {
      host: "northstar-business-dashboard.vercel.app",
      "x-forwarded-proto": "https",
      ...headers,
    },
    socket: { remoteAddress: "127.0.0.1" },
  };
}

async function invoke(handler, request) {
  const response = responseMock();
  await handler(request, response);
  return response;
}

function expiredCookie() {
  const payload = Buffer.from(
    JSON.stringify({ v: 1, exp: Math.floor(Date.now() / 1000) - 60 }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("hex");
  return `${cookieName}=${payload}.${signature}`;
}

before(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      flow text NOT NULL,
      profile text,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `);
  await db.insert(usersTable).values([
    { username, passwordHash: await hash(password), flow: "direct", profile: "ben" },
    { username: guidedUsername, passwordHash: await hash(guidedPassword), flow: "guided", profile: null },
  ]);

  tempRoot = await mkdtemp(path.join(tmpdir(), "northstar-vercel-auth-"));
  const source = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../northstar-dashboard/vercel/api",
  );
  const apiRoot = path.join(tempRoot, "api");
  await cp(source, apiRoot, { recursive: true });
  // db.js and password.js require real packages (pg, @node-rs/argon2) --
  // symlink in the dashboard's node_modules so those resolve from the
  // isolated temp copy the same way they do in a real deployment.
  await symlink(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../northstar-dashboard/node_modules",
    ),
    path.join(tempRoot, "node_modules"),
  );
  const require = createRequire(import.meta.url);
  handlers = {
    login: require(path.join(apiRoot, "auth/login.js")),
    logout: require(path.join(apiRoot, "auth/logout.js")),
    session: require(path.join(apiRoot, "auth/session.js")),
    profile: require(path.join(apiRoot, "auth/profile.js")),
    dashboardState: require(path.join(apiRoot, "dashboard-state.js")),
    transfers: require(path.join(apiRoot, "transfers.js")),
    approval: require(path.join(apiRoot, "approvals/[approvalId].js")),
    insights: require(path.join(apiRoot, "insights/chat.js")),
  };
});

after(async () => {
  if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
  await pool.query("DELETE FROM users WHERE username = $1 OR username = $2", [username, guidedUsername]);
  await pool.end();
});

test("Vercel handlers enforce login, signed sessions, and logout", async () => {
  const missingOrigin = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      body: { username, password },
    }),
  );
  assert.equal(missingOrigin.statusCode, 403);

  const invalid = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin },
      body: { username, password: "incorrect" },
    }),
  );
  assert.equal(invalid.statusCode, 401);

  const login = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin },
      body: { username, password },
    }),
  );
  assert.equal(login.statusCode, 200);
  const setCookie = login.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  assert.match(setCookie, /SameSite=Lax/);
  assert.match(setCookie, /Max-Age=3600/);
  const cookie = setCookie.split(";")[0];

  const session = await invoke(
    handlers.session,
    requestMock({ headers: { cookie } }),
  );
  assert.deepEqual(session.body, {
    authenticated: true,
    flow: "direct",
    profile: "ben",
    questionnaireRequired: false,
    profileLocked: false,
  });

  const tampered = await invoke(
    handlers.session,
    requestMock({ headers: { cookie: `${cookie}0` } }),
  );
  assert.deepEqual(tampered.body, { authenticated: false });

  const expired = await invoke(
    handlers.session,
    requestMock({ headers: { cookie: expiredCookie() } }),
  );
  assert.deepEqual(expired.body, { authenticated: false });

  const logout = await invoke(
    handlers.logout,
    requestMock({ method: "POST", headers: { origin, cookie } }),
  );
  assert.equal(logout.statusCode, 200);
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/);
});

test("configured Vercel demo credentials remain valid without matching database rows", async () => {
  const direct = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin },
      body: { username: configuredUsername, password: configuredPassword },
    }),
  );
  assert.equal(direct.statusCode, 200);
  assert.equal(direct.body.flow, "direct");
  assert.equal(direct.body.profile, "ben");

  const guided = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin },
      body: {
        username: configuredGuidedUsername,
        password: configuredGuidedPassword,
      },
    }),
  );
  assert.equal(guided.statusCode, 200);
  assert.equal(guided.body.flow, "guided");
  assert.equal(guided.body.profile, null);
  assert.equal(guided.body.questionnaireRequired, true);
});

test("guided Vercel sessions select and restore a locked profile", async () => {
  const login = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin },
      body: { username: guidedUsername, password: guidedPassword },
    }),
  );
  assert.equal(login.statusCode, 200);
  assert.equal(login.body.questionnaireRequired, true);
  const cookie = login.headers.get("set-cookie").split(";")[0];

  const pendingProtected = await invoke(handlers.dashboardState, requestMock({ headers: { cookie } }));
  assert.equal(pendingProtected.statusCode, 401);

  const profile = await invoke(
    handlers.profile,
    requestMock({
      method: "POST",
      headers: { origin, cookie },
      body: {
        answers: {
          role: "accountant",
          responsibility: "reconciliation",
          authority: "prepare",
          priority: "investigate_variances",
        },
      },
    }),
  );
  assert.equal(profile.statusCode, 200);
  assert.equal(profile.body.profile, "ben");
  const selectedCookie = profile.headers.get("set-cookie").split(";")[0];
  const repeated = await invoke(
    handlers.profile,
    requestMock({
      method: "POST",
      headers: { origin, cookie: selectedCookie },
      body: {
        answers: {
          role: "executive",
          responsibility: "risk_oversight",
          authority: "final_authority",
          priority: "strategic_outlook",
        },
      },
    }),
  );
  assert.equal(repeated.statusCode, 409);
  const restored = await invoke(handlers.session, requestMock({ headers: { cookie: selectedCookie } }));
  assert.equal(restored.body.profile, "ben");
  assert.equal(restored.body.profileLocked, true);

  const secondLogin = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin },
      body: { username: guidedUsername, password: guidedPassword },
    }),
  );
  const secondCookie = secondLogin.headers.get("set-cookie").split(";")[0];
  const malformed = await invoke(
    handlers.profile,
    requestMock({
      method: "POST",
      headers: { origin, cookie: secondCookie },
      body: {
        answers: {
          role: "toString",
          responsibility: "reconciliation",
          authority: "prepare",
          priority: "reconcile_activity",
        },
      },
    }),
  );
  assert.equal(malformed.statusCode, 400);
});

test("every protected Vercel handler rejects missing and invalid sessions", async () => {
  const cases = [
    [handlers.dashboardState, requestMock()],
    [
      handlers.transfers,
      requestMock({ method: "POST", headers: { origin }, body: { amount: 10 } }),
    ],
    [
      handlers.approval,
      requestMock({
        method: "PATCH",
        headers: { origin },
        body: { status: "approved" },
        query: { approvalId: "approval-1" },
      }),
    ],
    [
      handlers.insights,
      requestMock({
        method: "POST",
        headers: { origin },
        body: { message: "test" },
      }),
    ],
  ];

  for (const [handler, request] of cases) {
    const missing = await invoke(handler, request);
    assert.equal(missing.statusCode, 401);

    const tampered = await invoke(handler, {
      ...request,
      headers: { ...request.headers, cookie: `${cookieName}=tampered.value` },
    });
    assert.equal(tampered.statusCode, 401);

    const expired = await invoke(handler, {
      ...request,
      headers: { ...request.headers, cookie: expiredCookie() },
    });
    assert.equal(expired.statusCode, 401);
  }
});

test("unsafe Vercel handlers reject cross-origin requests with valid sessions", async () => {
  const login = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin },
      body: { username, password },
    }),
  );
  const cookie = login.headers.get("set-cookie").split(";")[0];

  const crossOrigin = await invoke(
    handlers.transfers,
    requestMock({
      method: "POST",
      headers: { cookie, origin: "https://attacker.example" },
      body: { amount: 10 },
    }),
  );
  assert.equal(crossOrigin.statusCode, 403);
});

test("the trusted GitHub Pages origin gets CORS + a cross-site cookie; every other cross-origin caller still doesn't", async () => {
  const preflight = await invoke(
    handlers.login,
    requestMock({
      method: "OPTIONS",
      headers: { origin: trustedCrossOrigin, "sec-fetch-site": "cross-site" },
    }),
  );
  assert.equal(preflight.statusCode, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), trustedCrossOrigin);
  assert.equal(preflight.headers.get("access-control-allow-credentials"), "true");

  const login = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin: trustedCrossOrigin, "sec-fetch-site": "cross-site" },
      body: { username, password },
    }),
  );
  assert.equal(login.statusCode, 200);
  assert.equal(login.headers.get("access-control-allow-origin"), trustedCrossOrigin);
  const setCookie = login.headers.get("set-cookie");
  assert.match(setCookie, /SameSite=None/);
  assert.match(setCookie, /Secure/);
  const cookie = setCookie.split(";")[0];

  // The same session, read back cross-origin, still works and still
  // carries CORS headers so the browser lets the page read the response.
  const session = await invoke(
    handlers.session,
    requestMock({ headers: { cookie, origin: trustedCrossOrigin, "sec-fetch-site": "cross-site" } }),
  );
  assert.equal(session.body.authenticated, true);
  assert.equal(session.headers.get("access-control-allow-origin"), trustedCrossOrigin);

  // A same-origin follow-up request for the *same* logged-in user gets the
  // stronger SameSite=Lax cookie, not the relaxed one -- the relaxation is
  // per-request, not something that leaks into ordinary Vercel usage.
  const sameOriginLogin = await invoke(
    handlers.login,
    requestMock({ method: "POST", headers: { origin }, body: { username, password } }),
  );
  assert.match(sameOriginLogin.headers.get("set-cookie"), /SameSite=Lax/);

  // An origin that isn't the allowlisted one is still rejected outright,
  // and critically gets no CORS headers at all -- this isn't a wildcard.
  const untrusted = await invoke(
    handlers.login,
    requestMock({
      method: "POST",
      headers: { origin: "https://random-attacker.example", "sec-fetch-site": "cross-site" },
      body: { username, password },
    }),
  );
  assert.equal(untrusted.statusCode, 403);
  assert.equal(untrusted.headers.get("access-control-allow-origin"), undefined);
});