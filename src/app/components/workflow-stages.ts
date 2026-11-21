export const workflowStages = [
  {
    id: "research",
    tone: "apricot",
    stage: "Research & Discovery",
    title: "Understand Before We Build.",
    points: ["Market Research", "Competitor Analysis", "Audience Research", "Business Goals"],
  },
  {
    id: "strategy",
    tone: "butter",
    stage: "Strategy & Technology",
    title: "The Right Strategy. The Right Stack.",
    points: ["Technology Selection", "Architecture Planning", "Feature Mapping", "Project Roadmap"],
  },
  {
    id: "design",
    tone: "coral",
    stage: "Design & Prototype",
    title: "From Ideas to Experiences.",
    points: ["Wireframing", "UI/UX Design", "Interactive Prototypes", "Design Systems"],
  },
  {
    id: "launch",
    tone: "sage",
    stage: "Development & Launch",
    title: "Built, Tested, Ready to Grow.",
    points: ["Frontend & Backend Development", "Testing & Optimization", "Performance", "Deployment"],
  },
] as const;
