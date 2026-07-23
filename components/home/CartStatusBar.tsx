import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { trimAddress } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleDay {
  _key: string;
  date: string;      // YYYY-MM-DD
  openTime: string;  // e.g. "9:00 AM"
  closeTime: string; // e.g. "3:00 PM"
}

interface Event {
  _id: string;
  title: string;
  locationName: string | null;
  displayAddress: string | null;
  mapLink: string | null;
  type: "open" | "ticketed" | "private" | "fundraiser" | "sale" | "new-swag";
  note: string | null;
  schedule: ScheduleDay[] | null;
}

// ─── Query ────────────────────────────────────────────────────────────────────

// Only fetch events that are public and have a schedule entry on or after today (CT).
// GROQ dateTime() runs in UTC; subtract 30h to cover the full CT calendar day —
// event remains visible until midnight CT (30h covers CST worst-case end of day).
const EVENTS_QUERY = `*[
  _type == "event" &&
  isPublic == true &&
  count(schedule[dateTime(date + "T00:00:00Z") >= dateTime(now()) - 60*60*30]) > 0
] {
  _id,
  title,
  "locationName": location.locationName,
  "displayAddress": location.displayAddress,
  "mapLink": location.mapLink,
  type,
  schedule,
  note
}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Today's date in CT as YYYY-MM-DD */
function todayInCT(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });
}

function getTodaySchedule(event: Event): ScheduleDay | null {
  if (!event.schedule) return null;
  const today = todayInCT();
  return event.schedule.find((d) => d.date === today) ?? null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export async function CartStatusBar() {
  let events: Event[] = [];
  try {
    events = await client.fetch<Event[]>(
      EVENTS_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
  } catch (err) {
    console.error("[CartStatusBar] Sanity fetch failed:", err);
    // Fallback: render "no carts" state — never crash the layout
    events = [];
  }

  // Any event type (open, ticketed, private) means the cart is serving
  const openEvents = events
    .map((event) => ({ event, schedule: getTodaySchedule(event) }))
    .filter(({ schedule }) => schedule !== null);

  const hasOpen = openEvents.length > 0;

  const locationLabel = (event: Event) =>
    event.locationName || (event.displayAddress ? trimAddress(event.displayAddress) : null);

  return (
    <div
      className={`w-full min-h-14 py-2 border-b border-brand-black/10 ${
        hasOpen ? "bg-brand-yellow" : "bg-brand-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center gap-x-6 overflow-x-auto scrollbar-hide">
        <span
          className={`font-sans font-semibold text-sm md:text-base uppercase tracking-[0.3em] shrink-0 ${
            hasOpen ? "text-brand-grey" : "text-brand-grey/60"
          }`}
        >
          {hasOpen ? (
            <>
              {openEvents.length >= 2 && (
                <span className="block text-[10px] tracking-[0.2em] text-brand-grey/70">
                  {openEvents.length} Carts
                </span>
              )}
              <span className="block">Serving</span>
              <span className="block">Coffee</span>
            </>
          ) : (
            <>
              <span className="block">No Coffee</span>
              <span className="block">Today</span>
            </>
          )}
        </span>

        {hasOpen && (
          <>
            <span className="hidden md:block self-stretch w-0.5 shrink-0 bg-brand-grey/30" />

            {openEvents.map(({ event, schedule }) => {
              const label = locationLabel(event);
              return (
                <div key={event._id} className="flex items-start gap-3 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse shrink-0 mt-1.5" />
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-sm uppercase tracking-[0.05em] text-brand-grey whitespace-nowrap">
                      {schedule!.openTime} – {schedule!.closeTime} CT
                    </span>
                    {label && (
                      event.mapLink ? (
                        <Link
                          href={event.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans font-semibold text-[10px] text-brand-grey/70 uppercase tracking-[0.1em] hover:text-brand-grey underline-offset-2 hover:underline transition-colors whitespace-nowrap"
                        >
                          {label}
                        </Link>
                      ) : (
                        <span className="font-sans font-semibold text-[10px] text-brand-grey/70 uppercase tracking-[0.1em] whitespace-nowrap">
                          {label}
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
