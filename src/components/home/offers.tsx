import Link from "next/link";

import { InterestLink } from "@/components/interests/interest-link";
import { Reveal } from "@/components/ui";
import { OFFER_NOTE, OFFERS, type OfferPrice } from "@/lib/content/catalogue";

/**
 * Ways to work with us: the four named offers in a 2 × 2 grid, and custom
 * work as a full-width row under them. Approved starting prices show where
 * they exist; the rest say how they're quoted, in the same place. No "most
 * popular", and prices stay out of structured data.
 */
export function Offers() {
  const named = OFFERS.filter((offer) => offer.id !== "custom-systems");
  const custom = OFFERS.find((offer) => offer.id === "custom-systems");

  return (
    <section id="offers" className="section" aria-labelledby="offers-title">
      <div className="wrap">
        <h2 id="offers-title" className="section-title">
          Ways to work with us
        </h2>
        <p className="section-lede">
          Four standard engagements, plus custom work for anything that
          doesn&apos;t fit. Each is confirmed after a conversation about scope.
        </p>

        <Reveal as="ul" stagger className="offers">
          {named.map((offer) => (
            <li key={offer.id} className="offer">
              <div className="offer-head">
                <h3>{offer.title}</h3>
                <Price price={offer.price} />
              </div>
              <p className="offer-who">{offer.who}</p>
              <ul className="offer-scope" aria-label={`Typical scope of ${offer.title}`}>
                {offer.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="offer-foot">
                {offer.evidence ? (
                  <Link href={offer.evidence.href} className="offer-evidence">
                    {offer.evidence.label}
                  </Link>
                ) : (
                  <span />
                )}
                <InterestLink offerId={offer.id} className="btn btn-ghost btn-sm">
                  {offer.cta}
                </InterestLink>
              </div>
            </li>
          ))}

          {custom && (
            <li className="offer offer-custom">
              <div>
                <h3>{custom.title}</h3>
                <p className="offer-who">{custom.who}</p>
                <Price price={custom.price} />
              </div>
              <ul className="offer-scope" aria-label={`Examples of ${custom.title}`}>
                {custom.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <InterestLink offerId={custom.id} className="btn btn-ghost btn-sm">
                {custom.cta}
              </InterestLink>
            </li>
          )}
        </Reveal>

        <p className="offer-note">{OFFER_NOTE}</p>
      </div>
    </section>
  );
}

function Price({ price }: { price: OfferPrice }) {
  if ("quote" in price) {
    return <p className="offer-price offer-price-quote">{price.quote}</p>;
  }
  return (
    <p className="offer-price">
      <span className="offer-price-line">
        <span className="offer-price-from">From</span>{" "}
        <span className="offer-price-amount">{price.from}</span>
      </span>{" "}
      <span className="offer-price-basis">{price.basis}</span>
    </p>
  );
}
