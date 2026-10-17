import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Reveal } from "@/components/ui";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/content/contact";
import { COMPLETED, IN_PROGRESS } from "@/lib/content/education";
import { ROLES } from "@/lib/content/experience";
import { PERSON_NAME, PERSON_TITLE } from "@/lib/content/profile";

/**
 * The person behind the studio. Kaisora is founder-led, so who does the work
 * is part of the offer, but this is one section, not the site. No photo until
 * there is a proper headshot: the name and links hold the left column.
 */
export function Founder() {
  const role = ROLES[0];

  return (
    <section id="founder" className="section" aria-labelledby="founder-title">
      <div className="wrap">
        <h2 id="founder-title" className="section-title">
          Who builds it
        </h2>
        <Reveal className="founder">
          <div className="founder-id">
            <p className="founder-name">{PERSON_NAME}</p>
            <p className="founder-role">Founder · {PERSON_TITLE}</p>

            <div className="founder-links">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                <LinkedInIcon />
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                <GitHubIcon />
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div className="founder-bio">
            <p>
              Kaisora is led by Justin, a software developer and systems analyst
              with a background in IT, financial technology and business
              systems. He designs and builds every Kaisora project directly, so
              there is no hand-off to a team you never meet.
            </p>
            <p>
              His work sits between software and operations: building
              applications, integrating external systems, automating repetitive
              workflows, and turning complex business rules into software that
              keeps working.
            </p>

            <dl className="facts">
              <div>
                <dt>Experience</dt>
                <dd>
                  <ul>
                    <li>
                      {role.title} <span>· {role.sector}</span>
                    </li>
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd>
                  <ul>
                    {COMPLETED.map((item) => (
                      <li key={item.title}>{item.title}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Day to day</dt>
                <dd>
                  <ul>
                    <li>SQL Server, APIs and scheduled automation</li>
                    <li>Next.js, TypeScript and PostgreSQL</li>
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Currently studying</dt>
                <dd>
                  <ul>
                    {IN_PROGRESS.map((item) => (
                      <li key={item.title}>{item.title}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
