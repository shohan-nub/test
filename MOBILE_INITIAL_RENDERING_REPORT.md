# SparkLab mobile initial rendering

The initial mobile cost is predominantly text shaping during document layout. A mobile-only trial deferred two offscreen text strips and reduced the isolated first pass, but full navigations showed a larger second layout after first paint. Median mobile blocking time rose in both test profiles. I removed the trial and kept the application source as it was before this investigation.

## What was measured

I reviewed the [technical audit](SEO_GEO_PERFORMANCE_AUDIT.md), the [controlled baseline comparison](PERFORMANCE_BASELINE_COMPARISON.md), and performance commits `d1e7c9c`, `dcc1ac2`, and `bd2e7a7`. The immediate control is the later production build `Dst8Qs_2TTaxQLw6EhB5c`, which already includes the deferred gallery and the desktop Voice Prompt improvement. The older 84 mobile and 87 desktop build is historical context.

The initial `Layout` event in the two saved current mobile traces took 606–660 ms wall time and 149–161 ms of renderer CPU time. It followed a full style update that visited 683 elements and used 27–33 ms of renderer CPU time. The large layout events and the Services overview heading’s LCP both precede the main Next.js evaluation and later React callbacks in those traces. The largest style and layout costs therefore warranted investigation independently of hydration.

I recorded detailed Blink traces from the same build and used a loopback-only diagnostic proxy to vary one subtree or CSS feature at a time. A second harness matched the HTML and styles at both mobile widths and measured one full layout after parsing. It removed app scripts and used performance marks around the layout, so the comparison isolates rendering and avoids streaming, hydration and network scheduling noise. Production Lighthouse runs use the original browser navigation path with JavaScript enabled. The diagnostic HTML and scripts were never shipped.

## Confirmed bottlenecks

| Area | Evidence and source |
| --- | --- |
| Text shaping across the initial document | Blink’s `InlineNode::ShapeTextIncludingFirstLine` used 142–157 ms of renderer CPU in the three controlled 390 px layout passes. That accounts for most of first-layout CPU. The instrumented live full-layout passes likewise show text shaping as the largest named child. |
| Offscreen repeated marquee and phrase text | The video marquee renders two copies of six phrases in `Home`, and `ConsultationPhrases` renders three copies of its eight phrases for seamless cycling. Both have a fixed-height, clipped viewport but previously laid out their descendants before the user reached them. Deferring only these two subtrees reduced the number of dirty layout objects from 934 to 790 at both widths. [Homepage](src/app/page.tsx) · [Consultation phrases](src/app/components/HomeMedia.tsx) · [Styles](src/app/globals.css) |
| Broader offscreen layout | A diagnostic that suppressed several additional sections reduced a 390 px forced layout to 77.7 ms of renderer CPU. That diagnostic changes the document’s flow and does not represent a shippable optimization. The individual section probes did not justify changing workflow, FAQ, footer, contact, or gallery layout. |
| Style selector matching | The selector-stats trace’s largest individual match totals were about 3.1 ms for the carousel arrow-button selector and 2.0 ms for the Cal modal’s body `:has()` selector. This separately instrumented recording is suitable for attribution, and its overhead makes it unsuitable for timing the optimization. [Chrome DevTools Selector Stats](https://developer.chrome.com/docs/devtools/performance/selector-stats) |
| Paint and above-the-fold graphics | Initial main-renderer paint used about 4–6 ms of CPU in the first deep traces. Preserving the map box while suppressing its SVG children left comparable layout CPU in the exploratory pair (173.3 vs 176.0 ms). Pausing the gradient sweep and hiding the background layers also failed to isolate a consistent layout reduction. These probes do not measure every compositor or GPU cost. [World map](src/app/page.tsx) · [Hero styles](src/app/globals.css) |
| Fonts and images | The site uses system Arial and Georgia and had no startup font request. Temporarily forcing Arial or disabling balanced/pretty wrapping did not reliably reduce initial layout. The brand image declares intrinsic dimensions, the hero SVG declares its view box, the gallery images are lazy and their cards reserve their aspect ratios. The 390 px LCP was text rather than an image. [Brand image dimensions](src/app/components/brand.ts) · [Gallery layout](src/app/components/ProjectGalleryLayout.tsx) |

### Isolated first layout

Each cell shows median [minimum–maximum] of three cold Chromium renderer samples. All times are renderer CPU milliseconds. CSS and DOM were present when each layout was triggered. The same two declarations were the only difference between arms.

| Metric | 390 × 844 control | 390 × 844 candidate | 360 × 800 control | 360 × 800 candidate |
| --- | ---: | ---: | ---: | ---: |
| Layout CPU | 213.00 [204.74–220.53] | 187.82 [137.27–193.48] | 214.05 [193.22–218.15] | 183.39 [181.77–185.97] |
| Text shaping CPU | 149.57 [142.02–156.51] | 128.43 [93.22–136.18] | 149.20 [136.26–154.01] | 128.13 [127.56–128.61] |
| Style update CPU | 44.00 [37.23–45.43] | 35.99 [32.83–41.58] | 45.64 [38.22–48.96] | 44.25 [44.10–45.42] |
| Dirty layout objects | 934 | 790 | 934 | 790 |

Individual live probes removed 69 initial layout objects when only the video marquee was deferred and 75 when only the consultation phrases were deferred. These counts match the combined reduction. The repeated text remains available for the visual loops. Chrome renders those subtrees as they approach the viewport.

## Trial and disposition

The trial added `content-visibility: auto` to `.hero-video-marquee` and `.consultation-phrases` through 640 px in [globals.css](src/app/globals.css). Their 30 px and 320 px heights are definite on mobile, so Chrome preserved their space while it skipped their contents. The render trees and animation implementations stayed the same. I removed the rule after the full navigation results below. No application source edits from this phase remain. The gallery, Hero map, Voice Prompt, desktop workflow, SEO metadata and crawl routes retain the pre-existing implementation.

## Production and browser verification

The production trial build `Ij1ohBKwAlvHNCw8YZxf5` includes the mobile rule. At 390 × 844, 360 × 800, and 1366 × 768, paired control and trial screenshots of the Hero and marquee were byte-identical. Inspection of the consultation and gallery screenshots found no visible design change. The geometry check matched every measured bound at 360 px and 1366 px. At 390 px, the largest measured difference was 0.02 CSS px. Both strips had identical widths and heights at each viewport. Total document height was unchanged and there was zero horizontal overflow in all three comparisons.

Both motion effects advanced in normal mode at all three widths. Reduced-motion screenshots exercised the existing reduced-motion layouts. All 14 gallery entries were present, and the deferred gallery module mounted on approach. The checks captured no runtime exceptions or hydration errors. Desktop computed `content-visibility: visible` for both strips, confirming that the rule has no desktop rendering effect.

- `npm run build` passed, including the existing image checks and all public route generation.
- `tsc --noEmit --incremental false` passed.
- `npm run lint` passed with two existing warnings in `brand-bridge.tsx` for unused `AnimatePresence` and `POP`. There were zero lint errors.
- Five local public pages returned HTTP 200 with their expected `https://sparklabltd.com` canonicals. The local sitemap returned the same five URLs and robots still referenced the production sitemap.

### Restored build verification

The rebuilt restoration (`cBegmnatSTB84BoTGpZEN`) passed TypeScript, ESLint with the same two existing warnings, and the production build. `globals.css`, `page.tsx`, and `HomeMedia.tsx` match Git. The six pre-existing modified or untracked source files match their saved SHA-256 hashes.

Both strips computed `content-visibility: visible`. New traces at 390 × 844 and 360 × 800 showed the original 934-object first layout and 147-object second layout. The trial’s 790-object first layout and 295-object second layout were absent from those traces.

The marquee and consultation phrases advanced in normal motion mode at 390 × 844, 360 × 800, and 1366 × 768. The World Map played in view and paused offscreen. All 14 project cards were present. Once the page settled, strip sizes and document height matched the pre-trial control at all three sizes. The largest position difference was 0.02 CSS px at 390 px. There was zero horizontal overflow and Chrome recorded zero console or runtime errors.

The two performance reports are untracked in the repository. The raw restoration traces (`control-390-11.trace.json` and `control-360-11.trace.json`), screenshots and browser results (`visual-resumed-settled.json`) are in `E:\JavaScript\sparklab-initial-rendering`, outside the Git repository. The existing tracked `.footer-*` artifacts and generated `.next` diagnostics were left in place.

## Cold-cache comparison method

Lighthouse 13.6.0 used Chrome 157.0.8103.79. The production tests ran against the local Next.js server. Each navigation used a fresh profile. At 390 × 844 and 1366 × 768, the control is the saved current-build data from the [baseline comparison](PERFORMANCE_BASELINE_COMPARISON.md). I repeated the same configuration on the new build. Mobile used DPR 1.75, 4× CPU slowdown and Lighthouse’s DevTools Slow 4G shaping. Desktop used DPR 1, 1× CPU, 40 ms request latency and 10,240 kbps in both directions.

Four of five 360 × 800 DevTools control attempts reported `NO_TTI_CPU_IDLE_PERIOD`. I retained those reports and used fresh 360 px control and candidate batches with Lighthouse’s simulated Slow 4G settings for the comparison at that width. The two 360 px arms use the same method. Compare the results within each width and method. The isolated layout experiment above is a separate measurement from Lighthouse.

## Cold-cache production results

Each cell shows median [minimum–maximum]. Phase labels compare the existing current build against the trial. `Largest pre-paint Layout` measures the single largest `Layout` event before first contentful paint. Style/layout plus rendering and main-thread work cover the full Lighthouse observation window. Two saved 390 px control samples and one desktop control sample include raw traces. All other comparisons use three raw traces per arm. The 390 px trial had one incomplete result, excluded from the medians.

| Metric | 390 × 844 control (n=6) | 390 × 844 trial (n=3) | 360 × 800 control (n=3) | 360 × 800 trial (n=3) | 1366 × 768 control (n=3) | 1366 × 768 trial (n=3) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Performance score | 83.5 [78–88] | 81 [77–82] | 95 [87–95] | 89 [87–96] | 97 [96–97] | 96 [96–97] |
| Largest pre-paint Layout, wall ms | 633 [606–660] | 574 [481–688] | 160 [155–167] | 152 [151–154] | 166 | 161 [154–164] |
| Largest pre-paint Layout, renderer CPU ms | 155 [149–161] | 166 [156–173] | 148 [142–152] | 137 [132–140] | 139 | 146 [141–147] |
| Dirty objects in that layout | 934 | 790 | 934 | 790 | 949 | 949 |
| Style/layout plus rendering, ms | 4,049 [3,942–4,553] | 4,004 [3,853–4,058] | 2,272 [2,053–2,338] | 2,115 [2,010–2,268] | 1,484 [1,254–1,664] | 1,268 [1,244–1,300] |
| Total main-thread work, ms | 10,733 [10,094–11,911] | 10,765 [10,441–11,076] | 5,223 [4,792–5,291] | 5,197 [5,037–5,398] | 3,818 [3,269–4,037] | 3,250 [3,245–3,271] |
| JavaScript evaluation plus parse/compile, ms | 1,114 [661–1,363] | 1,354 [1,258–1,429] | 1,081 [1,052–1,100] | 1,204 [1,112–1,389] | 613 [560–650] | 561 [553–564] |
| Total Blocking Time, ms | 332 [217–533] | 404 [394–529] | 241 [236–500] | 436 [230–495] | 30 [22–32] | 19 [14–20] |
| Largest Contentful Paint, ms | 2,735 [2,710–2,875] | 2,797 [2,667–2,841] | 1,324 [1,222–1,381] | 1,220 [1,218–1,350] | 960 [941–993] | 983 [943–994] |
| Cumulative Layout Shift | 0 [0–0.0013] | 0 | 0 | 0 | 0 | 0 |
| Tasks longer than 50 ms | 11 [4–14] | 12 [9–13] | 2 | 2 | 4 [3–4] | 3 |
| Longest main-thread task, ms | 802 [759–871] | 834 [655–899] | 412 [410–423] | 397 [380–400] | 200 [198–215] | 206 [202–213] |

All three valid 390 px trial traces had a second full-document layout covering 295 dirty objects after first paint. It used 30–31 ms of renderer CPU and 78–124 ms of wall time. The comparable second layout in the saved control trace covered 147 dirty objects, took 8 ms of CPU and 31 ms wall time. The first-layout reduction was real. The extra work later in the navigation and the higher median TBT at both mobile widths prevented the candidate from demonstrating a useful end-to-end improvement. Lighthouse scores and timings also varied with host contention. The desktop score stayed within its prior range of 96–97.

I repeated the comparison on the same compiled trial build with the CSS rule toggled at the response. JavaScript ran normally and the browser remained at scroll position zero. The larger second layout followed the rule at both widths.

| Same-build probe | Original visible rule | Trial auto rule |
| --- | ---: | ---: |
| 390 px, two samples per arm | 147 objects, 10.85–11.06 ms CPU | 295 objects, 30.29–38.75 ms CPU |
| 360 px, one sample per arm | 147 objects, 13.34 ms CPU | 295 objects, 29.01 ms CPU |

The instrumented browser reported both trial subtrees as initially skipped. The second layout occurred before any scroll. The trace establishes the repeatable extra layout work under the trial rule. It does not assign all of the Lighthouse blocking difference to this work or identify which lifecycle operation forced the document-wide pass.

## Remaining work

The browser still performs a full initial layout for much of the document. The next optimization should isolate the post-hydration document layout trigger with an invalidation and stack trace on a physical mid-range Android phone. If it resolves to a synchronous measurement of offscreen content, move that measurement to the relevant section’s existing visibility gate, then compare whole-navigation blocking time. Preserve natural scrolling, section heights and keyboard access. CSS selector matching, the larger Flight payload and the map have no isolated evidence of a larger fixable cost in this investigation.

Raw Blink traces, Lighthouse reports, screenshots and test scripts are in `E:\JavaScript\sparklab-initial-rendering`. The paired-rule results are in `visibility.log`, and the aggregated cold navigation samples are in `cold-sample-summary.json`. The historical controls remain in `E:\JavaScript\sparklab-phase5-diagnostics\controlled`.
