// Simple in-memory rate limiter. Good enough to stop casual abuse/scripts
// hitting the API directly; NOT a substitute for a real distributed
// limiter (e.g. Upstash Redis) if this app ever sees real traffic —
// this resets whenever the serverless function cold-starts, and each
// Vercel region/instance keeps its own counts.

const buckets = new Map();

export function rateLimit(identifier, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const entry = buckets.get(identifier);

  if (!entry || now - entry.start > windowMs) {
    buckets.set(identifier, { start: now, count: 1 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

export function getClientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
