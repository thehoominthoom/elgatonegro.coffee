import Image from "next/image";
import { Instagram } from "lucide-react";

function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center gap-8 px-4">
      {/* Logo */}
      <Image
        src="/brand/hellcat-color.svg"
        alt="El Gato Negro Coffee"
        width={220}
        height={255}
        priority
      />

      {/* Wordmark details */}
      <div className="flex flex-col items-center gap-1">
        {(["COFFEE CART", "NASHVILLE, TN", "EST. 2025"] as const).map(
          (line) => (
            <p
              key={line}
              className="font-sans font-extrabold text-brand-black text-xs tracking-[0.2em] uppercase"
            >
              {line}
            </p>
          )
        )}
      </div>

      {/* Social links */}
      <div className="flex items-center gap-5">
        <a
          href="https://www.instagram.com/elgatonegro.coffee/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="El Gato Negro on Instagram"
          className="text-brand-black hover:text-brand-orange transition-colors"
        >
          <Instagram size={22} strokeWidth={1.75} />
        </a>
        <a
          href="https://www.tiktok.com/@el.gato.negro.coffee"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="El Gato Negro on TikTok"
          className="text-brand-black hover:text-brand-orange transition-colors"
        >
          <TikTokIcon size={20} />
        </a>
      </div>
    </div>
  );
}
