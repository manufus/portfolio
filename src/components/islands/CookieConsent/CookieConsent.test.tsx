import { cleanup, render, screen, waitFor } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type CookieChoice, CookieConsent } from "./CookieConsent";
import { COOKIE_CONSENT_RESET_EVENT } from "./constants";

const TEST_STORAGE_KEY = "ds.cookie-consent.test";
const TEST_SESSION_KEY = "ds.cookie-consent.pending.test";

interface ConsentToastDetail {
  title: string;
  message?: string;
  variant?: "success" | "error" | "info";
  action?: {
    label: string;
    eventName: string;
  };
}

function captureConsentEvents() {
  const events: Array<CustomEvent<{ choice: CookieChoice }>> = [];
  const listener: EventListener = (event) => {
    events.push(event as CustomEvent<{ choice: CookieChoice }>);
  };

  window.addEventListener("cookie-consent:decision", listener);

  return {
    events,
    detach: () => window.removeEventListener("cookie-consent:decision", listener),
  };
}

function captureToastEvents() {
  const events: Array<CustomEvent<ConsentToastDetail>> = [];
  const listener: EventListener = (event) => {
    events.push(event as CustomEvent<ConsentToastDetail>);
  };

  window.addEventListener("ds:toast", listener);

  return {
    events,
    detach: () => window.removeEventListener("ds:toast", listener),
  };
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
  vi.restoreAllMocks();
});

describe("CookieConsent", () => {
  it("renders the consent dialog by default when no decision is stored", async () => {
    render(<CookieConsent storageKey={TEST_STORAGE_KEY} sessionKey={TEST_SESSION_KEY} />);

    expect(await screen.findByRole("dialog", { name: /cookie preferences/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
  });

  it("accepts cookies and dispatches tailored success toast feedback", async () => {
    const { events, detach } = captureConsentEvents();
    const { events: toastEvents, detach: detachToast } = captureToastEvents();
    const onDecision = vi.fn();

    render(
      <CookieConsent
        storageKey={TEST_STORAGE_KEY}
        sessionKey={TEST_SESSION_KEY}
        onDecision={onDecision}
      />,
    );

    await userEvent.click(await screen.findByRole("button", { name: "Accept" }));

    expect(window.localStorage.getItem(TEST_STORAGE_KEY)).toBe("accepted");
    expect(onDecision).toHaveBeenCalledWith("accepted");

    await waitFor(() => {
      expect(events.length).toBeGreaterThan(0);
      expect(toastEvents.length).toBeGreaterThan(0);
    });

    expect(events.at(-1)?.detail).toEqual({ choice: "accepted" });
    expect(toastEvents.at(-1)?.detail).toMatchObject({
      title: "Cookies accepted",
      variant: "success",
      action: { label: "Undo", eventName: COOKIE_CONSENT_RESET_EVENT },
    });
    expect(toastEvents.at(-1)?.detail.message).toMatch(/enabled/i);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    detach();
    detachToast();
  });

  it("rejects cookies manually and dispatches tailored rejection toast feedback", async () => {
    const { events, detach } = captureConsentEvents();
    const { events: toastEvents, detach: detachToast } = captureToastEvents();

    render(<CookieConsent storageKey={TEST_STORAGE_KEY} sessionKey={TEST_SESSION_KEY} />);

    await userEvent.click(await screen.findByRole("button", { name: "Decline" }));

    await waitFor(() => {
      expect(events.length).toBeGreaterThan(0);
      expect(toastEvents.length).toBeGreaterThan(0);
    });

    expect(window.localStorage.getItem(TEST_STORAGE_KEY)).toBe("rejected");
    expect(events.at(-1)?.detail).toEqual({ choice: "rejected" });
    expect(toastEvents.at(-1)?.detail).toMatchObject({
      title: "Cookies rejected",
      variant: "info",
      action: { label: "Undo", eventName: COOKIE_CONSENT_RESET_EVENT },
    });
    expect(toastEvents.at(-1)?.detail.message).toMatch(/disabled/i);

    detach();
    detachToast();
  });

  it("stays closed on remount when a cached decision exists and re-dispatches it", async () => {
    window.localStorage.setItem(TEST_STORAGE_KEY, "accepted");
    const { events, detach } = captureConsentEvents();

    render(<CookieConsent storageKey={TEST_STORAGE_KEY} sessionKey={TEST_SESSION_KEY} />);

    await waitFor(() => {
      expect(events.length).toBeGreaterThan(0);
    });

    expect(events[0]?.detail).toEqual({ choice: "accepted" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
    expect(screen.getByText(/cookie choice saved: accepted\./i)).toBeInTheDocument();

    detach();
  });

  it("implies rejection on a second internal page when the first banner was ignored", async () => {
    window.sessionStorage.setItem(TEST_SESSION_KEY, "/first-page");
    window.history.replaceState({}, "", "/second-page");
    const { events, detach } = captureConsentEvents();
    const { events: toastEvents, detach: detachToast } = captureToastEvents();
    const onDecision = vi.fn();

    render(
      <CookieConsent
        storageKey={TEST_STORAGE_KEY}
        sessionKey={TEST_SESSION_KEY}
        onDecision={onDecision}
      />,
    );

    await waitFor(() => {
      expect(window.localStorage.getItem(TEST_STORAGE_KEY)).toBe("rejected");
      expect(events.length).toBeGreaterThan(0);
      expect(toastEvents.length).toBeGreaterThan(0);
    });

    expect(onDecision).toHaveBeenCalledWith("rejected");
    expect(events.at(-1)?.detail).toEqual({ choice: "rejected" });
    expect(toastEvents.at(-1)?.detail).toMatchObject({
      title: "Cookies rejected",
      variant: "info",
      action: { label: "Undo", eventName: COOKIE_CONSENT_RESET_EVENT },
    });
    expect(toastEvents.at(-1)?.detail.message).toContain("No choice was made before navigation");
    expect(window.sessionStorage.getItem(TEST_SESSION_KEY)).toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    detach();
    detachToast();
  });

  it("does not imply rejection on same-page reload", async () => {
    window.history.replaceState({}, "", "/same-page");
    window.sessionStorage.setItem(TEST_SESSION_KEY, "/same-page");

    render(<CookieConsent storageKey={TEST_STORAGE_KEY} sessionKey={TEST_SESSION_KEY} />);

    expect(await screen.findByRole("dialog", { name: /cookie preferences/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(TEST_STORAGE_KEY)).toBeNull();
  });

  it("reopens the dialog when a reset event is dispatched", async () => {
    window.localStorage.setItem(TEST_STORAGE_KEY, "accepted");
    window.sessionStorage.setItem(TEST_SESSION_KEY, "/cached-path");

    render(<CookieConsent storageKey={TEST_STORAGE_KEY} sessionKey={TEST_SESSION_KEY} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_RESET_EVENT));

    expect(await screen.findByRole("dialog", { name: /cookie preferences/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(TEST_STORAGE_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(TEST_SESSION_KEY)).toBeNull();
  });
});
