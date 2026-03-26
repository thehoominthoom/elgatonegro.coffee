"use client";

import Link from "next/link";

export default function EventsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display font-bold text-5xl uppercase tracking-tight text-brand-black">
        Events unavailable
      </h1>
      <p className="mt-4 font-sans text-sm text-brand-black/60 max-w-md">
        We hit a snag loading events. This is usually temporary — try again in a
        moment.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="font-sans font-semibold text-sm uppercase tracking-wider bg-brand-orange text-white px-6 py-3 hover:bg-brand-orange/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="font-sans font-semibold text-sm uppercase tracking-wider border-2 border-brand-black text-brand-black px-6 py-3 hover:bg-brand-black hover:text-white transition-colors"
        >
          Homepage
        </Link>
      </div>
    </div>
  );
}
