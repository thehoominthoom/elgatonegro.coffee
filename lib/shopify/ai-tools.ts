// ─── Shopify Admin API tools for AI assistant ────────────────────────────────
//
// Read-only tool definitions that wrap adminFetch for use with Vercel AI SDK.
// Each tool queries the Shopify GraphQL Admin API and returns structured data.

import { tool } from "ai";
import { z } from "zod";
import { adminFetch } from "./admin";

const SHOPIFY_LOCATION_ID = process.env.SHOPIFY_LOCATION_ID!;

// ─── GraphQL fragments ──────────────────────────────────────────────────────

const MONEY_FIELDS = `amount currencyCode`;

// ─── Tools ───────────────────────────────────────────────────────────────────

export const listProducts = tool({
  description:
    "Search or browse products in the Shopify store. Supports filtering by title, status, and product type.",
  inputSchema: z.object({
    search: z.string().optional().describe("Search by product title"),
    status: z
      .enum(["ACTIVE", "DRAFT", "ARCHIVED"])
      .optional()
      .describe("Filter by product status"),
    productType: z.string().optional().describe("Filter by product type"),
    first: z
      .number()
      .min(1)
      .max(50)
      .optional()
      .default(25)
      .describe("Number of products to return (max 50)"),
  }),
  execute: async ({ search, status, productType, first }) => {
    try {
      const queryParts: string[] = [];
      if (search) queryParts.push(`title:*${search}*`);
      if (status) queryParts.push(`status:${status}`);
      if (productType) queryParts.push(`product_type:${productType}`);
      const queryFilter = queryParts.length > 0 ? queryParts.join(" AND ") : null;

      const data = await adminFetch<{
        products: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              status: string;
              handle: string;
              productType: string;
              totalInventory: number;
              variants: {
                edges: Array<{
                  node: { id: string };
                }>;
              };
              priceRangeV2: {
                minVariantPrice: { amount: string; currencyCode: string };
                maxVariantPrice: { amount: string; currencyCode: string };
              };
            };
          }>;
        };
      }>({
        query: `
          query ListProducts($first: Int!, $query: String) {
            products(first: $first, query: $query, sortKey: TITLE) {
              edges {
                node {
                  id
                  title
                  status
                  handle
                  productType
                  totalInventory
                  variants(first: 1) {
                    edges { node { id } }
                  }
                  priceRangeV2 {
                    minVariantPrice { ${MONEY_FIELDS} }
                    maxVariantPrice { ${MONEY_FIELDS} }
                  }
                }
              }
            }
          }
        `,
        variables: { first, query: queryFilter },
      });

      return data.products.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        status: node.status,
        handle: node.handle,
        productType: node.productType,
        totalInventory: node.totalInventory,
        variantsCount: node.variants.edges.length,
        priceRange: {
          min: `$${node.priceRangeV2.minVariantPrice.amount}`,
          max: `$${node.priceRangeV2.maxVariantPrice.amount}`,
        },
      }));
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to list products" };
    }
  },
});

export const getProduct = tool({
  description:
    "Get full details for a single product by its Shopify ID or handle. Returns title, description, status, variants with prices and inventory, images, tags, and more.",
  inputSchema: z.object({
    id: z
      .string()
      .optional()
      .describe("Shopify product GID (e.g. gid://shopify/Product/123)"),
    handle: z.string().optional().describe("Product handle (URL slug)"),
  }),
  execute: async ({ id, handle }) => {
    try {
      if (!id && !handle) {
        return { error: "Provide either a product ID or handle" };
      }

      // If handle provided, look up by handle
      if (handle && !id) {
        const lookup = await adminFetch<{
          productByHandle: { id: string } | null;
        }>({
          query: `
            query ProductByHandle($handle: String!) {
              productByHandle(handle: $handle) { id }
            }
          `,
          variables: { handle },
        });
        if (!lookup.productByHandle) {
          return { error: `No product found with handle "${handle}"` };
        }
        id = lookup.productByHandle.id;
      }

      const data = await adminFetch<{
        product: {
          id: string;
          title: string;
          descriptionHtml: string;
          status: string;
          handle: string;
          productType: string;
          vendor: string;
          tags: string[];
          totalInventory: number;
          variants: {
            edges: Array<{
              node: {
                id: string;
                title: string;
                sku: string;
                price: string;
                inventoryQuantity: number;
                selectedOptions: Array<{ name: string; value: string }>;
              };
            }>;
          };
          images: {
            edges: Array<{
              node: { url: string; altText: string | null };
            }>;
          };
        } | null;
      }>({
        query: `
          query GetProduct($id: ID!) {
            product(id: $id) {
              id
              title
              descriptionHtml
              status
              handle
              productType
              vendor
              tags
              totalInventory
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                    inventoryQuantity
                    selectedOptions { name value }
                  }
                }
              }
              images(first: 10) {
                edges {
                  node { url altText }
                }
              }
            }
          }
        `,
        variables: { id },
      });

      if (!data.product) {
        return { error: `Product not found: ${id}` };
      }

      const p = data.product;
      return {
        id: p.id,
        title: p.title,
        description: p.descriptionHtml,
        status: p.status,
        handle: p.handle,
        productType: p.productType,
        vendor: p.vendor,
        tags: p.tags,
        totalInventory: p.totalInventory,
        variants: p.variants.edges.map(({ node }) => ({
          id: node.id,
          title: node.title,
          sku: node.sku,
          price: `$${node.price}`,
          inventoryQuantity: node.inventoryQuantity,
          options: node.selectedOptions,
        })),
        images: p.images.edges.map(({ node }) => ({
          url: node.url,
          alt: node.altText,
        })),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to get product" };
    }
  },
});

export const getInventoryLevels = tool({
  description:
    "Get current inventory levels for a product or specific variant at the configured location.",
  inputSchema: z.object({
    productId: z
      .string()
      .optional()
      .describe("Shopify product GID to get inventory for all variants"),
    variantId: z
      .string()
      .optional()
      .describe("Shopify variant GID to get inventory for a specific variant"),
  }),
  execute: async ({ productId, variantId }) => {
    try {
      if (!productId && !variantId) {
        return { error: "Provide either a productId or variantId" };
      }

      if (variantId) {
        const data = await adminFetch<{
          productVariant: {
            id: string;
            title: string;
            sku: string;
            inventoryItem: {
              id: string;
              inventoryLevel: {
                quantities: Array<{ name: string; quantity: number }>;
              } | null;
            };
          } | null;
        }>({
          query: `
            query VariantInventory($id: ID!, $locationId: ID!) {
              productVariant(id: $id) {
                id
                title
                sku
                inventoryItem {
                  id
                  inventoryLevel(locationId: $locationId) {
                    quantities(names: ["available", "committed", "on_hand"]) {
                      name
                      quantity
                    }
                  }
                }
              }
            }
          `,
          variables: { id: variantId, locationId: SHOPIFY_LOCATION_ID },
        });

        if (!data.productVariant) {
          return { error: `Variant not found: ${variantId}` };
        }

        const v = data.productVariant;
        return {
          variant: v.title,
          sku: v.sku,
          inventory: v.inventoryItem.inventoryLevel?.quantities ?? [],
        };
      }

      // Product-level: get all variants
      const data = await adminFetch<{
        product: {
          title: string;
          variants: {
            edges: Array<{
              node: {
                id: string;
                title: string;
                sku: string;
                inventoryQuantity: number;
              };
            }>;
          };
        } | null;
      }>({
        query: `
          query ProductInventory($id: ID!) {
            product(id: $id) {
              title
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    sku
                    inventoryQuantity
                  }
                }
              }
            }
          }
        `,
        variables: { id: productId },
      });

      if (!data.product) {
        return { error: `Product not found: ${productId}` };
      }

      return {
        product: data.product.title,
        variants: data.product.variants.edges.map(({ node }) => ({
          title: node.title,
          sku: node.sku,
          available: node.inventoryQuantity,
        })),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to get inventory levels",
      };
    }
  },
});

export const listOrders = tool({
  description:
    "List recent orders with optional status filter. Returns order number, date, customer, total, fulfillment status, and line items summary.",
  inputSchema: z.object({
    status: z
      .enum(["unfulfilled", "fulfilled", "any"])
      .optional()
      .default("any")
      .describe("Filter by fulfillment status"),
    first: z
      .number()
      .min(1)
      .max(50)
      .optional()
      .default(10)
      .describe("Number of orders to return"),
  }),
  execute: async ({ status, first }) => {
    try {
      let queryFilter: string | null = null;
      if (status === "unfulfilled") queryFilter = "fulfillment_status:unfulfilled";
      else if (status === "fulfilled") queryFilter = "fulfillment_status:fulfilled";

      const data = await adminFetch<{
        orders: {
          edges: Array<{
            node: {
              id: string;
              name: string;
              createdAt: string;
              displayFulfillmentStatus: string;
              displayFinancialStatus: string;
              totalPriceSet: {
                shopMoney: { amount: string; currencyCode: string };
              };
              customer: { displayName: string; email: string } | null;
              lineItems: {
                edges: Array<{
                  node: { title: string; quantity: number };
                }>;
              };
            };
          }>;
        };
      }>({
        query: `
          query ListOrders($first: Int!, $query: String) {
            orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
              edges {
                node {
                  id
                  name
                  createdAt
                  displayFulfillmentStatus
                  displayFinancialStatus
                  totalPriceSet {
                    shopMoney { ${MONEY_FIELDS} }
                  }
                  customer { displayName email }
                  lineItems(first: 5) {
                    edges { node { title quantity } }
                  }
                }
              }
            }
          }
        `,
        variables: { first, query: queryFilter },
      });

      return data.orders.edges.map(({ node }) => ({
        id: node.id,
        orderNumber: node.name,
        date: node.createdAt,
        customer: node.customer
          ? `${node.customer.displayName} (${node.customer.email})`
          : "Guest",
        total: `$${node.totalPriceSet.shopMoney.amount}`,
        fulfillment: node.displayFulfillmentStatus,
        payment: node.displayFinancialStatus,
        items: node.lineItems.edges.map(({ node: li }) => `${li.quantity}x ${li.title}`),
      }));
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to list orders" };
    }
  },
});

export const getOrder = tool({
  description:
    "Get full details for a specific order by order number (e.g. #1001) or Shopify GID.",
  inputSchema: z.object({
    orderNumber: z
      .string()
      .optional()
      .describe("Order number like #1001 or 1001"),
    id: z.string().optional().describe("Shopify order GID"),
  }),
  execute: async ({ orderNumber, id }) => {
    try {
      if (!orderNumber && !id) {
        return { error: "Provide either an order number or order ID" };
      }

      // Look up by order number if no ID
      if (orderNumber && !id) {
        const num = orderNumber.replace("#", "");
        const lookup = await adminFetch<{
          orders: {
            edges: Array<{ node: { id: string } }>;
          };
        }>({
          query: `
            query OrderByNumber($query: String!) {
              orders(first: 1, query: $query) {
                edges { node { id } }
              }
            }
          `,
          variables: { query: `name:#${num}` },
        });
        const edge = lookup.orders.edges[0];
        if (!edge) {
          return { error: `No order found with number ${orderNumber}` };
        }
        id = edge.node.id;
      }

      const data = await adminFetch<{
        order: {
          id: string;
          name: string;
          createdAt: string;
          displayFulfillmentStatus: string;
          displayFinancialStatus: string;
          totalPriceSet: {
            shopMoney: { amount: string; currencyCode: string };
          };
          subtotalPriceSet: {
            shopMoney: { amount: string; currencyCode: string };
          };
          totalShippingPriceSet: {
            shopMoney: { amount: string; currencyCode: string };
          };
          totalTaxSet: {
            shopMoney: { amount: string; currencyCode: string };
          };
          customer: {
            displayName: string;
            email: string;
          } | null;
          shippingAddress: {
            formatted: string[];
          } | null;
          lineItems: {
            edges: Array<{
              node: {
                title: string;
                quantity: number;
                sku: string;
                originalUnitPriceSet: {
                  shopMoney: { amount: string };
                };
              };
            }>;
          };
          fulfillments: Array<{
            status: string;
            trackingInfo: Array<{
              number: string;
              url: string;
            }>;
          }>;
        } | null;
      }>({
        query: `
          query GetOrder($id: ID!) {
            order(id: $id) {
              id
              name
              createdAt
              displayFulfillmentStatus
              displayFinancialStatus
              totalPriceSet { shopMoney { ${MONEY_FIELDS} } }
              subtotalPriceSet { shopMoney { ${MONEY_FIELDS} } }
              totalShippingPriceSet { shopMoney { ${MONEY_FIELDS} } }
              totalTaxSet { shopMoney { ${MONEY_FIELDS} } }
              customer { displayName email }
              shippingAddress { formatted }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    sku
                    originalUnitPriceSet { shopMoney { amount } }
                  }
                }
              }
              fulfillments {
                status
                trackingInfo { number url }
              }
            }
          }
        `,
        variables: { id },
      });

      if (!data.order) {
        return { error: `Order not found: ${id}` };
      }

      const o = data.order;
      return {
        id: o.id,
        orderNumber: o.name,
        date: o.createdAt,
        fulfillment: o.displayFulfillmentStatus,
        payment: o.displayFinancialStatus,
        customer: o.customer
          ? { name: o.customer.displayName, email: o.customer.email }
          : null,
        shippingAddress: o.shippingAddress?.formatted.join(", ") ?? null,
        lineItems: o.lineItems.edges.map(({ node }) => ({
          title: node.title,
          quantity: node.quantity,
          sku: node.sku,
          unitPrice: `$${node.originalUnitPriceSet.shopMoney.amount}`,
        })),
        subtotal: `$${o.subtotalPriceSet.shopMoney.amount}`,
        shipping: `$${o.totalShippingPriceSet.shopMoney.amount}`,
        tax: `$${o.totalTaxSet.shopMoney.amount}`,
        total: `$${o.totalPriceSet.shopMoney.amount}`,
        tracking: o.fulfillments.flatMap((f) =>
          f.trackingInfo.map((t) => ({
            status: f.status,
            number: t.number,
            url: t.url,
          })),
        ),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to get order" };
    }
  },
});

export const searchCustomers = tool({
  description: "Search customers by name or email.",
  inputSchema: z.object({
    query: z.string().describe("Search term — name or email"),
    first: z
      .number()
      .min(1)
      .max(25)
      .optional()
      .default(10)
      .describe("Number of results"),
  }),
  execute: async ({ query, first }) => {
    try {
      const data = await adminFetch<{
        customers: {
          edges: Array<{
            node: {
              id: string;
              displayName: string;
              email: string;
              numberOfOrders: string;
              amountSpent: { amount: string; currencyCode: string };
              lastOrder: { createdAt: string } | null;
            };
          }>;
        };
      }>({
        query: `
          query SearchCustomers($first: Int!, $query: String!) {
            customers(first: $first, query: $query) {
              edges {
                node {
                  id
                  displayName
                  email
                  numberOfOrders
                  amountSpent { ${MONEY_FIELDS} }
                  lastOrder { createdAt }
                }
              }
            }
          }
        `,
        variables: { first, query },
      });

      return data.customers.edges.map(({ node }) => ({
        id: node.id,
        name: node.displayName,
        email: node.email,
        totalOrders: node.numberOfOrders,
        totalSpent: `$${node.amountSpent.amount}`,
        lastOrderDate: node.lastOrder?.createdAt ?? null,
      }));
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to search customers" };
    }
  },
});

export const getSalesReport = tool({
  description:
    "Get a sales summary for a given period: total revenue, order count, average order value, and top products by quantity.",
  inputSchema: z.object({
    period: z
      .enum(["today", "this_week", "this_month"])
      .describe("Time period for the report"),
  }),
  execute: async ({ period }) => {
    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "this_week": {
          const day = now.getDay();
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
          break;
        }
        case "this_month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      const queryFilter = `created_at:>='${startDate.toISOString()}'`;

      const data = await adminFetch<{
        orders: {
          edges: Array<{
            node: {
              totalPriceSet: {
                shopMoney: { amount: string };
              };
              lineItems: {
                edges: Array<{
                  node: { title: string; quantity: number };
                }>;
              };
            };
          }>;
        };
      }>({
        query: `
          query SalesReport($query: String!) {
            orders(first: 250, query: $query, sortKey: CREATED_AT) {
              edges {
                node {
                  totalPriceSet { shopMoney { amount } }
                  lineItems(first: 50) {
                    edges { node { title quantity } }
                  }
                }
              }
            }
          }
        `,
        variables: { query: queryFilter },
      });

      const orders = data.orders.edges.map(({ node }) => node);
      const totalRevenue = orders.reduce(
        (sum, o) => sum + parseFloat(o.totalPriceSet.shopMoney.amount),
        0,
      );
      const orderCount = orders.length;
      const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

      // Aggregate top products
      const productCounts = new Map<string, number>();
      for (const order of orders) {
        for (const { node: li } of order.lineItems.edges) {
          productCounts.set(li.title, (productCounts.get(li.title) ?? 0) + li.quantity);
        }
      }
      const topProducts = [...productCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([title, quantity]) => ({ title, quantity }));

      return {
        period,
        startDate: startDate.toISOString(),
        totalRevenue: `$${totalRevenue.toFixed(2)}`,
        orderCount,
        averageOrderValue: `$${averageOrderValue.toFixed(2)}`,
        topProducts,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to generate sales report" };
    }
  },
});
