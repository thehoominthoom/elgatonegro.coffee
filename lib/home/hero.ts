import type { HeroSlide } from "@/components/home/HeroCarousel";
import type { SanityEvent } from "./types";
import { formatEventDateRange, getHeroTimeContext } from "./dates";
import { urlFor } from "@/sanity/lib/image";
import { trimAddress } from "@/lib/utils";

export function buildHeroSlides(events: SanityEvent[], today: string): HeroSlide[] {
  return events.filter((e) => e.image).slice(0, 6).map((e) => {
    const schedule = e.schedule ?? [];
    const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
    const isHappeningNow = sorted.some((d) => d.date === today);
    const dateRange = sorted.length ? formatEventDateRange(sorted) : "";
    const timeContext = sorted.length ? getHeroTimeContext(sorted, today, !!e.recurrenceLabel) : null;
    const href =
      e.eventPageType === "external" && e.externalUrl
        ? e.externalUrl
        : e.slug
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
      image: e.image
        ? urlFor(e.image).width(1440).url()
        : "/images/hero/hero-barista_roasting.webp",
      href,
    };
  });
}
