export const workflowStages = [
  {
    id: "research",
    tone: "apricot",
    stage: "Research & Discovery",
    title: "Understand the Business and Its Users",
    points: ["Market Research", "Competitor Analysis", "Audience Research", "Business Goals"],
  },
  {
    id: "strategy",
    tone: "butter",
    stage: "Strategy & Technology",
    title: "Plan the Architecture and Roadmap",
    points: ["Technology Selection", "Architecture Planning", "Feature Mapping", "Project Roadmap"],
  },
  {
    id: "design",
    tone: "coral",
    stage: "Design & Prototype",
    title: "Design and Prototype the Product",
    points: ["Wireframing", "UI/UX Design", "Interactive Prototypes", "Design Systems"],
  },
  {
    id: "launch",
    tone: "sage",
    stage: "Development & Launch",
    title: "Build, Test, and Launch",
    points: ["Frontend & Backend Development", "Testing & Optimization", "Performance", "Deployment"],
  },
] as const;
