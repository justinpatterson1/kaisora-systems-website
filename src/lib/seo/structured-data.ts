import {
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  WHATSAPP_NUMBER,
} from "@/lib/content/contact";
import {
  PERSON_NAME,
  PERSON_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/content/profile";
import { SERVICES } from "@/lib/content/services";
import { PRODUCTION_URL } from "@/lib/site-url";

/**
 * Site-wide structured data (schema.org JSON-LD), read by search engines.
 *
 * One `@graph` with three linked nodes: the studio, its founder and the
 * website. Each has an `@id`, so they point at each other instead of
 * repeating themselves, and Google can tie "Justin Patterson" to Kaisora
 * Systems.
 *
 * Built from the same constants as the visible page, so the two cannot
 * disagree — Google ignores markup that contradicts what users see. Uses the
 * production domain rather than `SITE_URL`: these are identifiers, and a
 * localhost `@id` would be meaningless.
 *
 * The LinkedIn and GitHub profiles are Justin's own, so they are the
 * founder's `sameAs`, not the studio's. Add a company LinkedIn page to the
 * organization's `sameAs` if one is ever created.
 */

const ORG_ID = `${PRODUCTION_URL}/#organization`;
const PERSON_ID = `${PRODUCTION_URL}/#founder`;
const WEBSITE_ID = `${PRODUCTION_URL}/#website`;

/** Trinidad & Tobago, by its ISO 3166 code and its formal English name. */
const TRINIDAD_AND_TOBAGO = {
  "@type": "Country",
  name: "Trinidad and Tobago",
  identifier: "TT",
};

const organization = {
  // ProfessionalService is a kind of LocalBusiness, which is a kind of
  // Organization; listing both keeps it valid for either reading.
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: SITE_NAME,
  url: `${PRODUCTION_URL}/`,
  description: SITE_DESCRIPTION,
  logo: {
    "@type": "ImageObject",
    url: `${PRODUCTION_URL}/apple-icon.png`,
  },
  image: `${PRODUCTION_URL}/opengraph-image`,
  ...(CONTACT_EMAIL && { email: CONTACT_EMAIL }),
  // Country only: there is no public street address, and inventing one is
  // worse than leaving it out.
  address: { "@type": "PostalAddress", addressCountry: "TT" },
  areaServed: TRINIDAD_AND_TOBAGO,
  founder: { "@id": PERSON_ID },
  knowsAbout: SERVICES.map((service) => service.title),
  ...(CONTACT_EMAIL && {
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTACT_EMAIL,
      ...(WHATSAPP_NUMBER && { telephone: WHATSAPP_NUMBER }),
      areaServed: "TT",
      availableLanguage: "English",
    },
  }),
};

const founder = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON_NAME,
  jobTitle: PERSON_TITLE,
  image: `${PRODUCTION_URL}/images/about/justin.jpeg`,
  worksFor: { "@id": ORG_ID },
  sameAs: [LINKEDIN_URL, GITHUB_URL],
};

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${PRODUCTION_URL}/`,
  name: SITE_NAME,
  inLanguage: "en-TT",
  publisher: { "@id": ORG_ID },
};

export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [organization, founder, website],
};

/**
 * JSON for an inline `<script type="application/ld+json">`. Escaping `<`
 * means no string in the data can close the script tag early (Next's JSON-LD
 * guide).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
