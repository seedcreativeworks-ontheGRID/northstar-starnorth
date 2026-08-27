const { json, rejectUnsupportedMethod } = require("../_lib/http");
const { getSession } = require("../_lib/auth");

module.exports = function handler(request, response) {
  if (rejectUnsupportedMethod(request, response, ["GET"])) return;
  const session = getSession(request);
  if (!session) return json(response, 200, { authenticated: false });
  json(response, 200, {
    authenticated: true,
    flow: session.flow,
    profile: session.profile,
    questionnaireRequired: session.flow === "guided" && !session.profile,
    profileLocked: session.flow === "guided" && Boolean(session.profile),
  });
};