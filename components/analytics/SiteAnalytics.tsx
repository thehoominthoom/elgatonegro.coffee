"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Up to 5 data points per page view, so 10,000 views a month is up to 50,000 events. 0.1 keeps
// that at 5,000, half the free 10,000 per 30 days, which the whole Vercel team shares.
const SPEED_INSIGHTS_SAMPLE_RATE = 0.1;

/**
 * Drops the query string and fragment from every URL, and turns each path segment past
 * /account/<section> into "[id]" (an order ID today), so neither tool records an order or a person.
 * The separate route field (/account/orders/[id]) comes from Next's route match; beforeSend cannot change it.
 */
function redactUrl<T extends { url: string }>(event: T): T | null {
  try {
    const url = new URL(event.url);
    url.search = "";
    url.hash = "";
    const segments = url.pathname.split("/");
    if (segments[1] === "account") {
      url.pathname = segments.map((s, i) => (i > 2 && s ? "[id]" : s)).join("/");
    }
    return { ...event, url: url.href };
  } catch {
    return null; // A URL that does not parse is dropped, never sent as is
  }
}

export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={redactUrl} />
      <SpeedInsights beforeSend={redactUrl} sampleRate={SPEED_INSIGHTS_SAMPLE_RATE} />
    </>
  );
}
