# Stack Decisions — El Gato Negro

> Research by: Researcher Agent | Status: Planning Phase

## Authentication — Auth.js v5 + Prisma Adapter

**Why not Clerk:** Adds third-party per-MAU cost for something we can own. Auth.js v5 was rebuilt for App Router, runs in Edge middleware, connects directly to Prisma/Postgres. Roles stored on User model, attached to JWT session.

```ts
// middleware.ts
export { auth as middleware } from "@/auth"
export const config = { matcher: ["/admin/:path*", "/account/:path*"] }
```

## Database — Neon (serverless PostgreSQL)

**Why not Supabase:** Heavier to configure alongside Auth.js + Prisma. Supabase auth/storage would conflict with chosen tools.
**Why not PlanetScale:** MySQL-based, no longer has free tier.
Neon has first-party Vercel integration, pgBouncer connection pooling built-in, and `@prisma/adapter-neon` for edge compatibility.

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled — for app queries
  directUrl = env("DIRECT_URL")     // direct — for prisma migrate deploy
}
```

## Payments — Stripe + Stripe Tax

**Why not Lemon Squeezy:** Compelling for digital-only (MoR = no tax liability) but limited physical product support. Split processors adds complexity.
Stripe covers physical goods, digital goods, future subscriptions, and automatic US/international tax all in one integration.

## CMS — Sanity

**Why not Payload CMS:** Payload is code-first/TypeScript-native and shares our Postgres DB, but the non-dev admin UX is less polished. Sanity Studio is better for a non-technical owner updating hours/events.
**Why not Contentful:** Expensive beyond free tier, overkill.
Sanity free tier: 2 non-admin users, 200k API calls/month. Paid starts at $15/mo.

CMS manages: `hours`, `location`, `event`, `post` documents. Orders/users/transactions stay in Postgres.

ISR revalidation: Sanity webhook → `/api/revalidate` → `revalidateTag()`.

## Email — Resend + React Email

Write email templates as React components. 3k emails/month free. Must verify `elgatonegro.coffee` domain via DNS.
For future newsletter/marketing: pair with **Loops** or **Buttondown** — Resend is transactional only.

## Digital Product Delivery — Cloudflare R2 + Pre-signed URLs

**Why not AWS S3:** Same API (AWS SDK works unchanged), but R2 has zero egress fees — critical for large 3D model files (50–500MB each).
**Why not Vercel Blob:** No native signed URL support — avoid for paid content.

Flow: Stripe webhook → generate pre-signed URL (15-min TTL) → Resend email → store `DownloadToken` in Postgres → customer re-requests from `/account/downloads`.

## Lead Forms — React Hook Form + Zod + Server Actions + Resend

No third-party form service needed. All lead data in our own Postgres DB.
Add **Cloudflare Turnstile** (free, privacy-friendly) for spam protection.

## Images — Cloudinary (next-cloudinary)

Automatic WebP/AVIF serving, responsive resizing, URL-based transformations. 25GB storage + 25GB bandwidth free.
Store Cloudinary **public IDs** in DB — not full URLs — so transformations can be changed later.

```
https://res.cloudinary.com/elgatonegro/image/upload/w_800,f_auto,q_auto/product-hero.jpg
```

## Summary: Free Tier Costs at Launch

| Service | Free Tier |
|---|---|
| Auth.js | Free (self-hosted) |
| Neon | Free (compute auto-suspends) |
| Stripe | 2.9% + $0.30/txn |
| Sanity | Free (2 editors) |
| Resend | 3,000 emails/month |
| Cloudflare R2 | 10GB storage |
| Cloudinary | 25GB storage + bandwidth |
| Turnstile | Free |
| Vercel | Free (Hobby) → Pro when needed |
