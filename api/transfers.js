const {
  json,
  readJsonBody,
  rejectUnsupportedMethod,
  applyCors,
  handlePreflight,
} = require("./_lib/http");
const { createTransfer } = require("./_lib/state");
const { requireSession, isAllowedOrigin } = require("./_lib/auth");

module.exports = function handler(request, response) {
  if (handlePreflight(request, response)) return;
  applyCors(request, response);
  if (rejectUnsupportedMethod(request, response, ["POST"])) return;
  if (!isAllowedOrigin(request)) return json(response, 403, { error: "Request not allowed." });
  if (requireSession(request, response, json)) return;

  const body = readJsonBody(request);
  const amount = body?.amount;

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 190939.9
  ) {
    json(response, 400, { error: "Enter a valid transfer amount." });
    return;
  }

  json(response, 201, createTransfer(amount));
};