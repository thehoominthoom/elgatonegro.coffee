"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { trimAddress } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarEvent {
  _id: string;
  title: string;
  locationName: string | null;
  displayAddress: string | null;
  mapLink: string | null;
  type: "open" | "ticketed" | "private" | "fundraiser" | "sale" | "new-swag";
  note: string | null;
  schedule: Array<{ _key: string; date: string; openTime: string; closeTime: string }> | null;
  recurrenceLabel: string | null;
  eventPageType: "internal" | "external" | null;
  externalUrl: string | null;
  description: unknown;
  ctaLabel: string | null;
  ctaUrl: string | null;
  image: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function todayInCT(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

/** Format YYYY-MM-DD → "Mar 17" without UTC shift. */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Format YYYY-MM-DD → "Mar 17–19" or "Mar 29 – Apr 2" for a list of consecutive dates. */
function formatDateRange(dates: string[]): string {
  if (!dates.length) return "";
  const sorted = [...dates].sort();
  if (sorted.length === 1) return formatDate(sorted[0]);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const [, fm] = first.split("-").map(Number);
  const [, lm, ld] = last.split("-").map(Number);
  if (fm === lm) return `${formatDate(first)}–${ld}`;
  return `${formatDate(first)} – ${formatDate(last)}`;
}

/** Get all YYYY-MM-DD dates for a given month (year, 0-indexed month). */
function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/** YYYY-MM-DD from a local Date. */
function toDateStr(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${day}`;
}

/** Get the 7 days of the week containing `dateStr` (Sun–Sat). */
function getWeekDays(dateStr: string): string[] {
  const [y, m, day] = dateStr.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  const dow = d.getDay(); // 0=Sun
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const w = new Date(sunday);
    w.setDate(sunday.getDate() + i);
    return toDateStr(w);
  });
}

/** Events that have a schedule entry on `dateStr`. */
function eventsOnDate(events: CalendarEvent[], dateStr: string): CalendarEvent[] {
  return events.filter((e) => e.schedule?.some((s) => s.date === dateStr) ?? false);
}

/** Dot color class for an event type. */
function dotColor(type: CalendarEvent["type"]): string {
  if (type === "ticketed") return "bg-brand-orange";
  if (type === "fundraiser") return "bg-brand-teal";
  return "bg-brand-black";
}

/** Badge markup for ticketed / fundraiser types. */
function TypeBadge({ type }: { type: CalendarEvent["type"] }) {
  if (type === "ticketed") {
    return (
      <span className="inline-flex font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-orange text-brand-grey px-1.5 py-0.5 shrink-0">
        Ticketed
      </span>
    );
  }
  if (type === "fundraiser") {
    return (
      <span className="inline-flex font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-teal text-brand-grey px-1.5 py-0.5 shrink-0">
        Fundraiser
      </span>
    );
  }
  return null;
}

// ─── Event Card (expand-in-place) ─────────────────────────────────────────────

function EventCard({ event, dateStr }: { event: CalendarEvent; dateStr: string }) {
  const [expanded, setExpanded] = useState(false);
  const schedule = event.schedule ?? [];
  const dayEntry = schedule.find((s) => s.date === dateStr);

  // All dates for this event — used for range display when expanded
  const allDates = schedule.map((s) => s.date).sort();

  const locationDisplay =
    event.locationName ||
    (event.displayAddress ? trimAddress(event.displayAddress) : null);

  return (
    <div
      className="border border-brand-black/10 hover:border-brand-black/25 transition-colors cursor-pointer"
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Collapsed row */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={event.type} />
          </div>
          <span className="font-display font-bold text-lg uppercase tracking-tight text-brand-black leading-tight">
            {event.title}
          </span>
          {dayEntry && (
            <span className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black/60">
              {dayEntry.openTime} – {dayEntry.closeTime} CT
            </span>
          )}
          {event.note && (
            <span className="font-sans text-xs text-brand-black/50 italic">
              {event.note}
            </span>
          )}
          {locationDisplay && (
            <span className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black/50">
              {locationDisplay}
            </span>
          )}
        </div>
        <span className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-orange shrink-0 mt-1">
          {expanded ? "Close" : "Details"}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-5 border-t border-brand-black/10 pt-4 flex flex-col gap-3">
          {/* Full date range */}
          {allDates.length > 1 && (
            <div>
              <span className="font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] text-brand-black/50">
                Full Run
              </span>
              <p className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black mt-0.5">
                {formatDateRange(allDates)}
              </p>
            </div>
          )}

          {/* All times */}
          {schedule.length > 0 && (
            <div>
              <span className="font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] text-brand-black/50">
                Hours
              </span>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {schedule.map((s) => (
                  <p key={s._key} className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black">
                    {formatDate(s.date)}: {s.openTime} – {s.closeTime} CT
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {(locationDisplay || event.mapLink) && (
            <div>
              <span className="font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] text-brand-black/50">
                Location
              </span>
              {event.mapLink ? (
                <a
                  href={event.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 mt-0.5 font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-orange hover:text-brand-black transition-colors underline-offset-2 hover:underline"
                >
                  {locationDisplay} <ExternalLink size={10} />
                </a>
              ) : (
                <p className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black mt-0.5">
                  {locationDisplay}
                </p>
              )}
            </div>
          )}

          {/* Recurrence label */}
          {event.recurrenceLabel && (
            <p className="font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] text-brand-black/50">
              {event.recurrenceLabel}
            </p>
          )}

          {/* External link / CTA */}
          {event.eventPageType === "external" && event.externalUrl && (
            <a
              href={event.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="self-start inline-flex items-center gap-1.5 font-sans font-extrabold text-xs uppercase tracking-[0.15em] bg-brand-orange text-brand-grey px-4 py-2 hover:bg-brand-black transition-colors"
            >
              {event.ctaLabel || "Get Tickets"} <ExternalLink size={11} />
            </a>
          )}
          {event.eventPageType === "internal" && event.ctaLabel && event.ctaUrl && (
            <a
              href={event.ctaUrl}
              onClick={(e) => e.stopPropagation()}
              className="self-start inline-flex items-center gap-1.5 font-sans font-extrabold text-xs uppercase tracking-[0.15em] bg-brand-orange text-brand-grey px-4 py-2 hover:bg-brand-black transition-colors"
            >
              {event.ctaLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Event List (shared between desktop + mobile) ─────────────────────────────

function EventList({ events, dateStr }: { events: CalendarEvent[]; dateStr: string }) {
  if (!events.length) {
    return (
      <p className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black/40 py-8">
        Nothing brewing that day.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {events.map((e) => (
        <EventCard key={e._id} event={e} dateStr={dateStr} />
      ))}
    </div>
  );
}

// ─── Desktop Month Grid ───────────────────────────────────────────────────────

function MonthGrid({ events }: { events: CalendarEvent[] }) {
  const todayStr = todayInCT();
  const [todayY, todayM] = todayStr.split("-").map(Number);

  const [viewYear, setViewYear] = useState(todayY);
  const [viewMonth, setViewMonth] = useState(todayM - 1); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  const days = getDaysInMonth(viewYear, viewMonth);
  const firstDow = days[0]?.getDay() ?? 0;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const selectedEvents = selectedDate ? eventsOnDate(events, selectedDate) : [];

  return (
    <div>
      {/* Month nav header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="p-2 hover:text-brand-orange transition-colors text-brand-black/60"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-display font-bold text-3xl uppercase tracking-tight text-brand-black">
          {MONTHS[viewMonth]} {viewYear}
        </h2>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="p-2 hover:text-brand-orange transition-colors text-brand-black/60"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-center">
            <span className="font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] text-brand-black/40">
              {d}
            </span>
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 border-l border-t border-brand-black/20">
        {/* Leading blank cells */}
        {Array.from({ length: firstDow }, (_, i) => (
          <div key={`blank-${i}`} className="border-r border-b border-brand-black/20 h-[72px]" />
        ))}

        {days.map((d) => {
          const dateStr = toDateStr(d);
          const dayEvents = eventsOnDate(events, dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const visibleDots = dayEvents.slice(0, 3);
          const overflow = dayEvents.length - 3;

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={`border-r border-b border-brand-black/20 h-[72px] p-1.5 cursor-pointer transition-colors ${
                isSelected
                  ? "bg-brand-black"
                  : isToday
                  ? "hover:bg-brand-black/5 shadow-[0_0_12px_4px_#2A201D33]"
                  : "hover:bg-brand-black/5"
              }`}
            >
              {/* Date number */}
              <div className="mb-1">
                <span
                  className={`font-sans font-extrabold text-xs tabular-nums ${
                    isSelected
                      ? "text-brand-grey"
                      : isToday
                      ? "text-brand-orange"
                      : "text-brand-black/70"
                  }`}
                >
                  {d.getDate()}
                </span>
              </div>
              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {visibleDots.map((e) => (
                    <span
                      key={e._id}
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected ? "opacity-60" : ""
                      } ${dotColor(e.type)}`}
                    />
                  ))}
                  {overflow > 0 && (
                    <span className="text-[8px] text-brand-black/40 leading-none">
                      +{overflow}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Event list for selected day */}
      {selectedDate && (
        <div className="mt-8">
          <p className="font-sans font-extrabold text-sm uppercase tracking-[0.15em] text-brand-black border-l-2 border-brand-orange pl-3 mb-4">
            {formatDate(selectedDate)}
          </p>
          <EventList events={selectedEvents} dateStr={selectedDate} />
        </div>
      )}
    </div>
  );
}

// ─── Mobile Week Strip ────────────────────────────────────────────────────────

function WeekStrip({ events }: { events: CalendarEvent[] }) {
  const todayStr = todayInCT();

  const [weekDays, setWeekDays] = useState<string[]>(() => getWeekDays(todayStr));
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Swipe tracking
  const touchStartX = useRef<number | null>(null);

  function prevWeek() {
    const [y, m, d] = weekDays[0].split("-").map(Number);
    const prev = new Date(y, m - 1, d - 7);
    setWeekDays(getWeekDays(toDateStr(prev)));
  }
  function nextWeek() {
    const [y, m, d] = weekDays[0].split("-").map(Number);
    const next = new Date(y, m - 1, d + 7);
    setWeekDays(getWeekDays(toDateStr(next)));
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta < -50) nextWeek();
    else if (delta > 50) prevWeek();
  }

  const selectedEvents = eventsOnDate(events, selectedDate);

  // Week label: "Mar 17 – Mar 23"
  const weekLabel = `${formatDate(weekDays[0])} – ${formatDate(weekDays[6])}`;

  return (
    <div>
      {/* Week nav */}
      <div className="flex items-center justify-between mb-4 border-b border-brand-black/10">
        <button
          onClick={prevWeek}
          aria-label="Previous week"
          className="p-2 hover:text-brand-orange transition-colors text-brand-black/60"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/60">
          {weekLabel}
        </span>
        <button
          onClick={nextWeek}
          aria-label="Next week"
          className="p-2 hover:text-brand-orange transition-colors text-brand-black/60"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 7-day strip */}
      <div
        className="grid grid-cols-7 gap-1 mb-6"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {weekDays.map((dateStr) => {
          const [, , dayNum] = dateStr.split("-").map(Number);
          // dow unused — kept for future weekday display
          const dayDate = (() => {
            const [y, mo, dy] = dateStr.split("-").map(Number);
            return new Date(y, mo - 1, dy);
          })();
          const dayEvents = eventsOnDate(events, dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex flex-col items-center gap-1 py-2 px-1 transition-colors ${
                isSelected ? "bg-brand-black" : isToday ? "bg-brand-black/5 shadow-[0_0_12px_4px_#2A201D33]" : ""
              }`}
            >
              <span
                className={`font-sans font-extrabold text-[10px] uppercase tracking-[0.1em] ${
                  isSelected ? "text-brand-grey/60" : "text-brand-black/40"
                }`}
              >
                {DAYS_OF_WEEK[dayDate.getDay()]}
              </span>
              <span
                className={`font-sans font-extrabold text-sm tabular-nums ${
                  isSelected ? "text-brand-grey" : isToday ? "text-brand-orange" : "text-brand-black"
                }`}
              >
                {dayNum}
              </span>
              {/* Event dots */}
              <div className="flex gap-0.5 flex-wrap justify-center min-h-[8px]">
                {dayEvents.slice(0, 3).map((e) => (
                  <span
                    key={e._id}
                    className={`w-1 h-1 rounded-full ${dotColor(e.type)} ${isSelected ? "opacity-60" : ""}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Event list */}
      <div>
        <p className="font-sans font-extrabold text-sm uppercase tracking-[0.15em] text-brand-black border-l-2 border-brand-orange pl-3 mb-4">
          {formatDate(selectedDate)}
        </p>
        <EventList events={selectedEvents} dateStr={selectedDate} />
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export function EventCalendar({ events }: { events: CalendarEvent[] }) {
  return (
    <>
      {/* Desktop: month grid */}
      <div className="hidden md:block">
        <MonthGrid events={events} />
      </div>
      {/* Mobile: week strip */}
      <div className="md:hidden">
        <WeekStrip events={events} />
      </div>
    </>
  );
}
