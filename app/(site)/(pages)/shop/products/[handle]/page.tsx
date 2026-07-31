import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getProductByHandle,
  getAllProducts,
  getProductRecommendations,
} from "@/lib/shopify/storefront";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductCard } from "@/components/shop/ProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const products = await getAllProducts(100);
    return products.map((p) => ({ handle: p.handle }));
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
    const product = await getProductByHandle(handle);
    if (!product) return {};
    return {
      title: product.title,
      alternates: { canonical: `/shop/products/${handle}` },
      description: product.description || `${product.title} from El Gato Negro Coffee.`,
      openGraph: {
        title: `${product.title} — El Gato Negro Shop`,
        description: product.description,
        images: product.featuredImage
          ? [
              {
                url: product.featuredImage.url,
                width: product.featuredImage.width,
                height: product.featuredImage.height,
                alt: product.featuredImage.altText ?? product.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.title} — El Gato Negro Shop`,
        description: product.description || `${product.title} from El Gato Negro Coffee.`,
        images: product.featuredImage ? [product.featuredImage.url] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let product: Awaited<ReturnType<typeof getProductByHandle>> = null;
  try {
    product = await getProductByHandle(handle);
  } catch {
    notFound();
  }

  if (!product) notFound();

  let recommendations: Awaited<ReturnType<typeof getProductRecommendations>> = [];
  try {
    recommendations = await getProductRecommendations(product.id);
  } catch {
    // Recommendations failure shouldn't break the page
  }

  const firstVariant = product.variants.nodes[0];
  const collection = product.collections.nodes[0];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    ...(product.featuredImage && { image: product.featuredImage.url }),
    brand: {
      "@type": "Brand",
      name: product.vendor,
    },
    offers: {
      "@type": "Offer",
      price: firstVariant?.price.amount ?? product.priceRange.minVariantPrice.amount,
      priceCurrency: firstVariant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://www.elgatonegro.coffee/shop/products/${handle}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: "https://www.elgatonegro.coffee/shop" },
      ...(collection
        ? [{
            "@type": "ListItem" as const,
            position: 2,
            name: collection.title,
            item: `https://www.elgatonegro.coffee/shop/collections/${collection.handle}`,
          }]
        : []),
      {
        "@type": "ListItem",
        position: collection ? 3 : 2,
        name: product.title,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-brand-grey grain-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 min-w-0 font-sans text-xs font-extrabold uppercase tracking-[0.2em] text-brand-black/40 mb-8">
          <Link href="/shop" className="hover:text-brand-orange transition-colors flex items-center gap-1.5">
            <ArrowLeft size={12} />
            Shop
          </Link>
          {product.collections.nodes[0] && (
            <>
              <span>/</span>
              <Link
                href={`/shop/collections/${product.collections.nodes[0].handle}`}
                className="hover:text-brand-orange transition-colors"
              >
                {product.collections.nodes[0].title}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-brand-black/60 truncate min-w-0">{product.title}</span>
        </nav>

        {/* Product detail — interactive shell is client, data is server */}
        <ProductDetail product={product} />

        {recommendations.length > 0 && (
          <section className="mt-16 md:mt-24 pt-10 md:pt-14 border-t border-dashed border-brand-black/15">
            <div className="mb-8 md:mb-10">
              <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60">
                The Other Stuff
              </p>
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {recommendations.map((rec) => (
                <div key={rec.id} className="w-[70vw] max-w-[280px] shrink-0 snap-start">
                  <ProductCard product={rec} />
                </div>
              ))}
            </div>

            {/* Desktop: 4-column grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-4">
              {recommendations.slice(0, 4).map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
