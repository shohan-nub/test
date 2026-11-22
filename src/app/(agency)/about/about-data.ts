export const about = {
  heading: "Meet the SparkLab Studio.",
  description: "SparkLab is a creative technology studio based in Bangladesh, working with businesses worldwide.",
  principles: [
    {
      title: "What We Build",
      copy: "We develop websites, web and mobile apps, custom software, and AI-powered tools for business automation.",
      link: { href: "/services", label: "Explore our services" },
    },
    { title: "What We Value", copy: "Software should be useful, reliable, and easy to use.", link: null },
  ],
  process: [
    { title: "Discover", copy: "Understand what your team and customers need.", link: null },
    { title: "Design", copy: "Plan how the product will look and work.", link: null },
    { title: "Build", copy: "Develop and test the product.", link: null },
    {
      title: "Improve",
      copy: "Use feedback to improve the product.",
      link: { href: "/approach", label: "See our approach" },
    },
  ],
} as const;
