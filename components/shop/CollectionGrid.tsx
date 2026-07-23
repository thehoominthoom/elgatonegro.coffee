"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { getMetafieldValues } from "@/lib/shopify/utils";
import { ProductCard } from "./ProductCard";

type SortKey = "featured" | "newest" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A\u2013Z)" },
];

interface Filters {
  roast: string;
  country: string;
  vendor: string;
}

const DEFAULT_FILTERS: Filters = { roast: "", country: "", vendor: "" };

const SELECT_STYLES =
  "font-sans text-xs uppercase tracking-wide text-brand-black bg-brand-grey border border-brand-black/20 px-3 py-2.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-brand-black/40 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-grey rounded-sm";

const CHEVRON_BG = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 8px center",
} as const;

function getFirstMetafieldValue(
  product: Product,
  field: "roastLevel" | "country"
): string | null {
  const values = getMetafieldValues(product[field]);
  return values[0] ?? null;
}

/** Extract sorted, deduplicated values for a given dimension across all products. */
function getUniqueValues(
  products: Product[],
  dimension: "roast" | "country" | "vendor"
): string[] {
  const set = new Set<string>();

  for (const product of products) {
    if (dimension === "vendor") {
      if (product.vendor) set.add(product.vendor);
    } else {
      const field = dimension === "roast" ? "roastLevel" : "country";
      const val = getFirstMetafieldValue(product, field);
      if (val) set.add(val);
    }
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function filterProducts(products: Product[], filters: Filters): Product[] {
  const hasRoast = filters.roast !== "";
  const hasCountry = filters.country !== "";
  const hasVendor = filters.vendor !== "";

  if (!hasRoast && !hasCountry && !hasVendor) return products;

  return products.filter((product) => {
    if (hasRoast) {
      const val = getFirstMetafieldValue(product, "roastLevel");
      if (val !== filters.roast) return false;
    }
    if (hasCountry) {
      const val = getFirstMetafieldValue(product, "country");
      if (val !== filters.country) return false;
    }
    if (hasVendor) {
      if (product.vendor !== filters.vendor) return false;
    }
    return true;
  });
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
  }

  return sorted;
}

interface CollectionGridProps {
  products: Product[];
}

export function CollectionGrid({ products }: CollectionGridProps) {
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filterOptions = useMemo(
    () => ({
      roast: getUniqueValues(products, "roast"),
      country: getUniqueValues(products, "country"),
      vendor: getUniqueValues(products, "vendor"),
    }),
    [products]
  );

  const result = useMemo(() => {
    const filtered = filterProducts(products, filters);
    return sortProducts(filtered, sortBy);
  }, [products, filters, sortBy]);

  const filtersActive =
    filters.roast !== "" || filters.country !== "" || filters.vendor !== "";

  if (products.length === 0) {
    return (
      <p className="font-sans text-sm text-brand-black/40 py-12 text-center">
        No products in this collection yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-4">
        {/* Filters */}
        {filterOptions.roast.length >= 2 && (
          <label className="flex items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-black/40">
              Roast
            </span>
            <select
              value={filters.roast}
              onChange={(e) =>
                setFilters((f) => ({ ...f, roast: e.target.value }))
              }
              className={SELECT_STYLES}
              style={CHEVRON_BG}
            >
              <option value="">All Roasts</option>
              {filterOptions.roast.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        )}

        {filterOptions.country.length >= 2 && (
          <label className="flex items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-black/40">
              Country
            </span>
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters((f) => ({ ...f, country: e.target.value }))
              }
              className={SELECT_STYLES}
              style={CHEVRON_BG}
            >
              <option value="">All Countries</option>
              {filterOptions.country.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        )}

        {filterOptions.vendor.length >= 2 && (
          <label className="flex items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-black/40">
              Vendor
            </span>
            <select
              value={filters.vendor}
              onChange={(e) =>
                setFilters((f) => ({ ...f, vendor: e.target.value }))
              }
              className={SELECT_STYLES}
              style={CHEVRON_BG}
            >
              <option value="">All Vendors</option>
              {filterOptions.vendor.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Clear filters */}
        {filtersActive && (
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-orange hover:text-brand-orange/70 transition-colors"
          >
            Clear filters
          </button>
        )}

        {/* Sort — pushed right */}
        <label className="flex items-center gap-2 sm:ml-auto">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-black/40">
            Sort by
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className={SELECT_STYLES}
            style={CHEVRON_BG}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Filtered count */}
      {filtersActive && (
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-black/40 mb-3">
          Showing {result.length} of {products.length} products
        </p>
      )}

      {result.length === 0 ? (
        <div className="text-center py-16 border border-brand-black/10 rounded-sm">
          <p className="font-sans text-sm text-brand-black/50 mb-1">
            No products match your filters.
          </p>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="font-sans text-xs uppercase tracking-[0.15em] text-brand-orange hover:text-brand-yellow transition-colors mt-2"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {result.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
