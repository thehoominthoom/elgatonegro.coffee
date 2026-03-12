import Link from "next/link";
import { ShoppingBag, User, Menu } from "lucide-react";

const navLinks: Array<{ label: string; href: string }> = [
  { label: "Find Us", href: "/locations" },
  { label: "Menu", href: "/menu" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Resources", href: "/resources" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-brand-grey border-b border-brand-black shadow-polaroid">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-bold text-brand-orange uppercase tracking-widest"
        >
          El Gato Negro
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-6 list-none m-0 p-0">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm font-semibold uppercase tracking-wide text-brand-black hover:text-brand-orange transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button aria-label="Cart" className="relative">
            <ShoppingBag size={20} className="text-brand-black" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-orange text-brand-grey text-[10px] font-bold flex items-center justify-center">
              0
            </span>
          </button>

          {/* Account link */}
          <Link href="/login" aria-label="Account">
            <User size={20} className="text-brand-black" />
          </Link>

          {/* Mobile hamburger */}
          <button aria-label="Open menu" className="md:hidden">
            <Menu size={24} className="text-brand-black" />
          </button>
          {/* TODO: mobile nav drawer — Step 3 */}
        </div>
      </nav>
    </header>
  );
}
