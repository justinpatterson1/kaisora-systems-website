/**
 * Where the scroll beam's head sits, and which sections it has reached.
 *
 * Positions are document offsets in pixels. `tops` are the section tops in
 * page order; the beam runs from the first to the last. The head follows a
 * line `anchor` of the way down the viewport, so a section lights as its top
 * hairline crosses that line, not when it first peeks in at the bottom.
 */
export type BeamProgress = {
  /** Distance of the head below the beam's start, clamped to its length. */
  head: number;
  /** One flag per section top. */
  reached: boolean[];
};

export function beamProgress(
  scrollY: number,
  viewportHeight: number,
  tops: readonly number[],
  anchor = 0.6,
): BeamProgress {
  if (tops.length === 0) return { head: 0, reached: [] };

  const start = tops[0];
  const length = tops[tops.length - 1] - start;
  const line = scrollY + viewportHeight * anchor;

  return {
    head: Math.min(Math.max(line - start, 0), length),
    reached: tops.map((top) => line >= top),
  };
}
