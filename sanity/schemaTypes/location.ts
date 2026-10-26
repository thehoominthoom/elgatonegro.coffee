import { defineField, defineType, defineArrayMember } from "sanity";
import { GooglePlacesInput } from "../components/GooglePlacesInput";
import { HeicImageInput } from "../components/HeicImageInput";

// ─── Time options (every 15 min, 5:00 AM → 11:45 PM) ─────────────────────────
// Stored as "HH:mm" so the site and the JSON-LD read one unambiguous format;
// the Studio shows the 12-hour label.

function quarterHourOptions(): Array<{ title: string; value: string }> {
  const options: Array<{ title: string; value: string }> = [];
  for (let h = 5; h <= 23; h++) {
    for (const m of [0, 15, 30, 45]) {
      const display = h > 12 ? h - 12 : h;
      const period = h < 12 ? "AM" : "PM";
      options.push({
        title: `${display}:${String(m).padStart(2, "0")} ${period}`,
        value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      });
    }
  }
  return options;
}

const TIME_OPTIONS = quarterHourOptions();

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function labelFor(value?: string): string {
  return TIME_OPTIONS.find((o) => o.value === value)?.title ?? value ?? "";
}

// ─── Schema ───────────────────────────────────────────────────────────────────

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    // 1. Exceptions — first on purpose: a same-day closure has to be quick to enter.
    defineField({
      name: "exceptions",
      title: "Closed Days & Changed Hours",
      type: "array",
      description:
        "Add a date to close for the day. Untick Closed to set different hours instead. Past dates are ignored, so there is no need to delete them.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "date",
              title: "Date",
              type: "date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "closed",
              title: "Closed",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "open",
              title: "Opens",
              type: "string",
              options: { list: TIME_OPTIONS, layout: "dropdown" },
              hidden: ({ parent }) => parent?.closed !== false,
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  (context.parent as { closed?: boolean })?.closed === false && !value
                    ? "Set the opening time, or tick Closed."
                    : true
                ),
            }),
            defineField({
              name: "close",
              title: "Closes",
              type: "string",
              options: { list: TIME_OPTIONS, layout: "dropdown" },
              hidden: ({ parent }) => parent?.closed !== false,
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as { closed?: boolean; open?: string };
                  if (parent?.closed !== false) return true;
                  if (!value) return "Set the closing time, or tick Closed.";
                  if (parent.open && value <= parent.open) return "Closing time must be after opening time.";
                  return true;
                }),
            }),
            defineField({
              name: "note",
              title: "Note (shown on the website)",
              type: "string",
              description:
                'Optional. Keep it under about 15 characters, and give a reason, not an apology: "Thanksgiving", "Short on carts".',
            }),
          ],
          preview: {
            select: { date: "date", closed: "closed", open: "open", close: "close", note: "note" },
            prepare({ date, closed, open, close, note }) {
              const hours = closed === false ? `${labelFor(open)} – ${labelFor(close)}` : "Closed";
              return { title: date || "New date", subtitle: [hours, note].filter(Boolean).join(" · ") };
            },
          },
        }),
      ],
    }),

    // 2. Name
    defineField({
      name: "name",
      title: "Venue Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // 3. Slug
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Never change this once published. It is this location's permanent ID in the search-engine data (JSON-LD @id), and will be its address if location pages are added.",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // 4. Map place — same shape and input as the event location, so googleMapsUrl()
    //    reads it unchanged.
    defineField({
      name: "place",
      title: "Map Place",
      type: "object",
      description:
        'Drives the "Get directions" link. Pick the plain street-address suggestion, not the venue\'s own Google listing.',
      components: { input: GooglePlacesInput },
      fields: [
        defineField({ name: "locationName", title: "Location Name", type: "string" }),
        defineField({ name: "displayAddress", title: "Display Address", type: "string" }),
        defineField({ name: "placeId", title: "Place ID", type: "string" }),
      ],
      validation: (Rule) =>
        Rule.custom((place) => {
          const { displayAddress, placeId } = (place ?? {}) as {
            displayAddress?: string;
            placeId?: string;
          };
          if (displayAddress && !placeId) {
            return "Pick this address from the Google dropdown so the directions link resolves.";
          }
          if (placeId && !displayAddress) {
            return "This place has a Place ID but no address. Re-select it from the Google dropdown.";
          }
          return true;
        }),
    }),

    // 5. Postal address — shown on the site and used for the JSON-LD PostalAddress.
    defineField({
      name: "address",
      title: "Street Address",
      type: "object",
      options: { columns: 2 },
      fields: [
        defineField({ name: "streetAddress", title: "Street", type: "string", description: 'Write "St", not "Street".' }),
        defineField({ name: "addressLocality", title: "City", type: "string" }),
        defineField({ name: "addressRegion", title: "State", type: "string", description: 'Two letters, e.g. "TN".' }),
        defineField({ name: "postalCode", title: "ZIP", type: "string" }),
        defineField({ name: "addressCountry", title: "Country", type: "string", initialValue: "US" }),
      ],
      validation: (Rule) =>
        Rule.custom((address, context) => {
          if (!context.document?.isPublic) return true;
          const a = (address ?? {}) as Record<string, string | undefined>;
          const missing = ["streetAddress", "addressLocality", "addressRegion", "postalCode"].some(
            (key) => !a[key]?.trim()
          );
          return missing ? "A location shown on the website needs street, city, state and ZIP." : true;
        }),
    }),

    // 6. Wayfinding
    defineField({
      name: "wayfinding",
      title: "Where to Find the Cart",
      type: "string",
      description: 'One line, e.g. "Inside the store, by the front windows."',
      validation: (Rule) => Rule.required(),
    }),

    // 7. Dates
    defineField({
      name: "startsOn",
      title: "First Day",
      type: "date",
      description: 'Before this date the site shows "Starting {date}" under the name.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endsOn",
      title: "Last Day",
      type: "date",
      description: "Optional. Leave blank while the location is ongoing. The section disappears the day after.",
      validation: (Rule) =>
        Rule.custom((endsOn, context) => {
          const startsOn = context.document?.startsOn as string | undefined;
          return endsOn && startsOn && endsOn < startsOn ? "Last day must be on or after the first day." : true;
        }),
    }),

    // 8. Weekly hours
    defineField({
      name: "weeklyHours",
      title: "Weekly Hours",
      type: "array",
      description: "One row per open day. A day that isn't listed shows as closed.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "day",
              title: "Day",
              type: "string",
              options: { list: DAYS, layout: "dropdown" },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "open",
              title: "Opens",
              type: "string",
              options: { list: TIME_OPTIONS, layout: "dropdown" },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "close",
              title: "Closes",
              type: "string",
              options: { list: TIME_OPTIONS, layout: "dropdown" },
              validation: (Rule) =>
                Rule.required().custom((value, context) => {
                  const open = (context.parent as { open?: string })?.open;
                  return value && open && value <= open ? "Closing time must be after opening time." : true;
                }),
            }),
          ],
          preview: {
            select: { day: "day", open: "open", close: "close" },
            prepare({ day, open, close }) {
              return { title: day || "New day", subtitle: `${labelFor(open)} – ${labelFor(close)}` };
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((rows) => {
          const days = ((rows ?? []) as Array<{ day?: string }>).map((r) => r.day).filter(Boolean);
          return new Set(days).size === days.length ? true : "Each day can appear only once.";
        }),
    }),

    // 9. Image
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      description: "Shown on the homepage, cropped to 4:5 (portrait). Set the hotspot on the cart.",
      options: { hotspot: true },
      components: { input: HeicImageInput },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the photo, and say the cart is inside.",
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const image = context.parent as { asset?: unknown } | undefined;
              return image?.asset && !alt?.trim() ? "Add alt text for this photo." : true;
            }),
        }),
      ],
    }),

    // 10. Menu
    defineField({
      name: "menu",
      title: "Menu",
      type: "reference",
      to: [{ type: "menu" }],
      description: 'Optional. When set, the homepage shows a "See the menu" link.',
    }),

    // 11. Visibility + order
    defineField({
      name: "isPublic",
      title: "Show on Website",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first.",
      initialValue: 1,
    }),
  ],

  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],

  preview: {
    select: { title: "name", startsOn: "startsOn", isPublic: "isPublic", media: "image" },
    prepare({ title, startsOn, isPublic, media }) {
      return {
        title,
        subtitle: [isPublic === false ? "Hidden" : null, startsOn ? `From ${startsOn}` : null]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
