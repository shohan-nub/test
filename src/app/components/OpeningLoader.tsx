"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./OpeningLoader.module.css";

export default function OpeningLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Root layouts persist during client navigation. A new document mounts a
    // fresh overlay; CSS also ends it after two seconds if hydration is slow.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setVisible(false), reduced ? 0 : 2000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return <div className={styles.loader} data-opening-loader role="status" aria-label="Welcome to SparkLab"
    onAnimationEnd={event => { if (event.target === event.currentTarget) setVisible(false); }}>
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.brand}>
        <div className={styles.reveal}>
          <Image className={styles.logo} src="/sparklab-full-logo-clear.svg" alt="SparkLab" width={894} height={191} unoptimized priority />
        </div>
        <div className={styles.progress} aria-hidden="true"><span /></div>
      </div>
    </div>;
}
