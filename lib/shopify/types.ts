// ─── Money ────────────────────────────────────────────────────────────────────

export interface Money {
  amount: string;
  currencyCode: string;
}

// ─── Image ────────────────────────────────────────────────────────────────────

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

// ─── Product Variant ──────────────────────────────────────────────────────────

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: ShopifyImage | null;
}

// ─── Metafield ───────────────────────────────────────────────────────────────

export interface MetafieldReference {
  handle: string;
  field: { value: string } | null;
}

export interface MetafieldWithReferences {
  references: {
    nodes: MetafieldReference[];
  };
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  variants: { nodes: ProductVariant[] };
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  tags: string[];
  vendor: string;
  roastLevel: MetafieldWithReferences | null;
  flavorNotes: MetafieldWithReferences | null;
  country: MetafieldWithReferences | null;
}

// ─── Collection ───────────────────────────────────────────────────────────────

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { nodes: Product[] };
}

export interface CollectionSummary {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
    price: Money;
  };
  cost: {
    totalAmount: Money;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { nodes: CartLine[] };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
}
