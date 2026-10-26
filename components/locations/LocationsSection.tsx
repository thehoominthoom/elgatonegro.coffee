import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LocationDisplay } from "@/lib/locations";

interface LocationsSectionProps {
  locations: LocationDisplay[];
  /** "home": full section with photo and placard. "compact": the /events strip. */
  variant?: "home" | "compact";
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange";

function Notices({ notices }: { notices: string[] }) {
  return notices.map((notice) => (
    <p
      key={notice}
      className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-orange"
    >
      {notice}
    </p>
  ));
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

function LocationDetails({ location }: { location: LocationDisplay }) {
  const { name, wayfinding, notices, hours, fullAddress, directionsUrl, hasMenu } = location;
  return (
    <div>
      <h3 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight leading-[1.05] text-brand-black">
        {name}
      </h3>
      {wayfinding && (
        <p className="font-sans text-base leading-relaxed text-brand-black/70 mt-2">{wayfinding}</p>
      )}
      {notices.length > 0 && (
        <div className="mt-4 space-y-1">
          <Notices notices={notices} />
        </div>
      )}

      {/* Hours placard — a shop-door decal. The dot leader is the dt's ::after so
          the dl keeps only dt/dd children. */}
      <dl className="mt-6 max-w-sm border-2 border-brand-black rounded-sm p-5 space-y-2 tabular-nums">
        {hours.map(({ days, hours: time }) => (
          <div key={days} className="flex items-baseline">
            <dt className="flex flex-1 items-baseline font-display font-bold text-base uppercase tracking-[0.15em] text-brand-black after:content-[''] after:flex-1 after:mx-3 after:border-b after:border-dotted after:border-brand-black/30">
              {days}
            </dt>
            <dd className="font-sans font-extrabold text-sm uppercase text-brand-black whitespace-nowrap">
              {time ?? "Closed"}
            </dd>
          </div>
        ))}
      </dl>

      {fullAddress && (
        <address className="not-italic font-sans text-sm text-brand-black/70 mt-6">{fullAddress}</address>
      )}

      {(directionsUrl || hasMenu) && (
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${name} (opens in a new tab)`}
              className={`group inline-flex items-center gap-2 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-6 py-3.5 rounded-sm hover:bg-brand-orange transition-colors duration-300 active:scale-[0.98] ${focusRing}`}
            >
              Get directions
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          )}
          {hasMenu && (
            <Link
              href="/menu"
              className={`font-display text-sm md:text-base uppercase tracking-[0.2em] text-brand-black/70 hover:text-brand-orange underline-offset-4 hover:underline transition-colors ${focusRing}`}
            >
              See the menu
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function HomeVariant({ locations }: { locations: LocationDisplay[] }) {
  const [first, ...rest] = locations;
  return (
    <section
      id="locations"
      aria-labelledby="locations-heading"
      className="bg-brand-grey grain-overlay py-16 md:py-24"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60 mb-3">
          Find Us
        </p>
        <h2
          id="locations-heading"
          className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tight leading-[0.95] text-brand-black"
        >
          The cart&apos;s got a home.
        </h2>
        <p className="font-sans text-base md:text-lg leading-relaxed text-brand-black/70 max-w-xl mt-4">
          Coffee six mornings a week in East Nashville. Running not required.
        </p>

        {/* Text first in the DOM so mobile reads name → hours → directions → photo;
            on desktop the photo takes the 40% column on the left. */}
        <div className="grid grid-cols-1 md:grid-cols-[40%_1fr] gap-8 md:gap-16 items-center mt-10 md:mt-14">
          <LocationDetails location={first} />
          {first.image && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-brand-black grain-overlay md:order-first">
              <Image
                src={first.image.src}
                alt={first.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover photo-treatment"
              />
            </div>
          )}
        </div>

        {/* Later locations: no photo, two per row on desktop, split by the house dashed rule. */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-12 md:mt-16">
            {rest.map((location) => (
              <div
                key={location.slug}
                className="border-t border-dashed border-brand-black/15 pt-10 md:pt-12 pb-2"
              >
                <LocationDetails location={location} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── /events compact ──────────────────────────────────────────────────────────

/** "Mon–Fri 7 AM–11 AM" / "Sat 7 AM–12 PM · Sun closed": open days get a line
 *  each, closed days ride on the line before them. */
function compactHourLines(hours: LocationDisplay["hours"]): string[] {
  const lines: string[] = [];
  for (const { days, hours: time } of hours) {
    if (time) lines.push(`${days} ${time}`);
    else if (lines.length) lines[lines.length - 1] += ` · ${days} closed`;
    else lines.push(`${days} closed`);
  }
  return lines;
}

function CompactVariant({ locations }: { locations: LocationDisplay[] }) {
  return locations.map(({ slug, name, wayfinding, notices, hours, streetAddress, directionsUrl }) => (
    <section
      key={slug}
      aria-labelledby={`location-${slug}`}
      className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto] md:gap-12 md:items-center pb-6 md:pb-8 mb-6 md:mb-8 border-b border-dashed border-brand-black/15"
    >
      <div>
        <h2
          id={`location-${slug}`}
          className="font-display font-bold text-xl md:text-2xl uppercase tracking-tight text-brand-black"
        >
          {name}
        </h2>
        {wayfinding && <p className="font-sans text-sm text-brand-black/70 mt-1">{wayfinding}</p>}
      </div>

      <div className="space-y-1">
        {compactHourLines(hours).map((line) => (
          <p
            key={line}
            className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] tabular-nums text-brand-black/80"
          >
            {line}
          </p>
        ))}
        <Notices notices={notices} />
      </div>

      {(streetAddress || directionsUrl) && (
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          {streetAddress && (
            <address className="not-italic font-sans text-sm text-brand-black/70">{streetAddress}</address>
          )}
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Directions to ${name} (opens in a new tab)`}
              className={`group inline-flex items-center gap-1 py-1.5 -my-1.5 font-display text-sm uppercase tracking-[0.2em] text-brand-orange hover:text-brand-black transition-colors ${focusRing}`}
            >
              Directions
              <ArrowUpRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          )}
        </div>
      )}
    </section>
  ));
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function LocationsSection({ locations, variant = "home" }: LocationsSectionProps) {
  if (locations.length === 0) return null;
  return variant === "compact" ? (
    <CompactVariant locations={locations} />
  ) : (
    <HomeVariant locations={locations} />
  );
}
