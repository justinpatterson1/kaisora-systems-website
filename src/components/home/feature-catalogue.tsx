"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { ArrowIcon, CloseIcon } from "@/components/icons";
import { useInterests } from "@/components/interests/interest-provider";
import { NO_FILTER, filterFeatures, isFiltered, type FeatureFilter } from "@/lib/catalogue/filter-features";
import {
  CATEGORY_LABELS,
  FEATURE_CATEGORIES,
  FEATURES,
  getFeature,
  type Feature,
} from "@/lib/content/catalogue";
import { START_PROJECT_HREF } from "@/lib/content/nav";

/**
 * "Build your system": the feature index on the left, and on the right a
 * draft of the visitor's system, drawn in the same node-and-signal-line
 * language as the hero's live panel. Each ticked feature becomes a node, with
 * what it needs from the client hanging off it.
 *
 * Picks live in the shared interest store, so filtering never drops them and
 * the enquiry form attaches them. Prerendered with no filter applied, every
 * feature is in the HTML before any script runs.
 */
export function FeatureCatalogue() {
  const { featureIds, dispatch } = useInterests();
  const [filter, setFilter] = useState<FeatureFilter>(NO_FILTER);
  const searchId = useId();

  const shown = filterFeatures(FEATURES, filter);
  const picked = featureIds.map(getFeature).filter((feature): feature is Feature => !!feature);
  const filtered = isFiltered(filter);

  const toggle = (id: string, selected: boolean) =>
    dispatch({ type: "set-feature", id, selected });

  return (
    <div className="catalogue">
      <div className="catalogue-index">
        <div className="catalogue-tools">
          <label htmlFor={searchId}>Find a feature</label>
          <input
            id={searchId}
            type="search"
            value={filter.query}
            maxLength={80}
            autoComplete="off"
            placeholder="Try “stock”, “invoice” or “reports”"
            onChange={(event) => setFilter({ ...filter, query: event.target.value })}
          />
          <div className="catalogue-layers" role="group" aria-label="Show features for">
            {(["all", ...FEATURE_CATEGORIES] as const).map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={filter.category === category}
                onClick={() => setFilter({ ...filter, category })}
              >
                {category === "all" ? "All" : CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </div>

        <div className="catalogue-status">
          <p aria-live="polite">
            {filtered
              ? `Showing ${shown.length} of ${FEATURES.length} features`
              : `All ${FEATURES.length} features`}
          </p>
          {filtered && (
            <button type="button" className="text-button" onClick={() => setFilter(NO_FILTER)}>
              Show all features
            </button>
          )}
          {picked.length > 0 && (
            <a href="#your-system" className="text-button catalogue-jump">
              {picked.length} picked · View your system
            </a>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="catalogue-empty">
            <p>
              No features match “{filter.query.trim()}”
              {filter.category !== "all" && ` in ${CATEGORY_LABELS[filter.category]}`}.
            </p>
            <button type="button" className="text-button" onClick={() => setFilter(NO_FILTER)}>
              Show all features
            </button>
          </div>
        ) : (
          FEATURE_CATEGORIES.map((category) => {
            const rows = shown.filter((feature) => feature.category === category);
            if (rows.length === 0) return null;
            return (
              <section key={category} className="catalogue-group" aria-labelledby={`layer-${category}`}>
                <div className="catalogue-group-head">
                  <h3 id={`layer-${category}`}>{CATEGORY_LABELS[category]}</h3>
                  <span>{rows.length}</span>
                </div>
                <ul>
                  {rows.map((feature) => (
                    <FeatureRow
                      key={feature.id}
                      feature={feature}
                      selected={featureIds.includes(feature.id)}
                      onToggle={toggle}
                    />
                  ))}
                </ul>
              </section>
            );
          })
        )}
      </div>

      <aside id="your-system" className="draft" aria-labelledby="draft-title">
        <div className="draft-head">
          <h3 id="draft-title" className="draft-title">
            <span className={picked.length > 0 ? "live-dot" : "draft-dot"} aria-hidden />
            your-system
          </h3>
          <span className="draft-count">
            {picked.length} {picked.length === 1 ? "module" : "modules"}
          </span>
        </div>

        <div className="draft-body">
          {picked.length === 0 ? (
            <div className="draft-empty">
              <p>
                Tick features and they&apos;ll appear here as parts of one
                system, with what each needs from you.
              </p>
              <ul aria-hidden>
                <li>Storefront</li>
                <li>Your operations</li>
                <li>Reports and integrations</li>
              </ul>
            </div>
          ) : (
            <ol className="draft-trunk">
              {FEATURE_CATEGORIES.map((category) => {
                const nodes = picked.filter((feature) => feature.category === category);
                if (nodes.length === 0) return null;
                return (
                  <li key={category} className="draft-layer">
                    <span className="draft-layer-name">{category}</span>
                    <ul>
                      {nodes.map((feature) => (
                        <li key={feature.id} className="draft-node">
                          <span className="draft-node-title">{feature.title}</span>
                          <span className="draft-node-id">{feature.id}</span>
                          <button
                            type="button"
                            className="draft-remove"
                            aria-label={`Remove ${feature.title}`}
                            onClick={() => toggle(feature.id, false)}
                          >
                            <CloseIcon width={12} height={12} />
                          </button>
                          <span className="draft-node-needs">
                            <span className="sr-only">Needs: </span>
                            {feature.needs}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="draft-foot">
          <p>
            These are interests, not a quote. We confirm what&apos;s feasible
            before anything is scoped.
          </p>
          {picked.length > 0 && (
            <div className="draft-actions">
              <button type="button" className="text-button" onClick={() => dispatch({ type: "clear-features" })}>
                Clear all
              </button>
              <a href={START_PROJECT_HREF} className="btn btn-primary btn-sm">
                Discuss selected features
                <ArrowIcon width={14} height={14} />
              </a>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

type FeatureRowProps = {
  feature: Feature;
  selected: boolean;
  onToggle: (id: string, selected: boolean) => void;
};

function FeatureRow({ feature, selected, onToggle }: FeatureRowProps) {
  const inputId = `feature-${feature.id}`;

  return (
    <li className="catalogue-row" data-selected={selected || undefined}>
      <input
        id={inputId}
        type="checkbox"
        checked={selected}
        onChange={(event) => onToggle(feature.id, event.target.checked)}
      />
      <label htmlFor={inputId}>
        <span className="catalogue-row-title">{feature.title}</span>
        <span className="catalogue-row-desc">{feature.description}</span>
      </label>
      <p className="catalogue-row-needs">
        <span>Needs:</span> {feature.needs}
        {feature.evidence && (
          <>
            {" · "}
            <Link href={feature.evidence.href}>{feature.evidence.label}</Link>
          </>
        )}
      </p>
    </li>
  );
}
