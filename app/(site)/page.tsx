import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { trimAddress } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleDay {
  _key: string;
  date: string;      // YYYY-MM-DD
  openTime: string;  // e.g. "9:00 AM"
  closeTime: string; // e.g. "3:00 PM"
}

interface SanityEvent {
  _id: string;
  title: string;
  schedule: ScheduleDay[] | null;
  locationName: string | null;
  location: string | null;
  image: SanityImageSource | null;
  type: "open" | "ticketed" | "private" | "fundraiser" | "sale" | "new-swag";
  eventPageType: "internal" | "external" | null;
  externalUrl: string | null;
  description: unknown[] | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  slug: string | null;
  recurrenceLabel: string | null;
}

// ─── Query ────────────────────────────────────────────────────────────────────

// Returns events that have at least one schedule date within today→today+7 (CT).
// GROQ dateTime() operates in UTC; we offset the CT window by +6h (CST worst-case).
const EVENTS_QUERY = `*[
  _type == "event" &&
  isPublic == true &&
  defined(image) &&
  count(schedule[dateTime(date + "T00:00:00Z") >= dateTime(now()) - 60*60*6 && dateTime(date + "T00:00:00Z") <= dateTime(now()) + 60*60*((7*24)+6)]) > 0
] | order(schedule[0].date asc) [0...6] {
  _id,
  title,
  "locationName": location.locationName,
  "location": location.displayAddress,
  schedule,
  type,
  eventPageType,
  externalUrl,
  "description": description,
  "ctaLabel": cta.ctaLabel,
  "ctaUrl": cta.ctaUrl,
  image,
  "slug": slug.current,
  recurrenceLabel
}`;

const STRIP_EVENTS_QUERY = `*[
  _type == "event" &&
  isPublic == true &&
  count(schedule[dateTime(date + "T00:00:00Z") >= dateTime(now()) - 60*60*6 && dateTime(date + "T00:00:00Z") <= dateTime(now()) + 60*60*((7*24)+6)]) > 0
] | order(schedule[0].date asc) [0...10] {
  _id,
  title,
  "locationName": location.locationName,
  "location": location.displayAddress,
  schedule,
  type,
  eventPageType,
  externalUrl,
  "description": description,
  "ctaLabel": cta.ctaLabel,
  "ctaUrl": cta.ctaUrl,
  image,
  "slug": slug.current,
  recurrenceLabel
}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Today's date in CT as YYYY-MM-DD */
function todayInCT(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });
}

/** Format a single YYYY-MM-DD date string for display — no UTC shift risk. */
function formatEventDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatEventDateRange(schedule: ScheduleDay[]): string {
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

function getHeroTimeContext(schedule: ScheduleDay[], today: string): string | null {
  const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
  const todayEntry = sorted.find((d) => d.date === today);
  if (todayEntry) {
    return `Today: ${todayEntry.openTime} – ${todayEntry.closeTime} CT`;
  }
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

const products = [
  { name: "El Gato Negro Tee", category: "Merch", price: "$35", img: "https://placehold.co/400x500/2A201D/FAF5F4", href: "/shop/product/egn-tee" },
  { name: "House Blend — 12oz", category: "Coffee", price: "$22", img: "https://placehold.co/400x500/B43620/FAF5F4", href: "/shop/product/house-blend" },
  { name: "Cart Build Guide", category: "Digital", price: "$49", img: "https://placehold.co/400x500/7B6838/FAF5F4", href: "/shop/product/cart-build-guide" },
];

// Placeholder — replace with scraped logos from client list
const clients = [
  "Nashville SC", "The Void", "Compound Events", "Heritage",
  "Creed Bar", "ACE Hotel", "Third & Lindsley", "Dierks Bentley's",
  "Biltmore Estate", "Marathon Village",
];

const services = [
  {
    eyebrow: "Launches · Pop-ups · Marketing",
    label: "Brand Activations",
    description: "Shoe releases, apartment pop-ups, corporate marketing campaigns, and product launches.",
    href: "/services/brand-activations",
  },
  {
    eyebrow: "Conventions · Club Events",
    label: "Community & Conventions",
    description: "Multi-day conventions, trade floors, film sets, and large-scale community gatherings.",
    href: "/services/community-conventions",
  },
  {
    eyebrow: "Weddings · Milestones",
    label: "Weddings & Celebrations",
    description: "Full-service espresso bar for ceremonies, receptions, and private celebrations.",
    href: "/services/weddings-celebrations",
  },
  {
    eyebrow: "Bachelorettes · Small Parties",
    label: "Private Events",
    description: "Intimate gatherings, bachelorette parties, and small private functions.",
    href: "/services/private-events",
  },
];

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "El Gato Negro Coffee — Nashville's Mobile Coffee Cart",
  description:
    "El Gato Negro is a Nashville-based mobile espresso cart serving pop-ups, weddings, brand activations, conventions, and private events. Find us, book the cart, or shop the brand.",
  openGraph: {
    title: "El Gato Negro Coffee — Nashville's Mobile Coffee Cart",
    description:
      "El Gato Negro is a Nashville-based mobile espresso cart serving pop-ups, weddings, brand activations, conventions, and private events.",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-barista_roasting.webp",
        width: 1200,
        height: 630,
        alt: "El Gato Negro Coffee — barista roasting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Gato Negro Coffee — Nashville's Mobile Coffee Cart",
    description:
      "Nashville mobile espresso cart. Pop-ups, weddings, brand activations, and private events.",
    images: ["/images/hero/hero-barista_roasting.webp"],
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  let sanityEvents: SanityEvent[] = [];
  let stripEvents: SanityEvent[] = [];
  try {
    [sanityEvents, stripEvents] = await Promise.all([
      client.fetch<SanityEvent[]>(EVENTS_QUERY, {}, { next: { revalidate: 60 } }),
      client.fetch<SanityEvent[]>(STRIP_EVENTS_QUERY, {}, { next: { revalidate: 60 } }),
    ]);
  } catch {
    // Sanity unavailable — page renders without events
  }

  const today = todayInCT();

  const heroSlides: HeroSlide[] = sanityEvents.map((e) => {
    const schedule = e.schedule ?? [];
    const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
    const isHappeningNow = sorted.some((d) => d.date === today);
    const dateRange = sorted.length ? formatEventDateRange(sorted) : "";
    const timeContext = sorted.length ? getHeroTimeContext(sorted, today) : null;
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
        ? urlFor(e.image).width(1440).height(900).url()
        : "/images/hero/hero-barista_roasting.webp",
      href,
    };
  });

  return (
    <>
      {/* ── 1. Culture — Hero Carousel ────────────────────────────────────── */}
      <HeroCarousel slides={heroSlides} />

      {/* ── 2b. Events Strip ──────────────────────────────────────────────── */}
      <section className="bg-brand-black border-t border-brand-grey/10 pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4 border-b border-brand-grey/10">
            <span className="font-sans font-extrabold text-xs uppercase tracking-[0.3em] text-brand-grey/60">
              Upcoming
            </span>
            <Link
              href="/events"
              className="font-sans font-extrabold text-xs uppercase tracking-[0.25em] text-brand-grey/60 hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              See All Events <ArrowRight size={11} />
            </Link>
          </div>

          {(() => {
            // Build strip rows: multi-day consecutive → one card via formatEventDateRange;
            // recurring (non-consecutive) → one card per occurrence within the 7-day window.
            const sevenDaysOut = new Date(
              new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" })
            );
            sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);
            const windowEnd = sevenDaysOut.toISOString().slice(0, 10);

            type StripRow = { key: string; event: SanityEvent; displayDate: string; sortDate: string };
            const rows: StripRow[] = [];

            for (const event of stripEvents) {
              const schedule = event.schedule ?? [];
              if (!schedule.length) continue;

              const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
              const windowDates = sorted.filter((d) => d.date >= today && d.date <= windowEnd);
              if (!windowDates.length) continue;

              // Detect consecutive (multi-day) vs recurring (gaps between dates)
              const isConsecutive = sorted.every((d, i) => {
                if (i === 0) return true;
                const prev = new Date(sorted[i - 1].date);
                const curr = new Date(d.date);
                return (curr.getTime() - prev.getTime()) === 86400000;
              });

              if (isConsecutive) {
                rows.push({
                  key: event._id,
                  event,
                  displayDate: formatEventDateRange(sorted),
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

            return rows.map(({ key, event, displayDate }) => (
              <Link
                key={key}
                href={
                  event.eventPageType === "external" && event.externalUrl
                    ? event.externalUrl
                    : event.slug
                    ? `/events/${event.slug}`
                    : "/events"
                }
                className="group grid grid-cols-[6rem_1fr_auto] md:grid-cols-[8rem_1fr_auto] items-center gap-4 md:gap-8 py-4 border-b border-brand-grey/10 hover:border-brand-grey/20 transition-colors"
              >
                {/* Date */}
                <span className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-grey/70 tabular-nums">
                  {displayDate}
                </span>

                {/* Title + badge */}
                <span className="flex items-center gap-3">
                  <span className="font-display text-lg uppercase tracking-tight text-brand-grey group-hover:text-brand-orange transition-colors">
                    {event.title}
                  </span>
                  {event.type === "ticketed" && (
                    <span className="hidden sm:inline-flex font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-orange text-brand-grey px-1.5 py-0.5 shrink-0">
                      Ticketed
                    </span>
                  )}
                  {event.type === "fundraiser" && (
                    <span className="hidden sm:inline-flex font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-teal text-brand-grey px-1.5 py-0.5 shrink-0">
                      Fundraiser
                    </span>
                  )}
                </span>

                {/* Location */}
                <span className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-grey/60 hidden sm:block text-right">
                  {event.locationName || (event.location ? trimAddress(event.location) : "")}
                </span>
              </Link>
            ));
          })()}
        </div>
      </section>

      {/* ── 3. Ecommerce — Shop Preview ───────────────────────────────────── */}
      <section className="bg-brand-black grain-overlay py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-end justify-between mb-10 pb-5 border-b border-brand-grey/10">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-yellow mb-2">
                The Store
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-grey tracking-tight">
                Shop EGN
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-brand-grey/40 hover:text-brand-yellow transition-colors"
            >
              Full Shop <ArrowRight size={10} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-brand-grey/10">
            {products.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                className="group block bg-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange"
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- TODO: replace with next/image once real product images are added and res.cloudinary.com is confirmed in next.config remotePatterns */}
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 font-display text-[10px] uppercase tracking-[0.25em] bg-brand-orange text-brand-grey px-2 py-1">
                    {product.category}
                  </span>
                </div>
                <div className="p-5 border border-brand-grey/10 group-hover:border-brand-orange/30 transition-colors">
                  <h3 className="font-display font-bold uppercase tracking-tight text-brand-grey text-base leading-tight mb-1">
                    {product.name}
                  </h3>
                  <p className="font-display text-brand-yellow font-bold text-sm">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/shop"
            className="md:hidden mt-5 inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-brand-grey/40 hover:text-brand-yellow transition-colors"
          >
            Full Shop <ArrowRight size={10} />
          </Link>
        </div>
      </section>

      {/* ── 4. Business Dev — Clients + Services ──────────────────────────── */}
      <section className="bg-brand-grey py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* 4a. Who We've Worked With — flat list */}
          <div className="mb-20 md:mb-28">
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-black/60 mb-10">
              Who We&apos;ve Worked With
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-4">
              {clients.map((clientName) => (
                <span
                  key={clientName}
                  className="font-display text-sm uppercase tracking-[0.1em] text-brand-black/70"
                >
                  {clientName}
                </span>
              ))}
            </div>
          </div>

          {/* 4b. Services — section header */}
          <div className="flex items-end justify-between mb-10 pb-5 border-b-2 border-brand-black">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-green mb-2">
                What We Do
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight">
                Book the Cart
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden md:inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-brand-black/50 hover:text-brand-orange transition-colors"
            >
              All Services <ArrowRight size={10} />
            </Link>
          </div>

          {/* 4b. Service cards — 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-brand-black">
            {services.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className={`group block p-8 md:p-10 hover:bg-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange border-brand-black ${
                  i % 2 === 0 ? "md:border-r-2" : ""
                } ${i < 2 ? "border-b-2" : ""}`}
              >
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-green group-hover:text-brand-yellow transition-colors mb-4">
                  {service.eyebrow}
                </p>
                <h3 className="font-display font-bold text-2xl uppercase text-brand-black group-hover:text-brand-grey tracking-tight mb-4 transition-colors">
                  {service.label}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-brand-black/80 group-hover:text-brand-grey/80 transition-colors mb-6">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.2em] text-brand-orange group-hover:text-brand-yellow transition-colors">
                  Get a Quote <ArrowRight size={11} />
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/services"
            className="md:hidden mt-5 inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-brand-black/50 hover:text-brand-orange transition-colors"
          >
            All Services <ArrowRight size={10} />
          </Link>
        </div>
      </section>

      {/* ── 5. Final CTA ──────────────────────────────────────────────────── */}
      <section className="bg-brand-orange py-16 md:py-20 border-t-2 border-brand-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-black/70 mb-2">
              Ready to Book?
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase text-brand-black tracking-tight">
              Let&apos;s bring the cart to your event.
            </h2>
          </div>
          <Link
            href="/inquiry"
            className="group shrink-0 inline-flex items-center gap-2 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-8 py-4 border-2 border-brand-black hover:bg-transparent hover:text-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-black active:scale-[0.98] whitespace-nowrap"
          >
            Start Your Inquiry
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
