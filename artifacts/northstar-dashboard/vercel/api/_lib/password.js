const argon2 = require("@node-rs/argon2");

// Verified against on a login attempt for a username that doesn't exist, so
// the response takes about as long either way and doesn't leak which
// usernames are registered via a timing difference.
const dummyHashPromise = argon2.hash(require("crypto").randomBytes(32).toString("hex"));

function hashPassword(password) {
  return argon2.hash(password);
}

async function verifyPassword(hash, password) {
  if (!hash) {
    await dummyHashPromise.then((dummy) => argon2.verify(dummy, password));
    return false;
  }
  return argon2.verify(hash, password);
}

module.exports = { hashPassword, verifyPassword };
