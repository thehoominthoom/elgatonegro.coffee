import type { ServiceSlug } from "@/lib/inquiry/config";
import type { TriptychImage } from "@/components/services/ImageTriptych";

/**
 * Triptych image data per service subpage.
 *
 * All 6 assets pre-cropped to 3:2 landscape at ingest (2400x1600 WebP q=85),
 * with sharp `.rotate()` EXIF-normalized and EXIF stripped before encode.
 * Sources listed in copy/services-image-row-and-sigmoment-revisit-spec.md §1.7.
 *
 * Note: brand-activations pos 2 uses frame -02 of the Nike-cart portrait
 * shoot (not -01 as originally spec'd). Center crop of -01 lost both the
 * cart and one founder; -02 same-shoot frame preserves both founders +
 * cart + Swoosh Nike Stampede branding, matching the spec's intent.
 */
export const IMAGE_ROWS: Partial<
  Record<ServiceSlug, [TriptychImage, TriptychImage, TriptychImage]>
> = {
  "brand-activations": [
    {
      src: "/images/services/triptych/brand-activations-1.webp",
      alt: "El Gato Negro cart set up on the Scarpetta production set before service",
    },
    {
      src: "/images/services/triptych/brand-activations-2.webp",
      alt: "Phil Bartko and Juan Martinez working the Nike-branded El Gato Negro cart at The Exchange",
    },
    {
      src: "/images/services/triptych/brand-activations-3.webp",
      alt: "El Gato Negro cart with Last Man Standing branded signage during service",
    },
  ],
  "community-conventions": [
    {
      src: "/images/services/triptych/community-conventions-1.webp",
      alt: "El Gato Negro cart being set up at Nashville Production Week",
    },
    {
      src: "/images/services/triptych/community-conventions-2.webp",
      alt: "Guests holding El Gato Negro drinks at the Fait La Force community event",
    },
    {
      src: "/images/services/triptych/community-conventions-3.webp",
      alt: "Community gathered around the El Gato Negro cart at The Exchange residency, with Juan Martinez in view",
    },
  ],
};
