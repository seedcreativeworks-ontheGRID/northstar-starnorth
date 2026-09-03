const crypto = require("crypto");
const { sameOrigin, isTrustedCrossOrigin, isAllowedOrigin } = require("./origin-policy.cjs");
const { findUserByUsername } = require("./db");
const { verifyPassword } = require("./password");
const { isThrottled, retryAfterSeconds, recordFailure, clearFailures } = require("./rate-limit");

const COOKIE_NAME = "northstar_demo_session";
const TTL_SECONDS = 60 * 60;
const MAX_CREDENTIAL_LENGTH = 128;

function parseCookies(request) {
  return Object.fromEntries(
    (request.headers.cookie || "").split(";").map((item) => {
      const index = item.indexOf("=");
      return index < 0 ? [] : [item.slice(0, index).trim(), decodeURIComponent(item.slice(index + 1))];
    }).filter((item) => item.length === 2),
  );
}

function sign(payload) {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET || "").update(payload).digest();
}

function getSession(request) {
  const value = parseCookies(request)[COOKIE_NAME];
  if (!process.env.SESSION_SECRET || typeof value !== "string") return null;
  const [payload, encoded] = value.split(".");
  if (!payload || !/^[a-f0-9]{64}$/i.test(encoded || "")) return null;
  const supplied = Buffer.from(encoded, "hex");
  const expected = sign(payload);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof parsed.exp !== "number" || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    if (parsed.v === 1) return { flow: "direct", profile: "ben", exp: parsed.exp };
    if (
      parsed.v !== 2 ||
      !["direct", "guided"].includes(parsed.flow) ||
      ![null, "ben", "james"].includes(parsed.profile)
    ) return null;
    return { flow: parsed.flow, profile: parsed.profile, exp: parsed.exp };
  } catch {
    return null;
  }
}

function isAuthenticated(request) {
  return Boolean(getSession(request));
}

function requireSession(request, response, json) {
  if (getSession(request)?.profile) return false;
  json(response, 401, { error: "Authentication required." });
  return true;
}

function cookie(value, maxAge, sameSite) {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}; Secure`;
}

// SameSite=None is only used for the one trusted cross-origin caller (the
// GitHub Pages mirror) -- every same-origin request (the real Vercel site)
// keeps the stronger SameSite=Lax, unaffected by that carve-out.
function sameSiteFor(request) {
  return isTrustedCrossOrigin(request) ? "None" : "Lax";
}

function setSessionCookie(response, session, request) {
  const payload = Buffer.from(JSON.stringify({
    v: 2,
    exp: session.exp,
    flow: session.flow,
    profile: session.profile,
  })).toString("base64url");
  response.setHeader(
    "Set-Cookie",
    cookie(
      `${payload}.${sign(payload).toString("hex")}`,
      Math.max(0, session.exp - Math.floor(Date.now() / 1000)),
      sameSiteFor(request),
    ),
  );
}

function clientKey(request) {
  return (request.headers["x-forwarded-for"] || request.socket?.remoteAddress || "unknown").split(",")[0].trim();
}

async function login(request, response, json, body) {
  const now = Date.now();
  const key = clientKey(request);
  if (await isThrottled(key)) {
    const retryAfter = await retryAfterSeconds(key);
    json(response, 429, { error: "Unable to sign in. Please try again later." }, { "Retry-After": String(retryAfter) });
    return;
  }
  const { username, password } = body || {};
  const validInput = typeof username === "string" && typeof password === "string" && username.length > 0 && password.length > 0 && username.length <= MAX_CREDENTIAL_LENGTH && password.length <= MAX_CREDENTIAL_LENGTH;
  const reject = async () => {
    await recordFailure(key);
    json(response, 401, { error: "Unable to sign in with those details." });
  };
  if (!process.env.SESSION_SECRET || !validInput) {
    await reject();
    return;
  }
  const user = await findUserByUsername(username);
  const passwordMatches = await verifyPassword(user?.password_hash, password);
  if (!user || !passwordMatches) {
    await reject();
    return;
  }
  await clearFailures(key);
  const { flow, profile } = user;
  setSessionCookie(response, { flow, profile, exp: Math.floor(now / 1000) + TTL_SECONDS }, request);
  json(response, 200, { authenticated: true, flow, profile, questionnaireRequired: flow === "guided" });
}

const answerWeights = {
  role: { accountant: 0, controller: 1, finance_leader: 2, executive: 3 },
  responsibility: { close_reporting: 0, reconciliation: 0, liquidity: 2, risk_oversight: 2 },
  authority: { prepare: 0, recommend: 1, approve: 2, final_authority: 3 },
  priority: { reconcile_activity: 0, investigate_variances: 0, review_approvals: 2, strategic_outlook: 2 },
};

function completeProfile(request, response, json, body) {
  const session = getSession(request);
  if (!session) return json(response, 401, { error: "Authentication required." });
  if (session.flow !== "guided") return json(response, 403, { error: "This session does not require onboarding." });
  if (session.profile) return json(response, 409, { error: "A dashboard profile has already been selected." });
  const answers = body?.answers;
  if (!answers || typeof answers !== "object") return json(response, 400, { error: "Complete each question to continue." });
  let score = 0;
  for (const [question, weights] of Object.entries(answerWeights)) {
    const answer = answers[question];
    if (typeof answer !== "string" || !Object.hasOwn(weights, answer)) {
      return json(response, 400, { error: "Complete each question to continue." });
    }
    score += weights[answer];
  }
  const profile = score >= 5 ? "james" : "ben";
  setSessionCookie(response, { ...session, profile }, request);
  return json(response, 200, { authenticated: true, profile, questionnaireRequired: false });
}

function logout(request, response, json) {
  response.setHeader("Set-Cookie", cookie("", 0, sameSiteFor(request)));
  json(response, 200, { authenticated: false });
}

module.exports = {
  completeProfile,
  getSession,
  isAuthenticated,
  requireSession,
  sameOrigin,
  isAllowedOrigin,
  login,
  logout,
};