import { Fragment } from "preact";
import { useEffect, useId, useState } from "preact/hooks";
import {
  COOKIE_CONSENT_PENDING_PATH_SESSION_KEY,
  COOKIE_CONSENT_STORAGE_KEY,
} from "./constants";

export type CookieChoice = "accepted" | "rejected";

export interface CookieConsentProps {
  storageKey?: string;
  sessionKey?: string;
  title?: string;
  description?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  policyHref?: string;
  onDecision?: (choice: CookieChoice) => void;
}

export function CookieConsent({
  storageKey = COOKIE_CONSENT_STORAGE_KEY,
  sessionKey = COOKIE_CONSENT_PENDING_PATH_SESSION_KEY,
  title = "Cookie preferences",
  description = "I use Google Analytics and Hotjar to see which projects catch your eye. It helps me improve this portfolio. You can keep browsing normally even if you decline—no pressure!",
  acceptLabel = "Accept",
  rejectLabel = "Decline",
  policyHref = "/privacy",
  onDecision,
}: CookieConsentProps) {
  const isBrowser = typeof window !== "undefined";
  const [isOpen, setIsOpen] = useState(false);
  const [decision, setDecision] = useState<CookieChoice | null>(null);
  const titleId = useId();
  const descId = useId();

  const saveDecision = (choice: CookieChoice) => {
    if (!isBrowser) return;
    try {
      window.sessionStorage.removeItem(sessionKey);
    } catch {
      // Ignore restricted sessionStorage environments.
    }
    window.localStorage.setItem(storageKey, choice);
    setDecision(choice);
    setIsOpen(false);
    // Dispatch event to listeners (e.g., Analytics component)
    window.dispatchEvent(new CustomEvent("cookie-consent:decision", { detail: { choice } }));
    onDecision?.(choice);
  };

  useEffect(() => {
    if (!isBrowser) return;

    const saved = window.localStorage.getItem(storageKey) as CookieChoice | null;

    if (saved === "accepted" || saved === "rejected") {
      setDecision(saved);
      setIsOpen(false);
      try {
        window.sessionStorage.removeItem(sessionKey);
      } catch {
        // Ignore restricted sessionStorage environments.
      }
      // Dispatch event for previously cached decision
      window.dispatchEvent(
        new CustomEvent("cookie-consent:decision", { detail: { choice: saved } }),
      );
      return;
    }

    const currentPath = window.location.pathname;
    let pendingPath: string | null = null;

    try {
      pendingPath = window.sessionStorage.getItem(sessionKey);
    } catch {
      setIsOpen(true);
      return;
    }

    if (pendingPath && pendingPath !== currentPath) {
      saveDecision("rejected");
      return;
    }

    try {
      window.sessionStorage.setItem(sessionKey, currentPath);
    } catch {
      // Ignore restricted sessionStorage environments.
    }

    setIsOpen(true);
  }, [isBrowser, sessionKey, storageKey]);

  if (!isOpen) {
    return (
      <Fragment>
        <p class="sr-only" aria-live="polite">
          {decision ? `Cookie choice saved: ${decision}.` : ""}
        </p>
      </Fragment>
    );
  }

  return (
    <div class="pointer-events-none fixed bottom-4 left-1/2 z-95 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 md:bottom-6">
      <div
        aria-live="polite"
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        aria-describedby={descId}
        class="pointer-events-auto w-full rounded-card border border-border-subtle bg-surface-elevated/95 p-5 shadow-floating backdrop-blur"
      >
        <h2 id={titleId} class="font-brand text-xl text-content-primary">
          {title}
        </h2>
        <p id={descId} class="mt-2 text-sm text-content-secondary">
          {description}
        </p>
        <p class="mt-3 text-xs text-content-tertiary">
          Check the{" "}
          <a class="underline hover:text-content-primary" href={policyHref}>
            privacy policy
          </a>
          .
        </p>

        <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => saveDecision("rejected")}
            class="rounded-pill border border-border-subtle bg-surface-canvas px-4 py-2 text-sm font-medium text-content-primary transition hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={() => saveDecision("accepted")}
            class="rounded-pill border border-border-subtle bg-surface-canvas px-4 py-2 text-sm font-medium text-content-primary transition hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
