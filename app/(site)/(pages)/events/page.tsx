import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { EventCalendar } from "@/components/events/EventCalendar";
import type { CalendarEvent } from "@/components/events/EventCalendar";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Events | El Gato Negro Coffee",
  description:
    "See where El Gato Negro is serving next. Browse upcoming pop-ups, ticketed events, and booking opportunities for Nashville's mobile espresso cart.",
  openGraph: {
    title: "Events | El Gato Negro Coffee",
    description:
      "See where El Gato Negro is serving next. Browse upcoming pop-ups, ticketed events, and booking opportunities.",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-barista_roasting.webp",
        width: 1200,
        height: 630,
        alt: "El Gato Negro Coffee — barista roasting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | El Gato Negro Coffee",
    description:
      "See where El Gato Negro is serving next. Nashville mobile espresso cart.",
    images: ["/images/hero/hero-barista_roasting.webp"],
  },
};

// ─── ISR ──────────────────────────────────────────────────────────────────────

export const revalidate = 60;

// ─── Query ────────────────────────────────────────────────────────────────────

// All public events with at least one schedule date within the next ~12 months (CT).
// GROQ dateTime() runs in UTC.
// Lower bound: subtract 30h to cover the full CT calendar day —
//   event remains visible until midnight CT (30h covers CST worst-case end of day).
// Upper bound: add 365 days (≈12 months) to cap the forward window.
const EVENTS_QUERY = `*[
  _type == "event" &&
  isPublic == true &&
  count(schedule[
    dateTime(date + "T00:00:00Z") >= dateTime(now()) - 60*60*30 &&
    dateTime(date + "T00:00:00Z") <= dateTime(now()) + 60*60*24*365
  ]) > 0
] | order(schedule[0].date asc) {
  _id,
  title,
  "locationName": location.locationName,
  "displayAddress": location.displayAddress,
  "mapLink": location.mapLink,
  type,
  schedule,
  note,
  recurrenceLabel,
  eventPageType,
  externalUrl,
  description,
  "ctaLabel": cta.ctaLabel,
  "ctaUrl": cta.ctaUrl,
  image
}`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EventsPage() {
  let events: CalendarEvent[] = [];
  try {
    events = await client.fetch<CalendarEvent[]>(EVENTS_QUERY, {}, { next: { revalidate: 60 } });
  } catch {
    // Sanity unavailable — render empty calendar
  }

  return (
    <main className="min-h-screen bg-brand-grey grain-overlay">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="mb-10 pb-6 border-b-2 border-brand-black">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60 mb-2">
            What&apos;s Coming Up
          </p>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight text-brand-black">
            Events
          </h1>
        </div>
        <EventCalendar events={events} />
      </div>
    </main>
  );
}
