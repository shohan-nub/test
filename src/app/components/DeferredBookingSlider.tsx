"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNearViewport } from "./useNearViewport";
import shimmer from "./motion-brew/SlideCommitShimmer.module.css";
import styles from "./FinalContact.module.css";

type Slider = typeof import("./motion-brew/slide-commit").SlideCommit;

export default function DeferredBookingSlider({ label, openBooking }: {
  label: string;
  openBooking: () => Promise<boolean>;
}) {
  const slot = useRef<HTMLDivElement>(null);
  const placeholder = useRef<HTMLButtonElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);
  const near = useNearViewport(slot, "650px");
  const [intent, setIntent] = useState(0);
  const [SlideCommit, setSlideCommit] = useState<Slider>();

  useEffect(() => {
    if ((!near && !intent) || SlideCommit) return;
    let active = true;
    void import("./motion-brew/slide-commit").then(({ SlideCommit }) => {
      if (!active) return;
      restoreFocus.current = document.activeElement === placeholder.current;
      setSlideCommit(() => SlideCommit);
    }).catch(() => {
      // Keep the booking button usable and retry on the next intent.
    });
    return () => { active = false; };
  }, [near, intent, SlideCommit]);

  useLayoutEffect(() => {
    if (!SlideCommit || !restoreFocus.current) return;
    restoreFocus.current = false;
    if (document.activeElement === document.body) slider.current?.focus({ preventScroll: true });
  }, [SlideCommit]);

  return <div ref={slot}>
    {SlideCommit ? (
      <SlideCommit
        ref={slider}
        label={label}
        pendingLabel="Opening booking"
        doneLabel="Booking opened"
        className={styles.slide}
        onCommit={async () => {
          if (!await openBooking()) throw new Error("Booking is unavailable");
        }}
      />
    ) : (
      <button
        ref={placeholder}
        type="button"
        aria-haspopup="dialog"
        className={`relative block h-14 max-w-full cursor-pointer overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${styles.slide}`}
        style={{ backgroundColor: "rgba(36, 36, 35, 0.06)" }}
        onFocus={() => setIntent(value => value + 1)}
        onPointerEnter={() => setIntent(value => value + 1)}
        onClick={() => { setIntent(value => value + 1); void openBooking(); }}
      >
        <span aria-hidden className="absolute inset-y-0 left-0 rounded-full" style={{ width: 56, backgroundColor: "rgba(36, 36, 35, 0.07)" }} />
        <span className="pointer-events-none absolute inset-0 grid place-items-center pl-[60px] pr-6 text-sm font-medium">
          <span className={shimmer.label}>{label}</span>
        </span>
        <span aria-hidden className="absolute left-1 top-1 grid size-12 place-items-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.12),0_6px_16px_-6px_rgba(0,0,0,0.35)]" style={{ backgroundColor: "#242423" }}>
          <span className="flex translate-x-px text-white">
            {[0, 1, 2].map(index => (
              <svg key={index} className={index === 0 ? "size-4" : "-ml-2.5 size-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            ))}
          </span>
        </span>
      </button>
    )}
  </div>;
}
