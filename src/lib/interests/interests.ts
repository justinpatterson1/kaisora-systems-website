import { FEATURES, OFFERS, getFeature, getOffer, type OfferId } from "@/lib/content/catalogue";

/**
 * What the visitor has said they're interested in, gathered from the offer,
 * solution and feature controls and attached to their enquiry. Held in memory
 * for the visit only: no storage, no account.
 *
 * The primary service mirrors the form's "What do you need?" select. Offers
 * and features are separate lists, so a later click never overwrites an
 * earlier choice or anything typed into the form.
 */
export type InterestState = {
  primaryService: string;
  offerIds: readonly OfferId[];
  featureIds: readonly string[];
};

export type InterestAction =
  | { type: "add-offer"; id: string }
  | { type: "remove-offer"; id: string }
  | { type: "set-feature"; id: string; selected: boolean }
  | { type: "clear-features" }
  /** The visitor chose an option in the select. */
  | { type: "set-service"; value: string }
  /** A solution card was clicked: fill the select only if it's still empty. */
  | { type: "suggest-service"; value: string }
  | { type: "reset" };

export const EMPTY_INTERESTS: InterestState = {
  primaryService: "",
  offerIds: [],
  featureIds: [],
};

/* Catalogue order, so the summary and the email list things the same way
   whatever order they were picked in. */
const OFFER_ORDER = OFFERS.map((offer) => offer.id);
const FEATURE_ORDER = FEATURES.map((feature) => feature.id);

function inOrder<T extends string>(ids: Iterable<T>, order: readonly T[]): T[] {
  const set = new Set(ids);
  return order.filter((id) => set.has(id));
}

/** Unknown IDs are ignored, and adding something twice changes nothing. */
export function interestReducer(state: InterestState, action: InterestAction): InterestState {
  switch (action.type) {
    case "add-offer": {
      const offer = getOffer(action.id);
      if (!offer || state.offerIds.includes(offer.id)) return state;
      return { ...state, offerIds: inOrder([...state.offerIds, offer.id], OFFER_ORDER) };
    }
    case "remove-offer":
      if (!state.offerIds.includes(action.id as OfferId)) return state;
      return { ...state, offerIds: state.offerIds.filter((id) => id !== action.id) };
    case "set-feature": {
      const known = getFeature(action.id) !== undefined;
      const has = state.featureIds.includes(action.id);
      if (!known || has === action.selected) return state;
      const next = action.selected
        ? [...state.featureIds, action.id]
        : state.featureIds.filter((id) => id !== action.id);
      return { ...state, featureIds: inOrder(next, FEATURE_ORDER) };
    }
    case "clear-features":
      return state.featureIds.length === 0 ? state : { ...state, featureIds: [] };
    case "set-service":
      return { ...state, primaryService: action.value };
    case "suggest-service":
      return state.primaryService ? state : { ...state, primaryService: action.value };
    case "reset":
      return EMPTY_INTERESTS;
  }
}
