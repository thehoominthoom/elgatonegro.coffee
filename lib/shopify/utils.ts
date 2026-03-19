import type { Money } from "./types";

/** Format a Shopify Money object to a locale currency string. */
export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(money.amount));
}

/** Return true when min and max variant prices differ. */
export function hasPriceRange(
  min: Money,
  max: Money
): boolean {
  return min.amount !== max.amount;
}
