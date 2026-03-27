import Link from "next/link";
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

interface FooterColumnProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-yellow mb-3">
        {title}
      </h3>
      <ul className="space-y-0">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-brand-grey/70 hover:text-brand-grey transition-colors min-h-[44px] inline-flex items-center"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-brand-black text-brand-grey grain-overlay-dark">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Column 1 — Brand */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl font-bold text-brand-grey uppercase tracking-widest">
            El Gato Negro
          </p>
          <p className="text-sm text-brand-grey/70 mt-1">
            Coffee that shows up.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://www.instagram.com/elgatonegro.coffee/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-brand-grey/60 hover:text-brand-yellow transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@el.gato.negro.coffee"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-brand-grey/60 hover:text-brand-yellow transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
            >
              <TikTokIcon size={18} />
            </a>
          </div>
        </div>

        <FooterColumn
          title="Visit"
          links={[
            { label: "Find Us", href: "/events" },
          ]}
        />

        <FooterColumn
          title="Work With Us"
          links={[
            { label: "Services", href: "/services" },
            { label: "Brand Activations", href: "/services/brand-activations" },
            { label: "Community & Conventions", href: "/services/community-conventions" },
            { label: "Weddings & Celebrations", href: "/services/weddings-celebrations" },
            { label: "Private Events", href: "/services/private-events" },
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            { label: "Media Resources", href: "/media" },
            { label: "Opportunities", href: "/opportunities" },
          ]}
        />

        <FooterColumn
          title="Shop"
          links={[
            { label: "All Products", href: "/shop" },
            { label: "Coffee Beans", href: "/shop/collections/coffee-beans" },
            { label: "Apparel", href: "/shop/collections/apparel" },
            { label: "Merchandise", href: "/shop/collections/merchandise" },
          ]}
        />

      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-brand-grey/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-brand-grey/70">
            &copy; {new Date().getFullYear()} El Gato Negro Coffee. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-brand-grey/70 hover:text-brand-grey transition-colors min-h-[44px] inline-flex items-center"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-brand-grey/70 hover:text-brand-grey transition-colors min-h-[44px] inline-flex items-center"
            >
              Terms
            </Link>
            <Link
              href="/refund-policy"
              className="text-xs text-brand-grey/70 hover:text-brand-grey transition-colors min-h-[44px] inline-flex items-center"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
