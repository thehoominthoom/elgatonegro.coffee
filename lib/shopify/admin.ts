// ─── Shopify Admin API — Client Credentials Grant ────────────────────────────
//
// Server-side utility for authenticating with the Shopify Admin API.
// Uses client credentials grant to exchange client_id + client_secret
// for a short-lived access token (24 hours). Token is cached in-memory
// with auto-refresh on expiry.

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const CLIENT_ID = process.env.SHOPIFY_ADMIN_CLIENT_ID!;
const CLIENT_SECRET = process.env.SHOPIFY_ADMIN_CLIENT_SECRET!;

const ADMIN_API_VERSION = "2025-01";
const TOKEN_URL = `https://${STORE_DOMAIN}/admin/oauth/access_token`;
const GRAPHQL_URL = `https://${STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`;

// ─── Token cache ─────────────────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

interface TokenResponse {
  access_token: string;
  scope: string;
  expires_in: number;
}

async function getAdminToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (60s buffer, same pattern as customer session)
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.token;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin token exchange failed: ${res.status} — ${text}`);
  }

  const data = (await res.json()) as TokenResponse;

  cachedToken = {
    token: data.access_token,
    expiresAt: now + data.expires_in,
  };

  return cachedToken.token;
}

// ─── Authenticated fetch ─────────────────────────────────────────────────────

interface AdminFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
}

interface AdminFetchResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

/**
 * Authenticated GraphQL fetch to the Shopify Admin API.
 * Auto-refreshes expired tokens before making the request.
 */
export async function adminFetch<T>({
  query,
  variables,
}: AdminFetchOptions): Promise<T> {
  const token = await getAdminToken();

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Admin API response:", errorBody);
    throw new Error(`Admin API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as AdminFetchResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `Admin API GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`
    );
  }

  return json.data;
}
