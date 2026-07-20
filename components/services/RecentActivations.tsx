/**
 * RecentActivations — marquee ticker of past event/venue names.
 * Text-only for launch (no links, no dates). Uses the existing `@keyframes
 * marquee` in globals.css. Track is rendered twice for a seamless loop.
 * Respects `prefers-reduced-motion` — animation pauses when reduced.
 *
 * Spec: copy/services-pages-design-spec.md §3.4
 */

interface RecentActivationsProps {
  eyebrow: string;
  items: string[];
  /** Loop duration in seconds. Default 60. */
  durationSeconds?: number;
}

export function RecentActivations({
  eyebrow,
  items,
  durationSeconds = 60,
}: RecentActivationsProps) {
  // Duplicate the list once so the -50% translate loops seamlessly.
  const rendered = [...items, ...items];

  return (
    <section
      aria-label="Recent activations"
      className="bg-brand-black grain-overlay-dark overflow-hidden py-12"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <p className="font-accent text-lg md:text-xl text-brand-orange mb-6">
          {eyebrow}
        </p>
      </div>

      <div className="relative z-10 overflow-hidden">
        <div
          className="flex whitespace-nowrap will-change-transform motion-reduce:animate-none"
          style={{
            animation: `marquee ${durationSeconds}s linear infinite`,
          }}
        >
          {rendered.map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight text-brand-grey flex items-center"
            >
              {item}
              <span
                aria-hidden="true"
                className="mx-6 md:mx-10 text-brand-orange"
              >
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
