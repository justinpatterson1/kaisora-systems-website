import {
  SYSTEM_EVENTS,
  SYSTEM_NAME,
  SYSTEM_PATH,
  SYSTEM_SERVICES,
  type SystemNode,
} from "@/lib/content/system";

import { SystemStrip } from "./system-strip";

/**
 * The live system panel: SherryBerries' production architecture, with
 * requests travelling the main path and out to the services it calls.
 *
 * It is a figure, and its structure is real lists, so a screen reader hears
 * the request path and the services in order. The links and pulses are
 * decoration and hidden from assistive tech.
 *
 * Connector geometry (`LINKS`) is in a 1000 × 76 box stretched over the
 * service row. The six service columns centre at 7.3%, 24.4%, 41.5%, 58.5%,
 * 75.6% and 92.7% of that row; the three trunks drop from the API node at the
 * row's centre.
 */
const LINKS = [
  /* left trunk → Auth.js, with drops to WiPay and Resend */
  "M479 0 V30 Q479 41 468 41 H85 Q73 41 73 53 V76",
  "M256 41 Q244 41 244 53 V76",
  "M427 41 Q415 41 415 53 V76",
  /* centre trunk → Cloudflare R2 */
  "M500 0 V48 Q500 58 512 58 H573 Q585 58 585 70 V76",
  /* right trunk → Sentry, with a drop to Redis */
  "M521 0 V30 Q521 41 532 41 H915 Q927 41 927 53 V76",
  "M744 41 Q756 41 756 53 V76",
];

/** Where the bus lines carry a junction dot. */
const JUNCTIONS: readonly [number, number][] = [
  [244, 41],
  [415, 41],
  [756, 41],
  [585, 58],
];

export function SystemPanel() {
  return (
    <figure className="system" aria-labelledby="system-title">
      <div className="system-head">
        <p id="system-title" className="system-title mono">
          <span className="live-dot" aria-hidden />
          {SYSTEM_NAME}
        </p>
        <p className="system-status mono" aria-hidden>
          <span className="live-dot" />
          Live system
          <span className="system-env">production</span>
        </p>
      </div>

      <div className="system-body">
        <div className="graph-main">
          {/* Ticks sit on the hairline midway between nodes; pulses travel it. */}
          {[20, 40, 60, 80].map((left) => (
            <span key={left} className="graph-tick" style={{ left: `${left}%` }} aria-hidden />
          ))}
          <span className="graph-pulse" aria-hidden />
          <span className="graph-pulse" aria-hidden />
          <ol className="graph-main-list" aria-label="Request path">
            {SYSTEM_PATH.map((node) => (
              <li key={node.label}>
                <Node node={node} />
              </li>
            ))}
          </ol>
        </div>

        <div className="graph-branch-wrap">
          <svg
            className="graph-links"
            viewBox="0 0 1000 76"
            preserveAspectRatio="none"
            aria-hidden
          >
            {LINKS.map((d) => (
              <path key={d} d={d} />
            ))}
            {LINKS.map((d, i) => (
              <path
                key={`pulse-${d}`}
                d={d}
                pathLength={100}
                className="link-pulse"
                style={{ animationDelay: `${(i * 0.55).toFixed(2)}s` }}
              />
            ))}
          </svg>
          {/* Junction dots in HTML, so the stretched SVG can't squash them. */}
          {JUNCTIONS.map(([x, y]) => (
            <span
              key={`${x}-${y}`}
              className="graph-tick"
              style={{
                left: `calc(14px + (100% - 28px) * ${x / 1000})`,
                top: `${y}px`,
              }}
              aria-hidden
            />
          ))}
          <ul className="graph-branch" aria-label="Services called by the API routes">
            {SYSTEM_SERVICES.map((node) => (
              <li key={node.label}>
                <Node node={node} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="system-foot">
        <SystemStrip events={SYSTEM_EVENTS} />
      </div>
    </figure>
  );
}

function Node({ node }: { node: SystemNode }) {
  const { label, sub, icon: Icon } = node;
  return (
    <div className="node">
      <Icon />
      <span>
        <span className="node-label">{label}</span>
        <span className="node-sub mono">{sub}</span>
      </span>
    </div>
  );
}
