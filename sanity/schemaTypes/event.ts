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

// ─── Schema ───────────────────────────────────────────────────────────────────

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

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

    defineField({
      name: "isPublic",
      title: "Show on Website",
      type: "boolean",
      description:
        "Show on the website events strip and hero carousel. Auto-checked for Open and Ticketed events — uncheck to hide.",
      initialValue: true,
    }),

    defineField({
      name: "eventPageType",
      title: "Event Page",
      type: "string",
      options: {
        list: [
          { title: "Internal page (build a page on this site)", value: "internal" },
          { title: "External link (redirect to another site)", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
      hidden: ({ parent }: { parent: { type?: string } }) =>
        parent?.type === "private",
    }),

    defineField({
      name: "externalUrl",
      title: "External Event URL",
      type: "url",
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "external",
    }),

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

    defineField({
      name: "cta",
      title: "Call to Action",
      type: "object",
      hidden: ({ parent }: { parent: { eventPageType?: string } }) =>
        parent?.eventPageType !== "internal",
      fields: [
        defineField({
          name: "ctaLabel",
          title: "Button Text",
          type: "string",
        }),
        defineField({
          name: "ctaUrl",
          title: "Destination URL",
          type: "string",
          description: "Internal path (e.g. /inquiry?service=weddings) or external URL",
        }),
      ],
    }),

    defineField({
      name: "ticketUrl",
      title: "Ticket URL",
      type: "url",
      description: "Link to ticket purchase page",
      hidden: ({ parent }: { parent: { type?: string } }) =>
        parent?.type !== "ticketed",
    }),

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

    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Optional note shown under the event time (e.g. 'Rain or shine', 'Doors open at 6')",
    }),

    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      components: { input: HeicImageInput },
    }),

    defineField({
      name: "recurrenceLabel",
      title: "Recurrence Label",
      type: "string",
      hidden: true,
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
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
