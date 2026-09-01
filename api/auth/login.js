const { json, readJsonBody, rejectUnsupportedMethod } = require("../_lib/http");
const { sameOrigin, login } = require("../_lib/auth");

module.exports = function handler(request, response) {
  if (rejectUnsupportedMethod(request, response, ["POST"])) return;
  if (!sameOrigin(request)) return json(response, 403, { error: "Request not allowed." });
  return login(request, response, json, readJsonBody(request));
};