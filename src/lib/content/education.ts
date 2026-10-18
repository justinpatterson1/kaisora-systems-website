export type Credential = {
  title: string;
  detail: string;
  /** Shown after the title, like a role's sector. Omit when the title names it. */
  institution?: string;
};

/**
 * Education & professional development — Prompt 17.
 *
 * **Completed and in-progress entries are separate lists on purpose**, and the
 * section renders them as visibly different things, so nothing unfinished can
 * read as earned.
 *
 * The university and the IBM credential's title were confirmed by the owner
 * 2026-10-17. TODO(Justin): the BSc graduation year, if it should be shown.
 */
export const COMPLETED: readonly Credential[] = [
  {
    title: "BSc in Computing",
    detail: "Undergraduate degree",
    institution: "University of the Southern Caribbean",
  },
  {
    title: "IBM Backend Development Certificate",
    detail: "Completed backend development certificate program",
  },
] as const;

/**
 * Learning in progress. If a certification exam is ever named here (AWS Cloud
 * Practitioner, CAPM), it stays in this list — labelled In Progress — until it
 * is actually earned.
 */
export const IN_PROGRESS: readonly Credential[] = [
  {
    title: "Cloud Architecture",
    detail: "AWS and cloud infrastructure fundamentals.",
  },
  {
    title: "Application Security",
    detail:
      "OWASP principles, secure application development and web security auditing concepts.",
  },
  {
    title: "System Design",
    detail:
      "Software architecture, design patterns and scalable system design.",
  },
] as const;
