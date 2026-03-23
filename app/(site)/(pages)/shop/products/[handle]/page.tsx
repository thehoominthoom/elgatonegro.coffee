import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getProductByHandle,
  getAllProducts,
} from "@/lib/shopify/storefront";
import { ProductDetail } from "@/components/shop/ProductDetail";

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
      title: `${product.title} — El Gato Negro Shop`,
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

  return (
    <main className="min-h-screen bg-brand-grey grain-overlay">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-xs font-extrabold uppercase tracking-[0.2em] text-brand-black/40 mb-8">
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
          <span className="text-brand-black/60">{product.title}</span>
        </nav>

        {/* Product detail — interactive shell is client, data is server */}
        <ProductDetail product={product} />
      </div>
    </main>
  );
}
