import { urlFor } from "@/sanity/lib/image";
import { isLive, upcomingExceptions, weekHours, type SanityLocation } from "@/lib/locations";

const BASE_URL = "https://www.elgatonegro.coffee";

/**
 * A CafeOrCoffeeShop node for one fixed location, emitted on the homepage
 * beside the LocalBusiness "#business" node. It is a separate node on purpose:
 * "#business" is every services page's Service.provider (service-graph.ts), so
 * it stays the mobile business and this node carries the fixed address.
 *
 * Emitted before `startsOn` too — the page shows the hours then, and validFrom
 * tells consumers when they begin. null once the location is hidden or past
 * `endsOn`, matching what the page renders.
 */
export function locationJsonLd(loc: SanityLocation, today: string) {
  if (!isLive(loc, today)) return null;

  // Identical hours on any days, adjacent or not, share one entry.
  const byHours = new Map<string, { open: string; close: string; days: string[] }>();
  for (const { day, open, close } of weekHours(loc)) {
    if (!open || !close) continue;
    const key = `${open}-${close}`;
    const group = byHours.get(key) ?? { open, close, days: [] };
    group.days.push(day);
    byHours.set(key, group);
  }

  const a = loc.address ?? {};

  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    // The slug is the stable half of this id — never rename a published slug.
    "@id": `${BASE_URL}/#location-${loc.slug}`,
    name: "El Gato Negro Coffee",
    parentOrganization: { "@id": `${BASE_URL}/#business` },
    url: `${BASE_URL}/#locations`,
    description: `El Gato Negro's coffee cart inside ${loc.name}.`,
    ...(loc.image?.asset && { image: urlFor(loc.image).width(1200).url() }),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.streetAddress,
      addressLocality: a.addressLocality,
      addressRegion: a.addressRegion,
      postalCode: a.postalCode,
      addressCountry: a.addressCountry || "US",
    },
    containedInPlace: { "@type": "Place", name: loc.name },
    openingHoursSpecification: [...byHours.values()].map(({ open, close, days }) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens: open,
      closes: close,
      validFrom: loc.startsOn,
      ...(loc.endsOn && { validThrough: loc.endsOn }),
    })),
    specialOpeningHoursSpecification: upcomingExceptions(loc, today).map((e) => ({
      "@type": "OpeningHoursSpecification",
      opens: e.closed !== false ? "00:00" : e.open,
      closes: e.closed !== false ? "00:00" : e.close,
      validFrom: e.date,
      validThrough: e.date,
    })),
  };
}

/** JSON for a <script type="application/ld+json"> body. Escapes "<" so CMS text
 *  can never close the script element early. */
export function serializeJsonLd(node: object): string {
  return JSON.stringify(node).replace(/</g, "\\u003c");
}
