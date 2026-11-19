"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { brandLogo } from "./brand";
import CalBookingButton from "./CalBookingButton";
import styles from "./FinalContact.module.css";

export default function FinalContact() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      card.dataset.revealed = "true";
      observer.disconnect();
    }, { threshold: .18 });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="contact" aria-labelledby="final-contact-title">
      <div className={styles.card} ref={cardRef}>
        <div className={styles.portrait}>
          <Image
            src="/Confident Studio Portrait with Orange Emblem.png"
            width={1254}
            height={1254}
            sizes="(max-width: 580px) 86vw, (max-width: 719px) 480px, (max-width: 1200px) 37vw, 430px"
            alt="SparkLab portrait in a black T-shirt with the orange SparkLab emblem"
          />
        </div>
        <div className={styles.content}>
          <p className={styles.label}>LET&apos;S CONNECT · SPARKLAB</p>
          <h2 id="final-contact-title">
            More Than Just <span><em>Digital</em> Experiences.</span>
          </h2>
          <p className={styles.description}>
            From strategy and automation to intelligent systems and digital products — we bring
            everything together to turn ideas into reality.
          </p>
          <p className={styles.invitation}>Have something in mind? Let&apos;s make it happen.</p>
          <CalBookingButton />
        </div>
      </div>
      <div className={styles.signature}>
        <Image {...brandLogo} width={96} height={22} alt="SparkLab" />
        <span>© SparkLab</span>
      </div>
    </section>
  );
}
