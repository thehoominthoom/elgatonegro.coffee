import { streamText, gateway, stepCountIs, convertToModelMessages } from "ai";
import { auth } from "@clerk/nextjs/server";
import {
  listProducts,
  getProduct,
  getInventoryLevels,
  listOrders,
  getOrder,
  searchCustomers,
  getSalesReport,
  updateProduct,
  updateVariantPrice,
  adjustInventory,
  createProduct,
} from "@/lib/shopify/ai-tools";

const SYSTEM_PROMPT = `You are an internal business assistant for El Gato Negro, a mobile coffee cart business in San Antonio, TX.

You help the owner manage their Shopify store by looking up products, orders, inventory, customers, and sales data.

Key business context:
- SKU categories that sync between Helcim POS and Shopify: WB (Whole Beans), MRC (Merchandise), APP (Apparel), CA (Coffee Accessories)
- POS-only categories (not in Shopify): D (Drinks), FD (Food), MSC (Miscellaneous), E (Equipment), MNE (Maintenance/Non-Essential)
- Shopify-only: DIG (Digital products)
- SKU format: BRAND-CATEGORY-PRODUCT (e.g. EGN-WB-001)
- Shopify is the source of truth for online inventory

Rules:
- Be concise and direct. This is an internal tool, not customer-facing.
- When showing multiple items, use markdown tables for readability.
- Format currency values consistently.
- If a query is ambiguous, ask for clarification rather than guessing.
- Write operations are available: you can update products, change prices, adjust inventory, and create new products.
- When making changes, confirm what you are about to do before executing the write operation. Summarize what changed after completing it.`;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: gateway("anthropic/claude-sonnet-4.6"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      listProducts,
      getProduct,
      getInventoryLevels,
      listOrders,
      getOrder,
      searchCustomers,
      getSalesReport,
      updateProduct,
      updateVariantPrice,
      adjustInventory,
      createProduct,
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
