import { defineField, defineType } from "sanity";

export const cartStatus = defineType({
  name: "cartStatus",
  title: "Cart Status",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Cart Name",
      type: "string",
      description: 'e.g. "Cart 1 — East Nashville"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isOpen",
      title: "Open Right Now?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      description: "Street address or venue name",
    }),
    defineField({
      name: "openUntil",
      title: "Open Until",
      type: "string",
      description: 'e.g. "3:00 PM" — leave blank if closed',
    }),
    defineField({
      name: "mapLink",
      title: "Google Maps Link",
      type: "url",
    }),
    defineField({
      name: "linkedEvent",
      title: "Linked Event",
      type: "reference",
      to: [{ type: "event" }],
      description: "Optional — link to the event this cart is serving",
    }),
  ],
  preview: {
    select: {
      title: "name",
      isOpen: "isOpen",
      address: "address",
    },
    prepare({ title, isOpen, address }) {
      return {
        title,
        subtitle: `${isOpen ? "🟢 Open" : "🔴 Closed"}${address ? ` · ${address}` : ""}`,
      };
    },
  },
});
