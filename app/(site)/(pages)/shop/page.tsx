import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCollections } from "@/lib/shopify/storefront";

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

export default async function ShopPage() {
  let collections: Awaited<ReturnType<typeof getAllCollections>> = [];
  try {
    collections = await getAllCollections(20);
  } catch {
    // Shopify unavailable — render empty state
  }

  return (
    <main className="min-h-screen bg-brand-grey">
      {/* ── Header ──────────────────────────────────────────────── */}
      <section className="bg-brand-grey px-4 md:px-6 pt-4 pb-10 md:pt-8 md:pb-16">
        <div className="mx-auto max-w-7xl border-b-2 border-brand-black pb-10 md:pb-16">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.3em] text-brand-black/50 mb-2">
            El Gato Negro
          </p>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight text-brand-black">
            The Shop
          </h1>
          <p className="font-sans text-base text-brand-black/60 mt-3 max-w-md">
            Beans, merch, and gear. Everything brewed with intention.
          </p>
        </div>
      </section>

      {/* ── Collections grid ────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-16">
        <div className="mx-auto max-w-7xl">
          {collections.length === 0 ? (
            <p className="font-sans text-sm text-brand-black/40 py-12 text-center">
              Coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-black/10">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── CollectionCard ───────────────────────────────────────────────────────────

function CollectionCard({
  collection,
}: {
  collection: Awaited<ReturnType<typeof getAllCollections>>[number];
}) {
  return (
    <Link
      href={`/shop/collections/${collection.handle}`}
      className="group block bg-brand-grey overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-brand-black/5 relative">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brand-black/10 grain-overlay" />
        )}
      </div>

      {/* Meta */}
      <div className="px-6 py-5 flex items-center justify-between border-t border-brand-black/10">
        <div>
          <p className="font-sans font-extrabold text-sm uppercase tracking-[0.15em] text-brand-black">
            {collection.title}
          </p>
          {collection.description && (
            <p className="font-sans text-xs text-brand-black/50 mt-1 line-clamp-1">
              {collection.description}
            </p>
          )}
        </div>
        <ArrowRight
          size={16}
          className="text-brand-black/30 group-hover:text-brand-orange group-hover:translate-x-1 transition-all shrink-0"
        />
      </div>
    </Link>
  );
}
