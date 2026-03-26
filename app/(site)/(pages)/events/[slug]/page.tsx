import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, ExternalLink } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  formatEventDate,
  formatEventDateRange,
  getHeroTimeContext,
  todayInCT,
} from "@/lib/home/dates";

// ─── ISR ──────────────────────────────────────────────────────────────────────

export const revalidate = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleEntry {
  _key: string;
  date: string;
  openTime: string;
  closeTime: string;
}

interface CtaItem {
  _key: string;
  label: string;
  url: string;
  style?: "primary" | "link";
  newTab?: boolean;
}

interface MenuItem {
  _type: string;
  _key: string;
  text?: string;
  price?: number;
}

interface MenuBlock {
  _type: string;
  _key: string;
  sectionName?: string;
  items?: MenuItem[];
  leftSectionName?: string;
  leftItems?: MenuItem[];
  rightSectionName?: string;
  rightItems?: MenuItem[];
}

interface EventDetail {
  _id: string;
  title: string;
  locationName: string | null;
  displayAddress: string | null;
  mapLink: string | null;
  type: "open" | "ticketed" | "private" | "fundraiser" | "sale" | "new-swag";
  schedule: ScheduleEntry[] | null;
  note: string | null;
  recurrenceLabel: string | null;
  image: Record<string, unknown> | null;
  description: Array<{
    _key: string;
    _type: string;
    style?: string;
    children?: Array<{ _key: string; _type: string; text: string; marks?: string[] }>;
  }> | null;
  cta: CtaItem[] | null;
  menu: { title: string; blocks: MenuBlock[] | null } | null;
  eventPageType: "internal" | "internal-link" | "external" | null;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const EVENT_QUERY = `*[_type == "event" && slug.current == $slug][0] {
  _id,
  title,
  "locationName": location.locationName,
  "displayAddress": location.displayAddress,
  "mapLink": location.mapLink,
  type,
  schedule,
  note,
  recurrenceLabel,
  image,
  description,
  cta,
  menu->{
    title,
    blocks[]{
      _type,
      _key,
      sectionName,
      items[]{_type, _key, text, price},
      leftSectionName,
      leftItems[]{_type, _key, text, price},
      rightSectionName,
      rightItems[]{_type, _key, text, price}
    }
  },
  eventPageType
}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert "9:00 AM" / "3:00 PM" to "09:00" / "15:00" for ISO 8601 */
function convertTo24h(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "00:00";
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

const TYPE_LABELS: Record<EventDetail["type"], string> = {
  open: "Open Event",
  ticketed: "Ticketed",
  private: "Private Event",
  fundraiser: "Fundraiser",
  sale: "Sale",
  "new-swag": "New Swag",
};

const HERO_BUTTON_TEXT: Record<EventDetail["type"], string> = {
  open: "View Details",
  ticketed: "Get Tickets",
  private: "View Details",
  fundraiser: "Donate",
  sale: "Shop Now",
  "new-swag": "Shop Now",
};

function formatDayOfWeek(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function renderPortableText(
  blocks: EventDetail["description"]
): React.ReactNode[] {
  if (!blocks?.length) return [];
  return blocks
    .filter((b) => b._type === "block" && b.children?.length)
    .map((block) => {
      const text = block.children!
        .map((child) => {
          if (!child.marks?.length) return child.text;
          let node: React.ReactNode = child.text;
          if (child.marks.includes("strong"))
            node = <strong key={child._key}>{node}</strong>;
          if (child.marks.includes("em"))
            node = <em key={child._key}>{node}</em>;
          return node;
        });
      return (
        <p key={block._key} className="font-sans text-base md:text-lg leading-relaxed text-brand-black/80">
          {text}
        </p>
      );
    });
}

// ─── Menu renderers ──────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function formatAddonPrice(price: number): string {
  return `+$${price.toFixed(2)}`;
}

function MenuItemRow({ item }: { item: MenuItem }) {
  switch (item._type) {
    case "menuHeaderWithPrice":
      return (
        <div className="pt-10 pb-3 first:pt-0 border-b-2 border-brand-orange mb-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-[0.15em] text-brand-black">
              {item.text}
            </h3>
            <span className="font-sans font-extrabold text-sm md:text-base text-brand-orange whitespace-nowrap">
              {item.price != null && formatPrice(item.price)}
            </span>
          </div>
        </div>
      );

    case "menuHeaderAddon":
      return (
        <div className="pt-10 pb-3 first:pt-0 border-b-2 border-brand-orange mb-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-[0.15em] text-brand-black">
              {item.text}
            </h3>
            <span className="font-sans font-extrabold text-sm md:text-base text-brand-orange whitespace-nowrap">
              {item.price != null && formatAddonPrice(item.price)}
            </span>
          </div>
        </div>
      );

    case "menuProductItem":
      return (
        <div className="flex items-baseline gap-2 py-2 md:py-2.5">
          <span className="font-sans text-sm md:text-base text-brand-black/80">
            {item.text}
          </span>
          {item.price != null && (
            <>
              <span className="flex-1 border-b border-dotted border-brand-black/15 mx-2 self-end mb-[3px]" />
              <span className="font-sans font-extrabold text-sm md:text-base text-brand-orange whitespace-nowrap tabular-nums">
                {formatPrice(item.price)}
              </span>
            </>
          )}
        </div>
      );

    case "menuAddonItem":
      return (
        <div className="flex items-baseline gap-2 py-2 md:py-2.5">
          <span className="font-sans text-sm md:text-base text-brand-black/80">
            {item.text}
          </span>
          {item.price != null && (
            <>
              <span className="flex-1 border-b border-dotted border-brand-black/15 mx-2 self-end mb-[3px]" />
              <span className="font-sans font-extrabold text-sm md:text-base text-brand-orange whitespace-nowrap tabular-nums">
                {formatAddonPrice(item.price)}
              </span>
            </>
          )}
        </div>
      );

    case "menuDivider":
      return <hr className="my-6 border-t border-dashed border-brand-black/10" />;

    default:
      return null;
  }
}

function MenuSection({ name, items }: { name: string; items: MenuItem[] }) {
  return (
    <div>
      <div className="pt-10 pb-3 first:pt-0 border-b-2 border-brand-orange mb-1">
        <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-[0.15em] text-brand-black">
          {name}
        </h3>
      </div>
      {items.map((item) => (
        <MenuItemRow key={item._key} item={item} />
      ))}
    </div>
  );
}

function EventMenu({ menu }: { menu: { title: string; blocks: MenuBlock[] | null } }) {
  const blocks = menu.blocks ?? [];
  if (!blocks.length) return null;

  return (
    <section className="bg-brand-grey grain-overlay border-t border-brand-black/10">
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
        <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-8">
          Event Menu
        </p>
        {blocks.map((block) => {
          if (block._type === "menuFullWidthSection") {
            return (
              <MenuSection
                key={block._key}
                name={block.sectionName || ""}
                items={block.items ?? []}
              />
            );
          }
          if (block._type === "menuTwoColumnSplit") {
            return (
              <div key={block._key} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-0">
                <div className="md:border-r md:border-dashed md:border-brand-black/10 md:pr-12 lg:pr-16">
                  <MenuSection
                    name={block.leftSectionName || ""}
                    items={block.leftItems ?? []}
                  />
                </div>
                <div>
                  <MenuSection
                    name={block.rightSectionName || ""}
                    items={block.rightItems ?? []}
                  />
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch<EventDetail | null>(
    EVENT_QUERY,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!event || event.eventPageType !== "internal") {
    return { title: "Event Not Found | El Gato Negro Coffee" };
  }

  const descriptionText = event.description
    ?.filter((b) => b._type === "block")
    .flatMap((b) => b.children?.map((c) => c.text) ?? [])
    .join(" ")
    .slice(0, 160) || `${event.title} — El Gato Negro Coffee event.`;

  return {
    title: `${event.title} | El Gato Negro Coffee`,
    description: descriptionText,
    openGraph: {
      title: `${event.title} | El Gato Negro Coffee`,
      description: descriptionText,
      type: "website",
      ...(event.image && {
        images: [
          {
            url: urlFor(event.image).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | El Gato Negro Coffee`,
      description: descriptionText,
      ...(event.image && {
        images: [urlFor(event.image).width(1200).height(630).url()],
      }),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await client.fetch<EventDetail | null>(
    EVENT_QUERY,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!event || event.eventPageType !== "internal") notFound();

  const schedule = event.schedule
    ? [...event.schedule].sort((a, b) => a.date.localeCompare(b.date))
    : [];
  const today = todayInCT();
  const upcoming = schedule.filter((d) => d.date >= today);

  const descriptionPlainText = event.description
    ?.filter((b) => b._type === "block")
    .flatMap((b) => b.children?.map((c) => c.text) ?? [])
    .join(" ")
    .slice(0, 200) || "";

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(descriptionPlainText && { description: descriptionPlainText }),
    ...(event.image && { image: urlFor(event.image).width(1200).height(630).url() }),
    ...(schedule[0] && {
      startDate: `${schedule[0].date}T${convertTo24h(schedule[0].openTime)}`,
    }),
    ...(schedule.length > 0 && {
      endDate: `${schedule[schedule.length - 1].date}T${convertTo24h(schedule[schedule.length - 1].closeTime)}`,
    }),
    ...(event.locationName && {
      location: {
        "@type": "Place",
        name: event.locationName,
        ...(event.displayAddress && { address: event.displayAddress }),
      },
    }),
    organizer: {
      "@type": "Organization",
      name: "El Gato Negro Coffee",
      url: "https://www.elgatonegro.coffee",
    },
  };

  const heroButtonText = HERO_BUTTON_TEXT[event.type] || "View Details";
  const ctaItems = event.cta ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[100svh] overflow-hidden -mt-44 md:-mt-36">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(1440).url()}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover photo-treatment"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-black" />
        )}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-brand-black/50 to-transparent" />
        <div className="absolute inset-0 z-[20] grain-overlay-dark pointer-events-none" style={{ opacity: 0.85 }} />

        <div className="absolute inset-0 z-10 flex flex-col justify-end max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
          <p className="font-accent text-base md:text-lg uppercase tracking-[0.1em] text-brand-orange mb-3">
            {TYPE_LABELS[event.type] || "Event"}
          </p>

          <h1
            className="font-display font-bold uppercase text-brand-grey tracking-tight leading-[0.9]"
            style={{ fontSize: "clamp(3rem, 12vw, 10rem)" }}
          >
            {event.title}
          </h1>

          <div className="mt-6 pl-3 border-l-2 border-brand-orange/40 flex flex-col gap-1 mb-8">
            {/* Line 1: recurrence + date range — matches homepage hero */}
            {upcoming.length > 0 && (
              <span className="font-sans font-extrabold text-base md:text-lg uppercase tracking-[0.15em] text-brand-grey/80">
                {event.recurrenceLabel
                  ? `${event.recurrenceLabel} · ${formatEventDateRange(upcoming)}`
                  : formatEventDateRange(upcoming)}
              </span>
            )}
            {/* Line 2: time context — "Today: 9AM–3PM CT" or "Next: Mon 11AM–2PM CT" */}
            {upcoming.length > 0 && (() => {
              const timeContext = getHeroTimeContext(upcoming, today, !!event.recurrenceLabel);
              return timeContext ? (
                <span className="font-sans font-semibold text-sm text-brand-grey/70 tracking-[0.05em] uppercase">
                  {timeContext}
                </span>
              ) : null;
            })()}
            {/* Line 3: location — as a link if mapLink exists */}
            {event.locationName && (
              event.mapLink ? (
                <a
                  href={event.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-semibold text-sm text-brand-grey/60 uppercase tracking-[0.1em] hover:text-brand-grey transition-colors underline-offset-2 hover:underline"
                >
                  {event.locationName}
                </a>
              ) : (
                <span className="font-sans font-semibold text-sm text-brand-grey/60 uppercase tracking-[0.1em]">
                  {event.locationName}
                </span>
              )
            )}
            {/* Line 4: note — smaller, italic */}
            {event.note && (
              <span className="font-sans text-sm text-brand-grey/50 italic">
                {event.note}
              </span>
            )}
          </div>

          {/* Hero button — text mapped from event type */}
          <a
            href="#details"
            className="self-start inline-flex items-center gap-2 bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] rounded-sm px-8 py-3.5 hover:bg-brand-yellow transition-colors"
          >
            {heroButtonText}
            <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* ── 2. Details ───────────────────────────────────────────────────── */}
      <section id="details" className="bg-brand-grey grain-overlay">
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
          {/* View Map — moved above description */}
          {event.mapLink && (
            <a
              href={event.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-[0.1em] text-brand-orange hover:text-brand-black transition-colors mb-8"
            >
              <MapPin size={14} />
              View Map
            </a>
          )}

          {/* Description */}
          {event.description && event.description.length > 0 && (
            <div className="space-y-4 border-l-2 border-brand-orange pl-4 md:pl-6 mb-10">
              {renderPortableText(event.description)}
            </div>
          )}

          {/* Schedule strip */}
          {upcoming.length > 1 && (
            <div className="mb-10">
              {upcoming.map((s) => (
                <div
                  key={s._key}
                  className="flex flex-col sm:grid sm:grid-cols-[8rem_1fr] gap-1 sm:gap-8 items-start sm:items-center py-4 sm:py-5 border-b border-brand-black/10 last:border-b-0"
                >
                  <span className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black/50 tabular-nums">
                    {formatDayOfWeek(s.date)}, {formatEventDate(s.date)}
                  </span>
                  <span className="font-display font-bold text-base sm:text-lg uppercase tracking-tight text-brand-black">
                    {s.openTime} – {s.closeTime} CT
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          {ctaItems.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {ctaItems.map((cta) => {
                const isExternal = cta.url.startsWith("http");
                const linkProps = {
                  ...(cta.newTab || isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {}),
                };

                if (cta.style === "link") {
                  return (
                    <a
                      key={cta._key}
                      href={cta.url}
                      {...linkProps}
                      className="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-[0.1em] text-brand-orange hover:text-brand-black transition-colors underline-offset-4 hover:underline"
                    >
                      {cta.label}
                      {(cta.newTab || isExternal) && <ExternalLink size={14} />}
                    </a>
                  );
                }

                return (
                  <a
                    key={cta._key}
                    href={cta.url}
                    {...linkProps}
                    className="inline-flex items-center gap-2 bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] rounded-sm px-8 py-3.5 hover:bg-brand-black transition-colors"
                  >
                    {cta.label}
                    {(cta.newTab || isExternal) && <ExternalLink size={14} />}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Event Menu (optional) ─────────────────────────────────────── */}
      {event.menu && <EventMenu menu={event.menu} />}

      {/* ── 4. Closing CTA ─────────────────────────────────────────────── */}
      <section className="bg-brand-orange grain-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-32">
          <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/60 mb-4 md:mb-6">
            More From EGN
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase text-brand-black tracking-tight leading-[0.95] max-w-3xl mb-10 md:mb-12">
            See what else is coming up.
          </h2>
          <Link
            href="/events"
            className="group inline-flex items-center gap-3 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-8 py-4 md:px-10 md:py-5 rounded-sm hover:bg-brand-orange transition-colors duration-300"
          >
            All Events
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
