import Image from "next/image";
import Link from "next/link";
import { JsonLd, organizationId } from "../../entity-structured-data";
import { inquiryLink, services } from "../../services-data";
import { canonicalUrl, pageMetadata } from "../../site-metadata";
import PageIntro from "../PageIntro";
import shared from "../AgencyPages.module.css";
import DiscoveryGraphic from "./DiscoveryGraphic";
import ServiceHighlights from "./ServiceHighlights";
import TechnologyStack from "./TechnologyStack";
import styles from "./Services.module.css";

const intro = "SparkLab builds AI solutions, custom software, websites and applications for startups, small and midsize businesses, and enterprises across industries worldwide.";
const description = "Connect your tools and automate repetitive work with SparkLab’s AI workflow automation services. Explore typical project investment and request a tailored proposal.";
const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const automationService = "ai-automation";

const serviceCatalog = services.map(service => service.id === automationService
  ? {
      ...service,
      title: "AI Workflow Automation Services",
      description: "SparkLab connects your tools to route inquiries, sync records, and run recurring reports. A workflow follows predefined steps. An AI agent can use context to choose among allowed actions within that workflow. Assistants and chatbots can collect details and answer common questions.",
      capabilities: [...service.capabilities, "AI Agent Development", "Business Intelligence"],
    }
  : service);

const servicesUrl = canonicalUrl("/services");
const serviceEntities = {
  "@context": "https://schema.org",
  "@graph": serviceCatalog.map(({ id, title, description }) => {
    const url = `${servicesUrl}#${id}`;

    return {
      "@type": "Service",
      "@id": url,
      url,
      name: title,
      description,
      provider: { "@id": organizationId },
      areaServed: "Worldwide",
    };
  }),
};

export const metadata = pageMetadata("/services", "AI Workflow Automation Services", description);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={serviceEntities} />
      <PageIntro label="Services" heading="AI Workflow Automation and Digital Services" description={intro} />

      <ServiceHighlights />

      <nav className={styles.index} aria-label="Jump to a service">
        {serviceCatalog.map(service => (
          <a href={`#${service.id}`} key={service.id}>
            {service.title}
          </a>
        ))}
      </nav>

      {serviceCatalog.map(service => (
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
            {service.id === automationService && (
              <p className={styles.description}>
                Share the tasks your team repeats and the tools involved. We’ll map the workflow, scope a proposal, then build, test, and deliver the agreed solution.
                {" "}<Link href="/approach#process-title" style={{ textDecoration: "underline" }}>See how we work</Link>.
              </p>
            )}
            <ul className={styles.capabilities} aria-label="Capabilities" role="list">
              {service.capabilities.map(capability => <li key={capability}>{capability}</li>)}
            </ul>
            <div className={styles.actions}>
              <div className={styles.range}>
                <span>{service.id === automationService ? "Typical Project Investment" : "Estimated project range"}</span>
                <strong>
                  {service.id === automationService ? "$2,000–$40,000" : service.budget.map(amount => dollars.format(amount)).join("–")}
                  {" "}<small>USD</small>
                </strong>
              </div>
              <Link className={shared.button} href={inquiryLink(service.id)} aria-label={`Get a quote for ${service.title}`}>
                Get a Quote <span aria-hidden="true">↗</span>
              </Link>
            </div>
            {service.id === automationService && (
              <>
                <p className={styles.description}>
                  Your quote reflects the number of workflows, required integrations, custom AI capabilities, product requirements, and development scope. Complex custom projects can exceed $40,000.
                </p>
                <p className={styles.description}>
                  Smaller budgets are welcome, including projects under $2,000. We can adjust the scope, features, integrations, or delivery phases while maintaining consistent engineering standards, code quality, testing, and final product quality.
                </p>
              </>
            )}
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
        <Link className={shared.button} href="/contact#discovery-heading">Book a Discovery Call <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
