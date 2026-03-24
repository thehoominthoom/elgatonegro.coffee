import { NextResponse } from "next/server";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateNonce,
  buildAuthorizationUrl,
} from "@/lib/shopify/customer-auth";
import { encryptAuthState, AUTH_STATE_COOKIE } from "@/lib/shopify/session";

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();
  const nonce = generateNonce();

  const authUrl = await buildAuthorizationUrl({
    codeChallenge,
    state,
    nonce,
  });

  const encrypted = await encryptAuthState({ codeVerifier, state, nonce });

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(AUTH_STATE_COOKIE, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
