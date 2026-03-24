import Link from "next/link";
import { Package, MapPin, UserRound, LayoutDashboard, LogOut } from "lucide-react";
import { getCustomerSession } from "@/lib/shopify/auth-helpers";
import { redirect } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: UserRound },
] as const;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");

  return (
    <div className="min-h-screen bg-brand-grey grain-overlay">
      <section className="relative z-10 px-4 md:px-6 pt-4 pb-10 md:pt-8 md:pb-16">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="border-b-2 border-brand-black pb-8 md:pb-10 mb-8 md:mb-12">
            <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/50 mb-2">
              El Gato Negro
            </p>
            <h1 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tight text-brand-black">
              My Account
            </h1>
          </div>

          {/* Layout: sidebar + content */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Sidebar nav */}
            <nav className="md:w-56 shrink-0">
              <ul className="list-none m-0 p-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                {navItems.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/60 hover:text-brand-black hover:bg-brand-black/5 transition-colors whitespace-nowrap"
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="/api/auth/logout"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/40 hover:text-brand-orange transition-colors whitespace-nowrap"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </a>
                </li>
              </ul>
            </nav>

            {/* Content */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
