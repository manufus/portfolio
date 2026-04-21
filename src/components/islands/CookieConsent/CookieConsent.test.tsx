import { cleanup, render, screen, waitFor } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type CookieChoice, CookieConsent } from "./CookieConsent";

const TEST_STORAGE_KEY = "ds.cookie-consent.test";

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
  vi.restoreAllMocks();
});

describe("CookieConsent", () => {
  it("renders the consent dialog by default when no decision is stored", async () => {
    render(<CookieConsent storageKey={TEST_STORAGE_KEY} />);

    expect(await screen.findByRole("dialog", { name: /cookie preferences/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
  });

  it("accepts cookies, persists the decision, and dispatches the consent event", async () => {
    const { events, detach } = captureConsentEvents();
    const onDecision = vi.fn();

    render(<CookieConsent storageKey={TEST_STORAGE_KEY} onDecision={onDecision} />);

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

    render(<CookieConsent storageKey={TEST_STORAGE_KEY} />);

    await waitFor(() => {
      expect(events.length).toBeGreaterThan(0);
    });

    expect(events[0]?.detail).toEqual({ choice: "accepted" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
    expect(screen.getByText(/cookie choice saved: accepted\./i)).toBeInTheDocument();

    detach();
  });
});
