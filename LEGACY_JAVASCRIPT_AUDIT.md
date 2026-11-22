# SparkLab Legacy JavaScript audit

**Finding.** The warning reproduces on the local production build. Its only flagged request is `0tmq4ua_7wdbm.js`, which includes Next.js’s small App Router polyfill module. `1hy9p0hfrq0w2.js` also loads but produces no Legacy JavaScript finding. Lighthouse reports an estimated 13,912 bytes for the flagged request. The actual shim body occupies 1,376 uncompressed bytes inside the chunk, and an in-memory compression comparison puts its marginal size at about half a kilobyte. This audit leaves source, configuration, dependencies and browser support intact.

## Exact source and delivered bundles

I built and served production build `k3WlyLPw3Xo-QuaOeCBD7` from the local project using Next.js 16.4.6 and Turbopack. Lighthouse 13.6.0 ran the `legacy-javascript-insight` audit against that build at 390 × 844 and 1366 × 768 using Chrome 157. The DevTools request logs agree with the finding in both runs.

| Bundle | Production behavior | Attribution |
| --- | --- | --- |
| `0tmq4ua_7wdbm.js` | Requested on mobile and desktop. Lighthouse lists seven signals, all on line 0 near the start of the file. | Turbopack module `66849` contains the feature-guarded implementations from `next/dist/build/polyfills/polyfill-module.js`. The compiled `app-globals` module calls it during App Router startup. The rest of this shared bundle includes bootstrap, React renderer, scheduler and hydration code. |
| `1hy9p0hfrq0w2.js` | Requested on mobile and desktop. Zero Legacy JavaScript signals. | Next.js App Router runtime, including Flight and navigation logic. |
| `0cz1d0mv5g_q7.js` | Present as `<script noModule>` in the HTML. Absent from both Chromium request logs. | Byte-for-byte match for the installed Next.js `polyfill-nomodule.js` fallback. Its broad inventory includes arrays, objects, strings, `Reflect` and `Promise` shims. Its on-disk size does not count toward the observed modern-browser finding. |

All 29 generated browser chunks were also scanned with Lighthouse’s installed pattern detector. Only the shared bootstrap and `nomodule` fallback matched the detector’s compatibility patterns. The installed GSAP, Motion/Framer Motion, Three.js, and Lucide code did not produce a separate finding. `npm ls` found no project-level `core-js` or `regenerator-runtime` dependency in the installed dependency tree considered here. The fallback is prebuilt inside Next.js. Application source contains no import of the triggering framework shim.

## Compatibility code and syntax

| App Router shim | Flagged in these audits | Available at the existing browser minimums |
| --- | --- | --- |
| `Array.prototype.at`, `.flat`, `.flatMap` | Yes | Yes |
| `Object.fromEntries`, `Object.hasOwn` | Yes | Yes |
| `String.prototype.trimStart`, `.trimEnd` | Yes | Yes |
| `Symbol.prototype.description`, `Promise.prototype.finally` | No | Yes |
| `URL.canParse` | No | No. Introduced in Chrome and Edge 120, Firefox 115, Safari and iOS Safari 17. |

Each shim checks for native support before installing a fallback. A sandbox test of the installed module restored deliberately missing `Array.prototype.at`, `Object.hasOwn` and `URL.canParse` and exercised valid and invalid URL input. No direct `URL.canParse` caller was found in SparkLab source or in the scanned production client chunks beyond the shim definitions. Retaining it protects the current default browser matrix and avoids overriding Next’s bootstrap contract. [Browser Compatibility Data](https://github.com/mdn/browser-compat-data/tree/main) · [URL compatibility entries](https://github.com/mdn/browser-compat-data/blob/main/api/URL.json) · [WebKit’s Safari 17 release notes](https://webkit.org/blog/14445/webkit-features-in-safari-17-0/)

- `package.json` and the repository have no Browserslist override, and no `BROWSERSLIST*` override was set in the audit environment. The installed `next/dist/shared/lib/modern-browserslist-target.js` specifies Chrome 111+, Edge 111+, Firefox 111+, and Safari 16.4+. `next.config.ts` configures React Compiler and a Tailwind CSS loader. It has no custom JavaScript downleveling or polyfill aliases. [Next.js supported browsers](https://nextjs.org/docs/architecture/supported-browsers)
- `tsconfig.json` uses `target: ES2017` with `noEmit: true`. TypeScript did not emit these browser bundles. Changing that target would not remove an explicit framework import. The shared chunks retain `async function`, optional chaining and nullish coalescing. The detector reported no Babel transform signals in the loaded finding, such as transformed async/generator or class helpers. The shim bodies use some older syntax internally. Their source and explicit import account for the warning.

## Reported bytes versus actual module size

Lighthouse estimates savings by mapping detected APIs to an estimated polyfill dependency graph, then applying its compression factor for the containing response. It has no measured removal delta for these compact, handwritten shims. The installed detector estimated 44,176 decoded bytes for the signals in this chunk, which the insight reported as 13,912 estimated transferred bytes. [Lighthouse detector source](https://github.com/GoogleChrome/lighthouse/tree/main/core/lib/legacy-javascript)

The installed polyfill file is 1,380 raw bytes and the inline implementation in module `66849` is 1,376 raw bytes. Recompressing the same whole chunk with its shim body omitted in memory gave 410 fewer gzip bytes and 504 fewer Brotli bytes under Node’s default compression settings. This is an approximate upper bound for removing the entire shim body under those settings. A safe selective reduction would save less. The experiment did not edit the build or simulate a deployment. There is no measured Lighthouse score gain or evidence that this warning explains the reported score of 73.

## Safe options and recommendation

**Keep the existing configuration.** The newer APIs marked by Lighthouse are native across the documented minimums. Selective omission of those shims is technically possible at the API level, but the installed framework imports the group as a unit and exposes no supported selective setting in its configuration schema. A stricter Browserslist would narrow compatibility and would still leave the explicit bootstrap import. Raising `tsconfig.target`, switching bundlers, aliasing the framework module to an empty module, or patching dependencies has no demonstrated benefit that justifies the compatibility and maintenance risk here.

If a supported selective shim mechanism becomes available and is approved for review, keep `URL.canParse`, preserve the existing browser minimums, and verify the output on actual Chromium, Firefox and Safari versions at those minimums before rollout. Compare measured compressed byte deltas and report the Legacy JavaScript audit separately from the overall Performance score. Leave the `nomodule` fallback alone for this finding because modern clients already skip it.

## Validation

- `npm run build` and `tsc --noEmit --incremental false` passed.
- All five public routes returned HTTP 200. The local sitemap and robots endpoints also returned HTTP 200.
- Chrome checks passed at 390 × 844, 360 × 800 and 1366 × 768. The World Map’s visibility behavior, the two animated text strips and all 14 gallery entries were checked with zero horizontal overflow and zero recorded console or runtime errors. These are Chrome checks, including mobile emulation. Minimum-version Safari, Firefox and Chromium were not run in this environment.
- The new findings, request logs, chunk inventory, compression inputs and browser results are under `E:\JavaScript\sparklab-legacy-js`. Only this audit report was added to the repository during the phase.
