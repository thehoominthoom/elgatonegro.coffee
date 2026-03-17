import { client } from "@/sanity/lib/client";
import { EventCalendar } from "@/components/events/EventCalendar";
import type { CalendarEvent } from "@/components/events/EventCalendar";

// ─── ISR ──────────────────────────────────────────────────────────────────────

export const revalidate = 60;

// ─── Query ────────────────────────────────────────────────────────────────────

// All public events with at least one schedule date >= today (CT).
// GROQ dateTime() runs in UTC; subtract 6h to safely cover CT (CST worst-case).
const EVENTS_QUERY = `*[
  _type == "event" &&
  isPublic == true &&
  count(schedule[dateTime(date + "T00:00:00Z") >= dateTime(now()) - 60*60*6]) > 0
] | order(schedule[0].date asc) {
  _id,
  title,
  "locationName": location.locationName,
  "displayAddress": location.displayAddress,
  "mapLink": location.mapLink,
  type,
  schedule,
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
    <main className="min-h-screen bg-brand-grey">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="mb-10 pb-6 border-b-2 border-brand-black">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.3em] text-brand-black/50 mb-2">
            What&apos;s Coming Up
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight">
            Events
          </h1>
        </div>
        <EventCalendar events={events} />
      </div>
    </main>
  );
}
