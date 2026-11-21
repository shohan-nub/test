"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type ReactNode } from "react";
import type { workflowStages } from "./workflow-stages";
import { useNearViewport } from "./useNearViewport";
import styles from "./WorkflowVisuals.module.css";

const desktop = "(min-width: 1100px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";
const WorkflowVisual = dynamic(() => import("./WorkflowVisuals").then(module => module.WorkflowVisual), { ssr: false });

export function DeferredWorkflowVisual({ stage }: { stage: (typeof workflowStages)[number]["id"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref, "180px");
  return <div ref={ref} className={styles.visualMount}>{near && <WorkflowVisual stage={stage} />}</div>;
}

export function WorkflowMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref, "900px");

  useEffect(() => {
    if (!ref.current || !near) return;
    const track = ref.current;
    const section = track.querySelector<HTMLElement>(".experiences")!;
    const stack = section.querySelector<HTMLElement>(".capability-stack")!;
    const cards = [...stack.querySelectorAll<HTMLElement>(".capability-card")];
    const heading = section.querySelector(".project-statement-track");
    const showreel = section.querySelector<HTMLElement>(".workflow-showreel")!;
    const media = window.matchMedia(desktop);
    let dispose: (() => void) | undefined;
    let revision = 0;

    async function sync() {
      const run = ++revision;
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;

      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (run !== revision || !media.matches) return;
        gsap.registerPlugin(ScrollTrigger);

        let viewHeight = 0;
        let cardOffset = 0;
        let cardScaleX = 1;
        let cardScaleY = 1;
        let showreelOffset = 0;
        function measure() {
          viewHeight = section.clientHeight;
          cardOffset = stack.offsetTop;
          cardScaleX = stack.clientWidth / Math.max(1, section.clientWidth);
          cardScaleY = stack.clientHeight / Math.max(1, viewHeight);
          showreelOffset = cardOffset + stack.clientHeight / 2 - viewHeight / 2;
        }
        measure();

        const context = gsap.context(() => {
          const timeline = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });
          const activation = [0];
          cards.slice(1).forEach((card, index) => {
            const start = .48 + index * 1.42;
            activation.push(start + .67);
            timeline.fromTo(card, { y: () => viewHeight - cardOffset }, { y: (index + 1) * 10, duration: 1 }, start);
          });
          const entry = .48 + (cards.length - 1) * 1.42;
          activation.push(entry + .7);
          timeline.fromTo(showreel, {
            y: () => viewHeight / 2 * (1 + cardScaleY),
            scaleX: () => cardScaleX,
            scaleY: () => cardScaleY,
          }, { y: () => showreelOffset + 40, duration: 1 }, entry);
          timeline.to(showreel, { y: 0, scaleX: 1, scaleY: 1, duration: 1.25 }, entry + 1.26);
          timeline.to({}, { duration: .4 });
          if (heading) timeline.to(heading, { xPercent: -50, duration: timeline.duration(), ease: "none" }, 0);

          const panels = [...cards, showreel];
          let active = -1;
          function syncActivePanel() {
            const time = timeline.time();
            let next = 0;
            while (next + 1 < activation.length && time >= activation[next + 1]) next++;
            if (next === active) return;
            panels.forEach((panel, index) => {
              panel.inert = index !== next;
              panel.toggleAttribute("data-workflow-active", index === next);
            });
            active = next;
          }
          timeline.eventCallback("onUpdate", syncActivePanel);
          const trigger = ScrollTrigger.create({
            id: "home-workflow",
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            animation: timeline,
            scrub: .32,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          });
          // Render initial transforms before revealing the stacked layout.
          timeline.progress(trigger.progress);
          syncActivePanel();
        }, track);

        track.dataset.stackReady = "true";
        dispose = () => {
          delete track.dataset.stackReady;
          context.revert();
          [...cards, showreel].forEach(panel => {
            panel.inert = false;
            panel.removeAttribute("data-workflow-active");
          });
        };
      } catch {
        if (run === revision) track.dataset.stackFailed = "true";
      }
    }

    media.addEventListener("change", sync);
    void sync();
    return () => {
      revision++;
      media.removeEventListener("change", sync);
      dispose?.();
      delete track.dataset.stackFailed;
    };
  }, [near]);

  return (
    <div ref={ref} className="workflow-track" id="experiences">
      <section className="experiences section-pad" aria-label="SparkLab workflow and showreel">
        {children}
      </section>
    </div>
  );
}
