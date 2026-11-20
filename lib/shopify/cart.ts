"use server";

import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";
import { shopifyFetch } from "./client";
import { deriveEncryptionKey } from "./session";
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINE_MUTATION,
  REMOVE_CART_LINE_MUTATION,
  GET_CART_QUERY,
} from "./queries";
import type { Cart, CartUpdate } from "./types";

const CART_COOKIE = "egn-cart-id";

interface CartLinesPayload {
  cart: Cart | null;
  userErrors: Array<{ message: string }>;
  warnings: Array<{ message: string }>;
}

// Shopify reports a stock limit as a userError (change refused) or a warning (change capped).
// Its message goes back as data: a server action's thrown message is hidden in production.
function toUpdate({ cart, userErrors, warnings }: CartLinesPayload): CartUpdate {
  return { cart, notice: userErrors[0]?.message ?? warnings[0]?.message ?? null };
}

async function getEncryptionKey(): Promise<Uint8Array> {
  return deriveEncryptionKey("egn-cart-encryption");
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

async function getCartCookie(): Promise<string | undefined> {
  const jar = await cookies();
  const cookie = jar.get(CART_COOKIE)?.value;
  if (!cookie) return undefined;

  try {
    const key = await getEncryptionKey();
    const { payload } = await jwtDecrypt(cookie, key);
    return payload.cartId as string | undefined;
  } catch {
    return undefined;
  }
}

async function setCartCookie(cartId: string): Promise<void> {
  const jar = await cookies();
  const key = await getEncryptionKey();

  const jwt = await new EncryptJWT({ cartId })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .encrypt(key);

  jar.set(CART_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // 30-day cart persistence
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

// ─── Cart actions ─────────────────────────────────────────────────────────────

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: Cart; userErrors: Array<{ message: string }> };
  }>({
    query: CREATE_CART_MUTATION,
    variables: { lines: [] },
    cache: "no-store",
  });

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  await setCartCookie(data.cartCreate.cart.id);
  return data.cartCreate.cart;
}

export async function getCart(): Promise<Cart | null> {
  const cartId = await getCartCookie();
  if (!cartId) return null;

  try {
    const data = await shopifyFetch<{ cart: Cart | null }>({
      query: GET_CART_QUERY,
      variables: { cartId },
      cache: "no-store",
    });
    return data.cart;
  } catch {
    return null;
  }
}

export async function addToCart(
  variantId: string,
  quantity: number
): Promise<CartUpdate> {
  let cartId = await getCartCookie();

  // Create cart on first add
  if (!cartId) {
    const newCart = await createCart();
    cartId = newCart.id;
  }

  const data = await shopifyFetch<{ cartLinesAdd: CartLinesPayload }>({
    query: ADD_TO_CART_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    cache: "no-store",
  });

  return toUpdate(data.cartLinesAdd);
}

export async function updateCartLine(
  lineId: string,
  quantity: number
): Promise<CartUpdate> {
  const cartId = await getCartCookie();
  if (!cartId) throw new Error("No cart found");

  const data = await shopifyFetch<{ cartLinesUpdate: CartLinesPayload }>({
    query: UPDATE_CART_LINE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: "no-store",
  });

  return toUpdate(data.cartLinesUpdate);
}

export async function removeCartLine(lineId: string): Promise<CartUpdate> {
  const cartId = await getCartCookie();
  if (!cartId) throw new Error("No cart found");

  const data = await shopifyFetch<{ cartLinesRemove: CartLinesPayload }>({
    query: REMOVE_CART_LINE_MUTATION,
    variables: { cartId, lineIds: [lineId] },
    cache: "no-store",
  });

  return toUpdate(data.cartLinesRemove);
}
