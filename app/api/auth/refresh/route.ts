import { NextResponse } from "next/server";
import { getSessionCookie, setSessionCookie } from "@/lib/shopify/session";
import { refreshAccessToken } from "@/lib/shopify/customer-auth";

export async function POST() {
  const session = await getSessionCookie();

  if (!session?.refreshToken) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  try {
    const tokens = await refreshAccessToken(session.refreshToken);
    const now = Math.floor(Date.now() / 1000);

    await setSessionCookie({
      ...session,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiresAt: now + tokens.expires_in,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
