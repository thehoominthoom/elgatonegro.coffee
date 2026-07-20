import type { HeroSlide } from "@/components/home/HeroCarousel";
import type { SanityEvent } from "./types";
import { formatEventDateRange, getHeroTimeContext } from "./dates";
import { urlFor } from "@/sanity/lib/image";
import { trimAddress } from "@/lib/utils";

export function buildHeroSlides(events: SanityEvent[], today: string): HeroSlide[] {
  // Filter to events with images, compute next upcoming date, sort by it
  const withNextDate = events
    .filter((e) => e.image)
    .map((e) => {
      const schedule = e.schedule ?? [];
      const upcoming = schedule.filter((d) => d.date >= today).sort((a, b) => a.date.localeCompare(b.date));
      return { event: e, upcoming, nextDate: upcoming[0]?.date ?? "" };
    })
    .filter((e) => e.nextDate) // exclude events with no upcoming dates
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate));

  return withNextDate.slice(0, 6).map(({ event: e, upcoming }) => {
    const isHappeningNow = upcoming.some((d) => d.date === today);
    const dateRange = upcoming.length ? formatEventDateRange(upcoming) : "";
    const timeContext = upcoming.length ? getHeroTimeContext(upcoming, today, !!e.recurrenceLabel) : null;
    const href =
      e.eventPageType === "external" && e.externalUrl
        ? e.externalUrl
        : e.eventPageType === "internal-link" && e.internalPath
        ? e.internalPath
        : e.eventPageType === "internal" && e.slug
        ? `/events/${e.slug}`
        : "/events";
    return {
      id: e._id,
      title: e.title,
      dateRange,
      timeContext,
      location: e.locationName || (e.location ? trimAddress(e.location) : ""),
      type: e.type ?? "open",
      isHappeningNow,
      recurrenceLabel: e.recurrenceLabel ?? null,
      note: e.note ?? null,
      image: e.image
        ? urlFor(e.image).width(1440).url()
        : "/images/hero/the_exchange-cart-setup-phil.juan-01.webp",
      href,
    };
  });
}
