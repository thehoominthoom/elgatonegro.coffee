import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface ScheduleDay {
  _key: string;
  date: string;      // YYYY-MM-DD
  openTime: string;  // e.g. "9:00 AM"
  closeTime: string; // e.g. "3:00 PM"
}

export interface SanityEvent {
  _id: string;
  title: string;
  schedule: ScheduleDay[] | null;
  locationName: string | null;
  location: string | null;
  image: SanityImageSource | null;
  type: "open" | "ticketed" | "private" | "fundraiser" | "sale" | "new-swag";
  eventPageType: "internal" | "external" | null;
  externalUrl: string | null;
  description: unknown[] | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  slug: string | null;
  recurrenceLabel: string | null;
}
