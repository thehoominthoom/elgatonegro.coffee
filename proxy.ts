import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isAdminHost = (hostname: string) => {
  return (
    hostname === 'admin.elgatonegro.coffee' ||
    hostname === 'admin.localhost' ||
    hostname.startsWith('admin.localhost:')
  );
};

const handler = clerkMiddleware(async (auth, req: NextRequest) => {
  const hostname = req.headers.get('host') ?? '';

  if (!isAdminHost(hostname)) {
    return NextResponse.next();
  }

  // Allow Clerk auth routes through without protection
  if (
    req.nextUrl.pathname.startsWith('/sign-in') ||
    req.nextUrl.pathname.startsWith('/sign-up')
  ) {
    return NextResponse.next();
  }

  // Protect all other admin routes
  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Rewrite admin subdomain to the (admin) route group
  const url = req.nextUrl.clone();
  url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
  return NextResponse.rewrite(url);
});

// Re-export as named `proxy` for Next.js 16 proxy.ts convention
export const proxy = handler;

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
