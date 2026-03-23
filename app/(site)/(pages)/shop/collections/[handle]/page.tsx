import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getCollectionByHandle,
  getAllCollections,
} from "@/lib/shopify/storefront";
import { CollectionGrid } from "@/components/shop/CollectionGrid";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const collections = await getAllCollections(50);
    return collections.map((c) => ({ handle: c.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  try {
    const collection = await getCollectionByHandle(handle, 1);
    if (!collection) return {};
    return {
      title: `${collection.title} — El Gato Negro Shop`,
      description: collection.description || `Shop ${collection.title} from El Gato Negro Coffee.`,
    };
  } catch {
    return {};
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let collection: Awaited<ReturnType<typeof getCollectionByHandle>> = null;
  try {
    collection = await getCollectionByHandle(handle, 50);
  } catch {
    notFound();
  }

  if (!collection) notFound();

  const products = collection.products.nodes;

  return (
    <main className="min-h-screen bg-brand-grey grain-overlay">
      {/* ── Header ──────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pt-4 pb-10 md:pt-8 md:pb-14">
        <div className="mx-auto max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-sans text-xs font-extrabold uppercase tracking-[0.2em] text-brand-black/40 mb-6">
            <Link href="/shop" className="hover:text-brand-orange transition-colors flex items-center gap-1.5">
              <ArrowLeft size={12} />
              Shop
            </Link>
            <span>/</span>
            <span className="text-brand-black/60">{collection.title}</span>
          </nav>

          <div className="border-b-2 border-brand-black pb-10 md:pb-14">
            <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight text-brand-black">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="font-sans text-base text-brand-black/60 mt-3 max-w-md">
                {collection.description}
              </p>
            )}
            <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/30 mt-4">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Product grid ────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-16">
        <div className="mx-auto max-w-7xl relative z-10">
          <CollectionGrid products={products} />
        </div>
      </section>
    </main>
  );
}
