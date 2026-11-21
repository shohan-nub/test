"use client";

import { Component, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { brandLogo } from "./brand";
import { GlobeCard } from "./motion-brew/globe-card";
import { ParticleCard } from "./motion-brew/particle-card";
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
        <div>
          <div className={styles.brandCard}>
            <Link className={styles.logo} href="/" aria-label="SparkLab home">
              <Image {...brandLogo} alt="SparkLab" sizes="150px" />
            </Link>
            <div className={styles.signature}>
              <Image {...brandLogo} width={96} height={22} alt="" />
              <span>© SparkLab</span>
            </div>
          </div>
          <p className={styles.description}>Building digital experiences and intelligent solutions for businesses without boundaries.</p>
          <div className={styles.details}>
            <nav aria-label="Footer navigation">
              <h2>Explore</h2>
              <ul>
                <li><Link href="/">Studio</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </nav>
            <div>
              <h2>Locations</h2>
              <ul><li>Dhaka, Bangladesh</li><li>Mymensingh, Bangladesh</li></ul>
            </div>
          </div>
          <a className={styles.email} href="mailto:heysparklab@gmail.com">
            <span>Email SparkLab</span>
            <strong>heysparklab@gmail.com</strong>
            <span className={styles.emailArrow} aria-hidden="true">↗</span>
          </a>
        </div>
        <div className={styles.visual}>
          <div className={styles.globeStage}>
            {mounted && <GlobeFallback>
              <GlobeCard standalone members={places} arcs={3} turn={90} />
            </GlobeFallback>}
            <RotatingText text="Digital Innovation • Creative Technology • " label="Digital Innovation and Creative Technology" size={96} duration={30} boost={2} className={styles.ring} />
          </div>
          <ParticleCard
            title="Ideas without borders"
            description="Connected by curiosity and creativity."
            cta="Explore the studio"
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
          />
        </div>
      </div>
      <div className={styles.bottom}>© {year} SparkLab</div>
    </footer>
  );
}
