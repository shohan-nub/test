import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Compass, Layers3, Code2, Sparkles } from "lucide-react";
import CalBookingButton from "../../components/CalBookingButton";
import { pageMetadata } from "../../site-metadata";
import PageIntro from "../PageIntro";
import shared from "../AgencyPages.module.css";
import styles from "./Approach.module.css";

const description = "See how SparkLab delivers software and AI automation, from understanding business requirements and planning integrations to development, testing, and launch.";
export const metadata = pageMetadata("/approach", "Software & AI Automation Delivery Process", description);

const process = [
  { title: "Research & Discovery", copy: "We review your business goals, user needs, and existing workflows to define what the project needs to do." },
  { title: "Strategy & Technology", copy: "Agree on scope and plan the software architecture, automation workflows, and integrations the project needs." },
  { title: "Design & Prototype", copy: "Design the experience and use prototypes to review key interactions and gather feedback before development." },
  { title: "Development & Launch", copy: "Build the software or automation, connect the required tools, and test the workflows before delivery and launch." },
];
const principles = [
  { title: "Purpose-driven strategy", copy: "Align each decision with the needs and goals of the business.", Icon: Compass },
  { title: "User-focused design", copy: "Shape clear, intuitive experiences around the people who use them.", Icon: Layers3 },
  { title: "Scalable development", copy: "Build with a considered foundation that supports future growth.", Icon: Code2 },
  { title: "Practical automation", copy: "Use intelligent solutions where they can simplify real work.", Icon: Sparkles },
];

export default function ApproachPage() {
  return <>
    <div className={styles.hero}>
      <PageIntro label="Our Approach" heading={<>How We Deliver <em>Software and AI.</em></>} description={description}>
        <Link className={`${shared.button} ${styles.heroCta}`} href="/contact">Start a conversation <ArrowUpRight size={16} aria-hidden /></Link>
      </PageIntro>
      <div className={styles.heroAside} aria-hidden="true"><span>Strategy</span><ArrowDownRight size={30} /><span>Design</span><ArrowDownRight size={30} /><span>Technology</span></div>
    </div>

    <section className={styles.section} aria-labelledby="process-title">
      <div className={styles.sectionHeading}><p className={shared.eyebrow}>Our process</p><h2 id="process-title">From discovery<br /><em>to launch.</em></h2></div>
      <ol className={`${styles.process} ${shared.stagger}`}>
        {process.map((stage, index) => <li key={stage.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{stage.title}</h3><p>{stage.copy}</p></li>)}
      </ol>
    </section>

    <section className={`${styles.section} ${styles.difference}`} aria-labelledby="difference-title">
      <div className={styles.sectionHeading}><p className={shared.eyebrow}>What makes our approach different</p><h2 id="difference-title">Thoughtful at<br /><em>every step.</em></h2></div>
      <div className={styles.principles}>{principles.map(({ title, copy, Icon }) => <article key={title}><Icon size={21} aria-hidden /><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className={`${styles.section} ${styles.collaboration}`} aria-labelledby="collaboration-title">
      <div className={styles.sectionHeading}><p className={shared.eyebrow}>How we collaborate</p><h2 id="collaboration-title">Built together,<br /><em>with clarity.</em></h2></div>
      <div className={styles.collaborationCopy}><p>We start with your goals and the challenges you want to solve. Explore our <Link href="/services" prefetch={false} style={{ textDecoration: "underline" }}>software and automation services</Link> to see where we can help.</p><p>As the project develops, we share progress, gather feedback, and refine the details through to delivery.</p><Link href="/contact" className={shared.textLink}>Tell us about your project <ArrowUpRight size={16} aria-hidden /></Link></div>
    </section>

    <section className={styles.closing} aria-labelledby="closing-title"><div><p className={shared.eyebrow}>Let&apos;s make it happen</p><h2 id="closing-title">Have an Idea<br /><em>Worth Building?</em></h2><p>Let&apos;s discuss your next project and find the right way to bring it to life.</p></div><div className={styles.actions}><Link href="/contact" className={shared.button}>Contact us <ArrowUpRight size={16} aria-hidden /></Link><CalBookingButton label="Book a Discovery Call" className={styles.booking} actionClassName={styles.bookingLink} /></div></section>
  </>;
}
