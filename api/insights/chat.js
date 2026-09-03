const {
  json,
  readJsonBody,
  rejectUnsupportedMethod,
  applyCors,
  handlePreflight,
} = require("../_lib/http");
const {
  consumeRateLimit,
  generateFallbackReply,
  generateInsightReply,
  validateInsightRequest,
} = require("../_lib/insights");
const { requireSession, isAllowedOrigin } = require("../_lib/auth");

module.exports = async function handler(request, response) {
  if (handlePreflight(request, response)) return;
  applyCors(request, response);
  if (rejectUnsupportedMethod(request, response, ["POST"])) return;
  if (requireSession(request, response, json)) return;
  if (!isAllowedOrigin(request)) return json(response, 403, { error: "Request not allowed." });

  const rateLimit = consumeRateLimit(request);
  if (!rateLimit.allowed) {
    json(
      response,
      429,
      {
        error:
          "You’ve sent several messages. Please wait a few minutes and try again.",
      },
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
    return;
  }

  const input = validateInsightRequest(readJsonBody(request));
  if (!input) {
    json(response, 400, { error: "Enter a message to continue." });
    return;
  }

  try {
    const reply = await generateInsightReply(input);
    json(response, 200, { reply });
  } catch (error) {
    console.warn("Business Insights AI unavailable; using grounded fallback", {
      message: error instanceof Error ? error.message : "Unknown AI error",
      user: input.user,
      insightKey: input.insightKey,
    });
    json(response, 200, { reply: generateFallbackReply(input) });
  }
};