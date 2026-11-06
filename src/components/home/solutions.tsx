import { ArrowIcon } from "@/components/icons";
import { InterestLink } from "@/components/interests/interest-link";
import { Reveal } from "@/components/ui";
import { CAPABILITIES, INDUSTRY_EXAMPLES, SOLUTIONS } from "@/lib/content/catalogue";

/**
 * Solutions for your business: four problems a visitor recognises, each
 * leading to the enquiry with its service filled in. Replaces the old
 * "What we build" grid, so it also answers the `#services` links already out
 * in the world.
 */
export function Solutions() {
  return (
    <section id="solutions" className="section" aria-labelledby="solutions-title">
      {/* Old inbound links to /#services land here. */}
      <span id="services" className="anchor-alias" aria-hidden />
      <div className="wrap">
        <h2 id="solutions-title" className="section-title">
          Solutions for your business
        </h2>
        <p className="section-lede">
          Start from the problem. Each one leads to the enquiry form with your
          interest already filled in.
        </p>

        <Reveal as="ul" stagger className="solutions">
          {SOLUTIONS.map((solution) => (
            <li key={solution.id} className="solution">
              <h3>{solution.title}</h3>
              <p>{solution.body}</p>
              <p className="solution-includes">{solution.includes}</p>
              <InterestLink service={solution.service} className="text-link">
                {solution.cta}
                <ArrowIcon width={14} height={14} />
              </InterestLink>
            </li>
          ))}
        </Reveal>

        <div className="capability-line">
          <h3>We also build</h3>
          <ul>
            {CAPABILITIES.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </div>

        <h3 className="examples-title">What this could look like</h3>
        <ul className="examples">
          {INDUSTRY_EXAMPLES.map((example) => (
            <li key={example.title}>
              <h4>{example.title}</h4>
              <p>{example.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
