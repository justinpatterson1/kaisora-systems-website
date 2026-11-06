"use client";

import { CloseIcon } from "@/components/icons";
import { useInterests } from "@/components/interests/interest-provider";
import { getFeature, getOffer } from "@/lib/content/catalogue";

/**
 * The offers and features attached to the enquiry, shown before it is sent so
 * the visitor sees exactly what goes with their message, and can drop any of
 * it. Inside the form it's a field; without a form (no `RESEND_API_KEY`) it
 * becomes a reminder of what to mention in an email.
 */
export function AttachedInterests({ withoutForm = false }: { withoutForm?: boolean }) {
  const { offerIds, featureIds, dispatch } = useInterests();
  const offers = offerIds.flatMap((id) => getOffer(id) ?? []);
  const features = featureIds.flatMap((id) => getFeature(id) ?? []);
  const empty = offers.length === 0 && features.length === 0;

  if (withoutForm && empty) return null;

  return (
    <div className="field attached" role="group" aria-labelledby="attached-label">
      <span id="attached-label" className="field-label">
        {withoutForm ? "Worth mentioning in your email" : "Attached to your message"}
        {!withoutForm && <span className="field-optional">optional</span>}
      </span>
      {empty ? (
        <p className="attached-empty">
          Nothing attached yet. Pick an offer or features above, or just
          describe it below.
        </p>
      ) : (
        <ul className="attached-list">
          {offers.map((offer) => (
            <li key={offer.id} className="attached-item">
              <span className="attached-kind">Offer</span>
              {offer.title}
              <button
                type="button"
                aria-label={`Remove ${offer.title}`}
                onClick={() => dispatch({ type: "remove-offer", id: offer.id })}
              >
                <CloseIcon width={11} height={11} />
              </button>
            </li>
          ))}
          {features.map((feature) => (
            <li key={feature.id} className="attached-item">
              <span className="attached-kind">Feature</span>
              {feature.title}
              <button
                type="button"
                aria-label={`Remove ${feature.title}`}
                onClick={() => dispatch({ type: "set-feature", id: feature.id, selected: false })}
              >
                <CloseIcon width={11} height={11} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
