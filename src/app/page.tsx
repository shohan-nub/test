"use client";

import { type FormEvent, type TransitionEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import worldLand from "./world-land.json";
import ServicesShowcase from "./ServicesShowcase";

const photos = {
  maldives: "https://images.unsplash.com/photo-1648312182804-346237fbc0ea?auto=format&fit=crop&w=1400&q=85",
  bali: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?auto=format&fit=crop&w=1400&q=85",
  amalfi: "https://images.unsplash.com/photo-1770368787729-6a42187b668c?auto=format&fit=crop&w=1400&q=85",
  feature: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2200&q=90",
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
  return <span className={"platform-logo platform-logo-" + platform} aria-hidden="true"><img src={"/brands/" + platform + (platform === "clutch" ? ".webp" : ".svg")} alt="" width="96" height="52" /></span>;
}

const mapRoutes = [
  { name: "New York", x: 294, y: 153, path: "M 751 211 Q 520 14 294 153" },
  { name: "London", x: 500, y: 115, path: "M 751 211 Q 626 42 500 115" },
  { name: "Dubai", x: 654, y: 203, path: "M 751 211 Q 701 157 654 203" },
  { name: "Singapore", x: 788, y: 289, path: "M 751 211 Q 801 237 788 289" },
  { name: "Tokyo", x: 888, y: 171, path: "M 751 211 Q 825 107 888 171" },
  { name: "Sydney", x: 920, y: 409, path: "M 751 211 Q 819 380 920 409" },
] as const;

function GlobalMap() {
  return <div className="hero-map" role="img" aria-label="An illustrated world map showing connections from Dhaka to cities around the world">
    <svg viewBox="0 0 1000 500" aria-hidden="true">
      <defs>
        <pattern id="map-dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.25" fill="#6e6861" /></pattern>
        <filter id="node-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      {/* Natural Earth 1:110m land polygons, public domain; equirectangular projection. */}
      <path fill="url(#map-dots)" className="map-land" d={worldLand} fillRule="evenodd" />
      <g className="map-routes">{mapRoutes.map((route, index) => <g key={route.name}>
        <path d={route.path} className="map-route" pathLength="1" />
        <circle className="map-particle" r="2.5"><animateMotion path={route.path} dur={`${4.5 + index * .55}s`} repeatCount="indefinite" /></circle>
        <circle className="map-node-glow" cx={route.x} cy={route.y} r="6" filter="url(#node-glow)" />
        <circle className="map-node" cx={route.x} cy={route.y} r="3.5" />
      </g>)}</g>
      <circle className="map-origin-halo" cx="751" cy="211" r="13" />
      <circle className="map-origin" cx="751" cy="211" r="5" />
    </svg>
  </div>;
}

function CapabilityMedia({ src, alt }: { src: string; alt: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="capability-media">
      {!imageFailed && <img src={src} alt={alt} onError={() => setImageFailed(true)} />}
    </div>
  );
}

function CreativePreview({ index }: { index: number }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    let disposed = false;
    const reveal = async () => {
      if (!image.complete || !image.naturalWidth) return;
      try { await image.decode(); } catch { return; }
      if (!disposed) setReady(true);
    };
    image.addEventListener("load", reveal);
    void reveal(); // Cached images can finish loading before hydration.
    return () => { disposed = true; image.removeEventListener("load", reveal); };
  }, []);

  return <div className={`creative-preview${ready ? " is-ready" : ""}`}>
    <img ref={imageRef} src={`/creative-showcase/project-${index + 1}.webp`} alt="" width="640" height="480" loading="eager" decoding="async" />
  </div>;
}

const projects = [
  { title: "Website 1", category: "Design", image: "/p1.webp", tone: "apricot", description: "A clear, considered website experience with thoughtful details and a distinctive visual language.", scope: "Website design · UX" },
  { title: "Website 2", category: "Development", image: "/p2.webp", tone: "butter", description: "A responsive digital experience that brings intuitive navigation and everyday functionality together.", scope: "Web development" },
  { title: "Website 3", category: "AI & Automation", image: "/p3.webp", tone: "coral", description: "An approachable interface for connected workflows, useful insights, and simpler daily tasks.", scope: "Product design · Automation" },
  { title: "Website 4", category: "Branding", image: "/p4.webp", tone: "sage", description: "An expressive brand experience, connecting a confident identity with a cohesive digital presence.", scope: "Brand identity · Website" },
  { title: "Website 5", category: "UI/UX", image: "/p5.webp", tone: "charcoal", description: "A focused digital experience where considered design and practical technology work together.", scope: "UI/UX · Development" },
] as const;

function OverviewVideo() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      const element = video.current;
      if (!element) return;
      if (media.matches) {
        element.pause();
        element.currentTime = 0;
      } else {
        void element.play().catch(() => {});
      }
    };
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  return <video ref={video} autoPlay muted loop playsInline preload="auto" aria-hidden="true"><source src="/creative-loop.mp4" type="video/mp4" /></video>;
}

const consultationPhrases = ["Automate Customer Replies", "Generate Reports Automatically", "Handle Follow-up Calls", "Capture & Qualify Leads", "Schedule Appointments", "Manage Customer Inquiries", "Send Order Notifications", "Sync Business Data"];

function ConsultationPhrases() {
  const [active, setActive] = useState(consultationPhrases.length);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const syncMotion = () => {
      if (timer) clearInterval(timer);
      if (!media.matches) timer = setInterval(() => setActive((value) => value + 1), 2700);
    };
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => { if (timer) clearInterval(timer); media.removeEventListener("change", syncMotion); };
  }, []);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform" || active < consultationPhrases.length * 2) return;
    setAnimate(false);
    setActive(consultationPhrases.length);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
  };

  return <div className="consultation-phrases" aria-label={consultationPhrases.join(", ")}>
    <div className="consultation-phrases-track" aria-hidden="true" onTransitionEnd={handleTransitionEnd} style={{ transform: `translateY(${(2 - active) / (consultationPhrases.length * 3) * 100}%)`, transition: animate ? undefined : "none" }}>
      {[0, 1, 2].flatMap((copy) => consultationPhrases.map((phrase, index) => <div key={`${copy}-${phrase}`} className={`consultation-phrase${copy * consultationPhrases.length + index === active ? " is-active" : ""}`}>{phrase}</div>))}
    </div>
  </div>;
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
        const creative = element.querySelector<HTMLElement>(".creative-statement");
        if (creative) {
          const previews = gsap.utils.toArray<HTMLElement>(".creative-preview", creative);
          const directions = [[-.34, -.25], [.3, -.22], [-.3, .24], [.34, .24], [-.2, -.32], [.21, -.31], [-.12, .38], [.14, .37], [-.4, .02], [.4, -.02]];
          gsap.from(creative.querySelector("h2"), { y: 16, opacity: 0, duration: .7, ease: "power2.out", scrollTrigger: { trigger: creative, start: "top 75%", once: true } });
          const creativeTimeline = gsap.timeline({ scrollTrigger: { trigger: creative, start: "top top", end: () => `+=${Math.max(650, creative.clientHeight * 1.15)}`, pin: true, scrub: .45, invalidateOnRefresh: true, anticipatePin: 1 } });
          previews.forEach((preview, index) => {
            const [x, y] = directions[index];
            // One continuous journey avoids a velocity jump between emergence and exit.
            const start = .08 + index * .08;
            const duration = 2.4 + (index % 3) * .12;
            creativeTimeline.fromTo(preview, { x: 0, y: 0, opacity: .25 }, { x: () => x * window.innerWidth * 2.7, y: () => y * window.innerHeight * 2.7, opacity: 1, ease: "sine.inOut", duration }, start);
            creativeTimeline.to(preview, { opacity: 0, ease: "sine.inOut", duration: .65 }, start + duration - .65);
          });
        }
        const showcase = element.querySelector<HTMLElement>(".experiences");
        const stack = showcase?.querySelector<HTMLElement>(".capability-stack");
        const cards = stack ? gsap.utils.toArray<HTMLElement>(".capability-card", stack) : [];
        if (showcase && stack && cards.length) {
          const depth = () => parseFloat(getComputedStyle(stack).getPropertyValue("--stack-step")) || 10;
          // Scroll distance includes a resting interval for every card, including the first and last.
          const cardTimeline = gsap.timeline({ scrollTrigger: { trigger: showcase, start: "top top", end: () => `+=${showcase.clientHeight * (window.innerWidth <= 900 ? 3.6 : 4.8)}`, pin: true, scrub: .4, invalidateOnRefresh: true, anticipatePin: 1 } });
          cardTimeline.to({}, { duration: .5 });
          cards.slice(1).forEach((card, index) => {
            const start = cardTimeline.duration();
            // Bring each card in from below the viewport. The last card rests at
            // the same compact size before its surface fills the viewport.
            const finalCard = index === cards.length - 2;
            const duration = 1;
            cardTimeline.fromTo(card, { y: () => showcase.clientHeight - stack.offsetTop }, { y: () => depth() * (index + 1), duration, ease: "sine.inOut", immediateRender: true }, start);
            if (finalCard) {
              const surface = card.querySelector<HTMLElement>(".capability-surface");
              const expandAt = start + duration + .3;
              const expandDuration = 1.35;
              cardTimeline.to(card, { y: () => -stack.offsetTop, duration: expandDuration, ease: "sine.inOut" }, expandAt);
              if (surface) cardTimeline.fromTo(surface,
                { width: () => stack.clientWidth, height: () => stack.clientHeight, left: 0, borderRadius: () => window.innerWidth <= 640 ? 22 : 26 },
                { width: () => showcase.clientWidth, height: () => showcase.clientHeight, left: () => -stack.offsetLeft, borderRadius: 0, duration: expandDuration, ease: "sine.inOut", immediateRender: true }, expandAt);
              cardTimeline.to(showcase, { backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--showcase-charcoal").trim(), duration: expandDuration, ease: "sine.inOut" }, expandAt);
            }
            cardTimeline.to({}, { duration: .45 });
          });
        }
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.from(element.querySelector(".nav-shell"), { y: -18, opacity: 0, duration: .7 })
          .from(element.querySelectorAll(".hero-line"), { yPercent: 105, opacity: 0, stagger: .12, duration: .82 }, "-=.4")
          .from(element.querySelector(".hero-description"), { y: 14, opacity: 0, duration: .55 }, "-=.35")
          .from(element.querySelector(".hero-map"), { opacity: 0, y: 18, duration: .9 }, "-=.55");
        const overview = element.querySelector<HTMLElement>(".service-overview");
        if (overview) {
          gsap.from(overview.querySelector("h2"), { y: 20, opacity: 0, duration: .7, ease: "power2.out", scrollTrigger: { trigger: overview, start: "top 82%", once: true } });
          gsap.from(overview.querySelectorAll(".service-overview-card"), { y: 22, opacity: 0, stagger: .12, duration: .7, ease: "power2.out", scrollTrigger: { trigger: overview.querySelector(".service-overview-grid"), start: "top 86%", once: true } });
        }
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
      <section className="hero" id="discover" aria-label="Spark Lab digital studio">
        <header className="nav-shell">
          <a className="wordmark" href="#discover" aria-label="Spark Lab home">Spark Lab<span className="wordmark-dot">.</span></a>
          <nav className="main-nav" aria-label="Main navigation">{[["discover", "Studio"], ["experiences", "Services"], ["manifesto", "About Us"]].map(([id, label]) => <a key={id} href={`#${id}`} className={activeSection === id ? "is-active" : undefined} aria-current={activeSection === id ? "location" : undefined} onClick={() => setActiveSection(id)}>{label}</a>)}</nav>
          <a className="nav-cta magnetic" href="https://shohan-portfolio-tau.vercel.app/" target="_blank" rel="noopener noreferrer">Contact Us<Arrow diagonal /></a>
          <a className="mobile-menu" href="#experiences" aria-label="Explore services">Services <span>↓</span></a>
        </header>
        <div className="hero-content">
          <h1><span className="hero-line">Ideas Without <span className="hero-accent">Borders.</span></span></h1>
          <p className="hero-description">Building digital experiences and intelligent solutions for businesses without boundaries.</p>
        </div>
        <GlobalMap />
        <div className="hero-statistics" aria-label="Global reach">
          <div><strong>7</strong><span>Continents</span></div>
          <div><strong>195+</strong><span>Sovereign Countries</span></div>
          <div><strong>1</strong><span>Global Team</span></div>
        </div>
      </section>
      <section className="service-overview section-pad" aria-labelledby="service-overview-heading">
        <h2 id="service-overview-heading">We build AI-powered automation, websites, web applications, mobile apps, and custom software that help businesses grow.</h2>
        <div className="service-overview-grid">
          <article className="service-overview-card service-overview-dark">
            <span className="service-overview-number">01</span>
            <div><h3>AI &amp; Intelligent Automation</h3><p>We build intelligent AI agents, automated workflows, conversational systems, and integrations that reduce manual work and improve business operations.</p></div>
          </article>
          <article className="service-overview-card service-overview-orange">
            <span className="service-overview-number">02</span>
            <div><h3>Web, Software &amp; Mobile Development</h3><p>We design and develop high-performance websites, custom web applications, mobile experiences, and scalable software tailored to your business.</p></div>
          </article>
          <div className="service-overview-card service-overview-visual" aria-label="Abstract visual">
            <OverviewVideo />
          </div>
        </div>
      </section>
      <section className="consultation-section section-pad" aria-labelledby="consultation-heading">
        <div className="consultation-panel">
        <div className="consultation-copy">
          <h2 id="consultation-heading">Ready to automate and scale your business?</h2>
          <p>Our team is ready to architect, build, and deploy your idea. Book a free consultation to get started.</p>
          <a className="consultation-cta" href="#contact">Book a free consultation <span aria-hidden="true">→</span></a>
        </div>
        <ConsultationPhrases />
        </div>
      </section>
      <section className="statistics-strip" aria-label="Client and platform statistics">
        <div className="statistics-grid">
          {[[49, "+", "Client Reviews on Clutch.co", "clutch"], [50, "+", "Feature Project on Behance", "behance"], [225, "+", "Client Reviews on Fiverr", "fiverr"], [3.5, "M+", "Monthly View on Dribbble", "dribbble"]].map(([value, suffix, label, platform]) => <div className="statistic" key={label as string}><PlatformEmblem platform={platform as "clutch" | "behance" | "fiverr" | "dribbble"} /><p className="statistic-value"><span data-counter={value} data-decimals={value === 3.5 ? 1 : 0}>0</span>{suffix}</p><p className="statistic-label">{label}</p></div>)}
        </div>
      </section>

      <div className="text-marquee" aria-label="Digital innovation, creative technology, intelligent automation, built for what's next, ideas into reality, design meets technology">
        <div className="text-marquee-track" aria-hidden="true">{[0, 1].map((copy) => <div className="text-marquee-sequence" key={copy}>{["DIGITAL INNOVATION", "CREATIVE TECHNOLOGY", "INTELLIGENT AUTOMATION", "BUILT FOR WHAT'S NEXT", "IDEAS INTO REALITY", "DESIGN MEETS TECHNOLOGY"].map((phrase) => <span className="marquee-phrase" key={`${copy}-${phrase}`}>{phrase}<i>✳</i></span>)}</div>)}</div>
      </div>

      <section className="creative-statement" aria-labelledby="creative-statement-title">
        <div className="creative-previews" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <CreativePreview key={index} index={index} />)}
        </div>
        <h2 id="creative-statement-title">
          <span className="creative-line"><span className="creative-line-inner">From stunning <em>websites</em></span></span>
          <span className="creative-line"><span className="creative-line-inner">to powerful web applications,</span></span>
          <span className="creative-line"><span className="creative-line-inner">we&apos;re ready to bring your ideas</span></span>
          <span className="creative-line"><span className="creative-line-inner">to life with exceptional <em>design.</em></span></span>
        </h2>
      </section>

      <section className="technology-strip" aria-label="Technologies we use">
        <p className="technology-intro">POWERED BY THE TECHNOLOGY WE TRUST</p>
        <div className="technology-rows">{technologyRows.map((row, rowIndex) => <div className="technology-row" key={rowIndex}><div className="technology-track">{[0, 1].map((copy) => <div className="technology-sequence" key={copy} aria-hidden={copy === 1 ? "true" : undefined}>{row.map(([name, icon]) => <div className="technology-mark" key={`${copy}-${name}`} title={name}><img src={`https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/${icon}.svg`} alt={copy === 0 ? `${name} logo` : ""} width="72" height="34" /></div>)}</div>)}</div></div>)}</div>
      </section>

      <div className="text-marquee text-marquee-reverse" aria-label="Creative technology, built for what's next, ideas into reality, design meets technology, digital experiences">
        <div className="text-marquee-track" aria-hidden="true">{[0, 1].map((copy) => <div className="text-marquee-sequence" key={copy}>{["CREATIVE TECHNOLOGY", "BUILT FOR WHAT'S NEXT", "IDEAS INTO REALITY", "DESIGN MEETS TECHNOLOGY", "DIGITAL EXPERIENCES"].map((phrase) => <span className="marquee-phrase" key={`${copy}-${phrase}`}>{phrase}<i>✳</i></span>)}</div>)}</div>
      </div>

      <section className="experiences section-pad" id="experiences" aria-label="Selected projects">
        <div className="capability-stack">
          {projects.map((project, index) => <article className={`capability-card capability-card-${project.tone}`} key={project.image}>
            <div className="capability-surface">
              {index < 4 && <>
                <div className="capability-copy">
                  <p className="capability-label">{project.category}<span>{String(index + 1).padStart(2, "0")} / 05</span></p>
                  <h3>{project.title}</h3>
                  <p className="project-summary">{project.description}</p>
                  <dl className="project-details"><div><dt>Scope</dt><dd>{project.scope}</dd></div><div><dt>Duration</dt><dd>To be confirmed</dd></div></dl>
                  <a className="capability-action" href="#contact">View Project <span aria-hidden="true">→</span></a>
                </div>
                <CapabilityMedia src={project.image} alt={`${project.title} project preview`} />
              </>}
            </div>
          </article>)}
        </div>
      </section>

      <ServicesShowcase />

      <section className="destinations section-pad" id="destinations">
        <div className="section-heading rise"><div><p className="eyebrow dark-eyebrow">WHAT SETS US APART</p><h2>Ideas Into Reality.<br /><em>Built to Inspire.</em></h2></div><p className="heading-aside">We bring creativity, technology, and intelligent thinking together to build <br />digital experiences that move businesses forward.</p></div>
        <div className="destination-grid">
          <article className="destination-card destination-main"><div className="photo-frame reveal-image"><img src={photos.maldives} alt="Overwater villas surrounded by the Maldives lagoon" /></div><div className="destination-caption rise"><div><p className="eyebrow dark-eyebrow">01 — CREATIVE THINKING</p><h3>Strategic Design<span className="caption-country"> </span></h3><p className="destination-copy">Thoughtful design that transforms ideas into meaningful digital experiences.</p></div><a href="#contact" className="round-arrow" aria-label="Explore Maldives"><Arrow diagonal /></a></div><span className="image-stamp">3° 12′ N<br />73° 13′ E</span></article>
          <article className="destination-card destination-secondary"><div className="photo-frame reveal-image"><img src={photos.bali} alt="Lush Balinese temple and tropical greenery" /></div><div className="destination-caption rise"><div><p className="eyebrow dark-eyebrow">02 — ENGINEERING EXCELLENCE</p><h3>Modern Development</h3><p className="destination-copy">Building powerful, scalable, and high-performing digital solutions.</p></div><a href="#contact" className="round-arrow" aria-label="Explore Bali"><Arrow diagonal /></a></div></article>
          <article className="destination-card destination-tertiary"><div className="photo-frame reveal-image"><img src={photos.amalfi} alt="Colorful villages along the Amalfi Coast" /></div><div className="destination-caption rise"><div><p className="eyebrow dark-eyebrow">03 — INTELLIGENT SYSTEMS</p><h3>AI & Automation</h3><p className="destination-copy">Making businesses smarter with intelligent systems and seamless automation.</p></div><a href="#contact" className="round-arrow" aria-label="Explore the Amalfi Coast"><Arrow diagonal /></a></div></article>
        </div>
      </section>

      <section className="featured" aria-labelledby="featured-title">
        <div className="featured-photo"><img className="parallax-photo" src={photos.feature} alt="Aerial view of a turquoise Bali shoreline with pale sand and clear blue water" /></div><div className="featured-overlay" />
        <div className="featured-top"><span className="eyebrow light-eyebrow">GOOD THINGS START WITH A SPARK</span><span className="featured-number">EST. 2022</span></div>
        <div className="featured-content rise"><p className="featured-location"><span>✳</span>DHAKA · BANGLADESH </p><h2 id="featured-title">Got a Big Idea?<br /><em>Let&apos;s Make It Happen.</em></h2><p className="featured-copy">Every great project starts with a conversation. Tell us what&apos;s on your mind.</p><a className="outline-button magnetic" href="#contact">TELL US YOUR IDEA<Arrow diagonal /></a></div>
        <span className="featured-side-note">SPARK LAB DIGITAL STUDIO<i>—</i> 05° 56′ N</span>
      </section>

      <section className="manifesto section-pad" id="manifesto">
        <div className="manifesto-top rise"><p className="eyebrow dark-eyebrow">BEHIND THE SPARK</p><span className="manifesto-star">✳</span><span className="manifesto-edition">SPARK LAB<br />OUR STORY · 01</span></div>
        <div className="manifesto-layout"><div className="manifesto-copy"><h2><span className="manifesto-words">More </span> <span className="manifesto-words serif-word">Than</span><br /><span className="manifesto-words">Just</span> <span className="manifesto-words coral-type">Technology.</span></h2><p className="manifesto-body rise">We believe great work comes from curiosity, collaboration, and a little courage to think differently.</p><a className="text-link rise" href="#contact">MEET THE STUDIO<Arrow /></a><span className="hand-note">Make Room For Creativity<b>↗</b></span></div>
          <div className="manifesto-collage"><figure className="collage-shot collage-one"><img className="reveal-image" src={photos.collage1} alt="Creative professionals collaborating around a table in a modern studio" /><figcaption>Somewhere along the coast, Italy</figcaption></figure><figure className="collage-shot collage-two"><img className="reveal-image" src={photos.collage2} alt="Software developer working on a laptop in a modern workspace" /><figcaption>Blue beneath the surface</figcaption></figure><figure className="collage-shot collage-three"><img className="reveal-image" src={photos.collage3} alt="Professionals collaborating during a modern office meeting" /><span>Take a breath.</span></figure><span className="collage-scribble">Always Question <br />The Ordinary</span></div></div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-photo"><img src={photos.footer} alt="Aerial tropical shoreline with turquoise water breaking around a palm-lined beach" /></div><div className="footer-shade" />
        <div className="footer-main"><div className="footer-contact-grid"><div className="footer-intro"><p className="eyebrow light-eyebrow"><span className="live-dot" />LET&apos;S CONNECT</p><h2>Let’s Talk.<br /><em>We’d Love to Hear From You.</em></h2><p>Have a project in mind, a challenge to solve, or simply want to say hello? We&apos;d love to hear about it.</p><div className="contact-details"><span>BUSINESS EMAIL</span><a href="#contact-form">Send us a message below</a><span>LOCATION</span><strong>Dhaka, Bangladesh</strong></div><div className="footer-social"><span>FOLLOW THE SPARK</span><div><a href="#contact" aria-label="Instagram">IG</a><a href="#contact" aria-label="Pinterest">PI</a><a href="#contact" aria-label="TikTok">TK</a></div></div></div>
          <form className="contact-form" id="contact-form" onSubmit={handleContactSubmit}><p className="eyebrow light-eyebrow">SEND US A MESSAGE</p><label>Full Name<input name="name" type="text" autoComplete="name" maxLength={100} required /></label><label>Email Address<input name="email" type="email" autoComplete="email" maxLength={254} required /></label><label>Subject<input name="subject" type="text" maxLength={160} required /></label><label>Message<textarea name="message" rows={5} maxLength={5000} required /></label><input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" /><button className="contact-submit" type="submit" disabled={contactStatus === "loading"}>{contactStatus === "loading" ? "SENDING…" : <>SEND MESSAGE <Arrow diagonal /></>}</button><p className="contact-response" aria-live="polite">{contactStatus === "success" ? "Thanks for reaching out! Your message has been sent successfully." : contactStatus === "error" ? contactError : "We usually respond within 1–2 business days."}</p></form></div>
          <div className="footer-bottom"><div className="footer-brand"><a className="wordmark" href="#discover" aria-label="Spark Lab home">SPARK LAB<span className="wordmark-dot">.</span></a></div><nav aria-label="Footer navigation" className="footer-links"><a href="#discover">Discover</a><a href="#destinations">Destinations</a><a href="#experiences">Experiences</a><a href="#manifesto">Journal</a></nav><div className="footer-meta"><span>© SPARK LAB 2026</span><span>	CREATIVITY MEETS TECHNOLOGY</span><a href="#discover" className="back-top">Back to top ↑</a></div></div>
        </div>
      </footer>
    </main>
  );
}
