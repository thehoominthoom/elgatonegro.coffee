import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { formatMoney, hasPriceRange, getMetafieldValues } from "@/lib/shopify/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange, vendor, roastLevel, flavorNotes, availableForSale } = product;
  const { minVariantPrice, maxVariantPrice } = priceRange;
  const showRange = hasPriceRange(minVariantPrice, maxVariantPrice);
  const roastValues = getMetafieldValues(roastLevel);
  const flavorValues = getMetafieldValues(flavorNotes);
  const soldOut = !availableForSale;

  return (
    <Link
      href={`/shop/products/${handle}`}
      className="group block bg-brand-grey rounded-sm overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-brand-black/5 grain-overlay-sm">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            width={600}
            height={600}
            className="w-full h-full object-cover photo-treatment-sm group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brand-black/10" />
        )}
        {soldOut && (
          <span className="absolute top-2 right-2 z-[3] font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] bg-brand-black/80 text-white px-2 py-1 rounded-sm">
            Sold Out
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="px-4 py-4">
        {vendor && (
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-black/40 mb-1">
            {vendor}
          </p>
        )}
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
        {(roastValues.length > 0 || flavorValues.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {roastValues[0] && (
              <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-brand-black/50 border border-brand-black/10 px-1.5 py-0.5 rounded-sm">
                {roastValues[0]}
              </span>
            )}
            {flavorValues.length > 0 && (
              <span className="font-sans text-[10px] text-brand-black/50 px-1.5 py-0.5 line-clamp-1">
                {flavorValues.join(", ")}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
