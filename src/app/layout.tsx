import type { Metadata } from "next";
import { Geist_Mono, Rethink_Sans } from "next/font/google";

import { RevealObserver } from "@/components/ui/reveal-observer";
import { PERSON_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/content/profile";
import { SITE_JSON_LD, serializeJsonLd } from "@/lib/seo/structured-data";
import { SITE_URL } from "@/lib/site-url";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme/theme";
import { ThemeProvider } from "@/lib/theme/theme-provider";

import "./globals.css";

/** The brand voice: headlines, body and controls. */
const rethink = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-rethink",
});

/** Real system data (service names, environments, event logs) and the
    KAISORA wordmark, which the brand sheet sets in a bold mono. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-geist-mono",
});

const SITE_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;

/**
 * Site metadata. Case-study pages override the title (through the template),
 * description, canonical and Open Graph fields. The founder stays in
 * `authors` so a search for the name still finds the studio.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: PERSON_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_TT",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

/**
 * Runs before first paint: applies the stored theme (dark by default) so
 * there is no flash, and opts in to scroll reveals only where they can work.
 * Without IntersectionObserver, with reduced motion, or with scripts off,
 * nothing is ever hidden.
 */
const bootstrap = `
(function () {
  var html = document.documentElement;
  try {
    var mode = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    html.dataset.theme = mode === 'light' || mode === 'dark' ? mode : ${JSON.stringify(DEFAULT_THEME)};
  } catch (e) { html.dataset.theme = ${JSON.stringify(DEFAULT_THEME)}; }
  try {
    if ('IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      html.dataset.revealReady = '';
      /* If the app's JavaScript never starts, turn reveals off rather than
         leave content hidden. */
      setTimeout(function () {
        if (!('revealLive' in html.dataset)) delete html.dataset.revealReady;
      }, 4000);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${rethink.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* A plain <script>: it must execute before the body content paints. */}
        <script id="theme-bootstrap" dangerouslySetInnerHTML={{ __html: bootstrap }} />
        {/* Structured data for search engines: the studio, founder and site. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(SITE_JSON_LD) }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
