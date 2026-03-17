import Link from "next/link";
import { MapPin } from "lucide-react";
import { client } from "@/sanity/lib/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Cart {
  _id: string;
  name: string;
  isOpen: boolean;
  hours: string | null;
  address: string | null;
  mapLink: string | null;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const CARTS_QUERY = `*[_type == "cartStatus"] | order(name asc) {
  _id,
  name,
  isOpen,
  address,
  "hours": openUntil,
  mapLink
}`;

// ─── Component ────────────────────────────────────────────────────────────────

export async function CartStatusBar() {
  const carts = await client.fetch<Cart[]>(CARTS_QUERY, {}, { next: { revalidate: 60 } });

  const openCarts = carts.filter((c) => c.isOpen);
  const hasOpen = openCarts.length > 0;

  return (
    <div
      className={`w-full border-b border-brand-black/10 ${
        hasOpen ? "bg-brand-orange" : "bg-brand-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-1">
        {/* Status label */}
        <span
          className={`font-display text-[10px] uppercase tracking-[0.3em] shrink-0 ${
            hasOpen ? "text-brand-black/60" : "text-brand-grey/40"
          }`}
        >
          Cart Status
        </span>

        {hasOpen ? (
          <>
            {openCarts.map((cart) => (
              <div key={cart._id} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-black/40" />
                <span className="font-display text-[11px] uppercase tracking-[0.2em] text-brand-black font-bold">
                  {cart.name}
                </span>
                {cart.hours && (
                  <span className="font-display text-[11px] text-brand-black/60 uppercase tracking-[0.15em]">
                    {cart.hours}
                  </span>
                )}
                {cart.address && (
                  <span className="font-display text-[11px] text-brand-black/50 uppercase tracking-[0.1em] hidden sm:block">
                    {cart.address}
                  </span>
                )}
                {cart.mapLink && (
                  <Link
                    href={cart.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-display text-[10px] uppercase tracking-[0.2em] text-brand-black/70 hover:text-brand-black transition-colors"
                  >
                    <MapPin size={10} />
                    Map
                  </Link>
                )}
              </div>
            ))}
          </>
        ) : (
          <span className="font-display text-[11px] uppercase tracking-[0.2em] text-brand-grey/50">
            No carts in operation today
          </span>
        )}

        {/* Cart count on right */}
        <span
          className={`ml-auto font-display text-[10px] uppercase tracking-[0.25em] shrink-0 ${
            hasOpen ? "text-brand-black/40" : "text-brand-grey/30"
          }`}
        >
          {openCarts.length} / {carts.length} open
        </span>
      </div>
    </div>
  );
}
