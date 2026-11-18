import type { NextFetchEvent } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminHost } from '@/lib/admin-host';

async function handleAdminRequest(
  req: NextRequest,
  event: NextFetchEvent,
): Promise<NextResponse> {
  let clerkMiddleware: typeof import('@clerk/nextjs/server').clerkMiddleware;

  try {
    const clerk = await import('@clerk/nextjs/server');
    clerkMiddleware = clerk.clerkMiddleware;
  } catch {
    return new NextResponse('Admin unavailable', { status: 503 });
  }

  const handler = clerkMiddleware(async (auth, clerkReq: NextRequest) => {
    const pathname = clerkReq.nextUrl.pathname;

    // Allow Clerk auth routes through without protection: /sign-in or /sign-in/…,
    // the same for /sign-up, never /sign-inX.
    // These live at app/(admin)/sign-in/ — route group doesn't affect URL,
    // so /sign-in resolves directly without rewrite
    if (/^\/sign-(?:in|up)(?:\/|$)/.test(pathname)) {
      return NextResponse.next();
    }

    // Protect all other admin routes — redirects unauthenticated users to sign-in
    await auth.protect();

    // Studio lives at app/(admin)/studio/ — route group doesn't affect URL,
    // so /studio resolves directly without the /admin rewrite
    if (pathname.startsWith('/studio')) {
      return NextResponse.next();
    }

    // Rewrite admin subdomain to the (admin) route group
    const url = clerkReq.nextUrl.clone();
    url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  });

  return handler(req, event) as Promise<NextResponse>;
}

export async function proxy(req: NextRequest, event: NextFetchEvent) {
  const hostname = req.headers.get('host') ?? '';

  // Admin subdomain — full Clerk auth flow
  if (isAdminHost(hostname)) {
    return handleAdminRequest(req, event);
  }

  // Block direct /admin path access on the public domain
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Studio paths, even file-like ones (/studio/a.js) the first pattern
    // skips, so Clerk can send signed-out visitors to sign-in
    '/studio/:path*',
  ],
};
