"use client";

import { useEffect, useState, type RefObject } from "react";

export function useNearViewport(ref: RefObject<Element | null>, rootMargin = "240px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setNear(true);
    }, { rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return near;
}
