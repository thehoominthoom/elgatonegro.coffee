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

/** Day-of-week abbreviation within the next 6 days, "Sep 2" beyond it. */
function dayLabel(dateStr: string, today: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const [todayY, todayM, todayD] = today.split("-").map(Number);
  const todayDate = new Date(todayY, todayM - 1, todayD);
  const diffDays = Math.round((date.getTime() - todayDate.getTime()) / 86400000);
  return diffDays <= 6 ? DAY_NAMES[date.getDay()] : `${MONTH_NAMES[month - 1]} ${day}`;
}

/** Schedule times are free-typed in Sanity — treat absent or blank as "no time". */
export function trimTime(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getHeroTimeContext(schedule: ScheduleDay[], today: string, isRecurring: boolean): string | null {
  const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
  const todayEntry = sorted.find((d) => d.date === today);
  if (todayEntry) {
    return `Today: ${todayEntry.openTime} – ${todayEntry.closeTime} CT`;
  }
  const future = sorted.filter((d) => d.date > today);
  if (!future.length) return null;
  const next = future[0];

  if (isRecurring) {
    return `Next: ${dayLabel(next.date, today)} ${next.openTime}–${next.closeTime} CT`;
  }

  // One-off event. The date range already renders directly above this line, so
  // the day is only worth naming when the hours differ across the upcoming
  // dates — an unlabelled time on a multi-day range misstates day two.
  const open = trimTime(next.openTime);
  const close = trimTime(next.closeTime);
  if (!open || !close) return null;
  const uniform = future.every((d) => trimTime(d.openTime) === open && trimTime(d.closeTime) === close);
  return uniform
    ? `${open} – ${close} CT`
    : `${dayLabel(next.date, today)}: ${open} – ${close} CT`;
}

const TIME_PATTERN = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;

/** Drop ":00" from a whole hour. Anything that isn't H:MM AM/PM — someone will
 *  eventually type "Noon" — passes through rather than getting mangled. */
function compactTime(value: string): string {
  const trimmed = value.trim();
  const match = TIME_PATTERN.exec(trimmed);
  if (!match) return trimmed;
  const [, hour, minute, meridiem] = match;
  return minute === "00" ? `${hour} ${meridiem}` : `${hour}:${minute} ${meridiem}`;
}

/** Compact form for the events strip — "9 AM–3 PM". Tight en-dash, both
 *  meridiems always, no CT suffix. Casing comes from the `uppercase` class.
 *  Strip only: the long "9:00 AM – 3:00 PM CT" surfaces stay long on purpose. */
export function formatTimeRange(open: string, close: string): string {
  return `${compactTime(open)}–${compactTime(close)}`;
}
