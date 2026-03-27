// ─── Shopify Storefront API fetch wrapper ─────────────────────────────────────
//
// Server-side calls use the private token (higher rate limit, never exposed).
// The public token is available for future client-side needs but all current
// fetches run on the server.

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-01";

const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN!;
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  /** Use public token — only for client components that cannot access private env vars */
  usePublicToken?: boolean;
  /** Next.js fetch cache/revalidation options */
  cache?: RequestCache;
  revalidate?: number;
}

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function shopifyFetch<T>({
  query,
  variables,
  usePublicToken = false,
  cache = "force-cache",
  revalidate,
}: ShopifyFetchOptions): Promise<T> {
  const token = usePublicToken ? PUBLIC_TOKEN : PRIVATE_TOKEN;

  const url = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

  const fetchOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Private token header
      ...(usePublicToken
        ? { "X-Shopify-Storefront-Access-Token": token }
        : { "Shopify-Storefront-Private-Token": token }),
    },
    body: JSON.stringify({ query, variables }),
    cache: revalidate !== undefined ? undefined : cache,
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as ShopifyResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `Shopify GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`
    );
  }

  return json.data;
}
