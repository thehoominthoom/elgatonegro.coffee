import Image from "next/image";
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
    <header className="sticky top-0 z-50 bg-brand-grey border-b border-brand-black/10">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 relative flex items-center">
        {/* Logo — left */}
        <Link href="/" className="block shrink-0">
          <Image
            src="/brand/wordmark-orange-hori.svg"
            alt="El Gato Negro"
            width={160}
            height={20}
            priority
          />
        </Link>

        {/* Desktop nav links — centered */}
        <ul className="hidden md:flex gap-7 list-none m-0 p-0 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/70 hover:text-brand-black transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions — right */}
        <div className="ml-auto flex items-center gap-3">
          <button aria-label="Cart" className="relative">
            <ShoppingBag size={22} className="text-brand-black/70" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-brand-orange text-brand-grey text-[10px] font-bold flex items-center justify-center">
              0
            </span>
          </button>

          <Link href="/login" aria-label="Account">
            <User size={23} className="text-brand-black/70" />
          </Link>

          <button aria-label="Open menu" className="md:hidden">
            <Menu size={22} className="text-brand-black" />
          </button>
          {/* TODO: mobile nav drawer */}
        </div>
      </nav>
    </header>
  );
}
