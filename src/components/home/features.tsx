import { FeatureCatalogue } from "./feature-catalogue";

/** Features built around your business: the heading, then the catalogue. */
export function Features() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="wrap">
        <h2 id="features-title" className="section-title">
          Features built around your business.
        </h2>
        <p className="section-lede section-lede-wide">
          Pick the capabilities you&apos;re interested in and we&apos;ll sketch
          the system they make, with what each one needs from you. Availability
          depends on your existing tools, provider access and project
          requirements.
        </p>
        <FeatureCatalogue />
      </div>
    </section>
  );
}
