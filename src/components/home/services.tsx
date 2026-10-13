import { Reveal } from "@/components/ui";
import { SERVICES } from "@/lib/content/services";

/** What we build: the six services, as one scannable grid. */
export function Services() {
  return (
    <section id="services" className="section section-first" aria-labelledby="services-title">
      <div className="wrap">
        <h2 id="services-title" className="section-title">
          What we build
        </h2>
        <Reveal as="ul" stagger className="services">
          {SERVICES.map(({ title, desc, icon: Icon }) => (
            <li key={title} className="service">
              <Icon />
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
