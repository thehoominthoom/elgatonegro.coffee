import type { Money, MetafieldWithReferences } from "./types";

/** Format a Shopify Money object to a locale currency string. */
export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(money.amount));
}

/** Extract display values from a metafield with resolved metaobject references. */
export function getMetafieldValues(metafield: MetafieldWithReferences | null): string[] {
  if (!metafield) return [];
  return metafield.references.nodes
    .map((node) => node.field?.value)
    .filter((v): v is string => Boolean(v));
}

/** Return true when min and max variant prices differ. */
export function hasPriceRange(
  min: Money,
  max: Money
): boolean {
  return min.amount !== max.amount;
}
