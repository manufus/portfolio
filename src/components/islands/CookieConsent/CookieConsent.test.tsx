import { cleanup, render, screen, waitFor } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type CookieChoice, CookieConsent } from "./CookieConsent";

const TEST_STORAGE_KEY = "ds.cookie-consent.test";
const TEST_SESSION_KEY = "ds.cookie-consent.pending.test";

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

  it("accepts cookies, persists the decision, and dispatches the consent event", async () => {
    const { events, detach } = captureConsentEvents();
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
    });

    expect(events.at(-1)?.detail).toEqual({ choice: "accepted" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    detach();
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
    });

    expect(onDecision).toHaveBeenCalledWith("rejected");
    expect(events.at(-1)?.detail).toEqual({ choice: "rejected" });
    expect(window.sessionStorage.getItem(TEST_SESSION_KEY)).toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    detach();
  });

  it("does not imply rejection on same-page reload", async () => {
    window.history.replaceState({}, "", "/same-page");
    window.sessionStorage.setItem(TEST_SESSION_KEY, "/same-page");

    render(<CookieConsent storageKey={TEST_STORAGE_KEY} sessionKey={TEST_SESSION_KEY} />);

    expect(await screen.findByRole("dialog", { name: /cookie preferences/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(TEST_STORAGE_KEY)).toBeNull();
  });
});
