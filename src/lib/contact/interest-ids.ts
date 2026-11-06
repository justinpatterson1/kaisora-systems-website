import { FEATURES, OFFERS, getFeature, getOffer, type Feature, type Offer } from "@/lib/content/catalogue";

/** The form posts one `offer` and one `feature` field per selection. */
export const OFFER_FIELD = "offer";
export const FEATURE_FIELD = "feature";

export type ParsedInterests =
  | { ok: true; offers: Offer[]; features: Feature[] }
  | { ok: false };

/**
 * Turns the submitted IDs into catalogue records. Duplicates collapse to one;
 * anything that isn't a published ID — or more values than the catalogue
 * holds — rejects the whole set, since the real form can't produce it.
 */
export function parseInterests(
  rawOffers: readonly FormDataEntryValue[],
  rawFeatures: readonly FormDataEntryValue[],
): ParsedInterests {
  const offerIds = unique(rawOffers);
  const featureIds = unique(rawFeatures);
  if (!offerIds || !featureIds) return { ok: false };
  if (offerIds.length > OFFERS.length || featureIds.length > FEATURES.length) {
    return { ok: false };
  }

  const offers = offerIds.map(getOffer);
  const features = featureIds.map(getFeature);
  if (offers.includes(undefined) || features.includes(undefined)) return { ok: false };

  return {
    ok: true,
    offers: OFFERS.filter((offer) => offers.includes(offer)),
    features: FEATURES.filter((feature) => features.includes(feature)),
  };
}

/** Distinct string values, or null if a value is a file upload. */
function unique(values: readonly FormDataEntryValue[]): string[] | null {
  const seen = new Set<string>();
  for (const value of values) {
    if (typeof value !== "string") return null;
    seen.add(value);
  }
  return [...seen];
}
