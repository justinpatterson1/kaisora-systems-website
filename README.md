# Kaisora Systems

The website of Kaisora Systems, a founder-led software studio in Trinidad &
Tobago that builds web applications, online stores, backend systems and
business automation. It has a single homepage plus a case-study page for each
project.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.
Every route is prerendered as static HTML.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live

| Path | What |
| --- | --- |
| `src/app/` | Routes: the homepage, `/work/[slug]` case studies, 404, `robots.txt`, `sitemap.xml` |
| `src/components/home/` | Homepage sections, including the live system panel in the hero |
| `src/components/site/` | Header, wordmark, contact + footer, theme toggle (shared by every page) |
| `src/components/work/` | The case-study template and architecture diagram |
| `src/components/ui/` | Scroll reveal |
| `src/lib/content/` | **All site copy and links.** Edit here, not in the markup |
| `src/lib/content/system.ts` | The nodes, services and events in the homepage system panel |
| `src/lib/theme/` | Dark (default) / light theme |
| `src/app/globals.css` | Design tokens, component styles, motion |
| `brand/`, `public/brand/` | The brand sheet (reference) and the Pixel K logo as SVG |
| `DESIGN.md`, `PRODUCT.md` | The design system and the product facts the site must respect |

Adding a project takes one entry in `src/lib/content/case-studies.ts`, and
its card and `/work/<slug>` page follow from it. A `public` project is
Kaisora's own work. A `proprietary` one is the founder's prior professional
work, and the site labels it that way.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional override for the canonical origin used by metadata, sitemap and robots. Defaults to `https://kaisorasystems.com` (localhost under `next dev`). |
| `RESEND_API_KEY` | Sends contact-form enquiries to the business email through Resend. Without it the form is hidden and the email/LinkedIn buttons take its place. |
| `CONTACT_FROM_EMAIL` | Optional sender override, e.g. `onboarding@resend.dev` until kaisorasystems.com is verified in Resend. Defaults to `website@kaisorasystems.com`. |

Security headers (CSP, HSTS and friends) are set in `next.config.ts`.

The business email (`info@kaisorasystems.com`) and every other link live in
`src/lib/content/contact.ts`.
