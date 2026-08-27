import assert from "node:assert/strict";
import crypto from "node:crypto";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

const username = `test-user-${crypto.randomUUID()}`;
const password = `test-password-${crypto.randomUUID()}`;
const guidedUsername = `guided-user-${crypto.randomUUID()}`;
const guidedPassword = `guided-password-${crypto.randomUUID()}`;
const sessionSecret = crypto.randomBytes(32).toString("hex");
const origin = "https://northstar-business-dashboard.vercel.app";
const cookieName = "northstar_demo_session";

process.env.NORTHSTAR_DEMO_USERNAME = username;
process.env.NORTHSTAR_DEMO_PASSWORD = password;
process.env.NORTHSTAR_GUIDED_USERNAME = guidedUsername;
process.env.NORTHSTAR_GUIDED_PASSWORD = guidedPassword;
process.env.SESSION_SECRET = sessionSecret;

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
  tempRoot = await mkdtemp(path.join(tmpdir(), "northstar-vercel-auth-"));
  const source = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../northstar-dashboard/vercel/api",
  );
  const apiRoot = path.join(tempRoot, "api");
  await cp(source, apiRoot, { recursive: true });
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