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

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, init);
  if (response.status === 401) broadcastAuthInvalidation();
  return response;
}