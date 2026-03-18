import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Returns a fluent image URL builder pre-configured with quality=80 and
 * format=webp. Chain .width(N) (and optionally .height(N)) before calling
 * .url() to complete the URL.
 *
 * Width conventions:
 *   Hero / full-viewport  → 1440
 *   OG / Twitter card     → 1200
 *   Thumbnail / card      →  800
 *   Icon / small          →  400
 */
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source).quality(80).format('webp')
}
