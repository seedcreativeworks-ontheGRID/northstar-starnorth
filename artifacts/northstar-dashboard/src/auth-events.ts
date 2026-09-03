const AUTH_INVALIDATED_EVENT = "northstar:auth-invalidated";
const AUTH_CHANNEL = "northstar-auth";
const AUTH_STORAGE_KEY = "northstar:auth-invalidated-at";

export function broadcastAuthInvalidation() {
  window.dispatchEvent(new Event(AUTH_INVALIDATED_EVENT));

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage("invalidated");
    channel.close();
    return;
  }

  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, String(Date.now()));
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // The same-tab event still invalidates access when storage is unavailable.
  }
}

export function subscribeToAuthInvalidation(onInvalidated: () => void) {
  window.addEventListener(AUTH_INVALIDATED_EVENT, onInvalidated);

  const channel =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel(AUTH_CHANNEL)
      : null;
  if (channel) {
    channel.addEventListener("message", onInvalidated);
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEY && event.newValue) onInvalidated();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(AUTH_INVALIDATED_EVENT, onInvalidated);
    window.removeEventListener("storage", onStorage);
    channel?.close();
  };
}

// Only set on the GitHub Pages build (see package.json's build:pages) --
// that static mirror has no API of its own, so every relative call must be
// redirected to the real one on Vercel, cross-origin. Mirrors the wiring in
// main.tsx / custom-fetch.ts, but those only cover the generated API client
// -- these hand-written auth calls (login, logout, session, profile) need
// the same treatment and were missing it, so they silently hit the GitHub
// Pages origin itself instead of Vercel.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function resolveApiUrl(path: string): string {
  if (!API_BASE_URL || !path.startsWith("/")) return path;
  return `${API_BASE_URL.replace(/\/+$/, "")}${path}`;
}

export async function authenticatedFetch(
  path: string,
  init?: RequestInit,
) {
  const response = await fetch(resolveApiUrl(path), {
    ...init,
    // Cookie-based sessions need credentials explicitly included once
    // requests cross an origin -- fetch defaults to "same-origin", which
    // never sends or stores cookies cross-site. Overrides whatever the
    // caller passed so this can't silently regress per call site.
    credentials: API_BASE_URL ? "include" : "same-origin",
  });
  if (response.status === 401) broadcastAuthInvalidation();
  return response;
}