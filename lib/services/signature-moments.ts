import type { ServiceSlug } from "@/lib/inquiry/config";

export interface SignatureMomentData {
  eyebrow: string;
  headline?: string;
  body: string[];
  attribution?: string;
  attributionRole?: string;
  photoCaption?: string;
  image: {
    src: string | null;
    alt: string;
  };
  imageOnLeft?: boolean;
  surface: "light" | "dark";
}

/**
 * SignatureMoment content per subpage. `image.src` is null when the confirmed
 * asset isn't on disk yet — component falls back to the branded placeholder
 * (dark bg + hellcat watermark at 4% opacity) matching the site convention.
 *
 * `photoCaption` values from copy/services-pages.md (2026-07-21 SM caption pass) —
 * comma-separated moment-anchored register, each pulls a phrase from its own
 * SM body copy. Rendered uppercase via the component's caption class.
 *
 * Voice-adjacent copy: brand-activations body restates the 1111 Church scene
 * from the hero. Community-conventions + weddings bodies are designer-fresh
 * per design-spec §2.3 / §2.4 (option A — kept, flagged for Phil review).
 */
export const SIGNATURE_MOMENTS: Partial<
  Record<ServiceSlug, SignatureMomentData>
> = {
  "brand-activations": {
    eyebrow: "THE 1111 CHURCH RUN",
    body: [
      "Weekday mornings. Leasing office lobby. Cart in, plugged in, shots pulled by 8:15.",
      "Hundreds of residents through those doors, and the mailroom never noticed.",
    ],
    attribution: "— Juan",
    attributionRole: "Co-founder, EGN",
    photoCaption: "1111 Church, mid-morning run.",
    image: {
      src: "/images/services/brand-activations-signature.webp",
      alt: "Juan pulling shots at the 1111 Church leasing office coffee cart residency",
    },
    imageOnLeft: false,
    surface: "dark",
  },
  "community-conventions": {
    eyebrow: "THE EXCHANGE RESIDENCY",
    headline: "The empty room is our favorite ten minutes of the week.",
    body: [
      "Every week at The Exchange, the cart's up before doors open. The run first. The coffee second. We've been at it long enough that the regulars know our names, and we know their orders before they say them.",
      "Then the doors open.",
    ],
    attribution: "— Phil",
    attributionRole: "Co-founder, EGN",
    photoCaption: "The Exchange, before doors.",
    image: {
      src: "/images/services/community-conventions-signature.webp",
      alt: "Phil and Juan setting up the El Gato Negro cart at The Exchange residency before service",
    },
    imageOnLeft: true,
    surface: "dark",
  },
  "weddings-celebrations": {
    eyebrow: "THE SIGNATURE DRINK",
    body: [
      "You tell us what you drink. What your people drink. What goes on the board.",
      "Then one drink ends up with your name on it, and the first three people in line order it because they saw it on the board.",
    ],
    photoCaption: "The couple's drink, on the board.",
    image: {
      src: "/images/services/weddings-celebrations-signature.webp",
      alt: "El Gato Negro cart set up with wedding florals, barista ready to serve reception guests",
    },
    imageOnLeft: false,
    surface: "light",
  },
};
