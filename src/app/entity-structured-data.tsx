import { canonicalUrl, siteName, siteOrigin } from "./site-metadata";

export const organizationId = `${siteOrigin}/#organization`;

export const ownerProfile = {
  name: "Abid Nion",
  url: "https://www.fiverr.com/abid_nion",
  jobTitle: "Logo and brand identity designer",
} as const;

export const siteEntities = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteName,
      url: canonicalUrl("/"),
      logo: new URL("/sparklab-mark-512.png", siteOrigin).href,
      description: "SparkLab is a Bangladesh-based creative technology studio building AI workflow automation, AI agents, assistants and chatbots, web and mobile applications, custom software, API integrations, and digital solutions for businesses of all sizes and industries.",
      email: "heysparklab@gmail.com",
      address: { "@type": "PostalAddress", addressCountry: "BD" },
      areaServed: "Worldwide",
    },
    {
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      name: siteName,
      url: canonicalUrl("/"),
      publisher: { "@id": organizationId },
    },
  ],
};

export const ownerEntity = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${canonicalUrl("/about")}#abid-nion`,
  name: ownerProfile.name,
  jobTitle: ownerProfile.jobTitle,
  knowsAbout: ["Logo design", "Brand identity"],
  worksFor: { "@id": organizationId },
  sameAs: [ownerProfile.url],
};

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
