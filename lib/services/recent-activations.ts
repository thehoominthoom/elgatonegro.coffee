import type { ServiceSlug } from "@/lib/inquiry/config";

export interface RecentActivationsData {
  eyebrow: string;
  items: string[];
}

/**
 * Hardcoded for launch. Structure allows swap-in from a Sanity query later
 * without changing the component API. Names pulled from real event/venue
 * history in the image library. No dates, no locations — text-only proof.
 *
 * Only brand-activations and community-conventions carry a ticker.
 * Weddings + private-events skip deliberately (design-spec §2.4 / §2.5).
 */
export const RECENT_ACTIVATIONS: Partial<
  Record<ServiceSlug, RecentActivationsData>
> = {
  "brand-activations": {
    eyebrow: "RECENT ACTIVATIONS *",
    items: [
      "1111 Church",
      "Nike Stampede",
      "Production Set: Scarpetta",
      "RAD 100",
      "The Exchange",
      "Last Man Standing",
      "Nashville Production Week",
      "Fait La Force",
    ],
  },
  "community-conventions": {
    eyebrow: "RECENT CONVENTIONS *",
    items: [
      "The Exchange",
      "RAD 100",
      "Nashville Production Week",
      "Last Man Standing",
      "Brass Horn",
      "Fait La Force",
    ],
  },
};
