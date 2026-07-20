/**
 * InclusionsList — bullets, not cards.
 *
 * Replaces the previous 3-column bordered card grid on service subpages.
 * All voice-carrying strings must be passed in — no defaults on props that
 * render text. Section chrome (background + grain) is the caller's job so
 * the same component reads correctly on either surface.
 *
 * Spec: copy/services-pages-design-spec.md §3.1
 */

interface InclusionsListProps {
  eyebrow: string;
  heading: string;
  items: string[];
  surface: "light" | "dark";
  headingSize?: "md" | "lg";
}

export function InclusionsList({
  eyebrow,
  heading,
  items,
  surface,
  headingSize = "md",
}: InclusionsListProps) {
  const isDark = surface === "dark";

  const eyebrowColor = isDark ? "text-brand-orange" : "text-brand-green";
  const headingColor = isDark ? "text-brand-grey" : "text-brand-black";
  const bodyColor = isDark ? "text-brand-grey/80" : "text-brand-black/75";
  const dividerClass = isDark
    ? "h-px bg-brand-grey/10 mt-8 mb-10"
    : "h-0.5 bg-brand-black mt-6 mb-10";

  const headingClass =
    headingSize === "lg"
      ? "font-display font-bold text-5xl md:text-6xl uppercase tracking-tight leading-[0.95]"
      : "font-display font-bold text-4xl md:text-5xl uppercase tracking-tight leading-[0.95]";

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
      <p
        className={`font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] mb-4 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h2 className={`${headingClass} ${headingColor}`}>{heading}</h2>
      <div className={dividerClass} />

      <ul className="max-w-3xl space-y-6 md:space-y-7">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="mt-2.5 h-2 w-2 shrink-0 bg-brand-orange"
            />
            <span
              className={`font-sans text-base md:text-lg leading-relaxed ${bodyColor}`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
