# SparkLab performance baseline comparison

## Result

- **Mobile was effectively tied overall.** The median scores were 84 and 83.5. The current build painted its largest element about 56 ms sooner at the median. Median Total Blocking Time rose about 24 ms, and JavaScript evaluation plus parse/compile rose about 50 ms. The timing ranges overlap substantially. Using only complete matched rounds 2–6 gives scores of 84 → 82 and TBT of 307 → 390 ms. The mobile blocking signal merits investigation, and the run-to-run variability limits attribution.
- **Desktop improved.** The median score rose from 87 to 97 and TBT fell from 245 to 30 ms. All three current desktop TBT results beat all three baseline results. Desktop layout and Voice Prompt idle tasks appear separately in the traces.
- **The gallery trade-off is visible in bytes and inline script work.** The current build transferred 5.19 KiB less startup JavaScript and 1.62 KiB more HTML. Both builds render all 14 cards. In the two saved mobile traces, inline scripts that carry gallery data accounted for 2.45–3.21 ms of renderer CPU time. This comparison does not establish a page-level timing effect from those scripts or the seven fewer initial gallery nodes.

## Environment and build identity

| Build | Local URL | Next.js production build ID | Prerendered HTML |
| --- | --- | --- | ---: |
| Previous baseline, existing benchmark fixture | http://localhost:3198/ | `6DXux7zp614rXU9-SjpN1` | 221,229 bytes |
| Current optimized build, working project | http://localhost:3197/ | `Dst8Qs_2TTaxQLw6EhB5c` | 237,101 bytes |

Both homepages returned HTTP 200 and matched their respective `.next/server/app/index.html` files byte for byte. Both servers ran Next.js 16.4.6 using `next start`. The baseline fixture’s gallery source matches the pre-change gallery in Git. The current build contains the deferred gallery and Voice Prompt changes.

The host ran Windows 11 Pro build 26200 on an AMD Ryzen 5 4500U with six logical processors and approximately 15.4 GiB of visible RAM. The benchmark used Node 24.11.0, headless Chrome 157.0.8103.79, and Lighthouse 13.6.0. The [original audit](SEO_GEO_PERFORMANCE_AUDIT.md) provides historical context.

- **Mobile timing.** 390 × 844 CSS pixels, Lighthouse’s Moto G Power (2022) user agent and emulation, DPR 1.75, 4× CPU slowdown, and the Lighthouse DevTools Slow 4G profile of 562.5 ms request latency, 1,474.56 kbps down and 675 kbps up.
- **Desktop timing.** 1366 × 768 CSS pixels, desktop emulation, DPR 1, 1× CPU, 40 ms request latency and 10,240 kbps in both directions.
- **Cache and order.** Each navigation ran in a fresh Chrome profile. The first build alternated by round. Responsive and functional probes ran separately from Lighthouse. Pilot runs with different emulation and throttling settings are excluded. All reported Lighthouse timings use cold browser caches. The two local servers bypass the production CDN.
- **Host variability.** Pre-run CPU usage ranged from 37% to 100%. Free RAM ranged from 1.37 to 4.21 GiB. C: had 6.90–10.47 GiB free during the run and E: had 45.84–47.52 GiB free. Background applications stayed running. Treat these as load snapshots, since CPU activity also changes during a run.

## Repeated cold-cache Lighthouse results

Each comparison cell shows median [minimum–maximum]. Single values agree across valid samples at the shown precision. Lighthouse transfer includes response overhead. The longest task and total main-thread duration cover the full observation window. Total Blocking Time measures time within its scoring window. Static markup and Flight sizes apply to every sample of the corresponding build.

| Metric | mobile baseline (n=5) | mobile current (n=6) | desktop baseline (n=3) | desktop current (n=3) |
| --- | ---: | ---: | ---: | ---: |
| Score | 84 [70–91] | 83.5 [78–88] | 87 [78–93] | 97 [96–97] |
| FCP (ms) | 2792 [2704–3375] | 2735 [2710–2875] | 1008 [913–1085] | 960 [941–993] |
| LCP (ms) | 2792 [2704–3375] | 2735 [2710–2875] | 1008 [913–1085] | 960 [941–993] |
| TBT (ms) | 307 [101–573] | 332 [217–533] | 245 [171–385] | 30 [22–32] |
| Speed Index (ms) | 3002 [2945–3704] | 2986 [2951–3042] | 1337 [1242–1489] | 1287 [1282–1335] |
| CLS | 0.000 [0.000–0.001] | 0.000 [0.000–0.001] | 0.000 | 0.000 |
| JS evaluation and parse/compile (ms) | 1064 [896–1515] | 1114 [661–1363] | 882 [609–1024] | 613 [560–650] |
| Main-thread work (ms) | 10642 [10113–13276] | 10733 [10094–11911] | 4472 [3115–4767] | 3818 [3269–4037] |
| Long tasks > 50 ms | 10 [8–12] | 11 [4–14] | 3 | 4 [3–4] |
| Longest task (ms) | 855 [761–1266] | 802 [759–871] | 295 [221–435] | 200 [198–215] |
| Startup JS transferred (KiB) | 256.04 | 250.85 | 256.04 | 250.85 |
| Document transferred (KiB) | 61.82 | 63.44 | 61.82 | 63.44 |
| Embedded RSC scripts (raw KiB) | 78.86 | 96.83 | 78.86 | 96.83 |
| Initial HTML elements | 688 | 690 | 688 | 690 |
| Lighthouse live elements | 648 | 650 | 648 | 650 |
| Initial gallery elements | 140 | 133 | 140 | 133 |
| Initial img tags | 29 | 28 | 29 | 28 |
| Initial gallery img tags | 19 | 18 | 19 | 18 |

### Mobile, 390 × 844

| Attempt | Score | FCP ms | LCP ms | TBT ms | SI ms | CLS | JS ms | Main ms | Long tasks | Max ms | JS KiB | HTML KiB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline 1* | — | 3007 | 3007 | — | 3208 | 0.000 | 904 | 10166 | 11 | 1037 | 256.04 | 61.82 |
| baseline 2 | 70 | 3375 | 3375 | 573 | 3704 | 0.001 | 1515 | 13276 | 12 | 1266 | 256.04 | 61.82 |
| baseline 3 | 91 | 2773 | 2773 | 101 | 2986 | 0.000 | 896 | 10113 | 11 | 761 | 256.04 | 61.82 |
| baseline 4 | 87 | 2704 | 2704 | 242 | 2945 | 0.000 | 1064 | 10438 | 10 | 806 | 256.04 | 61.82 |
| baseline 5 | 84 | 2792 | 2792 | 310 | 3044 | 0.000 | 1175 | 10642 | 9 | 855 | 256.04 | 61.82 |
| baseline 6 | 84 | 2796 | 2796 | 307 | 3002 | 0.000 | 923 | 10757 | 8 | 863 | 256.04 | 61.82 |
| current 1 | 88 | 2772 | 2772 | 217 | 2978 | 0.000 | 936 | 10094 | 11 | 838 | 250.85 | 63.44 |
| current 2 | 85 | 2875 | 2875 | 250 | 3042 | 0.000 | 661 | 10927 | 4 | 871 | 250.85 | 63.44 |
| current 3 | 82 | 2718 | 2718 | 390 | 2968 | 0.000 | 1136 | 10693 | 11 | 759 | 250.85 | 63.44 |
| current 4 | 86 | 2710 | 2710 | 273 | 2951 | 0.000 | 1091 | 10313 | 10 | 788 | 250.85 | 63.44 |
| current 5 | 78 | 2722 | 2722 | 533 | 2994 | 0.001 | 1363 | 11911 | 13 | 816 | 250.85 | 63.44 |
| current 6 | 80 | 2749 | 2749 | 433 | 3006 | 0.001 | 1195 | 10772 | 14 | 766 | 250.85 | 63.44 |


### Desktop, 1366 × 768

| Attempt | Score | FCP ms | LCP ms | TBT ms | SI ms | CLS | JS ms | Main ms | Long tasks | Max ms | JS KiB | HTML KiB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline 1 | 87 | 1008 | 1008 | 245 | 1337 | 0.000 | 882 | 4767 | 3 | 295 | 256.04 | 61.82 |
| baseline 2 | 78 | 1085 | 1085 | 385 | 1489 | 0.000 | 1024 | 4472 | 3 | 435 | 256.04 | 61.82 |
| baseline 3 | 93 | 913 | 913 | 171 | 1242 | 0.000 | 609 | 3115 | 3 | 221 | 256.04 | 61.82 |
| current 1 | 97 | 960 | 960 | 32 | 1282 | 0.000 | 650 | 4037 | 3 | 215 | 250.85 | 63.44 |
| current 2 | 96 | 993 | 993 | 30 | 1335 | 0.000 | 613 | 3818 | 4 | 198 | 250.85 | 63.44 |
| current 3 | 97 | 941 | 941 | 22 | 1287 | 0.000 | 560 | 3269 | 4 | 200 | 250.85 | 63.44 |


\* Baseline attempt 1 reported `NO_TTI_CPU_IDLE_PERIOD`. Its partial readings are shown above and excluded from medians. An extra alternating round supplied the fifth complete baseline result. The current build’s sixth valid result stays in the pooled comparison.

### Supplemental startup diagnostics

| Mobile metric | Baseline | Current |
| --- | ---: | ---: |
| Style/layout plus rendering (ms) | 3998 [3884–4994] | 4049 [3942–4553] |
| Lighthouse parse HTML (ms) | 65 [62–81] | 76 [69–85] |
| Estimated render-blocking savings (ms) | 871 [861–871] | 871 [861–880] |
| Script evaluation attributed to shared React chunk (ms) | 662 [497–901] | 650 [268–860] |

## Gallery DOM and RSC payload

1. **The DOM change is eight fewer effect elements plus one new gallery wrapper.** ILUF, Echo and Payland each replace a three-element tilt shell with one placeholder. Their extra transform layer and glare overlay move to the interactive phase, saving six elements. Huse’s rear depth layer and decorative duplicate image account for two more. One new `DeferredProjectGrid` wrapper gives the net reduction of seven. The full initial HTML has two additional elements because nine additional Flight scripts offset that reduction.
2. **All 14 project entries remain in the initial HTML.** The baseline embeds 19 lazy gallery image tags for 14 distinct art URLs. The current build embeds 18 lazy image tags for the same 14 URLs. The omitted Huse image is the decorative second copy of its foreground artwork. Both builds defer image requests until the gallery approaches the viewport. The current build also defers its interaction module, loading it as the grid approaches or receives input. [Gallery layout](src/app/components/ProjectGalleryLayout.tsx) · [Deferred grid](src/app/components/DeferredProjectGrid.tsx) · [Interactive effects](src/app/components/ProjectGalleryEffects.tsx)
3. **The new server-rendered children account for most of the Flight increase.** Inline script text containing `self.__next_f` grew from 80,757 to 99,154 bytes, up 18,397 bytes. Decoded Flight text grew from 76,145 to 92,223 bytes. The baseline’s eager Client Component owns the grid. The current Server Component passes the rendered grid into `DeferredProjectGrid`, so the document includes the HTML and Flight data for the children, props and responsive image URLs. Eleven new Flight records with gallery-specific attributes or artwork URLs total about 15.9 KB before record delimiters. Some of those records also contain adjacent content.
4. **The complete document response grew by 1,663 gzip body bytes.** Direct HTTP requests with gzip returned 62,783 bytes for the baseline and 64,446 bytes for current. Lighthouse network transfer figures include response overhead. Flight travels inside the same compressed document in these navigations. There is no independently transferred Flight response to time.

### Direct measurement of Flight script evaluation

Trace URL, line and column positions match the literal inline scripts in the served HTML. This ties the evaluation events to the Flight script tags before later React work. CPU time uses the renderer thread’s `tdur`; wall time also includes waits and scheduling.

| Trace pair | All Flight scripts, CPU ms, baseline → current | All Flight scripts, wall ms, baseline → current | Current tags carrying gallery data, CPU ms |
| --- | ---: | ---: | ---: |
| Mobile attempt 1, baseline score incomplete | 3.55 → 20.14 | 4.17 → 68.47 | 2.45 |
| Mobile attempt 3 | 3.69 → 21.73 | 7.51 → 87.66 | 3.21 |
| Desktop attempt 1 | 3.95 → 4.32 | 4.61 → 4.58 | 0.81 |

Eight current inline tags carried gallery data. Some of those tags also carried other records. Those tags account for a small share of the observed mobile difference in all Flight script evaluation. The direct measurement covers inline evaluation only. It cannot isolate the impact of added bytes on later Flight decoding, hydration, or the overall page score.

## Startup waterfall and main-thread bottlenecks

The direct path from HTML to two render-blocking stylesheets is still present in both builds. Lighthouse put median mobile blocking savings at about 871 ms in both. No sampled startup requested gallery images, the Cal.com embed, or a webfont. The LCP node was the Services overview heading at 390 × 844 and the Hero headline at 1366 × 768 for both builds. The largest repeated attributable mobile task was initial document layout, usually with style tree recalculation in the same task. Combined style/layout and rendering was about 4 seconds of aggregate wall duration in the mobile runs. The shared React renderer/scheduler was the clearest repeated JavaScript cost. Its aggregate scripting attribution was 662 → 650 ms at the median, while individual callbacks varied.

| Matched trace event | Mobile baseline, attempt 3 | Mobile current, attempt 3 | Desktop baseline, attempt 1 | Desktop current, attempt 1 |
| --- | ---: | ---: | ---: | ---: |
| First large document task | 761 ms | 759 ms | 238 ms | 215 ms |
| Layout within that task | 636 ms | 606 ms | 185 ms | 166 ms |
| Style tree update within that task | 115 ms | 111 ms | 39 ms | 36 ms |
| Next runtime evaluation, `1hy9p0hfrq0w2.js` | 114 ms | 195 ms | 4 ms | 5 ms |
| React renderer evaluation, `0tmq4ua_7wdbm.js` | 6 ms | 21 ms | 68 ms | 61 ms |
| Largest React renderer/scheduler callback | 92 ms | 105 ms | 23 ms | 31 ms |
| Largest Motion callback, `3psbbaglack35.js` | 42 ms | 63 ms | 12 ms | 13 ms |
| Voice Prompt WebGL initialization idle task | — | — | 295 ms | 82 ms |

- **Layout.** The paired mobile document tasks start at roughly 1.53 and 1.56 seconds after navigation, ahead of first paint. They contain layout, style, paint and layer work. The trace identifies no component or JavaScript initiator for that layout. A single section’s share cannot be inferred from document-wide timings.
- **Next runtime and hydration.** Mobile attempt 3 shows Next’s evaluation task at 2.34 → 2.82 seconds. Nested events include microtask work, so the measured task is larger than script compilation alone. The runtime file hash is unchanged. The minified traces identify framework and Motion callbacks. They cannot identify a specific gallery or Hero component as the cause of those callbacks.
- **Voice and shaders.** The desktop idle callback starts around 1.06 seconds in the baseline and 1.01 seconds in current. Its called function maps to the compiled Voice Prompt WebGL setup in `10yz75i3a8ckq.js` and `3wjjznkg-ibuw.js`, respectively. The current path can poll the parallel shader extension. The trace measures the main-thread callback, which includes setup work. GPU compilation time is a separate quantity. [Voice Prompt](src/app/components/motion-brew/voice-prompt.tsx)
- **Unattributed tasks.** Two current mobile traces have 388–392 ms of wall time just after the initial layout, with no nested component event and about 0.7 ms of renderer thread CPU time. The trace does not establish a cause. These tasks are retained in the Lighthouse measurements.
- **Gallery and Flight.** Lighthouse’s document-wide HTML parse bucket moved from a 65 ms median to 76 ms. The large initial layout task was nearly unchanged in the paired trace. The current gallery’s interactive module loads after initial navigation. The data establishes some extra early script work from the tags carrying Flight, while a separate cost for gallery hydration remains unresolved.
- **World Map, workflow and footer.** The map’s inline SVG is present during initial render, and the browser checks below exercise its visibility gate. GSAP/ScrollTrigger initialize near the workflow on desktop. The mobile workflow uses natural flow. The Globe and Particle Card initialize at the footer. No initial long task in these traces could be assigned to those individual effects. [Map](src/app/components/MapMotion.tsx) · [Workflow](src/app/components/WorkflowMotion.tsx) · [Footer effects](src/app/components/FooterEffects.tsx)

Trace durations are wall-clock measurements. Nested events overlap and must be compared individually.

## Browser interaction verification

The tests below ran on both local production builds in desktop Chrome with desktop or mobile touch emulation. The browsers used software WebGL and a simulated microphone. These checks verify feature operation under emulation. Physical-device frame pacing and the public deployment were outside this comparison.

| Check | 390 × 844 | 360 × 800 | 1366 × 768 |
| --- | --- | --- | --- |
| Selected Work artwork and controls | 14 of 14 on both | 14 of 14 on both | 14 of 14 on both |
| Gallery geometry | Identical | Identical | Identical |
| Voice Prompt | Pass on both | Pass on both | Pass on both |
| World Map visibility and pause | Pass on both | Pass on both | Pass on both |
| Four workflow cards | Natural flow, pass on both | Natural flow, pass on both | Forward/reverse stack, pass on both |
| Footer Globe and Particle Card | Pass on both | Pass on both | Pass on both |
| Keyboard navigation | Pass on both | Pass on both | Pass on both |
| Hero Cal.com popup | Touch open, close and reopen on both | Outside this probe | Mouse open, close and reopen on both |
| Contact Slide Commit Cal.com popup | Touch slide, close and reopen on both | Outside this probe | Mouse slide, close and reopen on both |
| Horizontal overflow | 0 px on both | 0 px on both | 0 px on both |

- **Gallery.** Both builds matched all 14 ordered project IDs, names, categories and card bounds at the three tested widths. Matched resting screenshots confirm the visual layout. Each project displayed artwork via its image or WebGL canvas. Input checks exercised the toggle cards, both DuoFlip views and Rivora’s focusable control. Desktop keyboard input also toggled ILUF with Space. The current gallery effects chunk was absent during initial load and present after approaching the gallery.
- **Voice and map.** The Voice Prompt entered listening mode, retained sample text and confirmed local preview submission on both builds. Mobile created no startup WebGL context in the browser probes. A Voice WebGL context appeared after tapping Talk. Desktop created one Voice context during initial idle time. The map played in view and paused after scrolling away.
- **Workflow and footer.** All four cards and their deferred visuals were reachable on both mobile widths. Desktop traversed cards 01 to 04 and back. The footer mounted the WebGL globe and the 2D particle canvas after scrolling into view.
- **Booking and errors.** The Hero button and the Contact Slide Commit each opened the Cal.com iframe. The modal stayed visible for at least 2.2 seconds, closed on demand and reopened with one modal instance. The second Contact slide followed the component’s return to its idle state after the success animation. Booking availability and booking submission were outside the test. The probes captured no application runtime or hydration exceptions.

## Recommended next fixes

1. **Reduce the initial document’s layout and paint work. High impact, medium risk.** Profile the Hero SVG and decorative layers individually, then check above-the-fold layout invalidation. Use geometry and screenshot comparisons to preserve the design and verify scroll behavior at 390 and 360 CSS pixels.
2. **Reduce eager client evaluation and hydration. Medium to high impact, medium risk.** Profile eager Hero and booking/Voice Motion consumers individually. Use Server Components for static shells and defer interaction-only code where the first input can still be handled promptly. Preserve keyboard access and the existing Voice Prompt shader deferral.
3. **Trim the two render-blocking CSS responses. Medium impact, low to medium risk.** Use route coverage and responsive screenshots before moving unused initial-route rules. Keep gallery serialization as a separate experiment so its effects can be measured independently.

## Artifacts and scope

Raw Lighthouse reports, Chrome traces, DevTools network logs, host samples and browser probes are under `E:\JavaScript\sparklab-phase5-diagnostics\controlled`. The final interaction evidence is in `browser-verified.json`, `gallery-confirmation.json`, `voice-confirmation.json`, and `booking-contact-confirmed.json`. The resumed verification reused the saved Lighthouse samples and both existing production artifacts. Git status shows the same pre-existing source changes as before the investigation. All six pre-existing modified or untracked source files also match their SHA-256 hashes from before the final browser checks. The report is the only repository change made during this investigation. Both local production servers were serving their original build IDs at the end of verification.
