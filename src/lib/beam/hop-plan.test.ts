import { describe, expect, it } from "vitest";

import { planHop } from "./hop-plan";

describe("planHop", () => {
  it("does nothing when the pulse is where the scroll is", () => {
    expect(planHop(-1, -1)).toEqual({ retract: [], instant: [], travel: null });
    expect(planHop(3, 3)).toEqual({ retract: [], instant: [], travel: null });
  });

  it("lights the first junction without a journey", () => {
    expect(planHop(-1, 0)).toEqual({ retract: [], instant: [0], travel: null });
  });

  it("sends one pulse to the next junction", () => {
    expect(planHop(0, 1)).toEqual({ retract: [], instant: [], travel: 1 });
  });

  it("lights skipped junctions instantly and only travels to the last", () => {
    expect(planHop(0, 4)).toEqual({ retract: [], instant: [1, 2, 3], travel: 4 });
    expect(planHop(-1, 2)).toEqual({ retract: [], instant: [0, 1], travel: 2 });
  });

  it("retracts everything past the target when scrolling back", () => {
    expect(planHop(4, 1)).toEqual({ retract: [4, 3, 2], instant: [], travel: null });
    expect(planHop(2, -1)).toEqual({ retract: [2, 1, 0], instant: [], travel: null });
  });
});
