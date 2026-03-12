# Data Models — El Gato Negro

> Research by: Inventory Management Agent | Status: Planning Phase

## Prisma Schema

Save as `prisma/schema.prisma` when scaffolding begins.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ── ENUMS ─────────────────────────────────────────

enum Role { CUSTOMER ADMIN SUPER_ADMIN }

enum ProductType {
  PHYSICAL_MERCHANDISE
  PHYSICAL_COFFEE
  DIGITAL_3D_MODEL
  DIGITAL_RESOURCE
}

enum FulfillmentType {
  PHYSICAL_SHIP
  DIGITAL_DOWNLOAD
  DIGITAL_GATED
}

enum OrderStatus {
  PENDING_PAYMENT PAYMENT_FAILED PAID
  PROCESSING SHIPPED DELIVERED
  DOWNLOAD_READY COMPLETED
  CANCELLED REFUNDED PARTIALLY_REFUNDED
}

enum DownloadTokenStatus { ACTIVE EXPIRED REVOKED }
enum EventStatus { DRAFT PUBLISHED CANCELLED COMPLETED }
enum PostStatus { DRAFT PUBLISHED ARCHIVED }
enum InquiryType { GENERAL ORDER_SUPPORT WHOLESALE CATERING PRESS OTHER }
enum SubscriptionStatus { ACTIVE PAUSED CANCELLED PAST_DUE }

// ── USERS ─────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  phone         String?
  passwordHash  String?
  role          Role      @default(CUSTOMER)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  addresses      Address[]
  orders         Order[]
  cart           Cart?
  downloadTokens DownloadToken[]
  sessions       Session[]
  inquiries      LeadInquiry[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Address {
  id         String   @id @default(cuid())
  userId     String
  label      String?
  line1      String
  line2      String?
  city       String
  state      String
  postalCode String
  country    String   @default("US")
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders     Order[]
}

// ── CATEGORIES & TAGS ─────────────────────────────

model Category {
  id          String            @id @default(cuid())
  name        String            @unique
  slug        String            @unique
  description String?
  parentId    String?
  sortOrder   Int               @default(0)
  parent      Category?         @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[]        @relation("CategoryTree")
  products    ProductCategory[]
}

model Tag {
  id       String       @id @default(cuid())
  name     String       @unique
  slug     String       @unique
  products ProductTag[]
  posts    PostTag[]
}

// ── PRODUCTS ──────────────────────────────────────

model Product {
  id               String          @id @default(cuid())
  name             String
  slug             String          @unique
  description      String?
  shortDescription String?
  productType      ProductType
  fulfillmentType  FulfillmentType
  isActive         Boolean         @default(true)
  isFeatured       Boolean         @default(false)
  basePrice        Decimal         @db.Decimal(10, 2)
  compareAtPrice   Decimal?        @db.Decimal(10, 2)
  taxable          Boolean         @default(true)
  requiresShipping Boolean         @default(false)
  weight           Decimal?        @db.Decimal(8, 2)  // oz
  seoTitle         String?
  seoDescription   String?
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  variants      ProductVariant[]
  images        ProductImage[]
  categories    ProductCategory[]
  tags          ProductTag[]
  digitalAssets DigitalAsset[]
  coffeeDetails CoffeeDetails?
  cartItems     CartItem[]
  orderItems    OrderItem[]
}

model ProductVariant {
  id             String   @id @default(cuid())
  productId      String
  sku            String   @unique
  name           String   // "Large / Black", "12oz / Medium Roast"
  price          Decimal  @db.Decimal(10, 2)
  compareAtPrice Decimal? @db.Decimal(10, 2)
  sortOrder      Int      @default(0)
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  options    VariantOption[]
  product    Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  inventory  Inventory?
  cartItems  CartItem[]
  orderItems OrderItem[]
}

model VariantOption {
  id        String         @id @default(cuid())
  variantId String
  name      String         // "Size", "Color", "Weight", "Roast"
  value     String         // "Large", "Black", "12oz", "Medium"
  variant   ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  @@unique([variantId, name])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  altText   String?
  sortOrder Int     @default(0)
  isPrimary Boolean @default(false)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model ProductCategory {
  productId  String
  categoryId String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  @@id([productId, categoryId])
}

model ProductTag {
  productId String
  tagId     String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([productId, tagId])
}

model CoffeeDetails {
  id          String   @id @default(cuid())
  productId   String   @unique
  origin      String
  region      String?
  farm        String?
  process     String?
  roastLevel  String
  flavorNotes String[]
  altitude    String?
  harvest     String?
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

// ── DIGITAL ASSETS ────────────────────────────────

model DigitalAsset {
  id             String          @id @default(cuid())
  productId      String
  name           String
  fileUrl        String          // private R2 URL
  fileSize       Int?
  mimeType       String?
  version        String?
  isActive       Boolean         @default(true)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  product        Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  downloadTokens DownloadToken[]
}

model DownloadToken {
  id             String              @id @default(cuid())
  userId         String
  orderItemId    String
  digitalAssetId String
  token          String              @unique @default(cuid())
  status         DownloadTokenStatus @default(ACTIVE)
  downloadCount  Int                 @default(0)
  maxDownloads   Int                 @default(5)
  expiresAt      DateTime
  lastDownloadAt DateTime?
  createdAt      DateTime            @default(now())
  user           User                @relation(fields: [userId], references: [id])
  orderItem      OrderItem           @relation(fields: [orderItemId], references: [id])
  digitalAsset   DigitalAsset        @relation(fields: [digitalAssetId], references: [id])
  @@index([token])
}

// ── INVENTORY ─────────────────────────────────────

model Inventory {
  id                String               @id @default(cuid())
  variantId         String               @unique
  quantityOnHand    Int                  @default(0)
  quantityReserved  Int                  @default(0)
  lowStockThreshold Int                  @default(5)
  allowBackorder    Boolean              @default(false)
  updatedAt         DateTime             @updatedAt
  variant           ProductVariant       @relation(fields: [variantId], references: [id], onDelete: Cascade)
  adjustments       InventoryAdjustment[]
}

model InventoryAdjustment {
  id          String    @id @default(cuid())
  inventoryId String
  delta       Int       // positive = restock, negative = sale
  reason      String    // "SALE", "RESTOCK", "CORRECTION", "RETURN", "DAMAGE"
  note        String?
  orderId     String?
  adminId     String?
  createdAt   DateTime  @default(now())
  inventory   Inventory @relation(fields: [inventoryId], references: [id])
}

// ── CART ──────────────────────────────────────────

model Cart {
  id        String     @id @default(cuid())
  userId    String?    @unique
  sessionId String?    @unique  // guest cart
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  user      User?      @relation(fields: [userId], references: [id], onDelete: SetNull)
  items     CartItem[]
}

model CartItem {
  id        String         @id @default(cuid())
  cartId    String
  productId String
  variantId String
  quantity  Int            @default(1)
  addedAt   DateTime       @default(now())
  cart      Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product        @relation(fields: [productId], references: [id])
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  @@unique([cartId, variantId])
}

// ── ORDERS ────────────────────────────────────────

model Order {
  id                String      @id @default(cuid())
  orderNumber       String      @unique  // EGN-2026-00042
  userId            String?
  guestEmail        String?
  status            OrderStatus @default(PENDING_PAYMENT)
  subtotal          Decimal     @db.Decimal(10, 2)
  discountTotal     Decimal     @default(0) @db.Decimal(10, 2)
  taxTotal          Decimal     @default(0) @db.Decimal(10, 2)
  shippingTotal     Decimal     @default(0) @db.Decimal(10, 2)
  grandTotal        Decimal     @db.Decimal(10, 2)
  currency          String      @default("USD")
  shippingAddressId String?
  shippingMethod    String?
  trackingNumber    String?
  trackingUrl       String?
  shippedAt         DateTime?
  deliveredAt       DateTime?
  paymentProvider   String?
  paymentIntentId   String?     @unique
  paidAt            DateTime?
  refundedAmount    Decimal?    @db.Decimal(10, 2)
  refundedAt        DateTime?
  refundReason      String?
  notes             String?
  customerNote      String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  user            User?               @relation(fields: [userId], references: [id], onDelete: SetNull)
  shippingAddress Address?            @relation(fields: [shippingAddressId], references: [id])
  items           OrderItem[]
  statusHistory   OrderStatusHistory[]
  discounts       OrderDiscount[]

  @@index([userId])
  @@index([orderNumber])
  @@index([status])
}

model OrderItem {
  id              String          @id @default(cuid())
  orderId         String
  productId       String
  variantId       String
  fulfillmentType FulfillmentType
  productName     String          // snapshot at purchase
  variantName     String
  sku             String
  unitPrice       Decimal         @db.Decimal(10, 2)
  quantity        Int
  lineTotal       Decimal         @db.Decimal(10, 2)
  fulfilledAt     DateTime?
  downloadTokens  DownloadToken[]
  order           Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product         Product         @relation(fields: [productId], references: [id])
  variant         ProductVariant  @relation(fields: [variantId], references: [id])
}

model OrderStatusHistory {
  id         String       @id @default(cuid())
  orderId    String
  fromStatus OrderStatus?
  toStatus   OrderStatus
  note       String?
  adminId    String?
  createdAt  DateTime     @default(now())
  order      Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

// ── DISCOUNTS ─────────────────────────────────────

model DiscountCode {
  id              String          @id @default(cuid())
  code            String          @unique
  description     String?
  isActive        Boolean         @default(true)
  discountType    String          // "PERCENT" | "FIXED"
  discountValue   Decimal         @db.Decimal(10, 2)
  minimumOrderAmt Decimal?        @db.Decimal(10, 2)
  maxUses         Int?
  usedCount       Int             @default(0)
  onePerCustomer  Boolean         @default(false)
  startsAt        DateTime?
  expiresAt       DateTime?
  createdAt       DateTime        @default(now())
  orderDiscounts  OrderDiscount[]
}

model OrderDiscount {
  id             String        @id @default(cuid())
  orderId        String
  discountCodeId String?
  description    String
  amount         Decimal       @db.Decimal(10, 2)
  order          Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  discountCode   DiscountCode? @relation(fields: [discountCodeId], references: [id])
}

// ── LOCATIONS & HOURS ─────────────────────────────

model Location {
  id          String          @id @default(cuid())
  name        String
  slug        String          @unique
  description String?
  address     String?
  city        String?
  state       String?
  postalCode  String?
  lat         Float?
  lng         Float?
  isActive    Boolean         @default(true)
  sortOrder   Int             @default(0)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  hours       LocationHours[]
  events      Event[]
}

model LocationHours {
  id         String   @id @default(cuid())
  locationId String
  dayOfWeek  Int      // 0=Sunday … 6=Saturday
  openTime   String?  // "07:00"
  closeTime  String?  // "14:00"
  isClosed   Boolean  @default(false)
  note       String?
  location   Location @relation(fields: [locationId], references: [id], onDelete: Cascade)
  @@unique([locationId, dayOfWeek])
}

// ── EVENTS ────────────────────────────────────────

model Event {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  description String?
  locationId  String?
  customVenue String?
  startsAt    DateTime
  endsAt      DateTime?
  status      EventStatus @default(DRAFT)
  imageUrl    String?
  externalUrl String?
  isFeatured  Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  location    Location?   @relation(fields: [locationId], references: [id], onDelete: SetNull)
}

// ── BLOG ──────────────────────────────────────────

model Post {
  id             String     @id @default(cuid())
  title          String
  slug           String     @unique
  excerpt        String?
  content        String
  coverImageUrl  String?
  status         PostStatus @default(DRAFT)
  authorId       String?
  publishedAt    DateTime?
  seoTitle       String?
  seoDescription String?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  tags           PostTag[]
}

model PostTag {
  postId String
  tagId  String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([postId, tagId])
}

// ── FAQ ───────────────────────────────────────────

model FaqCategory {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  sortOrder Int       @default(0)
  items     FaqItem[]
}

model FaqItem {
  id          String      @id @default(cuid())
  categoryId  String
  question    String
  answer      String
  sortOrder   Int         @default(0)
  isPublished Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  category    FaqCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
}

// ── LEAD INQUIRIES ────────────────────────────────

model LeadInquiry {
  id         String      @id @default(cuid())
  userId     String?
  type       InquiryType @default(GENERAL)
  name       String
  email      String
  phone      String?
  subject    String?
  message    String
  isRead     Boolean     @default(false)
  isResolved Boolean     @default(false)
  adminNote  String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  user       User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
}

// ── SUBSCRIPTIONS (future, scaffold only) ─────────

model SubscriptionPlan {
  id           String         @id @default(cuid())
  name         String
  description  String?
  productId    String
  variantId    String
  intervalDays Int
  price        Decimal        @db.Decimal(10, 2)
  isActive     Boolean        @default(false)  // disabled until feature launches
  createdAt    DateTime       @default(now())
  subscriptions Subscription[]
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String
  planId               String
  status               SubscriptionStatus @default(ACTIVE)
  shippingAddressId    String?
  stripeSubscriptionId String?            @unique
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelledAt          DateTime?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
  plan                 SubscriptionPlan   @relation(fields: [planId], references: [id])
}

// ── SITE SETTINGS ─────────────────────────────────

model SiteSetting {
  key         String   @id   // "announcement_banner", "store_open"
  value       String
  description String?
  updatedAt   DateTime @updatedAt
}
```

## Inventory Business Rules

**Available quantity (computed, never stored):**
```
quantityAvailable = quantityOnHand - quantityReserved
```

**Two-phase reservation:**
1. Reserve on payment confirmed: increment `quantityReserved` in a Prisma transaction
2. Deduct on shipped: decrement both `quantityOnHand` and `quantityReserved`, write `InventoryAdjustment`
3. Release on cancellation: decrement `quantityReserved` only

**Digital products skip inventory entirely.** No `Inventory` row created. Stock check is bypassed in checkout pipeline for `DIGITAL_*` product types.

**All inventory mutations must run inside Prisma transactions** to prevent race conditions/overselling.

## Order Lifecycle State Machine

```
PENDING_PAYMENT
  → [payment succeeds] → PAID
      → [physical items] → PROCESSING → SHIPPED → DELIVERED → COMPLETED
      → [digital only]   → DOWNLOAD_READY → COMPLETED
  → [payment fails] → PAYMENT_FAILED

Any state → CANCELLED (releases quantityReserved)
Any state → REFUNDED / PARTIALLY_REFUNDED
```

**Mixed orders (physical + digital):** Digital items get `DownloadToken` rows immediately at `PAID`. Order status reflects physical fulfillment state.

## Key Implementation Notes

- `orderNumber` must be human-readable (`EGN-2026-00042`) — use DB sequence, not cuid
- `OrderItem` stores price/name/SKU **snapshots at purchase time** — never re-query live price for order display
- `Order.paymentIntentId` is the Stripe link — webhook is authoritative for status transitions
- `SubscriptionPlan.isActive = false` keeps subscription tables inert until the feature is built
- `Guest checkout`: `Order.userId` nullable; link to account post-checkout by email match
