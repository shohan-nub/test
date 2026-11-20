"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { TechnologyBridge } from "./TechnologyBridge";
import styles from "./TechnologyStackDiagram.module.css";

// Brand Bridge places the first four technologies on the left.
const technologies = [
  { id: "nextjs", name: "Next.js", icon: "nextjs-icon" },
  { id: "react", name: "React", icon: "react" },
  { id: "typescript", name: "TypeScript", icon: "typescript-icon" },
  { id: "javascript", name: "JavaScript", icon: "javascript" },
  { id: "tailwindcss", name: "Tailwind CSS", icon: "tailwindcss-icon" },
  { id: "gsap", name: "GSAP", icon: "gsap" },
  { id: "nodejs", name: "Node.js", icon: "nodejs-icon" },
  { id: "nestjs", name: "NestJS", icon: "nestjs" },
];

export function TechnologyStackDiagram() {
  const slot = useRef<HTMLDivElement>(null);
  const diagram = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = slot.current;
    const panel = diagram.current;
    if (!frame || !panel) return;

    // Fit the original Services panel, including its caption, inside the stacked card.
    const fit = () => {
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      if (width && height) setScale(Math.min(1, width / panel.offsetWidth, height / panel.offsetHeight));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={slot} className={styles.slot} data-workflow-visual="strategy" role="group" aria-label="Technology stack diagram">
      <div ref={diagram} className={styles.diagram} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <TechnologyBridge technologies={technologies} logoDirectory="/technology-stack" />
      </div>
    </div>
  );
}
