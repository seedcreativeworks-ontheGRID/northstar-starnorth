const crypto = require("crypto");
const { argon2id } = require("hash-wasm");

// hash-wasm is pure WASM/JS -- no native .node binary. @node-rs/argon2
// (used only by the offline seed script, which runs in plain Node, not as
// a Vercel function) does ship one, and Vercel's function bundler can
// silently fail to package it, crashing every invocation with a bare
// FUNCTION_INVOCATION_FAILED and no stack trace. The PHC string format
// argon2id hashes use is a standard, interoperable format either library
// can produce or verify, so switching only the verify path here doesn't
// require re-hashing anything already stored.
const PHC_PATTERN = /^\$argon2id\$v=(\d+)\$m=(\d+),t=(\d+),p=(\d+)\$([^$]+)\$([^$]+)$/;

function parsePhc(stored) {
  const match = typeof stored === "string" ? PHC_PATTERN.exec(stored) : null;
  if (!match) return null;
  const [, , memorySize, iterations, parallelism, saltB64, hashB64] = match;
  return {
    memorySize: Number(memorySize),
    iterations: Number(iterations),
    parallelism: Number(parallelism),
    salt: Buffer.from(saltB64, "base64"),
    hash: Buffer.from(hashB64, "base64"),
  };
}

// Default params, used only for the dummy computation below when there's
// no stored hash to parse real params from.
const DUMMY_PARAMS = { memorySize: 19456, iterations: 2, parallelism: 1, hashLength: 32 };

async function verifyPassword(stored, password) {
  const parsed = parsePhc(stored);
  if (!parsed) {
    // Still do real work so a missing username takes about as long as a
    // wrong password, rather than returning instantly and leaking which
    // usernames exist via response timing.
    await argon2id({
      password,
      salt: crypto.randomBytes(16),
      outputType: "hex",
      ...DUMMY_PARAMS,
    });
    return false;
  }
  const computedHex = await argon2id({
    password,
    salt: parsed.salt,
    parallelism: parsed.parallelism,
    iterations: parsed.iterations,
    memorySize: parsed.memorySize,
    hashLength: parsed.hash.length,
    outputType: "hex",
  });
  const computed = Buffer.from(computedHex, "hex");
  return computed.length === parsed.hash.length && crypto.timingSafeEqual(computed, parsed.hash);
}

module.exports = { verifyPassword };
