# Site Architecture — El Gato Negro

> Research by: Web Development Agent | Status: Planning Phase

## Full Route Map

```
app/
├── layout.tsx                          # Root layout (fonts, providers)
├── not-found.tsx
├── error.tsx
│
├── (marketing)/                        # PUBLIC — SiteHeader + SiteFooter
│   ├── page.tsx                        # /
│   ├── about/page.tsx                  # /about
│   ├── menu/page.tsx                   # /menu
│   ├── locations/page.tsx              # /locations
│   ├── events/page.tsx                 # /events
│   ├── services/
│   │   ├── page.tsx                    # /services (overview)
│   │   ├── weddings/page.tsx
│   │   ├── corporate/page.tsx
│   │   ├── conventions/page.tsx
│   │   ├── production-sets/page.tsx
│   │   ├── apartment-popups/page.tsx
│   │   └── partnerships/page.tsx
│   ├── inquiry/[service]/
│   │   ├── page.tsx                    # Step 1: Event details
│   │   ├── confirm/page.tsx            # Step 2: Review & submit
│   │   └── success/page.tsx            # Confirmation
│   ├── resources/
│   │   ├── page.tsx                    # /resources (hub landing)
│   │   ├── blog/page.tsx + [slug]/page.tsx
│   │   ├── build-guides/page.tsx + [slug]/page.tsx
│   │   ├── product-lists/page.tsx
│   │   └── youtube/page.tsx
│   └── legal/
│       ├── privacy/page.tsx
│       ├── terms/page.tsx
│       └── refund-policy/page.tsx
│
├── (store)/
│   ├── shop/page.tsx                   # /shop (all products)
│   ├── shop/[category]/page.tsx        # /shop/merch, /shop/beans, /shop/digital
│   ├── shop/product/[slug]/page.tsx    # Product detail page
│   ├── cart/page.tsx
│   └── checkout/
│       ├── page.tsx
│       ├── processing/page.tsx
│       └── success/page.tsx
│
├── (auth)/                             # Minimal layout, no nav
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
│
├── (account)/                          # Sidebar layout, auth required
│   └── account/
│       ├── page.tsx                    # Dashboard
│       ├── orders/page.tsx + [id]/page.tsx
│       ├── profile/page.tsx
│       ├── downloads/page.tsx          # Digital product downloads
│       └── inquiries/page.tsx
│
├── (admin)/                            # Admin sidebar, ADMIN role required
│   └── admin/
│       ├── page.tsx                    # KPI dashboard
│       ├── orders/page.tsx + [id]/page.tsx
│       ├── products/page.tsx + new/page.tsx + [id]/page.tsx
│       ├── inventory/page.tsx
│       ├── inquiries/page.tsx + [id]/page.tsx
│       ├── customers/page.tsx + [id]/page.tsx
│       ├── resources/page.tsx
│       └── settings/page.tsx
│
└── api/
    ├── webhooks/helcim/route.ts
    ├── inquiry/route.ts
    ├── newsletter/route.ts
    └── revalidate/route.ts
```

## Navigation Structure

**Primary Nav (Desktop):**

```
[Logo]    Find Us    Menu    Services▾    Shop▾    Resources▾    [Cart]  [Account]
```

- Services → mega-menu with all 6 service cards
- Shop → dropdown: Merch / Coffee Beans / Digital Products
- Resources → dropdown: Blog / Build Guides / Product Lists / YouTube

**Mobile:** Full-screen slide-in drawer with expandable accordion sections.

**Footer columns:** Brand+Social | Visit | Work With Us | Shop | Resources

## Component Hierarchy (Key Components)

**Layout:** `SiteHeader`, `SiteFooter`, `AccountLayout` (sidebar), `AdminLayout` (sidebar + topbar), `AuthLayout` (centered card)

**Marketing:** `HeroSection`, `ScheduleStrip`, `ServiceCard`, `ServiceGrid`, `TestimonialCarousel`, `LogoBar`, `EventCard`, `MenuGrid`, `NewsletterSignup`, `HowItWorksSteps`

**Inquiry:** `InquiryFormWrapper` (client, multi-step), `InquiryFormStep1` (dynamic fields), `InquiryProgressBar`

**Shop:** `ProductGrid`, `ProductCard`, `ProductImageGallery` (client), `VariantSelector` (client), `AddToCartButton` (client), `CartDrawer` (client) — checkout handled by Shopify hosted checkout

**Resources:** `BlogCard`, `PostBody` (MDX renderer), `GuideTableOfContents` (client), `GatedContent`

**Admin:** `KPICard`, `DataTable`, `StatusSelect`, `ProductForm` (client), `InventoryRow`

**Shared UI (`components/ui/`):** Button, Input, Card, PolaroidCard, Badge, Modal, Accordion, Tabs, Toast, Skeleton, SectionHeading, Pagination

## Tailwind Design System

```ts
colors: {
  brand: {
    orange: '#B43620',  // CTAs, active nav, prices
    yellow: '#D09324',  // hover, highlights, sale badges
    black:  '#2A201D',  // text, borders, admin bg
    grey:   '#FAF5F4',  // page bg, card fill, button text
    green:  '#7B6838',  // secondary, free badges, captions
  }
}
```

**Polaroid card treatment:** `bg-white p-3 pb-10 rounded-[2px] shadow-[6px_6px_0_0_#2A201D] rotate-[-1deg] hover:rotate-0 transition-transform`

**Primary button:** `bg-brand-orange text-brand-grey font-semibold uppercase tracking-wide px-6 py-3 shadow-[4px_4px_0_0_#2A201D] hover:bg-brand-yellow hover:text-brand-black`

**Typography:** Display font (chunky slab/western serif) for headings. Uppercase wide-tracked eyebrow labels. Fluid type scale via `clamp()`.

Plugins: `@tailwindcss/typography`, `@tailwindcss/forms`, `@tailwindcss/aspect-ratio`

## Lead Generation Flow

Each service page → its own `/inquiry/[service]` with service-specific fields:

| Service          | Key Unique Fields                                        |
| ---------------- | -------------------------------------------------------- |
| weddings         | date, venue, guest count, indoor/outdoor, bar setup      |
| corporate        | company name, headcount, frequency, budget range         |
| conventions      | convention name, setup days, daily traffic, power access |
| production-sets  | production company, crew size, call time, NDA required   |
| apartment-popups | property name, # of units, frequency                     |
| partnerships     | partnership type, co-branding ideas, decision-maker      |

Config lives in `lib/inquiry/config.ts` as `SERVICE_CONFIGS` — drives fields, email template, and success copy.

**Social proof per service:** Each service page has tailored testimonials, client logos, and gallery photos specific to that event type.

**Inquiry lifecycle (admin):** Submitted → New → In Review → Quoted → Booked/Declined → Completed. Customer sees status in `/account/inquiries`.

## SEO Architecture

- Each service page is a unique indexable URL (no modals/tabs) for keyword clustering
- `LocalBusiness` JSON-LD schema on homepage + /locations
- `Event` schema on /events
- `Product` schema on PDPs
- Next.js `metadata` API for all page titles/descriptions
- ISR for all public pages; on-demand revalidation via Sanity webhook

## Rendering Strategy

| Route                                 | Strategy                             |
| ------------------------------------- | ------------------------------------ |
| Homepage, /menu, /about, /services/\* | SSG with ISR                         |
| /locations, /events                   | ISR (revalidates via Sanity webhook) |
| /shop/_, /resources/_                 | ISR (revalidates on content change)  |
| /checkout, /inquiry/\*                | Dynamic (no caching)                 |
| /account/_, /admin/_                  | Dynamic (always fresh)               |

## Build Order

1. Tailwind config + globals + fonts + shadcn/ui
2. Root layout, SiteHeader, SiteFooter, shared UI primitives
3. Homepage (establishes all visual patterns)
4. `/services/*` + inquiry flow
5. `/shop/*` + cart + Shopify hosted checkout
6. Auth + `/account/*`
7. `/admin/*`
8. `/resources/*`
9. Sanity CMS integration
10. Webhooks, email templates, digital delivery
