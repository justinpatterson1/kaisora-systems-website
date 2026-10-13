import { Reveal } from "@/components/ui";

const STEPS = [
  {
    title: "Discover",
    body: "We learn how your business runs, where the friction is, and what success has to look like.",
  },
  {
    title: "Design the system",
    body: "We map the data, the integrations and the failure cases before writing code, and agree the scope with you.",
  },
  {
    title: "Build and test",
    body: "We build in small, reviewable pieces and test against real conditions: bad input, slow services, two people at once.",
  },
  {
    title: "Launch and support",
    body: "We deploy with monitoring and backups in place, then stay on to fix, extend and keep it running.",
  },
] as const;

/** How we work. The steps are a real sequence, so they carry numbers. */
export function Process() {
  return (
    <section id="process" className="section" aria-labelledby="process-title">
      <div className="wrap">
        <h2 id="process-title" className="section-title">
          How we work
        </h2>
        <p className="section-lede">
          The same discipline on a five-page website as on a payments system:
          understand the business first, and plan for what goes wrong.
        </p>
        <Reveal as="ol" stagger className="steps">
          {STEPS.map((step) => (
            <li key={step.title} className="step">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
