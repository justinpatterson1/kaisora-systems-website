import type { Architecture } from "@/lib/content/case-studies";

/**
 * A simplified architecture diagram — Prompt 14, §4.
 *
 * Built from HTML lists rather than an image or SVG, so it is text to a screen
 * reader (an ordered list *is* a flow read top to bottom), reflows at any
 * width, and follows the theme and palette for free. The arrows between nodes
 * are CSS decoration only.
 *
 * The optional branch — external services hanging off one node — sits beside
 * the flow on wide screens and below it on narrow ones. The node it connects to
 * is marked with the accent border the branch box also carries, and the branch
 * names it in text, so the link survives without the visual pairing.
 */
export function ArchitectureDiagram({
  architecture,
}: {
  architecture: Architecture;
}) {
  const { flow, branch, caption } = architecture;
  const anchor = branch ? flow[branch.from] : undefined;

  return (
    <figure className="arch">
      <div className={branch ? "arch-grid arch-grid-branch" : "arch-grid"}>
        <ol className="arch-flow" aria-label="Request flow, top to bottom">
          {flow.map((node, i) => (
            <li
              key={node.label}
              className={
                branch && i === branch.from ? "arch-node arch-node-anchor" : "arch-node"
              }
            >
              <span className="arch-node-label">
                {node.label}
              </span>
              <span className="arch-detail">{node.detail}</span>
            </li>
          ))}
        </ol>

        {branch && anchor && (
          <div className="arch-branch">
            <p className="arch-branch-title">{branch.title}</p>
            <p className="arch-branch-from">
              Called from <strong>{anchor.label}</strong>
            </p>
            <ul className="arch-branch-list">
              {branch.nodes.map((node) => (
                <li key={node.label} className="arch-chip">
                  <span>{node.label}</span>
                  <span className="arch-detail">{node.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <figcaption className="arch-caption">
        {caption}
      </figcaption>
    </figure>
  );
}
