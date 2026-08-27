const {
  json,
  rejectUnsupportedMethod,
} = require("./_lib/http");
const { getState } = require("./_lib/state");
const { requireSession, sameOrigin } = require("./_lib/auth");

module.exports = function handler(request, response) {
  if (rejectUnsupportedMethod(request, response, ["GET"])) return;
  if (!sameOrigin(request)) return json(response, 403, { error: "Request not allowed." });
  if (requireSession(request, response, json)) return;
  json(response, 200, getState());
};