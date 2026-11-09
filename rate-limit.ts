/**
 * Rate limiting for the contact form.
 *
 * Production (serverless): uses a shared Redis store over its REST API, so the
 * limit holds across every instance. Works with Upstash Redis or Vercel KV/Redis
 * (Marketplace) — set either pair of env vars:
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *   KV_REST_API_URL        + KV_REST_API_TOKEN
 * No SDK needed — plain fetch.
 *
 * Without those variables it falls back to an in-memory limiter, which is fine
 * for local development or a single long-running server, but NOT reliable on
 * serverless hosting (each instance keeps its own counts). A warning is logged.
 */

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

function redisConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)?.trim().replace(/\/+$/, "");
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)?.trim();
  return url && token ? { url, token } : null;
}

/** Fixed-window counter in Redis: INCR the window's key and set its expiry. */
async function redisLimit(
  cfg: { url: string; token: string },
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const redisKey = `ratelimit:${key}:${window}`;
  const ttlSeconds = Math.ceil(windowMs / 1000);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3_000);
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(ttlSeconds)],
      ]),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as Array<{ result?: unknown; error?: string }>;
    const count = Number(data?.[0]?.result);
    if (!Number.isFinite(count)) throw new Error("bad response");
    if (count > limit) {
      return { ok: false, retryAfter: Math.max(1, Math.ceil(((window + 1) * windowMs - now) / 1000)) };
    }
    return { ok: true };
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- In-memory fallback (sliding window) ---------- */

const buckets = new Map<string, number[]>();
const MAX_KEYS = 5000;

function memoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > MAX_KEYS) {
    const oldest = buckets.keys().next().value;
    if (oldest !== undefined) buckets.delete(oldest);
  }
  return { ok: true };
}

let warned = false;

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const cfg = redisConfig();
  if (cfg) {
    try {
      return await redisLimit(cfg, key, limit, windowMs);
    } catch (err) {
      // Store unreachable: keep the form working, but still limit per instance.
      console.error(`[rate-limit] Redis unavailable (${err instanceof Error ? err.message : "error"}); using in-memory fallback.`);
      return memoryLimit(key, limit, windowMs);
    }
  }
  if (!warned && process.env.NODE_ENV === "production") {
    warned = true;
    console.warn(
      "[rate-limit] No shared store configured (UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN). " +
        "Using in-memory limits, which are not reliable on serverless hosting.",
    );
  }
  return memoryLimit(key, limit, windowMs);
}

/** Test helper. */
export function _resetRateLimit() {
  buckets.clear();
  warned = false;
}
