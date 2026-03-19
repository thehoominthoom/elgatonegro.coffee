import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { formatMoney, hasPriceRange } from "@/lib/shopify/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange } = product;
  const { minVariantPrice, maxVariantPrice } = priceRange;
  const showRange = hasPriceRange(minVariantPrice, maxVariantPrice);

  return (
    <Link
      href={`/shop/products/${handle}`}
      className="group block bg-brand-grey border border-brand-black/10 hover:border-brand-black/30 transition-colors"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-brand-black/5">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            width={600}
            height={600}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brand-black/10" />
        )}
      </div>

      {/* Meta */}
      <div className="px-4 py-4 border-t border-brand-black/10">
        <p className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black line-clamp-1">
          {title}
        </p>
        <p className="font-sans text-sm text-brand-orange font-extrabold mt-1">
          {showRange ? (
            <>
              From {formatMoney(minVariantPrice)}
            </>
          ) : (
            formatMoney(minVariantPrice)
          )}
        </p>
      </div>
    </Link>
  );
}
