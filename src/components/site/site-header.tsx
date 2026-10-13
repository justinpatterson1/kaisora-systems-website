import { NAV_ITEMS, START_PROJECT_HREF } from "@/lib/content/nav";

import { Wordmark } from "./wordmark";

/** The one header, on every page: wordmark, section links, primary action. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Wordmark />
        <nav className="site-nav" aria-label="Primary">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`/#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={START_PROJECT_HREF} className="btn btn-primary btn-sm">
          Start a project
        </a>
      </div>
    </header>
  );
}
