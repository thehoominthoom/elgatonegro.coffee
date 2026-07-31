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
