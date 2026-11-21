"use client";

import { Component, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { brandLogo } from "./brand";
import { GlobeCard } from "./motion-brew/globe-card";
import { RotatingText } from "./motion-brew/rotating-text";
import styles from "./HomeFooter.module.css";

const places = [
  { name: "Dhaka", city: "Dhaka", lat: 23.81, lon: 90.41, color: "#b9562d" },
  { name: "Mymensingh", city: "Mymensingh", lat: 24.75, lon: 90.41, color: "#de9d73" },
];
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const currentYear = () => new Date().getFullYear();
const noYear = () => null;

class GlobeFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HomeFooter() {
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const year = useSyncExternalStore(subscribe, currentYear, noYear);
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" aria-label="SparkLab home"><Image {...brandLogo} alt="SparkLab" sizes="150px" /></Link>
          <p>Building digital experiences and intelligent solutions for businesses without boundaries.</p>
          <nav aria-label="Footer navigation">
            <Link href="/">Studio</Link><Link href="/services">Services</Link><Link href="/about">About Us</Link><Link href="/contact">Contact Us</Link>
          </nav>
          <div className={styles.details}><span>Dhaka, Bangladesh</span><span>Mymensingh, Bangladesh</span><a href="mailto:heysparklab@gmail.com">heysparklab@gmail.com</a></div>
        </div>
        <div className={styles.visual}>
          {mounted && <GlobeFallback>
            <GlobeCard title="Ideas without borders" subtitle="Connected by curiosity and creativity." cta="Explore the studio" href="/about" members={places} arcs={3} turn={90} className={`${styles.globe} shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.18)]`} />
          </GlobeFallback>}
          {mounted && <RotatingText text="Digital Innovation • Creative Technology • " label="Digital Innovation and Creative Technology" size={150} duration={30} boost={2} className={styles.ring} />}
        </div>
      </div>
      <div className={styles.bottom}>© {year} SparkLab</div>
    </footer>
  );
}
