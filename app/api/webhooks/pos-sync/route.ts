import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { adminFetch } from "@/lib/shopify/admin";
import {
  ADMIN_VARIANT_BY_SKU_QUERY,
  ADMIN_INVENTORY_ADJUST_MUTATION,
} from "@/lib/shopify/admin-queries";

// ─── Config ─────────────────────────────────────────────────────────────────

const HELCIM_API_TOKEN = process.env.HELCIM_API_TOKEN!;
const HELCIM_WEBHOOK_VERIFIER_TOKEN =
  process.env.HELCIM_WEBHOOK_VERIFIER_TOKEN!;
const SHOPIFY_LOCATION_ID = process.env.SHOPIFY_LOCATION_ID!;

const HELCIM_API_BASE = "https://api.helcim.com/v2";

/** SKU category codes that should sync to Shopify inventory. */
const SYNC_CATEGORIES = new Set(["WB", "MRC", "APP", "CA"]);

// ─── Duplicate detection (in-memory, resets on cold start) ──────────────────

const processedWebhookIds = new Set<string>();

// ─── Helcim API types ───────────────────────────────────────────────────────

interface HelcimTransaction {
  status: string;
  type: string;
  invoiceNumber: string;
}

interface HelcimLineItem {
  sku: string;
  description: string;
  quantity: number;
  price: number;
}

interface HelcimInvoice {
  lineItems: HelcimLineItem[];
}

// ─── Shopify response types ─────────────────────────────────────────────────

interface VariantBySkuResponse {
  productVariants: {
    edges: Array<{
      node: {
        id: string;
        sku: string;
        inventoryItem: {
          id: string;
        };
      };
    }>;
  };
}

interface InventoryAdjustResponse {
  inventoryAdjustQuantities: {
    inventoryAdjustmentGroup: {
      reason: string;
      changes: Array<{
        name: string;
        delta: number;
        quantityAfterChange: number;
      }>;
    } | null;
    userErrors: Array<{
      field: string;
      message: string;
    }>;
  };
}

// ─── Signature verification ─────────────────────────────────────────────────

function verifyWebhookSignature(
  body: string,
  signatureHeader: string,
  timestampHeader: string,
  idHeader: string
): boolean {
  const signedContent = `${idHeader}.${timestampHeader}.${body}`;
  const secret = Buffer.from(HELCIM_WEBHOOK_VERIFIER_TOKEN, "base64");
  const computed = createHmac("sha256", secret)
    .update(signedContent)
    .digest("base64");

  // Header may contain multiple space-delimited signatures with version prefixes
  // e.g. "v1,abc123 v2,def456"
  const signatures = signatureHeader.split(" ");
  return signatures.some((sig) => {
    const value = sig.includes(",") ? sig.split(",")[1] : sig;
    return value === computed;
  });
}

// ─── SKU parsing ────────────────────────────────────────────────────────────

/**
 * Extract the category code from a three-part SKU: BRAND-CATEGORY-PRODUCT.
 * Returns null if the SKU doesn't match the expected format.
 */
function getSkuCategory(sku: string): string | null {
  const parts = sku.split("-");
  if (parts.length < 3) return null;
  return parts[1];
}

// ─── Helcim API helpers ─────────────────────────────────────────────────────

async function getTransaction(
  transactionId: string
): Promise<HelcimTransaction> {
  const res = await fetch(
    `${HELCIM_API_BASE}/card-transactions/${transactionId}`,
    {
      headers: { "api-token": HELCIM_API_TOKEN },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Helcim GET transaction ${transactionId} failed: ${res.status} — ${text}`
    );
  }

  return res.json() as Promise<HelcimTransaction>;
}

async function getInvoiceLineItems(
  invoiceNumber: string
): Promise<HelcimLineItem[]> {
  // The transaction returns invoiceNumber as a string (e.g. "INV8792466").
  // Use the list endpoint to resolve it.
  const res = await fetch(
    `${HELCIM_API_BASE}/invoices?invoiceNumber=${encodeURIComponent(invoiceNumber)}`,
    {
      headers: { "api-token": HELCIM_API_TOKEN },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Helcim GET invoice ${invoiceNumber} failed: ${res.status} — ${text}`
    );
  }

  const data = await res.json();

  // The list endpoint returns an array — take the first match
  const invoices: HelcimInvoice[] = Array.isArray(data) ? data : [data];
  if (invoices.length === 0) {
    throw new Error(
      `Helcim invoice ${invoiceNumber} not found in list response`
    );
  }

  return invoices[0].lineItems ?? [];
}

// ─── Shopify helpers ────────────────────────────────────────────────────────

async function lookupVariantBySku(
  sku: string
): Promise<{ variantId: string; inventoryItemId: string } | null> {
  const data = await adminFetch<VariantBySkuResponse>({
    query: ADMIN_VARIANT_BY_SKU_QUERY,
    variables: { query: `sku:${sku}` },
  });

  const edge = data.productVariants.edges[0];
  if (!edge) return null;

  return {
    variantId: edge.node.id,
    inventoryItemId: edge.node.inventoryItem.id,
  };
}

async function decrementInventory(
  inventoryItemId: string,
  quantity: number,
  sku: string
): Promise<void> {
  const data = await adminFetch<InventoryAdjustResponse>({
    query: ADMIN_INVENTORY_ADJUST_MUTATION,
    variables: {
      input: {
        reason: "correction",
        name: "available",
        changes: [
          {
            delta: -quantity,
            inventoryItemId,
            locationId: SHOPIFY_LOCATION_ID,
          },
        ],
      },
    },
  });

  const errors = data.inventoryAdjustQuantities.userErrors;
  if (errors.length > 0) {
    console.error(
      `[helcim-webhook] Shopify inventory error for SKU ${sku}:`,
      errors
    );
    throw new Error(
      `Inventory adjustment failed for ${sku}: ${errors.map((e) => e.message).join(", ")}`
    );
  }

  const changes =
    data.inventoryAdjustQuantities.inventoryAdjustmentGroup?.changes ?? [];
  for (const change of changes) {
    console.log(
      `[helcim-webhook] Inventory adjusted — SKU: ${sku}, delta: ${change.delta}, remaining: ${change.quantityAfterChange}`
    );
  }
}

// ─── Route handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const webhookId = request.headers.get("webhook-id");
  const webhookTimestamp = request.headers.get("webhook-timestamp");
  const webhookSignature = request.headers.get("webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    console.warn("[helcim-webhook] Missing required webhook headers");
    return NextResponse.json(
      { error: "Missing webhook headers" },
      { status: 401 }
    );
  }

  // ── Read body once for both verification and parsing ───────────────────
  const body = await request.text();

  if (
    !verifyWebhookSignature(body, webhookSignature, webhookTimestamp, webhookId)
  ) {
    console.warn("[helcim-webhook] Invalid signature — rejecting");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── Parse payload ─────────────────────────────────────────────────────
  let payload: { id: string; type: string };
  try {
    payload = JSON.parse(body);
  } catch {
    console.error("[helcim-webhook] Failed to parse webhook body");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log(
    `[helcim-webhook] Received event — type: ${payload.type}, id: ${payload.id}`
  );

  // Only process card transactions
  if (payload.type !== "cardTransaction") {
    console.log(
      `[helcim-webhook] Ignoring non-cardTransaction event: ${payload.type}`
    );
    return NextResponse.json({ received: true });
  }

  // ── Duplicate detection ───────────────────────────────────────────────
  if (processedWebhookIds.has(webhookId)) {
    console.warn(
      `[helcim-webhook] Duplicate webhook detected — id: ${webhookId}, transaction: ${payload.id}`
    );
    return NextResponse.json({ received: true });
  }
  processedWebhookIds.add(webhookId);

  // Cap the set size to prevent unbounded memory growth
  if (processedWebhookIds.size > 10000) {
    const first = processedWebhookIds.values().next().value;
    if (first) processedWebhookIds.delete(first);
  }

  // ── Fetch transaction details ─────────────────────────────────────────
  try {
    const transaction = await getTransaction(payload.id);

    console.log(
      `[helcim-webhook] Transaction ${payload.id} — status: ${transaction.status}, type: ${transaction.type}, invoice: ${transaction.invoiceNumber}`
    );

    // Only process approved purchases/sales
    const status = transaction.status.toUpperCase();
    const type = transaction.type.toLowerCase();

    if (status !== "APPROVED") {
      console.log(
        `[helcim-webhook] Skipping non-approved transaction: ${status}`
      );
      return NextResponse.json({ received: true });
    }

    if (type !== "purchase" && type !== "sale") {
      console.log(
        `[helcim-webhook] Skipping non-purchase/sale transaction type: ${type}`
      );
      return NextResponse.json({ received: true });
    }

    // ── Fetch invoice line items ──────────────────────────────────────
    const lineItems = await getInvoiceLineItems(transaction.invoiceNumber);

    console.log(
      `[helcim-webhook] Invoice ${transaction.invoiceNumber} has ${lineItems.length} line item(s)`
    );

    // ── Process each line item ────────────────────────────────────────
    for (const item of lineItems) {
      const sku = item.sku?.trim();
      if (!sku) {
        console.log(
          `[helcim-webhook] Skipping line item with no SKU: "${item.description}"`
        );
        continue;
      }

      const category = getSkuCategory(sku);
      if (!category) {
        console.log(
          `[helcim-webhook] Skipping SKU with unexpected format: ${sku}`
        );
        continue;
      }

      if (!SYNC_CATEGORIES.has(category)) {
        console.log(
          `[helcim-webhook] Skipping non-sync category — SKU: ${sku}, category: ${category}`
        );
        continue;
      }

      // Category is sync-eligible — look up in Shopify
      try {
        const variant = await lookupVariantBySku(sku);

        if (!variant) {
          console.warn(
            `[helcim-webhook] SKU not found in Shopify — skipping: ${sku}`
          );
          continue;
        }

        console.log(
          `[helcim-webhook] Syncing SKU: ${sku}, quantity: ${item.quantity}, inventoryItemId: ${variant.inventoryItemId}`
        );

        await decrementInventory(
          variant.inventoryItemId,
          item.quantity,
          sku
        );

        console.log(
          `[helcim-webhook] Successfully synced SKU: ${sku} (decremented by ${item.quantity})`
        );
      } catch (error) {
        // Log and continue — don't let one failed item block the rest
        console.error(
          `[helcim-webhook] Failed to sync SKU ${sku}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  } catch (error) {
    // Log the error but still return 200 to prevent Helcim from retrying endlessly
    console.error(
      `[helcim-webhook] Error processing transaction ${payload.id}:`,
      error instanceof Error ? error.message : error
    );
  }

  return NextResponse.json({ received: true });
}
