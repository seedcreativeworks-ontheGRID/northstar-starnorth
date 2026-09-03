const { Redis } = require("@upstash/redis");

const MAX_FAILURES = 5;
const WINDOW_SECONDS = 15 * 60;

let redis;

// Falls back to per-instance in-memory tracking when Upstash isn't
// configured (local dev, tests). That fallback resets on cold start and
// doesn't share state across concurrent function instances -- fine for
// local use, not a substitute for Redis in production.
const memory = new Map();

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

function redisKey(key) {
  return `northstar:login-failures:${key}`;
}

async function isThrottled(key) {
  const client = getRedis();
  if (!client) {
    const entry = memory.get(key);
    return Boolean(entry && entry.resetAt > Date.now() && entry.count >= MAX_FAILURES);
  }
  const count = Number((await client.get(redisKey(key))) ?? 0);
  return count >= MAX_FAILURES;
}

async function retryAfterSeconds(key) {
  const client = getRedis();
  if (!client) {
    const entry = memory.get(key);
    return entry ? Math.max(0, Math.ceil((entry.resetAt - Date.now()) / 1000)) : 0;
  }
  const ttl = await client.ttl(redisKey(key));
  return ttl > 0 ? ttl : 0;
}

async function recordFailure(key) {
  const client = getRedis();
  if (!client) {
    const now = Date.now();
    const entry = memory.get(key);
    memory.set(key, {
      count: entry && entry.resetAt > now ? entry.count + 1 : 1,
      resetAt: now + WINDOW_SECONDS * 1000,
    });
    return;
  }
  const fullKey = redisKey(key);
  const count = await client.incr(fullKey);
  if (count === 1) {
    await client.expire(fullKey, WINDOW_SECONDS);
  }
}

async function clearFailures(key) {
  const client = getRedis();
  if (!client) {
    memory.delete(key);
    return;
  }
  await client.del(redisKey(key));
}

module.exports = { isThrottled, retryAfterSeconds, recordFailure, clearFailures };
