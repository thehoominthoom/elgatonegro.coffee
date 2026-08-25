import type { SanityEvent, ScheduleDay } from "./types";
import { addDays, formatEventDate, formatEventDateRange, formatTimeRange } from "./dates";

export type StripRow = {
  key: string;
  event: SanityEvent;
  displayDate: string;
  displayTime: string;
  sortDate: string;
};

const WINDOW_DAYS = 7;
const MAX_ROWS = 8;
const FALLBACK_ROWS = 3;

/**
 * Hours for one row's dates. A single-date row is a set of one, so it needs no
 * special case: uniform hours print and mixed hours refuse to pick one.
 *
 * Uniformity is judged on what would actually print, not on the raw fields. A
 * date missing its close time reads "9 AM" where its siblings read "9 AM–3 PM",
 * and that is a difference a reader would notice — so the row varies. When every
 * date is missing its open time they all render "", which is uniform, and the
 * row prints no time at all.
 */
function rowDisplayTime(dates: ScheduleDay[]): string {
  const times = dates.map((d) => formatTimeRange(d.openTime, d.closeTime));
  const [first = ""] = times;
  return times.every((t) => t === first) ? first : "Times vary";
}

/** Rows for every schedule date in [from, until], sorted. `until` null = unbounded. */
function collectRows(events: SanityEvent[], from: string, until: string | null): StripRow[] {
  const rows: StripRow[] = [];

  for (const event of events) {
    const schedule = event.schedule ?? [];
    if (!schedule.length) continue;

    const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
    const windowDates = sorted.filter((d) => d.date >= from && (until === null || d.date <= until));
    if (!windowDates.length) continue;

    // Detect consecutive (multi-day) vs recurring (gaps between dates).
    // Every check below operates on windowDates only — dates outside the window
    // must not influence the consecutive test, the range, or the hours. A
    // recurring event straddling the window edge must not collapse into a range.
    const isConsecutive = windowDates.every((d, i) => {
      if (i === 0) return true;
      const prev = new Date(windowDates[i - 1].date);
      const curr = new Date(d.date);
      return (curr.getTime() - prev.getTime()) === 86400000;
    });

    if (isConsecutive) {
      rows.push({
        key: event._id,
        event,
        displayDate: formatEventDateRange(windowDates),
        displayTime: rowDisplayTime(windowDates),
        sortDate: windowDates[0].date,
      });
    } else {
      for (const d of windowDates) {
        rows.push({
          key: `${event._id}-${d._key}`,
          event,
          displayDate: formatEventDate(d.date),
          displayTime: rowDisplayTime([d]),
          sortDate: d.date,
        });
      }
    }
  }

  rows.sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  return rows;
}

export function buildStripRows(events: SanityEvent[], today: string): StripRow[] {
  const thisWeek = collectRows(events, today, addDays(today, WINDOW_DAYS));
  if (thisWeek.length) return thisWeek.slice(0, MAX_ROWS);
  // Nothing in the next week — show the soonest few so the strip is never empty.
  return collectRows(events, today, null).slice(0, FALLBACK_ROWS);
}
