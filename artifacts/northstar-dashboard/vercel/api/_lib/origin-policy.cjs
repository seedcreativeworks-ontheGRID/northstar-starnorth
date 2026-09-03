function sameOrigin(request) {
  if (request.headers["sec-fetch-site"] === "cross-site") return false;

  const origin = request.headers.origin;
  const safeMethod = request.method === "GET" || request.method === "HEAD";
  if (!origin) return safeMethod;

  try {
    const host = request.headers.host;
    const forwardedProtocol = (
      request.headers["x-forwarded-proto"] || ""
    )
      .split(",")[0]
      .trim();
    const protocol =
      forwardedProtocol === "http" || forwardedProtocol === "https"
        ? `${forwardedProtocol}:`
        : request.socket?.encrypted
          ? "https:"
          : "http:";
    const parsedOrigin = new URL(origin);

    return (
      Boolean(host) &&
      parsedOrigin.host === host &&
      parsedOrigin.protocol === protocol
    );
  } catch {
    return false;
  }
}

// The GitHub Pages mirror of the dashboard calls this API cross-origin.
// Everything else must stay same-origin -- this is an explicit allowlist,
// not a general CORS opt-in.
const TRUSTED_CROSS_ORIGINS = new Set([
  "https://seedcreativeworks-onthegrid.github.io",
]);

function isTrustedCrossOrigin(request) {
  if (request.headers["sec-fetch-site"] !== "cross-site") return false;
  const origin = request.headers.origin;
  return Boolean(origin && TRUSTED_CROSS_ORIGINS.has(origin));
}

function isAllowedOrigin(request) {
  return sameOrigin(request) || isTrustedCrossOrigin(request);
}

function corsHeaders(request) {
  const origin = request.headers.origin;
  if (!origin || !TRUSTED_CROSS_ORIGINS.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

module.exports = { sameOrigin, isTrustedCrossOrigin, isAllowedOrigin, corsHeaders };