import type { ScheduleDay } from "./types";

/** Today's date in CT as YYYY-MM-DD */
export function todayInCT(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });
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

export function getHeroTimeContext(schedule: ScheduleDay[], today: string, isRecurring: boolean): string | null {
  const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
  const todayEntry = sorted.find((d) => d.date === today);
  if (todayEntry) {
    return `Today: ${todayEntry.openTime} – ${todayEntry.closeTime} CT`;
  }
  if (!isRecurring) return null;
  const future = sorted.filter((d) => d.date > today);
  if (!future.length) return null;
  const next = future[0];
  const [ny, nm, nd] = next.date.split("-").map(Number);
  const nextDate = new Date(ny, nm - 1, nd);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dow = dayNames[nextDate.getDay()];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [todayY, todayM, todayD] = today.split("-").map(Number);
  const todayDate = new Date(todayY, todayM - 1, todayD);
  const diffDays = Math.round((nextDate.getTime() - todayDate.getTime()) / 86400000);
  const dayLabel = diffDays <= 6 ? dow : `${monthNames[nm - 1]} ${nd}`;
  return `Next: ${dayLabel} ${next.openTime}–${next.closeTime} CT`;
}
