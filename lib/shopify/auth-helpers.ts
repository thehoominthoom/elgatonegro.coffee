// ─── Auth helpers for Customer Account API ──────────────────────────────────
//
// Server-side utilities for reading sessions, auto-refreshing tokens,
// and making authenticated GraphQL requests to the Customer Account API.

import { redirect } from "next/navigation";
import {
  getSessionCookie,
  setSessionCookie,
  type CustomerSession,
} from "./session";
import { refreshAccessToken } from "./customer-auth";

const SHOP_ID = "97957019943";
const CUSTOMER_API_VERSION = "2025-01";
const CUSTOMER_API_URL = `https://shopify.com/${SHOP_ID}/account/customer/api/${CUSTOMER_API_VERSION}/graphql`;

// ─── Session readers ────────────────────────────────────────────────────────

/**
 * Read + decrypt session cookie. Auto-refreshes if access token is expired
 * but refresh token is still valid. Returns null if no session.
 */
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const session = await getSessionCookie();
  if (!session) return null;

  // Check if access token is expired (with 60s buffer)
  const now = Math.floor(Date.now() / 1000);
  if (session.expiresAt > now + 60) {
    return session;
  }

  // Try to refresh
  try {
    const tokens = await refreshAccessToken(session.refreshToken);
    const refreshed: CustomerSession = {
      ...session,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiresAt: now + tokens.expires_in,
    };
    await setSessionCookie(refreshed);
    return refreshed;
  } catch {
    // Refresh failed — session is dead
    return null;
  }
}

/**
 * Same as getCustomerSession but redirects to login if no valid session.
 * Use in Server Components that require authentication.
 */
export async function requireCustomerSession(): Promise<CustomerSession> {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");
  return session;
}

// ─── Authenticated fetch ────────────────────────────────────────────────────

interface CustomerFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
}

interface CustomerFetchResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

/**
 * Authenticated GraphQL fetch to the Customer Account API.
 * Auto-refreshes expired tokens before making the request.
 *
 * NOTE: Shopify Customer Account API tokens do NOT use "Bearer" prefix.
 */
export async function customerFetch<T>({
  query,
  variables,
}: CustomerFetchOptions): Promise<T> {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");

  const res = await fetch(CUSTOMER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: session.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Customer Account API response:", errorBody);
    throw new Error(
      `Customer Account API error: ${res.status} ${res.statusText}`
    );
  }

  const json = (await res.json()) as CustomerFetchResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `Customer Account API GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`
    );
  }

  return json.data;
}
