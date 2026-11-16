// Add verified public details here. Empty social URLs render non-clickable icons.
export const footerConfig = {
  email: "",
  portfolio: "https://shohan-portfolio-tau.vercel.app/",
  socials: {
    facebook: "",
    instagram: "",
    linkedin: "",
    fiverr: "",
    behance: "",
    dribbble: "",
    youtube: "",
  } as Record<string, string>,
  locations: [
    { city: "Dhaka", country: "Bangladesh" },
    { city: "Mymensingh", country: "Bangladesh" },
  ],
};

export const footerNavigation = [
  { title: "Explore", links: [
    { label: "Home", href: "#discover" },
    { label: "Work", href: "#experiences" },
    { label: "About", href: "#manifesto" },
    { label: "Contact", href: "#contact-form" },
  ] },
  { title: "Services", links: [
    { label: "Website Design", href: "#experiences" },
    { label: "Web Development", href: "#service-overview-heading" },
    { label: "SEO & GEO", href: "#destinations" },
    { label: "AI Automation", href: "#service-overview-heading" },
    { label: "Business Systems", href: "#service-overview-heading" },
  ] },
];

export const socialPlatforms = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "fiverr", label: "Fiverr" },
  { id: "behance", label: "Behance" },
  { id: "dribbble", label: "Dribbble" },
  { id: "youtube", label: "YouTube" },
];
