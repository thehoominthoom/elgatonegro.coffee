import type { ServiceSlug } from "@/lib/inquiry/config";

export interface ByTheNumbersItem {
  value: string;
  label: string;
  detail?: string;
}

export interface ByTheNumbersData {
  eyebrow: string;
  items: ByTheNumbersItem[];
}

/**
 * Numeric proof blocks per subpage. Only brand-activations and
 * community-conventions get a block — weddings and private-events skip it
 * deliberately (design-spec §2.4 / §2.5).
 *
 * Every value ties back to a claim already made in copy/services-pages.md.
 * Do not invent numbers. Use en dash (–) not hyphen for ranges.
 */
export const BY_THE_NUMBERS: Partial<Record<ServiceSlug, ByTheNumbersData>> = {
  "brand-activations": {
    eyebrow: "BY THE NUMBERS",
    items: [
      {
        value: "30",
        label: "min · setup time",
        detail: "cart in, plugged in, pulling shots",
      },
      {
        value: "hundreds",
        label: "residents · served",
        detail: "at 1111 Church leasing office",
      },
      {
        value: "4–6",
        label: "weeks · branding lead time",
        detail: "logo cups, packaging, signage",
      },
    ],
  },
  "community-conventions": {
    eyebrow: "THE NUMBERS",
    items: [
      {
        value: "70+",
        label: "drinks · per hour",
        detail: "when a room demands it",
      },
      {
        value: "hundreds",
        label: "served · across a day",
        detail: "when the day runs long",
      },
      {
        value: "3+",
        label: "days · standard",
        detail: "and we've run longer",
      },
    ],
  },
};
