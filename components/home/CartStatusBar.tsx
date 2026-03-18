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
  schedule: ScheduleDay[] | null;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const EVENTS_QUERY = `*[_type == "event"] {
  _id,
  title,
  "locationName": location.locationName,
  "displayAddress": location.displayAddress,
  "mapLink": location.mapLink,
  type,
  schedule
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

  return (
    <div
      className={`w-full border-b border-brand-black/10 ${
        hasOpen ? "bg-brand-yellow" : "bg-brand-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row md:flex-wrap md:items-center gap-x-6 gap-y-2">
        {/* Status label */}
        <span
          className={`font-sans font-semibold text-xs uppercase tracking-[0.3em] shrink-0 text-left md:text-right ${
            hasOpen ? "text-brand-grey" : "text-brand-grey/60"
          }`}
        >
          <span className="md:hidden">Serving Coffee</span>
          <span className="hidden md:block">Serving<br />Coffee</span>
        </span>

        {/* Divider — desktop only */}
        <span className={`hidden md:block self-stretch w-0.5 ${hasOpen ? "bg-brand-grey/30" : "bg-brand-grey/20"}`} />

        {hasOpen ? (
          openEvents.length >= 2 ? (
            <>
              {/* Mobile: horizontal scroll-snap carousel with right-edge peek */}
              <div className="md:hidden h-[72px] min-w-0 flex-1">
                <div className="snap-x snap-mandatory overflow-x-scroll scrollbar-hide flex gap-3 h-full items-center">
                  {openEvents.map(({ event, schedule }) => (
                    <div
                      key={event._id}
                      className="shrink-0 w-[calc(100%-40px)] snap-start pr-3 flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse shrink-0" />
                        <span className="font-sans font-semibold text-sm uppercase tracking-[0.05em] text-brand-grey">
                          {schedule!.openTime} – {schedule!.closeTime} CT
                        </span>
                      </div>
                      {(event.locationName || event.displayAddress || event.mapLink) && (
                        <div className="flex items-center gap-3 pl-[18px]">
                          {event.mapLink ? (
                            <Link
                              href={event.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans font-semibold text-xs text-brand-grey/80 uppercase tracking-[0.1em] hover:text-brand-grey underline-offset-2 hover:underline transition-colors"
                            >
                              {event.locationName || (event.displayAddress ? trimAddress(event.displayAddress) : "")}
                            </Link>
                          ) : (event.locationName || event.displayAddress) ? (
                            <span className="font-sans font-semibold text-xs text-brand-grey/80 uppercase tracking-[0.1em]">
                              {event.locationName || (event.displayAddress ? trimAddress(event.displayAddress) : "")}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: existing inline layout */}
              <div className="hidden md:contents">
                {openEvents.map(({ event, schedule }) => (
                  <div key={event._id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse shrink-0" />
                      <span className="font-sans font-semibold text-sm uppercase tracking-[0.05em] text-brand-grey">
                        {schedule!.openTime} – {schedule!.closeTime} CT
                      </span>
                    </div>
                    {(event.locationName || event.displayAddress || event.mapLink) && (
                      <div className="flex items-center gap-3 pl-[18px]">
                        {event.mapLink ? (
                          <Link
                            href={event.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans font-semibold text-xs text-brand-grey/80 uppercase tracking-[0.1em] hover:text-brand-grey underline-offset-2 hover:underline transition-colors"
                          >
                            {event.locationName || (event.displayAddress ? trimAddress(event.displayAddress) : "")}
                          </Link>
                        ) : (event.locationName || event.displayAddress) ? (
                          <span className="font-sans font-semibold text-xs text-brand-grey/80 uppercase tracking-[0.1em]">
                            {event.locationName || (event.displayAddress ? trimAddress(event.displayAddress) : "")}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Single cart — full-width, no carousel, both breakpoints */
            openEvents.map(({ event, schedule }) => (
              <div key={event._id} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse shrink-0" />
                  <span className="font-sans font-semibold text-sm uppercase tracking-[0.05em] text-brand-grey">
                    {schedule!.openTime} – {schedule!.closeTime} CT
                  </span>
                </div>
                {(event.locationName || event.displayAddress || event.mapLink) && (
                  <div className="flex items-center gap-3 pl-[18px]">
                    {event.mapLink ? (
                      <Link
                        href={event.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans font-semibold text-xs text-brand-grey/80 uppercase tracking-[0.1em] hover:text-brand-grey underline-offset-2 hover:underline transition-colors"
                      >
                        {event.locationName || (event.displayAddress ? trimAddress(event.displayAddress) : "")}
                      </Link>
                    ) : (event.locationName || event.displayAddress) ? (
                      <span className="font-sans font-semibold text-xs text-brand-grey/80 uppercase tracking-[0.1em]">
                        {event.locationName || (event.displayAddress ? trimAddress(event.displayAddress) : "")}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            ))
          )
        ) : (
          <span className="font-sans font-semibold text-xs uppercase tracking-[0.2em] text-brand-grey/80">
            No carts in operation today
          </span>
        )}
      </div>
    </div>
  );
}
