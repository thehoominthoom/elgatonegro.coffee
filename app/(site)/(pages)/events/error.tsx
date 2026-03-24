"use client";

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-brand-grey flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-brand-black mb-4">
          Something went wrong
        </h1>
        <p className="font-sans text-sm text-brand-black/60 mb-2">
          {error.message}
        </p>
        <p className="font-sans text-xs text-brand-black/40 mb-6">
          {error.digest && `Digest: ${error.digest}`}
        </p>
        <button
          onClick={reset}
          className="bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] px-6 py-3 rounded-sm hover:bg-brand-yellow transition-colors"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
