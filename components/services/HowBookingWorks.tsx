import type { ProcessStep } from "@/lib/services/landing-content";

/**
 * HowBookingWorks — 3-step process block.
 * Kept structurally identical to the previous template's Section 4 — per
 * design spec §2.2, the 3-step section is voice-appropriate and doesn't
 * need to change. Only the copy strings vary per page.
 */

interface HowBookingWorksProps {
  eyebrow: string;
  heading: string;
  steps: ProcessStep[];
  surface: "light" | "dark";
}

export function HowBookingWorks({
  eyebrow,
  heading,
  steps,
  surface,
}: HowBookingWorksProps) {
  const isDark = surface === "dark";
  const eyebrowColor = isDark ? "text-brand-orange" : "text-brand-green";
  const headingColor = isDark ? "text-brand-grey" : "text-brand-black";
  const numberColor = isDark ? "text-brand-grey/10" : "text-brand-black/10";
  const stepTitleColor = isDark ? "text-brand-grey" : "text-brand-black";
  const bodyColor = isDark ? "text-brand-grey/70" : "text-brand-black/70";
  const dividerClass = isDark
    ? "h-px bg-brand-grey/10 mt-6 mb-12"
    : "h-0.5 bg-brand-black mt-6 mb-12";

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
      <p
        className={`font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] mb-4 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display font-bold text-4xl md:text-5xl uppercase tracking-tight leading-[0.95] ${headingColor}`}
      >
        {heading}
      </h2>
      <div className={dividerClass} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step) => (
          <div key={step.number}>
            <span
              className={`font-display text-6xl md:text-7xl font-bold ${numberColor}`}
            >
              {step.number}
            </span>
            <h3
              className={`font-display font-bold text-lg md:text-xl uppercase tracking-tight mt-2 ${stepTitleColor}`}
            >
              {step.title}
            </h3>
            <p
              className={`font-sans text-sm md:text-base leading-relaxed mt-3 ${bodyColor}`}
            >
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
