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

module.exports = { sameOrigin };