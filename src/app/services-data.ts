export const services = [
  {
    id: "website-design",
    title: "Website Design & Development",
    budget: [800, 5000],
    description: "Plan the pages, content, and actions your visitors need, then build a site your team can maintain as the business grows.",
    capabilities: ["Custom Website Design", "Next.js Development", "Responsive Interfaces", "E-commerce Development", "Landing Pages", "CMS Integration", "Performance Optimization"],
    image: { src: "/services/website-development.webp", alt: "Desktop display in a creative web-design workspace" },
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    budget: [2000, 8000],
    description: "Define the mobile journeys that matter most, from onboarding to everyday tasks, and connect them to the services your app relies on.",
    capabilities: ["Mobile UI/UX", "iOS and Android Applications", "API Integration", "Authentication", "Database Integration", "App Performance Optimization"],
    image: { src: "/services/mobile-app-development.webp", alt: "A hand holding a smartphone displaying a mobile application" },
  },
  {
    id: "ai-automation",
    title: "AI Automation & Workflows",
    budget: [1000, 6000],
    description: "Connect business processes and remove repetitive work through intelligent automation, integrated tools, and workflows your team can manage.",
    capabilities: ["AI-powered Workflows", "Business Process Automation", "AI Assistants", "Chatbot Development", "API Integrations", "Workflow Orchestration", "Intelligent Reporting"],
    image: { src: "/services/ai-automation.webp", alt: "Network equipment and connected cables in a server rack" },
  },
  {
    id: "seo-geo",
    title: "SEO & GEO Optimization",
    budget: [500, 2500],
    description: "Make your business easier to discover. Connect search intent, useful content, entity relationships, and structured data for modern search experiences.",
    capabilities: ["Technical SEO", "On-page SEO", "Content Strategy", "Search Intent Research", "Entity Optimization", "Schema Markup", "Generative Engine Optimization", "AI Search Visibility"],
    image: { src: "/services/seo-geo.webp", alt: "Laptop displaying analytics charts on a reflective desk" },
  },
  {
    id: "custom-software",
    title: "Custom Software & Business Systems",
    budget: [2500, 12000],
    description: "Design around the work your team actually does, with practical dashboards, connected data, and integrations for the systems you already use.",
    capabilities: ["Admin Dashboards", "Management Systems", "Inventory Systems", "Business Applications", "Database Architecture", "API Development", "Scalable Software Architecture"],
    image: { src: "/services/business-systems.webp", alt: "An operations workspace with charts on multiple monitors" },
  },
  {
    id: "3d-design-branding",
    title: "3D Design & Branding",
    budget: [500, 3500],
    description: "Build a recognizable visual identity and extend it into product imagery, digital touchpoints, and interactive experiences.",
    capabilities: ["3D Product Visuals", "Brand Identity", "Logo Systems", "Digital Branding", "Creative Visual Direction", "Interactive 3D Experiences"],
    image: { src: "/services/3d-branding.webp", alt: "Studio still life with colorful product packaging" },
  },
] as const;

export const inquiryBudgets = [
  { id: "500-1000", label: "$500–$1,000" },
  { id: "1000-3000", label: "$1,000–$3,000" },
  { id: "3000-5000", label: "$3,000–$5,000" },
  { id: "5000-8000", label: "$5,000–$8,000" },
  { id: "8000-12000", label: "$8,000–$12,000" },
  { id: "unsure", label: "Not Sure Yet" },
] as const;

export function findService(id: unknown) {
  return services.find(service => service.id === id);
}

export function inquiryLink(id: (typeof services)[number]["id"]) {
  return `/contact?service=${id}#project-inquiry`;
}
