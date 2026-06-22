import { AppError } from "./api";

const store = globalThis.__rateLimitStore || (globalThis.__rateLimitStore = new Map());

export function rateLimit(request, { limit = 60, windowMs = 60_000 } = {}) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const key = `${ip}:${new URL(request.url).pathname}`;
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) { store.set(key, { count: 1, resetAt: now + windowMs }); return; }
  if (++entry.count > limit) throw new AppError("Too many requests. Please try again later.", 429);
}
