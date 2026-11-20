import Image from "next/image";
import shared from "../AgencyPages.module.css";
import styles from "./Services.module.css";

const logoDirectory = "https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos";

const technologyGroups = [
  {
    heading: "Frontend & Web Development",
    tools: [
      ["HTML5", "html-5"], ["CSS3", "css"], ["JavaScript", "javascript"], ["TypeScript", "typescript-icon"],
      ["React", "react"], ["Next.js", "nextjs-icon"], ["Tailwind CSS", "tailwindcss-icon"], ["Bootstrap", "bootstrap"],
      ["WordPress", "wordpress-icon"], ["Shopify", "shopify"],
    ],
  },
  {
    heading: "Backend & Databases",
    tools: [
      ["Node.js", "nodejs-icon"], ["Express.js", "express"], ["NestJS", "nestjs"],
      ["PostgreSQL", "postgresql"], ["MongoDB", "mongodb-icon"], ["MySQL", "mysql-icon"],
      ["Redis", "redis"], ["SQLite", "sqlite"], ["Supabase", "supabase-icon"], ["Firebase", "firebase"],
      ["Drizzle ORM", "drizzle-orm"], ["Prisma", "prisma"], ["pgvector", "postgresql"],
    ],
  },
  {
    heading: "AI & Automation",
    tools: [
      ["OpenAI", "openai-icon"], ["Google Gemini", "google-gemini"], ["n8n", "n8n-icon"],
      ["OpenClaw", "openclaw"], ["Ollama", "ollama"], ["LangChain", "langchain-icon"],
    ],
  },
  {
    heading: "Cloud & Infrastructure",
    tools: [
      ["Docker", "docker-icon"], ["Kubernetes", "kubernetes"], ["AWS", "aws"],
      ["Vercel", "vercel-icon"], ["Cloudflare", "cloudflare-icon"],
    ],
  },
  {
    heading: "Design & Development Tools",
    tools: [["Figma", "figma"], ["GitHub", "github-icon"], ["GitHub Actions", "github-actions"]],
  },
] as const;

export default function TechnologyStack() {
  return (
    <section id="technology-stack" className={styles.technologyStack} aria-labelledby="technology-stack-heading">
      <h2 id="technology-stack-heading" className={styles.supportingHeading}>Technology Stack</h2>
      {technologyGroups.map(({ heading, tools }) => (
        <div className={`${styles.technologyGroup} ${shared.reveal}`} key={heading}>
          <h3>{heading}</h3>
          <ul className={styles.technologyGrid} role="list">
            {tools.map(([name, icon]) => (
              <li className={styles.technologyMark} key={name}>
                <Image src={`${logoDirectory}/${icon}.svg`} alt="" width={56} height={34} unoptimized />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
