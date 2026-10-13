import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { Reveal } from "@/components/ui";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/content/contact";
import { SITE_NAME, STUDIO_LOCATION } from "@/lib/content/profile";

import { ThemeToggle } from "./theme-toggle";

/**
 * Start a project, then the footer bar. On every page, so the primary action
 * always lands somewhere. `#contact` is the target of every "Start a project".
 *
 * Email is the primary action and LinkedIn the secondary one. If
 * `CONTACT_EMAIL` is ever unset, the email button disappears and LinkedIn
 * becomes primary.
 */
export function SiteFooter() {
  return (
    <>
      <section id="contact" className="contact" aria-labelledby="contact-title">
        <Reveal className="wrap contact-grid">
          <div>
            <h2 id="contact-title" className="contact-title">
              Start a project.
            </h2>
            <p className="contact-lede">
              Tell us what you&apos;re trying to build, or what&apos;s slowing
              your business down. We&apos;ll reply with honest next steps:
              what it takes, what it costs to run, and whether it&apos;s worth
              building at all.
            </p>
            <div className="contact-actions">
              {CONTACT_EMAIL !== null && (
                <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
                  <MailIcon width={15} height={15} />
                  {CONTACT_EMAIL}
                </a>
              )}
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={CONTACT_EMAIL === null ? "btn btn-primary" : "btn btn-ghost"}
              >
                Message us on LinkedIn
                <ArrowIcon width={14} height={14} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div className="brief">
            <h3>What helps us scope it</h3>
            <ol>
              <li>What your business does, and who will use the system.</li>
              <li>The problem today: what&apos;s manual, slow or breaking.</li>
              <li>What already exists: tools, spreadsheets, data, systems.</li>
              <li>Your timeline, and any date that can&apos;t move.</li>
            </ol>
          </div>
        </Reveal>
      </section>

      <footer className="wrap site-footer">
        <p>
          © {new Date().getFullYear()} {SITE_NAME} · {STUDIO_LOCATION}
        </p>
        <div className="footer-tools">
          {CONTACT_EMAIL !== null && (
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label={`Email ${CONTACT_EMAIL}`}>
              <MailIcon />
            </a>
          )}
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
            <LinkedInIcon />
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
            <GitHubIcon />
          </a>
          <ThemeToggle />
        </div>
      </footer>
    </>
  );
}
