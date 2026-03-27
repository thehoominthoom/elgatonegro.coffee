import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SiteNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-brand-black grain-overlay px-6 text-center">
      <div className="relative z-10">
        <p className="font-display text-[20px] uppercase tracking-[0.3em] text-brand-orange mb-4">
          404
        </p>
        <h1 className="font-display font-bold text-5xl uppercase tracking-tight text-brand-grey">
          Page not found
        </h1>
        <p className="mt-4 font-sans text-sm text-brand-grey/60 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-[0.1em] bg-brand-orange text-brand-grey px-6 py-3 rounded-sm hover:bg-brand-yellow transition-colors"
          >
            Homepage <ArrowRight size={14} />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-[0.1em] border-2 border-brand-grey/20 text-brand-grey px-6 py-3 rounded-sm hover:border-brand-grey/40 transition-colors"
          >
            Shop <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
