/**
 * JsonLd — renders a structured data payload as `<script type="application/ld+json">`.
 * Server component (default). Keeps route files tidy.
 *
 * Safe stringify: schema.org payloads are plain JSON — no user input reaches
 * this component, so JSON.stringify is fine. If that ever changes, wrap in
 * an escape for `</script>` sequences.
 */

interface JsonLdProps {
  data: unknown;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
