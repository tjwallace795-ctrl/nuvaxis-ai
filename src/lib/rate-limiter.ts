/**
 * In-memory IP-based rate limiter using a sliding window.
 * No external dependencies required.
 */

// Map of ip+key -> array of request timestamps (ms)
const store = new Map<string, number[]>();

/**
 * Check whether a given IP is within the allowed rate limit.
 * Automatically prunes expired timestamps from the store.
 *
 * @param ip        - The client IP address
 * @param limit     - Maximum number of requests allowed within the window
 * @param windowMs  - The sliding window duration in milliseconds
 * @returns { allowed, remaining } — allowed is false when the limit is exceeded
 */
export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const key = `${ip}:${windowMs}:${limit}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Retrieve existing timestamps and prune those outside the window
  const timestamps = (store.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    store.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  // Record this request
  timestamps.push(now);
  store.set(key, timestamps);

  return { allowed: true, remaining: limit - timestamps.length };
}
