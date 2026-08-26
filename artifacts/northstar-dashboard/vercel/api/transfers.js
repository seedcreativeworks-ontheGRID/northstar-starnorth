const {
  json,
  readJsonBody,
  rejectUnsupportedMethod,
} = require("./_lib/http");
const { createTransfer } = require("./_lib/state");

module.exports = function handler(request, response) {
  if (rejectUnsupportedMethod(request, response, ["POST"])) return;

  const body = readJsonBody(request);
  const amount = body?.amount;

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 190939.9
  ) {
    json(response, 400, { error: "Enter a valid transfer amount." });
    return;
  }

  json(response, 201, createTransfer(amount));
};