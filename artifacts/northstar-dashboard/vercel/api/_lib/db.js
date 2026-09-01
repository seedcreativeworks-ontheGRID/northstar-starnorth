const { Pool } = require("pg");

// Reused across warm invocations of the same function instance. Use a Neon
// *pooled* connection string (the "-pooler" host) in DATABASE_URL so this
// stays safe under many concurrent cold instances -- each instance here
// only ever needs a single connection.
let pool;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set.");
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
  }
  return pool;
}

async function findUserByUsername(username) {
  const { rows } = await getPool().query(
    "SELECT id, username, password_hash, flow, profile FROM users WHERE username = $1 LIMIT 1",
    [username],
  );
  return rows[0] ?? null;
}

module.exports = { findUserByUsername };
