"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  barStatus,
  buildBarDay,
  clockMinutes,
  entryPhase,
  readClockCT,
  STATUS_LABELS,
  type BarEvent,
  type BarLocation,
} from "@/lib/home/status-bar";

function subscribeToClock(onChange: () => void) {
  const timer = setInterval(onChange, 30_000);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", onChange);
  };
}

const PLACE_CLASS = "font-sans font-semibold text-[10px] text-brand-black/85 uppercase tracking-[0.1em] whitespace-nowrap";

interface Props {
  locations: BarLocation[];
  events: BarEvent[];
  renderedOn: string;
}

/** The server knows the date it rendered, not the time, and a cached page can be
 *  older than today. Everything is worked out again here from the browser clock.
 *
 *  The attributes and text that change with the clock carry
 *  suppressHydrationWarning because CartStatusBar's pre-paint script has already
 *  set them to these same values by the time React hydrates. */
export function CartStatusBarView({ locations, events, renderedOn }: Props) {
  const clock = useSyncExternalStore(subscribeToClock, readClockCT, () => null);
  const today = clock?.slice(0, 10) ?? renderedOn;
  const minutes = clock === null ? null : clockMinutes(clock);

  const { entries, carts, closures } = buildBarDay(locations, events, today);
  const isOpen = entries.length > 0;
  const phases = entries.map(({ opensAt, closesAt }) =>
    minutes === null ? "unplaced" : entryPhase(opensAt, closesAt, minutes)
  );
  const [line1, line2] = STATUS_LABELS[isOpen ? (minutes === null ? "today" : barStatus(phases)) : "closed"];
  const details = closures.filter(({ back, note }) => back || note);

  return (
    <div
      id="cart-status-bar"
      data-day={today}
      data-clock={clock === null ? "server" : "live"}
      suppressHydrationWarning
      className={`w-full min-h-14 py-2 border-b border-brand-black/10 data-[clock=stale]:invisible ${
        isOpen ? "bg-brand-yellow" : "bg-brand-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center gap-x-6 overflow-x-auto scrollbar-hide">
        <span
          className={`font-sans font-semibold text-sm md:text-base uppercase tracking-[0.3em] shrink-0 ${
            isOpen ? "text-brand-black" : "text-brand-grey/60"
          }`}
        >
          {carts >= 2 && (
            <span className="block text-[10px] tracking-[0.2em] text-brand-black/85">{carts} Carts</span>
          )}
          <span data-line="1" suppressHydrationWarning className="block">{line1}</span>
          <span data-line="2" suppressHydrationWarning className="block">{line2}</span>
        </span>

        {(isOpen || details.length > 0) && (
          <span className={`hidden md:block self-stretch w-0.5 shrink-0 ${isOpen ? "bg-brand-black/30" : "bg-brand-grey/30"}`} />
        )}

        {entries.map(({ key, hours, label, mapUrl, opensAt, closesAt, back }, i) => (
          <div
            key={key}
            data-entry
            data-opens={opensAt ?? undefined}
            data-closes={closesAt ?? undefined}
            className="flex items-start gap-3 shrink-0"
          >
            <span
              data-dot
              data-serving={phases[i] === "serving"}
              suppressHydrationWarning
              className="w-1.5 h-1.5 rounded-full bg-brand-orange data-[serving=true]:animate-pulse shrink-0 mt-1.5"
            />
            <div className="flex flex-col">
              {hours && (
                <span className="font-sans font-semibold text-sm uppercase tracking-[0.05em] text-brand-black whitespace-nowrap">
                  {hours}
                </span>
              )}
              {label && (
                mapUrl ? (
                  <Link
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${PLACE_CLASS} hover:text-brand-black underline-offset-2 hover:underline transition-colors`}
                  >
                    {label}
                  </Link>
                ) : (
                  <span className={PLACE_CLASS}>{label}</span>
                )
              )}
              {back && (
                <span data-back hidden={phases[i] !== "after"} suppressHydrationWarning className={PLACE_CLASS}>
                  {back}
                </span>
              )}
            </div>
          </div>
        ))}

        {!isOpen && details.map(({ key, back, note }) => (
          <div key={key} className="flex flex-col shrink-0">
            <span className="font-sans font-semibold text-sm uppercase tracking-[0.05em] text-brand-grey whitespace-nowrap">
              {back ?? note}
            </span>
            {back && note && (
              <span className="font-sans font-semibold text-[10px] text-brand-grey/85 uppercase tracking-[0.1em] whitespace-nowrap">
                {note}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
