// ─── Encrypted JWT session for Shopify Customer Account API ──────────────────
//
// Uses jose JWE (A256GCM) to encrypt session data into an HTTP-only cookie.
// No external session store — everything lives in the cookie.

import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET!;
const SESSION_COOKIE = "egn-customer-session";
const AUTH_STATE_COOKIE = "egn-auth-state";

// Derive a 256-bit key from the session secret
function getEncryptionKey(): Uint8Array {
  const encoder = new TextEncoder();
  const key = encoder.encode(SESSION_SECRET.padEnd(32, "0").slice(0, 32));
  return key;
}

// ─── Session payload ────────────────────────────────────────────────────────

export interface CustomerSession {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number; // Unix timestamp (seconds)
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}

// ─── Auth state (temporary cookie for OAuth flow) ───────────────────────────

export interface AuthState {
  codeVerifier: string;
  state: string;
  nonce: string;
}

export async function setAuthStateCookie(authState: AuthState): Promise<void> {
  const jar = await cookies();
  const key = getEncryptionKey();

  const jwt = await new EncryptJWT(authState as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .encrypt(key);

  jar.set(AUTH_STATE_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });
}

export async function getAuthStateCookie(): Promise<AuthState | null> {
  const jar = await cookies();
  const cookie = jar.get(AUTH_STATE_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const key = getEncryptionKey();
    const { payload } = await jwtDecrypt(cookie, key);
    return payload as unknown as AuthState;
  } catch {
    return null;
  }
}

export async function clearAuthStateCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_STATE_COOKIE);
}

// ─── Session cookie ─────────────────────────────────────────────────────────

export async function setSessionCookie(session: CustomerSession): Promise<void> {
  const jar = await cookies();
  const key = getEncryptionKey();

  const jwt = await new EncryptJWT(session as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("90d")
    .encrypt(key);

  jar.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: "/",
  });
}

export async function getSessionCookie(): Promise<CustomerSession | null> {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const key = getEncryptionKey();
    const { payload } = await jwtDecrypt(cookie, key);
    return payload as unknown as CustomerSession;
  } catch {
    return null;
  }
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
