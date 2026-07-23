import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * AlsoSee — quiet cross-link strip above the final CTA.
 * Two text links, no icons, no cards. Anchor text prescribed by the SEO
 * internal linking map. Section chrome is the caller's.
 */

interface AlsoSeeLink {
  href: string;
  label: string;
}

interface AlsoSeeProps {
  links: [AlsoSeeLink, AlsoSeeLink];
}

export function AlsoSee({ links }: AlsoSeeProps) {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
      <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60 mb-6 md:mb-8">
        ALSO SEE
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group inline-flex items-center gap-3 font-display font-bold text-lg md:text-xl uppercase tracking-tight text-brand-black hover:text-brand-orange transition-colors"
          >
            <ArrowRight
              size={18}
              className="text-brand-orange transition-transform group-hover:translate-x-1"
            />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
