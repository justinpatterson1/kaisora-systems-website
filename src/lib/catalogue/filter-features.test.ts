import { describe, expect, it } from "vitest";

import { FEATURES } from "@/lib/content/catalogue";

import { NO_FILTER, filterFeatures, isFiltered } from "./filter-features";

const ids = (features: { id: string }[]) => features.map((feature) => feature.id);

describe("filterFeatures", () => {
  it("returns the whole catalogue, in order, with no filter", () => {
    expect(ids(filterFeatures(FEATURES, NO_FILTER))).toEqual(ids([...FEATURES]));
  });

  it("narrows by category", () => {
    const result = filterFeatures(FEATURES, { category: "commerce", query: "" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((feature) => feature.category === "commerce")).toBe(true);
  });

  it("searches titles and descriptions, ignoring case", () => {
    expect(ids(filterFeatures(FEATURES, { category: "all", query: "STOCK" }))).toContain(
      "inventory-alerts",
    );
    // "receipts" only appears in a description.
    expect(ids(filterFeatures(FEATURES, { category: "all", query: "receipts" }))).toEqual(
      expect.arrayContaining(["quotes-invoices", "document-extraction"]),
    );
  });

  it("combines category and search", () => {
    const anyCategory = filterFeatures(FEATURES, { category: "all", query: "payment" });
    const commerceOnly = filterFeatures(FEATURES, { category: "commerce", query: "payment" });

    expect(ids(anyCategory)).toEqual(
      expect.arrayContaining(["local-payments", "payment-reconciliation"]),
    );
    expect(ids(commerceOnly)).toContain("local-payments");
    expect(ids(commerceOnly)).not.toContain("payment-reconciliation");
  });

  it("requires every word of a multi-word search", () => {
    expect(ids(filterFeatures(FEATURES, { category: "all", query: "order  updates" }))).toEqual([
      "order-notifications",
    ]);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterFeatures(FEATURES, { category: "integrations", query: "invoice" })).toEqual([]);
  });

  it("treats a blank search as no search", () => {
    expect(filterFeatures(FEATURES, { category: "all", query: "   " })).toHaveLength(
      FEATURES.length,
    );
    expect(isFiltered({ category: "all", query: "   " })).toBe(false);
    expect(isFiltered({ category: "operations", query: "" })).toBe(true);
  });
});
