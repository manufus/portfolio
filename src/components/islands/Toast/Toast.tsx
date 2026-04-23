import { Fragment } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

export type ToastVariant = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  eventName: string;
  eventDetail?: unknown;
  dismissOnClick?: boolean;
}

export interface ToastItem {
  id: string;
  title: string;
  message?: string | undefined;
  variant?: ToastVariant;
  durationMs?: number;
  action?: ToastAction | undefined;
}

export interface ToastProps {
  items?: ToastItem[];
  maxItems?: number;
  onDismiss?: (id: string) => void;
  position?: "top-right" | "bottom-right";
}

const variantStyles: Record<ToastVariant, string> = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-content-primary",
  error: "border-rose-500/30 bg-rose-500/10 text-content-primary",
  info: "border-brand/30 bg-brand/10 text-content-primary",
};

export function Toast({ items = [], maxItems = 4, onDismiss, position = "top-right" }: ToastProps) {
  const isBrowser = typeof window !== "undefined";
  const [pausedIds, setPausedIds] = useState<Set<string>>(new Set());
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [internalItems, setInternalItems] = useState<ToastItem[]>([]);
  const hasExternalItems = items.length > 0;
  const orderedItems = useMemo(
    () => (hasExternalItems ? items : internalItems),
    [hasExternalItems, items, internalItems],
  );

  useEffect(() => {
    if (!isBrowser) return;
    const onToastEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Partial<ToastItem>>;
      const detail = customEvent.detail;
      if (!detail?.title) return;

      let normalizedAction: ToastAction | undefined;
      const action = detail.action;
      if (action && typeof action.label === "string" && typeof action.eventName === "string") {
        normalizedAction = {
          label: action.label,
          eventName: action.eventName,
          eventDetail: action.eventDetail,
          dismissOnClick: action.dismissOnClick ?? true,
        };
      }

      const nextToast: ToastItem = {
        id: detail.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: detail.title,
        message: detail.message,
        variant: detail.variant ?? "info",
        durationMs: detail.durationMs ?? 4000,
        action: normalizedAction,
      };

      setInternalItems((prev) => [nextToast, ...prev].slice(0, maxItems));
    };

    window.addEventListener("ds:toast", onToastEvent as EventListener);
    return () => window.removeEventListener("ds:toast", onToastEvent as EventListener);
  }, [isBrowser, maxItems]);

  const removeToast = useCallback(
    (id: string) => {
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      if (!isBrowser) return;
      window.setTimeout(() => {
        if (hasExternalItems) {
          onDismiss?.(id);
        } else {
          setInternalItems((prev) => prev.filter((toast) => toast.id !== id));
        }
        setExitingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 220);
    },
    [hasExternalItems, isBrowser, onDismiss],
  );

  const handleActionClick = useCallback(
    (item: ToastItem) => {
      if (!isBrowser || !item.action) return;
      window.dispatchEvent(
        new CustomEvent(item.action.eventName, {
          detail: item.action.eventDetail,
        }),
      );

      if (item.action.dismissOnClick ?? true) {
        removeToast(item.id);
      }
    },
    [isBrowser, removeToast],
  );

  useEffect(() => {
    if (!isBrowser) return;
    const timers = orderedItems.map((item) => {
      const duration = item.durationMs ?? 4000;
      if (pausedIds.has(item.id) || duration <= 0) return null;
      const timer = window.setTimeout(() => {
        removeToast(item.id);
      }, duration);
      return timer;
    });

    return () => {
      for (const timer of timers) {
        if (timer) window.clearTimeout(timer);
      }
    };
  }, [isBrowser, orderedItems, pausedIds, removeToast]);

  if (!orderedItems.length) return <Fragment />;

  return (
    <section
      class={`pointer-events-none fixed z-[100] flex w-full flex-col gap-2 px-4 ${
        position === "top-right"
          ? "inset-x-0 bottom-4 items-center md:inset-x-auto md:right-4 md:top-4 md:bottom-auto md:w-[24rem] md:px-0 md:items-end"
          : "inset-x-0 bottom-4 items-center md:inset-x-auto md:right-4 md:bottom-4 md:w-[24rem] md:px-0 md:items-end"
      }`}
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {orderedItems.map((item) => {
        const variant = item.variant ?? "info";
        return (
          <article
            key={item.id}
            role={variant === "error" ? "alert" : "status"}
            class={`pointer-events-auto w-full rounded-card border border-border-subtle bg-surface-elevated/95 p-4 shadow-floating backdrop-blur transition-all duration-300 ${
              exitingIds.has(item.id) ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            } ${variantStyles[variant]}`}
            onMouseEnter={() =>
              setPausedIds((prev) => {
                const next = new Set(prev);
                next.add(item.id);
                return next;
              })
            }
            onMouseLeave={() =>
              setPausedIds((prev) => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
              })
            }
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold">{item.title}</h3>
                {item.message ? (
                  <p class="mt-1 text-xs text-content-secondary">{item.message}</p>
                ) : null}
                {item.action ? (
                  <button
                    type="button"
                    onClick={() => handleActionClick(item)}
                    class="mt-2 rounded-pill border border-border-subtle bg-surface-canvas px-3 py-1 text-xs font-medium text-content-primary transition hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    aria-label={item.action.label}
                  >
                    {item.action.label}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                class="rounded-pill border border-border-subtle bg-surface-canvas px-2 py-1 text-xs text-content-primary transition hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label={`Dismiss notification: ${item.title}`}
              >
                Close
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default Toast;
