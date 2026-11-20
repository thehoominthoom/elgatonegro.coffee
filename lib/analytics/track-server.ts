import "server-only";
import { after } from "next/server";
import { track } from "@vercel/analytics/server";

/**
 * Sends a Vercel Web Analytics event after the response is sent. Never throws and never changes
 * what the visitor sees. Passes only the user agent (device) and client IP (country): without an
 * explicit list, track() forwards the request's cookies to Vercel too.
 * Production only: events go to VERCEL_WEB_ANALYTICS_ENDPOINT (the www domain), and a preview's
 * own protected URL would answer 401.
 */
export function trackServerEvent(
  name: "Inquiry sent" | "Application sent",
  requestHeaders: Headers,
  properties?: Record<string, string>
) {
  if (process.env.VERCEL_ENV !== "production") return;
  const headers: Record<string, string> = {};
  for (const key of ["user-agent", "x-forwarded-for"]) {
    const value = requestHeaders.get(key);
    if (value) headers[key] = value;
  }
  try {
    after(() =>
      track(name, properties, { headers }).catch(() =>
        console.error("[analytics] Could not send the event")
      )
    );
  } catch {
    console.error("[analytics] Could not schedule the event");
  }
}
