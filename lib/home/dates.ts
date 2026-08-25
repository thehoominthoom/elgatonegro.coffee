import type { ScheduleDay } from "./types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Today's date in CT as YYYY-MM-DD */
export function todayInCT(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });
}

/** YYYY-MM-DD shifted by whole days. Parsed and re-read in local calendar
 *  terms, so the offset never crosses a timezone boundary. */
export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const shifted = new Date(year, month - 1, day + days);
  const shiftedMonth = String(shifted.getMonth() + 1).padStart(2, "0");
  const shiftedDay = String(shifted.getDate()).padStart(2, "0");
  return `${shifted.getFullYear()}-${shiftedMonth}-${shiftedDay}`;
}

/** Format a single YYYY-MM-DD date string for display — no UTC shift risk. */
export function formatEventDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatEventDateRange(schedule: ScheduleDay[]): string {
  if (!schedule.length) return "";
  const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0].date;
  const last = sorted[sorted.length - 1].date;
  if (first === last) return formatEventDate(first);
  const [, fm] = first.split("-").map(Number);
  const [, lm] = last.split("-").map(Number);
  if (fm === lm) {
    const [, , ld] = last.split("-").map(Number);
    return `${formatEventDate(first)}–${ld}`;
  }
  return `${formatEventDate(first)} – ${formatEventDate(last)}`;
}

/** "Sat" — no distance threshold. The caller picks weekday or date by what the
 *  line above already shows, not by how far away the day is. */
function weekdayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return DAY_NAMES[new Date(year, month - 1, day).getDay()];
}

/** "Aug 28" */
function monthDayLabel(dateStr: string): string {
  const [, month, day] = dateStr.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}`;
}

/** Schedule times are free-typed in Sanity — treat absent or blank as "no time". */
export function trimTime(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Compose an open/close pair for display. `closeTime` only gained its
 *  `Rule.required()` after documents already existed, and drafts skip validation
 *  entirely, so either half can arrive blank at render time.
 *
 *  Blank close → the open time alone, separator dropped: "9:00 AM".
 *  Blank open  → nothing at all. A closing time with no opening time tells a
 *  reader nothing useful and has no sensible phrasing. */
export function formatHours(
  open: string | null | undefined,
  close: string | null | undefined,
  separator = " – "
): string {
  const opens = trimTime(open);
  if (!opens) return "";
  const closes = trimTime(close);
  return closes ? `${opens}${separator}${closes}` : opens;
}

export function getHeroTimeContext(schedule: ScheduleDay[], today: string, isRecurring: boolean): string | null {
  const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
  const todayEntry = sorted.find((d) => d.date === today);
  if (todayEntry) {
    // "Today:" carries nothing once the hours are gone, so the whole line goes.
    // The "Happening Now" badge still marks the event as live.
    const hours = formatHours(todayEntry.openTime, todayEntry.closeTime);
    return hours ? `Today: ${hours} CT` : null;
  }
  const future = sorted.filter((d) => d.date > today);
  if (!future.length) return null;
  const next = future[0];
  const hours = formatHours(next.openTime, next.closeTime);

  // Both branches fill the gap left by the line directly above. What that line
  // omits decides what this one names — never how far off the day is.
  if (isRecurring) {
    // Above reads "{recurrenceLabel} · {dateRange}", so the weekday is already
    // on screen and the date is the missing piece. Unlike "Today:", the date is
    // this line's payload — keep it when the hours are gone.
    const label = `Next: ${monthDayLabel(next.date)}`;
    return hours ? `${label} ${hours} CT` : label;
  }

  // One-off. Above shows exact dates and no weekday, so this line names the
  // weekday — except across a multi-day range with uniform hours, where no one
  // weekday is true of it and an unlabelled time would misstate day two.
  if (!hours) return null;
  const uniform = future.every((d) => formatHours(d.openTime, d.closeTime) === hours);
  return future.length > 1 && uniform
    ? `Daily: ${hours} CT`
    : `${weekdayLabel(next.date)} ${hours} CT`;
}

const TIME_PATTERN = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;

/** Drop ":00" from a whole hour. Anything that isn't H:MM AM/PM — someone will
 *  eventually type "Noon" — passes through rather than getting mangled. */
function compactTime(value: string | null | undefined): string {
  const trimmed = trimTime(value);
  const match = TIME_PATTERN.exec(trimmed);
  if (!match) return trimmed;
  const [, hour, minute, meridiem] = match;
  return minute === "00" ? `${hour} ${meridiem}` : `${hour}:${minute} ${meridiem}`;
}

/** Compact form for the events strip — "9 AM–3 PM". Tight en-dash, both
 *  meridiems always, no CT suffix. Casing comes from the `uppercase` class.
 *  Strip only: the long "9:00 AM – 3:00 PM CT" surfaces stay long on purpose.
 *  A missing close time compacts to the open alone — "9 AM". */
export function formatTimeRange(open: string | null | undefined, close: string | null | undefined): string {
  return formatHours(compactTime(open), compactTime(close), "–");
}
