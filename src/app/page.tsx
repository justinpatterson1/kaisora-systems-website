import { Faq } from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Founder } from "@/components/home/founder";
import { Hero } from "@/components/home/hero";
import { Offers } from "@/components/home/offers";
import { Process } from "@/components/home/process";
import { ScrollBeam } from "@/components/home/scroll-beam";
import { Solutions } from "@/components/home/solutions";
import { Support } from "@/components/home/support";
import { Work } from "@/components/home/work";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

/**
 * The homepage, in the order a prospective client needs it: the offer with a
 * live system as proof, the work, the problems we solve, how to engage, the
 * features to pick from, how we work, what running it involves, who builds
 * it, questions, then how to start (the contact section in SiteFooter).
 * Keep NAV_ITEMS in step with the section ids.
 *
 * `.beam-scope` wraps the sections so the scroll beam can run from Selected
 * work down to the contact section, which SiteFooter renders.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <div className="beam-scope">
        <ScrollBeam />
        <main id="main">
          <Hero />
          <Work />
          <Solutions />
          <Offers />
          <Features />
          <Process />
          <Support />
          <Founder />
          <Faq />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
