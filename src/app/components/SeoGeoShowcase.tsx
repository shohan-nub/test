"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./SeoGeoShowcase.module.css";
import services from "./seo-geo-services.json";
import { useNearViewport } from "./useNearViewport";

const count = services.length;
const slot = (index: number, active: number) => ((index - active + count + 3) % count) - 3;

export default function SeoGeoShowcase() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const root = useRef<HTMLElement>(null);
  const near = useNearViewport(root, "240px");
  const cards = useRef<Array<HTMLDivElement | null>>([]);
  const previous = useRef(0);
  const initialized = useRef(false);
  const drag = useRef<{ id: number; x: number; y: number; dx: number } | null>(null);
  const navigate = (direction: number) => {
    setActive(index => (index + direction + count) % count);
  };

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: gsap.core.Tween | undefined;
    const schedule = () => {
      timer?.kill();
      if (visible && playing && !dragging && !media.matches && !document.hidden) {
        timer = gsap.delayedCall(1.7, () => setActive(index => (index + 1) % count));
      }
    };
    schedule();
    media.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => { timer?.kill(); media.removeEventListener("change", schedule); document.removeEventListener("visibilitychange", schedule); };
  }, [active, visible, dragging, playing]);

  useEffect(() => {
    if (!near) return;
    const media = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia("(max-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = cards.current.slice();
    const arrange = (instant = false) => {
      nodes.forEach((card, index) => {
        if (!card) return;
        const distance = slot(index, active);
        const oldDistance = slot(index, previous.current);
        const rotation = media.matches ? 6 : tablet.matches ? 10 : 14;
        const position = { x: 0, xPercent: distance * 84, rotationY: distance === 0 ? 0 : distance < 0 ? rotation : -rotation, scale: distance === 0 ? 1 : .82, z: distance === 0 ? 0 : media.matches ? -45 : tablet.matches ? -70 : -100, autoAlpha: Math.abs(distance) <= 1 ? 1 : 0 };
        gsap.set(card, { zIndex: distance === 0 ? 3 : Math.abs(distance) === 1 ? 2 : 1 });
        // Offstage cards wrap while invisible; only adjacent cards cross the stage.
        if (instant || reduced.matches || Math.abs(distance) > 1 && Math.abs(oldDistance) > 1) gsap.set(card, position);
        else gsap.to(card, { ...position, duration: .75, ease: "power3.inOut", overwrite: true });
      });
      previous.current = active;
    };
    arrange(!initialized.current);
    initialized.current = true;
    const resize = () => arrange(true);
    media.addEventListener("change", resize);
    tablet.addEventListener("change", resize);
    reduced.addEventListener("change", resize);
    return () => { media.removeEventListener("change", resize); tablet.removeEventListener("change", resize); reduced.removeEventListener("change", resize); nodes.forEach(card => { if (card) gsap.killTweensOf(card); }); };
  }, [active, near]);

  const release = (cancelled = false) => {
    const gesture = drag.current;
    if (!gesture) return;
    drag.current = null;
    setDragging(false);
    if (!cancelled && Math.abs(gesture.dx) > 45) navigate(gesture.dx < 0 ? 1 : -1);
    else gsap.to(cards.current.filter(Boolean), { x: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .45, ease: "power3.out", overwrite: "auto" });
  };

  return <section ref={root} className={styles.section} id="destinations" aria-labelledby="visibility-title">
    <div className={styles.heading}>
      <h2 id="visibility-title">Be Seen. Be Found.<br /><em>Be Chosen.</em></h2>
      <p className={styles.intro}>Helping businesses grow through search visibility, intelligent discovery, and connected digital systems.</p>
    </div>
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Digital visibility capabilities">
      <div className={styles.stage} role="group" tabIndex={0} aria-label="Use left and right arrow keys, or swipe, to explore services"
        onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); navigate(event.key === "ArrowRight" ? 1 : -1); } }}
        onPointerDown={event => { if (!event.isPrimary || event.button !== 0) return; drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0 }; event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }}
        onPointerMove={event => { const gesture = drag.current; if (!gesture || gesture.id !== event.pointerId) return; gesture.dx = event.clientX - gesture.x; if (Math.abs(gesture.dx) > Math.abs(event.clientY - gesture.y)) gsap.set(cards.current.filter(Boolean), { x: gesture.dx * .55 }); }}
        onPointerUp={event => { release(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => release(true)} onLostPointerCapture={() => release(true)}>
        {services.map((service, index) => <div key={service.image} className={styles.card} ref={node => { cards.current[index] = node; }}
          data-artwork={failedImages.includes(service.image) ? "error" : "available"}
          role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}: ${service.title}`} aria-hidden={index !== active}
          style={{ transform: `translateX(${slot(index, 0) * 84}%) scale(${index === 0 ? 1 : .82})`, opacity: Math.abs(slot(index, 0)) <= 1 ? 1 : 0, zIndex: index === 0 ? 3 : 1 }}>
          {!failedImages.includes(service.image) ? <Image
            src={`/seo-geo-showcase/${service.image}?v=${service.imageVersion}`} alt={service.alt}
            fill sizes="(max-width: 640px) 82vw, (max-width: 900px) 64vw, (max-width: 1200px) 52vw, 640px"
            draggable={false} loading={visible && Math.abs(slot(index, active)) <= 1 ? "eager" : "lazy"}
            onError={() => setFailedImages(images => images.includes(service.image) ? images : [...images, service.image])}
          /> : <span className={styles.imageError}>Image unavailable</span>}
          <div className={styles.caption}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")} / 07</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        </div>)}
      </div>
      <div className={styles.controls}>
        <span className={styles.counter}>{String(active + 1).padStart(2, "0")} <span>/ 07</span></span>
        <div className={styles.dots} role="group" aria-label="Select a capability">{services.map((service, index) => <button key={service.title} type="button" aria-label={`Show ${service.title}`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}><span /></button>)}</div>
        <div className={styles.arrows}><button type="button" aria-label="Previous capability" onClick={() => navigate(-1)}>←</button><button type="button" aria-label="Next capability" onClick={() => navigate(1)}>→</button><button type="button" aria-label={playing ? "Pause automatic slides" : "Resume automatic slides"} aria-pressed={!playing} onClick={() => setPlaying(value => !value)}>{playing ? "Ⅱ" : "▷"}</button></div>
      </div>
    </div>
    <div className={styles.footer}>
      <a href="#experiences">Explore Our Capabilities <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
