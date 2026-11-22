import Link from "next/link";
import { pageMetadata } from "../../site-metadata";
import { JsonLd, ownerEntity, ownerProfile } from "../../entity-structured-data";
import PageIntro from "../PageIntro";
import shared from "../AgencyPages.module.css";
import { about } from "./about-data";
import styles from "./About.module.css";

const title = "About SparkLab | Studio & Values";
const description = "Meet SparkLab, a creative technology studio based in Bangladesh. Learn how we design and build software and AI-powered automation for businesses worldwide.";
const aboutMetadata = pageMetadata("/about", title, description);

export const metadata = {
  ...aboutMetadata,
  title: { absolute: title },
  openGraph: { ...aboutMetadata.openGraph, title },
  twitter: { ...aboutMetadata.twitter, title },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={ownerEntity} />
      <div className={styles.overview}>
        <PageIntro label="About SparkLab" heading={about.heading} description={about.description} />
        <div className={`${styles.principles} ${shared.stagger}`}>
          {about.principles.map(({ title, copy, link }) => (
            <section key={title} className={styles.principle}>
              <h2>{title}</h2>
              <p>
                {copy}
                {link && <>{" "}<Link href={link.href} prefetch={false} style={{ textDecoration: "underline" }}>{link.label}</Link>.</>}
              </p>
              {title === "What We Value" && (
                <p id="abid-nion">
                  SparkLab owner {ownerProfile.name} specializes in logo design and brand identity.{" "}
                  <a href={ownerProfile.url} style={{ textDecoration: "underline" }}>View his individual Fiverr profile</a>.
                </p>
              )}
            </section>
          ))}
        </div>
      </div>

      <section className={styles.process} aria-labelledby="process-heading">
        <div className={shared.reveal}>
          <h2 id="process-heading">How We Work</h2>
        </div>
        <ol className={`${styles.steps} ${shared.stagger}`} role="list">
          {about.process.map(({ title, copy, link }, index) => (
            <li key={title}>
              <span className={shared.eyebrow} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>
                {copy}
                {link && <>{" "}<Link href={link.href} prefetch={false} style={{ textDecoration: "underline" }}>{link.label}</Link>.</>}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${shared.closing} ${shared.reveal}`} aria-labelledby="about-cta-heading">
        <h2 id="about-cta-heading">Have an idea worth building?</h2>
        <Link className={shared.button} href="/contact">Discuss Your Project <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
