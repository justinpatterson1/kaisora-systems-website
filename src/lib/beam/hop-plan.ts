/**
 * Which junctions the pulse should light next, given how far it has got
 * (`arrived`, the last lit junction, or -1) and how far the scroll has got
 * (`target`, the last reached junction, or -1).
 *
 * - Scrolling back retracts every junction past the target at once.
 * - Moving on lights the target with one travelling pulse from the junction
 *   before it. If the scroll jumped several sections, the ones in between
 *   light instantly, so a nav click doesn't queue a chain of hops.
 * - The first junction has nothing to travel from, so it simply lights.
 */
export type HopPlan = {
  /** Junctions to switch off, highest first. */
  retract: number[];
  /** Junctions to light immediately, in order. */
  instant: number[];
  /** The junction a pulse should travel to, or null. */
  travel: number | null;
};

export function planHop(arrived: number, target: number): HopPlan {
  if (target < arrived) {
    const retract: number[] = [];
    for (let i = arrived; i > target; i--) retract.push(i);
    return { retract, instant: [], travel: null };
  }

  if (target === arrived) return { retract: [], instant: [], travel: null };

  const instant: number[] = [];
  for (let i = arrived + 1; i < target; i++) instant.push(i);

  return target === 0
    ? { retract: [], instant: [0], travel: null }
    : { retract: [], instant, travel: target };
}
