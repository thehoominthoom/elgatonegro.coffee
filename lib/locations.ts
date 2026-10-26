import type { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { googleMapsUrl } from "@/lib/maps";
import { addDays, dayDateLabel, formatTimeRange, to12h } from "@/lib/home/dates";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WeeklyHoursRow {
  day?: string;
  open?: string;
  close?: string;
}

interface LocationException {
  date?: string;
  closed?: boolean;
  open?: string;
  close?: string;
  note?: string;
}

export interface SanityLocation {
  _id: string;
  name: string;
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

export interface LocationDisplay {
  slug: string;
  name: string;
  wayfinding: string;
  /** Pre-start and exception lines, in display order. */
  notices: string[];
  /** Adjacent identical days collapsed: { days: "Mon–Fri", hours: "7 AM–11 AM" }. null hours = closed. */
  hours: Array<{ days: string; hours: string | null }>;
  fullAddress: string | null;
  streetAddress: string | null;
  directionsUrl: string | null;
  image: { src: string; alt: string } | null;
  hasMenu: boolean;
}

// ─── Query ────────────────────────────────────────────────────────────────────

// Dates are compared in JS against todayInCT(), not in GROQ, so the CT calendar
// day decides every state and the cached response stays date-independent.
const LOCATIONS_QUERY = `*[
  _type == "location" &&
  isPublic == true &&
  defined(slug.current) &&
  defined(startsOn)
] | order(order asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  isPublic,
  place,
  address,
  wayfinding,
  startsOn,
  endsOn,
  weeklyHours,
  exceptions,
  image,
  "hasMenu": defined(menu->_id)
}`;

export async function getLocations(): Promise<SanityLocation[]> {
  try {
    return await client.fetch<SanityLocation[]>(LOCATIONS_QUERY, {}, { next: { revalidate: 60 } });
  } catch {
    // Sanity unavailable — the section renders nothing rather than failing the page.
    return [];
  }
}

// ─── Shared rules ─────────────────────────────────────────────────────────────

/** Notices look this far ahead. */
const EXCEPTION_WINDOW_DAYS = 14;

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
export function isLive(loc: SanityLocation, today: string): boolean {
  return loc.isPublic !== false && !!loc.startsOn && (!loc.endsOn || today <= loc.endsOn);
}

/** Mon→Sun with each day's hours; a day missing from Sanity is closed. The first
 *  row wins if Studio validation was bypassed and a day appears twice. */
export function weekHours(loc: SanityLocation) {
  const byDay = new Map<string, { open: string; close: string }>();
  for (const row of loc.weeklyHours ?? []) {
    if (row.day && row.open && row.close && !byDay.has(row.day)) {
      byDay.set(row.day, { open: row.open, close: row.close });
    }
  }
  return WEEK.map(([day, short]) => ({ day, short, ...byDay.get(day) }));
}

/** Exceptions dated today or later that carry something renderable. */
export function upcomingExceptions(loc: SanityLocation, today: string) {
  return (loc.exceptions ?? [])
    .filter(
      (e): e is LocationException & { date: string } =>
        !!e.date && e.date >= today && (e.closed !== false || (!!e.open && !!e.close))
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Display ──────────────────────────────────────────────────────────────────

function exceptionLine(e: LocationException & { date: string }, today: string): string {
  const isToday = e.date === today;
  if (e.closed !== false) {
    return [`Closed ${isToday ? "today" : dayDateLabel(e.date)}`, e.note?.trim()].filter(Boolean).join(" · ");
  }
  const hours = formatTimeRange(to12h(e.open), to12h(e.close));
  return `${isToday ? "Today" : dayDateLabel(e.date)}: ${hours} instead`;
}

function noticesFor(loc: SanityLocation, today: string): string[] {
  const notices: string[] = [];
  if (loc.startsOn && today < loc.startsOn) notices.push(`Starting ${dayDateLabel(loc.startsOn)}`);

  // The next two inside the window. Two closures share one line; the note is
  // dropped there because "Closed A · note & B" has no clean reading.
  const horizon = addDays(today, EXCEPTION_WINDOW_DAYS);
  const [first, second] = upcomingExceptions(loc, today).filter((e) => e.date <= horizon);
  if (first && second && first.closed !== false && second.closed !== false) {
    const label = (date: string) => (date === today ? "today" : dayDateLabel(date));
    notices.push(`Closed ${label(first.date)} & ${label(second.date)}`);
  } else {
    for (const e of [first, second]) if (e) notices.push(exceptionLine(e, today));
  }
  return notices;
}

function groupHours(loc: SanityLocation): LocationDisplay["hours"] {
  const groups: Array<{ from: string; to: string; hours: string | null }> = [];
  for (const { short, open, close } of weekHours(loc)) {
    const hours = open && close ? formatTimeRange(to12h(open), to12h(close)) : null;
    const last = groups[groups.length - 1];
    if (last && last.hours === hours) last.to = short;
    else groups.push({ from: short, to: short, hours });
  }
  return groups.map(({ from, to, hours }) => ({ days: from === to ? from : `${from}–${to}`, hours }));
}

/** Everything both variants render, or null when the location shouldn't show. */
export function getLocationDisplay(loc: SanityLocation, today: string): LocationDisplay | null {
  if (!isLive(loc, today)) return null;

  const a = loc.address ?? {};
  const streetAddress = a.streetAddress?.trim() || null;
  const cityLine = [a.addressLocality?.trim(), [a.addressRegion, a.postalCode].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const fullAddress = [streetAddress, cityLine].filter(Boolean).join(", ") || null;

  return {
    slug: loc.slug,
    name: loc.name,
    wayfinding: loc.wayfinding?.trim() ?? "",
    notices: noticesFor(loc, today),
    hours: groupHours(loc),
    fullAddress,
    streetAddress,
    // Until the Studio place is picked, the typed postal address still gives
    // Maps a query to resolve.
    directionsUrl: googleMapsUrl({
      placeId: loc.place?.placeId,
      displayAddress: loc.place?.displayAddress || fullAddress,
    }),
    image: loc.image?.asset
      ? { src: urlFor(loc.image).width(1200).height(1500).url(), alt: loc.image.alt?.trim() ?? "" }
      : null,
    hasMenu: loc.hasMenu,
  };
}
