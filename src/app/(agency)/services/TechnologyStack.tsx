import { TechnologyBridge } from "../../components/TechnologyBridge";
import styles from "./Services.module.css";

// Frameworks, tooling, runtime, and email delivery used by this site.
const technologies = [
  { id: "nextjs", name: "Next.js", icon: "nextjs-icon" },
  { id: "react", name: "React", icon: "react" },
  { id: "typescript", name: "TypeScript", icon: "typescript-icon" },
  { id: "javascript", name: "JavaScript", icon: "javascript" },
  { id: "tailwindcss", name: "Tailwind CSS", icon: "tailwindcss-icon" },
  { id: "gsap", name: "GSAP", icon: "gsap" },
  { id: "nodejs", name: "Node.js", icon: "nodejs-icon" },
  { id: "resend", name: "Resend", icon: "resend-icon" },
];

export default function TechnologyStack() {
  return (
    <section id="technology-stack" className={styles.technologyStack} aria-labelledby="technology-stack-heading">
      <header className={styles.technologyIntro}>
        <h2 id="technology-stack-heading">Technology <em>Stack</em></h2>
        <p>The tools behind this site, from the interface and motion to the code that delivers your inquiries.</p>
      </header>

      <TechnologyBridge technologies={technologies} />
    </section>
  );
}
