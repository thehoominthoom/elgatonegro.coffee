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
        <div className="pt-10 pb-3 first:pt-0 border-b-2 border-brand-orange mb-1">
          <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-[0.15em] text-brand-grey">
            {item.text}
          </h3>
        </div>
      );

    case "menuHeaderWithPrice":
      return (
        <div className="pt-10 pb-3 first:pt-0 border-b-2 border-brand-orange mb-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-[0.15em] text-brand-grey">
              {item.text}
            </h3>
            <span className="font-sans font-extrabold text-sm md:text-base text-brand-orange whitespace-nowrap">
              {item.price != null && formatPrice(item.price)}
            </span>
          </div>
        </div>
      );

    case "menuHeaderAddon":
      return (
        <div className="pt-10 pb-3 first:pt-0 border-b-2 border-brand-orange mb-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-[0.15em] text-brand-grey">
              {item.text}
            </h3>
            <span className="font-sans font-extrabold text-sm md:text-base text-brand-orange whitespace-nowrap">
              {item.price != null && formatAddonPrice(item.price)}
            </span>
          </div>
        </div>
      );

    case "menuProductItem":
      return (
        <div className="flex items-baseline gap-2 py-2 md:py-2.5">
          <span className="font-sans text-sm md:text-base text-brand-grey/80">
            {item.text}
          </span>
          {item.price != null && (
            <>
              <span className="flex-1 border-b border-dotted border-brand-grey/15 mx-2 self-end mb-[3px]" />
              <span className="font-sans font-extrabold text-sm md:text-base text-brand-orange whitespace-nowrap tabular-nums">
                {formatPrice(item.price)}
              </span>
            </>
          )}
        </div>
      );

    case "menuAddonItem":
      return (
        <div className="flex items-baseline gap-2 py-2 md:py-2.5">
          <span className="font-sans text-sm md:text-base text-brand-grey/80">
            {item.text}
          </span>
          {item.price != null && (
            <>
              <span className="flex-1 border-b border-dotted border-brand-grey/15 mx-2 self-end mb-[3px]" />
              <span className="font-sans font-extrabold text-sm md:text-base text-brand-orange whitespace-nowrap tabular-nums">
                {formatAddonPrice(item.price)}
              </span>
            </>
          )}
        </div>
      );

    case "menuDivider":
      return <hr className="my-6 border-t border-dashed border-brand-grey/10" />;

    default:
      return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MenuPage() {
  let menuData: { title?: string; items?: MenuItem[] } | null = null;
  try {
    menuData = await client.fetch(MENU_QUERY, {});
  } catch {
    // Sanity unavailable — render empty state
  }

  const items = menuData?.items ?? [];
  const columns = splitIntoColumns(items);
  const hasContent = columns.length > 0;

  return (
    <>
      {/* ── Hero header ──────────────────────────────────────────── */}
      <section className="relative bg-brand-black overflow-hidden -mt-44 md:-mt-36">
        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-16 md:pb-24">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
            What We Serve
          </p>
          <h1
            className="font-display font-bold uppercase text-brand-grey tracking-tight leading-[0.9]"
            style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
          >
            The
            <br />
            Menu.
          </h1>
          <p className="font-accent text-lg md:text-2xl text-brand-grey/50 max-w-sm mt-8 -rotate-1">
            Pulled to order. No drip. No shortcuts.
          </p>
        </div>
      </section>

      {/* ── Menu body ────────────────────────────────────────────── */}
      <section className="relative bg-brand-black overflow-hidden">
        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pb-20 md:pb-28">
          {hasContent ? (
            <div
              className={
                columns.length > 1
                  ? "grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-0"
                  : "max-w-lg mx-auto"
              }
            >
              {columns.map((column, colIdx) => (
                <div
                  key={colIdx}
                  className={
                    colIdx < columns.length - 1
                      ? "md:border-r md:border-dashed md:border-brand-grey/10 md:pr-12 lg:pr-16"
                      : undefined
                  }
                >
                  {column.map((item) => (
                    <MenuItemRow key={item._key} item={item} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-sans text-sm text-brand-grey/40">
                Menu coming soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
