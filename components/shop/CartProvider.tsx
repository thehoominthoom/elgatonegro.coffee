"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import {
  addToCart,
  removeCartLine,
  updateCartLine,
  getCart,
} from "@/lib/shopify/cart";
import type { Cart, CartLine, CartUpdate } from "@/lib/shopify/types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface CartContextValue {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  /** Why the last change did not go as asked (Shopify's stock message, or a retry hint) */
  notice: string | null;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

// ─── CartProvider ─────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic item count — updates immediately, confirmed on server response
  const [optimisticCount, setOptimisticCount] = useOptimistic(
    cart?.totalQuantity ?? 0
  );

  // Hydrate cart from cookie on mount
  useEffect(() => {
    getCart().then((c) => setCart(c));
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => {
    setIsOpen(false);
    setNotice(null);
  }, []);

  // This provider sits above every error boundary, so a thrown error here would replace the
  // whole page. A failed call becomes a notice in the drawer instead.
  const applyChange = useCallback(async (change: () => Promise<CartUpdate>) => {
    try {
      const update = await change();
      if (update.cart) setCart(update.cart);
      setNotice(update.notice);
    } catch {
      setNotice("We couldn't update your cart. Try again in a moment.");
    }
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      startTransition(async () => {
        setOptimisticCount((prev) => prev + quantity);
        await applyChange(() => addToCart(variantId, quantity));
        setIsOpen(true);
      });
    },
    [setOptimisticCount, applyChange]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      startTransition(async () => {
        await applyChange(() => removeCartLine(lineId));
      });
    },
    [applyChange]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        return removeItem(lineId);
      }
      startTransition(async () => {
        await applyChange(() => updateCartLine(lineId, quantity));
      });
    },
    [removeItem, applyChange]
  );

  const itemCount = optimisticCount;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        notice,
        itemCount,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Convenience re-export of CartLine for consumers ─────────────────────────
export type { CartLine };
