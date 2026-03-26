import { defineField, defineType, defineArrayMember } from "sanity";
import { GooglePlacesInput } from "../components/GooglePlacesInput";
import { HeicImageInput } from "../components/HeicImageInput";
import { ScheduleInput } from "../components/ScheduleInput";

// ─── Time options (every 30 min, 5:00 AM → 2:00 AM next day) ─────────────────

export function generateTimeOptions(): Array<{ title: string; value: string }> {
  const options: Array<{ title: string; value: string }> = [];
  const slots: Array<[number, number, "AM" | "PM"]> = [];

  for (let h = 5; h <= 23; h++) {
    const period: "AM" | "PM" = h < 12 ? "AM" : "PM";
    const display = h === 12 ? 12 : h > 12 ? h - 12 : h;
    slots.push([display, 0, period]);
    slots.push([display, 30, period]);
  }
  slots.push([12, 0, "AM"]);
  slots.push([12, 30, "AM"]);
  slots.push([1, 0, "AM"]);
  slots.push([1, 30, "AM"]);
  slots.push([2, 0, "AM"]);

  for (const [h, m, period] of slots) {
    const label = `${h}:${m === 0 ? "00" : "30"} ${period}`;
    options.push({ title: label, value: label });
  }

  return options;
}

// ─── Hero button text mapping (for frontend reference) ───────────────────────
// open       → "View Details"
// ticketed   → "Get Tickets"
// private    → (no public page)
// fundraiser → "Donate"
// sale       → "Shop Now"
// new-swag   → "Shop Now"

// ─── Schema ───────────────────────────────────────────────────────────────────

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    // 1. Title
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // 2. Show on Website
    defineField({
      name: "isPublic",
      title: "Show on Website",
      type: "boolean",
      description:
        "Show on the website events strip and hero carousel. Auto-checked for Open and Ticketed events — uncheck to hide.",
      initialValue: true,
    }),

    // 3. Event Type (badge/label only — no structural logic)
    defineField({
      name: "type",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Open", value: "open" },
          { title: "Ticketed", value: "ticketed" },
          { title: "Private", value: "private" },
          { title: "Fundraiser", value: "fundraiser" },
          { title: "Sale", value: "sale" },
          { title: "New Swag", value: "new-swag" },
        ],
        layout: "radio",
      },
      initialValue: "open",
      validation: (Rule) => Rule.required(),
    }),

    // 4. Event Page Type
    defineField({
      name: "eventPageType",
      title: "Event Page",
      type: "string",
      options: {
        list: [
          { title: "Build event page", value: "internal" },
          { title: "Link to internal page", value: "internal-link" },
          { title: "Link to external site", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
      hidden: ({ parent }: { parent: { type?: string } }) =>
        parent?.type === "private",
    }),

    // 5. Slug (only when eventPageType === "internal")
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "internal",
      options: {
        source: "title",
        maxLength: 96,
        slugify: async (input: string, _type: unknown, context: { getClient: (opts: { apiVersion: string }) => { fetch: (query: string, params: Record<string, string>) => Promise<string[]> } }) => {
          const baseSlug = input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .slice(0, 96);

          const client = context.getClient({ apiVersion: "2024-01-01" });

          const existingSlugs: string[] = await client.fetch(
            `*[_type == "event" && slug.current match $pattern].slug.current`,
            { pattern: `${baseSlug}*` }
          );

          if (!existingSlugs.includes(baseSlug)) return baseSlug;

          let suffix = 2;
          while (existingSlugs.includes(`${baseSlug}-${suffix}`)) {
            suffix++;
          }
          return `${baseSlug}-${suffix}`;
        },
      },
    }),

    // 6. Internal Path (only when eventPageType === "internal-link")
    defineField({
      name: "internalPath",
      title: "Internal Page Path",
      type: "string",
      description: "Internal page path (e.g., /run/summer-2026)",
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "internal-link",
    }),

    // 6. External URL (only when eventPageType === "external")
    defineField({
      name: "externalUrl",
      title: "External Event URL",
      type: "url",
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "external",
    }),

    // 7. Opens in new tab (only when eventPageType === "external")
    defineField({
      name: "externalNewTab",
      title: "Opens in new tab",
      type: "boolean",
      initialValue: true,
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "external",
    }),

    // 8. Location
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      components: { input: GooglePlacesInput },
      fields: [
        defineField({
          name: "locationName",
          title: "Location Name",
          type: "string",
          description: "Optional display name (e.g. \"The Exchange Running Collective\"). If left blank, the Google address is used.",
        }),
        defineField({
          name: "displayAddress",
          title: "Display Address",
          type: "string",
        }),
        defineField({
          name: "mapLink",
          title: "Google Maps Link",
          type: "url",
        }),
        defineField({
          name: "placeId",
          title: "Place ID",
          type: "string",
        }),
      ],
    }),

    // 9. Schedule
    defineField({
      name: "schedule",
      title: "Schedule",
      type: "array",
      components: { input: ScheduleInput },
      description: "One entry per day. Add Day for multi-day events.",
      initialValue: [{}],
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
              name: "openTime",
              title: "Opens",
              type: "string",
              description: 'e.g. "9:00 AM"',
              options: {
                list: generateTimeOptions(),
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "closeTime",
              title: "Closes",
              type: "string",
              description: 'e.g. "3:00 PM"',
              options: {
                list: generateTimeOptions(),
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              date: "date",
              openTime: "openTime",
              closeTime: "closeTime",
            },
            prepare({
              date,
              openTime,
              closeTime,
            }: {
              date?: string;
              openTime?: string;
              closeTime?: string;
            }) {
              const label = [
                date,
                openTime && closeTime ? `${openTime} – ${closeTime}` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return { title: label || "New Day" };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // 10. Note
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Optional note shown under the event time (e.g. 'Rain or shine', 'Doors open at 6')",
    }),

    // 11. Description (only when eventPageType === "internal")
    defineField({
      name: "description",
      title: "Event Description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              defineField({
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL",
                  }),
                ],
              }),
            ],
          },
          lists: [{ title: "Bullet", value: "bullet" }],
        }),
      ],
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "internal",
    }),

    // 12. CTAs (array — only when eventPageType === "internal")
    defineField({
      name: "cta",
      title: "Calls to Action",
      type: "array",
      description: "Add buttons or links below the event description.",
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "internal",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "string",
              description: "Internal path (e.g. /inquiry) or external URL",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              options: {
                list: [
                  { title: "Primary Button", value: "primary" },
                  { title: "Text Link", value: "link" },
                ],
                layout: "radio",
              },
              initialValue: "primary",
            }),
            defineField({
              name: "newTab",
              title: "Opens in new tab",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { label: "label", style: "style" },
            prepare({ label, style }: { label?: string; style?: string }) {
              return {
                title: label || "Untitled CTA",
                subtitle: style === "link" ? "Text Link" : "Primary Button",
              };
            },
          },
        }),
      ],
    }),

    // 13. Event Menu (optional reference — only when eventPageType === "internal")
    defineField({
      name: "menu",
      title: "Event Menu",
      type: "reference",
      to: [{ type: "menu" }],
      description: "Optional — link a menu to display on this event page",
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "internal",
    }),

    // 14. Image
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      components: { input: HeicImageInput },
    }),

    // 15. Recurrence Label (hidden)
    defineField({
      name: "recurrenceLabel",
      title: "Recurrence Label",
      type: "string",
      hidden: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      type: "type",
      schedule: "schedule",
      isPublic: "isPublic",
      media: "image",
    },
    prepare({
      title,
      type,
      schedule,
      media,
    }: {
      title: string;
      type?: string;
      schedule?: Array<{ date?: string }>;
      isPublic?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      media?: any;
    }) {
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Chicago",
      });
      const isHappeningNow = schedule?.some((d) => d.date === today) ?? false;

      const firstDate = schedule?.[0]?.date;
      const formatted = firstDate
        ? new Date(firstDate + "T12:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "No date";

      const typeBadge = type ? type.charAt(0).toUpperCase() + type.slice(1) : "";
      const livePrefix = isHappeningNow ? "🔴 LIVE · " : "";

      return {
        title,
        subtitle: `${livePrefix}${typeBadge} · ${formatted}`,
        media,
      };
    },
  },
});
