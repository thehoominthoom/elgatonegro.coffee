import type { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { addDays, compactTime, dayDateLabel, to12h, weekdayLabel } from "@/lib/home/dates";

// The schedule rules every location surface shares. Nothing here touches Sanity,
// so the status bar can run them in the browser.

// ─── Types ────────────────────────────────────────────────────────────────────

interface WeeklyHoursRow {
  day?: string;
  open?: string;
  close?: string;
}

export interface LocationException {
  date?: string;
  closed?: boolean;
  open?: string;
  close?: string;
  note?: string;
}

export interface SanityLocation {
  _id: string;
  name: string;
  shortName?: string | null;
  slug: string;
  isPublic?: boolean;
  place?: { placeId?: string; displayAddress?: string } | null;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  } | null;
  wayfinding?: string;
  startsOn?: string;
  endsOn?: string | null;
  weeklyHours?: WeeklyHoursRow[] | null;
  exceptions?: LocationException[] | null;
  image?: (SanityImageObject & { alt?: string }) | null;
  hasMenu: boolean;
}

export type LocationSchedule = Pick<
  SanityLocation,
  "isPublic" | "startsOn" | "endsOn" | "weeklyHours" | "exceptions"
>;

export type DayStatus =
  | { open: true; opens: string; closes: string }
  /** `explicit` marks a closure entered for that date, not a day merely missing from the week. */
  | { open: false; explicit: boolean; note: string | null };

// ─── Rules ────────────────────────────────────────────────────────────────────

/** Notices and the status bar's "back" line look this far ahead. */
export const EXCEPTION_WINDOW_DAYS = 14;

const WEEK = [
  ["Monday", "Mon"],
  ["Tuesday", "Tue"],
  ["Wednesday", "Wed"],
  ["Thursday", "Thu"],
  ["Friday", "Fri"],
  ["Saturday", "Sat"],
  ["Sunday", "Sun"],
] as const;

/** Shown from creation until the day after `endsOn`. Before `startsOn` it still
 *  shows, with the "Starting …" line. */
export function isLive(loc: LocationSchedule, today: string): boolean {
  return loc.isPublic !== false && !!loc.startsOn && (!loc.endsOn || today <= loc.endsOn);
}

/** Mon→Sun with each day's hours; a day missing from Sanity is closed. The first
 *  row wins if Studio validation was bypassed and a day appears twice. */
export function weekHours(loc: LocationSchedule) {
  const byDay = new Map<string, { open: string; close: string }>();
  for (const row of loc.weeklyHours ?? []) {
    if (row.day && row.open && row.close && !byDay.has(row.day)) {
      byDay.set(row.day, { open: row.open, close: row.close });
    }
  }
  return WEEK.map(([day, short]) => ({ day, short, ...byDay.get(day) }));
}

/** Exceptions dated today or later that carry something renderable. */
export function upcomingExceptions(loc: LocationSchedule, today: string) {
  return (loc.exceptions ?? [])
    .filter(
      (e): e is LocationException & { date: string } =>
        !!e.date && e.date >= today && (e.closed !== false || (!!e.open && !!e.close))
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** One date's status: an exception for that date, else its weekly row, else closed. */
export function dayStatus(loc: LocationSchedule, date: string): DayStatus {
  const exception = upcomingExceptions(loc, date).find((e) => e.date === date);
  if (exception) {
    return exception.closed !== false
      ? { open: false, explicit: true, note: exception.note?.trim() || null }
      : { open: true, opens: exception.open!, closes: exception.close! };
  }
  const row = weekHours(loc).find(({ short }) => short === weekdayLabel(date));
  return row?.open && row.close
    ? { open: true, opens: row.open, closes: row.close }
    : { open: false, explicit: false, note: null };
}

/** "Back tomorrow at 7 AM", or null when nothing opens inside the window. */
export function backLine(loc: LocationSchedule, today: string): string | null {
  for (let ahead = 1; ahead <= EXCEPTION_WINDOW_DAYS; ahead++) {
    const date = addDays(today, ahead);
    if (loc.endsOn && date > loc.endsOn) return null;
    const status = dayStatus(loc, date);
    if (!status.open) continue;
    const when = ahead === 1 ? "tomorrow" : ahead <= 6 ? weekdayLabel(date) : dayDateLabel(date);
    return `Back ${when} at ${compactTime(to12h(status.opens))}`;
  }
  return null;
}
