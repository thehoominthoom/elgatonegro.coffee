import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip zip code and country from a Google Places formatted address for display. */
export function trimAddress(address: string): string {
  const parts = address.split(",").map((s) => s.trim());
  // Remove country (last part, e.g. "USA")
  if (parts.length > 1) parts.pop();
  // Remove zip code from state part (e.g. "TX 78701" → "TX")
  if (parts.length > 0) {
    parts[parts.length - 1] = parts[parts.length - 1]
      .replace(/\s+\d{5}(-\d{4})?$/, "")
      .trim();
  }
  return parts.join(", ");
}
