"use client";

import { track } from "@vercel/analytics";
import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from "react";

import { getFeature, getOffer } from "@/lib/content/catalogue";
import {
  EMPTY_INTERESTS,
  interestReducer,
  type InterestAction,
  type InterestState,
} from "@/lib/interests/interests";

type InterestContextValue = InterestState & {
  dispatch: (action: InterestAction) => void;
};

const InterestContext = createContext<InterestContextValue | null>(null);

/**
 * Holds the visitor's offer, service and feature picks for the visit, so the
 * cards, the feature catalogue and the enquiry form share one set. Mounted in
 * the root layout, so picks survive moving to a case study and back.
 *
 * Every change is announced once through a polite live region, and reported
 * to analytics as catalogue IDs only (never anything the visitor typed).
 */
export function InterestProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(interestReducer, EMPTY_INTERESTS);
  const [announcement, setAnnouncement] = useState("");

  const dispatch = useCallback((action: InterestAction) => {
    rawDispatch(action);
    const message = describe(action);
    if (message) setAnnouncement(message);
    report(action);
  }, []);

  const value = useMemo(() => ({ ...state, dispatch }), [state, dispatch]);

  return (
    <InterestContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </InterestContext.Provider>
  );
}

export function useInterests(): InterestContextValue {
  const value = useContext(InterestContext);
  if (!value) throw new Error("useInterests must be used inside <InterestProvider>.");
  return value;
}

function describe(action: InterestAction): string | null {
  switch (action.type) {
    case "add-offer": {
      const offer = getOffer(action.id);
      return offer ? `${offer.title} attached to your enquiry.` : null;
    }
    case "remove-offer": {
      const offer = getOffer(action.id);
      return offer ? `${offer.title} removed from your enquiry.` : null;
    }
    case "set-feature": {
      const feature = getFeature(action.id);
      if (!feature) return null;
      return action.selected
        ? `${feature.title} added to your system.`
        : `${feature.title} removed from your system.`;
    }
    case "clear-features":
      return "All features removed.";
    case "suggest-service":
      return `${action.value} suggested for “What do you need?”.`;
    default:
      return null;
  }
}

/** Analytics must never get in the way of an enquiry. */
function report(action: InterestAction) {
  try {
    if (action.type === "add-offer" && getOffer(action.id)) {
      track("offer_interest", { offer: action.id });
    } else if (action.type === "set-feature" && action.selected && getFeature(action.id)) {
      track("feature_interest", { feature: action.id });
    }
  } catch {
    /* Ignored on purpose. */
  }
}
