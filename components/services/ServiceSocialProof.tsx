import { clients } from "@/lib/clients";

/**
 * Logo grid used on brand-activations + community-conventions.
 * Shared component (same one Phil may split into corporate vs. convention
 * lists later). Section chrome is the caller's — this renders content only.
 */

interface ServiceSocialProofProps {
  eyebrow: string;
}

export function ServiceSocialProof({ eyebrow }: ServiceSocialProofProps) {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
      <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60 mb-8">
        {eyebrow}
      </p>

      {/* Desktop: wrapped grid */}
      <div className="hidden md:grid grid-cols-5 gap-3">
        {clients.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-center aspect-[8/5] bg-brand-black/[0.03] px-6 py-4 overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG logos, no optimization needed */}
            <img
              src={c.src}
              alt={c.name}
              className="w-auto max-h-full"
              style={{ height: c.h }}
            />
          </div>
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {clients.map((c) => (
          <div
            key={c.name}
            className="flex-shrink-0 flex items-center justify-center w-40 aspect-[8/5] bg-brand-black/[0.03] px-4 py-3 overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG logos */}
            <img
              src={c.src}
              alt={c.name}
              className="w-auto max-h-full"
              style={{ height: Math.min(c.h, 40) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
