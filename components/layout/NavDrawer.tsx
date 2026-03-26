"use client";

import { createContext, useContext, useState, useCallback } from "react";
import Link from "next/link";
import { X } from "lucide-react";

// ─── Shared state ────────────────────────────────────────────────────────────

interface NavDrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const NavDrawerContext = createContext<NavDrawerContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export function useNavDrawer() {
  return useContext(NavDrawerContext);
}

export function NavDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <NavDrawerContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </NavDrawerContext.Provider>
  );
}

// ─── Nav links ───────────────────────────────────────────────────────────────

const navLinks: Array<{ label: string; href: string }> = [
  { label: "Find Us", href: "/events" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
];

// ─── Drawer panel ────────────────────────────────────────────────────────────

export function NavDrawer() {
  const { isOpen, close } = useNavDrawer();

  return (
    <>
      {/* Drawer */}
      <div
        inert={!isOpen ? true : undefined}
        className={[
          "fixed top-[7.5rem] bottom-0 right-0 z-[55] w-full max-w-md bg-brand-grey flex flex-col px-6 pt-6 pb-8",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Nav links */}
        <nav>
          <ul className="list-none m-0 p-0">
            {navLinks.map(({ label, href }) => (
              <li key={href} className="border-b border-brand-black/10 last:border-b-0">
                <Link
                  href={href}
                  onClick={close}
                  className="font-sans font-extrabold text-2xl uppercase tracking-wide text-brand-black py-4 block w-full"
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
          onClick={close}
          className="w-full bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] py-3 rounded-sm hover:bg-brand-yellow transition-colors flex items-center justify-center"
        >
          Book the Cart
        </Link>

        {/* Contact line */}
        <p className="text-xs font-sans text-brand-black/60 tracking-wide text-center mt-4">
          sales@elgatonegro.coffee
        </p>
      </div>

      {/* Backdrop — closes drawer on tap, no dimming */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[54]"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
}
