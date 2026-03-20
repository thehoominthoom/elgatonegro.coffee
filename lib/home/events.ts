import type { SanityEvent, ScheduleDay } from "./types";
import { formatEventDate, formatEventDateRange } from "./dates";

export type StripRow = { key: string; event: SanityEvent; displayDate: string; sortDate: string };

export function buildStripRows(events: SanityEvent[], today: string): StripRow[] {
  const rows: StripRow[] = [];

  for (const event of events) {
    const schedule = event.schedule ?? [];
    if (!schedule.length) continue;

    const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
    const windowDates = sorted.filter((d) => d.date >= today);
    if (!windowDates.length) continue;

    // Detect consecutive (multi-day) vs recurring (gaps between dates).
    // Both checks operate on windowDates only — past dates must not
    // influence the consecutive test or the displayed range.
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
        sortDate: windowDates[0].date,
      });
    } else {
      for (const d of windowDates) {
        rows.push({
          key: `${event._id}-${d._key}`,
          event,
          displayDate: formatEventDate(d.date),
          sortDate: d.date,
        });
      }
    }
  }

  rows.sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  return rows;
}
