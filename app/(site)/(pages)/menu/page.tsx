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

interface MenuBlock {
  _type: string;
  _key: string;
  sectionName?: string;
  items?: MenuItem[];
  leftSectionName?: string;
  leftItems?: MenuItem[];
  rightSectionName?: string;
  rightItems?: MenuItem[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const MENU_QUERY = `*[_type == "menu"][0]{
  title,
  blocks[]{
    _type,
    _key,
    sectionName,
    items[]{_type, _key, text, price},
    leftSectionName,
    leftItems[]{_type, _key, text, price},
    rightSectionName,
    rightItems[]{_type, _key, text, price}
  }
}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function formatAddonPrice(price: number): string {
  return `+$${price.toFixed(2)}`;
}

// ─── Item renderers ───────────────────────────────────────────────────────────

function MenuItemRow({ item }: { item: MenuItem }) {
  switch (item._type) {
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

function SectionColumn({ name, items }: { name: string; items: MenuItem[] }) {
  return (
    <div>
      <div className="pt-10 pb-3 first:pt-0 border-b-2 border-brand-orange mb-1">
        <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-[0.15em] text-brand-grey">
          {name}
        </h3>
      </div>
      {items.map((item) => (
        <MenuItemRow key={item._key} item={item} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MenuPage() {
  let menuData: { title?: string; blocks?: MenuBlock[] } | null = null;
  try {
    menuData = await client.fetch(MENU_QUERY, {});
  } catch {
    // Sanity unavailable — render empty state
  }

  const blocks = menuData?.blocks ?? [];
  const hasContent = blocks.length > 0;

  return (
    <>
      {/* ── Hero header ──────────────────────────────────────────── */}
      <section className="relative bg-brand-black overflow-hidden -mt-44 md:-mt-36">
        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-52 md:pt-40 pb-16 md:pb-24">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
            What We Serve
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase text-brand-grey tracking-tight leading-[0.9]">
            The Menu
          </h1>
        </div>
      </section>

      {/* ── Menu body ────────────────────────────────────────────── */}
      <section className="relative bg-brand-black overflow-hidden">
        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pb-20 md:pb-28">
          {hasContent ? (
            <div className="space-y-0">
              {blocks.map((block) => {
                if (block._type === "menuFullWidthSection") {
                  return (
                    <SectionColumn
                      key={block._key}
                      name={block.sectionName || ""}
                      items={block.items ?? []}
                    />
                  );
                }
                if (block._type === "menuTwoColumnSplit") {
                  return (
                    <div
                      key={block._key}
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-0"
                    >
                      <div className="md:border-r md:border-dashed md:border-brand-grey/10 md:pr-12 lg:pr-16">
                        <SectionColumn
                          name={block.leftSectionName || ""}
                          items={block.leftItems ?? []}
                        />
                      </div>
                      <div>
                        <SectionColumn
                          name={block.rightSectionName || ""}
                          items={block.rightItems ?? []}
                        />
                      </div>
                    </div>
                  );
                }
                return null;
              })}
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
