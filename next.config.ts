import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy — the "Without Nonces" shape from
 * node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md.
 *
 * `script-src 'unsafe-inline'` is the cost of a fully static site: Next's
 * hydration payload and the root layout's theme bootstrap are inline scripts,
 * and a nonce would force every page to render per request. Everything else
 * is locked to this origin — no third-party scripts, frames, fonts (next/font
 * self-hosts Rethink Sans and Geist Mono) or form targets. `'unsafe-eval'` is
 * dev-only, for Fast Refresh.
 *
 * Adding an external service (analytics, an embed, a contact-form API) means
 * adding its origin to the matching directive here.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  /* Two years. No `includeSubDomains` / `preload` until the production domain
     is final — both are hard to walk back. */
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Redundant with `frame-ancestors` in modern browsers; kept for old ones. */
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
