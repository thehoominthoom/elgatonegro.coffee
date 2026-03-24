"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";

const navLinks: Array<{ label: string; href: string }> = [
  { label: "Find Us", href: "/events" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <>
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
              className="[filter:blur(0.4px)] transition-[filter] duration-300 hover:blur-0"
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
                className="relative cursor-pointer transition-transform duration-200 hover:scale-110"
              >
                <ShoppingBag size={22} className="text-brand-black/70" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-orange text-brand-grey text-[10px] font-sans font-extrabold rounded-full flex items-center justify-center leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              <Link href="/account" aria-label="Account" className="transition-transform duration-200 hover:scale-110 inline-flex">
                <User size={23} className="text-brand-black/70" />
              </Link>
            </div>

            <button
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              className="md:hidden"
              onClick={() => setDrawerOpen((prev) => !prev)}
            >
              {drawerOpen ? (
                <X size={22} className="text-brand-black" />
              ) : (
                <Menu size={22} className="text-brand-black" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile nav drawer */}
      <div
        aria-hidden={!drawerOpen}
        className={[
          "fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-brand-grey flex flex-col px-6 pt-6 pb-8",
          "transition-transform duration-300 ease-in-out",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button
            aria-label="Close menu"
            onClick={closeDrawer}
            className="text-brand-black"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav>
          <ul className="list-none m-0 p-0">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeDrawer}
                  className="font-sans font-extrabold text-2xl uppercase tracking-wide text-brand-black py-4 border-b border-brand-black/10 block w-full"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="border-t border-brand-black/10 mt-6 mb-6" />

        {/* Book the Cart CTA */}
        <Link
          href="/inquiry"
          onClick={closeDrawer}
          className="w-full bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] py-3 rounded-sm hover:bg-brand-yellow transition-colors flex items-center justify-center"
        >
          Book the Cart
        </Link>

        {/* Contact line */}
        <p className="text-xs font-sans text-brand-black/60 tracking-wide text-center mt-4">
          sales@elgatonegro.coffee
        </p>
      </div>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-brand-black/20"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}
    </>
  );
}
