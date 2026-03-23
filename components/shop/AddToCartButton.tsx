"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

interface AddToCartButtonProps {
  variantId: string | null;
  availableForSale: boolean;
}

export function AddToCartButton({
  variantId,
  availableForSale,
}: AddToCartButtonProps) {
  const { addItem, isPending } = useCart();

  const disabled = !variantId || !availableForSale || isPending;

  async function handleAdd() {
    if (!variantId || !availableForSale) return;
    await addItem(variantId, 1);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className={[
        "w-full flex items-center justify-center gap-3",
        "font-display font-bold text-sm uppercase tracking-[0.1em]",
        "py-4 rounded-sm transition-colors",
        !availableForSale
          ? "bg-brand-black/10 text-brand-black/40 cursor-not-allowed"
          : disabled
          ? "bg-brand-orange/50 text-brand-grey cursor-not-allowed"
          : "bg-brand-orange text-brand-grey hover:bg-brand-yellow",
      ].join(" ")}
    >
      <ShoppingBag size={16} />
      {!availableForSale
        ? "Sold Out"
        : isPending
        ? "Adding…"
        : "Add to Cart"}
    </button>
  );
}
