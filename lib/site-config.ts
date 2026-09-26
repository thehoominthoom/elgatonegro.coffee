/**
 * Routes on which NO advertising, remarketing, or ad-attribution pixels may
 * ever fire. This is a standing policy, not an optimization.
 *
 * /about carries the Coffee 88 / HH story — Phil's ruling is that no ad
 * pixel loads there, ever. There is currently no ads/analytics
 * infrastructure in this codebase; whoever adds any (Google Ads, Meta
 * pixel, GTM, remarketing tags, etc.) MUST gate its loader on this list
 * before shipping.
 */
export const NO_ADS_ROUTES = ["/about"] as const;

/**
 * Is the store advertised anywhere on the site? Temporary — set `false` while
 * the shop is being held back.
 *
 * Setting this back to `true` restores, with no other edit:
 *   - the "Shop" link in the desktop header nav (`components/layout/SiteHeader.tsx`)
 *   - the "Shop" link in the mobile drawer (`components/layout/NavDrawer.tsx`)
 *   - the homepage store section — featured-product spread + 4-up grid — and
 *     the Shopify product fetch that feeds it (`app/(site)/page.tsx`), plus the
 *     divider that only exists while that section is missing
 *
 * This controls DISCOVERY ONLY. /shop, its collection and product pages, the
 * cart and checkout all stay live and reachable by direct link either way —
 * that is deliberate, not an oversight. Sitemap and robots are untouched, so
 * the store stays indexed.
 *
 * Annotated `boolean` rather than letting TypeScript infer the literal `false`,
 * so the gated branches stay ordinary live code instead of narrowing away.
 */
export const SHOP_VISIBLE: boolean = false;
