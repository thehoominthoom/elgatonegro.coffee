import { NextStudio } from 'next-sanity/studio'
import { metadata as studioMetadata, viewport } from 'next-sanity/studio'
import type { Metadata } from 'next'
import config from '../../../../../sanity.config'

export const dynamic = 'force-dynamic'

export { viewport }

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Studio — El Gato Negro Admin',
  robots: { index: false, follow: false },
}

export default function AdminStudioPage() {
  return <NextStudio config={config} />
}
