"use client";

import type { ProductVariant } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/shopify/utils";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  // Group by option name (e.g. "Size", "Weight")
  // We pull unique option names from the first variant's selectedOptions
  const optionNames = variants[0]?.selectedOptions
    .map((o) => o.name)
    .filter((name) => name !== "Title") ?? [];

  // Single "Default Title" variant — no selector needed
  if (
    optionNames.length === 0 ||
    (optionNames.length === 1 &&
      variants[0]?.selectedOptions[0]?.value === "Default Title")
  ) {
    return null;
  }

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  return (
    <div className="space-y-6">
      {optionNames.map((optionName) => {
        // Unique values for this option
        const values = Array.from(
          new Set(
            variants
              .map((v) => v.selectedOptions.find((o) => o.name === optionName)?.value)
              .filter((v): v is string => !!v)
          )
        );

        return (
          <div key={optionName}>
            <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/60 mb-3">
              {optionName}
              {selectedVariant && (
                <span className="ml-2 text-brand-black normal-case font-normal tracking-normal">
                  — {selectedVariant.selectedOptions.find((o) => o.name === optionName)?.value}
                </span>
              )}
            </p>

            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                // Find the variant that matches the current selection with this value
                const matchingVariant = variants.find((v) =>
                  v.selectedOptions.some(
                    (o) => o.name === optionName && o.value === value
                  )
                );
                const isSelected =
                  selectedVariant?.selectedOptions.some(
                    (o) => o.name === optionName && o.value === value
                  ) ?? false;
                const isAvailable = matchingVariant?.availableForSale ?? false;

                return (
                  <button
                    key={value}
                    onClick={() => matchingVariant && onSelect(matchingVariant)}
                    disabled={!isAvailable}
                    aria-pressed={isSelected}
                    aria-label={`${optionName}: ${value}${!isAvailable ? " — sold out" : ""}`}
                    className={[
                      "px-4 py-2.5 font-sans font-extrabold text-xs uppercase tracking-wider border rounded-sm transition-colors",
                      isSelected
                        ? "bg-brand-black text-brand-grey border-brand-black"
                        : isAvailable
                        ? "bg-transparent text-brand-black border-brand-black/30 hover:border-brand-black/80"
                        : "bg-transparent text-brand-black/30 border-brand-black/10 cursor-not-allowed line-through",
                    ].join(" ")}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Price for selected variant */}
      {selectedVariant && (
        <p className="font-sans font-extrabold text-2xl text-brand-orange">
          {formatMoney(selectedVariant.price)}
          {selectedVariant.compareAtPrice &&
            parseFloat(selectedVariant.compareAtPrice.amount) >
              parseFloat(selectedVariant.price.amount) && (
              <span className="ml-3 text-base text-brand-black/30 line-through font-normal">
                {formatMoney(selectedVariant.compareAtPrice)}
              </span>
            )}
        </p>
      )}
    </div>
  );
}
