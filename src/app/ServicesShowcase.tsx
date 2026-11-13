"use client";

import { useEffect, useRef, useState } from "react";
import "./services-showcase.css";

// Add images at these public paths; each placeholder will display its image on reload.
const services = [
  { title: "WEB & APP DEVELOPMENT", description: "We design and develop high-performance websites, web applications, e-commerce platforms, and scalable mobile experiences.", images: ["/services/web-development/web-01.webp", "/services/web-development/web-02.webp", "/services/web-development/web-03.webp", "/services/web-development/web-04.webp"] },
  { title: "AI & AUTOMATION", description: "We build intelligent AI agents, automated workflows, conversational systems, and business automation solutions.", images: ["/services/ai-automation/ai-01.webp", "/services/ai-automation/ai-02.webp", "/services/ai-automation/ai-03.webp", "/services/ai-automation/ai-04.webp"] },
  { title: "BRANDING & IDENTITY", description: "We create memorable brand identities, visual systems, logo designs, and digital experiences that make businesses stand out.", images: ["/services/branding/brand-01.webp", "/services/branding/brand-02.webp", "/services/branding/brand-03.webp", "/services/branding/brand-04.webp"] },
  { title: "UI/UX & DIGITAL EXPERIENCE", description: "We craft intuitive interfaces and engaging digital experiences through thoughtful research, interaction design, and modern UI systems.", images: ["/services/ui-ux-design/design-01.webp", "/services/ui-ux-design/design-02.webp", "/services/ui-ux-design/design-03.webp", "/services/ui-ux-design/design-04.webp"] },
];

function ShowcaseImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="showcase-image">{!failed && <img src={src} alt="" onError={() => setFailed(true)} />}</div>;
}

export default function ServicesShowcase() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    updateMotion();
    motion.addEventListener("change", updateMotion);
    return () => { observer.disconnect(); motion.removeEventListener("change", updateMotion); };
  }, []);

  useEffect(() => {
    if (!visible || paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % services.length), 5500);
    return () => window.clearInterval(timer);
  }, [visible, paused, reducedMotion]);

  return <section ref={section} className="services-showcase" aria-label="Services showcase" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className="showcase-inner">
      <div className="showcase-slides">
        {services.map((service, index) => <article key={service.title} className={`showcase-slide${index === active ? " is-active" : ""}`} aria-hidden={index !== active}>
          <div className="showcase-copy">
            <span className="showcase-number">{String(index + 1).padStart(2, "0")} <span>/ 04</span></span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <a href="#contact" tabIndex={index === active ? 0 : -1} className="showcase-cta">Explore Service <span aria-hidden="true">↗</span></a>
          </div>
          <div className="showcase-collage" aria-hidden="true">{service.images.map((src) => <ShowcaseImage key={src} src={src} />)}</div>
        </article>)}
      </div>
      <div className="showcase-navigation">
        <div className="showcase-indicators" aria-label="Choose a service">{services.map((service, index) => <button key={service.title} type="button" aria-label={`Show ${service.title}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}</div>
        <div className="showcase-arrows"><button type="button" aria-label="Previous service" onClick={() => setActive((active + services.length - 1) % services.length)}>←</button><button type="button" aria-label="Next service" onClick={() => setActive((active + 1) % services.length)}>→</button></div>
      </div>
    </div>
  </section>;
}
