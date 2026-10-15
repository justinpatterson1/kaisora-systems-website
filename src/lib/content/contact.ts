import type { ComponentType } from "react";

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  WhatsAppIcon,
  type IconProps,
} from "@/components/icons";

/**
 * Contact details — PRD 13, design-system.md §7.9, Prompt 19.
 *
 * Everything the site links to lives in this one file, so filling in a missing
 * value is one edit rather than a hunt through the markup. **Nothing here is
 * ever a placeholder**: a value that isn't confirmed is `null`, and whatever
 * reads it renders nothing rather than a fake address or a dead link.
 */

/**
 * Confirmed by the owner 2026-10-12. If this is ever `null`, the footer shows
 * no email button and no Email row — Prompt 19 forbids placeholder text.
 */
export const CONTACT_EMAIL: string | null = "info@kaisorasystems.com";

/**
 * Confirmed by the owner 2026-09-26. Shared with the Hero, Selected Work and
 * the case-study pages so they cannot drift apart.
 */
export const GITHUB_URL = "https://github.com/justinpatterson1";

/** Confirmed by the owner 2026-09-26. */
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/justin-patterson-691532259/";

/**
 * TODO(Justin): the Instagram profile URL, if it should be listed at all
 * (open-issues.md #4). Prompt 19 puts Email, LinkedIn and GitHub first and
 * rules out invented profile links, so the row is hidden until this is set.
 */
const INSTAGRAM_URL: string | null = null;

/**
 * The business WhatsApp number, from the `WHATSAPP_NUMBER` env var, in
 * international format (`+1 868 555 0123`). Spaces, dashes and brackets are
 * fine — only the digits reach the link. Unset or blank, no WhatsApp button,
 * footer icon or schema telephone is rendered.
 *
 * Server-only: without a `NEXT_PUBLIC_` prefix this is `undefined` in client
 * bundles, so read these two values from Server Components only.
 */
export const WHATSAPP_NUMBER: string | null =
  process.env.WHATSAPP_NUMBER?.trim() || null;

/** Pre-filled so the first message isn't a blank chat. */
const WHATSAPP_GREETING =
  "Hi Kaisora Systems, I'd like to talk about a project.";

/** `https://wa.me/<digits>?text=…`, or `null` while the number is unset. */
export const WHATSAPP_URL: string | null = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_GREETING)}`
  : null;

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
  /** Opens in a new tab with `noopener noreferrer`. False for `mailto:`. */
  external: boolean;
};

type MaybeLink = Omit<SocialLink, "href"> & { href: string | null };

/**
 * Email, then WhatsApp — the channel Caribbean SMB clients reach for first —
 * then LinkedIn, GitHub (Prompt 19's order) and Instagram.
 */
const ALL_LINKS: readonly MaybeLink[] = [
  {
    label: "Email",
    href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : null,
    icon: MailIcon,
    external: false,
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: WhatsAppIcon,
    external: true,
  },
  { label: "LinkedIn", href: LINKEDIN_URL, icon: LinkedInIcon, external: true },
  { label: "GitHub", href: GITHUB_URL, icon: GitHubIcon, external: true },
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    icon: InstagramIcon,
    external: true,
  },
];

/** Only the links that have a real destination. */
export const SOCIAL_LINKS: readonly SocialLink[] = ALL_LINKS.filter(
  (link): link is SocialLink => link.href !== null,
);
