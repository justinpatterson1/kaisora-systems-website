"use client";

import type { ReactNode } from "react";

import { START_PROJECT_HREF } from "@/lib/content/nav";

import { useInterests } from "./interest-provider";

type InterestLinkProps = {
  /** Attach this offer to the enquiry. */
  offerId?: string;
  /** Fill "What do you need?" with this, if the visitor hasn't chosen yet. */
  service?: string;
  className?: string;
  children: ReactNode;
};

/**
 * A call to action that records the interest, then lets the link do the
 * rest: it is a real `#contact` link, so it still scrolls there before the
 * page's JavaScript has loaded. Nothing the visitor typed is touched.
 */
export function InterestLink({ offerId, service, className, children }: InterestLinkProps) {
  const { dispatch, primaryService } = useInterests();

  return (
    <a
      href={START_PROJECT_HREF}
      className={className}
      onClick={() => {
        if (offerId) dispatch({ type: "add-offer", id: offerId });
        /* Only when it would apply, so the announcement stays accurate. */
        if (service && !primaryService) dispatch({ type: "suggest-service", value: service });
      }}
    >
      {children}
    </a>
  );
}
