"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { brandLogo } from "./brand";
import styles from "./OpeningLoader.module.css";

export default function OpeningLoader() {
  const [visible, setVisible] = useState(true);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = overlay.current;
    if (!node) return;
    let context: gsap.Context | undefined;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => setVisible(false);
    const skip = () => { if (motion.matches) { context?.revert(); finish(); } };
    // The next frame sees the mounted Hero. This root component persists across
    // client navigation, so the document entrance runs only once.
    const frame = requestAnimationFrame(() => {
      if (motion.matches || getComputedStyle(node).visibility === "hidden") { finish(); return; }
      context = gsap.context(() => {
        gsap.set(node, { animation: "none" });
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
        timeline.fromTo(node.querySelector("[data-loader-brand]"), { opacity: 0, y: 10, scale: .985 }, { opacity: 1, y: 0, scale: 1, duration: .65 }, .08)
          .fromTo(node.querySelector("[data-loader-light]"), { opacity: 0, xPercent: -2 }, { opacity: 1, xPercent: 2, duration: 1.5 }, 0)
          .fromTo(node.querySelector("[data-loader-sweep]"), { xPercent: -110 }, { xPercent: 110, duration: .8, ease: "sine.inOut" }, .6)
          .fromTo(node.querySelector("[data-loader-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, .25)
          .to(node.querySelector("[data-loader-brand]"), { opacity: 0, y: -8, scale: .97, duration: .4, ease: "power2.in" }, 1.2)
          .to(node, { clipPath: "inset(0 0 100% 0)", duration: .9, ease: "power3.inOut" }, 1.35);
        const hero = document.querySelector(".hero");
        if (hero) {
          const map = hero.querySelector(".hero-map");
          const nav = hero.querySelector(".nav-shell");
          const lines = hero.querySelectorAll(".hero-line");
          const description = hero.querySelector(".hero-description");
          const controls = hero.querySelectorAll(".nav-cta,.mobile-menu");
          const details = hero.querySelectorAll(".hero-statistics > div,.hero-kicker,.hero-note,.demo-badge,.scroll-cue");
          if (map) timeline.fromTo(map, { clipPath: "inset(0 0 100% 0)", opacity: .5 }, { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.1, ease: "power3.inOut", clearProps: "clipPath,opacity" }, 1.2);
          if (nav) timeline.fromTo(nav, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, clearProps: "transform,opacity" }, 1.35);
          if (lines.length) timeline.fromTo(lines, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .12, duration: .82, clearProps: "transform,opacity" }, 1.48);
          if (description) timeline.fromTo(description, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .55, clearProps: "transform,opacity" }, 1.7);
          if (controls.length) timeline.fromTo(controls, { y: 6, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .45, clearProps: "transform,opacity" }, 1.8);
          if (details.length) timeline.fromTo(details, { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .4, clearProps: "transform,opacity" }, 1.88);
        }
      });
    });
    motion.addEventListener("change", skip);
    // A CSS fallback also releases the page if scripts or animation fail.
    const timer = window.setTimeout(finish, 2800);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); motion.removeEventListener("change", skip); context?.revert(); };
  }, []);

  if (!visible) return null;

  return <div ref={overlay} className={styles.loader} data-opening-loader role="status" aria-label="Welcome to SparkLab">
      <div className={styles.light} data-loader-light aria-hidden="true" />
      <div className={styles.brand}>
        <div className={styles.reveal} data-loader-brand>
          <Image className={styles.logo} {...brandLogo} alt="SparkLab" priority sizes="(max-width: 640px) 72vw, 420px" />
          <span className={styles.sweep} data-loader-sweep aria-hidden="true" />
        </div>
        <div className={styles.progress} aria-hidden="true"><span data-loader-progress /></div>
      </div>
    </div>;
}
