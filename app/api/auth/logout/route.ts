import { NextResponse } from "next/server";
import { getSessionCookie, clearSessionCookie } from "@/lib/shopify/session";
import { getLogoutUrl } from "@/lib/shopify/customer-auth";

const APP_URL = process.env.APP_URL!;

export async function GET() {
  const session = await getSessionCookie();

  // Clear the session cookie regardless
  await clearSessionCookie();

  // If we have an ID token, redirect through Shopify's logout endpoint
  if (session?.idToken) {
    try {
      const logoutUrl = await getLogoutUrl(session.idToken);
      return NextResponse.redirect(logoutUrl);
    } catch {
      // Shopify logout endpoint unavailable — just redirect home
    }
  }

  return NextResponse.redirect(APP_URL);
}
