import "server-only";
import { after } from "next/server";
import { Redis } from "@upstash/redis";

type AlertForm = "inquiry" | "opportunities";

// Per-instance record of alerts sent while Redis was failing (key → time sent).
const sentWithoutRedis = new Map<string, number>();
const FALLBACK_WINDOW_MS = 15 * 60 * 1000;

// Siteverify codes that mean our secret or Cloudflare is broken, not that the visitor failed.
const TURNSTILE_FAULTS = ["missing-input-secret", "invalid-input-secret", "bad-request", "internal-error"];

/** The Turnstile fault worth an alert, or null when the visitor simply failed the challenge. */
export function turnstileFault(status: number, errorCodes: unknown): string | null {
  const fault = Array.isArray(errorCodes)
    ? errorCodes.find((code) => TURNSTILE_FAULTS.includes(code))
    : undefined;
  return fault ?? (status >= 500 ? "siteverify_unavailable" : null);
}

/**
 * Pushes a form failure to the ntfy topic in NTFY_ALERT_URL after the response is sent.
 * Priority 5: the lead or application is lost. Priority 2: only the visitor's confirmation failed.
 * The body holds the error name and status code only, never error text or form fields.
 * Never throws and never changes what the visitor sees.
 */
export function alertFormFailure(
  form: AlertForm,
  priority: 5 | 2,
  errorName: unknown,
  statusCode?: number | null
) {
  try {
    after(() => sendAlert(form, priority, errorName, statusCode));
  } catch {
    console.error("[alert] Could not schedule the form failure alert");
  }
}

async function sendAlert(
  form: AlertForm,
  priority: 5 | 2,
  errorName: unknown,
  statusCode?: number | null
) {
  // The URL holds the topic, the only access control: never log it.
  const url = process.env.NTFY_ALERT_URL;
  if (!url) {
    console.warn("[alert] NTFY_ALERT_URL is not set; form failure alert skipped");
    return;
  }
  if (!url.startsWith("https://")) {
    console.warn("[alert] NTFY_ALERT_URL is not an https:// URL; form failure alert skipped");
    return;
  }

  // At most one alert per form and priority per hour.
  const key = `egn:alert:${form}:${priority}`;
  let redis: Redis | null = null;
  try {
    redis = Redis.fromEnv();
    if ((await redis.set(key, 1, { nx: true, ex: 3600 })) === null) return;
  } catch {
    // Fail open, but cap each instance: with Redis down, every request would otherwise page.
    redis = null;
    const last = sentWithoutRedis.get(key);
    if (last !== undefined && Date.now() - last < FALLBACK_WINDOW_MS) return;
    sentWithoutRedis.set(key, Date.now());
    console.warn("[alert] Alert throttle unavailable; sending anyway");
  }

  // Only short codes go out; anything else could be free text.
  const name =
    typeof errorName === "string" && /^[\w.-]{1,64}$/.test(errorName) ? errorName : "unknown";
  const status = Number.isInteger(statusCode) ? statusCode : "none";
  const request: RequestInit = {
    method: "POST",
    headers: { Title: `EGN form failing: ${form}`, Priority: String(priority), Tags: "warning" },
    body: `${name}, status ${status}`,
  };

  if (await post(url, request)) return;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (await post(url, request)) return;

  // Both tries failed: release the throttle so the next failure can alert.
  await redis?.del(key).catch(() => console.warn("[alert] Could not release the alert throttle"));
}

async function post(url: string, request: RequestInit): Promise<boolean> {
  try {
    const res = await fetch(url, { ...request, signal: AbortSignal.timeout(5000) });
    if (res.ok) return true;
    console.error("[alert] ntfy refused the alert:", res.status);
  } catch (err) {
    console.error("[alert] ntfy request failed:", err instanceof Error ? err.name : "unknown");
  }
  return false;
}
