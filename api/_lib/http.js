function json(response, status, body, headers = {}) {
  response.status(status);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [name, value] of Object.entries(headers)) {
    response.setHeader(name, value);
  }
  response.end(JSON.stringify(body));
}

function readJsonBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      return null;
    }
  }

  return null;
}

function rejectUnsupportedMethod(request, response, allowedMethods) {
  if (allowedMethods.includes(request.method)) return false;
  response.setHeader("Allow", allowedMethods.join(", "));
  json(response, 405, { error: "Method not allowed." });
  return true;
}

module.exports = {
  json,
  readJsonBody,
  rejectUnsupportedMethod,
};