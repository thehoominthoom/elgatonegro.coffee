import Link from "next/link";

/**
 * HeroBreadcrumb — small "Services / [Page Name]" trail used inside each
 * subpage hero. Kept as its own component because it renders on top of an
 * image with slightly different alpha depending on whether the hero is
 * full-viewport (bleeds into dark image) or an editorial spread (dark bg).
 */

interface HeroBreadcrumbProps {
  currentLabel: string;
  variant: "onImage" | "onDarkBg";
}

export function HeroBreadcrumb({
  currentLabel,
  variant,
}: HeroBreadcrumbProps) {
  const baseColor =
    variant === "onImage" ? "text-brand-grey/60" : "text-brand-grey/40";
  const currentColor =
    variant === "onImage" ? "text-brand-grey/80" : "text-brand-grey/70";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 font-sans text-xs ${baseColor}`}
    >
      <Link
        href="/services"
        className="hover:text-brand-orange transition-colors"
      >
        Services
      </Link>
      <span aria-hidden="true">/</span>
      <span className={currentColor}>{currentLabel}</span>
    </nav>
  );
}
