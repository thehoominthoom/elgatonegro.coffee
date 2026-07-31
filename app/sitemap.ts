import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { shopifyFetch } from "@/lib/shopify/client";

const BASE_URL = "https://www.elgatonegro.coffee";

// ─── Dynamic data fetchers ──────────────────────────────────────────────────

async function getEventSlugs(): Promise<string[]> {
  const events = await client.fetch<{ slug: string }[]>(
    `*[_type == "event" && defined(slug.current) && isPublic == true && eventPageType == "internal"]{ "slug": slug.current }`,
    {},
    { next: { revalidate: 3600 } }
  );
  return events.map((e) => e.slug);
}

const GET_PRODUCT_HANDLES_QUERY = `
  query GetProductHandles {
    products(first: 250, sortKey: TITLE) {
      nodes {
        handle
      }
    }
  }
`;

async function getProductHandles(): Promise<string[]> {
  const data = await shopifyFetch<{
    products: { nodes: { handle: string }[] };
  }>({
    query: GET_PRODUCT_HANDLES_QUERY,
    revalidate: 3600,
  });
  return data.products.nodes.map((p) => p.handle);
}

// ─── Hardcoded routes ───────────────────────────────────────────────────────

const SERVICE_SLUGS = [
  "brand-activations",
  "community-conventions",
  "weddings-celebrations",
  "private-events",
];

const COLLECTION_HANDLES = [
  "apparel",
  "coffee-beans",
  "featured",
  "merchandise",
];

// ─── Sitemap generator ──────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [eventSlugs, productHandles] = await Promise.all([
    getEventSlugs(),
    getProductHandles(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, changeFrequency: "weekly", priority: 1.0, lastModified: now },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${BASE_URL}/events`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${BASE_URL}/menu`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${BASE_URL}/services`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${BASE_URL}/media`, changeFrequency: "monthly", priority: 0.4, lastModified: now },
    { url: `${BASE_URL}/opportunities`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
  ];

  const eventPages: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${BASE_URL}/events/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: now,
  }));

  const productPages: MetadataRoute.Sitemap = productHandles.map((handle) => ({
    url: `${BASE_URL}/shop/products/${handle}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: now,
  }));

  const collectionPages: MetadataRoute.Sitemap = COLLECTION_HANDLES.map((handle) => ({
    url: `${BASE_URL}/shop/collections/${handle}`,
    changeFrequency: "daily",
    priority: 0.9,
    lastModified: now,
  }));

  const servicePages: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: now,
  }));

  return [
    ...staticPages,
    ...collectionPages,
    ...productPages,
    ...eventPages,
    ...servicePages,
  ];
}
