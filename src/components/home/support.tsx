import { InterestLink } from "@/components/interests/interest-link";
import { Reveal } from "@/components/ui";
import { SUPPORT_COVERAGE } from "@/lib/content/catalogue";

/**
 * After launch: why running a system costs something different from building
 * it, and examples of what support can cover. No response times, uptime or
 * "unlimited" anything: coverage is agreed per proposal.
 */
export function Support() {
  return (
    <section id="support" className="section" aria-labelledby="support-title">
      <Reveal className="wrap support">
        <div>
          <h2 id="support-title" className="section-title">
            After launch
          </h2>
          <p className="section-lede">
            Building a system and running it cost different things. The build
            is a one-off project. Keeping it healthy is ongoing work, and we
            agree it separately so you know what you&apos;re paying for.
          </p>
          <p className="section-lede">
            New features are scoped on their own unless your support agreement
            includes an allowance for changes.
          </p>
          <p className="section-lede support-terms">
            Coverage, response arrangements and ongoing costs are agreed in
            your proposal.
          </p>
          <div className="support-action">
            <InterestLink offerId="care" className="btn btn-ghost">
              Ask about support
            </InterestLink>
          </div>
        </div>

        <dl className="coverage" aria-label="Examples of what support can cover">
          {SUPPORT_COVERAGE.map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
