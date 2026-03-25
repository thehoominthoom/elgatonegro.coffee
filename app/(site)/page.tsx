import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { client } from "@/sanity/lib/client";
import { trimAddress } from "@/lib/utils";
import { clients } from "@/lib/clients";
import type { SanityEvent } from "@/lib/home/types";
import { todayInCT } from "@/lib/home/dates";
import { buildStripRows } from "@/lib/home/events";
import { buildHeroSlides } from "@/lib/home/hero";
import { getAllProducts } from "@/lib/shopify/storefront";
import type { Product } from "@/lib/shopify/types";
import { getMetafieldValues } from "@/lib/shopify/utils";

// ─── Query ────────────────────────────────────────────────────────────────────

// Returns upcoming public events ordered by first schedule date.
// GROQ dateTime() operates in UTC; subtract 30h to cover the full CT calendar day —
// event remains visible until midnight CT (30h covers CST worst-case end of day).
// Cap at 8 (strip max). heroSlides derives from this set via JS filter + slice(0,6).
const EVENTS_QUERY = `*[
  _type == "event" &&
  isPublic == true &&
  count(schedule[dateTime(date + "T00:00:00Z") >= dateTime(now()) - 60*60*30]) > 0
] | order(schedule[0].date asc) [0...8] {
  _id,
  title,
  "locationName": location.locationName,
  "location": location.displayAddress,
  schedule,
  note,
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

// ─── Static data ──────────────────────────────────────────────────────────────

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

/** Format a Shopify MoneyV2 amount for display */
function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export default async function Home() {
  let sanityEvents: SanityEvent[] = [];
  let featuredProducts: Product[] = [];

  const [eventsResult, productsResult] = await Promise.allSettled([
    client.fetch<SanityEvent[]>(EVENTS_QUERY, {}, { next: { revalidate: 60 } }),
    getAllProducts(6),
  ]);

  if (eventsResult.status === "fulfilled") sanityEvents = eventsResult.value;
  if (productsResult.status === "fulfilled") featuredProducts = productsResult.value.slice(0, 6);

  const today = todayInCT();
  const heroSlides = buildHeroSlides(sanityEvents, today);

  return (
    <>
      {/* ── 1. Culture — Hero Carousel ────────────────────────────────────── */}
      <HeroCarousel slides={heroSlides} />

      {/* ── 2b. Events Strip ──────────────────────────────────────────────── */}
      <section className="bg-brand-black grain-overlay-dark border-t border-brand-grey/10 pt-8 md:pt-12 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative overflow-hidden">
          {buildStripRows(sanityEvents, today).map(({ key, event, displayDate }) => (
              <Link
                key={key}
                href={
                  event.eventPageType === "external" && event.externalUrl
                    ? event.externalUrl
                    : event.eventPageType === "internal" && event.slug
                    ? `/events/${event.slug}`
                    : "/events"
                }
                className="group flex flex-col md:grid md:grid-cols-[8rem_1fr_auto] gap-1 md:gap-8 items-start md:items-center py-5 md:py-6 border-b border-brand-grey/10 hover:border-brand-grey/20 transition-colors"
              >
                {/* Date */}
                <span className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.15em] text-brand-grey/50 tabular-nums">
                  {displayDate}
                </span>

                {/* Title + badge */}
                <span className="flex items-center gap-3">
                  <span className="font-display font-bold text-lg md:text-2xl uppercase tracking-tight text-brand-grey group-hover:text-brand-orange transition-colors">
                    {event.title}
                  </span>
                  {event.type === "ticketed" && (
                    <span className="hidden sm:inline-flex font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-orange text-brand-grey px-1.5 py-0.5 rounded-sm shrink-0">
                      Ticketed
                    </span>
                  )}
                  {event.type === "fundraiser" && (
                    <span className="hidden sm:inline-flex font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-teal text-brand-grey px-1.5 py-0.5 rounded-sm shrink-0">
                      Fundraiser
                    </span>
                  )}
                </span>


                {/* Location — mobile */}
                <span className="md:hidden font-sans text-[10px] uppercase tracking-[0.15em] text-brand-grey/50 mt-1">
                  {event.locationName || (event.location ? trimAddress(event.location) : "")}
                </span>

                {/* Location — desktop */}
                <span className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-grey/60 hidden md:block text-right">
                  {event.locationName || (event.location ? trimAddress(event.location) : "")}
                </span>
              </Link>
          ))}

          {/* See All Events row */}
          <Link
            href="/events"
            className="flex items-center justify-between py-5 md:py-6 transition-colors group"
          >
            <span className="font-display text-sm md:text-base uppercase tracking-[0.2em] text-brand-orange group-hover:text-brand-yellow transition-colors">
              See All Events
            </span>
            <ArrowRight size={18} className="text-brand-orange group-hover:text-brand-yellow transition-all group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ── 3. Ecommerce — Shop Preview ───────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          {/* Section header — minimal eyebrow */}
          <div className="flex items-center justify-between mb-12 pb-4 border-b border-brand-black/10">
            <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60">
              The Store
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 font-display text-sm md:text-base uppercase tracking-[0.2em] text-brand-black/50 hover:text-brand-orange transition-colors"
            >
              Full Shop <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <p className="font-sans text-sm text-brand-black/40 py-12 text-center">
              Products coming soon.
            </p>
          ) : (
            <>
              {/* Featured product — two-column editorial spread */}
              <div className="grid grid-cols-1 md:grid-cols-[55%_1fr] gap-8 md:gap-16 items-center">
                {/* Left column — image */}
                <Link
                  href={`/shop/products/${featuredProducts[0].handle}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden aspect-square bg-brand-black grain-overlay">
                    {featuredProducts[0].featuredImage ? (
                      <Image
                        src={featuredProducts[0].featuredImage.url}
                        alt={featuredProducts[0].featuredImage.altText ?? featuredProducts[0].title}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover photo-treatment transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-black/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent" />
                    {!featuredProducts[0].availableForSale && (
                      <span className="absolute top-4 right-4 z-[1] font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-black/80 text-white px-2 py-1 rounded-sm">
                        Sold Out
                      </span>
                    )}
                  </div>
                </Link>

                {/* Right column — text */}
                <div>
                  {featuredProducts[0].vendor && (
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-black/60 mb-2">
                      {featuredProducts[0].vendor}
                    </p>
                  )}
                  <h3 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-brand-black leading-[1.1]">
                    {featuredProducts[0].title}
                  </h3>
                  <p className="font-display font-bold text-xl text-brand-orange mt-4">
                    {formatPrice(
                      featuredProducts[0].priceRange.minVariantPrice.amount,
                      featuredProducts[0].priceRange.minVariantPrice.currencyCode
                    )}
                  </p>
                  {(() => {
                    const roast = getMetafieldValues(featuredProducts[0].roastLevel);
                    const flavor = getMetafieldValues(featuredProducts[0].flavorNotes);
                    if (roast.length === 0 && flavor.length === 0) return null;
                    return (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {roast[0] && (
                          <span className="font-sans text-xs uppercase tracking-[0.15em] text-brand-black/70 border border-brand-black/25 px-2 py-1 rounded-sm">
                            {roast[0]}
                          </span>
                        )}
                        {flavor.length > 0 && (
                          <span className="font-sans text-xs text-brand-black/60 px-2 py-1">
                            {flavor.join(", ")}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                  <Link
                    href={`/shop/products/${featuredProducts[0].handle}`}
                    className="mt-8 w-full flex items-center justify-between bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-6 py-4 rounded-sm hover:bg-brand-orange transition-colors"
                  >
                    {featuredProducts[0].availableForSale ? "Shop Now" : "View Product"}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Remaining products — 4-column grid */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredProducts.slice(1, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/products/${product.handle}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden aspect-square bg-brand-black grain-overlay-sm">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText ?? product.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover photo-treatment-sm transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-black/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
                      {!product.availableForSale && (
                        <span className="absolute top-2 right-2 z-[1] font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-black/80 text-white px-1.5 py-0.5 rounded-sm">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <div className="pt-4">
                      {product.vendor && (
                        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-black/60 mb-1">
                          {product.vendor}
                        </p>
                      )}
                      <h3 className="font-display font-bold text-sm uppercase tracking-tight text-brand-black leading-tight mb-1">
                        {product.title}
                      </h3>
                      <p className="font-display font-bold text-sm text-brand-orange">
                        {formatPrice(
                          product.priceRange.minVariantPrice.amount,
                          product.priceRange.minVariantPrice.currencyCode
                        )}
                      </p>
                      {(() => {
                        const roast = getMetafieldValues(product.roastLevel);
                        const flavor = getMetafieldValues(product.flavorNotes);
                        if (roast.length === 0 && flavor.length === 0) return null;
                        return (
                          <div className="flex flex-col items-start gap-1.5 mt-1.5">
                            {roast[0] && (
                              <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-brand-black/65 border border-brand-black/25 px-1.5 py-0.5 rounded-sm">
                                {roast[0]}
                              </span>
                            )}
                            {flavor.length > 0 && (
                              <span className="font-sans text-[11px] text-brand-black/55 px-1.5 py-0.5">
                                {flavor.join(", ")}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── 4a. Clients ────────────────────────────────────────────────── */}
      <section className="relative bg-brand-black py-14 md:py-20 overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/hero/juan-stamping-cups.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_60%] photo-treatment"
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-brand-black/80" aria-hidden="true" />
        {/* Grain */}
        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-grey/60 mb-10">
            Who We&apos;ve Worked With
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {clients.map((c) => (
              <div
                key={c.name}
                className="group flex items-center justify-center aspect-[8/5] bg-brand-black/40 border border-brand-grey/[0.08] px-6 py-4 rounded-sm overflow-hidden"
              >
                <img
                  src={c.src}
                  alt={c.name}
                  className="w-auto max-h-full brightness-0 invert opacity-65 group-hover:opacity-90 group-hover:scale-105 [filter:blur(0.4px)_brightness(0)_invert(1)] transition-all duration-300"
                  style={{ height: c.h }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4b. Services ───────────────────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-20 md:py-28">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="mb-14 md:mb-20">
            <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60 mb-3">
              What We Do
            </p>
            <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl uppercase text-brand-black tracking-tight leading-[0.9]">
              Book the Cart
            </h2>
          </div>

          {/* Service rows — stacked editorial */}
          {services.map((service, i) => (
            <Link
              key={service.href}
              href={service.href}
              className="group relative block py-7 md:py-9 border-b border-dashed border-brand-black/15 first:border-t first:border-dashed first:border-brand-black/15 hover:pl-4 transition-all duration-300"
            >
              {/* Background index number — left-aligned on the 0 */}
              <span
                className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 font-display font-bold text-[15vw] md:text-[10vw] lg:text-[8vw] leading-none text-brand-black/[0.04] group-hover:text-brand-black/[0.07] select-none pointer-events-none tabular-nums text-left transition-colors duration-300"
                style={{ width: "2ch" }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div className="relative z-10">
                <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-green mb-3">
                  {service.eyebrow}
                </p>
                <h3 className="font-display font-bold text-2xl md:text-3xl uppercase text-brand-black tracking-tight mb-2">
                  {service.label}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-brand-black/70 max-w-xl mb-5">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 font-display text-sm md:text-base uppercase tracking-[0.2em] text-brand-orange group-hover:text-brand-yellow transition-colors duration-300">
                  Get a Quote <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}

          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-display text-sm md:text-base uppercase tracking-[0.2em] text-brand-black/50 hover:text-brand-orange transition-colors mt-8"
          >
            All Services <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── 5. Final CTA ──────────────────────────────────────────────────── */}
      <section className="bg-brand-orange grain-overlay border-t-2 border-brand-black">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-32">
          <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/60 mb-4 md:mb-6">
            Ready to Book?
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase text-brand-black tracking-tight leading-[0.95] max-w-3xl mb-10 md:mb-12">
            Let&apos;s bring the cart to your event.
          </h2>
          <Link
            href="/inquiry"
            className="group inline-flex items-center gap-3 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-8 py-4 md:px-10 md:py-5 rounded-sm hover:bg-brand-orange transition-colors duration-300 active:scale-[0.98]"
          >
            Start Your Inquiry
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
