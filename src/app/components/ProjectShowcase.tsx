"use client";

import Image from "next/image";
import { type PointerEvent, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import assets from "../../../public/creative-portfolio-gallery/sources.json";
import { ContourFeatureCard } from "./motion-brew/contour-feature-card";
import { DuoFlip } from "./motion-brew/duo-flip";
import { TiltCard } from "./motion-brew/tilt-card";
import { useReducedMotionPreference } from "./motion-brew/useReducedMotionPreference";
import styles from "./ProjectShowcase.module.css";

type Effect = "tilt" | "depth" | "prism" | "fold" | "layers" | "contour" | "light";

const projectEntries = [
  { id: "iluf-website", title: "ILUF", category: "Website design", effect: "tilt", alt: "ILUF homepage with curved architectural forms" },
  { id: "huse-identity", title: "Huse", category: "Brand identity", effect: "depth", alt: "Huse orange and charcoal identity board with packaging and mobile layouts" },
  { id: "soltek-identity", title: "Soltek", category: "Brand identity", effect: "prism", alt: "Soltek brand applications in yellow and black" },
  { id: "nexr-identity", title: "Nexr", category: "Digital product", effect: "fold", alt: "Nexr green brand system with watch and phone previews" },
  { id: "sentra-identity", title: "Sentra", category: "Digital product", effect: "layers", alt: "Sentra violet mobile screens, app icons, and product previews" },
  { id: "rivora-logo", title: "Rivora", category: "Logo design", effect: "contour", alt: "Rivora orange symbol and wordmark on a light gradient" },
  { id: "sleep-plugg-logo", title: "Sleep Plugg", category: "Logo design", effect: "light", alt: "The Sleep Plugg wordmark on a blue and violet background" },
  { id: "airfi-identity", title: "AirFi", category: "Brand identity", effect: "layers", alt: "AirFi identity board with pink and violet brand marks and a mobile preview" },
  { id: "airfi-logo", title: "AirFi", category: "Logo design", effect: "light", alt: "White AirFi logo on a violet background" },
  { id: "echo-identity", title: "Echo", category: "Mobile application", effect: "tilt", alt: "Echo violet identity board with its logo, mobile app preview, and promotional artwork" },
  { id: "solbex-identity", title: "Solbex", category: "Brand identity", effect: "layers", alt: "Solbex identity system with purple type and applications on a tote and watch face" },
  { id: "payland-identity", title: "Payland", category: "Brand identity", effect: "tilt", alt: "Payland payment brand board with green product screens, symbols, and signage" },
  { id: "quantumcore-identity", title: "QuantumCore", category: "Visual identity", effect: "layers", alt: "QuantumCore identity board with blue website, digital, and print collateral" },
  { id: "soltex-profile", title: "Soltex", category: "Visual identity", effect: "light", alt: "Soltex social brand profile in orange and black" },
] satisfies { id: string; title: string; category: string; effect: Effect; alt: string }[];

function assetPath(id: string) {
  const asset = assets.find((entry) => entry.id === id);
  if (!asset) throw new Error(`Missing portfolio artwork: ${id}`);
  return `/creative-portfolio-gallery/${asset.file}`;
}

const projects = projectEntries.map((project) => ({ ...project, src: assetPath(project.id) }));
type Project = (typeof projects)[number];
const soltek = projects.find(({ effect }) => effect === "prism")!;
const nexr = projects.find(({ effect }) => effect === "fold")!;
const soltekViews = [
  { src: soltek.src, alt: soltek.alt, label: "Identity system" },
  { src: assetPath("soltek-logo"), alt: "Soltek logo on a monochrome architectural photograph", label: "Logo study" },
];
const nexrViews = [
  { src: nexr.src, alt: nexr.alt },
  { src: nexr.src, alt: "Detail of the Nexr watch interface and surrounding brand artwork", zoom: 1.85, focus: [0.62, 0.59] as const },
];
const layerSpring = { stiffness: 230, damping: 27, mass: 0.82 };
const tiltSpring = { stiffness: 225, damping: 24, mass: 0.82 };
const technologies = [
  ["Next.js", "nextjs-icon"], ["React", "react"], ["TypeScript", "typescript-icon"],
  ["JavaScript", "javascript"], ["WordPress", "wordpress-icon"],
  ["Tailwind CSS", "tailwindcss-icon"], ["PostgreSQL", "postgresql"],
] as const;

function trackPointer(event: PointerEvent<HTMLButtonElement>) {
  if (event.pointerType === "touch") return;
  const surface = event.currentTarget;
  const { left, top, width, height } = surface.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - left) / width));
  const y = Math.max(0, Math.min(1, (event.clientY - top) / height));
  surface.style.setProperty("--x", `${x * 100}%`);
  surface.style.setProperty("--y", `${y * 100}%`);
  surface.style.setProperty("--shift-x", `${(x - 0.5) * 14}px`);
  surface.style.setProperty("--shift-y", `${(y - 0.5) * 10}px`);
}

function Artwork({ project, decorative = false }: { project: Project; decorative?: boolean }) {
  return (
    <Image
      src={project.src}
      alt={decorative ? "" : project.alt}
      fill
      sizes={project.id === "iluf-website" ? "(max-width: 600px) 45vw, (max-width: 980px) 63vw, 600px" : project.id === "huse-identity" ? "(max-width: 600px) 45vw, (max-width: 980px) 31vw, 600px" : "(max-width: 600px) 45vw, (max-width: 980px) 31vw, 310px"}
      draggable={false}
      className={styles.art}
    />
  );
}

function DepthPreview({ project }: { project: Project }) {
  const reduced = useReducedMotionPreference();
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const x = useSpring(0.45, layerSpring);
  const y = useSpring(-0.35, layerSpring);
  const open = useSpring(0, layerSpring);
  const nearX = useTransform(() => x.get() * open.get() * 22);
  const nearY = useTransform(() => y.get() * open.get() * 16 - open.get() * 7);
  const farX = useTransform(() => -x.get() * open.get() * 13);
  const farY = useTransform(() => -y.get() * open.get() * 11 + open.get() * 6);
  const nearZ = useTransform(open, [0, 1], [0, 77]);
  const rearOpacity = useTransform(open, [0, 1], [0, 0.8]);

  const aim = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, 2 * (event.clientX - rect.left) / rect.width - 1));
    const ny = Math.max(-1, Math.min(1, 2 * (event.clientY - rect.top) / rect.height - 1));
    x.set(nx);
    y.set(ny);
  };

  return (
    <button
      type="button"
      aria-label={`Explore ${project.title}: ${project.alt}`}
      aria-pressed={pressed}
      data-effect="depth"
      className={styles.preview}
      onPointerEnter={(event) => {
        if (reduced || event.pointerType === "touch") return;
        aim(event);
        setHovered(true);
        open.set(1);
      }}
      onPointerMove={(event) => {
        if (!reduced && event.pointerType !== "touch") aim(event);
      }}
      onPointerLeave={() => {
        setHovered(false);
        open.set(pressed ? 1 : 0);
      }}
      onClick={() => {
        setPressed(!pressed);
        open.set(!pressed || hovered ? 1 : 0);
      }}
    >
      <motion.span className={styles.depthRear} aria-hidden="true" style={reduced ? { opacity: pressed ? 0.8 : 0 } : { x: farX, y: farY, opacity: rearOpacity }}>
        <Artwork project={project} decorative />
      </motion.span>
      <motion.span className={styles.imagePlane} style={reduced ? undefined : { x: nearX, y: nearY, z: nearZ }}>
        <Artwork project={project} />
      </motion.span>
      <span className={styles.indicator} aria-hidden="true">{pressed ? "−" : "+"}</span>
    </button>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  const [pressed, setPressed] = useState(false);

  if (project.effect === "depth") {
    return <DepthPreview project={project} />;
  }

  if (project.effect === "prism") {
    return (
      <DuoFlip
        images={soltekViews}
        label="Soltek identity views"
        autoplay={false}
        aspect={1.76}
        radius={15}
        flare={0.14}
        glass={0.63}
        prism
        blur={12}
        thickness={0.65}
        duration={1}
        className={styles.fold}
      />
    );
  }

  if (project.effect === "fold") {
    return (
      <DuoFlip
        images={nexrViews}
        label="Nexr project and design detail"
        autoplay={false}
        compact
        aspect={1.62}
        radius={16}
        flare={0.25}
        glass={0.32}
        blur={6}
        thickness={0.92}
        duration={0.9}
        className={styles.fold}
        controlClassName={styles.indicator}
      />
    );
  }

  if (project.effect === "contour") {
    return (
      <ContourFeatureCard
        className={styles.contour}
        interactiveLabel="Ripple the contours around Rivora"
        color="#a56849"
        lines={10}
        speed={0}
        lift={0.72}
      >
        <Artwork project={project} />
      </ContourFeatureCard>
    );
  }

  const control = (
    <button
      type="button"
      aria-label={`Explore ${project.title}: ${project.alt}`}
      aria-pressed={pressed}
      data-effect={project.effect}
      className={styles.preview}
      onClick={() => setPressed((value) => !value)}
      onPointerMove={project.effect === "light" ? trackPointer : undefined}
    >
      <span className={styles.imagePlane}><Artwork project={project} /></span>
      {project.effect === "layers" && (
        <span className={styles.detail} aria-hidden="true"><Artwork project={project} decorative /></span>
      )}
      <span className={styles.indicator} aria-hidden="true">{pressed ? "−" : "+"}</span>
    </button>
  );

  if (project.effect === "tilt") {
    return (
      <TiltCard className={styles.tilt} maxTilt={15} glareOpacity={0.46} hoverScale={1.035} perspective={720} spring={tiltSpring} pressed={pressed}>
        {control}
      </TiltCard>
    );
  }

  return control;
}

export default function ProjectShowcase() {
  return (
    <section className={styles.section} id="creative-portfolio" aria-labelledby="creative-portfolio-heading">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="creative-portfolio-heading">Selected Work</h2>
          <p>Explore SparkLab’s websites, digital products, and visual identities.</p>
        </header>
        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.id} data-project={project.id} className={styles.card} aria-labelledby={`work-${project.id}`}>
              <ProjectPreview project={project} />
              <div className={styles.caption}>
                <h3 id={`work-${project.id}`}>{project.title}</h3>
                <span>{project.category}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className={styles.technologyStrip} role="group" aria-label="Technologies we use">
        <div className={styles.technologyTrack}>
          {[0, 1].map((copy) => (
            <div className={styles.technologySequence} key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {[0, 1].flatMap((repeat) => technologies.map(([name, icon]) => (
                <div className={styles.technologyMark} key={`${repeat}-${name}`} title={name}>
                  <Image src={`/technology-stack/${icon}.svg`} alt={copy === 0 && repeat === 0 ? name : ""} width={72} height={34} loading="eager" unoptimized />
                </div>
              )))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
