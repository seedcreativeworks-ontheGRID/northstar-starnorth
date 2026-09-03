const { corsHeaders } = require("./origin-policy.cjs");

function json(response, status, body, headers = {}) {
  response.status(status);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [name, value] of Object.entries(headers)) {
    response.setHeader(name, value);
  }
  response.end(JSON.stringify(body));
}

// Applies CORS headers for the trusted GitHub Pages origin (a no-op for
// every other request) and answers a preflight OPTIONS request directly.
// Call at the top of every handler, before rejectUnsupportedMethod --
// OPTIONS isn't one of a handler's normal allowed methods.
function applyCors(request, response) {
  for (const [name, value] of Object.entries(corsHeaders(request))) {
    response.setHeader(name, value);
  }
}

function handlePreflight(request, response) {
  if (request.method !== "OPTIONS") return false;
  applyCors(request, response);
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
  return true;
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
  applyCors,
  handlePreflight,
};