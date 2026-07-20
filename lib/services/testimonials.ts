import type { ServiceSlug } from "@/lib/inquiry/config";

export interface Testimonial {
  quote: string;
  attribution: string;
  /** True while the quote text is a placeholder awaiting the real one from Phil. */
  isPlaceholder: boolean;
}

/**
 * Testimonials are plain content only — no `Review` schema until real Google
 * Business reviews land. Placeholder quotes ship as-is per Phil (2026-07-20).
 */
export const SERVICE_TESTIMONIALS: Partial<Record<ServiceSlug, Testimonial>> = {
  "weddings-celebrations": {
    quote:
      "Our niece hit the espresso bar three times before dinner. She's eight. We're still hearing about it.",
    attribution: "Jesse & Ashton",
    isPlaceholder: true,
  },
  "private-events": {
    quote:
      "They pulled up for my kid's birthday and my mom asked if the guy was single. He was polite about it.",
    attribution: "Gabe Marrero",
    isPlaceholder: true,
  },
};
