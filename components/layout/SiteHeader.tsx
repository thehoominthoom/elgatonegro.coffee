"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";

const navLinks: Array<{ label: string; href: string }> = [
  { label: "Find Us", href: "/events" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <>
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
          <div className="ml-auto flex items-center gap-5">
            {/* Desktop CTA */}
            <Link
              href="/inquiry"
              className="hidden lg:inline-flex mr-6 bg-brand-orange text-brand-grey text-xs font-sans font-extrabold uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-brand-yellow hover:text-brand-black transition-colors"
            >
              Book the Cart
            </Link>

            {/* Cart + account icons */}
            <div className="flex items-center gap-2">
              <button aria-label="Cart" className="relative">
                <ShoppingBag size={22} className="text-brand-black/70" />
              </button>

              <Link href="/login" aria-label="Account">
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
          "fixed inset-x-0 top-0 z-40 bg-brand-grey px-6 pt-6 pb-8",
          "transition-all duration-300 ease-in-out",
          drawerOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none",
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
          className="w-full bg-brand-orange text-brand-grey font-sans font-extrabold text-sm uppercase tracking-wider py-3 rounded-sm hover:bg-brand-yellow hover:text-brand-black transition-colors flex items-center justify-center"
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
