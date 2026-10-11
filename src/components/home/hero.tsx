import { ArrowIcon } from "@/components/icons";
import { START_PROJECT_HREF } from "@/lib/content/nav";

import { SystemPanel } from "./system-panel";

/**
 * The opening: the offer in one line, the primary action, and proof right
 * under it — a real production system at work, not a claim about one.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bloom" aria-hidden />
      <div className="wrap">
        <h1 id="hero-title" className="hero-title">
          Software that holds up in production.
        </h1>
        <p className="hero-lede">
          Kaisora Systems designs and builds web <strong>applications</strong>,
          online stores, backend systems and automation for{" "}
          <strong>Caribbean</strong> businesses, established companies and
          founders.
        </p>
        <div className="hero-actions">
          <a href={START_PROJECT_HREF} className="btn btn-primary">
            Start a project
            <ArrowIcon width={14} height={14} />
          </a>
          <a href="#work" className="btn btn-ghost">
            See our work
          </a>
        </div>

        <SystemPanel />
      </div>
    </section>
  );
}
