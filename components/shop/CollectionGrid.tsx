"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { getMetafieldValues } from "@/lib/shopify/utils";
import { ProductCard } from "./ProductCard";

type SortKey =
  | "featured"
  | "newest"
  | "name"
  | "roast"
  | "country"
  | "vendor";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A\u2013Z)" },
  { value: "roast", label: "Roast Level" },
  { value: "country", label: "Country" },
  { value: "vendor", label: "Vendor" },
];

function getFirstMetafieldValue(
  product: Product,
  field: "roastLevel" | "country"
): string | null {
  const values = getMetafieldValues(product[field]);
  return values[0] ?? null;
}

function sortProducts(products: Product[], key: SortKey): Product[] {
  if (key === "featured") return products;

  const sorted = [...products];

  switch (key) {
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;

    case "name":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;

    case "roast":
    case "country": {
      const field = key === "roast" ? "roastLevel" : "country";
      sorted.sort((a, b) => {
        const aVal = getFirstMetafieldValue(a, field);
        const bVal = getFirstMetafieldValue(b, field);
        if (!aVal && !bVal) return 0;
        if (!aVal) return 1;
        if (!bVal) return -1;
        return aVal.localeCompare(bVal);
      });
      break;
    }

    case "vendor":
      sorted.sort((a, b) => a.vendor.localeCompare(b.vendor));
      break;
  }

  return sorted;
}

interface CollectionGridProps {
  products: Product[];
}

export function CollectionGrid({ products }: CollectionGridProps) {
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const sorted = useMemo(() => sortProducts(products, sortBy), [products, sortBy]);

  if (products.length === 0) {
    return (
      <p className="font-sans text-sm text-brand-black/40 py-12 text-center">
        No products in this collection yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <label className="flex items-center gap-2">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-black/40">
            Sort by
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="font-sans text-xs uppercase tracking-wide text-brand-black bg-brand-grey border border-brand-black/20 px-3 py-1.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-brand-black/40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-brand-black/10">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
