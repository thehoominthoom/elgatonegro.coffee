/**
 * ByTheNumbers — editorial pull-quote block for numeric proof.
 * Loud orange value, small uppercase label, optional detail line.
 * No borders — grid spacing does the separation.
 *
 * Spec: copy/services-pages-design-spec.md §3.3
 */

interface ByTheNumbersItem {
  value: string;
  label: string;
  detail?: string;
}

interface ByTheNumbersProps {
  eyebrow?: string;
  items: ByTheNumbersItem[];
  surface: "light" | "dark";
  columns?: 2 | 3;
}

export function ByTheNumbers({
  eyebrow = "BY THE NUMBERS",
  items,
  surface,
  columns = 3,
}: ByTheNumbersProps) {
  const isDark = surface === "dark";
  const eyebrowColor = isDark ? "text-brand-orange" : "text-brand-green";
  const labelColor = isDark ? "text-brand-grey/60" : "text-brand-black/70";
  const detailColor = isDark ? "text-brand-grey/50" : "text-brand-black/50";

  const gridCols =
    columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
      <p
        className={`font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] mb-10 md:mb-12 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>

      <div className={`grid grid-cols-1 ${gridCols} gap-10 md:gap-8`}>
        {items.map((item) => (
          <div key={`${item.value}-${item.label}`} className="relative py-4">
            <p
              className="font-display font-bold uppercase tracking-tight leading-none tabular-nums text-brand-orange"
              style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)" }}
            >
              {item.value}
            </p>
            <p
              className={`font-sans font-extrabold text-xs md:text-sm uppercase tracking-[0.15em] mt-4 ${labelColor}`}
            >
              {item.label}
            </p>
            {item.detail ? (
              <p
                className={`font-sans text-sm leading-relaxed mt-2 max-w-[18ch] ${detailColor}`}
              >
                {item.detail}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
