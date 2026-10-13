import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { TagList } from "@/components/home/tag-list";
import { ArrowIcon, ExternalIcon, GitHubIcon } from "@/components/icons";
import {
  CONFIDENTIALITY_NOTE,
  type CaseStudy,
  type Titled,
} from "@/lib/content/case-studies";

import { ArchitectureDiagram } from "./architecture-diagram";

/** The nine sections, in order. `id`s double as the contents links. */
const SECTIONS = [
  { id: "overview", title: "Overview" },
  { id: "problem", title: "The problem" },
  { id: "solution", title: "The solution" },
  { id: "architecture", title: "Architecture" },
  { id: "decisions", title: "Key engineering decisions" },
  { id: "challenges", title: "Challenges" },
  { id: "reliability", title: "Reliability & security" },
  { id: "impact", title: "Results & impact" },
  { id: "technologies", title: "Technologies" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/**
 * The case-study template. Every case study renders from its `CASE_STUDIES`
 * record, so adding a project is data, not layout.
 *
 * A public project is Kaisora's own work and gets its screenshot, live link
 * and repository. A proprietary one is the founder's prior professional work:
 * it says so, carries the confidentiality notice, and never links to code.
 */
export function CaseStudyView({ study }: { study: CaseStudy }) {
  const isPublic = study.kind === "public";

  const body: Record<SectionId, ReactNode> = {
    overview: <Paragraphs items={study.overview} />,
    problem: <Paragraphs items={study.problem} />,
    solution: (
      <>
        <p className="cs-p">{study.solution.intro}</p>
        <Bullets items={study.solution.points} />
      </>
    ),
    architecture: <ArchitectureDiagram architecture={study.architecture} />,
    decisions: <TitledList items={study.decisions} />,
    challenges: <TitledList items={study.challenges} />,
    reliability: <TitledList items={study.reliability} grid />,
    impact: <Bullets items={study.impact} />,
    technologies: <TagList tags={study.technologies} />,
  };

  return (
    <article>
      <header className="cs-head">
        <div className="wrap">
          <Link href="/#work" className="cs-back">
            <ArrowIcon width={14} height={14} className="rotate-180" />
            Selected work
          </Link>

          <h1 className="cs-title">{study.title}</h1>
          <p className="cs-kind">
            {isPublic ? "Kaisora project" : "Founder's prior work, generalized"}
          </p>
          <p className="cs-lede">{study.summary}</p>

          <TagList tags={study.tags} />

          {isPublic ? (
            (study.liveUrl || study.repoUrl) && (
              <div className="cs-actions">
                {study.liveUrl && (
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Visit the website
                    <ExternalIcon width={13} height={13} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {study.repoUrl && (
                  <a
                    href={study.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    <GitHubIcon width={14} height={14} />
                    View source
                    <span className="sr-only"> on GitHub (opens in a new tab)</span>
                  </a>
                )}
              </div>
            )
          ) : (
            <p className="cs-notice">{CONFIDENTIALITY_NOTE}</p>
          )}

          {study.image && (
            <div className="cs-shot shot">
              <div className="shot-bar" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <Image
                src={study.image.src}
                width={study.image.width}
                height={study.image.height}
                alt={study.image.alt}
                sizes="(max-width: 1240px) 100vw, 1192px"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          )}
        </div>
      </header>

      <div className="wrap cs-layout">
        <nav aria-label="Case study sections" className="cs-toc">
          <p>Contents</p>
          <ol>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="cs-section"
            >
              <h2 id={`${section.id}-title`} className="cs-h2">
                {section.title}
              </h2>
              {body[section.id]}
            </section>
          ))}

          <Link href="/#work" className="cs-back cs-end">
            <ArrowIcon width={14} height={14} className="rotate-180" />
            Back to selected work
          </Link>
        </div>
      </div>
    </article>
  );
}

function Paragraphs({ items }: { items: readonly string[] }) {
  return items.map((text) => (
    <p key={text} className="cs-p">
      {text}
    </p>
  ));
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="cs-bullets">
      {items.map((text) => (
        <li key={text}>{text}</li>
      ))}
    </ul>
  );
}

/** Titled cards; `grid` lays them out two-up on wide screens. */
function TitledList({ items, grid }: { items: readonly Titled[]; grid?: boolean }) {
  return (
    <ul className={grid ? "cs-cards cs-cards-grid" : "cs-cards"}>
      {items.map((item) => (
        <li key={item.title} className="cs-card">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
