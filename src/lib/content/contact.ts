import type { ComponentType } from "react";

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
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

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
  /** Opens in a new tab with `noopener noreferrer`. False for `mailto:`. */
  external: boolean;
};

type MaybeLink = Omit<SocialLink, "href"> & { href: string | null };

/** Email, LinkedIn, GitHub — Prompt 19's priority order — then Instagram. */
const ALL_LINKS: readonly MaybeLink[] = [
  {
    label: "Email",
    href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : null,
    icon: MailIcon,
    external: false,
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
