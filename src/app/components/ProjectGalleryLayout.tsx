import type { ComponentProps, ReactNode } from "react";
import Image from "next/image";
import assets from "../../../public/creative-portfolio-gallery/sources.json";
import styles from "./ProjectShowcase.module.css";

export const tileSizes = "(max-width: 600px) 46vw, (max-width: 980px) 31vw, (max-width: 1320px) 23vw, 298px";
const wideSizes = "(max-width: 600px) 46vw, (max-width: 980px) 63vw, (max-width: 1320px) 47vw, 612px";
export const detailSizes = "(max-width: 600px) 85vw, (max-width: 980px) 58vw, (max-width: 1320px) 43vw, 552px";
const depthSizes = "(max-width: 600px) 48vw, (max-width: 980px) 32vw, (max-width: 1320px) 51vw, 662px";

type Effect = "tilt" | "depth" | "prism" | "fold" | "layers" | "contour" | "light";

const projectEntries = [
  { id: "iluf-website", title: "ILUF", category: "Website design", effect: "tilt", alt: "ILUF homepage with curved architectural forms" },
  { id: "huse-identity", title: "Huse", category: "Brand identity", effect: "depth", alt: "Orange and black Huse identity board with a wordmark, app icon, and screen mockups" },
  { id: "soltek-identity", title: "Soltek", category: "Brand identity", effect: "prism", alt: "Soltek brand applications in yellow and black" },
  { id: "nexr-identity", title: "Nexr", category: "Digital product", effect: "fold", alt: "Green Nexr wordmark and brand patterns with smartwatch and phone mockups" },
  { id: "sentra-identity", title: "Sentra", category: "Digital product", effect: "layers", alt: "Sentra violet mobile screens, app icons, and product previews" },
  { id: "rivora-logo", title: "Rivora", category: "Logo design", effect: "contour", alt: "Rivora’s orange symbol and dark wordmark on a pale background with an orange glow" },
  { id: "sleep-plugg-logo", title: "Sleep Plugg", category: "Logo design", effect: "light", alt: "The Sleep Plugg wordmark on a blue and violet background" },
  { id: "airfi-identity", title: "AirFi", category: "Brand identity", effect: "layers", alt: "AirFi identity board with a pink and violet palette, wordmarks, and app icon mockups" },
  { id: "airfi-logo", title: "AirFi", category: "Logo design", effect: "light", alt: "White AirFi logo on a violet background" },
  { id: "echo-identity", title: "Echo", category: "Mobile application", effect: "tilt", alt: "Echo violet identity board with its logo, mobile app preview, and promotional artwork" },
  { id: "solbex-identity", title: "Solbex", category: "Brand identity", effect: "layers", alt: "Solbex brand board with a purple symbol, tote bag, and interface mockup" },
  { id: "payland-identity", title: "Payland", category: "Brand identity", effect: "tilt", alt: "Payland payment brand board with green product screens, symbols, and signage" },
  { id: "quantumcore-identity", title: "QuantumCore", category: "Visual identity", effect: "layers", alt: "QuantumCore identity board with blue website, digital, and print collateral" },
  { id: "soltex-profile", title: "Soltex", category: "Visual identity", effect: "light", alt: "Soltex social brand profile in orange and black" },
] satisfies { id: string; title: string; category: string; effect: Effect; alt: string }[];

export function assetPath(id: string) {
  const asset = assets.find((entry) => entry.id === id);
  if (!asset) throw new Error(`Missing portfolio artwork: ${id}`);
  return `/creative-portfolio-gallery/${asset.file}`;
}

export const projects = projectEntries.map((project) => ({ ...project, src: assetPath(project.id) }));
export type Project = (typeof projects)[number];
export function Artwork({ project, decorative = false }: { project: Project; decorative?: boolean }) {
  return (
    <Image
      src={project.src}
      alt={decorative ? "" : project.alt}
      fill
      sizes={project.id === "iluf-website" ? wideSizes : project.id === "huse-identity" ? depthSizes : tileSizes}
      draggable={false}
      className={styles.art}
    />
  );
}

export function FoldPlaceholder({ project }: { project: Project }) {
  const prism = project.effect === "prism";
  return <div>
    <div className={styles.foldArtwork} style={{ aspectRatio: prism ? 1.76 : 1.62, borderRadius: prism ? 15 : 16 }}>
      <Artwork project={project} />
      {!prism && <span className={styles.indicator} aria-hidden="true">+</span>}
    </div>
    {prism && <div aria-hidden="true" className={styles.foldCaption}>
      <span><small>01 / 02</small> Identity system</span>
      <span className={styles.foldArrows}><i>?</i><i>?</i></span>
    </div>}
  </div>;
}

export function ContourPlaceholder() {
  return <div className={styles.contour}><Artwork project={projects.find(project => project.effect === "contour")!} /></div>;
}

export function ProjectButton({ project, pressed = false, onClick, onPointerMove }: {
  project: Project;
  pressed?: boolean;
  onClick?: ComponentProps<"button">["onClick"];
  onPointerMove?: ComponentProps<"button">["onPointerMove"];
}) {
  return (
    <button
      type="button"
      aria-label={`Explore ${project.title}: ${project.alt}`}
      aria-pressed={pressed}
      data-effect={project.effect}
      className={styles.preview}
      onClick={onClick}
      onPointerMove={onPointerMove}
    >
      <span className={styles.imagePlane}><Artwork project={project} /></span>
      {project.effect === "layers" && (
        <span className={styles.detail} aria-hidden="true"><Artwork project={project} decorative /></span>
      )}
      <span className={styles.indicator} aria-hidden="true">{pressed ? "−" : "+"}</span>
    </button>
  );
}

export function ProjectGrid({ renderPreview }: { renderPreview: (project: Project) => ReactNode }) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <article key={project.id} data-project={project.id} className={styles.card} aria-labelledby={`work-${project.id}`}>
          {renderPreview(project)}
          <div className={styles.caption}>
            <h3 id={`work-${project.id}`}>{project.title}</h3>
            <span>{project.category}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
