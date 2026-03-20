import type { NextFetchEvent } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';

const isAdminHost = (hostname: string) => {
  return (
    hostname === 'admin.elgatonegro.coffee' ||
    hostname === 'admin.localhost' ||
    hostname.startsWith('admin.localhost:')
  );
};

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

    // Allow Clerk auth routes through without protection
    // These live at app/(admin)/sign-in/ — route group doesn't affect URL,
    // so /sign-in resolves directly without rewrite
    if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
      return NextResponse.next();
    }

    // Protect all other admin routes — redirects unauthenticated users to sign-in
    await auth.protect();

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
  ],
};
