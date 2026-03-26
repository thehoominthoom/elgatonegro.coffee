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
import type { Cart } from "./types";

const CART_COOKIE = "egn-cart-id";

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
    });
    return data.cart;
  } catch {
    return null;
  }
}

export async function addToCart(
  variantId: string,
  quantity: number
): Promise<Cart> {
  let cartId = await getCartCookie();

  // Create cart on first add
  if (!cartId) {
    const newCart = await createCart();
    cartId = newCart.id;
  }

  const data = await shopifyFetch<{
    cartLinesAdd: { cart: Cart; userErrors: Array<{ message: string }> };
  }>({
    query: ADD_TO_CART_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  lineId: string,
  quantity: number
): Promise<Cart> {
  const cartId = await getCartCookie();
  if (!cartId) throw new Error("No cart found");

  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: Cart; userErrors: Array<{ message: string }> };
  }>({
    query: UPDATE_CART_LINE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });

  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(lineId: string): Promise<Cart> {
  const cartId = await getCartCookie();
  if (!cartId) throw new Error("No cart found");

  const data = await shopifyFetch<{
    cartLinesRemove: { cart: Cart; userErrors: Array<{ message: string }> };
  }>({
    query: REMOVE_CART_LINE_MUTATION,
    variables: { cartId, lineIds: [lineId] },
  });

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return data.cartLinesRemove.cart;
}
