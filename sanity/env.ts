export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-03-17'

// Same dataset format as @sanity/client
export const dataset = assertFormat(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  /^(~[a-z0-9][-\w]{0,63}|[a-z0-9][-\w]{0,63})$/,
  'NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertFormat(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  /^[-a-z0-9]+$/,
  'NEXT_PUBLIC_SANITY_PROJECT_ID'
)

// An empty or malformed value fails the build here, instead of producing a broken
// remotePatterns glob in next.config.ts.
function assertFormat(v: string | undefined, format: RegExp, name: string): string {
  if (v === undefined || !format.test(v)) {
    throw new Error(`Missing or invalid environment variable: ${name}`)
  }

  return v
}
