/** The production domain, confirmed by the owner 2026-10-12. */
const PRODUCTION_URL = "https://kaisorasystems.com";

/**
 * The site's canonical origin, for `metadataBase`, canonical URLs, the sitemap
 * and robots.txt (Prompt 21).
 *
 * 1. `NEXT_PUBLIC_SITE_URL`, when set — an explicit override.
 * 2. localhost under `next dev`.
 * 3. The production domain for every build, previews included, so canonical
 *    URLs always point at the real site rather than a deployment URL.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return PRODUCTION_URL;
}

export const SITE_URL = resolveSiteUrl();
