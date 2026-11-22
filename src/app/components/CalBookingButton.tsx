"use client";

import { useEffect, useRef, useState } from "react";
import DeferredBookingSlider from "./DeferredBookingSlider";
import { MagneticButton } from "./motion-brew/magnetic-button";
import styles from "./FinalContact.module.css";

const defaultBookingUrl = "https://cal.com/spark-lab-ufwtr2/30min";
const embedOrigin = "https://app.cal.com";
const namespace = "sparklab-discovery";

function readBookingUrl(value: string | undefined) {
  if (value) {
    try {
      const url = new URL(value);
      if (url.protocol === "https:" && ["cal.com", "app.cal.com"].includes(url.hostname)
        && url.pathname.split("/").filter(Boolean).length >= 2) return url;
    } catch {
      // Use the known public event link if the override is invalid.
    }
  }
  return new URL(defaultBookingUrl);
}

const bookingUrl = readBookingUrl(process.env.NEXT_PUBLIC_CAL_BOOKING_URL?.trim());
const calLink = bookingUrl.pathname.replace(/^\/+/, "") + bookingUrl.search;
const popupConfig = { layout: "month_view", theme: "light" };

type CalQueue = ((...args: unknown[]) => void) & {
  q: unknown[][];
  instance?: unknown;
};
type CalRoot = CalQueue & { ns: Record<string, CalQueue> };
type CalWindow = Window & { Cal?: CalRoot };

function createQueue(): CalQueue {
  const q: unknown[][] = [];
  return Object.assign((...args: unknown[]) => { q.push(args); }, { q });
}

let loading: Promise<boolean> | undefined;
let popupTrigger: HTMLElement | null = null;
let bookingModal: HTMLElement | null = null;

function loadCalEmbed() {
  if (loading) return loading;

  // Cal's popup snippet queues namespace commands until the official embed
  // runtime consumes them and installs its delegated data-cal-link handler.
  loading = new Promise<boolean>(resolve => {
    const host = window as CalWindow;
    const cal: CalRoot = host.Cal ??= Object.assign(createQueue(), { ns: {} });

    if (!cal.ns[namespace]) {
      const booker = cal.ns[namespace] = createQueue();
      booker("init", namespace, { origin: embedOrigin });
      booker("ui", {
        layout: "month_view",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          light: { "cal-brand": "#b9562d", "cal-brand-emphasis": "#984421", "cal-bg": "#fffcf8" },
        },
      });
      booker("on", {
        action: "linkReady",
        callback: () => {
          // A late iframe-ready event can reopen a modal the visitor already closed.
          if (!popupTrigger) queueMicrotask(() => {
            if (!popupTrigger) cal.ns[namespace]?.("closeModal");
          });
        },
      });
      cal("initNamespace", namespace);
    }

    if (cal.instance) {
      resolve(Boolean(cal.ns[namespace].instance));
      return;
    }

    const script = document.createElement("script");
    script.src = embedOrigin + "/embed/embed.js";
    script.async = true;
    const finish = (ready: boolean) => {
      window.clearTimeout(timeout);
      script.onload = null;
      script.onerror = null;
      if (!ready) {
        script.remove();
        loading = undefined;
      }
      resolve(ready);
    };
    const timeout = window.setTimeout(() => finish(false), 5000);
    script.onload = () => finish(Boolean(cal.ns[namespace].instance));
    script.onerror = () => finish(false);
    document.head.append(script);
  });

  return loading;
}

export default function CalBookingButton({ label = "Let's Talk — Book a Call", className, actionClassName, slide = false, magnetic = false }: {
  label?: string;
  className?: string;
  actionClassName?: string;
  slide?: boolean;
  magnetic?: boolean;
} = {}) {
  const [bookingError, setBookingError] = useState(false);
  const pending = useRef<Promise<boolean> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    return () => {
      // The embed lives under document.body, outside the route that opened it.
      if (trigger && popupTrigger === trigger) {
        popupTrigger = null;
        (window as CalWindow).Cal?.ns[namespace]?.("closeModal");
      }
    };
  }, []);

  const openBooking = () => {
    if (pending.current) return pending.current;
    const trigger = triggerRef.current;
    setBookingError(false);
    const request = loadCalEmbed().then(ready => {
      if (!trigger || triggerRef.current !== trigger) return false;
      const cal = (window as CalWindow).Cal?.ns[namespace];
      if (!ready || !cal?.instance) {
        setBookingError(true);
        return false;
      }
      if (bookingModal?.isConnected && popupTrigger) return true;
      // The embed can leave a closed box in the document and build another on
      // the next call. Remove the closed instance before requesting a new one.
      bookingModal?.remove();
      popupTrigger = trigger;
      cal("modal", { calLink, config: popupConfig, calOrigin: bookingUrl.origin });
      const modal = document.querySelector<HTMLElement>("cal-modal-box");
      bookingModal = modal;
      if (modal) {
        modal.addEventListener("close", () => {
          if (bookingModal === modal) popupTrigger = null;
          const frame = modal.querySelector("iframe");
          if (frame) frame.inert = true;
        });
        modal.addEventListener("open", () => {
          const frame = modal.querySelector("iframe");
          if (frame) frame.inert = false;
        });
      }
      return true;
    }).catch(() => {
      if (triggerRef.current === trigger) setBookingError(true);
      return false;
    }).finally(() => { pending.current = null; });
    pending.current = request;
    return request;
  };

  const fallback = bookingError && <p className={styles.bookingError} role="status">
    The booking popup is unavailable. <a href={bookingUrl.href} target="_blank" rel="noopener noreferrer" className="underline">Open booking directly</a>.
  </p>;

  if (slide) {
    return (
      <div ref={triggerRef} className={className ?? styles.booking}>
        <DeferredBookingSlider
          label={label}
          openBooking={openBooking}
        />
        {fallback}
      </div>
    );
  }

  if (magnetic) {
    return <div ref={triggerRef} className={className}>
      <MagneticButton type="button" size="sm" strength={0.18} labelStrength={0.08} className={actionClassName} onClick={() => { void openBooking(); }}>{label}</MagneticButton>
      {fallback}
    </div>;
  }

  return (
    <div ref={triggerRef} className={className ?? styles.booking}>
      <a
        className={actionClassName ?? styles.cta}
        href={bookingUrl.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup="dialog"
        onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          void openBooking();
        }}
      >
        {label} <span aria-hidden="true">→</span>
      </a>
      {fallback}
    </div>
  );
}
