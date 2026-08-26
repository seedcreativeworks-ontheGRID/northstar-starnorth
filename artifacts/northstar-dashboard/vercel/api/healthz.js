const {
  json,
  rejectUnsupportedMethod,
} = require("./_lib/http");

module.exports = function handler(request, response) {
  if (rejectUnsupportedMethod(request, response, ["GET"])) return;
  json(response, 200, { status: "ok" });
};