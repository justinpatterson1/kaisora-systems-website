import type { SVGProps } from "react";

/**
 * The icon set — design-system.md §6.
 *
 * Nineteen stroke glyphs and the three filled brand marks at the bottom of the
 * file. Phone, card and shield left with the sections that used them (Prompt 09
 * refactor); briefcase, database, link, chat and cap arrived with it.
 *
 * Rules that apply to every icon here:
 * - `viewBox="0 0 24 24"`, always. Mixed viewBoxes make sizes stop agreeing.
 * - **No intrinsic size.** Callers set width/height inline or by a CSS rule on
 *   the parent; an icon with neither falls back to the browser's 300×150.
 * - `currentColor` only. That is how icons track the palette and theme for free.
 * - Props spread **last**, so a caller can override any attribute — including
 *   `className`, `style` and `aria-hidden`.
 * - `aria-hidden` by default: icons sit inside a control that owns the
 *   accessible name (coding-standards.md, Accessibility).
 *
 * Stroke weights come from the §6 table, which assigns them per *glyph* rather
 * than per use, because these glyphs get reused at other sizes elsewhere.
 */

export type IconProps = SVGProps<SVGSVGElement>;

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/* ---- 1.8 — category and navigation glyphs ---- */

export function HomeIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <path d="M3 10.75 12 3.5l9 7.25V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0" />
    </svg>
  );
}

export function LayoutIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </svg>
  );
}

export function CodeIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <path d="M9.5 8 5 12l4.5 4" />
      <path d="M14.5 8 19 12l-4.5 4" />
      <path d="M13.2 5.6 10.8 18.4" />
    </svg>
  );
}

/* `CodeIcon` is the chevrons-and-slash glyph; this is the shell window. They
   are easy to confuse — Skills uses this one for Backend Development. */
export function TerminalIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.4" />
      <path d="M6.8 9.6 9.8 12l-3 2.4" />
      <path d="M12.6 15h4.6" />
    </svg>
  );
}

export function GlobeIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M2.8 12h18.4" />
      {/* The two meridians are ellipses rather than arcs so the sphere still
          reads at 20px, where a single curved path flattens into the rim. */}
      <ellipse cx="12" cy="12" rx="4.1" ry="9.2" />
    </svg>
  );
}

/* Two stacked units rather than three: at 20px a third band closes the gaps
   and the glyph reads as a filled block. */
export function ServerIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <rect x="3" y="3.5" width="18" height="7.5" rx="2" />
      <rect x="3" y="13" width="18" height="7.5" rx="2" />
      <path d="M7 7.25h.01M7 16.75h.01" />
    </svg>
  );
}

export function BriefcaseIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2.4" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

/* Three rims on the cylinder rather than two: with two it reads as a tin can
   at 20px. */
export function DatabaseIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13" />
      <path d="M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8" />
    </svg>
  );
}

/* Two interlocking links — System Integration. */
export function LinkIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.24 4.24 0 0 0-6-6l-1 1" />
      <path d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.24 4.24 0 0 0 6 6l1-1" />
    </svg>
  );
}

export function ChatIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l.9-4.7A8.5 8.5 0 1 1 20.5 12Z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </svg>
  );
}

export function CapIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} {...p}>
      <path d="M2.5 9 12 4.5 21.5 9 12 13.5Z" />
      <path d="M6.5 11.2v4.4c0 1.3 2.46 2.9 5.5 2.9s5.5-1.6 5.5-2.9v-4.4" />
      <path d="M21.5 9v5" />
    </svg>
  );
}

/* ---- 1.9 — theme toggle ---- */

export function SunIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.9} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6M18.65 5.35l-1.56 1.56M6.91 17.09l-1.56 1.56M18.65 18.65l-1.56-1.56M6.91 6.91 5.35 5.35" />
    </svg>
  );
}

export function MoonIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.9} {...p}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

/* ---- 2.0 — action glyphs, heavier so they hold up at small sizes ---- */

export function ArrowIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} {...p}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function DownloadIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} {...p}>
      <path d="M12 3.5v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

export function MailIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2.2" />
      <path d="m3.6 6.8 8.4 6.2 8.4-6.2" />
    </svg>
  );
}

/* Used at 13px in the Projects header CTA. The arrow and the corner bracket are
   separate paths so neither joins the other at a shared point — at 13px a
   single path reads as a smudge. */
export function ExternalIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} {...p}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5" />
    </svg>
  );
}

export function BookmarkIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} {...p}>
      <path d="M6 4.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V5.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

/* ---- Kaisora system-graph and service glyphs (1.6 stroke) ---- */

export function MonitorIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function BoltIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12l1-8Z" />
    </svg>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 20c.6-3.3 3.2-5.5 6.5-5.5s5.9 2.2 6.5 5.5" />
      <circle cx="5" cy="9.5" r="2.25" />
      <circle cx="19" cy="9.5" r="2.25" />
      <path d="M1.75 18.5c.3-2 1.6-3.4 3.4-3.8M22.25 18.5c-.3-2-1.6-3.4-3.4-3.8" />
    </svg>
  );
}

export function PersonIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4 3.8-6.5 7.5-6.5s6.7 2.5 7.5 6.5" />
    </svg>
  );
}

export function TriangleIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <path d="M11 2.5 3.5 18.5l8.5 3.5 8.5-3.5Z" />
      <path d="M11 2.5 12 22" />
    </svg>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <path d="M12 2.75 4.5 5.5v6c0 4.6 3.2 8.3 7.5 9.75 4.3-1.45 7.5-5.15 7.5-9.75v-6Z" />
    </svg>
  );
}

export function CardIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <rect x="2.75" y="5" width="18.5" height="14" rx="1.75" />
      <path d="M2.75 10h18.5M6.5 15h3" />
    </svg>
  );
}

export function CloudIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4 4 0 0 1-.5 10Z" />
    </svg>
  );
}

export function LayersIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5Z" />
      <path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
    </svg>
  );
}

export function AlertIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <path d="M12 3.5 2.5 20h19Z" />
      <path d="M12 10v4.5M12 17.25v.01" />
    </svg>
  );
}

/** A generic app mark: a ring around a letter-free chevron, standing in for
    the framework node without borrowing a brand's logo. */
export function AppIcon(p: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.6} {...p}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M9 16V8l6 8V8" />
    </svg>
  );
}

/* ---- Filled brand marks ----

   The one exception to the stroke rules above: these are the brands' own
   marks, and §6 says never to redraw them as strokes. Paths are from Simple
   Icons (CC0), on the same 24×24 viewBox so sizes still agree. */

const FILL = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
} as const;

export function LinkedInIcon(p: IconProps) {
  return (
    <svg {...FILL} {...p}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function InstagramIcon(p: IconProps) {
  return (
    <svg {...FILL} {...p}>
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  );
}

export function GitHubIcon(p: IconProps) {
  return (
    <svg {...FILL} {...p}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
