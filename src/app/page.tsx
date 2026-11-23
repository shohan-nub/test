import { cacheLife } from "next/cache";
import Link from "next/link";
import { pageMetadata, siteName } from "./site-metadata";
import { JsonLd, siteEntities } from "./entity-structured-data";
import worldLand from "./world-land.json";
import SeoGeoShowcase from "./components/SeoGeoShowcase";
import ProjectShowcase from "./components/ProjectShowcase";
import { workflowStages } from "./components/workflow-stages";
import { DeferredWorkflowVisual, WorkflowMotion } from "./components/WorkflowMotion";
import workflowStyles from "./components/WorkflowVisuals.module.css";
import FinalContact from "./components/FinalContact";
import HomeFaq from "./components/HomeFaq";
import HomeFooter from "./components/HomeFooter";
import { MagneticButton } from "./components/motion-brew/magnetic-button";
import { FlipWords } from "./components/motion-brew/flip-words";
import { BackspaceText } from "./components/motion-brew/backspace-text";
import HeroVoicePrompt from "./components/HeroVoicePrompt";
import { HeroBookingButton, HomeSiteNav } from "./components/HomeHeroControls";
import { ConsultationPhrases, OverviewVideo, ProjectShowreel } from "./components/HomeMedia";
import MapMotion from "./components/MapMotion";

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
    <svg id="hero-world-map" viewBox="0 0 1000 500" aria-hidden="true">
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
    <MapMotion />
  </div>;
}

const heroMarqueePhrases = ["DIGITAL INNOVATION", "CREATIVE TECHNOLOGY", "INTELLIGENT AUTOMATION", "BUILT FOR WHAT'S NEXT", "IDEAS INTO REALITY", "DESIGN MEETS TECHNOLOGY"];

const title = `${siteName} | Creative Technology & AI Automation Studio`;
const description = "SparkLab builds websites, web and mobile apps, custom software, and AI automation for businesses worldwide. Explore our services and discuss your project.";

export const metadata = pageMetadata("/", title, description, { absoluteTitle: true });

export default async function Home() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });

  return (
    <>
    <JsonLd data={siteEntities} />
    <main>
      <section className="hero" id="discover" aria-label={`${siteName} digital studio`}>
        <HomeSiteNav />
        <div className="hero-content">
          <h1><span className="hero-line">Ideas Without <span className="hero-accent">Borders.</span></span></h1>
          <p className="hero-description">A <Link href="/about" prefetch={false} style={{ textDecoration: "underline" }}>creative technology studio</Link> building software and AI automation for businesses worldwide.</p>
          <div className="hero-actions">
            <HeroBookingButton />
            <MagneticButton href="/approach" variant="outline" size="sm" strength={0.18} labelStrength={0.08} className="hero-action hero-action-secondary">Explore Our Approach</MagneticButton>
          </div>
        </div>
        <GlobalMap />
        <HeroVoicePrompt />
      </section>
      <section className="service-overview section-pad" aria-labelledby="service-overview-heading">
        <header className="service-overview-heading">
          <h2 id="service-overview-heading">Websites, Apps, Custom Software &amp; AI Automation</h2>
          <FlipWords before="Built for" words={["Websites", "Automation", "Applications", "Digital Products"]} after="" interval={4000} wordClassName="text-[#b9562d]" className="service-flip" />
        </header>
        <div className="service-overview-grid">
          <article className="service-overview-card service-overview-dark">
            <span className="service-overview-number">01</span>
            <div><h3>AI &amp; Business Process Automation</h3><p>We build <Link href="/services#ai-automation" prefetch={false} style={{ textDecoration: "underline" }}>AI agents and automated workflows</Link> to route customer inquiries, sync business data, and generate recurring reports.</p></div>
          </article>
          <article className="service-overview-card service-overview-orange">
            <span className="service-overview-number">02</span>
            <div><h3>Web, Software &amp; Mobile Development</h3><p>Launch a website customers can use, build a custom web app for your team, or develop an iOS or Android app. <Link href="/services#website-design" prefetch={false} style={{ textDecoration: "underline" }}>Explore website development</Link>.</p></div>
          </article>
          <div className="service-overview-card service-overview-visual" aria-hidden="true">
            <OverviewVideo />
          </div>
        </div>
      </section>
      <div className="text-marquee hero-video-marquee">
        <span className="sr-only">{heroMarqueePhrases.join(", ")}</span>
        <div className="text-marquee-track" aria-hidden="true">{[0, 1].map((copy) => <div className="text-marquee-sequence" key={copy}>{heroMarqueePhrases.map((phrase) => <span className="marquee-phrase" key={phrase}>{phrase}<i>✳</i></span>)}</div>)}</div>
      </div>
      <section className="consultation-section section-pad" aria-labelledby="consultation-heading">
        <div className="consultation-panel">
        <div className="consultation-copy">
          <h2 id="consultation-heading">What Would You Like to Build or Automate?</h2>
          <p>Bring a product idea or a task your team repeats. <Link href="/contact#project-inquiry" prefetch={false} style={{ textDecoration: "underline" }}>Send a project brief</Link> or book a free consultation to discuss what to build first.</p>
          <BackspaceText before="" words={["Building digital experiences", "Automating business workflows", "Creating intelligent solutions", "Turning ideas into reality"]} pause={2200} wordClassName="text-[#b9562d]" className="consultation-backspace" />
          <a className="consultation-cta" href="#contact">Book a free consultation <span aria-hidden="true">→</span></a>
        </div>
        <ConsultationPhrases />
        </div>
      </section>
      <WorkflowMotion>
        <h2 className="sr-only">Our Digital Product Development Process</h2>
        <div className="project-statement" aria-hidden="true">
          <span className="project-statement-track">
            <span className="project-statement-phrase">BE VISIBLE. BE DISCOVERED. <em>BE UNSTOPPABLE.</em></span>
            <span className="project-statement-phrase" aria-hidden="true">BE VISIBLE. BE DISCOVERED. <em>BE UNSTOPPABLE.</em></span>
          </span>
        </div>
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
              <DeferredWorkflowVisual stage={step.id} />
            </div>
          </article>)}
        </div>
        <article className="workflow-showreel capability-card-charcoal" aria-label="SparkLab creative showreel">
          <div className="capability-surface"><ProjectShowreel /></div>
        </article>
      </WorkflowMotion>

      <SeoGeoShowcase />

      <ProjectShowcase />
      <FinalContact />
      <HomeFaq />
    </main>
    <HomeFooter />
    </>
  );
}
