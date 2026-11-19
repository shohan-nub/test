import Link from "next/link";
import { pageMetadata } from "../../site-metadata";
import PageIntro from "../PageIntro";
import shared from "../AgencyPages.module.css";
import { about } from "./about-data";
import styles from "./About.module.css";

export const metadata = pageMetadata("/about", "About SparkLab", about.description);

export default function AboutPage() {
  const [firstLine, secondLine] = about.heading;

  return (
    <div className={styles.page}>
      <PageIntro label="About SparkLab" heading={<>{firstLine} <em>{secondLine}</em></>} description={about.description} />

      <div className={styles.principles}>
        {about.principles.map(({ title, copy }, index) => (
          <section key={title} className={styles.principle}>
            <h2><span aria-hidden="true">0{index + 1}</span>{title}</h2>
            <p>{copy}</p>
          </section>
        ))}
      </div>

      <section className={styles.process} aria-labelledby="process-heading">
        <h2 id="process-heading"><span aria-hidden="true">03</span>How We Work</h2>
        <ol className={styles.steps} role="list">
          {about.process.map(({ title, copy }, index) => (
            <li key={title}>
              <span className={shared.eyebrow} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.closing} aria-labelledby="about-cta-heading">
        <h2 id="about-cta-heading">Have an idea worth building?</h2>
        <Link className={shared.button} href="/contact">Let&apos;s Talk <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
