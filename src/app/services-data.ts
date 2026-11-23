export const services = [
  {
    id: "website-design",
    title: "Website Design & Development",
    budget: [2000, 30000],
    description: "We design and develop business websites, landing pages, and online stores. A content management system can let your team update pages or product information.",
    capabilities: ["Custom Website Design", "Next.js Development", "Responsive Interfaces", "E-commerce Development", "Landing Pages", "CMS Integration", "Performance Optimization"],
    image: { src: "/services/website-development.webp", alt: "Laptop and desktop monitor side by side in a web design workspace" },
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    budget: [2500, 32000],
    description: "We develop iOS and Android apps that give customers access to your services from their phones. Depending on the scope, the app can connect to your existing systems through APIs.",
    capabilities: ["Mobile UI/UX", "iOS and Android Applications", "API Integration", "Authentication", "Database Integration", "App Performance Optimization"],
    image: { src: "/services/mobile-app-development.webp", alt: "Hand holding a phone with an app’s color picker open" },
  },
  {
    id: "ai-automation",
    title: "AI Automation & Workflows",
    budget: [5000, 40000],
    description: "We build AI assistants and connect your tools to automate repetitive work.",
    capabilities: ["AI-powered Workflows", "Business Process Automation", "AI Assistants", "Chatbot Development", "API Integrations", "Workflow Orchestration", "Intelligent Reporting"],
    image: { src: "/services/ai-automation.webp", alt: "Network equipment and connected cables in a server rack" },
  },
  {
    id: "seo-geo",
    title: "SEO & GEO Optimization",
    budget: [2000, 10000],
    description: "We improve your site’s structure and content to help people discover your business in search and AI answers.",
    capabilities: ["Technical SEO", "On-page SEO", "Content Strategy", "Search Intent Research", "Entity Optimization", "Schema Markup", "Generative Engine Optimization", "AI Search Visibility"],
    image: { src: "/services/seo-geo.webp", alt: "Laptop displaying analytics charts on a reflective desk" },
  },
  {
    id: "custom-software",
    title: "Custom Software & Business Systems",
    budget: [4000, 40000],
    description: "We build custom web applications, dashboards, and inventory systems for teams whose daily work spans several tools. A dashboard can bring records into one place for reporting or tracking stock.",
    capabilities: ["Admin Dashboards", "Management Systems", "Inventory Systems", "Business Applications", "Database Architecture", "API Development", "Scalable Software Architecture"],
    image: { src: "/services/business-systems.webp", alt: "An operations workspace with charts on multiple monitors" },
  },
  {
    id: "3d-design-branding",
    title: "3D Design & Branding",
    budget: [3000, 30000],
    description: "We design brand identities and 3D product visuals to help customers recognize your brand.",
    capabilities: ["3D Product Visuals", "Brand Identity", "Logo Systems", "Digital Branding", "Creative Visual Direction", "Interactive 3D Experiences"],
    image: { src: "/services/3d-branding.webp", alt: "Purple, red, and yellow pump bottles lit against a dark backdrop" },
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

export const contactBudgets = [
  { id: "under-2000", label: "Less than $2,000" },
  { id: "2000-5000", label: "$2,000 – $5,000" },
  { id: "5000-10000", label: "$5,000 – $10,000" },
  { id: "10000-20000", label: "$10,000 – $20,000" },
  { id: "20000-40000", label: "$20,000 – $40,000" },
  { id: "unsure", label: "Not sure yet" },
] as const;

export const contactTimelines = ["Immediately", "Within 1 Month", "1–3 Months", "Flexible"] as const;

export function findService(id: unknown) {
  return services.find(service => service.id === id);
}

export function inquiryLink(id: (typeof services)[number]["id"]) {
  return `/contact?service=${id}#project-inquiry`;
}
