import Link from "next/link";
import { pageMetadata } from "../../site-metadata";
import PageIntro from "../PageIntro";
import shared from "../AgencyPages.module.css";
import { about } from "./about-data";
import styles from "./About.module.css";

export const metadata = pageMetadata("/about", "About SparkLab", about.description);

export default function AboutPage() {
  return (
    <>
      <PageIntro label="About SparkLab" heading={about.heading} description={about.description} />

      {about.principles.map(({ title, copy }) => (
        <section key={title} className={`${styles.principle} ${shared.reveal}`}>
          <h2>{title}</h2>
          <p>{copy}</p>
        </section>
      ))}

      <section className={`${styles.process} ${shared.reveal}`} aria-labelledby="process-heading">
        <h2 id="process-heading">How We Work</h2>
        <ol className={`${styles.steps} ${shared.stagger}`} role="list">
          {about.process.map(({ title, copy }, index) => (
            <li key={title}>
              <span className={shared.eyebrow} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${shared.closing} ${shared.reveal}`} aria-labelledby="about-cta-heading">
        <h2 id="about-cta-heading">Have an idea worth building?</h2>
        <Link className={shared.button} href="/contact">Let&apos;s Talk <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
