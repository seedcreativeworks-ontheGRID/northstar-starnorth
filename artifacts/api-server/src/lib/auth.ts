import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const COOKIE_NAME = "northstar_demo_session";
const SESSION_TTL_SECONDS = 60 * 60;
const MAX_CREDENTIAL_LENGTH = 128;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;
const attempts = new Map<string, { failures: number; resetAt: number }>();

export type DashboardProfile = "ben" | "james";
type EntryFlow = "direct" | "guided";
type AuthSession = {
  flow: EntryFlow;
  profile: DashboardProfile | null;
  exp: number;
};

function secret() {
  return process.env.SESSION_SECRET;
}

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest();
}

function equalsDigest(left: string, right: string) {
  return crypto.timingSafeEqual(digest(left), digest(right));
}

function signature(payload: string, signingSecret: string) {
  return crypto.createHmac("sha256", signingSecret).update(payload).digest();
}

function clientKey(request: Request) {
  return request.get("x-forwarded-for")?.split(",")[0]?.trim() || request.ip || "unknown";
}

export function isSameOrigin(request: Request) {
  if (request.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.get("origin");
  const safeMethod = request.method === "GET" || request.method === "HEAD";
  if (!origin) return safeMethod;
  try {
    const targetHost = request.get("host");
    const forwardedProtocol = request.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const targetProtocol = forwardedProtocol === "http" || forwardedProtocol === "https"
      ? `${forwardedProtocol}:`
      : request.protocol === "https" ? "https:" : "http:";
    const parsedOrigin = new URL(origin);
    return Boolean(targetHost) &&
      parsedOrigin.host === targetHost &&
      parsedOrigin.protocol === targetProtocol;
  } catch {
    return false;
  }
}

function sessionFromRequest(request: Request): AuthSession | null {
  const signingSecret = secret();
  const value = request.cookies?.[COOKIE_NAME];
  if (!signingSecret || typeof value !== "string") return null;
  const [payload, encodedSignature] = value.split(".");
  if (!payload || !/^[a-f0-9]{64}$/i.test(encodedSignature || "")) return null;
  const supplied = Buffer.from(encodedSignature, "hex");
  const expected = signature(payload, signingSecret);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: unknown;
      flow?: unknown;
      profile?: unknown;
      v?: unknown;
    };
    if (typeof parsed.exp !== "number" || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    if (parsed.v === 1) return { flow: "direct", profile: "ben", exp: parsed.exp };
    if (
      parsed.v !== 2 ||
      !["direct", "guided"].includes(String(parsed.flow)) ||
      ![null, "ben", "james"].includes(parsed.profile as DashboardProfile | null)
    ) return null;
    return {
      flow: parsed.flow as EntryFlow,
      profile: parsed.profile as DashboardProfile | null,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function requireSession(request: Request, response: Response, next: NextFunction) {
  const session = sessionFromRequest(request);
  if (!session?.profile) {
    response.status(401).json({ error: "Authentication required." });
    return;
  }
  next();
}

function setSessionCookie(response: Response, session: AuthSession) {
  const payload = Buffer.from(JSON.stringify({
    v: 2,
    exp: session.exp,
    flow: session.flow,
    profile: session.profile,
  })).toString("base64url");
  const cookie = `${payload}.${signature(payload, secret()!).toString("hex")}`;
  response.cookie(COOKIE_NAME, cookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: Math.max(0, session.exp - Math.floor(Date.now() / 1000)) * 1000,
  });
}

export function requireSameOrigin(request: Request, response: Response, next: NextFunction) {
  if (isSameOrigin(request)) {
    next();
    return;
  }
  response.status(403).json({ error: "Request not allowed." });
}

export function login(request: Request, response: Response) {
  const now = Date.now();
  const key = clientKey(request);
  const rate = attempts.get(key);
  if (rate && rate.resetAt > now && rate.failures >= LOGIN_MAX_FAILURES) {
    response.setHeader("Retry-After", String(Math.ceil((rate.resetAt - now) / 1000)));
    response.status(429).json({ error: "Unable to sign in. Please try again later." });
    return;
  }
  const { username, password } = request.body ?? {};
  const configuredUsername = process.env.NORTHSTAR_DEMO_USERNAME;
  const configuredPassword = process.env.NORTHSTAR_DEMO_PASSWORD;
  const guidedUsername = process.env.NORTHSTAR_GUIDED_USERNAME;
  const guidedPassword = process.env.NORTHSTAR_GUIDED_PASSWORD;
  const validInput = typeof username === "string" && typeof password === "string" &&
    username.length > 0 && password.length > 0 &&
    username.length <= MAX_CREDENTIAL_LENGTH && password.length <= MAX_CREDENTIAL_LENGTH;
  const directMatch = Boolean(secret() && configuredUsername && configuredPassword && validInput) &&
    equalsDigest(username, configuredUsername!) && equalsDigest(password, configuredPassword!);
  const guidedMatch = Boolean(secret() && guidedUsername && guidedPassword && validInput) &&
    equalsDigest(username, guidedUsername!) && equalsDigest(password, guidedPassword!);
  if (!directMatch && !guidedMatch) {
    attempts.set(key, { failures: rate && rate.resetAt > now ? rate.failures + 1 : 1, resetAt: now + LOGIN_WINDOW_MS });
    response.status(401).json({ error: "Unable to sign in with those details." });
    return;
  }
  attempts.delete(key);
  const flow: EntryFlow = directMatch ? "direct" : "guided";
  const profile: DashboardProfile | null = directMatch ? "ben" : null;
  setSessionCookie(response, {
    flow,
    profile,
    exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
  });
  response.status(200).json({
    authenticated: true,
    flow,
    profile,
    questionnaireRequired: flow === "guided",
  });
}

const ANSWER_WEIGHTS = {
  role: { accountant: 0, controller: 1, finance_leader: 2, executive: 3 },
  responsibility: { close_reporting: 0, reconciliation: 0, liquidity: 2, risk_oversight: 2 },
  authority: { prepare: 0, recommend: 1, approve: 2, final_authority: 3 },
  priority: { reconcile_activity: 0, investigate_variances: 0, review_approvals: 2, strategic_outlook: 2 },
} as const;

export function completeProfile(request: Request, response: Response) {
  const session = sessionFromRequest(request);
  if (!session) {
    response.status(401).json({ error: "Authentication required." });
    return;
  }
  if (session.flow !== "guided") {
    response.status(403).json({ error: "This session does not require onboarding." });
    return;
  }
  if (session.profile) {
    response.status(409).json({ error: "A dashboard profile has already been selected." });
    return;
  }
  const answers = request.body?.answers;
  if (!answers || typeof answers !== "object") {
    response.status(400).json({ error: "Complete each question to continue." });
    return;
  }
  let score = 0;
  for (const [question, weights] of Object.entries(ANSWER_WEIGHTS)) {
    const answer = answers[question];
    if (typeof answer !== "string" || !Object.hasOwn(weights, answer)) {
      response.status(400).json({ error: "Complete each question to continue." });
      return;
    }
    score += weights[answer as keyof typeof weights];
  }
  const profile: DashboardProfile = score >= 5 ? "james" : "ben";
  setSessionCookie(response, { ...session, profile });
  response.status(200).json({ authenticated: true, profile, questionnaireRequired: false });
}

export function logout(_request: Request, response: Response) {
  response.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  response.status(200).json({ authenticated: false });
}

export function sessionStatus(request: Request, response: Response) {
  const session = sessionFromRequest(request);
  if (!session) {
    response.status(200).json({ authenticated: false });
    return;
  }
  response.status(200).json({
    authenticated: true,
    flow: session.flow,
    profile: session.profile,
    questionnaireRequired: session.flow === "guided" && !session.profile,
    profileLocked: session.flow === "guided" && Boolean(session.profile),
  });
}