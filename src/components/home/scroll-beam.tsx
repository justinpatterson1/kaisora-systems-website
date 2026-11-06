"use client";

import { useEffect, useRef } from "react";

import { beamProgress } from "@/lib/beam/beam-progress";
import { planHop } from "@/lib/beam/hop-plan";

/** The sections the beam connects: everything after the hero, then contact. */
const SECTIONS = "main > section:not(.hero), #contact";

/** The moving light's diameter. */
const LAMP = 320;
/** Height of each section's lit patch, centred on its junction. */
const GLOW = 560;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * The lit grid: the hero's grid runs behind the whole page, seen only where
 * light falls on it, and the light is the pulse from the hero's live panel.
 *
 * A dark signal line runs down the left gutter from Selected work to Start a
 * project, with a junction at each section. When the scroll reaches a
 * section, a pulse travels from the previous junction to its one, revealing
 * the grid as it goes; on arrival the junction rings, the section's top
 * hairline sweeps purple (`data-beam-lit`) and a bloom lights the grid around
 * it. The section being read stays lit; the one left behind fades.
 *
 * Decorative: hidden from assistive tech, and absent until this effect runs
 * (`data-beam-live` on <html>). Geometry is measured on resize; scrolling
 * reads `scrollY` once per frame. The pulse, the light and the fades are
 * Web Animations and CSS transitions on transform and opacity. Under reduced
 * motion nothing travels: junctions, sweeps and blooms simply switch on.
 *
 * Must sit directly inside a `.beam-scope` that wraps <main> and the footer.
 */
export function ScrollBeam() {
  const beamRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const beam = beamRef.current;
    const light = lightRef.current;
    const scope = beam?.parentElement;
    const lamp = light?.querySelector<HTMLElement>(".beam-lamp");
    if (!beam || !light || !scope || !lamp) return;

    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let sections: HTMLElement[] = [];
    let tops: number[] = []; // document offsets
    let local: number[] = []; // offsets within the scope
    let nodes: HTMLElement[] = [];
    let segments: HTMLElement[] = [];
    let glows: HTMLElement[] = [];
    let beamX = 0;
    let arrived = -1;
    let flight: { to: number; animations: Animation[]; packet: HTMLElement } | null = null;
    let frame = 0;

    const setLit = (i: number, on: boolean) => {
      nodes[i]?.toggleAttribute("data-lit", on);
      sections[i]?.toggleAttribute("data-beam-lit", on);
      if (i > 0) segments[i - 1]?.toggleAttribute("data-lit", on);
    };

    /* Only the section being read keeps its bloom. */
    const focus = () => glows.forEach((glow, i) => glow.toggleAttribute("data-on", i === arrived));

    const arrive = (i: number, ring: boolean) => {
      setLit(i, true);
      arrived = i;
      if (ring) {
        nodes[i]?.removeAttribute("data-ring");
        void nodes[i]?.offsetWidth; // restart the ring
        nodes[i]?.setAttribute("data-ring", "");
      }
      focus();
    };

    const land = () => {
      if (!flight) return;
      flight.animations.forEach((animation) => animation.cancel());
      flight.packet.remove();
      flight = null;
    };

    const travel = (to: number) => {
      const from = local[to - 1];
      const end = local[to];
      segments[to - 1]?.toggleAttribute("data-lit", true);

      const packet = document.createElement("span");
      packet.className = "beam-packet";
      beam.appendChild(packet);
      const top = local[0];
      const move = packet.animate(
        [{ transform: `translateY(${from - top}px)` }, { transform: `translateY(${end - top}px)` }],
        { duration: 750, easing: EASE },
      );

      const half = LAMP / 2;
      const at = (y: number) => ({
        transform: `translate(${beamX - half}px, ${y - half}px)`,
        backgroundPosition: `${half - beamX}px ${half - y}px`,
      });
      /* Travels with the pulse (same 750ms and easing), then fades. */
      const glow = lamp.animate(
        [
          { ...at(from), opacity: 1, easing: EASE },
          { ...at(end), opacity: 1, offset: 0.75, easing: "ease-out" },
          { ...at(end), opacity: 0 },
        ],
        { duration: 1000 },
      );

      flight = { to, animations: [move, glow], packet };
      /* A normal landing leaves the light to fade; only interruptions cut it. */
      move.onfinish = () => {
        packet.remove();
        flight = null;
        arrive(to, true);
        step();
      };
    };

    /* Bring the pulse to wherever the scroll has got to. */
    const step = () => {
      const { reached } = beamProgress(window.scrollY, window.innerHeight, tops);
      const target = reached.lastIndexOf(true);

      if (flight && flight.to <= target) return; // let it land, then continue
      if (flight) {
        land();
        setLit(flight.to, false);
      }

      const plan = planHop(arrived, target);
      for (const i of plan.retract) setLit(i, false);
      if (plan.retract.length > 0) {
        arrived = target;
        focus();
      }
      for (const i of plan.instant) arrive(i, false);
      if (plan.travel !== null) {
        if (reduce.matches) arrive(plan.travel, false);
        else travel(plan.travel);
      }
    };

    const measure = () => {
      land();
      sections = [...document.querySelectorAll<HTMLElement>(SECTIONS)];
      const scopeBox = scope.getBoundingClientRect();
      const scopeTop = scopeBox.top + window.scrollY;
      tops = sections.map((el) => el.getBoundingClientRect().top + window.scrollY);
      local = tops.map((top) => top - scopeTop);
      if (tops.length < 2) {
        beam.hidden = true;
        light.hidden = true;
        return;
      }
      beam.hidden = false;
      light.hidden = false;
      beamX = beam.getBoundingClientRect().left - scopeBox.left;

      const start = local[0];
      beam.style.top = `${start}px`;
      beam.style.height = `${local[local.length - 1] - start}px`;

      nodes = local.map((top) => {
        const node = document.createElement("span");
        node.className = "beam-node";
        node.style.top = `${top - start}px`;
        return node;
      });
      segments = local.slice(1).map((top, i) => {
        const segment = document.createElement("span");
        segment.className = "beam-seg";
        segment.style.top = `${local[i] - start}px`;
        segment.style.height = `${top - local[i]}px`;
        return segment;
      });
      beam.querySelector(".beam-parts")?.replaceChildren(...segments, ...nodes);

      /* Each bloom is a band of grid aligned to the page-wide grid. */
      glows = local.map((top) => {
        const glow = document.createElement("div");
        glow.className = "beam-glow";
        const y = top - GLOW / 2;
        glow.style.top = `${y}px`;
        glow.style.height = `${GLOW}px`;
        glow.style.setProperty("--glow-x", `${beamX}px`);
        glow.style.backgroundPositionY = `${-y}px`;
        return glow;
      });
      light.querySelector(".beam-glows")?.replaceChildren(...glows);

      /* Re-apply what is already lit to the fresh elements. */
      const lit = arrived;
      arrived = -1;
      for (let i = 0; i <= lit && i < tops.length; i++) arrive(i, false);
      step();
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          step();
        });
      }
    };

    /* The page's height changes when fonts load, images arrive, FAQs open or
       the feature filter narrows the list. */
    const resize = new ResizeObserver(() => measure());
    resize.observe(scope);
    window.addEventListener("scroll", onScroll, { passive: true });
    root.dataset.beamLive = "";
    measure();

    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      land();
      delete root.dataset.beamLive;
      sections.forEach((el) => el.removeAttribute("data-beam-lit"));
    };
  }, []);

  return (
    <>
      <div ref={lightRef} className="beam-light" aria-hidden>
        <div className="beam-glows" />
        <div className="beam-lamp" />
      </div>
      <div ref={beamRef} className="beam" aria-hidden>
        <div className="beam-parts" />
      </div>
    </>
  );
}
