// ─── Storefront data-fetch helpers (server only) ─────────────────────────────

import { shopifyFetch } from "./client";
import {
  GET_ALL_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_ALL_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
} from "./queries";
import type { Product, Collection, CollectionSummary } from "./types";

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAllProducts(first = 50): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>({
    query: GET_ALL_PRODUCTS_QUERY,
    variables: { first },
    revalidate: 300,
  });
  return data.products.nodes;
}

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const data = await shopifyFetch<{ productByHandle: Product | null }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    revalidate: 300,
  });
  return data.productByHandle;
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function getAllCollections(
  first = 20
): Promise<CollectionSummary[]> {
  const data = await shopifyFetch<{
    collections: { nodes: CollectionSummary[] };
  }>({
    query: GET_ALL_COLLECTIONS_QUERY,
    variables: { first },
    revalidate: 3600,
  });
  return data.collections.nodes;
}

export async function getCollectionByHandle(
  handle: string,
  productsFirst = 50
): Promise<Collection | null> {
  const data = await shopifyFetch<{ collectionByHandle: Collection | null }>({
    query: GET_COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, productsFirst },
    revalidate: 3600,
  });
  return data.collectionByHandle;
}
