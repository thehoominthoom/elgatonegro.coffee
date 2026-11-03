import { backLine, dayStatus, isLive, type LocationSchedule } from "@/lib/location-rules";
import { formatTimeRange, timeToMinutes, to12h } from "@/lib/home/dates";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BarLocation extends LocationSchedule {
  _id: string;
  name: string;
  displayAddress: string | null;
  mapUrl: string | null;
}

export interface BarEvent {
  _id: string;
  label: string | null;
  displayAddress: string | null;
  mapUrl: string | null;
  schedule: Array<{ date: string; openTime?: string | null; closeTime?: string | null }>;
}

export interface BarEntry {
  key: string;
  hours: string;
  label: string | null;
  mapUrl: string | null;
  opensAt: number | null;
  closesAt: number | null;
  /** Only ever set on a Location's entry, never on an event's venue. */
  back: string | null;
}

export interface BarDay {
  entries: BarEntry[];
  /** Distinct places among `entries`. */
  carts: number;
  closures: Array<{ key: string; back: string | null; note: string | null }>;
}

export type EntryPhase = "unplaced" | "before" | "serving" | "after";
export type BarStatus = "today" | "now" | "done";

// ─── Wording ──────────────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<BarStatus | "closed", [string, string]> = {
  today: ["Serving", "Today"],
  now: ["Serving", "Now"],
  done: ["Done For", "Today"],
  closed: ["No Coffee", "Today"],
};

// ─── Clock ────────────────────────────────────────────────────────────────────
//
// CartStatusBar stringifies these four into its pre-paint script, so they must
// stay self-contained: no imports, no module-level references.

/** The current minute in America/Chicago: "2026-11-03 09:05". */
export function readClockCT(): string {
  return new Date().toLocaleString("sv-SE", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export function clockMinutes(clock: string): number {
  return Number(clock.slice(11, 13)) * 60 + Number(clock.slice(14, 16));
}

/** "unplaced" is an entry that cannot be put in time: a blank or unreadable time. */
export function entryPhase(opensAt: number | null, closesAt: number | null, minutes: number): EntryPhase {
  if (opensAt === null || closesAt === null || closesAt <= opensAt) return "unplaced";
  if (minutes < opensAt) return "before";
  return minutes < closesAt ? "serving" : "after";
}

export function barStatus(phases: EntryPhase[]): BarStatus {
  if (phases.indexOf("serving") !== -1) return "now";
  return phases.every((phase) => phase === "after") ? "done" : "today";
}

// ─── The day ──────────────────────────────────────────────────────────────────

/** Location and event places match on the address: their place IDs differ in Sanity. */
function addressKey(address: string | null): string | null {
  return address?.trim().toLowerCase() || null;
}

function barHours(open: string | null | undefined, close: string | null | undefined): string {
  const hours = formatTimeRange(open, close);
  return hours && `${hours} CT`;
}

export function buildBarDay(locations: BarLocation[], events: BarEvent[], today: string): BarDay {
  const entries: BarEntry[] = [];
  const closures: BarDay["closures"] = [];
  const places = new Set<string>();
  // Addresses whose Location already decides today, so an event there adds nothing.
  const decided = new Set<string | null>();

  for (const loc of locations) {
    if (!isLive(loc, today) || today < loc.startsOn!) continue;
    const status = dayStatus(loc, today);
    const address = addressKey(loc.displayAddress);
    const back = backLine(loc, today);

    if (status.open) {
      entries.push({
        key: loc._id,
        hours: barHours(to12h(status.opens), to12h(status.closes)),
        label: loc.name,
        mapUrl: loc.mapUrl,
        opensAt: timeToMinutes(to12h(status.opens)),
        closesAt: timeToMinutes(to12h(status.closes)),
        back,
      });
      places.add(address ?? loc._id);
    } else {
      closures.push({ key: loc._id, back, note: status.note });
    }
    // A day merely missing from the week leaves events alone: a public event
    // there is a real extra opening.
    if (address && (status.open || status.explicit)) decided.add(address);
  }

  for (const event of events) {
    const row = event.schedule.find((day) => day.date === today);
    const address = addressKey(event.displayAddress);
    if (!row || decided.has(address)) continue;
    entries.push({
      key: event._id,
      hours: barHours(row.openTime, row.closeTime),
      label: event.label,
      mapUrl: event.mapUrl,
      opensAt: timeToMinutes(row.openTime),
      closesAt: timeToMinutes(row.closeTime),
      back: null,
    });
    places.add(address ?? event.label?.trim().toLowerCase() ?? event._id);
  }

  return { entries, carts: places.size, closures };
}
