import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CaseStudyView } from "@/components/work/case-study";
import {
  CASE_STUDIES,
  caseStudyHref,
  getCaseStudy,
} from "@/lib/content/case-studies";
import { SITE_NAME } from "@/lib/content/profile";

/**
 * `/work/[slug]` — one page per case study (Prompt 14).
 *
 * Every page is prerendered from `CASE_STUDIES`, and `dynamicParams = false`
 * makes any other slug a 404 rather than an on-demand render of nothing.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const title = `${study.title} — Case Study`;
  const url = caseStudyHref(study);

  /* Every top-level key the root layout sets and this page doesn't is
     inherited whole — so `twitter` has to be restated here, or a shared case
     study previews with the homepage's title and description. */
  return {
    title,
    description: study.metaDescription,
    twitter: {
      card: study.socialImage ? "summary_large_image" : "summary",
      title: `${title} | ${SITE_NAME}`,
      description: study.metaDescription,
      ...(study.socialImage && { images: [study.socialImage] }),
    },
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url,
      title: `${title} | ${SITE_NAME}`,
      description: study.metaDescription,
      /* A real screenshot where one exists; otherwise none, rather than a
         generated or borrowed image (Prompt 21). */
      ...(study.socialImage && study.image && {
        images: [
          {
            url: study.socialImage,
            width: 1200,
            height: 630,
            alt: study.image.alt,
          },
        ],
      }),
    },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <CaseStudyView study={study} />
      </main>
      <SiteFooter />
    </>
  );
}
