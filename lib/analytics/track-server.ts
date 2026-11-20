import "server-only";
import { after } from "next/server";
import { track } from "@vercel/analytics/server";

/**
 * Sends a Vercel Web Analytics event after the response is sent. Never throws and never changes
 * what the visitor sees. Passes only the user agent (device) and client IP (country): without an
 * explicit list, track() forwards the request's cookies to Vercel too.
 */
export function trackServerEvent(
  name: "Inquiry sent" | "Application sent",
  requestHeaders: Headers,
  properties?: Record<string, string>
) {
  const headers = {
    "user-agent": requestHeaders.get("user-agent") ?? undefined,
    "x-forwarded-for": requestHeaders.get("x-forwarded-for") ?? undefined,
  };
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
