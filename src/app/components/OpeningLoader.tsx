"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./OpeningLoader.module.css";

const storageKey = "sparklab-opening-loader-seen";
// Before paint: skip repeat visits and claim this session immediately.
const sessionCheck = `(()=>{let seen=false;try{seen=sessionStorage.getItem("${storageKey}")==="1";sessionStorage.setItem("${storageKey}","1")}catch{}document.documentElement.dataset.sparklabOpening=seen||matchMedia("(prefers-reduced-motion: reduce)").matches?"done":"active"})()`;

export default function OpeningLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const active = document.documentElement.dataset.sparklabOpening === "active";
    const timer = window.setTimeout(() => {
      document.documentElement.dataset.sparklabOpening = "done";
      setVisible(false);
    }, active ? 2000 : 0);
    return () => window.clearTimeout(timer);
  }, []);

  return <>
    <script dangerouslySetInnerHTML={{ __html: sessionCheck }} />
    {visible && <div className={styles.loader} data-opening-loader role="status" aria-label="Welcome to SparkLab">
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.panel}>
        <Image className={styles.logo} src="/sparklab-full-logo-clear.svg" alt="SparkLab" width={894} height={191} unoptimized priority />
        <div className={styles.progress} aria-hidden="true"><span /></div>
      </div>
    </div>}
  </>;
}
