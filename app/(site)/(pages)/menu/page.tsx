import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Menu | El Gato Negro Coffee",
  description:
    "Browse El Gato Negro's drink menu — espresso, specialty drinks, add-ons, and more from Nashville's mobile coffee cart.",
};

// ─── ISR ──────────────────────────────────────────────────────────────────────

export const revalidate = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  _type: string;
  _key: string;
  text?: string;
  price?: number;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const MENU_QUERY = `*[_type == "menu"][0]{
  title,
  items[]{
    _type,
    _key,
    text,
    price
  }
}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function formatAddonPrice(price: number): string {
  return `+$${price.toFixed(2)}`;
}

/**
 * Splits items into columns based on menuColumnBreak markers.
 * Each segment is everything between breaks (or start/end of the array).
 */
function splitIntoColumns(items: MenuItem[]): MenuItem[][] {
  const columns: MenuItem[][] = [];
  let current: MenuItem[] = [];

  for (const item of items) {
    if (item._type === "menuColumnBreak") {
      columns.push(current);
      current = [];
    } else {
      current.push(item);
    }
  }
  columns.push(current);

  return columns.filter((col) => col.length > 0);
}

// ─── Item renderers ───────────────────────────────────────────────────────────

function MenuItemRow({ item }: { item: MenuItem }) {
  switch (item._type) {
    case "menuHeader":
      return (
        <div className="pt-6 pb-2 first:pt-0">
          <h3 className="font-display font-bold text-lg md:text-xl uppercase tracking-tight text-brand-black">
            {item.text}
          </h3>
        </div>
      );

    case "menuHeaderWithPrice":
      return (
        <div className="pt-6 pb-2 first:pt-0 flex items-baseline justify-between gap-4">
          <h3 className="font-display font-bold text-lg md:text-xl uppercase tracking-tight text-brand-black">
            {item.text}
          </h3>
          <span className="font-sans font-extrabold text-sm text-brand-orange whitespace-nowrap">
            {item.price != null && formatPrice(item.price)}
          </span>
        </div>
      );

    case "menuHeaderAddon":
      return (
        <div className="pt-6 pb-2 first:pt-0 flex items-baseline justify-between gap-4">
          <h3 className="font-display font-bold text-lg md:text-xl uppercase tracking-tight text-brand-black">
            {item.text}
          </h3>
          <span className="font-sans font-extrabold text-sm text-brand-orange whitespace-nowrap">
            {item.price != null && formatAddonPrice(item.price)}
          </span>
        </div>
      );

    case "menuProductItem":
      return (
        <div className="flex items-baseline justify-between gap-4 py-1.5">
          <span className="font-sans text-sm text-brand-black/80">
            {item.text}
          </span>
          <span className="font-sans font-extrabold text-sm text-brand-orange whitespace-nowrap">
            {item.price != null && formatPrice(item.price)}
          </span>
        </div>
      );

    case "menuAddonItem":
      return (
        <div className="flex items-baseline justify-between gap-4 py-1.5">
          <span className="font-sans text-sm text-brand-black/80">
            {item.text}
          </span>
          <span className="font-sans font-extrabold text-sm text-brand-orange whitespace-nowrap">
            {item.price != null && formatAddonPrice(item.price)}
          </span>
        </div>
      );

    case "menuDivider":
      return (
        <hr className="my-4 border-t border-brand-black/15" />
      );

    default:
      return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MenuPage() {
  let menuData: { title?: string; items?: MenuItem[] } | null = null;
  try {
    menuData = await client.fetch(MENU_QUERY, {}, { next: { revalidate: 60 } });
  } catch {
    // Sanity unavailable — render empty state
  }

  const items = menuData?.items ?? [];
  const columns = splitIntoColumns(items);
  const hasContent = columns.length > 0;

  return (
    <main className="min-h-screen bg-brand-grey">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="mb-10 pb-6 border-b-2 border-brand-black">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.3em] text-brand-black/50 mb-2">
            What We Serve
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight">
            Menu
          </h1>
        </div>

        {/* ── Menu content ────────────────────────────────────── */}
        {hasContent ? (
          <div
            className={`grid gap-8 md:gap-12 ${
              columns.length > 1 ? "md:grid-cols-2" : "max-w-xl"
            }`}
          >
            {columns.map((column, colIdx) => (
              <div key={colIdx}>
                {column.map((item) => (
                  <MenuItemRow key={item._key} item={item} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-brand-black/50">
            Menu coming soon.
          </p>
        )}
      </div>
    </main>
  );
}
