// ─── Shopify Customer Account API — OAuth 2.0 + PKCE ──────────────────────────
//
// Handles authorization code flow with PKCE for Shopify's Customer Account API.
// Confidential client: token requests use Basic Auth (client_id:client_secret).

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!;
const CUSTOMER_ACCOUNT_API_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL!;
const APP_URL = process.env.APP_URL!;

const REDIRECT_URI = `${APP_URL}/api/auth/callback`;
const SCOPES = "openid email customer-account-api:full";

// ─── OIDC Discovery ──────────────────────────────────────────────────────────

interface OIDCConfig {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
  issuer: string;
}

let cachedConfig: OIDCConfig | null = null;

export async function getOIDCConfig(): Promise<OIDCConfig> {
  if (cachedConfig) return cachedConfig;

  const res = await fetch(
    `${CUSTOMER_ACCOUNT_API_URL}/.well-known/openid-configuration`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`OIDC discovery failed: ${res.status} ${res.statusText}`);
  }

  cachedConfig = (await res.json()) as OIDCConfig;
  return cachedConfig;
}

// ─── PKCE helpers ────────────────────────────────────────────────────────────

function base64UrlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateCodeVerifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(64));
  return base64UrlEncode(bytes.buffer);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(verifier));
  return base64UrlEncode(digest);
}

export function generateState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return base64UrlEncode(bytes.buffer);
}

export function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return base64UrlEncode(bytes.buffer);
}

// ─── Authorization URL ──────────────────────────────────────────────────────

export async function buildAuthorizationUrl(params: {
  codeChallenge: string;
  state: string;
  nonce: string;
}): Promise<string> {
  const config = await getOIDCConfig();

  const url = new URL(config.authorization_endpoint);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("state", params.state);
  url.searchParams.set("nonce", params.nonce);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  return url.toString();
}

// ─── Token exchange ─────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const config = await getOIDCConfig();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} — ${text}`);
  }

  return (await res.json()) as TokenResponse;
}

// ─── Token refresh ──────────────────────────────────────────────────────────

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  const config = await getOIDCConfig();

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const res = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed: ${res.status} — ${text}`);
  }

  return (await res.json()) as TokenResponse;
}

// ─── Logout URL ─────────────────────────────────────────────────────────────

export async function getLogoutUrl(idToken: string): Promise<string> {
  const config = await getOIDCConfig();

  const url = new URL(config.end_session_endpoint);
  url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", APP_URL);

  return url.toString();
}

// ─── Exports for route handlers ─────────────────────────────────────────────

export { REDIRECT_URI, CLIENT_ID };
