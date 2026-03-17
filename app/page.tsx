import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { CartStatusBar } from "@/components/home/CartStatusBar";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SanityEvent {
  _id: string;
  title: string;
  date: string;
  location: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  type: "hosting" | "attending";
  isHappeningNow: boolean;
  slug: string | null;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const EVENTS_QUERY = `*[_type == "event"] | order(date asc) {
  _id,
  title,
  date,
  location,
  image,
  type,
  isHappeningNow,
  "slug": slug.current
}`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const sanityEvents = await client.fetch<SanityEvent[]>(
    EVENTS_QUERY,
    {},
    { next: { revalidate: 60 } }
  );

  const heroSlides: HeroSlide[] = sanityEvents.map((e) => ({
    id: e._id,
    title: e.title,
    date: formatEventDate(e.date),
    location: e.location ?? "",
    type: e.type ?? "hosting",
    isHappeningNow: e.isHappeningNow ?? false,
    image: e.image
      ? urlFor(e.image).width(1440).height(900).url()
      : "/images/hero/hero-barista_roasting.jpg",
    href: e.slug ? `/events/${e.slug}` : "/events",
  }));

  return (
    <>
      {/* ── 1. Utility — Cart Status ──────────────────────────────────────── */}
      <CartStatusBar />

      {/* ── 2. Culture — Hero Carousel ────────────────────────────────────── */}
      <HeroCarousel slides={heroSlides} />

      {/* ── 2b. Events Strip ──────────────────────────────────────────────── */}
      <section className="bg-brand-black border-t border-brand-grey/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4 border-b border-brand-grey/10">
            <span className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-grey/40">
              Upcoming
            </span>
            <Link
              href="/events"
              className="font-display text-[10px] uppercase tracking-[0.25em] text-brand-grey/40 hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              All Events <ArrowRight size={10} />
            </Link>
          </div>

          {sanityEvents.map((event) => (
            <Link
              key={event._id}
              href={event.slug ? `/events/${event.slug}` : "/events"}
              className="group grid grid-cols-[5rem_1fr_auto] md:grid-cols-[7rem_1fr_auto] items-center gap-4 md:gap-8 py-4 border-b border-brand-grey/10 hover:border-brand-grey/20 transition-colors"
            >
              <span className="font-display text-[10px] uppercase tracking-[0.15em] text-brand-grey/40 tabular-nums">
                {formatEventDate(event.date)}
              </span>
              <span className="font-display text-sm uppercase tracking-tight text-brand-grey group-hover:text-brand-orange transition-colors">
                {event.title}
              </span>
              <span className="font-display text-[10px] uppercase tracking-[0.15em] text-brand-grey/30 hidden sm:block text-right">
                {event.location}
              </span>
            </Link>
          ))}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-black/40 mb-10">
              Who We&apos;ve Worked With
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-4">
              {clients.map((client) => (
                <span
                  key={client}
                  className="font-display text-sm uppercase tracking-[0.1em] text-brand-black/50"
                >
                  {client}
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
                <p className="font-sans text-sm leading-relaxed text-brand-black/60 group-hover:text-brand-grey/60 transition-colors mb-6">
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
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-black/40 mb-2">
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
