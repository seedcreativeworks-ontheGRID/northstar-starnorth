const {
  json,
  readJsonBody,
  rejectUnsupportedMethod,
} = require("../_lib/http");
const { updateApproval } = require("../_lib/state");

module.exports = function handler(request, response) {
  if (rejectUnsupportedMethod(request, response, ["PATCH"])) return;

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