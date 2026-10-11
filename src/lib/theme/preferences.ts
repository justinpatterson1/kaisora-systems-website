/**
 * localStorage as a subscribable store.
 *
 * The theme preference lives in localStorage, which makes it the
 * source of truth rather than a mirror of React state. Modelling it as a real
 * external store means `useSyncExternalStore` can read it — which gets the
 * server/hydration pass right by construction, and picks up changes made in
 * another tab for free.
 *
 * Every accessor swallows storage errors: private browsing and blocked site
 * data must degrade to the defaults, never throw.
 */

const listeners = new Set<() => void>();

/** Notifies same-tab readers. The `storage` event only fires in *other* tabs. */
function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * Returns the raw stored string, or null.
 *
 * Deliberately returns the primitive rather than a parsed object:
 * `useSyncExternalStore` compares snapshots by identity, and a fresh object
 * every call would loop forever. Parsing happens above this layer.
 */
export function readPreference(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePreference(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* preference just won't survive the session */
  }
  emit();
}
