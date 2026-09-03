const {
  json,
  rejectUnsupportedMethod,
  applyCors,
  handlePreflight,
} = require("./_lib/http");
const { getState } = require("./_lib/state");
const { requireSession, isAllowedOrigin } = require("./_lib/auth");

module.exports = function handler(request, response) {
  if (handlePreflight(request, response)) return;
  applyCors(request, response);
  if (rejectUnsupportedMethod(request, response, ["GET"])) return;
  if (!isAllowedOrigin(request)) return json(response, 403, { error: "Request not allowed." });
  if (requireSession(request, response, json)) return;
  json(response, 200, getState());
};