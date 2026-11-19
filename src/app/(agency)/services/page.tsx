import Image from "next/image";
import Link from "next/link";
import { inquiryLink, services } from "../../services-data";
import { pageMetadata } from "../../site-metadata";
import PageIntro from "../PageIntro";
import shared from "../AgencyPages.module.css";
import DiscoveryGraphic from "./DiscoveryGraphic";
import styles from "./Services.module.css";

const description = "From websites and applications to automation and intelligent business systems, we turn complex ideas into practical digital solutions.";
const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const metadata = pageMetadata("/services", "Services & Pricing", description);

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <PageIntro label="What we build" heading={<>Digital Experiences. <em>Intelligent Solutions.</em></>} description={description} />
      </div>

      <nav className={styles.index} aria-label="Jump to a service">
        {services.map((service, index) => (
          <a href={`#${service.id}`} key={service.id}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {service.title}
          </a>
        ))}
      </nav>

      {services.map((service, index) => (
        <article
          className={styles.service}
          data-service={service.id}
          id={service.id}
          key={service.id}
          aria-labelledby={`${service.id}-title`}
          tabIndex={-1}
        >
          <div className={styles.copy}>
            <p className={shared.eyebrow}>Service {String(index + 1).padStart(2, "0")}</p>
            <h2 id={`${service.id}-title`}>{service.title}</h2>
            <p className={styles.description}>{service.description}</p>
            <ul className={styles.capabilities} aria-label="Capabilities">
              {service.capabilities.map(capability => <li key={capability}>{capability}</li>)}
            </ul>
            <div className={styles.actions}>
              <div className={styles.range}>
                <span>Estimated project range</span>
                <strong>{service.budget.map(amount => dollars.format(amount)).join("–")} <small>USD</small></strong>
              </div>
              <Link className={shared.button} href={inquiryLink(service.id)} aria-label={`Get a quote for ${service.title}`}>
                Get a Quote <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className={styles.visual}>
            <div className={styles.photo}>
              <Image src={service.image.src} alt={service.image.alt} fill sizes="(max-width: 740px) 90vw, (max-width: 1200px) 48vw, 640px" />
            </div>
            {service.id === "seo-geo" && <DiscoveryGraphic />}
          </div>
        </article>
      ))}

      <p className={styles.disclaimer}>Project ranges are indicative. Final pricing depends on scope, requirements, and complexity.</p>
      <section className={styles.closing} aria-labelledby="services-cta-heading">
        <h2 id="services-cta-heading">Have a project in mind?</h2>
        <Link className={shared.button} href="/contact">Let’s talk <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
