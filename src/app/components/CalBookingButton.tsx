"use client";

import { useEffect, useRef, useState } from "react";
import { SlideCommit } from "./motion-brew/slide-commit";
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
const observedModals = new WeakSet<HTMLElement>();

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
    script.onload = () => resolve(Boolean(cal.ns[namespace].instance));
    script.onerror = () => resolve(false);
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
  const [ready, setReady] = useState(false);
  const [bookingError, setBookingError] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    let mounted = true;
    void loadCalEmbed().then(loaded => { if (mounted) setReady(loaded); });
    return () => {
      mounted = false;
      // The embed lives under document.body, outside the route that opened it.
      if (trigger && popupTrigger === trigger) {
        popupTrigger = null;
        (window as CalWindow).Cal?.ns[namespace]?.("closeModal");
      }
    };
  }, []);

  const openBooking = () => {
    const cal = (window as CalWindow).Cal?.ns[namespace];
    if (!ready || !cal || !triggerRef.current) {
      setBookingError(true);
      return false;
    }
    setBookingError(false);
    const activeModal = document.querySelector<HTMLElement>('cal-modal-box[name], cal-modal-box');
    if (activeModal?.style.visibility === "visible") return true;
    popupTrigger = triggerRef.current;
    cal("modal", { calLink, config: popupConfig, calOrigin: bookingUrl.origin });
    const modal = document.querySelector<HTMLElement>("cal-modal-box");
    if (modal && !observedModals.has(modal)) {
      observedModals.add(modal);
      modal.addEventListener("close", () => {
        popupTrigger = null;
        const frame = modal.querySelector("iframe");
        if (frame) frame.inert = true;
      });
      modal.addEventListener("open", () => {
        const frame = modal.querySelector("iframe");
        if (frame) frame.inert = false;
      });
    }
    return true;
  };

  if (slide) {
    return (
      <div ref={triggerRef} className={className ?? styles.booking}>
        <SlideCommit
          label={label}
          pendingLabel="Opening booking"
          doneLabel="Booking opened"
          className={styles.slide}
          onCommit={() => {
            if (!openBooking()) throw new Error("Booking is unavailable");
          }}
        />
        {bookingError && <p className={styles.bookingError} role="status">Booking is unavailable right now. Please try again shortly.</p>}
      </div>
    );
  }

  if (magnetic) {
    return <div ref={triggerRef} className={className}>
      <MagneticButton type="button" size="sm" strength={0.18} labelStrength={0.08} className={actionClassName} onClick={() => { openBooking(); }}>{label}</MagneticButton>
      {bookingError && <p className={styles.bookingError} role="status">Booking is unavailable right now. Please try again shortly.</p>}
    </div>;
  }

  return (
    <div ref={triggerRef} className={className ?? styles.booking}>
      <a
        className={actionClassName ?? styles.cta}
        href={bookingUrl.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup={ready ? "dialog" : undefined}
        onClick={event => {
          event.preventDefault();
          openBooking();
        }}
      >
        {label} <span aria-hidden="true">→</span>
      </a>
      {bookingError && <p className={styles.bookingError} role="status">Booking is unavailable right now. Please try again shortly.</p>}
    </div>
  );
}
