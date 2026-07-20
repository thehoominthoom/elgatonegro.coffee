import type { ServiceSlug } from "@/lib/inquiry/config";

export interface SignatureMomentData {
  eyebrow: string;
  body: string[];
  attribution?: string;
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
    image: {
      src: null,
      alt: "El Gato Negro coffee cart set up in the 1111 Church leasing office lobby, Juan pulling shots",
    },
    imageOnLeft: false,
    surface: "dark",
  },
  "community-conventions": {
    eyebrow: "THE THREE-DAY LINE",
    body: [
      "Doors open at 9. Line by 9:03. Second station's up by 9:30 when the room outgrows the first.",
      "Day three still runs the way day one did.",
    ],
    attribution: "— Phil",
    image: {
      src: null,
      alt: "Phil and Juan working the cart at a busy multi-day convention morning",
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
    image: {
      src: null,
      alt: "El Gato Negro cart set up with wedding florals, barista ready to serve reception guests",
    },
    imageOnLeft: false,
    surface: "light",
  },
};
