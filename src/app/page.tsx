import { Founder } from "@/components/home/founder";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { Services } from "@/components/home/services";
import { Work } from "@/components/home/work";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

/**
 * The homepage, in the order a prospective client needs it: the offer with a
 * live system as proof, what we build, the work, how we work, who builds it,
 * then how to start. Keep NAV_ITEMS in step with the section ids.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Services />
        <Work />
        <Process />
        <Founder />
      </main>
      <SiteFooter />
    </>
  );
}
