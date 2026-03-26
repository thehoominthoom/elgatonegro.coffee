"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";
import { useNavDrawer } from "./NavDrawer";

const navLinks: Array<{ label: string; href: string }> = [
  { label: "Find Us", href: "/events" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const { isOpen, toggle } = useNavDrawer();
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-brand-grey border-b border-brand-black/10">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 relative flex items-center">
        {/* Logo — left */}
        <Link href="/" className="block shrink-0 transition-transform duration-300 hover:scale-105">
          <Image
            src="/brand/wordmark-orange-hori.svg"
            alt="El Gato Negro"
            width={160}
            height={20}
            priority
            className="[filter:blur(0.15px)] transition-[filter] duration-300 hover:blur-0"
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
        <div className="ml-auto flex items-center gap-5">
          {/* Desktop CTA */}
          <Link
            href="/inquiry"
            className="hidden lg:inline-flex mr-6 bg-brand-orange text-brand-grey text-xs font-display font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-sm hover:bg-brand-yellow transition-colors"
          >
            Book the Cart
          </Link>

          {/* Cart + account icons */}
          <div className="flex items-center gap-2">
            <button
              aria-label={`Cart${itemCount > 0 ? ` — ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}
              onClick={openCart}
              className="relative cursor-pointer transition-transform duration-200 hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ShoppingBag size={22} className="text-brand-black/70" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-orange text-brand-grey text-[10px] font-sans font-extrabold rounded-full flex items-center justify-center leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            <Link href="/account" aria-label="Account" className="transition-transform duration-200 hover:scale-110 inline-flex min-w-[44px] min-h-[44px] items-center justify-center">
              <User size={23} className="text-brand-black/70" />
            </Link>
          </div>

          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={toggle}
          >
            {isOpen ? (
              <X size={22} className="text-brand-black" />
            ) : (
              <Menu size={22} className="text-brand-black" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
