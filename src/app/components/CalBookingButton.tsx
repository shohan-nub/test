"use client";

import { useEffect, useRef, useState } from "react";
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
const popupConfig = JSON.stringify({ layout: "month_view", theme: "light" });

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
let popupTrigger: HTMLAnchorElement | null = null;

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
          // Cal can finish loading after the link that opened it has left the page.
          queueMicrotask(() => {
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

export default function CalBookingButton({ label = "Let's Talk — Book a Call", className }: {
  label?: string;
  className?: string;
} = {}) {
  const [ready, setReady] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);

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

  return (
    <div className={className ?? styles.booking}>
      <a
        ref={triggerRef}
        className={styles.cta}
        href={bookingUrl.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup={ready ? "dialog" : undefined}
        data-cal-link={ready ? calLink : undefined}
        data-cal-origin={ready ? bookingUrl.origin : undefined}
        data-cal-namespace={ready ? namespace : undefined}
        data-cal-config={ready ? popupConfig : undefined}
        onClick={event => {
          if (!ready) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            event.stopPropagation();
          } else {
            event.preventDefault();
            popupTrigger = event.currentTarget;
          }
        }}
      >
        {label} <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
