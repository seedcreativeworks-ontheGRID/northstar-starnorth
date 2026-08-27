const { json, rejectUnsupportedMethod } = require("../_lib/http");
const { sameOrigin, logout } = require("../_lib/auth");

module.exports = function handler(request, response) {
  if (rejectUnsupportedMethod(request, response, ["POST"])) return;
  if (!sameOrigin(request)) return json(response, 403, { error: "Request not allowed." });
  logout(response, json);
};