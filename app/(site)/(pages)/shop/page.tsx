import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop — El Gato Negro Coffee",
  description:
    "Coffee beans, merchandise, and more from Nashville's mobile espresso cart.",
  openGraph: {
    title: "Shop — El Gato Negro Coffee",
    description:
      "Coffee beans, merchandise, and more from Nashville's mobile espresso cart.",
    type: "website",
  },
};

const SHOP_CATEGORIES = [
  { title: "Coffee\nBeans", href: "/shop/collections/coffee-beans", image: "/images/hero/hero-barista_roasting.webp" },
  { title: "Apparel", href: "/shop/collections/apparel", image: "/images/about/phil_and_juan_making_coffee_exchange-260110.webp" },
  { title: "Merchandise", href: "/shop/collections/merchandise", image: "/images/hero/juan-stamping-cups.webp" },
  { title: "Best\nSellers", href: "/shop/collections/best-sellers", image: "/images/hero/juan-phil-serving.webp" },
];

export default function ShopPage() {
  return (
    <section className="relative w-full -mt-44 md:-mt-36 pt-[7.5rem] md:pt-[5.75rem]">
      {/* ── Mobile hero header ──────────────────────────────────── */}
      <section className="md:hidden relative bg-brand-black overflow-hidden grain-overlay-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-12">
          <p className="font-display font-bold text-base uppercase tracking-[0.25em] text-brand-orange mb-4">
            What We&apos;re Selling
          </p>
          <h1 className="font-display font-bold text-5xl uppercase text-brand-grey tracking-tight">
            Shop
          </h1>
        </div>
      </section>

      {/* ── Category grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {SHOP_CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative block overflow-hidden aspect-[3/2] md:aspect-auto md:h-[calc((100vh-5.75rem)/2)] grain-overlay-dark"
          >
            <Image
              src={cat.image}
              alt={cat.title.replace("\n", " ")}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover photo-treatment group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-brand-black/30 to-brand-black/20 group-hover:from-brand-black/80 group-hover:via-brand-black/40 transition-all duration-500" />
            <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase text-brand-grey tracking-tight text-center leading-[0.9]">
                {cat.title.split("\n").map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Centered "SHOP" overlay — desktop only, sits at the grid intersection */}
      <div className="hidden md:flex absolute inset-0 top-[5.75rem] z-20 items-center justify-center pointer-events-none">
        <h1
          className="font-display font-bold uppercase text-brand-grey tracking-tight"
          style={{
            fontSize: "clamp(3rem, 12vw, 10rem)",
            textShadow: "0 4px 30px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          Shop
        </h1>
      </div>

    </section>
  );
}
