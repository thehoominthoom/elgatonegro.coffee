import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { exchangeCodeForTokens, getOIDCConfig } from "@/lib/shopify/customer-auth";
import {
  getAuthStateCookie,
  clearAuthStateCookie,
  setSessionCookie,
  type CustomerSession,
} from "@/lib/shopify/session";

const APP_URL = process.env.APP_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(`${APP_URL}/account/login?error=missing_params`);
  }

  // Retrieve and validate auth state
  const authState = await getAuthStateCookie();
  if (!authState) {
    return NextResponse.redirect(`${APP_URL}/account/login?error=expired_state`);
  }

  if (authState.state !== state) {
    return NextResponse.redirect(`${APP_URL}/account/login?error=invalid_state`);
  }

  try {
    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code, authState.codeVerifier);

    // Verify ID token signature using Shopify's JWKS
    const oidcConfig = await getOIDCConfig();
    const JWKS = createRemoteJWKSet(new URL(oidcConfig.jwks_uri));

    const { payload: idPayload } = await jwtVerify(tokens.id_token, JWKS, {
      issuer: oidcConfig.issuer,
    });

    // Validate nonce
    if (idPayload.nonce !== authState.nonce) {
      return NextResponse.redirect(`${APP_URL}/account/login?error=invalid_nonce`);
    }

    const now = Math.floor(Date.now() / 1000);

    const session: CustomerSession = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiresAt: now + tokens.expires_in,
      customer: {
        id: (idPayload.sub as string) ?? "",
        email: (idPayload.email as string) ?? "",
        firstName: (idPayload.given_name as string) ?? "",
        lastName: (idPayload.family_name as string) ?? "",
      },
    };

    await setSessionCookie(session);
    await clearAuthStateCookie();

    return NextResponse.redirect(`${APP_URL}/account`);
  } catch (error) {
    console.error("Auth callback error:", error instanceof Error ? error.message : error);
    console.error("Auth callback full error:", error);
    return NextResponse.redirect(`${APP_URL}/account/login?error=token_exchange`);
  }
}
