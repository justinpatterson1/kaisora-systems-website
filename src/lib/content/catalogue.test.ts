import { describe, expect, it } from "vitest";

import { CASE_STUDIES, caseStudyHref } from "./case-studies";
import { FAQS, FEATURES, OFFER_IDS, OFFERS, SOLUTIONS, type Evidence } from "./catalogue";
import { SERVICE_OPTIONS } from "./services";

/* The catalogue is also the enquiry's allowlist, so its integrity is
   behaviour, not copy. */
describe("catalogue integrity", () => {
  it("has unique IDs", () => {
    const featureIds = FEATURES.map((feature) => feature.id);
    expect(new Set(featureIds).size).toBe(featureIds.length);
    expect(OFFERS.map((offer) => offer.id)).toEqual([...OFFER_IDS]);
    expect(new Set(SOLUTIONS.map((solution) => solution.id)).size).toBe(SOLUTIONS.length);
  });

  it("gives every feature a description and what it needs", () => {
    for (const feature of FEATURES) {
      expect(feature.description.length, feature.id).toBeGreaterThan(10);
      expect(feature.needs.length, feature.id).toBeGreaterThan(5);
    }
  });

  it("only relates features to published offers", () => {
    for (const feature of FEATURES) {
      for (const offerId of feature.relatedOfferIds) {
        expect(OFFER_IDS, feature.id).toContain(offerId);
      }
    }
  });

  it("only fills the form's service select with options it accepts", () => {
    for (const solution of SOLUTIONS) {
      expect(SERVICE_OPTIONS, solution.id).toContain(solution.service);
    }
  });

  it("only links evidence to existing case studies, labelling prior work as such", () => {
    const evidence: Evidence[] = [
      ...FEATURES.flatMap((feature) => feature.evidence ?? []),
      ...OFFERS.flatMap((offer) => offer.evidence ?? []),
    ];
    const studies = new Map(CASE_STUDIES.map((study) => [caseStudyHref(study), study]));

    for (const { href, label } of evidence) {
      const study = studies.get(href);
      expect(study, href).toBeDefined();
      if (study?.kind === "proprietary") expect(label, href).toMatch(/^Prior experience/);
    }
  });

  it("has no duplicate questions", () => {
    expect(new Set(FAQS.map((item) => item.question)).size).toBe(FAQS.length);
  });
});
