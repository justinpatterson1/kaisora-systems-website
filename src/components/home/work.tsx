import Image from "next/image";
import Link from "next/link";

import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { Reveal } from "@/components/ui";
import { CASE_STUDIES, caseStudyHref } from "@/lib/content/case-studies";

import { TagList } from "./tag-list";

/**
 * Selected work. SherryBerries is Kaisora's own build and leads. The
 * proprietary case studies are the founder's prior professional work, shown
 * honestly as that, and as the kind of system Kaisora builds from it.
 */
export function Work() {
  const featured = CASE_STUDIES.find((study) => study.kind === "public");
  const experience = CASE_STUDIES.filter((study) => study.kind === "proprietary");

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="wrap">
        <h2 id="work-title" className="section-title">
          Selected work
        </h2>
        <p className="section-lede">
          Every project gets a full write-up: the problem, the architecture,
          the decisions, and what was done to keep it running.
        </p>

        {featured && (
          <Reveal className="featured">
            <div>
              <h3>{featured.title}</h3>
              <p className="featured-meta">
                <span className="live-dot" aria-hidden />
                Kaisora project · {featured.label}
              </p>
              <p>{featured.summary}</p>
              <TagList tags={featured.tags.slice(0, 5)} />
              <div className="featured-actions">
                <Link href={caseStudyHref(featured)} className="btn btn-primary">
                  Read the case study
                  <ArrowIcon width={14} height={14} />
                </Link>
                {featured.liveUrl && (
                  <a
                    href={featured.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    Visit the store
                    <ExternalIcon width={13} height={13} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
            {featured.image && (
              <div className="shot">
                <div className="shot-bar" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>
                <Image
                  src={featured.image.src}
                  width={featured.image.width}
                  height={featured.image.height}
                  alt={featured.image.alt}
                  sizes="(max-width: 980px) 100vw, 620px"
                />
              </div>
            )}
          </Reveal>
        )}

        <div className="experience-head">
          <div>
            <h3>From the founder&apos;s experience</h3>
            <p>
              Systems our founder built in financial services before Kaisora,
              generalized to protect the employer. It is the same kind of work
              we build for clients now.
            </p>
          </div>
        </div>
        <Reveal as="ul" stagger className="capabilities">
          {experience.map((study) => (
            <li key={study.slug} className="capability">
              <Link href={caseStudyHref(study)}>
                <div>
                  <h4>{study.title}</h4>
                  <span className="capability-label">{study.label}</span>
                </div>
                <p>{study.summary}</p>
                <span className="capability-go">
                  Case study
                  <ArrowIcon width={14} height={14} />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
