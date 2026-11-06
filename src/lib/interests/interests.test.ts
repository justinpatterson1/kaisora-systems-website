import { describe, expect, it } from "vitest";

import { EMPTY_INTERESTS, interestReducer, type InterestAction, type InterestState } from "./interests";

const run = (...actions: InterestAction[]): InterestState =>
  actions.reduce(interestReducer, EMPTY_INTERESTS);

describe("interestReducer", () => {
  it("adds an offer once, however often it's clicked", () => {
    const state = run(
      { type: "add-offer", id: "commerce" },
      { type: "add-offer", id: "commerce" },
    );
    expect(state.offerIds).toEqual(["commerce"]);
  });

  it("keeps offers and features in catalogue order", () => {
    const state = run(
      { type: "add-offer", id: "care" },
      { type: "add-offer", id: "business-website" },
      { type: "set-feature", id: "order-notifications", selected: true },
      { type: "set-feature", id: "inventory-alerts", selected: true },
    );
    expect(state.offerIds).toEqual(["business-website", "care"]);
    expect(state.featureIds).toEqual(["inventory-alerts", "order-notifications"]);
  });

  it("ignores IDs that aren't in the catalogue", () => {
    const state = run(
      { type: "add-offer", id: "free-website" },
      { type: "set-feature", id: "blockchain", selected: true },
    );
    expect(state).toEqual(EMPTY_INTERESTS);
  });

  it("selects, deselects and clears features without touching offers", () => {
    const picked = run(
      { type: "add-offer", id: "automation" },
      { type: "set-feature", id: "automated-reports", selected: true },
      { type: "set-feature", id: "automated-reports", selected: true },
      { type: "set-feature", id: "spreadsheet-imports", selected: true },
    );
    expect(picked.featureIds).toEqual(["automated-reports", "spreadsheet-imports"]);

    const removed = interestReducer(picked, {
      type: "set-feature",
      id: "automated-reports",
      selected: false,
    });
    expect(removed.featureIds).toEqual(["spreadsheet-imports"]);

    const cleared = interestReducer(removed, { type: "clear-features" });
    expect(cleared.featureIds).toEqual([]);
    expect(cleared.offerIds).toEqual(["automation"]);
  });

  it("removes an offer", () => {
    const state = run(
      { type: "add-offer", id: "commerce" },
      { type: "add-offer", id: "care" },
      { type: "remove-offer", id: "commerce" },
    );
    expect(state.offerIds).toEqual(["care"]);
  });

  it("lets a solution suggest the service only while it's empty", () => {
    const suggested = run({ type: "suggest-service", value: "E-commerce" });
    expect(suggested.primaryService).toBe("E-commerce");

    const notOverwritten = interestReducer(suggested, {
      type: "suggest-service",
      value: "Business automation",
    });
    expect(notOverwritten.primaryService).toBe("E-commerce");

    const chosen = interestReducer(notOverwritten, { type: "set-service", value: "Not sure yet" });
    expect(chosen.primaryService).toBe("Not sure yet");
  });

  it("returns the same object when nothing changes", () => {
    const state = run({ type: "add-offer", id: "commerce" });
    expect(interestReducer(state, { type: "add-offer", id: "commerce" })).toBe(state);
    expect(interestReducer(state, { type: "remove-offer", id: "care" })).toBe(state);
  });

  it("resets after a sent enquiry", () => {
    const state = run(
      { type: "add-offer", id: "commerce" },
      { type: "set-feature", id: "inventory-alerts", selected: true },
      { type: "set-service", value: "E-commerce" },
      { type: "reset" },
    );
    expect(state).toEqual(EMPTY_INTERESTS);
  });
});
