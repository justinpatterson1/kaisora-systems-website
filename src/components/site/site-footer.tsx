import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { Reveal } from "@/components/ui";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/content/contact";
import { SITE_NAME, STUDIO_LOCATION } from "@/lib/content/profile";

import { ContactForm } from "./contact-form";
import { ThemeToggle } from "./theme-toggle";

/**
 * Start a project, then the footer bar. On every page, so the primary action
 * always lands somewhere. `#contact` is the target of every "Start a project".
 *
 * The enquiry form is the primary action whenever it can send
 * (`RESEND_API_KEY` is set); email and LinkedIn sit beside it as ghost
 * buttons. Without the key the form is not rendered, and email (or, failing
 * that, LinkedIn) becomes the primary button.
 */
export function SiteFooter() {
  const formEnabled = Boolean(process.env.RESEND_API_KEY) && CONTACT_EMAIL !== null;
  const brief = (
    <div className={formEnabled ? "brief brief-plain" : "brief"}>
      <h3>What helps us scope it</h3>
      <ol>
        <li>What your business does, and who will use the system.</li>
        <li>The problem today: what&apos;s manual, slow or breaking.</li>
        <li>What already exists: tools, spreadsheets, data, systems.</li>
        <li>Your timeline, and any date that can&apos;t move.</li>
      </ol>
    </div>
  );

  const intro = (
    <>
      <h2 id="contact-title" className="contact-title">
        Start a project.
      </h2>
      <p className="contact-lede">
        Tell us what you&apos;re trying to build, or what&apos;s slowing
        your business down. We&apos;ll reply with honest next steps:
        what it takes, what it costs to run, and whether it&apos;s worth
        building at all.
      </p>
    </>
  );

  const actions = (
    <div className="contact-actions">
      {CONTACT_EMAIL !== null && (
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className={formEnabled ? "btn btn-ghost" : "btn btn-primary"}
        >
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
  );

  return (
    <>
      <section id="contact" className="contact" aria-labelledby="contact-title">
        {formEnabled ? (
          /* Intro, form, then brief + direct links: the order a phone reads
             them in. On wide screens the form spans the right column. */
          <Reveal className="wrap contact-grid contact-grid-form">
            <div className="contact-intro">{intro}</div>
            <ContactForm />
            <div className="contact-aside">
              {brief}
              {actions}
            </div>
          </Reveal>
        ) : (
          <Reveal className="wrap contact-grid">
            <div>
              {intro}
              {actions}
            </div>
            {brief}
          </Reveal>
        )}
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
