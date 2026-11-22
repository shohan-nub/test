"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useNearViewport } from "./useNearViewport";

function projectFor(target: EventTarget | null) {
  return target instanceof Element ? target.closest<HTMLElement>("[data-project]")?.dataset.project : undefined;
}

export default function DeferredProjectGrid({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const near = useNearViewport(root, "650px");
  const [intent, setIntent] = useState(0);
  const [Effects, setEffects] = useState<ComponentType | null>(null);
  const queuedClick = useRef<string | undefined>(undefined);
  const focusBeforeMount = useRef<string | undefined>(undefined);

  useEffect(() => {
    if ((!near && !intent) || Effects) return;
    let disposed = false;
    void import("./ProjectGalleryEffects").then(({ default: Gallery }) => {
      if (disposed) return;
      if (root.current?.contains(document.activeElement)) {
        focusBeforeMount.current = projectFor(document.activeElement);
      }
      setEffects(() => Gallery);
    }).catch(() => { /* Keep the rendered artwork in place and retry on intent. */ });
    return () => { disposed = true; };
  }, [near, intent, Effects]);

  useLayoutEffect(() => {
    if (!Effects) return;
    const button = (project: string) => root.current?.querySelector<HTMLButtonElement>(`[data-project="${CSS.escape(project)}"] button`);
    if (focusBeforeMount.current) button(focusBeforeMount.current)?.focus({ preventScroll: true });
    if (queuedClick.current) button(queuedClick.current)?.click();
    focusBeforeMount.current = undefined;
    queuedClick.current = undefined;
  }, [Effects]);

  return <div
    ref={root}
    onFocusCapture={event => {
      if (!Effects && projectFor(event.target)) setIntent(value => value + 1);
    }}
    onClickCapture={event => {
      if (Effects || !(event.target instanceof Element) || !event.target.closest("button")) return;
      const project = projectFor(event.target);
      if (!project) return;
      queuedClick.current = project;
      setIntent(value => value + 1);
    }}
  >
    {Effects ? <Effects /> : children}
  </div>;
}
