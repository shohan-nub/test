"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import styles from "./Footer.module.css";

const linkGroups = [
  { title: "Explore", links: [["Studio", "#discover"], ["Services", "#experiences"], ["Our approach", "#destinations"]] },
  { title: "Company", links: [["About SparkLab", "#manifesto"], ["Start a conversation", "#contact-form"]] },
  { title: "Connect", links: [["Portfolio ↗", "https://shohan-portfolio-tau.vercel.app/"], ["Send a message", "#contact-form"]] },
];

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setYear(new Date().getFullYear()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(fields)) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to send your message right now.");
      form.reset();
      setStatus("success");
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "Unable to send your message right now.");
    }
  };

  return <footer className={styles.footer} id="contact" aria-labelledby="footer-heading">
    <div className={styles.inner}>
      <div className={styles.cta}>
        <div><p className={styles.eyebrow}>GOOD THINGS START WITH A SPARK</p><h2 id="footer-heading">Have an idea?<br /><em>Let&apos;s make it happen.</em></h2><p className={styles.support}>Thoughtful design. Powerful technology. A conversation away.</p></div>
        <a className={styles.contactButton} href="#contact-form">Let&apos;s talk <span aria-hidden="true">↗</span></a>
      </div>
      <div className={styles.main}>
        <div className={styles.brandArea}>
          <a className={styles.logoPanel} href="#discover" aria-label="SparkLab home"><Image src="/sparklab-full-logo-clear.svg" alt="SparkLab" width={894} height={191} unoptimized /></a>
          <p className={styles.description}>We bring design, development, and intelligent automation together to build digital experiences with purpose.</p>
          <p className={styles.location}><span aria-hidden="true">↗</span> Dhaka, Bangladesh <span className={styles.locationNote}>Working without boundaries.</span></p>
          <nav className={styles.navigation} aria-label="Footer navigation">{linkGroups.map(group => <div key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <a key={label} href={href} {...(href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{label}</a>)}</div>)}</nav>
        </div>
        <form className={styles.form} id="contact-form" onSubmit={handleSubmit} aria-label="Send SparkLab a message">
          <p className={styles.eyebrow}>TELL US WHAT YOU HAVE IN MIND</p>
          <label>Full Name<input name="name" type="text" autoComplete="name" maxLength={100} required /></label>
          <label>Email Address<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
          <label className={styles.fullWidth}>Subject<input name="subject" type="text" maxLength={160} required /></label>
          <label className={styles.fullWidth}>Message<textarea name="message" rows={3} maxLength={5000} required /></label>
          <input className={styles.honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button className={styles.submit} type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : <>Send message <span aria-hidden="true">↗</span></>}</button>
          <p className={styles.response} aria-live="polite">{status === "success" ? "Thanks for reaching out! Your message has been sent successfully." : status === "error" ? error : "We usually respond within 1–2 business days."}</p>
        </form>
      </div>
      <div className={styles.bottom}><span>© {year} SparkLab</span><span>Built for what&apos;s next.</span><a href="#discover">Back to top <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
