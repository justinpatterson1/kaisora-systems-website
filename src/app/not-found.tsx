import type { Metadata } from "next";
import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * Every unknown URL, including any `/work/…` slug not in `CASE_STUDIES`.
 * Same header and footer as every page, so a dead link still lands on the
 * site with the way forward in reach.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="not-found">
          <div className="wrap">
            <h1 className="section-title">This page doesn&apos;t exist (404).</h1>
            <p className="section-lede">
              The link may be out of date, or the address mistyped. Everything
              on the site is reachable from the homepage.
            </p>
            <div className="hero-actions" style={{ marginTop: 28 }}>
              <Link href="/" className="btn btn-primary">
                Back to the homepage
                <ArrowIcon width={14} height={14} />
              </Link>
              <Link href="/#work" className="btn btn-ghost">
                See selected work
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
