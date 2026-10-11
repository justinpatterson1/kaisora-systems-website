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
 * security audits. Copy follows the approved homepage comp.
 *
 * Keep the count at six: it fills 3 × 2, 2 × 3 and 1 × 6 cleanly.
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
