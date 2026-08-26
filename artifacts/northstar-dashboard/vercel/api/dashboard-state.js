const {
  json,
  rejectUnsupportedMethod,
} = require("./_lib/http");
const { getState } = require("./_lib/state");

module.exports = function handler(request, response) {
  if (rejectUnsupportedMethod(request, response, ["GET"])) return;
  json(response, 200, getState());
};