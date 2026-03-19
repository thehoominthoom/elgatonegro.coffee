import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/shopify/customer-auth";
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

    // Parse ID token to extract basic customer info (JWT payload is the middle segment)
    const idPayload = JSON.parse(
      atob(tokens.id_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

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
        id: idPayload.sub ?? "",
        email: idPayload.email ?? "",
        firstName: idPayload.given_name ?? "",
        lastName: idPayload.family_name ?? "",
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
