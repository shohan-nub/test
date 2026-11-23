# SparkLab content SEO audit and keyword map

Reviewed 23 November 2026. Scope covers the five public routes on `https://sparklabltd.com`. The review used the current route sources, rendered content and metadata, the published service catalog, and the earlier evidence audits. SparkLab presents itself as a Bangladesh-based creative technology studio serving businesses worldwide. The published catalog supports website, mobile app, custom software, workflow automation, search visibility, branding, and 3D work. It does not establish agency revenue, client outcomes, an approved list of named integrations, or a portfolio of attributable client case studies. [Keyword research](SEO_KEYWORD_MAPPING.md) · [Services facts](SEO_SERVICES_FACTS.md) · [Previous answerability audit](AEO_COMPLETION_REPORT.md)

## Baseline and findings

- The homepage matched the supplied heading inventory of one H1, nine H2s and 33 H3s. Project titles, workflow cards, the visibility carousel, and FAQ account for much of the H3 count. H4–H6 are unnecessary for the existing content depth. The workflow marquee was an H2 but described a brand slogan rather than the workflow it introduced.
- The brand-led homepage H1, “Ideas Without Borders,” works as a brand statement. The adjacent introduction and service overview carry the studio category and service terms. The overview H2 was long and generic about outcomes, while several useful task phrases were elsewhere in animated copy.
- Services already gives its automation offer a dedicated H2 and separates the five other services. Its shortest descriptions left practical questions to capability lists. The Services title and H1 already support buyer intent, so the main opportunity was body copy.
- About already establishes location, audience and identity. Approach already has an ordered four-stage process and is the better destination for delivery detail. Contact already supports both a proposal and a booking, with a gap in plain-language guidance about what to put in a brief.
- The 650-word audit figure depends on what the tool counts. Repeated or decorative text, collapsed answers, carousel visibility, navigation and footer labels can produce different totals. The useful measure here is whether a buyer can find an answer. Google’s published guidance does not specify a preferred word count or heading-level quota. [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) · [Google Search Essentials](https://developers.google.com/search/docs/essentials)

## Keyword map

| Route | Primary intent | Primary keyword | Secondary terms | Related terms and placement |
| --- | --- | --- | --- | --- |
| `/` | Commercial studio discovery | Creative technology studio | Digital product development, web and automation studio | Hero description and homepage title identify the studio. Service overview H2 and cards introduce websites, apps, custom software, and AI automation. The workflow heading identifies delivery at a glance and the Hero links to Approach. |
| `/services` | Compare services and request a quote | AI workflow automation services | Business process automation, website development, web application development, mobile app development, custom software development | The automation H2 and example cover customer inquiry routing, reporting, record sync and agents. Existing website, mobile and custom software H2s provide distinct places for CMS, iOS/Android, dashboards and inventory. |
| `/about` | Branded research and due diligence | About SparkLab | SparkLab studio, creative technology studio in Bangladesh | H1 and introduction establish the studio and worldwide reach. “What We Build” and “What We Value” explain capabilities and design priorities. |
| `/approach` | Understand how a project runs | Digital product development process | Software delivery process, SparkLab development process | H1 and process H2 introduce delivery. The four stage H3s cover discovery, technology planning, prototyping, and launch. Practical automation explains how workflow steps are selected. |
| `/contact` | Start an inquiry or book a call | Contact SparkLab | SparkLab project inquiry, book a discovery call | Intro, booking H2, and inquiry H2 guide buyers to the appropriate action. The inquiry introduction explains what information is useful in a project brief. |

Provider pages and development playbooks support a qualitative distinction between service comparison and process research. The homepage summarizes the studio offer, Services answers commercial questions, and Approach explains how delivery works. Search volume, difficulty, CPC, and ranking position were unavailable. These assignments express intended page ownership, with no claim of observed cannibalization or ranking gains. [thoughtbot services](https://thoughtbot.com/services) · [thoughtbot playbook](https://thoughtbot.com/playbook) · [Prior qualitative search review](SEO_KEYWORD_MAPPING.md#search-results-and-buyer-intent)

## Changes implemented

- **Homepage** · Named the studio’s software and automation focus in the Hero description. Shortened the services H2, gave the automation card concrete examples, and added contextual links to website development and the project inquiry. The workflow retains its visible marquee, with a descriptive screen-reader heading before the four stage headings. The SEO/GEO carousel introduction explains its topic and links to the relevant service. The portfolio, FAQ, media, and footer already serve distinct roles and retain their existing content.
- **Services** · Added an illustrative customer-inquiry workflow. Expanded website, mobile and custom software descriptions with supported examples. Their Service JSON-LD descriptions update through the existing shared data, with stable entity IDs. The example makes no claim about a named client or delivered result.
- **About, Approach and Contact** · Clarified the studio’s task-focused design principle, explained how the delivery process decides which steps to automate, and added guidance on what to include in an inquiry.

Case-study narratives, measured outcomes, platform-specific integrations and delivery or support guarantees require source records and owner approval before publication.

## Local production verification

| Route | Main-content words before → after | Final heading levels |
| --- | ---: | --- |
| `/` | 374 → 378 | 1 H1, 9 H2, 33 H3 |
| `/services` | 546 → 606 | 1 H1, 9 H2 |
| `/about` | 113 → 128 | 1 H1, 4 H2, 4 H3 |
| `/approach` | 254 → 264 | 1 H1, 4 H2, 8 H3 |
| `/contact` | 166 → 190 | 1 H1, 2 H2 |

These diagnostic counts use Chromium at 390 px, count text in the main landmark, and exclude scripts, SVG, explicitly hidden and screen-reader-only nodes, and collapsed FAQ answers. They are not directly comparable with the supplied audit figure.

All five routes returned HTTP 200. Title, description, canonical, and social metadata match the immediately preceding local build. Sitemap, robots and the existing nine JSON-LD entities passed checks, including Service names and descriptions matched to their rendered articles. Chrome checks at 360, 390, 768, 1024 and 1440 px found no horizontal overflow or recorded runtime exceptions. The FAQ revealed and closed at 390 and 1440 px. TypeScript and the production build passed. ESLint returned zero errors and two existing warnings in `brand-bridge.tsx`. No publishing or ranking change was verified.
