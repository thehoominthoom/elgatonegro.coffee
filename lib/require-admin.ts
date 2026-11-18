import { auth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { isAdminHost } from '@/lib/admin-host';

// Every admin page calls this itself, not only the proxy or the layout: the proxy
// matcher skips paths that look like files, and a layout does not re-run on
// client-side navigation. Without proxy.ts, auth() throws, so this fails closed.
export async function requireAdmin() {
  if (!isAdminHost((await headers()).get('host') ?? '')) notFound();

  const { userId, redirectToSignIn } = await auth();
  if (!userId) redirectToSignIn();
}
