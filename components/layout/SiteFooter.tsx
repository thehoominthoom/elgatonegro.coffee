import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";

interface FooterColumnProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-yellow mb-3">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-brand-grey/70 hover:text-brand-grey transition-colors"
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
    <footer className="bg-brand-black text-brand-grey">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
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
              href="#"
              aria-label="Instagram"
              className="text-brand-grey/60 hover:text-brand-yellow transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="text-brand-grey/60 hover:text-brand-yellow transition-colors"
            >
              <Youtube size={18} />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="text-brand-grey/60 hover:text-brand-yellow transition-colors"
            >
              <span className="text-xs font-bold">TK</span>
            </a>
          </div>
        </div>

        <FooterColumn
          title="Visit"
          links={[
            { label: "Hours", href: "/locations" },
            { label: "Locations", href: "/locations" },
            { label: "Events", href: "/events" },
          ]}
        />

        <FooterColumn
          title="Work With Us"
          links={[
            { label: "Services", href: "/services" },
            { label: "Weddings", href: "/services/weddings" },
            { label: "Corporate", href: "/services/corporate" },
            { label: "Conventions", href: "/services/conventions" },
          ]}
        />

        <FooterColumn
          title="Shop"
          links={[
            { label: "All Products", href: "/shop" },
            { label: "Merch", href: "/shop/merch" },
            { label: "Coffee Beans", href: "/shop/beans" },
            { label: "Digital", href: "/shop/digital" },
          ]}
        />

        <FooterColumn
          title="Resources"
          links={[
            { label: "Blog", href: "/resources/blog" },
            { label: "Build Guides", href: "/resources/build-guides" },
            { label: "Product Lists", href: "/resources/product-lists" },
            { label: "YouTube", href: "/resources/youtube" },
          ]}
        />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-grey/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-brand-grey/50">
            &copy; {new Date().getFullYear()} El Gato Negro Coffee. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-brand-grey/50 hover:text-brand-grey transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-brand-grey/50 hover:text-brand-grey transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/refund-policy"
              className="text-xs text-brand-grey/50 hover:text-brand-grey transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
