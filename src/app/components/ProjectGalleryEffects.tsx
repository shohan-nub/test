"use client";

import dynamic from "next/dynamic";
import { getImageProps } from "next/image";
import { useState, type PointerEvent } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { TiltCard } from "./motion-brew/tilt-card";
import { useReducedMotionPreference } from "./motion-brew/useReducedMotionPreference";
import { Artwork, assetPath, ContourPlaceholder, detailSizes, FoldPlaceholder, ProjectButton, ProjectGrid, projects, tileSizes, type Project } from "./ProjectGalleryLayout";
import styles from "./ProjectShowcase.module.css";

const duo = () => import("./motion-brew/duo-flip").then(module => module.DuoFlip);
const contour = () => import("./motion-brew/contour-feature-card").then(module => module.ContourFeatureCard);

const soltek = projects.find(({ effect }) => effect === "prism")!;
const nexr = projects.find(({ effect }) => effect === "fold")!;
function responsiveView(src: string, alt: string, sizes = tileSizes) {
  const { props } = getImageProps({ src, alt, fill: true, sizes });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes, alt };
}

const soltekViews = [
  { ...responsiveView(soltek.src, soltek.alt), label: "Identity system" },
  { ...responsiveView(assetPath("soltek-logo"), "Soltek logo on a monochrome architectural photograph"), label: "Logo study" },
];
const nexrViews = [
  responsiveView(nexr.src, nexr.alt, detailSizes),
  { ...responsiveView(nexr.src, "Detail of the Nexr watch interface and surrounding brand artwork", detailSizes), zoom: 1.85, focus: [0.62, 0.59] as const },
];

const SoltekFold = dynamic(duo, { ssr: false, loading: () => <FoldPlaceholder project={soltek} /> });
const NexrFold = dynamic(duo, { ssr: false, loading: () => <FoldPlaceholder project={nexr} /> });
const ContourFeatureCard = dynamic(contour, { ssr: false, loading: () => <ContourPlaceholder /> });

const layerSpring = { stiffness: 230, damping: 27, mass: 0.82 };
const tiltSpring = { stiffness: 225, damping: 24, mass: 0.82 };
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
      <SoltekFold
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
      <NexrFold
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
        interactiveLabel={`Ripple the contours around ${project.title}. ${project.alt}`}
        color="#a56849"
        lines={10}
        speed={0}
        lift={0.72}
      >
        <Artwork project={project} />
      </ContourFeatureCard>
    );
  }

  const control = <ProjectButton
    project={project}
    pressed={pressed}
    onClick={() => setPressed(value => !value)}
    onPointerMove={project.effect === "light" ? trackPointer : undefined}
  />;

  if (project.effect === "tilt") {
    return (
      <TiltCard className={styles.tilt} maxTilt={15} glareOpacity={0.46} hoverScale={1.035} perspective={720} spring={tiltSpring} pressed={pressed}>
        {control}
      </TiltCard>
    );
  }

  return control;
}

export default function ProjectGalleryEffects() {
  return <ProjectGrid renderPreview={project => <ProjectPreview project={project} />} />;
}
