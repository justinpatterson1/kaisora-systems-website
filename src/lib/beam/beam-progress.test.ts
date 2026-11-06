import { describe, expect, it } from "vitest";

import { beamProgress } from "./beam-progress";

const TOPS = [1000, 2000, 3500];

describe("beamProgress", () => {
  it("hasn't started while the first section is below the anchor line", () => {
    expect(beamProgress(0, 1000, TOPS)).toEqual({ head: 0, reached: [false, false, false] });
  });

  it("follows the anchor line and lights each section it has passed", () => {
    // Anchor line at 1600 + 600 = 2200.
    expect(beamProgress(1600, 1000, TOPS)).toEqual({ head: 1200, reached: [true, true, false] });
  });

  it("lights a section exactly as its top reaches the line", () => {
    expect(beamProgress(1400, 1000, TOPS).reached).toEqual([true, true, false]);
  });

  it("stops at the last section", () => {
    expect(beamProgress(9000, 1000, TOPS)).toEqual({ head: 2500, reached: [true, true, true] });
  });

  it("handles a page with no sections", () => {
    expect(beamProgress(500, 1000, [])).toEqual({ head: 0, reached: [] });
  });
});
