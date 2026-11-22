# SparkLab Services | Business claims evidence audit

**Reviewed 22 November 2026.** Scope covers the AI Automation & Workflows offer on `/services`. I reviewed the [keyword map](SEO_KEYWORD_MAPPING.md), [Services brief](SEO_SERVICES_PAGE_BRIEF.md), source and asset manifests, and the current local production HTML. The Services page returned HTTP 200 and showed the estimate below. Public searches paired SparkLab's domain, studio identifiers and selected portfolio names with automation, case-study and portfolio terms. They did not surface a matching case study I could attribute to this studio. The production Services URL was unavailable through the public research tool. That limits independent verification.

## Evidence labels

- **Verified from existing website content** means the current website states or displays the claim. It establishes what SparkLab advertises.
- **Verified from project implementation** means the inspected code or project artifact demonstrates the stated behavior or asset.
- **Mentioned but not independently verified** means a factual assertion appears in the reviewed material and lacks attributable corroboration there or in the public search.
- **Unknown / requires business approval** means the available evidence cannot establish the claim or permission to use it.

## Markets and buyers

| Finding | Classification | Evidence and limits |
| --- | --- | --- |
| SparkLab explicitly offers services to **businesses**, including teams that need repetitive work automated or tools connected. | Verified from existing website content | Services describes the problem in those terms. About describes building websites, apps and automation around how a business works. [Service catalog](src/app/services-data.ts) · [About copy](src/app/(agency)/about/about-data.ts) |
| **Dhaka and Mymensingh, Bangladesh** are listed locations. The contact page advertises a **30-minute Google Meet** discovery call in **Asia/Dhaka**. | Verified from existing website content | These are location and booking details. [Homepage footer](src/app/components/HomeFooter.tsx) · [Contact page](src/app/(agency)/contact/page.tsx) |
| The studio uses cross-border language in its positioning. | Verified from existing website content | The English homepage talks about businesses without boundaries and illustrates links from Dhaka to several cities. The estimates are denominated in USD. The cities in the map are illustrative. [Homepage](src/app/page.tsx) · [Services page](src/app/(agency)/services/page.tsx) |
| Priority countries, client distribution, preferred industries, business size and decision-maker roles. | Unknown / requires business approval | No explicit priority market, target buyer profile or automation-sector specialization was identified. Phase 1's founders, operations teams and e-commerce prospects are hypotheses. A payments-themed design in Selected Work establishes the subject of the artwork. [Phase 1 research](SEO_KEYWORD_MAPPING.md) · [Gallery entries](src/app/components/ProjectGalleryLayout.tsx) |

## Automation tools and capabilities

| Finding | Classification | Evidence and limits |
| --- | --- | --- |
| The offer lists AI-powered workflows, business process automation, AI assistants, chatbot development, API integrations, workflow orchestration and intelligent reporting. The homepage also mentions AI agents and conversational systems. | Verified from existing website content | These are supported as descriptions of the advertised service. The pages do not define how independently an agent can act or which platforms it supports. [Service catalog](src/app/services-data.ts) · [Homepage](src/app/page.tsx) |
| The homepage illustrates customer replies, reporting, follow-up calls, lead capture and qualification, appointment scheduling, inquiry management, order notifications and data synchronization. | Verified from existing website content | These are use-case phrases presented in a consultation animation. The implementation rotates those phrases. [Consultation phrase list](src/app/components/HomeMedia.tsx) |
| SparkLab explicitly offers general API integration, with no named client automation platform verified in the reviewed material. | Verified from existing website content | The Services technology listing is described as the stack behind SparkLab's own website, including the code that delivers inquiries. [Service catalog](src/app/services-data.ts) · [Technology Stack](src/app/(agency)/services/TechnologyStack.tsx) |
| Specific client integrations and AI providers, including n8n, Zapier, Make, model APIs, CRM and commerce platforms. Agent permissions, escalation and human review. | Unknown / requires business approval | No client automation workflow or approved integration list was found in the reviewed sources. Confirm the platform, supported actions, deployment responsibilities and usage costs before naming it. [Service catalog](src/app/services-data.ts) · [Phase 2 approval list](SEO_SERVICES_PAGE_BRIEF.md) |
| SparkLab's own site implements a deterministic inquiry workflow and a booking integration. | Verified from project implementation | The inquiry form posts to the contact API, which validates submissions and can send email through SMTP or Resend. The booking UI embeds Cal.com. These implementations demonstrate website form, email and scheduling integration. They provide no evidence of client integration support or an AI agent. No live deliveries or bookings were attempted for this audit. [Inquiry form](src/app/(agency)/contact/InquiryForm.tsx) · [Contact API](src/app/api/contact/route.ts) · [Email delivery](src/app/api/contact/delivery.ts) · [Booking component](src/app/components/CalBookingButton.tsx) |
| The homepage implements Voice Prompt and Release Preview as interactive demos. | Verified from project implementation | Voice Prompt uses sample words, and its submission callback changes local UI state. Release Preview advances simulated checks using timers. Neither executes a client workflow or runs a production release. [Voice Prompt wrapper](src/app/components/HeroVoicePrompt.tsx) · [Release Preview](src/app/components/WorkflowVisuals.tsx) |
| A completed client AI agent, chatbot, reporting workflow or integration project is available to cite. | Unknown / requires business approval | The reviewed files contain service copy and examples of UI behavior. No attributable deployment artifact, integration specification or public case study was found for a completed client automation. |

## Project candidates and supporting evidence

| Finding | Classification | Evidence and limits |
| --- | --- | --- |
| **ILUF** appears in Selected Work as website design. **Nexr** and **Sentra** appear as digital product work, and **Echo** as a mobile application. **Huse**, **Soltek**, **AirFi**, **Solbex** and **Payland** appear under brand identity, with additional logo or visual-identity examples in the gallery. | Verified from existing website content | The local homepage renders 14 gallery entries. Titles, categories and descriptive alt text are the available public project descriptions. These are candidates for references to the existing visuals, subject to approval of the intended use. [Gallery entries](src/app/components/ProjectGalleryLayout.tsx) · [Gallery implementation](src/app/components/ProjectShowcase.tsx) |
| The creative portfolio manifest records original filenames and resized image derivatives. The Khadi Trip asset remains in the manifest and is absent from the current Selected Work entries. The AI Automation and analytics showcase images are illustrative assets. | Verified from project implementation | A supplied screenshot or identity board documents the artwork. The showcase documentation identifies sourced photography and authored screen compositions. [Artwork manifest](public/creative-portfolio-gallery/sources.json) · [Gallery entries](src/app/components/ProjectGalleryLayout.tsx) · [Showcase asset notes](public/seo-geo-showcase/README.md) |
| Client relationship, delivery or launch status, SparkLab's role, permission to name or reuse the work, and automation features in the gallery projects. | Unknown / requires business approval | The available gallery material lacks a case-study narrative, confirmed scope or release record. No conventional project case-study route was found in the inspected App Router pages. Existing art alone cannot establish a commissioned or deployed project. |

## Outcomes and metrics

| Finding | Classification | Evidence and limits |
| --- | --- | --- |
| The Services page displays **49+ Clutch reviews**, **50+ Behance featured projects**, **225+ Fiverr reviews**, and **3.5M+ monthly Dribbble views**. | Mentioned but not independently verified | The figures are hard-coded and shown without linked account profiles, dates or source exports. The public search did not establish attribution or currency. Do not reuse them as automation results or verified credentials without supporting records. [Platform Statistics](src/app/(agency)/services/PlatformStatistics.tsx) |
| The repository contains measured homepage performance results. | Verified from project implementation | The project reports contain Chrome and Lighthouse test data for SparkLab's website under documented conditions. These are website engineering measurements. [Performance baseline comparison](PERFORMANCE_BASELINE_COMPARISON.md) · [Initial rendering report](MOBILE_INITIAL_RENDERING_REPORT.md) |
| Quantified automation results such as time saved, cost reduction, error reduction, revenue or conversion improvements. | Unknown / requires business approval | No attributable project metrics with a baseline, measurement window and outcome record were found. Use approved qualitative evidence when available and publish quantified results only with documentation. |

## Project estimate and coverage

| Finding | Classification | Evidence and limits |
| --- | --- | --- |
| **$1,000–$6,000 USD** is the website's **estimated project range** for **AI Automation & Workflows**. The page says final pricing depends on scope and complexity. | Verified from existing website content | The local production HTML confirms the range and qualifier. The capability list describes the service area. [Services page](src/app/(agency)/services/page.tsx) · [Service catalog and budget data](src/app/services-data.ts) |
| The quote link carries the automation service into the inquiry form. | Verified from project implementation | The existing CTA routes to `/contact?service=ai-automation#project-inquiry`. The form reads the service query parameter and preselects the option. [Service link builder](src/app/services-data.ts) · [Inquiry form](src/app/(agency)/contact/InquiryForm.tsx) |
| What is included at either end of the range. | Unknown / requires business approval | The website does not allocate deliverables, workflow or integration counts, model and API fees, hosting, onboarding, ownership, maintenance, support or taxes to the estimate. It does not specify a billing model or guaranteed turnaround. Confirm these details and the range's continued approval before expanding pricing copy. |

## Claims cleared by the existing evidence

The current site supports describing **AI workflow automation for businesses** using the listed capabilities, and citing the displayed **indicative project estimate** with its scope-and-complexity qualifier. Before adding a named integration, completed client project, geographic specialization or business result, obtain an approved integration list, a publishable project record, the priority markets and buyers, and any documented outcomes. A clearly labeled example workflow can explain the offer while case-study evidence is gathered.
