import { client } from "@/sanity/lib/client";
import { trimAddress } from "@/lib/utils";
import { googleMapsUrl } from "@/lib/maps";
import { addDays, todayInCT } from "@/lib/home/dates";
import { fetchLocations, isLive, locationDirectionsUrl, upcomingExceptions, type SanityLocation } from "@/lib/locations";
import { EXCEPTION_WINDOW_DAYS } from "@/lib/location-rules";
import {
  barStatus,
  clockMinutes,
  entryPhase,
  readClockCT,
  STATUS_LABELS,
  type BarEvent,
  type BarLocation,
} from "@/lib/home/status-bar";
import { CartStatusBarView } from "./CartStatusBarView";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleDay {
  date: string;              // YYYY-MM-DD
  openTime?: string | null;  // e.g. "9:00 AM"
  closeTime?: string | null; // e.g. "3:00 PM"
}

interface Event {
  _id: string;
  locationName: string | null;
  displayAddress: string | null;
  placeId: string | null;
  schedule: ScheduleDay[] | null;
}

// ─── Query ────────────────────────────────────────────────────────────────────

// Only fetch events that are public and have a schedule entry on or after today (CT).
// GROQ dateTime() runs in UTC; subtract 30h to cover the full CT calendar day —
// event remains visible until midnight CT (30h covers CST worst-case end of day).
// A promotion is someone else's event with no cart at it, so it never reaches the
// bar. A document with no type still matches: GROQ's != is true against a missing field.
const EVENTS_QUERY = `*[
  _type == "event" &&
  isPublic == true &&
  type != "promo" &&
  count(schedule[dateTime(date + "T00:00:00Z") >= dateTime(now()) - 60*60*30]) > 0
] {
  _id,
  "locationName": location.locationName,
  "displayAddress": location.displayAddress,
  "placeId": location.placeId,
  schedule
}`;

// The layout awaits the bar with no Suspense boundary, so a hung request would
// hold up the whole page. Sanity's slowest uncached answer measured about 200 ms.
// A signal, not the client's `timeout`: that one is per attempt, network errors
// retry past it, and it leaves the request open.
const SANITY_DEADLINE_MS = 2000;

// A cached page can be this old before Vercel drops it: 31 days unvisited. It
// still has to work out its "back" line then, so the browser gets the exceptions
// for the whole look-ahead from the day it is finally opened.
const CACHED_PAGE_MARGIN_DAYS = 31;

// ─── Pre-paint script ─────────────────────────────────────────────────────────

// HTML from a cached page paints before React hydrates, so without this the bar
// would show the server's "Serving Today" and then change. The script sits right
// after the bar and sets the same clock-driven values CartStatusBarView will.
// If the page was cached on an earlier day, the whole bar is out of date, so it
// stays hidden until React renders the right day. Its text is static: no Sanity
// content reaches it.
const PRE_PAINT_SCRIPT = `(function(){
var readClockCT=${readClockCT},clockMinutes=${clockMinutes},entryPhase=${entryPhase},barStatus=${barStatus},labels=${JSON.stringify(STATUS_LABELS)};
var bar=document.getElementById("cart-status-bar");if(!bar)return;
var clock=readClockCT();
if(clock.slice(0,10)!==bar.dataset.day){bar.dataset.clock="stale";return}
var entries=bar.querySelectorAll("[data-entry]");if(!entries.length)return;
var minutes=clockMinutes(clock),phases=[];
var read=function(v){return v===undefined?null:Number(v)};
entries.forEach(function(entry){
var phase=entryPhase(read(entry.dataset.opens),read(entry.dataset.closes),minutes);phases.push(phase);
entry.querySelector("[data-dot]").dataset.serving=String(phase==="serving");
var back=entry.querySelector("[data-back]");if(back)back.hidden=phase!=="after";
});
var label=labels[barStatus(phases)];
bar.querySelector('[data-line="1"]').textContent=label[0];
bar.querySelector('[data-line="2"]').textContent=label[1];
})()`;

// ─── Component ────────────────────────────────────────────────────────────────

export async function CartStatusBar() {
  let events: Event[];
  let locations: SanityLocation[];
  try {
    const signal = AbortSignal.timeout(SANITY_DEADLINE_MS);
    [events, locations] = await Promise.all([
      client.fetch<Event[]>(EVENTS_QUERY, {}, { next: { revalidate: 60 }, signal }),
      fetchLocations(signal),
    ]);
  } catch (err) {
    console.error("[CartStatusBar] Sanity fetch failed:", err);
    // Saying "No Coffee Today" here could be false, so the bar goes. Never crash the layout.
    return null;
  }

  const renderedOn = todayInCT();

  // Only what the browser needs to work out this day or any later one.
  const exceptionsUntil = addDays(renderedOn, EXCEPTION_WINDOW_DAYS + CACHED_PAGE_MARGIN_DAYS);
  const barLocations: BarLocation[] = locations
    .filter((loc) => isLive(loc, renderedOn))
    .map((loc) => ({
      _id: loc._id,
      name: loc.name,
      startsOn: loc.startsOn,
      endsOn: loc.endsOn,
      weeklyHours: loc.weeklyHours?.map(({ day, open, close }) => ({ day, open, close })),
      exceptions: upcomingExceptions(loc, renderedOn)
        .filter((e) => e.date <= exceptionsUntil)
        .map(({ date, closed, open, close, note }) => ({ date, closed, open, close, note })),
      displayAddress: loc.place?.displayAddress ?? null,
      mapUrl: locationDirectionsUrl(loc),
    }));
  const barEvents: BarEvent[] = events.map((event) => ({
    _id: event._id,
    label: event.locationName || (event.displayAddress ? trimAddress(event.displayAddress) : null),
    displayAddress: event.displayAddress,
    mapUrl: googleMapsUrl(event),
    schedule: (event.schedule ?? [])
      .filter((day) => day.date >= renderedOn)
      .map(({ date, openTime, closeTime }) => ({ date, openTime, closeTime })),
  }));

  return (
    <>
      <CartStatusBarView locations={barLocations} events={barEvents} renderedOn={renderedOn} />
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
    </>
  );
}
