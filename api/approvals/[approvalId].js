const {
  json,
  readJsonBody,
  rejectUnsupportedMethod,
  applyCors,
  handlePreflight,
} = require("../_lib/http");
const { updateApproval } = require("../_lib/state");
const { requireSession, isAllowedOrigin } = require("../_lib/auth");

module.exports = function handler(request, response) {
  if (handlePreflight(request, response)) return;
  applyCors(request, response);
  if (rejectUnsupportedMethod(request, response, ["PATCH"])) return;
  if (!isAllowedOrigin(request)) return json(response, 403, { error: "Request not allowed." });
  if (requireSession(request, response, json)) return;

  const body = readJsonBody(request);
  const approvalId = Array.isArray(request.query.approvalId)
    ? request.query.approvalId[0]
    : request.query.approvalId;

  if (
    typeof approvalId !== "string" ||
    !["approved", "rejected"].includes(body?.status)
  ) {
    json(response, 400, { error: "Choose a valid approval decision." });
    return;
  }

  const approval = updateApproval(approvalId, body.status);
  if (!approval) {
    json(response, 404, { error: "Approval not found." });
    return;
  }

  json(response, 200, approval);
};