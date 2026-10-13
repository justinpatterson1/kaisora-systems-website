"use client";

import { useEffect, useState } from "react";

type Props = {
  events: readonly (readonly [string, string])[];
};

/**
 * The event strip along the foot of the system panel. It rests on the first
 * pair (what the server renders) and, motion permitting, cycles through the
 * rest so the panel reads as a system at work.
 */
export function SystemStrip({ events }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % events.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [events.length]);

  const [left, right] = events[index];

  return (
    <div className="system-strip mono" aria-hidden>
      <p key={`l-${index}`} className="strip-event">
        <span className="live-dot" />
        {left}
      </p>
      <p key={`r-${index}`} className="strip-event">
        <span className="live-dot" />
        {right}
      </p>
    </div>
  );
}
