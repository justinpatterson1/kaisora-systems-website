import type { ComponentType } from "react";

import {
  AlertIcon,
  AppIcon,
  CardIcon,
  CloudIcon,
  CodeIcon,
  DatabaseIcon,
  LayersIcon,
  MailIcon,
  PersonIcon,
  ShieldIcon,
  TriangleIcon,
  type IconProps,
} from "@/components/icons";

export type SystemNode = {
  label: string;
  sub: string;
  icon: ComponentType<IconProps>;
};

/**
 * The live system on the homepage: SherryBerries in production, drawn from
 * the same architecture as its case study (`case-studies.ts`). Every label is
 * a real part of that system — keep the two in step.
 */
export const SYSTEM_NAME = "sherryberries / production";

/** The request path, left to right. */
export const SYSTEM_PATH: readonly SystemNode[] = [
  { label: "Customer", sub: "Web / Mobile", icon: PersonIcon },
  { label: "Next.js app", sub: "Frontend", icon: AppIcon },
  { label: "API routes", sub: "Serverless", icon: CodeIcon },
  { label: "Prisma", sub: "ORM", icon: TriangleIcon },
  { label: "PostgreSQL", sub: "Database", icon: DatabaseIcon },
];

/** The services the API routes call, left to right. */
export const SYSTEM_SERVICES: readonly SystemNode[] = [
  { label: "Auth.js", sub: "Authentication", icon: ShieldIcon },
  { label: "WiPay payments", sub: "Payments", icon: CardIcon },
  { label: "Resend email", sub: "Email", icon: MailIcon },
  { label: "Cloudflare R2", sub: "Object storage", icon: CloudIcon },
  /* The comp said "Caching"; the store uses Redis for rate limiting. */
  { label: "Upstash Redis", sub: "Rate limiting", icon: LayersIcon },
  { label: "Sentry", sub: "Error tracking", icon: AlertIcon },
];

/**
 * Events the strip cycles through, each something the real store does
 * (see the SherryBerries case study). Pairs: left, right.
 */
export const SYSTEM_EVENTS: readonly (readonly [string, string])[] = [
  ["checkout · stock reserved", "payment callback · idempotent"],
  ["receipt uploaded · R2 private", "admin review · payment approved"],
  ["order confirmed · email sent", "promo code · applied once"],
];
