import type { ComponentType } from "react";

import {
  BoltIcon,
  CodeIcon,
  DatabaseIcon,
  LinkIcon,
  MonitorIcon,
  UsersIcon,
  type IconProps,
} from "@/components/icons";

export type Service = {
  /** 1–4 words, sentence case. */
  title: string;
  /** One line, under ~10 words. */
  desc: string;
  /** The component itself, not a string name — no registry to keep in sync. */
  icon: ComponentType<IconProps>;
};

/**
 * What we build. Only what can be delivered today: no mobile apps and no
 * security audits. The homepage now leads with the solution cards in
 * catalogue.ts; these six remain the studio's service list for structured
 * data (`knowsAbout`) and the contact form's options.
 */
export const SERVICES: readonly Service[] = [
  {
    title: "Web applications",
    desc: "Fast, accessible and scalable websites and web apps.",
    icon: MonitorIcon,
  },
  {
    title: "Backend systems & APIs",
    desc: "Reliable APIs and backend services that power your business.",
    icon: CodeIcon,
  },
  {
    title: "Business automation",
    desc: "Streamline operations with custom automation and workflows.",
    icon: BoltIcon,
  },
  {
    title: "Database solutions",
    desc: "Data models, migrations and performance optimisation.",
    icon: DatabaseIcon,
  },
  {
    title: "System integration",
    desc: "Connect your tools, systems and data across platforms.",
    icon: LinkIcon,
  },
  {
    title: "Technical consulting",
    desc: "Strategic guidance for better software decisions.",
    icon: UsersIcon,
  },
] as const;

/**
 * The contact form's "What do you need?" options, and the server's allowlist
 * for that field. The six service titles stay exactly as they were, since
 * enquiries already in the inbox use them; the rest match the solution cards
 * (`SOLUTIONS[].service` in catalogue.ts) and the new offers.
 */
export const SERVICE_OPTIONS: readonly string[] = [
  "Business website",
  "E-commerce",
  ...SERVICES.map((service) => service.title),
  "Custom business systems",
  "AI assistants",
  "Ongoing support",
  "Not sure yet",
];
