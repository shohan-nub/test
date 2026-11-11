"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const photos = {
  hero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=90",
  maldives: "https://images.unsplash.com/photo-1648312182804-346237fbc0ea?auto=format&fit=crop&w=1400&q=85",
  bali: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?auto=format&fit=crop&w=1400&q=85",
  amalfi: "https://images.unsplash.com/photo-1770368787729-6a42187b668c?auto=format&fit=crop&w=1400&q=85",
  feature: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2200&q=90",
  island: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=85",
  culture: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85",
  wild: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
  logoDesign: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1400&q=85",
  collage1: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
  collage2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
  collage3: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85",
  footer: "https://images.unsplash.com/photo-1643539515100-f55ad1e51ab8?auto=format&fit=crop&w=2200&q=90",
};

const technologies = [
  ["HTML5", "html-5"], ["CSS3", "css"], ["JavaScript", "javascript"], ["TypeScript", "typescript-icon"],
  ["React", "react"], ["Next.js", "nextjs-icon"], ["Tailwind CSS", "tailwindcss-icon"], ["Bootstrap", "bootstrap"],
  ["Node.js", "nodejs-icon"], ["Express.js", "express"], ["NestJS", "nestjs"], ["WordPress", "wordpress-icon"],
  ["Shopify", "shopify"], ["PostgreSQL", "postgresql"], ["MongoDB", "mongodb-icon"], ["MySQL", "mysql-icon"],
  ["Redis", "redis"], ["SQLite", "sqlite"], ["Supabase", "supabase-icon"], ["Firebase", "firebase"],
  ["Drizzle ORM", "drizzle-orm"], ["Prisma", "prisma"], ["pgvector", "postgresql"], ["OpenAI", "openai-icon"],
  ["Google Gemini", "google-gemini"], ["n8n", "n8n-icon"], ["OpenClaw", "openclaw"], ["Ollama", "ollama"],
  ["LangChain", "langchain-icon"], ["Docker", "docker-icon"], ["Kubernetes", "kubernetes"], ["AWS", "aws"],
  ["Vercel", "vercel-icon"], ["Cloudflare", "cloudflare-icon"], ["GitHub Actions", "github-actions"], ["Figma", "figma"],
  ["GitHub", "github-icon"],
] as const;

const technologyRows = [technologies.slice(0, 13), technologies.slice(13, 25), technologies.slice(25)];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}

function PlatformEmblem({ platform }: { platform: "clutch" | "behance" | "fiverr" | "dribbble" }) {
  return <svg className={`platform-emblem platform-emblem-${platform}`} viewBox="0 0 100 72" aria-hidden="true">
    <g className="laurel" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 60C13 46 12 28 20 13M76 60c11-14 12-32 4-47" />
      <path d="M18 47l9 2M15 36l10 3M16 25l9 4M21 15l7 6M82 47l-9 2M85 36l-10 3M84 25l-9 4M79 15l-7 6" />
    </g>
    {platform === "clutch" && <><circle cx="50" cy="34" r="18" fill="currentColor" /><path d="M56 28a9 9 0 1 0 0 12" fill="none" stroke="white" strokeWidth="5" /><circle cx="59" cy="34" r="4" fill="white" /></>}
    {platform === "behance" && <><path d="M35 20h20a10 10 0 0 1 3 19 11 11 0 0 1-4 21H35zm8 7v10h10a5 5 0 0 0 0-10zm0 17v9h11a4.5 4.5 0 0 0 0-9zM62 26h14v5H62zm-1 16c0-8 5-13 12-13s11 5 11 14H68c.5 4 2.5 6 6 6 2 0 4-1 5-3h5c-1 5-5 8-11 8-7 0-12-5-12-12zm7-3h10c-.5-3-2-5-5-5s-4 2-5 5z" fill="currentColor" /></>}
    {platform === "fiverr" && <path d="M43 23c0-7 5-11 12-11h7v8h-6c-3 0-4 1-4 4v3h10v8H52v23h-9V35h-6v-8h6zm25 4h9v31h-9zm0-12h9v8h-9z" fill="currentColor" />}
    {platform === "dribbble" && <><circle cx="50" cy="36" r="21" fill="none" stroke="currentColor" strokeWidth="5" /><path d="M34 22c10 8 18 20 23 34M29 35c14 2 29-1 40-9M36 52c8-10 20-15 34-14" fill="none" stroke="currentColor" strokeWidth="3" /></>}
  </svg>;
}

function BrandSeal() {
  return <svg className="brand-seal" viewBox="0 0 200 200" role="img" aria-label="Spark Lab, digital innovation and creative technology">
    <defs><path id="brand-seal-type" d="M100,100 m-73,0 a73,73 0 1,1 146,0 a73,73 0 1,1 -146,0" /></defs>
    <g className="seal-rotating"><circle className="seal-ring" cx="100" cy="100" r="91" /><text className="seal-type"><textPath href="#brand-seal-type">SPARK LAB • DIGITAL INNOVATION • CREATIVE TECHNOLOGY • </textPath></text></g>
    <circle className="seal-inner-ring" cx="100" cy="100" r="57" />
    <text className="seal-center" x="100" y="97" textAnchor="middle">SPARK</text>
    <text className="seal-center seal-center-small" x="100" y="116" textAnchor="middle">EST. 2022 · DHAKA</text>
    <path className="seal-star" d="M100 28v8M100 164v8M28 100h8M164 100h8" />
  </svg>;
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("discover");
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contactStatus === "loading") return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setContactStatus("loading");
    setContactError("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(fields)) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to send your message right now.");
      form.reset();
      setContactStatus("success");
    } catch (error) {
      setContactStatus("error");
      setContactError(error instanceof Error ? error.message : "Unable to send your message right now.");
    }
  };

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const sections = element.querySelectorAll<HTMLElement>("section[id], footer[id]");
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const active = visible[0]?.target;
      if (active instanceof HTMLElement) setActiveSection(active.id);
    }, { rootMargin: "-24% 0px -56% 0px", threshold: [0, 0.08, 0.2, 0.4] });
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = root.current?.querySelector<HTMLElement>(".statistics-strip");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      for (const counter of section.querySelectorAll<HTMLElement>("[data-counter]")) {
        const target = Number(counter.dataset.counter);
        const decimals = Number(counter.dataset.decimals);
        const value = { current: 0 };
        gsap.to(value, { current: target, duration: 1.8, ease: "power2.out", onUpdate: () => { counter.textContent = value.current.toFixed(decimals); }, onComplete: () => { counter.textContent = target.toFixed(decimals); } });
      }
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const cleanups: Array<() => void> = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Keep teardown owned by one GSAP context; self-reverting matchMedia cleanups caused the prior recursion.
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.from(element.querySelector(".hero-photo"), { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "power3.inOut" })
          .from(element.querySelector(".nav-shell"), { y: -18, opacity: 0, duration: .7 }, "-=.62")
          .from(element.querySelectorAll(".hero-line"), { yPercent: 105, opacity: 0, stagger: .12, duration: .82, ease: "power3.out" }, "-=.24")
          .from(element.querySelector(".hero-note"), { y: 14, opacity: 0, duration: .55 }, "-=.28")
          .from(element.querySelector(".demo-badge"), { y: 10, opacity: 0, duration: .45 }, "-=.38")
          .from(element.querySelector(".nav-cta"), { scale: .96, opacity: 0, duration: .45 }, "-=.34")
          .from(element.querySelector(".scroll-cue"), { y: 12, opacity: 0, duration: .5 }, "-=.18");

        const heroImage = element.querySelector(".hero-photo img");
        gsap.to(heroImage, { yPercent: 8, ease: "none", scrollTrigger: { trigger: element.querySelector(".hero"), start: "top top", end: "bottom top", scrub: .7 } });
        for (const image of element.querySelectorAll<HTMLElement>(".reveal-image")) {
          gsap.fromTo(image, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.05, ease: "power3.inOut", scrollTrigger: { trigger: image, start: "top 82%", once: true } });
          if (image.parentElement?.classList.contains("photo-frame")) {
            gsap.to(image.parentElement, { y: 12, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: .6 } });
          }
        }
        for (const item of element.querySelectorAll<HTMLElement>(".rise")) {
          gsap.from(item, { y: 30, opacity: 0, duration: .75, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
        }
        for (const photo of element.querySelectorAll<HTMLElement>(".parallax-photo")) {
          gsap.to(photo, { yPercent: 8, ease: "none", scrollTrigger: { trigger: photo.parentElement, start: "top bottom", end: "bottom top", scrub: .7 } });
        }
        gsap.from(element.querySelectorAll(".manifesto-words"), { y: 42, opacity: 0, stagger: .1, duration: .8, scrollTrigger: { trigger: element.querySelector(".manifesto"), start: "top 70%", once: true } });
        for (const row of element.querySelectorAll<HTMLElement>(".experience-row")) {
          const image = row.querySelector(".experience-image");
          const copy = row.querySelector(".experience-name");
          gsap.from(image, { clipPath: "inset(0 100% 0 0 round 16px)", scale: .96, duration: .85, ease: "power3.inOut", scrollTrigger: { trigger: row, start: "top 82%", once: true } });
          gsap.from(copy, { x: 28, opacity: 0, duration: .7, ease: "power2.out", scrollTrigger: { trigger: row, start: "top 82%", once: true } });
        }
        for (const shot of element.querySelectorAll<HTMLElement>(".collage-shot")) {
          gsap.from(shot, { y: 32, rotate: 0, scale: .96, opacity: 0, duration: .85, ease: "power3.out", scrollTrigger: { trigger: shot, start: "top 86%", once: true } });
        }
        gsap.from(element.querySelector(".featured-location"), { x: -18, opacity: 0, duration: .65, ease: "power2.out", scrollTrigger: { trigger: element.querySelector(".featured"), start: "top 68%", once: true } });
        gsap.from(element.querySelector(".featured-content h2"), { y: 38, opacity: 0, duration: .9, delay: .1, ease: "power3.out", scrollTrigger: { trigger: element.querySelector(".featured"), start: "top 68%", once: true } });
        gsap.from(element.querySelector(".footer-photo"), { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: element.querySelector(".footer"), start: "top 75%", once: true } });
        gsap.from(element.querySelector(".footer-intro h2"), { y: 42, opacity: 0, duration: .85, ease: "power3.out", scrollTrigger: { trigger: element.querySelector(".footer"), start: "top 62%", once: true } });
        gsap.from(element.querySelector(".contact-form"), { y: 18, scale: .94, opacity: 0, duration: .65, delay: .18, ease: "power2.out", scrollTrigger: { trigger: element.querySelector(".footer"), start: "top 62%", once: true } });
        for (const button of element.querySelectorAll<HTMLElement>(".magnetic")) {
          const onMove = (event: PointerEvent) => {
            const rect = button.getBoundingClientRect();
            gsap.to(button, { x: (event.clientX - rect.left - rect.width / 2) * .08, y: (event.clientY - rect.top - rect.height / 2) * .12, duration: .3, overwrite: true });
          };
          const onLeave = () => gsap.to(button, { x: 0, y: 0, duration: .5, ease: "power2.out" });
          button.addEventListener("pointermove", onMove);
          button.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            button.removeEventListener("pointermove", onMove);
            button.removeEventListener("pointerleave", onLeave);
          });
        }
      }
    }, root);
    return () => {
      for (const cleanup of cleanups) cleanup();
      ctx.revert();
    };
  }, []);

  return (
    <main ref={root} data-active-section={activeSection}>
      <section className="hero" id="discover" aria-label="Discover the world">
        <div className="hero-photo"><img src={photos.hero} alt="Aerial view of a tropical island surrounded by turquoise lagoon and deep blue ocean" /></div>
        <div className="hero-shade" />
        <header className="nav-shell">
          <a className="wordmark" href="#discover" aria-label="Khadi Trip home">Spark Lab<span className="wordmark-dot">.</span></a>
          <nav className="main-nav" aria-label="Main navigation">{[["studio", "Studio"], ["services", "Services"], ["	about Us", "About Us"], ].map(([id, label]) => <a key={id} href={`#${id}`} className={activeSection === id ? "is-active" : undefined} aria-current={activeSection === id ? "location" : undefined} onClick={() => setActiveSection(id)}>{label}</a>)}</nav>
          <a className="nav-cta magnetic" href="https://shohan-portfolio-tau.vercel.app/" target="_blank" rel="noopener noreferrer">Contact Us<Arrow diagonal /></a>
          <a className="mobile-menu" href="#destinations" aria-label="Explore destinations">Explore <span>↓</span></a>
        </header>
        <div className="hero-content">
          <p className="eyebrow hero-kicker"><span className="live-dot" />A NEW PERSPECTIVE ON DIGITAL<span className="eyebrow-line" /></p>
          <h1><span className="line-mask"><span className="hero-line">Unleashing</span></span><span className="line-mask"><span className="hero-line serif-word">Digital Boundaries</span></span><span className="line-mask"><span className="hero-line">by Spark Lab</span></span></h1>
          <div className="hero-note"><BrandSeal /></div>
        </div>
        <div className="demo-badge"><span aria-hidden="true" />DIGITAL INNOVATION STUDIO</div>
        <div className="text-marquee" aria-label="Digital innovation, creative technology, intelligent automation, built for what's next, ideas into reality, design meets technology">
          <div className="text-marquee-track" aria-hidden="true">{[0, 1].map((copy) => <div className="text-marquee-sequence" key={copy}>{["DIGITAL INNOVATION", "CREATIVE TECHNOLOGY", "INTELLIGENT AUTOMATION", "BUILT FOR WHAT'S NEXT", "IDEAS INTO REALITY", "DESIGN MEETS TECHNOLOGY"].map((phrase) => <span className="marquee-phrase" key={`${copy}-${phrase}`}>{phrase}<i>✳</i></span>)}</div>)}</div>
        </div>
      </section>

      <section className="statistics-strip" aria-label="Client and platform statistics">
        <div className="statistics-grid">
          {[[49, "+", "Client Reviews on Clutch.co", "clutch"], [50, "+", "Feature Project on Behance", "behance"], [225, "+", "Client Reviews on Fiverr", "fiverr"], [3.5, "M+", "Monthly View on Dribbble", "dribbble"]].map(([value, suffix, label, platform]) => <div className="statistic" key={label as string}><PlatformEmblem platform={platform as "clutch" | "behance" | "fiverr" | "dribbble"} /><p className="statistic-value"><span data-counter={value} data-decimals={value === 3.5 ? 1 : 0}>0</span>{suffix}</p><p className="statistic-label">{label}</p></div>)}
        </div>
      </section>

      <section className="technology-strip" aria-label="Technologies we use">
        <p className="technology-intro">POWERED BY THE TECHNOLOGY WE TRUST</p>
        <div className="technology-rows">{technologyRows.map((row, rowIndex) => <div className="technology-row" key={rowIndex}><div className="technology-track">{[0, 1].map((copy) => <div className="technology-sequence" key={copy} aria-hidden={copy === 1 ? "true" : undefined}>{row.map(([name, icon]) => <div className="technology-mark" key={`${copy}-${name}`} title={name}><img src={`https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/${icon}.svg`} alt={copy === 0 ? `${name} logo` : ""} width="72" height="34" /></div>)}</div>)}</div></div>)}</div>
      </section>

      <section className="destinations section-pad" id="destinations">
        <div className="section-heading rise"><div><p className="eyebrow dark-eyebrow">WHAT SETS US APART</p><h2>Ideas Into Reality.<br /><em>Built to Inspire.</em></h2></div><p className="heading-aside">We bring creativity, technology, and intelligent thinking together to build <br />digital experiences that move businesses forward.</p></div>
        <div className="destination-grid">
          <article className="destination-card destination-main"><div className="photo-frame reveal-image"><img src={photos.maldives} alt="Overwater villas surrounded by the Maldives lagoon" /></div><div className="destination-caption rise"><div><p className="eyebrow dark-eyebrow">01 — CREATIVE THINKING</p><h3>Strategic Design<span className="caption-country"> </span></h3><p className="destination-copy">Thoughtful design that transforms ideas into meaningful digital experiences.</p></div><a href="#contact" className="round-arrow" aria-label="Explore Maldives"><Arrow diagonal /></a></div><span className="image-stamp">3° 12′ N<br />73° 13′ E</span></article>
          <article className="destination-card destination-secondary"><div className="photo-frame reveal-image"><img src={photos.bali} alt="Lush Balinese temple and tropical greenery" /></div><div className="destination-caption rise"><div><p className="eyebrow dark-eyebrow">02 — ENGINEERING EXCELLENCE</p><h3>Modern Development</h3><p className="destination-copy">Building powerful, scalable, and high-performing digital solutions.</p></div><a href="#contact" className="round-arrow" aria-label="Explore Bali"><Arrow diagonal /></a></div></article>
          <article className="destination-card destination-tertiary"><div className="photo-frame reveal-image"><img src={photos.amalfi} alt="Colorful villages along the Amalfi Coast" /></div><div className="destination-caption rise"><div><p className="eyebrow dark-eyebrow">03 — INTELLIGENT SYSTEMS</p><h3>AI & Automation</h3><p className="destination-copy">Making businesses smarter with intelligent systems and seamless automation.</p></div><a href="#contact" className="round-arrow" aria-label="Explore the Amalfi Coast"><Arrow diagonal /></a></div></article>
        </div>
        <a className="text-link rise" href="#contact">Explore every possibility <Arrow /></a>
      </section>

      <section className="experiences section-pad" id="experiences">
        <div className="experience-top rise"><p className="eyebrow light-eyebrow"><span className="coral-dash" />OUR CORE CAPABILITIES</p><p className="experience-count">BUILT FOR WHAT'S NEXT<br />WAY YOU FEEL</p></div>
        <h2 className="experience-title rise">Ideas Are Easy<br /><em>Execution Changes Everything.</em></h2>
        <div className="experience-list">
          <a className="experience-row" href="#contact"><span className="experience-num">01</span><div className="experience-image"><img src={photos.island} alt="Creative designer working on a computer in a professional design workspace" /></div><div className="experience-name"><h3>Creative Thinking<br /><em>Strategic Design</em></h3><span>Turning complex ideas into simple, beautiful digital experiences.</span></div><span className="experience-arrow"><Arrow diagonal /></span></a>
          <a className="experience-row" href="#contact"><span className="experience-num">02</span><div className="experience-image"><img src={photos.culture} alt="Software developer working on a computer in a modern workspace" /></div><div className="experience-name"><h3>Engineering<br /><em>Excellence</em></h3><span>Building fast, reliable, and scalable digital products.</span></div><span className="experience-arrow"><Arrow diagonal /></span></a>
          <a className="experience-row" href="#contact"><span className="experience-num">03</span><div className="experience-image"><img src={photos.wild} alt="Professional analyzing data dashboards on a computer screen" /></div><div className="experience-name"><h3>Intelligent<br /><em>Systems</em></h3><span>Smarter businesses through AI and intelligent automation.</span></div><span className="experience-arrow"><Arrow diagonal /></span></a>
          <a className="experience-row" href="#contact"><span className="experience-num">04</span><div className="experience-image"><img src={photos.logoDesign} alt="Graphic designer creating a logo and brand identity on a computer" /></div><div className="experience-name"><h3>Professional Logo Design<br /><em>Brand Identity</em></h3><span>Creating distinctive visual identities that make brands memorable.</span></div><span className="experience-arrow"><Arrow diagonal /></span></a>
        </div>
        <div className="experience-foot"><span>	THINK BEYOND LIMITS</span><span>✳</span><span>	BUILD WITH PURPOSE</span></div>
      </section>

      <section className="featured" aria-labelledby="featured-title">
        <div className="featured-photo"><img className="parallax-photo" src={photos.feature} alt="Aerial view of a turquoise Bali shoreline with pale sand and clear blue water" /></div><div className="featured-overlay" />
        <div className="featured-top"><span className="eyebrow light-eyebrow">GOOD THINGS START WITH A SPARK</span><span className="featured-number">EST. 2022</span></div>
        <div className="featured-content rise"><p className="featured-location"><span>✳</span>DHAKA · BANGLADESH </p><h2 id="featured-title">Got a Big Idea?<br /><em>Let's Make It Happen.</em></h2><p className="featured-copy">Every great project starts with a conversation. Tell us what's on your mind.</p><a className="outline-button magnetic" href="#contact">TELL US YOUR IDEA<Arrow diagonal /></a></div>
        <span className="featured-side-note">SPARK LAB DIGITAL STUDIO<i>—</i> 05° 56′ N</span>
      </section>

      <section className="manifesto section-pad" id="manifesto">
        <div className="manifesto-top rise"><p className="eyebrow dark-eyebrow">BEHIND THE SPARK</p><span className="manifesto-star">✳</span><span className="manifesto-edition">SPARK LAB<br />OUR STORY · 01</span></div>
        <div className="manifesto-layout"><div className="manifesto-copy"><h2><span className="manifesto-words">More </span> <span className="manifesto-words serif-word">Than</span><br /><span className="manifesto-words">Just</span> <span className="manifesto-words coral-type">Technology.</span></h2><p className="manifesto-body rise">We believe great work comes from curiosity, collaboration, and a little courage to think differently.</p><a className="text-link rise" href="#contact">MEET THE STUDIO<Arrow /></a><span className="hand-note">Make Room For Creativity<b>↗</b></span></div>
          <div className="manifesto-collage"><figure className="collage-shot collage-one"><img className="reveal-image" src={photos.collage1} alt="Creative professionals collaborating around a table in a modern studio" /><figcaption>Somewhere along the coast, Italy</figcaption></figure><figure className="collage-shot collage-two"><img className="reveal-image" src={photos.collage2} alt="Software developer working on a laptop in a modern workspace" /><figcaption>Blue beneath the surface</figcaption></figure><figure className="collage-shot collage-three"><img className="reveal-image" src={photos.collage3} alt="Professionals collaborating during a modern office meeting" /><span>Take a breath.</span></figure><span className="collage-scribble">Always Question <br />The Ordinary</span></div></div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-photo"><img src={photos.footer} alt="Aerial tropical shoreline with turquoise water breaking around a palm-lined beach" /></div><div className="footer-shade" />
        <div className="footer-main"><div className="footer-contact-grid"><div className="footer-intro"><p className="eyebrow light-eyebrow"><span className="live-dot" />LET'S CONNECT</p><h2>Let’s Talk.<br /><em>We’d Love to Hear From You.</em></h2><p>Have a project in mind, a challenge to solve, or simply want to say hello? We'd love to hear about it.</p><div className="contact-details"><span>BUSINESS EMAIL</span><a href="#contact-form">Send us a message below</a><span>LOCATION</span><strong>Dhaka, Bangladesh</strong></div><div className="footer-social"><span>FOLLOW THE SPARK</span><div><a href="#contact" aria-label="Instagram">IG</a><a href="#contact" aria-label="Pinterest">PI</a><a href="#contact" aria-label="TikTok">TK</a></div></div></div>
          <form className="contact-form" id="contact-form" onSubmit={handleContactSubmit}><p className="eyebrow light-eyebrow">SEND US A MESSAGE</p><label>Full Name<input name="name" type="text" autoComplete="name" maxLength={100} required /></label><label>Email Address<input name="email" type="email" autoComplete="email" maxLength={254} required /></label><label>Subject<input name="subject" type="text" maxLength={160} required /></label><label>Message<textarea name="message" rows={5} maxLength={5000} required /></label><input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" /><button className="contact-submit" type="submit" disabled={contactStatus === "loading"}>{contactStatus === "loading" ? "SENDING…" : <>SEND MESSAGE <Arrow diagonal /></>}</button><p className="contact-response" aria-live="polite">{contactStatus === "success" ? "Thanks for reaching out! Your message has been sent successfully." : contactStatus === "error" ? contactError : "We usually respond within 1–2 business days."}</p></form></div>
          <div className="footer-bottom"><div className="footer-brand"><a className="wordmark" href="#discover" aria-label="Spark Lab home">SPARK LAB<span className="wordmark-dot">.</span></a></div><nav aria-label="Footer navigation" className="footer-links"><a href="#discover">Discover</a><a href="#destinations">Destinations</a><a href="#experiences">Experiences</a><a href="#manifesto">Journal</a></nav><div className="footer-meta"><span>© SPARK LAB 2026</span><span>	CREATIVITY MEETS TECHNOLOGY</span><a href="#discover" className="back-top">Back to top ↑</a></div></div>
        </div>
      </footer>
    </main>
  );
}
