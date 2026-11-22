# SparkLab Network Dependency Tree audit

**The confirmed critical chain is the home document → two parallel stylesheets.** The largest measured startup opportunity is to reduce the CSS bytes needed before paint while keeping the full initial visual state intact. The trace also identifies a smaller, more targeted opportunity to keep the Contact slider out of the Hero’s booking dependency. Work below the fold is already mostly deferred.

## Method and scope

Lighthouse 13.6.0 and Chrome 157 audited local production build `k3WlyLPw3Xo-QuaOeCBD7` using the existing Next.js 16.4.6 App Router build. Each cold Lighthouse run used the same DevTools network and CPU settings at 390 × 844, 360 × 800, and 1366 × 768. The profile used 562.5 ms request latency, 1,474.56 kbps down, 675 kbps up, and 4× CPU slowdown. Mobile used touch emulation and DPR 1.75. Desktop used DPR 1. The separate CDP interaction runs used the same latency, throughput and CPU settings across widths. Numbers are local lab measurements. The local server uses HTTP/1.1. A direct public-origin compression check failed during TLS negotiation, so this report does not infer current CDN compression or connection behavior from localhost.

## Critical request chain

```text
GET /  (HTML; CSS links discovered while the response was streaming)
  ├─ /_next/static/chunks/1jwten43fvoj8.css  (parser initiated, render-blocking)
  └─ /_next/static/chunks/12jhbb0fh3j9c.css  (parser initiated, render-blocking)
```

Lighthouse’s longest chain was **1,505 ms**, **1,505 ms**, and **1,527 ms** at the three widths. Both stylesheets were classified as `blocking` and `VeryHigh` by Chrome. Together they transferred **31,152 bytes**. Discovery was nearly simultaneous. Neither stylesheet was requested by the other, and the browser started both before the document finished. There was no sequential font, image, or third-party dependency on the paint-critical chain.

`1jwten43fvoj8.css` includes Tailwind output and [globals.css](src/app/globals.css) rules for the Hero, map, navigation and service overview. `12jhbb0fh3j9c.css` includes initial Voice Prompt placement and component CSS for the SEO gallery, Selected Work, Contact, FAQ and footer. Both files contain first-viewport rules. Chrome also downloaded the navbar brand image through Next Image’s responsive preload, but marked it low priority and outside the render-blocking chain. The startup waterfall shows a single 256w logo request, 6,207 bytes transferred. The inline World Map SVG and path are emitted by [page.tsx](src/app/page.tsx), with map visibility handled by [MapMotion.tsx](src/app/components/MapMotion.tsx). The map has no independent image or data request. The site uses system fonts, and neither the waterfall nor the runtime probe found a font request.

### Initial request ledger

Start and duration are in milliseconds from the Lighthouse request data, rounded to the nearest millisecond. Transfer counts are the same across the three runs. The document is the root required to render the page. “Blocks render” applies to subresources. A client-runtime role means the chunk supports client startup or interaction, and some such chunks also contain deferred section entry points. URLs without the host use `/_next/static/chunks/` for fingerprinted files.

| Resource | Initiator | 390 start / duration | 360 start / duration | 1366 start / duration | Transfer bytes | Blocks render | Initial viewport role |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| `/` | Navigation | 3 / 1005 | 2 / 927 | 1 / 984 | 64,965 | No | Yes |
| `Navbar logo, Next Image w=256` | HTML responsive preload | 616 / 743 | 640 / 714 | 665 / 694 | 6,207 | No | Brand only |
| `1jwten43fvoj8.css` | HTML stylesheet link | 622 / 870 | 646 / 849 | 670 / 848 | 19,353 | Yes | Yes |
| `12jhbb0fh3j9c.css` | HTML stylesheet link | 622 / 838 | 648 / 816 | 673 / 797 | 11,799 | Yes | Yes |
| `3be5ypa669k_3.js` | HTML script preload | 622 / 688 | 672 / 674 | 687 / 672 | 4,136 | No | Framework error UI, no normal viewport role |
| `44bax-4eob5k0.js` | HTML async script | 622 / 802 | 672 / 754 | 687 / 751 | 7,957 | No | Shared runtime and helpers |
| `0tmq4ua_7wdbm.js` | HTML async script | 623 / 1743 | 672 / 1220 | 687 / 1321 | 72,143 | No | App bootstrap and React hydration |
| `1hy9p0hfrq0w2.js` | HTML async script | 1310 / 1121 | 1346 / 957 | 1359 / 968 | 45,720 | No | App Router navigation and Flight |
| `turbopack-2u1d16houkiyo.js` | HTML async script | 1359 / 643 | 1354 / 618 | 1359 / 633 | 4,301 | No | Turbopack runtime |
| `1qjrsp_gj1rjz.js` | HTML async script | 1424 / 657 | 1426 / 625 | 1439 / 632 | 3,999 | No | Router helpers and cache |
| `2u1_gqwd4nbtx.js` | HTML async script | 1460 / 590 | 1464 / 586 | 1470 / 586 | 1,229 | No | Dynamic-import registrations |
| `0cwmk_h872d6v.js` | HTML async script | 1492 / 762 | 1495 / 696 | 1518 / 696 | 11,810 | No | Hero booking plus Contact slider |
| `2-q_2xkzroq1p.js` | HTML async script | 2002 / 689 | 1892 / 668 | 1993 / 730 | 11,774 | No | Navbar client code and shared UI |
| `3psbbaglack35.js` | HTML async script | 2050 / 1062 | 1972 / 988 | 2009 / 1137 | 32,196 | No | Shared Motion runtime |
| `35kzc7w2-was5.js` | HTML async script | 2081 / 1033 | 2050 / 1012 | 2056 / 1089 | 28,584 | No | Shared Motion modules |
| `3wjjznkg-ibuw.js` | HTML async script | 2254 / 935 | 2051 / 991 | 2071 / 1027 | 25,468 | No | Hero Voice, map gate and deferred-section shells |
| `32ruq2cjkf5p5.js` | HTML async script | 2366 / 776 | 2192 / 748 | 2215 / 756 | 7,555 | No | Shared Motion modules |
| `sparklab-icon-clear.svg` | HTML icon, browser | 3730 / 594 | 3551 / 588 | 3761 / 593 | 1,507 | No | No, browser chrome |
| `sparklab-icon-clear.svg` | HTML icon, browser | 4374 / 584 | 4190 / 584 | 4424 / 594 | 243 | No | No, browser chrome |

There were 13 initial script responses totaling **256,872 bytes** across each run. Their requests were discovered by the HTML parser or preload. Later on-wire starts do not establish static JavaScript dependency edges. For example, at 390 px the parser discovered the App Router chunk near 616 ms and the request went on the wire near 1,310 ms. This is local connection scheduling under throttling. The renderer bootstrap and App Router runtime are necessary to hydrate the page and enable navigation. The Hero booking handler, menu, map motion control, Voice Prompt and shared Motion runtime need their initial client path. In contrast, the Contact slider implementation is carried by the Hero booking bundle because [CalBookingButton.tsx](src/app/components/CalBookingButton.tsx) imports both `SlideCommit` and `MagneticButton`. The build also includes an early 4,136-byte low-priority framework preload, `3be5ypa669k_3.js`, containing error UI. There is no validated safe application-level override for that generated preload.

## Loading after startup

Representative 390 px CDP requests are shown below. Timing is relative to the staged navigation, after the scripted pauses, so it describes the dependency order rather than the cost of a normal homepage load. For scrolling stages, observers can activate an adjacent section before it is centered. The raw ledger preserves all request timings and initiators.

| Trigger | Request or group | Initiator | Start / duration (ms) | Bytes | Initial viewport / render blocking |
| --- | --- | --- | ---: | ---: | --- |
| Scroll to service video | `/creative-loop.mp4` | `<video>` source attached by `OverviewVideo`’s visibility hook | 10,118 / interrupted | — | No / no |
| Workflow approaches | `1blod4h7dg_2_.js` | Turbopack dynamic import from the workflow visual | 13,629 / 790 | 9,870 | No / no |
| Workflow approaches | `394ceu8hxos50.js` and `42-moa73v9mwk.js` | Turbopack dependency fan-out | 13,633 / 1,061 and 13,634 / 959 | 27,854 + 20,999 | No / no |
| Showreel enters proximity | `/card5.mp4` | Visibility-gated video element | 17,594 / interrupted | — | No / no |
| SEO / Selected Work proximity | `1-ksuhahfx9pv.js`, gallery effects | `DeferredProjectGrid` → Turbopack | 17,604 / 2,983 | 6,465 | No / no |
| Gallery effects mount | `1jo9fvwcfzg8j.js` and `2r-50xc6aop0b.js` | Deferred effect imports → Turbopack | 20,632 / 806 and 20,647 / 815 | 9,787 + 9,640 | No / no |
| Footer approaches | `0wbd-s-x0w5jj.js`, Globe dependency | `FooterEffects` → Turbopack | 25,965 / 2,815 | 143,735 | No / no |
| Hero booking tap | `https://app.cal.com/embed/embed.js` | `CalBookingButton` injects the script on demand | 30,761 / 959 | 26,573 | No / no |
| Embed runtime ready | `https://app.cal.com/spark-lab-ufwtr2/30min/embed` | `embed.js` creates the booking iframe | 31,770 / unfinished at capture | — | No / no |

Both video requests returned HTTP 206 and were interrupted during the scrolling probe. Their completed-request byte totals are unavailable. Native lazy images and the SEO gallery artwork started around their sections. All 14 Selected Work projects were already present in HTML, and their images and effect chunks did not transfer during initial navigation. Some effect dependencies loaded one step later, after the first effect module executed. The 650 px Selected Work observer explained why effects started while the nearby SEO section was centered. Desktop additionally loaded the ScrollTrigger path during the workflow stage (`2p2jd75im6m_h.js`, 17,892 bytes in the desktop probe). Mobile retained the in-flow workflow and skipped that desktop-only request. Both footer effects remained off the startup waterfall. The booking popup opened on click or touch, and the provider script and iframe sequence was absent before intent. [Workflow](src/app/components/WorkflowMotion.tsx) · [Gallery](src/app/components/DeferredProjectGrid.tsx) · [Footer effects](src/app/components/FooterEffects.tsx) · [Video visibility](src/app/components/useViewportVideo.ts)

## Route prefetch findings

The current navbar strategy works. The initial Lighthouse and staged runs recorded no `_rsc` prefetch at any width. Desktop pointer hover on Services produced two prefetch RSC responses, then two route chunks, totaling 25,559 bytes. Tab focus on About produced two prefetch RSC responses totaling 3,604 bytes. Opening and closing the mobile menu generated no request. The Services link navigated successfully at all three widths. `SiteNav` sets `prefetch={false}` on its links and calls `router.prefetch()` only on mouse entry or keyboard-visible focus. [SiteNav.tsx](src/app/components/SiteNav.tsx) · [Next.js prefetching](https://nextjs.org/docs/app/guides/prefetching)

The footer still uses default `Link` prefetch. After the footer entered view on the 390 px run, seven RSC prefetch responses totaling 14,551 bytes and three downstream route JS chunks totaling 22,319 bytes shared the loading window with the Globe and Particle Card. `/services?_rsc` first returned its 627-byte response in 578 ms, followed by the 5,829-byte response in 685 ms and the two Services chunks. The desktop trace had less footer prefetch traffic because Services and About had already been warmed by the earlier intent steps. The footer work is deferred. It does not explain the startup Lighthouse warning.

## Safe opportunities, ranked by impact

1. **Reduce the HTML → CSS paint-critical payload.** This is the highest-impact startup candidate because the chain gates first paint at every viewport. Start by identifying superseded global rules and the below-fold components contributing to the initial component stylesheet. Prototype only a supported, route-scoped change and measure the last blocking response on the same profile. Preserve the layout and styling rules needed by SSR content and keep the Hero and Voice Prompt CSS early. Deferring either entire stylesheet or combining them just to remove a request is unsupported by this waterfall. Risks include cascade changes, flash of unstyled content, and layout shift. The current 31,152-byte CSS transfer and 1.505–1.527 s chain are baselines, not expected savings.
2. **Separate the below-fold Contact slider from the shared booking wrapper.** The Hero requires the popup loader and magnetic CTA. Its initial `0cwmk_h872d6v.js` also carries a 13,290-byte compiled Slide Commit implementation. Recompressing that chunk with only the slider module body substituted in memory reduced gzip size by approximately **4,979 bytes**. That measures a payload opportunity, not the gain from a future build. Any approved split should preserve the slider’s SSR footprint, keyboard and touch operation, first drag, and the same booking popup. Independent startup work should remain in the existing Hero branch.
3. **Consider intent-based prefetch for the footer only.** The cold mobile footer transferred about **37 KB** of route prefetch while effect code loaded. An intent-gated footer experiment could reduce competition if slow-device tests show a delay in the visible Globe or Particle Card. Preserve the working navbar strategy. The tradeoff is a colder first tap on a footer link. This is a scroll-time opportunity with no measured startup benefit.

Additional evidence: the local HTML includes the same 52,297-byte World Map path in the SVG and embedded Flight data. Removing only the second copy in memory reduced gzip by 22,596 bytes and Brotli by 25 bytes. This is a compression diagnostic, not a proposal to strip Flight data or move the map to a separate request. Verify live transfer and encoding before considering it. There was no startup preconnect candidate or demonstrated need for another preload. Deferring the Hero, map, Voice Prompt or current required CSS to shorten the waterfall would risk the visible page and its first interaction.

No application files, style files, configuration, dependencies, environment settings, or SEO metadata changed. All three staged runs preserved 14 project entries, showed no horizontal overflow or recorded runtime exceptions, and completed Services navigation and booking-modal checks. Raw Lighthouse reports, DevTools logs, startup traces, and the staged request ledger are in `E:\JavaScript\sparklab-network-audit`, outside the repository. No Performance score improvement was measured.
