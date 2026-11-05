import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface ScheduleDay {
  _key: string;
  date: string;      // YYYY-MM-DD
  openTime?: string | null;  // e.g. "9:00 AM"; a promo has neither
  closeTime?: string | null; // e.g. "3:00 PM"
}

export interface SanityEvent {
  _id: string;
  title: string;
  schedule: ScheduleDay[] | null;
  locationName: string | null;
  location: string | null;
  placeId: string | null;
  image: SanityImageSource | null;
  type: "open" | "ticketed" | "private" | "fundraiser" | "sale" | "new-swag" | "promo";
  note: string | null;
  eventPageType: "internal" | "internal-link" | "external" | null;
  externalUrl: string | null;
  externalNewTab: boolean | null;
  internalPath: string | null;
  description: unknown[] | null;
  slug: string | null;
  recurrenceLabel: string | null;
}
