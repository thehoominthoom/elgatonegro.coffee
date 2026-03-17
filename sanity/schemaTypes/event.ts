import { defineField, defineType } from "sanity";

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
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Venue or area name",
    }),
    defineField({
      name: "image",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "type",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "We're Serving", value: "hosting" },
          { title: "Attending", value: "attending" },
        ],
        layout: "radio",
      },
      initialValue: "hosting",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isHappeningNow",
      title: "Happening Now?",
      type: "boolean",
      description:
        "Enables the live badge on the hero carousel and cart status bar",
      initialValue: false,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
  ],
  preview: {
    select: {
      title: "title",
      isHappeningNow: "isHappeningNow",
      date: "date",
      media: "image",
    },
    prepare({ title, isHappeningNow, date, media }) {
      const formatted = date
        ? new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "No date";
      return {
        title,
        subtitle: `${isHappeningNow ? "🔴 LIVE · " : ""}${formatted}`,
        media,
      };
    },
  },
});
