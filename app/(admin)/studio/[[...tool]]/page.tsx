import { NextStudio } from 'next-sanity/studio'
import { metadata as studioMetadata, viewport } from 'next-sanity/studio'
import type { Metadata } from 'next'
import config from '../../../../sanity.config'
import { requireAdmin } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'

export { viewport }

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Studio — El Gato Negro Admin',
  robots: { index: false, follow: false },
}

export default async function AdminStudioPage() {
  await requireAdmin()
  return <NextStudio config={config} />
}
