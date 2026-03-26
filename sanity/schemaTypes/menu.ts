import { defineField, defineType, defineArrayMember } from "sanity";

// ─── Item types used within layout blocks ────────────────────────────────────

const menuProductItem = defineArrayMember({
  name: "menuProductItem",
  title: "Product Item",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Item Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      description: "Leave blank for items without a price",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: { text: "text", price: "price" },
    prepare({ text, price }: { text?: string; price?: number }) {
      return {
        title: text || "Untitled Item",
        subtitle: price != null ? `$${price.toFixed(2)}` : "No price",
      };
    },
  },
});

const menuAddonItem = defineArrayMember({
  name: "menuAddonItem",
  title: "Add-On Item",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Add-On Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: { text: "text", price: "price" },
    prepare({ text, price }: { text?: string; price?: number }) {
      return {
        title: text || "Untitled Add-On",
        subtitle: price != null ? `+$${price.toFixed(2)}` : "No price",
      };
    },
  },
});

const menuHeaderWithPrice = defineArrayMember({
  name: "menuHeaderWithPrice",
  title: "Header with Price",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Header Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: { text: "text", price: "price" },
    prepare({ text, price }: { text?: string; price?: number }) {
      return {
        title: text || "Untitled Header",
        subtitle: price != null ? `$${price.toFixed(2)} (Header)` : "Header",
      };
    },
  },
});

const menuHeaderAddon = defineArrayMember({
  name: "menuHeaderAddon",
  title: "Header Add-On (with + price)",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Header Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: { text: "text", price: "price" },
    prepare({ text, price }: { text?: string; price?: number }) {
      return {
        title: text || "Untitled Header",
        subtitle: price != null ? `+$${price.toFixed(2)} (Header)` : "Header",
      };
    },
  },
});

const menuDivider = defineArrayMember({
  name: "menuDivider",
  title: "Divider Line",
  type: "object",
  description: "A horizontal divider between menu sections",
  fields: [
    defineField({
      name: "placeholder",
      title: "Visual divider line (no editing needed)",
      type: "string",
      initialValue: "\u2014",
      readOnly: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "\u2500\u2500 Divider \u2500\u2500" };
    },
  },
});

// ─── Shared item types for block arrays ──────────────────────────────────────

const blockItemTypes = [
  menuProductItem,
  menuAddonItem,
  menuHeaderWithPrice,
  menuHeaderAddon,
  menuDivider,
];

// ─── Layout block types ──────────────────────────────────────────────────────

const menuFullWidthSection = defineArrayMember({
  name: "menuFullWidthSection",
  title: "Full-Width Section",
  type: "object",
  fields: [
    defineField({
      name: "sectionName",
      title: "Section Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: blockItemTypes,
    }),
  ],
  preview: {
    select: { sectionName: "sectionName" },
    prepare({ sectionName }: { sectionName?: string }) {
      return {
        title: sectionName || "Untitled Section",
        subtitle: "Full-width",
      };
    },
  },
});

const menuTwoColumnSplit = defineArrayMember({
  name: "menuTwoColumnSplit",
  title: "Two-Column Split",
  type: "object",
  fields: [
    defineField({
      name: "leftSectionName",
      title: "Left Column Header",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "leftItems",
      title: "Left Column Items",
      type: "array",
      of: blockItemTypes,
    }),
    defineField({
      name: "rightSectionName",
      title: "Right Column Header",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rightItems",
      title: "Right Column Items",
      type: "array",
      of: blockItemTypes,
    }),
  ],
  preview: {
    select: { left: "leftSectionName", right: "rightSectionName" },
    prepare({ left, right }: { left?: string; right?: string }) {
      return {
        title: `${left || "Left"} | ${right || "Right"}`,
        subtitle: "Two-column",
      };
    },
  },
});

// ─── Schema ──────────────────────────────────────────────────────────────────

export const menu = defineType({
  name: "menu",
  title: "Menu",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal reference name (e.g. \"Main Menu\")",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Layout Blocks",
      type: "array",
      description: "Build your menu with full-width sections and two-column splits.",
      of: [menuFullWidthSection, menuTwoColumnSplit],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }: { title?: string }) {
      return { title: title || "Untitled Menu" };
    },
  },
});
