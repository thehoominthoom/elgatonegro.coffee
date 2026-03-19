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
import type { Cart, CartLine } from "@/lib/shopify/types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface CartContextValue {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
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
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      startTransition(async () => {
        setOptimisticCount((prev) => prev + quantity);
        const updated = await addToCart(variantId, quantity);
        setCart(updated);
        setIsOpen(true);
      });
    },
    [setOptimisticCount]
  );

  const removeItem = useCallback(async (lineId: string) => {
    startTransition(async () => {
      const updated = await removeCartLine(lineId);
      setCart(updated);
    });
  }, []);

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        return removeItem(lineId);
      }
      startTransition(async () => {
        const updated = await updateCartLine(lineId, quantity);
        setCart(updated);
      });
    },
    [removeItem]
  );

  const itemCount = optimisticCount;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
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
