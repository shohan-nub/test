"use client";

import { type TransitionEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import worldLand from "./world-land.json";
import SeoGeoShowcase from "./components/SeoGeoShowcase";
import ProjectShowcase from "./components/ProjectShowcase";
import { WorkflowVisual, workflowStages } from "./components/WorkflowVisuals";
import workflowStyles from "./components/WorkflowVisuals.module.css";
import FinalContact from "./components/FinalContact";
import SiteNav from "./components/SiteNav";
import soundStyles from "./components/ShowreelSound.module.css";
import { useViewportVideo } from "./components/useViewportVideo";

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

function ProjectShowreel() {
  const video = useRef<HTMLVideoElement>(null);
  const playIfVisible = useViewportVideo(video, "/card5.mp4");
  const [muted, setMuted] = useState(true);
  const [feedback, setFeedback] = useState("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundRequest = useRef(0);

  const announce = (message: string) => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(message);
    feedbackTimer.current = setTimeout(() => setFeedback(""), 2800);
  };

  const toggleSound = async () => {
    const media = video.current;
    if (!media) return;
    const request = ++soundRequest.current;
    const enable = media.muted || media.volume === 0;
    try {
      if (enable) media.volume = .65;
      media.muted = !enable;
      setMuted(media.muted || media.volume === 0);
      announce(enable ? "Sound On" : "Sound Off");
      // play() preserves currentTime and also recovers a policy-paused video.
      if (enable || media.paused) await playIfVisible.current();
    } catch (error) {
      if (request !== soundRequest.current) return;
      // A viewport pause can interrupt a pending play() request.
      if (error instanceof DOMException && error.name === "AbortError") return;
      media.muted = true;
      setMuted(true);
      announce("Sound unavailable. Try again.");
      void playIfVisible.current().catch(() => { /* Leave the control available for another user gesture. */ });
    }
  };

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const reveal = () => { media.dataset.ready = "true"; };
    const hide = () => { delete media.dataset.ready; };
    const syncSound = () => {
      const silent = media.muted || media.volume === 0;
      setMuted(silent);
      if (silent) setFeedback(message => message === "Sound On" ? "" : message);
    };
    media.muted = true;
    media.defaultMuted = true;
    media.addEventListener("loadeddata", reveal);
    media.addEventListener("error", hide);
    media.addEventListener("volumechange", syncSound);
    if (media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) reveal();
    return () => {
      media.removeEventListener("loadeddata", reveal);
      media.removeEventListener("error", hide);
      media.removeEventListener("volumechange", syncSound);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      soundRequest.current += 1;
    };
  }, []);

  return <div className={soundStyles.root} onDoubleClick={event => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    void toggleSound();
  }}>
    <video ref={video} className="project-showreel" muted={muted} loop playsInline preload="metadata" aria-label="SparkLab creative showreel" />
    <button className={soundStyles.control} type="button" aria-label={muted ? "Enable showreel sound" : "Mute showreel sound"} aria-pressed={!muted} onClick={event => {
      event.stopPropagation();
      const touch = window.matchMedia("(pointer: coarse)").matches || ("pointerType" in event.nativeEvent && event.nativeEvent.pointerType === "touch");
      // Every touch tap is intentional; a desktop button double-click toggles once.
      if (touch || event.detail < 2) void toggleSound();
    }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4V4Z" />{muted ? <path d="m16 9 6 6m0-6-6 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}</svg>
      <span className={soundStyles.label} data-visible={muted || !!feedback} aria-hidden="true">{feedback || (muted ? <><span className={soundStyles.desktopHint}>Double-click for sound</span><span className={soundStyles.touchHint}>Tap for sound</span></> : "Sound On")}</span>
    </button>
    <span className={soundStyles.status} role="status">{feedback}</span>
  </div>;
}

const workflowPhrases = ["RESEARCH WITH PURPOSE", "DESIGN WITH CLARITY", "BUILD WITH PRECISION", "LAUNCH WITH CONFIDENCE"];

function OverviewVideo() {
  const video = useRef<HTMLVideoElement>(null);
  useViewportVideo(video, "/creative-loop.mp4", true);

  return <video ref={video} muted loop playsInline preload="metadata" aria-hidden="true" />;
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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const cleanups: Array<() => void> = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Keep teardown owned by one GSAP context; self-reverting matchMedia cleanups caused the prior recursion.
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
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
          const statement = showcase.querySelector<HTMLElement>(".project-statement-track");
          const phrase = statement?.querySelector<HTMLElement>(".project-statement-phrase");
          if (statement && phrase) {
            cardTimeline.fromTo(statement, { x: 0 }, {
              x: () => -phrase.offsetWidth,
              duration: cardTimeline.duration(),
              ease: "none",
            }, 0);
          }
          // Refresh the function-based positions when the stack's dimensions change,
          // including after fonts load or a tablet changes orientation.
          let refreshFrame = 0;
          let stackWidth = stack.clientWidth;
          let stackHeight = stack.clientHeight;
          const scheduleRefresh = () => {
            cancelAnimationFrame(refreshFrame);
            refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
          };
          const observer = new ResizeObserver(() => {
            if (stack.clientWidth === stackWidth && stack.clientHeight === stackHeight) return;
            stackWidth = stack.clientWidth;
            stackHeight = stack.clientHeight;
            scheduleRefresh();
          });
          observer.observe(stack);
          document.fonts.addEventListener("loadingdone", scheduleRefresh);
          cleanups.push(() => {
            observer.disconnect();
            document.fonts.removeEventListener("loadingdone", scheduleRefresh);
            cancelAnimationFrame(refreshFrame);
          });
        }
        const overview = element.querySelector<HTMLElement>(".service-overview");
        if (overview) {
          gsap.from(overview.querySelector("h2"), { y: 20, opacity: 0, duration: .7, ease: "power2.out", scrollTrigger: { trigger: overview, start: "top 82%", once: true } });
          gsap.from(overview.querySelectorAll(".service-overview-card"), { y: 22, opacity: 0, stagger: .12, duration: .7, ease: "power2.out", scrollTrigger: { trigger: overview.querySelector(".service-overview-grid"), start: "top 86%", once: true } });
        }
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
    <main ref={root}>
      <section className="hero" id="discover" aria-label="Spark Lab digital studio">
        <SiteNav />
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
      <section className="experiences section-pad" id="experiences" aria-label="SparkLab workflow and showreel">
        <h2 className="project-statement">
          <span className="project-statement-track">
            <span className="project-statement-phrase">BE VISIBLE. BE DISCOVERED. <em>BE UNSTOPPABLE.</em></span>
            <span className="project-statement-phrase" aria-hidden="true">BE VISIBLE. BE DISCOVERED. <em>BE UNSTOPPABLE.</em></span>
          </span>
        </h2>
        <div className="capability-stack">
          {workflowStages.map((step, index) => <article className={`capability-card capability-card-${step.tone}`} key={step.id} aria-labelledby={`workflow-${step.id}`}>
            <div className={`capability-surface ${workflowStyles.surface}`}>
              <div className={`capability-copy ${workflowStyles.copy}`}>
                <p className="capability-label">{step.stage}<span>{String(index + 1).padStart(2, "0")} / 04</span></p>
                <h3 id={`workflow-${step.id}`}>{step.title}</h3>
                <ul className={workflowStyles.points} role="list">
                  {step.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <WorkflowVisual stage={step.id} />
            </div>
          </article>)}
          <article className="capability-card capability-card-charcoal">
            <div className="capability-surface"><ProjectShowreel /></div>
          </article>
        </div>
      </section>

      <div className="text-marquee text-marquee-reverse" aria-label={workflowPhrases.join(" ✳ ") + " ✳"}>
        <div className="text-marquee-track" aria-hidden="true">{[0, 1].map((copy) => <div className="text-marquee-sequence" key={copy}>{workflowPhrases.map((phrase) => <span className="marquee-phrase" key={`${copy}-${phrase}`}>{phrase}<i>✳</i></span>)}</div>)}</div>
      </div>

      <SeoGeoShowcase />

      <ProjectShowcase />
      <FinalContact />
    </main>
  );
}
