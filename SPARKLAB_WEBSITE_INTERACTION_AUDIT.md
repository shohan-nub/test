# SparkLab website interaction audit

19 November 2026 · Asia/Dhaka

## A. Executive Summary

SparkLab currently has one public page. The navbar and its mobile Services shortcut navigate within that page. There is no Footer, comparison section, public contact page, or active contact form. The homepage has six broken links to the removed `#contact` anchor. The desktop and mobile Contact Us CTA instead opens a separate developer portfolio. This leaves SparkLab without a verified first-party inquiry path.

| Inventory | Count and disposition |
| --- | --- |
| Native links | **29** total, including both responsive navbar variants. 16 open local original artwork, 6 target existing homepage anchors, 6 target missing `#contact`, and 1 resolves externally but needs a destination decision. |
| Native buttons | **11**, all action-only. Ten control SEO/GEO and one toggles showreel sound. Browser tests exercised each carousel button and the sound button. |
| Additional control surfaces | **4**. Carousel keyboard/swipe stage, two focusable creative gallery rows, and double-click on the showreel backdrop. Two additional hover-only marquee surfaces are recorded separately. |
| Placeholder links | **0** bare `#`, empty or JavaScript hrefs. The six named stale fragments are broken destinations. |
| Missing-page links | **0 current hrefs to an absent path-based page**. The four tested proposed routes return 404. Six broken links still need destination decisions, with the four generic project buttons depending on whether real case studies are available. |
| Portfolio | **16 artwork links covering 14 named projects**. AirFi and Soltek each have two artworks. None link to a case study. |

**Verification key** — **Browser** means an interaction or state was observed in Chromium via DevTools Protocol at 1440×960, 820×1000 and 390×844 where applicable. **HTTP** means a read-only destination check. **Code** means inspected in source. Tests used the existing local production build served with Next.js 16.4.6 and cross-checked against live source and the route manifest. Button checks used browser DOM activation, keyboard input, or real pointer input as specified. No POST requests, mail, inquiry submissions, social actions, or external clicks were performed. Browser exceptions and console error events were monitored separately from failed network requests.

## B. Existing Route Inventory

| URL or surface | Source | Current state |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Sole public page. Homepage fragments are section destinations, not routed pages. |
| `POST /api/contact` | `src/app/api/contact/route.ts` | Server handler. HTTP HEAD returned 405. POST and email delivery were inspected only. |
| Generated 404 and global error | Next.js framework entries in `.next/app-path-routes-manifest.json` | Framework fallbacks. No authored error page or separate destination found in source. |
| Static assets | `public/` and Next's image endpoint | Original artwork, media and logos. Gallery hrefs are file URLs, not detail pages. |
| Root layout | `src/app/layout.tsx` | Only layout. Mounts OpeningLoader and global styles. No route groups, nested layouts, dynamic routes, link/router-based menu or shared Footer. |

Homepage order and interaction map:

| Order | Section or component | Interactive surfaces |
| --- | --- | --- |
| 1 | Root OpeningLoader | Automatic intro. No dismiss/skip control. |
| 2 | Hero including navbar, world map and global reach | Six link instances across responsive modes. Map and hero statistics are presentational. |
| 3 | Service overview | Two informational cards and decorative viewport-controlled video. No service links or player buttons. |
| 4 | Consultation panel | One CTA. Rotating service phrases are presentational. |
| 5–8 | Client/platform statistics, forward text marquee, creative statement, technology strip | No navigation. Statistics/logos and ten pinned creative previews are presentational. Technology strip has legacy hover playback rules. |
| 9 | Reverse text marquee | No links or controls. |
| 10 | Stacked Website showcase | Four identical-label project CTAs. Fifth card exposes a sound button and double-click sound area. Scroll controls the stack/expansion. |
| 11 | ServicesShowcase image gallery | Two pause-on-focus/hover rows, caption hover playback, rotating heading word. The 18 original images across the two loops are illustrative content. |
| 12 | SEO/GEO carousel | Ten buttons, keyboard/swipe stage and one homepage anchor. Slide content itself is informational. |
| 13 | CreativePortfolioGallery | Sixteen original-file links. |
| 14 | Our Story (`#manifesto`) | One CTA. Photo collage and arrow in the handwritten note are decorative. Last section. |

Shared UI helpers are local to their consumers. `Arrow`, `PlatformEmblem`, `GlobalMap`, `CapabilityMedia`, `ProjectShowreel`, `CreativePreview`, `OverviewVideo` and `ConsultationPhrases` are in `page.tsx`. `brand.ts` supplies artwork to the navbar and loader. `useViewportVideo.ts` handles media visibility. `PortfolioPreview` is reused for the 16 artwork links. There is no shared generalized Button or navigation component.

## C. Complete Button & Link Inventory

Source shorthand: **Home** = `src/app/page.tsx` · **SEO** = `src/app/components/SeoGeoShowcase.tsx` · **Portfolio** = `src/app/components/CreativePortfolioGallery.tsx` · **Services** = `src/app/ServicesShowcase.tsx`. Display labels are listed as authored, with visible arrow glyphs where present. CSS changes navbar casing at mobile widths. **Exists** refers to a destination or, for actions, the named control.

### Navigation and CTAs

| Section / component / source | Visible label or accessible name | Kind and current destination | Exists / evidence / classification | Issue and recommendation |
| --- | --- | --- | --- | --- |
| Hero / Home navbar, 373 | SparkLab logo · “Spark Lab home” | Internal `#discover` | Yes · Browser first Tab and activation · WORKING | Use `/` as the logo destination when routes expand. |
| Hero / Home navbar, 374 | Studio | Internal `#discover` | Yes · Browser · WORKING / NEEDS DECISION | It goes to the hero. Use Home for this target, or map Studio to `/about`. |
| Hero / Home navbar, 374 | Services | Internal `#experiences` | Yes · Browser · WORKING / NEEDS DECISION | The target is the project stack. Use `/services` for the real services index. |
| Hero / Home navbar, 374 | About Us | Internal `#manifesto` | Yes · Browser · WORKING | Destination is homepage Our Story. Use `/about` when ready. |
| Hero / Home navbar, 375 | Contact Us ↗ | External developer portfolio, new tab | Yes · HTTP 200 and HTML inspected · EXTERNAL / NEEDS DECISION | Page title is “Portfolio \| Independent Developer”. Its public HTML contains a contact form. Confirm whether this destination is intended for SparkLab inquiries. |
| Hero / Home mobile nav, 376 | Services ↓ · “Explore services” | Internal `#experiences` | Yes · Browser at 390 px · WORKING | This is a shortcut. Bring desktop-equivalent destinations into a future mobile nav. |
| Consultation / Home, 410 | Book a free consultation → | Internal `#contact` | No · Browser hash changed without a destination · BROKEN | Connect to a verified consultation or contact pathway. |
| Projects / Home, 462 / Website 1 | View Project → | Internal `#contact` | No · Browser DOM target absent · BROKEN | Link to a specific case only after project identification. |
| Projects / Home, 462 / Website 2 | View Project → | Internal `#contact` | No · Browser DOM target absent · BROKEN | Same. |
| Projects / Home, 462 / Website 3 | View Project → | Internal `#contact` | No · Browser DOM target absent · BROKEN | Same. If intended for inquiries, agree on a label aligned with that destination. |
| Projects / Home, 462 / Website 4 | View Project → | Internal `#contact` | No · Browser DOM target absent · BROKEN | Same. |
| SEO/GEO / SEO, 123 | Explore Our Capabilities ↗ | Internal `#experiences` | Yes · Browser keyboard activation · WORKING / NEEDS DECISION | Leads back to the project stack. Prefer a service index or SEO/GEO detail page. |
| Our Story / Home, 480 | MEET THE STUDIO → | Internal `#contact` | No · Browser hash changed without a destination · BROKEN | The label fits `/about`. Confirm if contact was the intent before wiring. |

### Portfolio links

All rows below are in **Portfolio / PortfolioPreview, src/app/components/CreativePortfolioGallery.tsx:56**. Each tile has a visible project title and category below its artwork, a ↗ affordance, and accessible link name “View [title] [category in lowercase] at full size (opens in a new tab)”. Each is **internal / exists / HTTP 200 / WORKING at the destination level**. Browser DOM confirmed 16 links. Individual new tabs were not opened. Current issue for all is the absence of associated project context beyond title/category. Keep original artwork as a secondary action if/when a case study becomes available. Literal filenames below are URL-encoded by the component.

| Visible title · category | Current destination at site root |
| --- | --- |
| ILUF · Website Design | `/Screenshot 2026-11-18 174048.png` |
| Solbex · Brand Identity | `/I will design modern minimalist saas tech app logo and brand identity with branding kit-01.jpg.jpeg` |
| AirFi · Brand Identity | `/AirFi Logo.jpg.jpeg` |
| Soltek · Brand Identity | `/I will design modern minimalist saas tech app logo and brand identity with branding kit_Artboard 1-04.jpg.jpeg` |
| Soltex · Visual Identity | `/Soltex Logo Design 2.jpg.jpeg` |
| Huse · Brand Identity | `/Huse Logo Design.jpg.jpeg` |
| AirFi · Logo Design | `/aihifi.jpg.jpeg` |
| Rivora · Logo Design | `/rivora.jpg.jpeg` |
| Khadi Trip · Website Design | `/Screenshot 2026-11-18 174109.png` |
| QuantumCore · Visual Identity | `/Q logo.jpg.jpeg` |
| Sentra · Digital Product | `/Sentra Logo.jpg.jpeg` |
| Sleep Plugg · Logo Design | `/Sleep Plug.jpg.jpeg` |
| Soltek · Logo Design | `/Soltek Logo.jpg.jpeg` |
| Nexr · Digital Product | `/nexr logo.jpg.jpeg` |
| Payland · Brand Identity | `/Payland Logo.jpg.jpeg` |
| Echo · Mobile Application | `/Echo logo design-02.jpg.jpeg` |

### Buttons, gestures and movement controls

| Section / component / source | Visible label or accessible name | Action / destination | Evidence and classification | Issue and recommendation |
| --- | --- | --- | --- | --- |
| Showreel / ProjectShowreel / Home 152 | Double-click for sound / Tap for sound / Sound On / Sound Off · “Enable showreel sound” or “Mute showreel sound” | Toggle mute on the existing video. No navigation. | Browser desktop pointer, Enter and mobile touch · ACTION ONLY | Button is tabbable when the card may be offscreen. Gate it to the visible active card. |
| Showreel / ProjectShowreel / Home 146 | No separate label on the video surface | Double-click toggles sound. Button targets are ignored by the backdrop handler. | Browser desktop double-click · ACTION ONLY | Discoverability depends on hint and native button. Single click on backdrop has no action by code. |
| SEO/GEO / SEO 118 | Icon dot · “Show SEO Strategy” | Select SEO Strategy. No navigation. | Browser · ACTION ONLY | Increase target width or space the controls on mobile. |
| SEO/GEO / SEO 118 | Icon dot · “Show GEO Optimization” | Select GEO Optimization. No navigation. | Browser · ACTION ONLY | Increase target width or space the controls on mobile. |
| SEO/GEO / SEO 118 | Icon dot · “Show Technical SEO” | Select Technical SEO. No navigation. | Browser · ACTION ONLY | Increase target width or space the controls on mobile. |
| SEO/GEO / SEO 118 | Icon dot · “Show AI Search Optimization” | Select AI Search Optimization. No navigation. | Browser · ACTION ONLY | Increase target width or space the controls on mobile. |
| SEO/GEO / SEO 118 | Icon dot · “Show Content Strategy” | Select Content Strategy. No navigation. | Browser · ACTION ONLY | Increase target width or space the controls on mobile. |
| SEO/GEO / SEO 118 | Icon dot · “Show AI Automation” | Select AI Automation. No navigation. | Browser · ACTION ONLY | Increase target width or space the controls on mobile. |
| SEO/GEO / SEO 118 | Icon dot · “Show Analytics & Growth” | Select Analytics & Growth. No navigation. | Browser · ACTION ONLY | Increase target width or space the controls on mobile. |
| SEO/GEO / SEO 119 | ← · “Previous capability” | Prior slide, wrapping. No navigation. | Browser · ACTION ONLY | Keep accessible name. |
| SEO/GEO / SEO 119 | → · “Next capability” | Next slide, wrapping. No navigation. | Browser · ACTION ONLY | Keep accessible name. |
| SEO/GEO / SEO 119 | Ⅱ or ▷ · “Pause automatic slides” or “Resume automatic slides” | Pause/resume autoplay. No navigation. | Browser confirmed hold and resume · ACTION ONLY | Pause rotation on focus/hover as well. |
| SEO/GEO / SEO 93–98 | “Use left and right arrow keys, or swipe, to explore services” (accessible stage label) | Arrow navigation or pointer drag/swipe. Cancel resets visual offset. No navigation. | Browser ArrowRight and emulated mobile swipe; cancel path Code · ACTION ONLY | Document the controls. Test drag cancellation and Safari touch behavior. |
| Moving creative gallery / Services 99 row 1 | “Creative gallery row 1. Hover or focus to pause movement.” | Focus or hover pauses upper track. No navigation. | Browser focus pause; hover Code · ACTION ONLY | Provide a discoverable pause/play control for touch and keyboard. |
| Moving creative gallery / Services 99 row 2 | “Creative gallery row 2. Hover or focus to pause movement.” | Focus or hover pauses lower track. No navigation. | Browser focus pause; hover Code · ACTION ONLY | Same. |
| Creative caption marquee / Services 95 and `src/app/services-showcase.css` | Design / Development / Innovation / Digital Experience / Brand Strategy / Creative Thinking | Pause caption motion on hover. No navigation. | Code · ACTION ONLY / INCOMPLETE | No equivalent persistent toggle on touch or keyboard. |
| Technology strip / Home 439 and `src/app/globals.css` | POWERED BY THE TECHNOLOGY WE TRUST | Track playback has legacy hover rules; later CSS sets running on hover. No navigation. | Code · INCOMPLETE | Verify effective hover behavior and add a consistent motion control if needed. |

Hover effects on links and images do not add destinations or extra clickable controls. Automatic transitions, image error fallbacks and intersection-based behavior are not counted as user actions. No dropdown triggers, social links, map links, telephone/email links, form submits, Next.js `Link` navigation, `router.push`, or `window.location` navigation were found in the current authored source.

## D. Broken and Placeholder Links

- **Six broken #contact anchors**. Consultation, Website 1–4 and Our Story. There is no element with this ID. Two button activations updated the URL without scrolling to a destination. All four project CTAs were inspected in the rendered DOM and use the same missing target.
- **Four broken preview resources**, `/p1.webp` to `/p4.webp`. Each returned 404 on all three browser widths. These requests affect project media rather than link totals. The cards hide images after an error. `/p5.webp` is a data field only. The fifth card renders `/card5.mp4` and does not request that placeholder filename.
- **No syntactic placeholders**. There are no current page links with bare `#`, empty href or `javascript:void(0)`. The independent portfolio is reachable and needs a purpose/ownership decision rather than being counted as broken.
- **Missing future pages**. `/about`, `/services`, `/work` and `/contact` all returned 404 in HTTP checks. They are proposals and do not appear as hrefs. No route-based cases are wired.

## E. Navigation Audit

Desktop shows Studio, Services and About Us alongside the logo and the external Contact Us CTA. The navbar is scoped to the Hero. It uses native href fragments and an IntersectionObserver for `aria-current="location"`; there is no pathname-based route state. Clicking desktop anchors updates the hash. The project-stack destination may stop at the start of a pinned sequence. Give each nav label a clear destination in the future and use route-aware highlighting for the primary pages. [Homepage navigation](src/app/page.tsx)

The mobile variant shows the logo, Contact Us and one Services shortcut. Services was activated in the 390 px browser and scrolled to `#experiences`. Studio and About Us are absent from the mobile menu area. There is no open/close state, submenu, Escape handler or dismissal sequence to test. The future mobile nav should provide access to the same primary destinations and close on selection and Escape. On future nested routes, use `/#fragment` for homepage deep links and route URLs for page navigation. [Homepage navigation](src/app/page.tsx)

First Tab reached the logo on all sampled widths. A desktop Tab pass continued to Studio, Services, About Us, Contact Us and then the consultation CTA. Enter navigated to the project stack and Our Story, and the corresponding active labels were observed. Enter also activated the carousel's Explore Our Capabilities anchor. Section-active tracking is based on recently delivered intersection entries, so this audit does not establish that the active item stays correct through every pin, fast scroll or deep link. Navigation between authored pages is not testable because only Home exists. [Homepage styles](src/app/globals.css)

## F. CTA and Conversion Audit

The consultation CTA is the clearest conversion action and currently fails. Restore a proven inquiry destination before adding service-detail pages. The external Contact Us link is reachable. Its root is independent portfolio content, and this audit did not verify a SparkLab inquiry flow there. The six stale CTAs plus this unresolved external CTA make the contact path the first priority.

“View Project” suggests a case study. Cards 1–4 have generic titles, missing previews and no details routes or evidence tying them to named portfolio examples. Treat the four individually once original files and titles are available. “MEET THE STUDIO” naturally maps to the Studio page. “Explore Our Capabilities” currently points backwards to work and fits the Services or SEO/GEO route better.

The fifth card has no project CTA. Double-click and the native sound control changed audio state without a navigation action or video restart in the observed runs. The mobile tap worked. The video paused after scrolling away. The overview clip is decorative and exposes no controls.

## G. Project Page Mapping

**None of the current projects has a detail route.** Website 1–5 descriptions are quoted from existing data. Website 5's description is a data field and is not rendered in the showreel.

| Project / category | Available asset or expected file | Existing description | Route recommendation / publication needs |
| --- | --- | --- | --- |
| Website 1 / Design | `/p1.webp` missing | A clear, considered website experience with thoughtful details and a distinctive visual language. | Defer. Obtain original art, real title, role, brief and permission. Match to an existing Work project when verified. |
| Website 2 / Development | `/p2.webp` missing | A responsive digital experience that brings intuitive navigation and everyday functionality together. | Defer. Obtain original art, real title, role, brief and permission. Match to an existing Work project when verified. |
| Website 3 / AI & Automation | `/p3.webp` missing | An approachable interface for connected workflows, useful insights, and simpler daily tasks. | Defer. Obtain original art, real title, role, brief and permission. Match to an existing Work project when verified. |
| Website 4 / Branding | `/p4.webp` missing | An expressive brand experience, connecting a confident identity with a cohesive digital presence. | Defer. Obtain original art, real title, role, brief and permission. Match to an existing Work project when verified. |
| Website 5 / UI/UX | `/card5.mp4` showreel; data references an unused `/p5.webp` | A focused digital experience where considered design and practical technology work together. | Keep as a Work showreel. Add a case only if it represents a documented project. |

The named portfolio projects have **no public project descriptions** beyond captions and alt text. The table summarizes the artwork evidence. Before any case study, collect the real brief, SparkLab's contribution, publishable visuals, permission and verified context. Any live links or outcomes should be added only when available. AirFi's two artworks and Soltek's two artworks are grouped by name for planning. **Soltex** remains distinct.

| Project | Category | Available artwork | Detail recommendation / specific gaps |
| --- | --- | --- | --- |
| ILUF | Website Design | Architecture-led website hero. Original filename listed in C. | First candidate once brief, role and additional screens are available. |
| Solbex | Brand Identity | Identity board, wordmark, apparel and promotional applications. Original filename listed in C. | Group on Work initially. |
| AirFi | Brand Identity | Brand system board, typography, mobile and watch visuals. Original filename listed in C. | One combined AirFi case if project scope and applications are documented. |
| Soltek | Brand Identity | Identity system and print, packaging and screen applications. Original filename listed in C. | One combined Soltek case if scope is documented. |
| Soltex | Visual Identity | Social profile presentation. Original filename listed in C. | Group on Work; establish scope and distinguish from Soltek. |
| Huse | Brand Identity | Identity and packaging board, typography and mobile applications. Original filename listed in C. | Candidate once brief, role and brand decisions are documented. |
| AirFi | Logo Design | Standalone logo treatment. Original filename listed in C. | Combine with AirFi Brand Identity. |
| Rivora | Logo Design | Standalone wordmark and symbol. Original filename listed in C. | Group on Work until there is more supporting work. |
| Khadi Trip | Website Design | Travel website hero with ocean and island photography. Original filename listed in C. | First candidate once brief, role and more screens are available. |
| QuantumCore | Visual Identity | Web, print and digital collateral. Original filename listed in C. | Group on Work initially. |
| Sentra | Digital Product | Brand board, mobile screens and app icons. Original filename listed in C. | Candidate once flows, role and scope are documented. |
| Sleep Plugg | Logo Design | Standalone wordmark treatment. Original filename listed in C. | Group on Work until more artwork is available. |
| Soltek | Logo Design | Logo with architectural photography. Original filename listed in C. | Combine with Soltek Brand Identity. |
| Nexr | Digital Product | Brand board with watch and phone visuals. Original filename listed in C. | Group on Work until role and product scope are documented. |
| Payland | Brand Identity | Payment branding, screens and signage. Original filename listed in C. | Candidate once brief and scope are established. |
| Echo | Mobile Application | Brand board, app screens and promotional artwork. Original filename listed in C. | Candidate once product brief, role and key flows are available. |

The pinned creative statement has ten decorative WebP previews under `public/creative-showcase/` and the moving gallery uses 18 WebPs under `public/web-app-gallery/` with local source metadata. Neither supplies project case links or names for the full sets. The seven SEO/GEO slides are service descriptions with illustration assets under `public/seo-geo-showcase/`. Use them to support service pages. They do not establish seven client projects.

## H. Recommended Multi-Page Architecture

Start with a small set of substantive pages. Use a server layout for the shared navigation and App Router URLs such as `src/app/(marketing)/services/page.tsx`; the optional route group does not appear in the public URL. Use `/work/[slug]` only when real case studies are ready.

| Proposed route | Purpose and content | Homepage source and suggested links | New content required |
| --- | --- | --- | --- |
| `/` | Agency introduction and selected services/work. | Existing Homepage. Logo and an explicit Home entry. | Shorten overlapping navigation once deeper pages are published. |
| `/about` | Studio, team, process and verified reach. | Our Story, Hero positioning; Meet the Studio and About Us. | Studio details, team information and methodology. Validate any reach metrics. |
| `/services` | Services index with decision guidance and engagement paths. | Service overview, consultation topics and SEO/GEO showcase. Services links on both breakpoints; Explore Our Capabilities. | Service taxonomy, scoping guidance and a useful comparison of offers. |
| `/services/web-development` | Website Design & Development. Design, build, CMS/e-commerce, performance and launch. | Web, Software & Mobile Development block; confirmed web work. A future service link. | Process, deliverables and relevant examples. |
| `/services/mobile-app-development` | Mobile apps. Discovery, UX, platforms and release/handoff. | Overview mention and Echo/Sentra concept previews. A future service link. | Platforms, engineering scope and publishable examples. Defer until materially distinct. |
| `/services/ai-automation` | AI Automation and workflow integration. | AI & Intelligent Automation card and consultation phrases; future AI link, optionally the automation slide. | Workflow examples, integration constraints, human review and data handling. |
| `/services/seo-geo` | Search visibility and discovery services. | SEO/GEO slides and text; Explore Our Capabilities when its purpose is specific to this showcase. | Defined deliverables, measurement and verification. |
| `/services/business-systems` | Custom Software & Business Systems. Portals, dashboards and operations tools. | Overview software description and automation use cases. A future service link. | Representative systems, integration boundaries and support model. Initially group with web/automation if thin. |
| `/services/branding` | Creative direction and branding, with 3D included if backed by a defined offering. | Many branding boards in selected work and the branding project category. Future service link. | Deliverables, identity process and verified 3D scope. No dedicated 3D page until it has real substance. |
| `/work` | Portfolio index with service/category browsing and showreel. | Existing masonry and showreel; future primary Work link. | Group assets for each project and confirm authorship and permissions before labeling cases. |
| `/work/[slug]` | Named case details with brief, role, visuals and relevant service links. | View Project only for matched cases. Portfolio image tiles can retain a full-size action. | Real case content per G. Start with ILUF or Khadi Trip once ready. |
| `/contact` | Confirmed studio contact and clear inquiry form or booking path. | Contact Us and consultation CTA. Project inquiries only when the label is accurate. Existing API handler provides backend foundation. | Verified channels and recipients, consent/privacy decisions, front-end states, delivery tests in staging. |

Keep primary nav centered on Home, Studio, Services, Work and Contact. Add service children only as pages become ready. Use descriptive names to separate About, inquiry and individual work journeys.

## I. Contact and Social Link Audit

The SparkLab homepage has no rendered form, submit button, email address link, `mailto:`, `tel:`, WhatsApp, location link or social profile link. Platform logos in Statistics and external technology logo image requests are not links. Former footer assets or historical audit notes are not current UI. The navbar's destination returned 200 and identifies itself as “Portfolio | Independent Developer”. Its HTML includes its own contact section and submit button. This gives a visitor an indirect path to a developer-portfolio form, but the intended SparkLab recipient and delivery were not verified. [Existing external destination](https://shohan-portfolio-tau.vercel.app/)

The API validates four trimmed required fields, maximum lengths (100/254/160/5000) and an email pattern. It includes a website honeypot and an in-memory limit of five requests per key per minute. Code exposes rate-limit (429), input errors (400), missing mail configuration (503), provider failure (502) and catch-all failure (500), plus success. Email delivery requires Resend and server configuration. No current frontend connects these states or supplies success/error announcements. Configuration and live delivery remain unverified. Before publishing a form, test the validations, disabled/submitting states, accessible feedback, repeat submissions and end-to-end delivery in a staging environment. Review proxy assumptions and rate-limit persistence for the final hosting model. [API implementation](src/app/api/contact/route.ts)

## J. Responsive and Accessibility Findings

| Finding | Evidence | Impact |
| --- | --- | --- |
| Mobile nav coverage | Browser 390 px. Desktop links hidden and Services shortcut available. | Mobile lacks the direct About entry and future route access design. |
| Compact targets | Browser at 390 px. Logo 108×25, Services 85×41, Contact 97×40. Carousel dots 17×44 and arrows 36×44. Showreel switch 129×48 when hint present. | Increase compact targets; touch dots are particularly crowded. |
| Focus at inactive project states | Browser DOM probe at the start of the desktop stack found card 1's link at viewport y=577 and cards 2–4 plus the sound toggle at y=1285–1400 on a 960 px viewport. All five had tabIndex=0 and no inert ancestor. | Keyboard traversal can expose controls outside the active pinned card. Scope tab access to visible content in a reviewed fix. |
| Carousel | Browser buttons, keyboard stage and mobile swipe. Aria labels and active indicator exist. Autoplay holds when manually paused and resumes correctly. | Rotation can continue on focus/hover by code, and current-slide changes have no dedicated announcements. Test assistive tech. |
| Other moving content | Both gallery rows paused on focus in browser. Caption pause was code-inspected. Loader, consultation phrases and site marquees have no general visible pause controls. | Make motion controls available to touch and keyboard users where continuing movement requires them. |
| Link clarity | Four identical View Project labels; carousel-to-stack and Studio-to-Hero semantics. Gallery links announce the full-size purpose and new tab. | Use project-specific names and label-to-destination consistency. |
| Layout and network | No page-level horizontal overflow or uncaught exceptions/console error events in sampled runs. Four separate preview resource 404s were observed. | Restore project assets, then retest focus and wheel/touch flows with actual media present. |

**Limits** — Chromium emulation does not replace physical mobile, Safari/Firefox, screen-reader testing, production deployment behavior, or real email delivery. All gallery originals were checked as resources, without opening every new tab. Gesture cancellation, every incidental hover effect, and arbitrary complex scroll/focus sequences were code-inspected only. No claim of a full accessibility conformance pass.

## K. Priority Classification

| Priority | Finding |
| --- | --- |
| **CRITICAL** | No verified SparkLab-owned conversion journey. Consultation, project and story CTAs hit a missing anchor, and no public form is rendered. Decide the first-party contact destination and restore the path. |
| **HIGH** | Four project preview 404s, ambiguous View Project actions, and Contact Us reaching a different portfolio. Confirm assets, actual case ownership and CTA destinations. |
| **MEDIUM** | Mobile nav lacks route parity, several compact hit areas, focus reaches offscreen pinned controls, carousel autoplay can continue during interaction. |
| **LOW** | Refine naming, advisory new-tab details, optional technology motion controls and detailed focus polish after the structure and destinations are established. |

## L. Recommended Implementation Order

1. Decide Contact Us and consultation destinations, validate verified contact channels and stage the inquiry flow. Map Our Story to Studio when the page is available.
2. Restore or match the four original project assets. Decide, card by card, which should open a case study and which should lead to Work or an inquiry with a label that states that intent.
3. Publish Home, About, Services, Work and Contact first. Implement one shared nav with route-aware current states and mobile parity, and test keyboard focus across pinned cards.
4. Publish substantive service pages as content becomes available. Prioritize web development, AI automation and SEO/GEO according to the current homepage emphasis. Keep thin offerings grouped until distinctive.
5. Add a few named cases from reviewed originals and supporting material. Keep the full-size image links as a deliberate secondary interaction.
6. Re-audit all deployed paths, redirects, responsive nav, actual mobile devices, accessibility and contact states before release.
