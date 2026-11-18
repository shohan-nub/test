"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import assets from "../../../public/creative-portfolio-gallery/sources.json";
import styles from "./CreativePortfolioGallery.module.css";

type Preview = { id: string; title: string; category: string; alt: string; compact?: boolean };

const images = new Map(assets.map(asset => [asset.id, asset]));

// Each lead image anchors a three-lane composition. Desktop lane widths
// account for the native aspect ratios of the artwork in each stack.
const compositions: Preview[][][] = [
  [
    [
      { id: "iluf-website", title: "ILUF", category: "Website Design", alt: "ILUF homepage featuring curved architectural forms and the heading Intelligence, without limits" },
      { id: "solbex-identity", title: "Solbex", category: "Brand Identity", alt: "Solbex identity board with purple typography, a tote, a watch face and promotional artwork" },
    ],
    [
      { id: "airfi-identity", title: "AirFi", category: "Brand Identity", alt: "AirFi identity board with pink and purple brand marks, typography and a mobile preview" },
      { id: "soltek-identity", title: "Soltek", category: "Brand Identity", alt: "Soltek identity board with yellow and black applications across print, packaging and screens" },
      { id: "soltex-profile", title: "Soltex", category: "Visual Identity", alt: "Soltex orange and black social brand profile shown as a portrait layout on a black background" },
    ],
    [
      { id: "huse-identity", title: "Huse", category: "Brand Identity", alt: "Huse brand board with orange and black logo, packaging, typography and mobile applications" },
      { id: "airfi-logo", title: "AirFi", category: "Logo Design", alt: "White AirFi logo on a dark violet background", compact: true },
      { id: "rivora-logo", title: "Rivora", category: "Logo Design", alt: "Rivora wordmark and orange geometric symbol on a light gradient", compact: true },
    ],
  ],
  [
    [
      { id: "khadi-trip-website", title: "Khadi Trip", category: "Website Design", alt: "Khadi Trip website hero with ocean and island photography and the heading Unforgettable Travel Moments" },
      { id: "quantumcore-identity", title: "QuantumCore", category: "Visual Identity", alt: "QuantumCore identity board with blue web, print and digital collateral" },
    ],
    [
      { id: "sentra-identity", title: "Sentra", category: "Digital Product", alt: "Sentra brand board with violet mobile screens, app icons and digital product previews" },
      { id: "sleep-plugg-logo", title: "Sleep Plugg", category: "Logo Design", alt: "The Sleep Plugg wordmark on a dark blue and violet composition", compact: true },
      { id: "soltek-logo", title: "Soltek", category: "Logo Design", alt: "Soltek logo presented over a monochrome architectural photograph", compact: true },
    ],
    [
      { id: "nexr-identity", title: "Nexr", category: "Digital Product", alt: "Nexr green brand system with wordmarks, a watch interface and a phone preview" },
      { id: "payland-identity", title: "Payland", category: "Brand Identity", alt: "Payland payment brand board with green product screens, symbols and signage" },
      { id: "echo-identity", title: "Echo", category: "Mobile Application", alt: "Echo violet identity board with logo, mobile app screens and promotional artwork" },
    ],
  ],
];

function PortfolioPreview({ preview, featured, wideLane }: { preview: Preview; featured: boolean; wideLane: boolean }) {
  const image = images.get(preview.id);
  if (!image) throw new Error("Missing portfolio asset: " + preview.id);

  const mobile = preview.compact ? "(max-width: 369px) 88vw, (max-width: 640px) 43vw" : "(max-width: 640px) 88vw";
  const tablet = featured ? "89vw" : "44vw";
  const desktop = wideLane ? "43vw, 790px" : "27vw, 470px";
  const className = [styles.preview, featured && styles.featured, preview.compact && styles.compact]
    .filter(Boolean).join(" ");

  return (
    <figure className={className} data-portfolio-preview data-featured={featured || undefined}>
      <a
        className={styles.imageLink}
        style={{ aspectRatio: image.width + " / " + image.height }}
        href={"/" + encodeURIComponent(image.source)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={"View " + preview.title + " " + preview.category.toLowerCase() + " at full size (opens in a new tab)"}
      >
        <Image
          src={"/creative-portfolio-gallery/" + image.file}
          alt={preview.alt}
          width={image.width}
          height={image.height}
          sizes={mobile + ", (max-width: 1000px) " + tablet + ", (max-width: 1800px) " + desktop}
          loading="lazy"
        />
        <span className={styles.view} aria-hidden="true">&#8599;</span>
      </a>
      <figcaption><span>{preview.title}</span><small>{preview.category}</small></figcaption>
    </figure>
  );
}

export default function CreativePortfolioGallery() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", context => {
      const items = gsap.utils.toArray<HTMLElement>("[data-portfolio-preview]", section.current);
      // Batch only visible groups; no autoplay, pinning, or per-frame React updates.
      gsap.set(items, { opacity: 0, y: 18 });
      // Deferred batch callbacks also belong to this context for safe teardown.
      context.add("reveal", (batch: HTMLElement[]) => gsap.to(batch, {
        opacity: 1, y: 0, duration: .66, stagger: .075,
        ease: "power2.out", overwrite: true, clearProps: "opacity,transform",
      }));
      ScrollTrigger.batch(items, {
        start: "top 94%",
        once: true,
        interval: .08,
        batchMax: 3,
        onEnter: batch => context.reveal(batch),
      });
    }, section);
    return () => media.revert();
  }, []);

  return (
    <section ref={section} className={styles.section} id="creative-portfolio" aria-labelledby="creative-portfolio-heading">
      <header className={styles.heading}>
        <p className={styles.eyebrow}><span aria-hidden="true" />SELECTED WORK</p>
        <div className={styles.introduction}>
          <h2 id="creative-portfolio-heading">A Collection of<br /><em>Digital Experiences.</em></h2>
          <div className={styles.description}>
            <p>From ambitious websites and intuitive applications to distinctive branding and creative digital experiences, explore the work that brings ideas to life.</p>
          </div>
        </div>
      </header>
      <div className={styles.gallery}>
        {compositions.map((lanes, group) => (
          <div className={`${styles.composition} ${group === 1 ? styles.secondComposition : ""}`} key={group}>
            {lanes.map((previews, lane) => (
              <div className={styles.lane} key={lane}>
                {previews.map((preview, index) => (
                  <PortfolioPreview key={preview.id} preview={preview} featured={lane === 0 && index === 0} wideLane={lane === 0} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
