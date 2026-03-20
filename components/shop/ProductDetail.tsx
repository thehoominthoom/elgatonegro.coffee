"use client";

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { getMetafieldValues } from "@/lib/shopify/utils";
import { VariantSelector } from "./VariantSelector";
import { AddToCartButton } from "./AddToCartButton";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const variants = product.variants.nodes;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    // Default to first available variant, or first if none available
    variants.find((v) => v.availableForSale) ?? variants[0]
  );

  // Active image: prefer selected variant image, fall back to featured
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = product.images.nodes;
  const activeImage = images[activeImageIndex] ?? product.featuredImage;

  const roastValues = getMetafieldValues(product.roastLevel);
  const flavorValues = getMetafieldValues(product.flavorNotes);
  const countryValues = getMetafieldValues(product.country);

  function handleVariantSelect(variant: ProductVariant) {
    setSelectedVariant(variant);
    // Jump to variant image if it exists in the gallery
    if (variant.image) {
      const idx = images.findIndex((img) => img.url === variant.image?.url);
      if (idx !== -1) setActiveImageIndex(idx);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* ── Left: Images ───────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Main image */}
        <div className="aspect-square bg-brand-black/5 overflow-hidden">
          {activeImage ? (
            <Image
              src={activeImage.url}
              alt={activeImage.altText ?? product.title}
              width={800}
              height={800}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-brand-black/10" />
          )}
        </div>

        {/* Thumbnail strip — only if multiple images */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActiveImageIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={[
                  "shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors",
                  i === activeImageIndex
                    ? "border-brand-orange"
                    : "border-transparent hover:border-brand-black/30",
                ].join(" ")}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `${product.title} ${i + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Info ────────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Vendor / eyebrow */}
        {product.vendor && (
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/40">
            {product.vendor}
          </p>
        )}

        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight text-brand-black leading-none">
          {product.title}
        </h1>

        {!product.availableForSale && (
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-red-600">
            Currently Sold Out
          </p>
        )}

        {/* Variant selector (includes selected price) */}
        <VariantSelector
          variants={variants}
          selectedVariantId={selectedVariant?.id ?? null}
          onSelect={handleVariantSelect}
        />

        {/* Add to cart */}
        <AddToCartButton
          variantId={selectedVariant?.id ?? null}
          availableForSale={selectedVariant?.availableForSale ?? false}
        />

        {/* Coffee specs */}
        {(roastValues.length > 0 || flavorValues.length > 0 || countryValues.length > 0) && (
          <div className="border border-brand-black/10 divide-y divide-brand-black/10">
            {roastValues[0] && (
              <div className="flex justify-between px-4 py-3">
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-brand-black/40">Roast</span>
                <span className="font-sans text-sm font-extrabold text-brand-black">{roastValues[0]}</span>
              </div>
            )}
            {flavorValues.length > 0 && (
              <div className="flex justify-between px-4 py-3">
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-brand-black/40">Flavor Notes</span>
                <span className="font-sans text-sm font-extrabold text-brand-black">{flavorValues.join(", ")}</span>
              </div>
            )}
            {countryValues[0] && (
              <div className="flex justify-between px-4 py-3">
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-brand-black/40">Origin</span>
                <span className="font-sans text-sm font-extrabold text-brand-black">{countryValues[0]}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {product.descriptionHtml ? (
          <div
            className="font-sans text-sm leading-relaxed text-brand-black/70 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.descriptionHtml),
            }}
          />
        ) : product.description ? (
          <p className="font-sans text-sm leading-relaxed text-brand-black/70">
            {product.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
