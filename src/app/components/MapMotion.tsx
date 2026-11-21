"use client";

import { useEffect } from "react";

export default function MapMotion() {
  useEffect(() => {
    const svg = document.querySelector<SVGSVGElement>("#hero-world-map");
    const map = svg?.parentElement;
    if (!svg || !map) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      const playing = visible && !document.hidden && !reduced.matches;
      map.toggleAttribute("data-map-playing", playing);
      if (playing) svg.unpauseAnimations();
      else svg.pauseAnimations();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(map);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return null;
}
