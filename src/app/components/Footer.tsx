"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import styles from "./Footer.module.css";
import { brandLogo } from "./brand";
import FooterGlobe from "./FooterGlobe";
import { footerConfig, footerNavigation, socialPlatforms } from "./footer-config";

function LocationPin() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

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
        <div className={styles.closingCopy}>
          <p className={styles.eyebrow}><span /> THE NEXT CHAPTER STARTS WITH YOU</p>
          <h2 id="footer-heading"><span>Have an Idea?</span>Let&apos;s Build Something <em>Extraordinary.</em></h2>
          <p className={styles.support}>From digital experiences to intelligent business systems, let&apos;s turn your next big idea into something meaningful.</p>
          <a className={styles.contactButton} href="#contact-form">START A PROJECT <span aria-hidden="true">↗</span></a>
        </div>
        <FooterGlobe />
      </div>
      <div className={styles.main}>
        <div className={styles.brandArea}>
          <a className={styles.logoPanel} href="#discover" aria-label="SparkLab home"><Image {...brandLogo} alt="SparkLab" sizes="190px" /></a>
          <p className={styles.description}>SparkLab creates meaningful digital experiences, powerful software solutions, and intelligent automation systems that help businesses move forward.</p>
          <p className={styles.brandSignature}>CREATIVE THINKING. CONNECTED SYSTEMS.</p>
        </div>
        {footerNavigation.map(group => <nav className={styles.navigation} key={group.title} aria-label={`Footer ${group.title.toLowerCase()}`}><h3>{group.title}</h3>{group.links.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}</nav>)}
        <div className={styles.locations}>
          <h3>Our locations</h3>
          {footerConfig.locations.map((location, index) => <div className={styles.location} key={location.city}><LocationPin /><div><span className={styles.locationIndex}>0{index + 1}</span><p>{location.city}</p><span>{location.country}</span></div></div>)}
        </div>
      </div>
      <div className={styles.connect}>
        <div><h3>Connect with SparkLab</h3><a className={styles.portfolio} href={footerConfig.portfolio} target="_blank" rel="noopener noreferrer">View portfolio <span aria-hidden="true">↗</span></a>{footerConfig.email && <a href={`mailto:${footerConfig.email}`}>{footerConfig.email}</a>}</div>
        <div className={styles.socials} aria-label="SparkLab social platforms">{socialPlatforms.map(platform => {
          const href = footerConfig.socials[platform.id];
          const icon = <span className={styles.socialIcon} data-platform={platform.id} style={{ maskImage: `url(/footer-socials/${platform.id}.svg)`, WebkitMaskImage: `url(/footer-socials/${platform.id}.svg)` }} aria-hidden="true" />;
          return href ? <a className={styles.social} key={platform.id} href={href} target="_blank" rel="noopener noreferrer" aria-label={`SparkLab on ${platform.label}`}>{icon}</a> : <span className={`${styles.social} ${styles.socialUnavailable}`} key={platform.id} role="img" aria-label={`${platform.label} profile not configured`} title={platform.label}>{icon}</span>;
        })}</div>
      </div>
      <div className={styles.contactArea}>
        <div className={styles.contactIntro}><p className={styles.eyebrow}>A CONVERSATION AWAY</p><h3>Tell us<br /><em>what&apos;s next.</em></h3><p>Share the idea, the challenge, or the opportunity.<br />We&apos;ll take it from there.</p><span className={styles.contactLine} aria-hidden="true">↘</span></div>
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
      <div className={styles.bottom}><span>© {year} SparkLab. All rights reserved.</span><span>Built for What&apos;s Next.</span><a href="#discover">Back to top <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
