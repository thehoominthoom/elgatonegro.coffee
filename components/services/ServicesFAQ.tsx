import Link from "next/link";
import type { FAQBlock, FAQItem } from "@/lib/services/faqs";

/**
 * ServicesFAQ — stacked Q/A rows on dashed dividers.
 * Renders the FAQ block on all 5 service routes with the same visual pattern
 * but per-page eyebrow + heading. Supports optional inline linking on answer
 * text: caller passes `{phrase, href}` and the first occurrence of `phrase`
 * in the answer is rendered as a `next/link`.
 *
 * Spec: copy/services-pages-design-spec.md §2.1
 */

interface ServicesFAQProps extends FAQBlock {
  surface: "light" | "dark";
  /**
   * Optional list of index-agnostic inline links applied to the index page
   * FAQ. Each entry links the first occurrence of `phrase` in `answer` to
   * `href`. Subpage FAQs use `FAQItem.inlineLink` on the item itself; the
   * index page uses this array because two phrases in one answer link to
   * two different subpages.
   */
  inlineLinks?: Array<{ phrase: string; href: string }>;
}

export function ServicesFAQ({
  eyebrow,
  heading,
  items,
  surface,
  inlineLinks,
}: ServicesFAQProps) {
  const isDark = surface === "dark";
  const eyebrowColor = isDark ? "text-brand-orange" : "text-brand-green";
  const headingColor = isDark ? "text-brand-grey" : "text-brand-black";
  const questionColor = isDark ? "text-brand-grey" : "text-brand-black";
  const answerColor = isDark ? "text-brand-grey/70" : "text-brand-black/70";
  const dividerColor = isDark
    ? "border-brand-grey/10"
    : "border-brand-black/15";

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
      <p
        className={`font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] mb-4 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display font-bold text-3xl md:text-4xl uppercase tracking-tight leading-[0.95] mb-10 md:mb-12 ${headingColor}`}
      >
        {heading}
      </h2>

      <div>
        {items.map((item, i) => (
          <div
            key={item.question}
            className={[
              "py-8 md:py-10 border-b border-dashed",
              i === 0 ? "border-t" : "",
              dividerColor,
            ].join(" ")}
          >
            <h3
              className={`font-display font-bold text-lg md:text-xl uppercase tracking-tight ${questionColor}`}
            >
              {item.question}
            </h3>
            <p
              className={`font-sans text-base md:text-lg leading-relaxed mt-4 max-w-3xl ${answerColor}`}
            >
              {renderAnswer(item, inlineLinks)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Render an answer string with optional inline links.
 * Priority: item's own inlineLink -> caller-provided inlineLinks -> plain text.
 * We only inject the first match per phrase and never nest links.
 */
function renderAnswer(
  item: FAQItem,
  inlineLinks?: Array<{ phrase: string; href: string }>,
) {
  const linksToApply: Array<{ phrase: string; href: string }> = [];
  if (item.inlineLink) linksToApply.push(item.inlineLink);
  if (inlineLinks) linksToApply.push(...inlineLinks);

  if (linksToApply.length === 0) return item.answer;

  // Walk through the answer string, splitting on the first occurrence of each
  // phrase and wrapping that occurrence in a Link. Anything not matched stays
  // as plain text.
  const parts: Array<{ text: string; href?: string; key: string }> = [
    { text: item.answer, key: "root" },
  ];

  for (const { phrase, href } of linksToApply) {
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.href) continue; // already a link, skip
      const idx = part.text.indexOf(phrase);
      if (idx === -1) continue;

      const before = part.text.slice(0, idx);
      const match = part.text.slice(idx, idx + phrase.length);
      const after = part.text.slice(idx + phrase.length);

      const replacement: typeof parts = [];
      if (before) replacement.push({ text: before, key: `${part.key}-b-${i}` });
      replacement.push({ text: match, href, key: `${part.key}-l-${i}` });
      if (after) replacement.push({ text: after, key: `${part.key}-a-${i}` });

      parts.splice(i, 1, ...replacement);
      break; // move to the next phrase
    }
  }

  return parts.map((part) =>
    part.href ? (
      <Link
        key={part.key}
        href={part.href}
        className="text-brand-orange underline decoration-brand-orange/40 underline-offset-4 hover:decoration-brand-orange transition-colors"
      >
        {part.text}
      </Link>
    ) : (
      <span key={part.key}>{part.text}</span>
    ),
  );
}
