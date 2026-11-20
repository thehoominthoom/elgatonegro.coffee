import { serializeJsonLd } from "@/lib/seo/location-graph";

/**
 * JsonLd — renders a structured data payload as `<script type="application/ld+json">`.
 * Server component (default). Keeps route files tidy.
 */

interface JsonLdProps {
  data: object;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
