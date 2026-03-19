"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/shopify/utils";
import type { CartLine } from "@/lib/shopify/types";

export function CartDrawer() {
  const { cart, isOpen, isPending, closeCart, removeItem, updateItem } =
    useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap Escape key and lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const lines = cart?.lines.nodes ?? [];
  const isEmpty = lines.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={[
          "fixed inset-0 z-40 bg-brand-black/40",
          "transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={[
          "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-brand-grey flex flex-col",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-black/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-brand-black" />
            <span className="font-sans font-extrabold text-sm uppercase tracking-[0.15em] text-brand-black">
              Your Cart
            </span>
            {!isEmpty && (
              <span className="bg-brand-orange text-brand-grey text-xs font-sans font-extrabold px-2 py-0.5 rounded-full">
                {cart?.totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-brand-black/60 hover:text-brand-black transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <ul className="divide-y divide-brand-black/10">
              {lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  onRemove={() => removeItem(line.id)}
                  onUpdate={(qty) => updateItem(line.id, qty)}
                  disabled={isPending}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && cart && (
          <div className="border-t border-brand-black/10 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-brand-black/60">
                Subtotal
              </span>
              <span className="font-sans font-extrabold text-base text-brand-black">
                {formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>
            <p className="font-sans text-xs text-brand-black/40">
              Taxes and shipping calculated at checkout.
            </p>
            <a
              href={cart.checkoutUrl}
              className={[
                "block w-full bg-brand-orange text-brand-grey text-center",
                "font-sans font-extrabold text-sm uppercase tracking-[0.15em]",
                "py-4 hover:bg-brand-yellow hover:text-brand-black transition-colors",
                isPending ? "opacity-60 pointer-events-none" : "",
              ].join(" ")}
            >
              Checkout
            </a>
            <button
              onClick={closeCart}
              className="block w-full text-center font-sans text-sm text-brand-black/50 hover:text-brand-black transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── CartLineItem ─────────────────────────────────────────────────────────────

function CartLineItem({
  line,
  onRemove,
  onUpdate,
  disabled,
}: {
  line: CartLine;
  onRemove: () => void;
  onUpdate: (qty: number) => void;
  disabled: boolean;
}) {
  const { merchandise, quantity, cost } = line;

  const variantLabel = merchandise.selectedOptions
    .filter((o) => o.name !== "Title" && o.value !== "Default Title")
    .map((o) => o.value)
    .join(" / ");

  return (
    <li className="flex gap-4 px-6 py-5">
      {/* Image */}
      <div className="w-20 h-20 shrink-0 bg-brand-black/5 overflow-hidden">
        {merchandise.product.featuredImage ? (
          <Image
            src={merchandise.product.featuredImage.url}
            alt={
              merchandise.product.featuredImage.altText ??
              merchandise.product.title
            }
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-brand-black/10" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/shop/products/${merchandise.product.handle}`}
          className="font-sans font-extrabold text-sm uppercase tracking-wide text-brand-black hover:text-brand-orange transition-colors line-clamp-1"
        >
          {merchandise.product.title}
        </Link>
        {variantLabel && (
          <p className="font-sans text-xs text-brand-black/50 mt-0.5">
            {variantLabel}
          </p>
        )}
        <p className="font-sans font-extrabold text-sm text-brand-orange mt-1">
          {formatMoney(cost.totalAmount)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onUpdate(quantity - 1)}
            disabled={disabled}
            aria-label="Decrease quantity"
            className="w-7 h-7 flex items-center justify-center border border-brand-black/20 hover:border-brand-black/60 transition-colors disabled:opacity-40"
          >
            <Minus size={12} />
          </button>
          <span className="font-sans text-sm font-extrabold w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={() => onUpdate(quantity + 1)}
            disabled={disabled}
            aria-label="Increase quantity"
            className="w-7 h-7 flex items-center justify-center border border-brand-black/20 hover:border-brand-black/60 transition-colors disabled:opacity-40"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove item"
            className="ml-auto text-brand-black/30 hover:text-brand-orange transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </li>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4 py-20">
      <ShoppingBag size={40} className="text-brand-black/20" />
      <p className="font-sans font-extrabold text-sm uppercase tracking-[0.15em] text-brand-black/40">
        Your cart is empty
      </p>
      <Link
        href="/shop"
        onClick={onClose}
        className="font-sans text-sm text-brand-orange hover:text-brand-yellow transition-colors underline underline-offset-4"
      >
        Browse the shop
      </Link>
    </div>
  );
}
