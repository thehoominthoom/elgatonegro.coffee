import { defineField, defineType, defineArrayMember } from "sanity";

// ─── Item types within the menu array ────────────────────────────────────────

const menuHeader = defineArrayMember({
  name: "menuHeader",
  title: "Section Header",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Header Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { text: "text" },
    prepare({ text }: { text?: string }) {
      return {
        title: text || "Untitled Header",
        subtitle: "Header",
      };
    },
  },
});

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
      type: "number",
      validation: (Rule) => Rule.required().min(0),
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
  fields: [
    defineField({
      name: "placeholder",
      title: "Divider",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "── Divider ──" };
    },
  },
});

const menuColumnBreak = defineArrayMember({
  name: "menuColumnBreak",
  title: "Column Break",
  type: "object",
  fields: [
    defineField({
      name: "placeholder",
      title: "Column Break",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "\u2B05 Column Break \u27A1" };
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
      name: "items",
      title: "Menu Items",
      type: "array",
      description: "Drag to reorder. Use Column Break to split into columns.",
      of: [
        menuHeader,
        menuProductItem,
        menuAddonItem,
        menuHeaderWithPrice,
        menuHeaderAddon,
        menuDivider,
        menuColumnBreak,
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }: { title?: string }) {
      return { title: title || "Untitled Menu" };
    },
  },
});
