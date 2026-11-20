import Image from "next/image";
import Link from "next/link";
import { inquiryLink, services } from "../../services-data";
import { pageMetadata } from "../../site-metadata";
import PageIntro from "../PageIntro";
import shared from "../AgencyPages.module.css";
import DiscoveryGraphic from "./DiscoveryGraphic";
import PlatformStatistics from "./PlatformStatistics";
import TechnologyStack from "./TechnologyStack";
import styles from "./Services.module.css";

const description = "We build AI-powered automation, websites, web applications, mobile apps, and custom software. We also help businesses improve search visibility and build a recognizable brand.";
const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const metadata = pageMetadata("/services", "Services & Pricing", description);

export default function ServicesPage() {
  return (
    <>
      <PageIntro label="Services" heading="Digital Services for Businesses" description={description} />

      <PlatformStatistics />

      <nav className={styles.index} aria-label="Jump to a service">
        {services.map(service => (
          <a href={`#${service.id}`} key={service.id}>
            {service.title}
          </a>
        ))}
      </nav>

      {services.map(service => (
        <article
          className={styles.service}
          data-service={service.id}
          id={service.id}
          key={service.id}
          aria-labelledby={`${service.id}-title`}
          tabIndex={-1}
        >
          <div className={`${styles.copy} ${shared.reveal}`}>
            <h2 id={`${service.id}-title`}>{service.title}</h2>
            <p className={styles.description}>{service.description}</p>
            <ul className={styles.capabilities} aria-label="Capabilities" role="list">
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
          <div className={`${styles.visual} ${shared.reveal} ${shared.revealLater}`}>
            <div className={styles.photo}>
              <Image src={service.image.src} alt={service.image.alt} fill sizes="(max-width: 740px) 90vw, (max-width: 1200px) 48vw, 640px" />
            </div>
            {service.id === "seo-geo" && <DiscoveryGraphic />}
          </div>
        </article>
      ))}

      <p className={styles.disclaimer}>Final pricing depends on the scope and complexity of your project.</p>

      <TechnologyStack />

      <section className={`${shared.closing} ${shared.reveal}`} aria-labelledby="services-cta-heading">
        <h2 id="services-cta-heading">Have a project in mind?</h2>
        <Link className={shared.button} href="/contact">Let’s talk <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
