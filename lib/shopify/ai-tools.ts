// ─── Shopify Admin API tools for AI assistant ────────────────────────────────
//
// Tool definitions that wrap adminFetch for use with Vercel AI SDK.
// Each tool queries or mutates the Shopify GraphQL Admin API and returns structured data.

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

export const searchCategories = tool({
  description:
    "Search Shopify's standard product taxonomy to find category IDs. Use this before setting a product's category with updateProduct.",
  inputSchema: z.object({
    query: z
      .string()
      .describe('Search term for taxonomy categories (e.g. "coffee", "apparel", "t-shirt")'),
  }),
  execute: async ({ query }) => {
    try {
      const data = await adminFetch<{
        taxonomy: {
          categories: {
            edges: Array<{
              node: {
                id: string;
                name: string;
                fullName: string;
                ancestorIds: string[];
                isLeaf: boolean;
              };
            }>;
          };
        };
      }>({
        query: `
          query TaxonomyCategories($query: String!) {
            taxonomy {
              categories(first: 20, query: $query) {
                edges {
                  node {
                    id
                    name
                    fullName
                    ancestorIds
                    isLeaf
                  }
                }
              }
            }
          }
        `,
        variables: { query },
      });

      return data.taxonomy.categories.edges.map(({ node }) => ({
        id: node.id,
        name: node.name,
        fullName: node.fullName,
        ancestorIds: node.ancestorIds,
        isLeaf: node.isLeaf,
      }));
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to search categories" };
    }
  },
});

// ─── Write Tools ──────────────────────────────────────────────────────────────

export const updateProduct = tool({
  description:
    "Update a product's title, handle (URL slug), description, status, tags, vendor, product type, or taxonomy category. Only the fields you provide will be changed.",
  inputSchema: z.object({
    productId: z.string().describe("Shopify product GID (e.g. gid://shopify/Product/123)"),
    title: z.string().optional().describe("New product title"),
    handle: z.string().optional().describe("New URL slug/handle (e.g. 'moongoat-sareni-decaf')"),
    descriptionHtml: z.string().optional().describe("New product description (HTML)"),
    status: z
      .enum(["ACTIVE", "DRAFT", "ARCHIVED"])
      .optional()
      .describe("New product status"),
    tags: z.array(z.string()).optional().describe("Replace all tags with this list"),
    productType: z.string().optional().describe("New product type"),
    vendor: z.string().optional().describe("New product vendor"),
    productCategory: z
      .string()
      .optional()
      .describe(
        "Shopify taxonomy category GID (e.g. gid://shopify/TaxonomyCategory/aa-1-2-3). Use searchCategories to find the right ID.",
      ),
  }),
  execute: async ({
    productId,
    title,
    handle,
    descriptionHtml,
    status,
    tags,
    productType,
    vendor,
    productCategory,
  }) => {
    try {
      const input: Record<string, unknown> = { id: productId };
      if (title !== undefined) input.title = title;
      if (handle !== undefined) input.handle = handle;
      if (descriptionHtml !== undefined) input.descriptionHtml = descriptionHtml;
      if (status !== undefined) input.status = status;
      if (tags !== undefined) input.tags = tags;
      if (productType !== undefined) input.productType = productType;
      if (vendor !== undefined) input.vendor = vendor;
      if (productCategory !== undefined)
        input.productCategory = { productTaxonomyNodeId: productCategory };

      const data = await adminFetch<{
        productUpdate: {
          product: {
            id: string;
            title: string;
            status: string;
            handle: string;
            productType: string;
            vendor: string;
            tags: string[];
          } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation ProductUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
                title
                status
                handle
                productType
                vendor
                tags
              }
              userErrors { field message }
            }
          }
        `,
        variables: { input },
      });

      const { product, userErrors } = data.productUpdate;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }
      if (!product) {
        return { error: "Product update returned no product" };
      }

      return {
        id: product.id,
        title: product.title,
        status: product.status,
        handle: product.handle,
        productType: product.productType,
        vendor: product.vendor,
        tags: product.tags,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to update product" };
    }
  },
});

export const updateVariant = tool({
  description:
    "Update a product variant's price, compare-at price, weight, or weight unit. Requires both the product GID and variant GID. Only the fields you provide will be changed.",
  inputSchema: z.object({
    productId: z.string().describe("Shopify product GID (e.g. gid://shopify/Product/123)"),
    variantId: z.string().describe("Shopify variant GID (e.g. gid://shopify/ProductVariant/123)"),
    price: z.string().optional().describe('New price as a decimal string (e.g. "19.99")'),
    compareAtPrice: z
      .string()
      .optional()
      .describe('Compare-at price as a decimal string (e.g. "24.99")'),
    weight: z.number().optional().describe("Weight value"),
    weightUnit: z
      .enum(["GRAMS", "KILOGRAMS", "OUNCES", "POUNDS"])
      .optional()
      .describe("Weight unit"),
  }),
  execute: async ({ productId, variantId, price, compareAtPrice, weight, weightUnit }) => {
    try {
      const variant: Record<string, unknown> = { id: variantId };
      if (price !== undefined) variant.price = price;
      if (compareAtPrice !== undefined) variant.compareAtPrice = compareAtPrice;
      if (weight !== undefined) variant.weight = weight;
      if (weightUnit !== undefined) variant.weightUnit = weightUnit;

      const data = await adminFetch<{
        productVariantsBulkUpdate: {
          productVariants: Array<{
            id: string;
            title: string;
            price: string;
            compareAtPrice: string | null;
            weight: number | null;
            weightUnit: string;
          }>;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
            productVariantsBulkUpdate(productId: $productId, variants: $variants) {
              productVariants {
                id
                title
                price
                compareAtPrice
                weight
                weightUnit
              }
              userErrors { field message }
            }
          }
        `,
        variables: { productId, variants: [variant] },
      });

      const { productVariants, userErrors } = data.productVariantsBulkUpdate;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }
      const updated = productVariants[0];
      if (!updated) {
        return { error: "Variant update returned no variant" };
      }

      return {
        id: updated.id,
        title: updated.title,
        price: `$${updated.price}`,
        compareAtPrice: updated.compareAtPrice
          ? `$${updated.compareAtPrice}`
          : null,
        weight: updated.weight,
        weightUnit: updated.weightUnit,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to update variant" };
    }
  },
});

export const adjustInventory = tool({
  description:
    "Adjust inventory quantity for an inventory item at the configured location. Use positive delta to add stock, negative to subtract.",
  inputSchema: z.object({
    inventoryItemId: z
      .string()
      .describe("Shopify inventory item GID (e.g. gid://shopify/InventoryItem/123)"),
    delta: z.number().int().describe("Quantity change — positive to add, negative to subtract"),
    reason: z.string().optional().describe("Reason for the adjustment (e.g. 'Restock', 'Damaged')"),
  }),
  execute: async ({ inventoryItemId, delta, reason }) => {
    try {
      const data = await adminFetch<{
        inventoryAdjustQuantities: {
          inventoryAdjustmentGroup: {
            changes: Array<{
              name: string;
              delta: number;
              quantityAfterChange: number;
            }>;
          } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation AdjustInventory($input: InventoryAdjustQuantitiesInput!) {
            inventoryAdjustQuantities(input: $input) {
              inventoryAdjustmentGroup {
                changes {
                  name
                  delta
                  quantityAfterChange
                }
              }
              userErrors { field message }
            }
          }
        `,
        variables: {
          input: {
            name: "available",
            reason: reason ?? "correction",
            changes: [
              {
                inventoryItemId,
                locationId: SHOPIFY_LOCATION_ID,
                delta,
              },
            ],
          },
        },
      });

      const { inventoryAdjustmentGroup, userErrors } = data.inventoryAdjustQuantities;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }

      const change = inventoryAdjustmentGroup?.changes[0];
      return {
        adjusted: true,
        delta: change?.delta ?? delta,
        quantityAfterChange: change?.quantityAfterChange ?? "unknown",
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to adjust inventory" };
    }
  },
});

export const createProduct = tool({
  description:
    "Create a new product in the Shopify store. Defaults to DRAFT status and El Gato Negro as vendor.",
  inputSchema: z.object({
    title: z.string().describe("Product title"),
    descriptionHtml: z.string().optional().describe("Product description (HTML)"),
    productType: z.string().optional().describe("Product type (e.g. Coffee, Merchandise)"),
    vendor: z.string().optional().default("El Gato Negro").describe("Product vendor"),
    status: z
      .enum(["ACTIVE", "DRAFT", "ARCHIVED"])
      .optional()
      .default("DRAFT")
      .describe("Product status"),
    tags: z.array(z.string()).optional().describe("Product tags"),
    price: z.string().optional().describe('Price for the default variant (e.g. "15.00")'),
    sku: z.string().optional().describe("SKU for the default variant"),
  }),
  execute: async ({ title, descriptionHtml, productType, vendor, status, tags, price, sku }) => {
    try {
      const input: Record<string, unknown> = { title, vendor, status };
      if (descriptionHtml) input.descriptionHtml = descriptionHtml;
      if (productType) input.productType = productType;
      if (tags) input.tags = tags;

      // Add default variant with price/sku if provided
      if (price || sku) {
        const variant: Record<string, string> = {};
        if (price) variant.price = price;
        if (sku) variant.sku = sku;
        input.variants = [variant];
      }

      const data = await adminFetch<{
        productCreate: {
          product: {
            id: string;
            title: string;
            handle: string;
            status: string;
          } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation CreateProduct($input: ProductInput!) {
            productCreate(input: $input) {
              product {
                id
                title
                handle
                status
              }
              userErrors { field message }
            }
          }
        `,
        variables: { input },
      });

      const { product, userErrors } = data.productCreate;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }
      if (!product) {
        return { error: "Product creation returned no product" };
      }

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        status: product.status,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to create product" };
    }
  },
});

// ─── Product Images ──────────────────────────────────────────────────────────

export const addProductImage = tool({
  description:
    "Add an image to a product by providing an external URL. Optionally set alt text.",
  inputSchema: z.object({
    productId: z.string().describe("Shopify product GID (e.g. gid://shopify/Product/123)"),
    url: z.string().url().describe("External image URL to attach to the product"),
    altText: z.string().optional().describe("Alt text for the image"),
  }),
  execute: async ({ productId, url, altText }) => {
    try {
      const data = await adminFetch<{
        productCreateMedia: {
          media: Array<{
            id: string;
            status: string;
          }> | null;
          mediaUserErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation ProductCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
            productCreateMedia(productId: $productId, media: $media) {
              media {
                ... on MediaImage {
                  id
                  status
                }
              }
              mediaUserErrors { field message }
            }
          }
        `,
        variables: {
          productId,
          media: [
            {
              originalSource: url,
              alt: altText ?? "",
              mediaContentType: "IMAGE",
            },
          ],
        },
      });

      const { media, mediaUserErrors } = data.productCreateMedia;
      if (mediaUserErrors.length > 0) {
        return { error: mediaUserErrors.map((e) => e.message).join(", ") };
      }

      return {
        added: true,
        mediaId: media?.[0]?.id ?? null,
        status: media?.[0]?.status ?? "unknown",
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to add product image" };
    }
  },
});

export const removeProductImage = tool({
  description: "Remove an image (media) from a product.",
  inputSchema: z.object({
    productId: z.string().describe("Shopify product GID"),
    mediaId: z.string().describe("Shopify media GID to remove (e.g. gid://shopify/MediaImage/123)"),
  }),
  execute: async ({ productId, mediaId }) => {
    try {
      const data = await adminFetch<{
        productDeleteMedia: {
          deletedMediaIds: string[] | null;
          mediaUserErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation ProductDeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
            productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
              deletedMediaIds
              mediaUserErrors { field message }
            }
          }
        `,
        variables: { productId, mediaIds: [mediaId] },
      });

      const { deletedMediaIds, mediaUserErrors } = data.productDeleteMedia;
      if (mediaUserErrors.length > 0) {
        return { error: mediaUserErrors.map((e) => e.message).join(", ") };
      }

      return {
        removed: true,
        deletedMediaIds: deletedMediaIds ?? [],
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to remove product image" };
    }
  },
});

export const reorderProductImages = tool({
  description: "Reorder product media by providing the media IDs in the desired order.",
  inputSchema: z.object({
    productId: z.string().describe("Shopify product GID"),
    mediaIds: z
      .array(z.string())
      .describe("Array of media GIDs in the desired display order"),
  }),
  execute: async ({ productId, mediaIds }) => {
    try {
      const moves = mediaIds.map((id, index) => ({
        id,
        newPosition: `${index}`,
      }));

      const data = await adminFetch<{
        productReorderMedia: {
          job: { id: string } | null;
          mediaUserErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation ProductReorderMedia($productId: ID!, $moves: [MoveInput!]!) {
            productReorderMedia(productId: $productId, moves: $moves) {
              job { id }
              mediaUserErrors { field message }
            }
          }
        `,
        variables: { productId, moves },
      });

      const { job, mediaUserErrors } = data.productReorderMedia;
      if (mediaUserErrors.length > 0) {
        return { error: mediaUserErrors.map((e) => e.message).join(", ") };
      }

      return {
        reordered: true,
        jobId: job?.id ?? null,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to reorder product images" };
    }
  },
});

// ─── Metafields ──────────────────────────────────────────────────────────────

export const setMetafields = tool({
  description:
    "Set metafields on any resource (product, variant, collection, etc.). Creates or updates metafields by namespace and key.",
  inputSchema: z.object({
    metafields: z
      .array(
        z.object({
          ownerId: z.string().describe("GID of the resource that owns this metafield"),
          namespace: z.string().describe("Metafield namespace (e.g. 'custom')"),
          key: z.string().describe("Metafield key"),
          value: z.string().describe("Metafield value (as string — JSON for complex types)"),
          type: z
            .string()
            .describe(
              "Metafield type (e.g. single_line_text_field, number_integer, json, boolean, list.single_line_text_field)",
            ),
        }),
      )
      .describe("Array of metafields to set"),
  }),
  execute: async ({ metafields }) => {
    try {
      const data = await adminFetch<{
        metafieldsSet: {
          metafields: Array<{
            id: string;
            namespace: string;
            key: string;
            value: string;
          }> | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields {
                id
                namespace
                key
                value
              }
              userErrors { field message }
            }
          }
        `,
        variables: { metafields },
      });

      const { metafields: result, userErrors } = data.metafieldsSet;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }

      return {
        set: true,
        metafields:
          result?.map((m) => ({
            id: m.id,
            namespace: m.namespace,
            key: m.key,
            value: m.value,
          })) ?? [],
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to set metafields" };
    }
  },
});

export const getMetafields = tool({
  description:
    "Read metafields on a resource. Optionally filter by namespace.",
  inputSchema: z.object({
    ownerId: z.string().describe("GID of the resource (e.g. gid://shopify/Product/123)"),
    namespace: z.string().optional().describe("Filter to a specific namespace"),
  }),
  execute: async ({ ownerId, namespace }) => {
    try {
      const namespaceFilter = namespace ? `, namespace: "${namespace}"` : "";

      const data = await adminFetch<{
        node: {
          metafields: {
            edges: Array<{
              node: {
                id: string;
                namespace: string;
                key: string;
                value: string;
                type: string;
              };
            }>;
          };
        } | null;
      }>({
        query: `
          query GetMetafields($id: ID!) {
            node(id: $id) {
              ... on HasMetafields {
                metafields(first: 50${namespaceFilter}) {
                  edges {
                    node {
                      id
                      namespace
                      key
                      value
                      type
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { id: ownerId },
      });

      if (!data.node) {
        return { error: `Resource not found: ${ownerId}` };
      }

      return {
        ownerId,
        metafields: data.node.metafields.edges.map(({ node }) => ({
          id: node.id,
          namespace: node.namespace,
          key: node.key,
          value: node.value,
          type: node.type,
        })),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to get metafields" };
    }
  },
});

export const deleteMetafield = tool({
  description: "Delete a specific metafield by its GID.",
  inputSchema: z.object({
    metafieldId: z
      .string()
      .describe("Shopify metafield GID (e.g. gid://shopify/Metafield/123)"),
  }),
  execute: async ({ metafieldId }) => {
    try {
      const data = await adminFetch<{
        metafieldDelete: {
          deletedId: string | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation MetafieldDelete($input: MetafieldDeleteInput!) {
            metafieldDelete(input: $input) {
              deletedId
              userErrors { field message }
            }
          }
        `,
        variables: { input: { id: metafieldId } },
      });

      const { deletedId, userErrors } = data.metafieldDelete;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }

      return { deleted: true, deletedId };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to delete metafield" };
    }
  },
});

// ─── Collections ─────────────────────────────────────────────────────────────

export const createCollection = tool({
  description: "Create a new manual collection.",
  inputSchema: z.object({
    title: z.string().describe("Collection title"),
    descriptionHtml: z.string().optional().describe("Collection description (HTML)"),
    imageUrl: z.string().url().optional().describe("Collection image URL"),
    sortOrder: z
      .enum([
        "ALPHA_ASC",
        "ALPHA_DESC",
        "BEST_SELLING",
        "CREATED",
        "CREATED_DESC",
        "MANUAL",
        "PRICE_ASC",
        "PRICE_DESC",
      ])
      .optional()
      .describe("Product sort order within the collection"),
  }),
  execute: async ({ title, descriptionHtml, imageUrl, sortOrder }) => {
    try {
      const input: Record<string, unknown> = { title };
      if (descriptionHtml) input.descriptionHtml = descriptionHtml;
      if (imageUrl) input.image = { src: imageUrl };
      if (sortOrder) input.sortOrder = sortOrder;

      const data = await adminFetch<{
        collectionCreate: {
          collection: {
            id: string;
            title: string;
            handle: string;
          } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation CollectionCreate($input: CollectionInput!) {
            collectionCreate(input: $input) {
              collection {
                id
                title
                handle
              }
              userErrors { field message }
            }
          }
        `,
        variables: { input },
      });

      const { collection, userErrors } = data.collectionCreate;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }
      if (!collection) {
        return { error: "Collection creation returned no collection" };
      }

      return {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to create collection" };
    }
  },
});

export const updateCollection = tool({
  description: "Update a collection's title, description, image, or sort order.",
  inputSchema: z.object({
    collectionId: z.string().describe("Shopify collection GID"),
    title: z.string().optional().describe("New collection title"),
    descriptionHtml: z.string().optional().describe("New collection description (HTML)"),
    imageUrl: z.string().url().optional().describe("New collection image URL"),
    sortOrder: z
      .enum([
        "ALPHA_ASC",
        "ALPHA_DESC",
        "BEST_SELLING",
        "CREATED",
        "CREATED_DESC",
        "MANUAL",
        "PRICE_ASC",
        "PRICE_DESC",
      ])
      .optional()
      .describe("Product sort order within the collection"),
  }),
  execute: async ({ collectionId, title, descriptionHtml, imageUrl, sortOrder }) => {
    try {
      const input: Record<string, unknown> = { id: collectionId };
      if (title !== undefined) input.title = title;
      if (descriptionHtml !== undefined) input.descriptionHtml = descriptionHtml;
      if (imageUrl !== undefined) input.image = { src: imageUrl };
      if (sortOrder !== undefined) input.sortOrder = sortOrder;

      const data = await adminFetch<{
        collectionUpdate: {
          collection: {
            id: string;
            title: string;
            handle: string;
          } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation CollectionUpdate($input: CollectionInput!) {
            collectionUpdate(input: $input) {
              collection {
                id
                title
                handle
              }
              userErrors { field message }
            }
          }
        `,
        variables: { input },
      });

      const { collection, userErrors } = data.collectionUpdate;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }
      if (!collection) {
        return { error: "Collection update returned no collection" };
      }

      return {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to update collection" };
    }
  },
});

export const addProductsToCollection = tool({
  description: "Add products to a manual collection.",
  inputSchema: z.object({
    collectionId: z.string().describe("Shopify collection GID"),
    productIds: z
      .array(z.string())
      .describe("Array of product GIDs to add to the collection"),
  }),
  execute: async ({ collectionId, productIds }) => {
    try {
      const data = await adminFetch<{
        collectionAddProducts: {
          collection: { id: string; title: string } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation CollectionAddProducts($id: ID!, $productIds: [ID!]!) {
            collectionAddProducts(id: $id, productIds: $productIds) {
              collection { id title }
              userErrors { field message }
            }
          }
        `,
        variables: { id: collectionId, productIds },
      });

      const { collection, userErrors } = data.collectionAddProducts;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }

      return {
        added: true,
        collection: collection?.title ?? collectionId,
        productsAdded: productIds.length,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to add products to collection",
      };
    }
  },
});

export const removeProductsFromCollection = tool({
  description: "Remove products from a manual collection.",
  inputSchema: z.object({
    collectionId: z.string().describe("Shopify collection GID"),
    productIds: z
      .array(z.string())
      .describe("Array of product GIDs to remove from the collection"),
  }),
  execute: async ({ collectionId, productIds }) => {
    try {
      const data = await adminFetch<{
        collectionRemoveProducts: {
          job: { id: string } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation CollectionRemoveProducts($id: ID!, $productIds: [ID!]!) {
            collectionRemoveProducts(id: $id, productIds: $productIds) {
              job { id }
              userErrors { field message }
            }
          }
        `,
        variables: { id: collectionId, productIds },
      });

      const { userErrors } = data.collectionRemoveProducts;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }

      return {
        removed: true,
        productsRemoved: productIds.length,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to remove products from collection",
      };
    }
  },
});

export const listCollections = tool({
  description: "List collections in the Shopify store. Optionally search by title.",
  inputSchema: z.object({
    first: z
      .number()
      .min(1)
      .max(50)
      .optional()
      .default(25)
      .describe("Number of collections to return (max 50)"),
    search: z.string().optional().describe("Search by collection title"),
  }),
  execute: async ({ first, search }) => {
    try {
      const queryFilter = search ? `title:*${search}*` : null;

      const data = await adminFetch<{
        collections: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              handle: string;
              productsCount: { count: number };
              image: { url: string; altText: string | null } | null;
            };
          }>;
        };
      }>({
        query: `
          query ListCollections($first: Int!, $query: String) {
            collections(first: $first, query: $query, sortKey: TITLE) {
              edges {
                node {
                  id
                  title
                  handle
                  productsCount { count }
                  image { url altText }
                }
              }
            }
          }
        `,
        variables: { first, query: queryFilter },
      });

      return data.collections.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        productsCount: node.productsCount.count,
        image: node.image ? { url: node.image.url, alt: node.image.altText } : null,
      }));
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to list collections" };
    }
  },
});

// ─── Product Tags (bulk) ─────────────────────────────────────────────────────

export const updateProductTags = tool({
  description:
    "Add or remove tags from a product. More granular than updateProduct — does not replace the full tag list.",
  inputSchema: z.object({
    productId: z.string().describe("Shopify product GID"),
    addTags: z.array(z.string()).optional().describe("Tags to add"),
    removeTags: z.array(z.string()).optional().describe("Tags to remove"),
  }),
  execute: async ({ productId, addTags, removeTags }) => {
    try {
      const results: { added?: string[]; removed?: string[] } = {};

      if (addTags && addTags.length > 0) {
        const addData = await adminFetch<{
          tagsAdd: {
            node: { id: string } | null;
            userErrors: Array<{ field: string[]; message: string }>;
          };
        }>({
          query: `
            mutation TagsAdd($id: ID!, $tags: [String!]!) {
              tagsAdd(id: $id, tags: $tags) {
                node { id }
                userErrors { field message }
              }
            }
          `,
          variables: { id: productId, tags: addTags },
        });

        if (addData.tagsAdd.userErrors.length > 0) {
          return { error: addData.tagsAdd.userErrors.map((e) => e.message).join(", ") };
        }
        results.added = addTags;
      }

      if (removeTags && removeTags.length > 0) {
        const removeData = await adminFetch<{
          tagsRemove: {
            node: { id: string } | null;
            userErrors: Array<{ field: string[]; message: string }>;
          };
        }>({
          query: `
            mutation TagsRemove($id: ID!, $tags: [String!]!) {
              tagsRemove(id: $id, tags: $tags) {
                node { id }
                userErrors { field message }
              }
            }
          `,
          variables: { id: productId, tags: removeTags },
        });

        if (removeData.tagsRemove.userErrors.length > 0) {
          return { error: removeData.tagsRemove.userErrors.map((e) => e.message).join(", ") };
        }
        results.removed = removeTags;
      }

      return { updated: true, ...results };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to update product tags" };
    }
  },
});

// ─── Read Tools ───────────────────────────────────────────────────────────────

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

// ─── Metafield Definitions ───────────────────────────────────────────────────

const METAFIELD_OWNER_TYPE = z
  .enum(["PRODUCT", "PRODUCTVARIANT", "COLLECTION", "CUSTOMER", "ORDER"])
  .describe("The resource type that owns this metafield definition");

export const createMetafieldDefinition = tool({
  description:
    "Create a new metafield definition in Shopify. Required before setMetafields can work on new custom fields.",
  inputSchema: z.object({
    name: z.string().describe('Human-readable name (e.g. "Roast Level")'),
    namespace: z.string().describe('Metafield namespace (e.g. "custom")'),
    key: z.string().describe('Metafield key (e.g. "roast_level")'),
    type: z
      .string()
      .describe(
        "Metafield type (e.g. single_line_text_field, number_integer, boolean, list.single_line_text_field, json)",
      ),
    ownerType: METAFIELD_OWNER_TYPE,
    description: z.string().optional().describe("Description of the metafield"),
    pin: z.boolean().optional().default(false).describe("Whether to pin to the admin UI"),
  }),
  execute: async ({ name, namespace, key, type, ownerType, description, pin }) => {
    try {
      const definition: Record<string, unknown> = {
        name,
        namespace,
        key,
        type,
        ownerType,
        pin,
      };
      if (description !== undefined) definition.description = description;

      const data = await adminFetch<{
        metafieldDefinitionCreate: {
          createdDefinition: {
            id: string;
            name: string;
            namespace: string;
            key: string;
            type: { name: string };
            ownerType: string;
          } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation MetafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
            metafieldDefinitionCreate(definition: $definition) {
              createdDefinition {
                id
                name
                namespace
                key
                type { name }
                ownerType
              }
              userErrors { field message }
            }
          }
        `,
        variables: { definition },
      });

      const { createdDefinition, userErrors } = data.metafieldDefinitionCreate;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }
      if (!createdDefinition) {
        return { error: "Metafield definition creation returned no definition" };
      }

      return {
        id: createdDefinition.id,
        name: createdDefinition.name,
        namespace: createdDefinition.namespace,
        key: createdDefinition.key,
        type: createdDefinition.type.name,
        ownerType: createdDefinition.ownerType,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to create metafield definition",
      };
    }
  },
});

export const listMetafieldDefinitions = tool({
  description:
    "List existing metafield definitions for a resource type. Use this to discover what custom fields exist before setting values.",
  inputSchema: z.object({
    ownerType: METAFIELD_OWNER_TYPE,
  }),
  execute: async ({ ownerType }) => {
    try {
      const data = await adminFetch<{
        metafieldDefinitions: {
          edges: Array<{
            node: {
              id: string;
              name: string;
              namespace: string;
              key: string;
              type: { name: string };
              description: string | null;
              pinnedPosition: number | null;
            };
          }>;
        };
      }>({
        query: `
          query MetafieldDefinitions($ownerType: MetafieldOwnerType!) {
            metafieldDefinitions(first: 50, ownerType: $ownerType) {
              edges {
                node {
                  id
                  name
                  namespace
                  key
                  type { name }
                  description
                  pinnedPosition
                }
              }
            }
          }
        `,
        variables: { ownerType },
      });

      return data.metafieldDefinitions.edges.map(({ node }) => ({
        id: node.id,
        name: node.name,
        namespace: node.namespace,
        key: node.key,
        type: node.type.name,
        description: node.description,
        pinned: node.pinnedPosition !== null,
      }));
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to list metafield definitions",
      };
    }
  },
});

// ─── Discounts ───────────────────────────────────────────────────────────────

export const createDiscountCode = tool({
  description:
    "Create a basic discount code (percentage or fixed amount off). Returns the created discount details.",
  inputSchema: z.object({
    title: z.string().describe("Internal name for the discount"),
    code: z.string().describe("The actual discount code customers type at checkout"),
    valueType: z
      .enum(["percentage", "fixed_amount"])
      .describe("Type of discount — percentage or fixed dollar amount"),
    value: z
      .number()
      .describe("Discount value — percentage (0-100) or fixed amount in dollars"),
    startsAt: z
      .string()
      .optional()
      .describe("ISO date when the discount starts (defaults to now)"),
    endsAt: z
      .string()
      .optional()
      .describe("ISO date when the discount ends (null = no end date)"),
    usageLimit: z.number().optional().describe("Maximum total uses across all customers"),
    oncePerCustomer: z
      .boolean()
      .optional()
      .default(true)
      .describe("Whether each customer can only use this code once"),
    appliesOncePerCustomer: z
      .boolean()
      .optional()
      .default(true)
      .describe("Whether the discount applies once per customer per order"),
    minimumSubtotal: z
      .number()
      .optional()
      .describe("Minimum order subtotal required to use this discount"),
  }),
  execute: async ({
    title,
    code,
    valueType,
    value,
    startsAt,
    endsAt,
    usageLimit,
    oncePerCustomer,
    appliesOncePerCustomer,
    minimumSubtotal,
  }) => {
    try {
      const customerGets: Record<string, unknown> = {
        items: { all: true },
        value:
          valueType === "percentage"
            ? { percentage: value / 100 }
            : { discountAmount: { amount: value, appliesOnEachItem: false } },
      };

      const basicCodeDiscount: Record<string, unknown> = {
        title,
        code,
        startsAt: startsAt ?? new Date().toISOString(),
        customerGets,
        customerSelection: { all: true },
        appliesOncePerCustomer: appliesOncePerCustomer ?? true,
      };
      if (endsAt !== undefined) basicCodeDiscount.endsAt = endsAt;
      if (usageLimit !== undefined) basicCodeDiscount.usageLimit = usageLimit;
      if (oncePerCustomer !== undefined) basicCodeDiscount.oncePerCustomer = oncePerCustomer;
      if (minimumSubtotal !== undefined) {
        basicCodeDiscount.minimumRequirement = {
          subtotal: { greaterThanOrEqualToSubtotal: minimumSubtotal },
        };
      }

      const data = await adminFetch<{
        discountCodeBasicCreate: {
          codeDiscountNode: {
            id: string;
            codeDiscount: {
              title: string;
              codes: { nodes: Array<{ code: string }> };
              startsAt: string;
              endsAt: string | null;
              status: string;
            };
          } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
            discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
              codeDiscountNode {
                id
                codeDiscount {
                  ... on DiscountCodeBasic {
                    title
                    codes(first: 1) { nodes { code } }
                    startsAt
                    endsAt
                    status
                  }
                }
              }
              userErrors { field message }
            }
          }
        `,
        variables: { basicCodeDiscount },
      });

      const { codeDiscountNode, userErrors } = data.discountCodeBasicCreate;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }
      if (!codeDiscountNode) {
        return { error: "Discount creation returned no discount" };
      }

      const d = codeDiscountNode.codeDiscount;
      return {
        id: codeDiscountNode.id,
        title: d.title,
        code: d.codes.nodes[0]?.code ?? code,
        startsAt: d.startsAt,
        endsAt: d.endsAt,
        status: d.status,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to create discount code" };
    }
  },
});

export const listDiscountCodes = tool({
  description: "List discount codes in the store. Optionally filter by search query.",
  inputSchema: z.object({
    query: z.string().optional().describe("Search filter for discount codes"),
    first: z
      .number()
      .min(1)
      .max(50)
      .optional()
      .default(25)
      .describe("Number of discount codes to return (max 50)"),
  }),
  execute: async ({ query, first }) => {
    try {
      const data = await adminFetch<{
        codeDiscountNodes: {
          nodes: Array<{
            id: string;
            codeDiscount: {
              title: string;
              codes: { nodes: Array<{ code: string }> };
              status: string;
              startsAt: string;
              endsAt: string | null;
              usageLimit?: number | null;
              asyncUsageCount?: number;
            };
          }>;
        };
      }>({
        query: `
          query DiscountCodes($first: Int!, $query: String) {
            codeDiscountNodes(first: $first, query: $query) {
              nodes {
                id
                codeDiscount {
                  ... on DiscountCodeBasic {
                    title
                    codes(first: 1) { nodes { code } }
                    status
                    startsAt
                    endsAt
                    usageLimit
                    asyncUsageCount
                  }
                  ... on DiscountCodeBuyXGetY {
                    title
                    codes(first: 1) { nodes { code } }
                    status
                    startsAt
                    endsAt
                  }
                  ... on DiscountCodeFreeShipping {
                    title
                    codes(first: 1) { nodes { code } }
                    status
                    startsAt
                    endsAt
                  }
                }
              }
            }
          }
        `,
        variables: { first, query: query ?? null },
      });

      return data.codeDiscountNodes.nodes.map((node) => ({
        id: node.id,
        title: node.codeDiscount.title,
        code: node.codeDiscount.codes.nodes[0]?.code ?? null,
        status: node.codeDiscount.status,
        startsAt: node.codeDiscount.startsAt,
        endsAt: node.codeDiscount.endsAt,
        usageLimit: node.codeDiscount.usageLimit ?? null,
        totalUsed: node.codeDiscount.asyncUsageCount ?? null,
      }));
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to list discount codes" };
    }
  },
});

export const deactivateDiscountCode = tool({
  description: "Deactivate an active discount code.",
  inputSchema: z.object({
    id: z.string().describe("Shopify discount node GID (e.g. gid://shopify/DiscountCodeNode/123)"),
  }),
  execute: async ({ id }) => {
    try {
      const data = await adminFetch<{
        discountCodeDeactivate: {
          codeDiscountNode: { id: string } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation discountCodeDeactivate($id: ID!) {
            discountCodeDeactivate(id: $id) {
              codeDiscountNode { id }
              userErrors { field message }
            }
          }
        `,
        variables: { id },
      });

      const { codeDiscountNode, userErrors } = data.discountCodeDeactivate;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }

      return {
        deactivated: true,
        id: codeDiscountNode?.id ?? id,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to deactivate discount code",
      };
    }
  },
});

export const deleteDiscountCode = tool({
  description: "Permanently delete a discount code.",
  inputSchema: z.object({
    id: z.string().describe("Shopify discount node GID (e.g. gid://shopify/DiscountCodeNode/123)"),
  }),
  execute: async ({ id }) => {
    try {
      const data = await adminFetch<{
        discountCodeDelete: {
          deletedCodeDiscountId: string | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: `
          mutation discountCodeDelete($id: ID!) {
            discountCodeDelete(id: $id) {
              deletedCodeDiscountId
              userErrors { field message }
            }
          }
        `,
        variables: { id },
      });

      const { deletedCodeDiscountId, userErrors } = data.discountCodeDelete;
      if (userErrors.length > 0) {
        return { error: userErrors.map((e) => e.message).join(", ") };
      }

      return {
        deleted: true,
        deletedId: deletedCodeDiscountId,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to delete discount code" };
    }
  },
});
