import type { Feature, FeatureCategory } from "@/lib/content/catalogue";

export type FeatureFilter = {
  /** "all" or one category. */
  category: FeatureCategory | "all";
  /** Free text, matched against titles and descriptions. */
  query: string;
};

export const NO_FILTER: FeatureFilter = { category: "all", query: "" };

/**
 * The features that pass both the category and the search. Matching is
 * case-insensitive, every word of the query must appear somewhere in the
 * title or description, and the catalogue's order is kept.
 */
export function filterFeatures(
  features: readonly Feature[],
  { category, query }: FeatureFilter,
): Feature[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return features.filter((feature) => {
    if (category !== "all" && feature.category !== category) return false;
    if (words.length === 0) return true;
    const haystack = `${feature.title} ${feature.description}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}

export function isFiltered({ category, query }: FeatureFilter): boolean {
  return category !== "all" || query.trim() !== "";
}
