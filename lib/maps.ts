/**
 * Build a Google Maps deep link for an event location.
 *
 * Uses the documented Maps URLs "search" action:
 * https://developers.google.com/maps/documentation/urls/get-started#search-action
 *
 * `query` is REQUIRED even when `query_place_id` is supplied — Google resolves the
 * place ID and falls back to the query only if it cannot. Without a `query` the
 * request is ignored, which is why the legacy `/maps/place/?q=place_id:<id>` form
 * this replaced rendered "Google Maps can't find place_id:…" instead of the place.
 *
 * Derived at render rather than stored on the document: the URL is a pure function
 * of `placeId` + `displayAddress`, so a future format change costs a deploy rather
 * than a dataset migration.
 *
 * Returns null when there is no address to search, so callers can fall back to
 * plain text rather than rendering an anchor with an empty href.
 */
export function googleMapsUrl(location: {
  placeId?: string | null;
  displayAddress?: string | null;
}): string | null {
  const query = location.displayAddress?.trim();
  if (!query) return null;

  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", query);

  const placeId = location.placeId?.trim();
  if (placeId) url.searchParams.set("query_place_id", placeId);

  return url.toString();
}
