import DeferredProjectGrid from "./DeferredProjectGrid";
import { ContourPlaceholder, FoldPlaceholder, ProjectButton, ProjectGrid, type Project } from "./ProjectGalleryLayout";
import styles from "./ProjectShowcase.module.css";

function restingPreview(project: Project) {
  if (project.effect === "prism" || project.effect === "fold") return <FoldPlaceholder project={project} />;
  if (project.effect === "contour") return <ContourPlaceholder />;
  const button = <ProjectButton project={project} />;
  return project.effect === "tilt" ? <div className={styles.tilt}>{button}</div> : button;
}

export default function ProjectShowcase() {
  return (
    <section className={styles.section} id="creative-portfolio" aria-labelledby="creative-portfolio-heading">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="creative-portfolio-heading">Selected Work</h2>
          <p>Explore SparkLab&#8217;s websites, digital products, and visual identities.</p>
        </header>
        <DeferredProjectGrid>
          <ProjectGrid renderPreview={restingPreview} />
        </DeferredProjectGrid>
      </div>
    </section>
  );
}
