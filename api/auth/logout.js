const { json, rejectUnsupportedMethod, applyCors, handlePreflight } = require("../_lib/http");
const { isAllowedOrigin, logout } = require("../_lib/auth");

module.exports = function handler(request, response) {
  if (handlePreflight(request, response)) return;
  applyCors(request, response);
  if (rejectUnsupportedMethod(request, response, ["POST"])) return;
  if (!isAllowedOrigin(request)) return json(response, 403, { error: "Request not allowed." });
  logout(request, response, json);
};