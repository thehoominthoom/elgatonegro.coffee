import { NextResponse } from "next/server";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateNonce,
  buildAuthorizationUrl,
} from "@/lib/shopify/customer-auth";
import { setAuthStateCookie } from "@/lib/shopify/session";

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();
  const nonce = generateNonce();

  // Store PKCE verifier + state + nonce in encrypted temp cookie
  await setAuthStateCookie({ codeVerifier, state, nonce });

  const authUrl = await buildAuthorizationUrl({
    codeChallenge,
    state,
    nonce,
  });

  return NextResponse.redirect(authUrl);
}
