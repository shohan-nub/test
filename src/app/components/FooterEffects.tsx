"use client";

import dynamic from "next/dynamic";
import { Component, useRef, useSyncExternalStore, type ReactNode } from "react";
import { useNearViewport } from "./useNearViewport";
import styles from "./HomeFooter.module.css";

const places = [
  { name: "Dhaka", city: "Dhaka", lat: 23.81, lon: 90.41, color: "#b9562d" },
  { name: "Mymensingh", city: "Mymensingh", lat: 24.75, lon: 90.41, color: "#de9d73" },
];

const GlobeCard = dynamic(() => import("./motion-brew/globe-card").then(module => module.GlobeCard), { ssr: false });
const ParticleCard = dynamic(() => import("./motion-brew/particle-card").then(module => module.ParticleCard), {
  ssr: false,
  loading: ParticlePlaceholder,
});

class GlobeFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

const title = "Ideas without borders";
const description = "Connected by curiosity and creativity.";
const cta = "Explore the studio";

const subscribe = () => () => {};
const currentYear = () => new Date().getFullYear();
const serverYear = () => null;

export function CopyrightYear() {
  return useSyncExternalStore(subscribe, currentYear, serverYear);
}

function ParticlePlaceholder() {
  return <div className={`${styles.particle} ${styles.particlePlaceholder}`}>
    <div className={styles.particleField} aria-hidden="true" />
    <h3 className="px-1 text-center font-semibold leading-snug tracking-tight">{title}</h3>
    <p className="mt-1 px-1 text-center text-sm opacity-60">{description}</p>
    <a href="/about" className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-black/[.06] text-sm font-medium">{cta} <span aria-hidden="true">→</span></a>
  </div>;
}

export function FooterEffects() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);

  return <div ref={ref} className={styles.visual}>
    <div className={styles.globeStage}>
      {near && <GlobeFallback><GlobeCard standalone members={places} arcs={3} turn={90} /></GlobeFallback>}
    </div>
    {near ? <ParticleCard
      title={title}
      description={description}
      cta={cta}
      href="/about"
      look="scan"
      background="#fcf6ee"
      color="#b9562d"
      textColor="#28221e"
      cell={5}
      spin={0.45}
      force={0.65}
      reach={65}
      className={styles.particle}
    /> : <ParticlePlaceholder />}
  </div>;
}
