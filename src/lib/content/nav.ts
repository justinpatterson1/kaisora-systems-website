export type NavItem = {
  /** The homepage section's element id. */
  id: string;
  label: string;
};

/**
 * The header navigation, in page order. Links are written as `/#id` so they
 * work from the case-study pages too; on the homepage they scroll in place.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { id: "work", label: "Work" },
  { id: "solutions", label: "Solutions" },
  { id: "features", label: "Features" },
  { id: "process", label: "Process" },
  { id: "founder", label: "About" },
] as const;

/** The one primary action, everywhere on the site. */
export const START_PROJECT_HREF = "/#contact";
