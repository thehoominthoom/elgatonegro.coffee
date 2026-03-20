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
    getAllProducts(5),
  ]);

  if (eventsResult.status === "fulfilled") sanityEvents = eventsResult.value;
  if (productsResult.status === "fulfilled") featuredProducts = productsResult.value.slice(0, 5);

  const today = todayInCT();
  const heroSlides = buildHeroSlides(sanityEvents, today);

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

          {buildStripRows(sanityEvents, today).map(({ key, event, displayDate }) => (
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
          ))}
        </div>
      </section>

      {/* ── 3. Ecommerce — Shop Preview ───────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-end justify-between mb-10 pb-5 border-b border-brand-grey/10">
            <div>
              <p className="font-display text-[20px] uppercase tracking-[0.3em] text-brand-yellow mb-2">
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

          {featuredProducts.length === 0 ? (
            <p className="font-sans text-sm text-brand-grey/40 py-12 text-center">
              Products coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-grey/10">
              {/* Large featured product */}
              <Link
                href={`/shop/products/${featuredProducts[0].handle}`}
                className="group block bg-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange"
              >
                <div className="relative overflow-hidden aspect-square">
                  {featuredProducts[0].featuredImage ? (
                    <Image
                      src={featuredProducts[0].featuredImage.url}
                      alt={featuredProducts[0].featuredImage.altText ?? featuredProducts[0].title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-black/10 grain-overlay" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
                  {featuredProducts[0].vendor && (
                    <span className="absolute top-4 left-4 font-display text-[10px] uppercase tracking-[0.25em] bg-brand-orange text-brand-grey px-2 py-1">
                      {featuredProducts[0].vendor}
                    </span>
                  )}
                </div>
                <div className="p-5 border border-brand-grey/10 group-hover:border-brand-orange/30 transition-colors">
                  <h3 className="font-display font-bold uppercase tracking-tight text-brand-grey text-xl leading-tight mb-1">
                    {featuredProducts[0].title}
                  </h3>
                  <p className="font-display text-brand-yellow font-bold text-base">
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
                      <div className="flex flex-wrap gap-2 mt-2">
                        {roast[0] && (
                          <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-brand-grey/50 border border-brand-grey/20 px-1.5 py-0.5">
                            {roast[0]}
                          </span>
                        )}
                        {flavor.length > 0 && (
                          <span className="font-sans text-[10px] text-brand-grey/50 px-1.5 py-0.5">
                            {flavor.join(", ")}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </Link>

              {/* 4 smaller products — 2x2 grid */}
              <div className="grid grid-cols-2 gap-px bg-brand-grey/10">
                {featuredProducts.slice(1, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/products/${product.handle}`}
                    className="group block bg-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange"
                  >
                    <div className="relative overflow-hidden aspect-square">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText ?? product.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-black/10 grain-overlay" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
                    </div>
                    <div className="p-4 border border-brand-grey/10 group-hover:border-brand-orange/30 transition-colors">
                      {product.vendor && (
                        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-brand-grey/40 mb-1">
                          {product.vendor}
                        </p>
                      )}
                      <h3 className="font-display font-bold uppercase tracking-tight text-brand-grey text-sm leading-tight mb-1">
                        {product.title}
                      </h3>
                      <p className="font-display text-brand-yellow font-bold text-sm">
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
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {roast[0] && (
                              <span className="font-sans text-[9px] uppercase tracking-[0.1em] text-brand-grey/50 border border-brand-grey/20 px-1 py-0.5">
                                {roast[0]}
                              </span>
                            )}
                            {flavor.length > 0 && (
                              <span className="font-sans text-[9px] text-brand-grey/50 px-1 py-0.5 line-clamp-1">
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
            </div>
          )}

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
            <p className="font-display text-[20px] uppercase tracking-[0.3em] text-brand-black/60 mb-10">
              Who We&apos;ve Worked With
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {clients.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-center aspect-[8/5] rounded-xl bg-brand-black/[0.03] px-6 py-4 overflow-hidden"
                >
                  <img
                    src={c.src}
                    alt={c.name}
                    className="w-auto max-h-full"
                    style={{ height: c.h }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 4b. Services — section header */}
          <div className="flex items-end justify-between mb-10 pb-5 border-b-2 border-brand-black">
            <div>
              <p className="font-display text-[20px] uppercase tracking-[0.3em] text-brand-green mb-2">
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

          {/* 4b. Service cards — 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-brand-black">
            {services.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className={`group block p-8 md:p-10 hover:bg-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange border-brand-black ${
                  i % 2 === 0 ? "md:border-r-2" : ""
                } ${i < 2 ? "border-b-2" : ""}`}
              >
                <p className="font-display text-[20px] uppercase tracking-[0.3em] text-brand-green group-hover:text-brand-yellow transition-colors mb-4">
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
            <p className="font-display text-[20px] uppercase tracking-[0.3em] text-brand-black/70 mb-2">
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
