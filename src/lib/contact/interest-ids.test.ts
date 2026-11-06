import { describe, expect, it } from "vitest";

import { FEATURES } from "@/lib/content/catalogue";

import { parseInterests } from "./interest-ids";

describe("parseInterests", () => {
  it("accepts nothing selected", () => {
    expect(parseInterests([], [])).toEqual({ ok: true, offers: [], features: [] });
  });

  it("resolves published IDs to catalogue records, once each, in catalogue order", () => {
    const result = parseInterests(
      ["care", "commerce", "commerce"],
      ["order-notifications", "inventory-alerts", "order-notifications"],
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.offers.map((offer) => offer.title)).toEqual(["Kaisora Commerce", "Kaisora Care"]);
    expect(result.features.map((feature) => feature.id)).toEqual([
      "inventory-alerts",
      "order-notifications",
    ]);
  });

  it("rejects an unknown offer or feature", () => {
    expect(parseInterests(["commerce", "premium"], []).ok).toBe(false);
    expect(parseInterests([], ["inventory-alerts", "<script>"]).ok).toBe(false);
  });

  it("rejects file uploads in place of IDs", () => {
    const file = new File(["x"], "x.txt");
    expect(parseInterests([], [file]).ok).toBe(false);
  });

  it("accepts the whole catalogue but no more", () => {
    const all = FEATURES.map((feature) => feature.id);
    expect(parseInterests([], all).ok).toBe(true);
    expect(parseInterests([], [...all, "extra"]).ok).toBe(false);
  });
});
