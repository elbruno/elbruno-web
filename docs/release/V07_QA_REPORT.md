# v0.7 QA report

November 5, 2026. Verification-first local QA snapshot before authorized staging publication.

## Release identity and gates

- Local base and deployment-backed staging SHA:
  `471c8065490be6e6f48d425114bc6500fc0a0845`.
- V07 was validated as an uncommitted dirty worktree on that base, **not the deployed release at the time of this local QA snapshot**.
  The existing npm package version `0.1.0` was not treated as deployment identity.
- The owner independently confirmed the latest approved staging content at
  17:27 EST on November 5: all four curated projects, updated .NET Conf 2026,
  improved six-story carousel and no homepage-featured PromptDot. These sections
  are already compliant; no outdated-staging defect remains.
  See the [deployment evidence and review matrix](V07_REVIEW_RECONCILIATION.md).
- **STAGING GO.** Unchanged selected derivatives have documented prior staging
  approval. The owner subsequently authorized pushing this reviewed change set
  and running the existing Azure staging workflow at 17:33 EST. The earlier
  local QA/reconciliation passes did not commit, push or deploy.
- **PRODUCTION NO-GO.** Blog TLS, actual legacy redirects, DNS/mail/cutover
  rehearsal, rollback and owner editorial/photo approvals remain open.

The authorized publication is a separate step from the local measurements below.
Use the GitHub Actions deployment record and live `build-info.json` to identify
the published V07 commit, rather than treating this historical base SHA as its
release SHA. No production or DNS authorization was given.

## Final reconciliation pass

This pass changed documentation and refreshed the local review archive only.
Accessibility, SEO/indexing, measured performance, security triage and content
resilience work remain complete within the documented local scope and residual
limitations. No application, approved component, dependency or workflow was
changed in this pass.

The completed implementation's results below remain applicable. Builds, unit/
E2E suites, audits and Lighthouse were not unnecessarily rerun for documentation
edits. Only formatting, diff cleanliness, photo tracking/ignore checks and
archive freshness/integrity were rechecked. The refreshed ZIP retains all 57
primary screenshots, three contact sheets and existing regression evidence,
and includes the latest release reports and approval checklist.

## Actual command results

| Executed command / check                  | Actual result                                                                                                                                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                  | PASS, 472 packages installed; first attempt was blocked by the local preview's Windows compiler DLL lock, then succeeded after stopping that owned preview       |
| `npm run validate`                        | PASS: Astro/TypeScript check (zero errors/warnings, two pre-existing XMLValidator deprecation hints), ESLint, 36 unit tests, content validation and static build |
| `npm run build`, default staging          | PASS: ten generated pages (eight content routes, two localized error pages), generated noindex HTML/headers and disallow robots                                  |
| Explicit local production `npm run build` | PASS with both SITE_ENV and SITE_ORIGIN; eight content routes checked for indexability and exact production canonical URLs                                       |
| `npm run test:e2e`                        | PASS: 79 passed, one intentional skip, zero failures, two Chromium projects, about 1.1 minutes                                                                   |
| Intentional skip                          | Native mobile swipe case in the desktop project; the same case passes in mobile Chromium                                                                         |
| `npm run format:check`                    | PASS; supplied V07 specification mechanically formatted alongside changed files, no semantic plan changes                                                        |
| `git diff --check`                        | PASS                                                                                                                                                             |
| Full `npm audit`                          | Executed; final nonzero advisory exit is expected: ten moderate development findings, zero high/critical                                                         |
| Production `npm audit --omit=dev`         | PASS, zero advisories of any severity                                                                                                                            |
| `npm run capture:v07`                     | PASS: 57 primary captures, three labeled contact sheets, zero capture audit issues                                                                               |
| `npm run measure:v07`                     | PASS: 12 real Lighthouse runs and production-output indexing verification                                                                                        |

The original registry audit endpoint returned HTTP 429 on one initial probe.
Audits were rerun successfully against `https://registry.npmjs.org`, without
changing persistent npm configuration. Full before/final JSON and safe-fix logs
are in the review ZIP. `npm audit fix` was used only after inspecting a dry run;
`--force` was never used.

## Defects reproduced and repaired

| ID      | Reproduction / fix                                                                                                                                       | Evidence                                                                                                                                      |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| A11Y-01 | Skip-link Enter did not put focus on main. Added main tabindex=-1.                                                                                       | Baseline hardening log, final keyboard focus assertions in both locales/projects                                                              |
| A11Y-02 | Required text spacing clipped Spanish developer caption at fixed 100px height. Caption now has a minimum height and can grow.                            | Real before/after screenshots in evidence; final six-slide/three-width/both-language text-spacing cases                                       |
| A11Y-03 | Lighthouse found the unweighted label-content-name-mismatch rule even with a 100 accessibility score. EN/ES labels now appear in their accessible names. | Saved failing Lighthouse details and axe baseline log; final checks include WCAG 2.1 A, not just AA tags                                      |
| DATA-01 | Literal "Hi!" blog teaser and unlabelled cache freshness.                                                                                                | Greeting-only excerpts omitted; no invented summaries/dates; four visible cache notices                                                       |
| DATA-02 | Unverified/malformed GitHub data and outage paths lacked targeted coverage.                                                                              | Requested repository URL enforced; 403/429, timeout, malformed/missing fields preserve previous data; unchanged polls do not churn timestamps |
| SEO-01  | Indexing relied on upload-time edits; explicit Twitter properties, worksFor and RSS discovery missing.                                                   | Shared fail-closed indexing policy, actual production/staging output checks, metadata regression tests                                        |

A CSS `zoom:2` probe and an immediate smooth-scroll bounds assertion were
identified as test-method problems, not site defects. The suite now uses the
browser-zoom-equivalent CSS viewport and waits for focus scrolling to settle.

## Accessibility and responsive review

- All eight content routes, EN/ES and both light/dark themes were scanned with
  axe 4.14 using WCAG 2 A/AA, 2.1 A/AA and 2.2 AA rules.
- **Zero final automated violations** in that tested scope. Existing per-slide
  contrast and game-dialog checks also pass. This is not a formal WCAG certification.
- All eight routes reflow without horizontal document scrolling at
  320, 375, 390, 768 and 1440 CSS px.
- A 720x450 CSS viewport checks reflow equivalent to a 1440x900 browser at 200%
  zoom. Browser chrome zoom controls were not driven, and CSS zoom alone was not
  accepted as a proxy for responsive media-query behavior.
- Text-spacing overrides use 1.5 line height, .12em letter spacing, .16em word
  spacing and 2em paragraph spacing. Carousel captions remain unclipped in all
  36 locale/slide/width combinations, with the original default layout retained.
- Six stories, dimensions, image decode/failure fallback, fixed professional
  copy, accessible indicators, keyboard, native mobile swipe, reduced motion,
  hover/focus/visibility suspension and quiet automatic rotation all pass.
- The document's language is correct. Spanish podcast titles/excerpts explicitly
  retain their source language on English pages.

### Keyboard / screen-reader behavior checklist

The following are actual browser-driven keyboard checks and accessibility-tree
inspection, not a claim that a human NVDA/VoiceOver session occurred.

| Check                                                                                       | Result / evidence                                         |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| First Tab reaches visible skip link; Enter focuses main                                     | PASS, both languages/projects                             |
| EN/ES switch preserves route and accessible name contains visible label                     | PASS                                                      |
| Mobile menu opens; Escape closes and restores focus                                         | PASS                                                      |
| Prev/Next use Enter/Space/arrows; focus remains visible and inside viewport after scrolling | PASS                                                      |
| Tab/Shift+Tab leave and return to indicators, no trap                                       | PASS                                                      |
| Automatic rotation does not populate the announcement region                                | PASS                                                      |
| Manual story selection updates current indicator and one polite status                      | PASS                                                      |
| Reduced motion stops autoplay and keeps manual navigation usable                            | PASS                                                      |
| Bug Invaders Escape/close restores trigger focus                                            | PASS                                                      |
| Turn-based non-action alternative and touch controls work                                   | PASS                                                      |
| Chromium accessibility tree exposes named landmarks/buttons, only the visible story         | Inspected; local evidence/accessibility-tree.json         |
| Native NVDA/VoiceOver spoken navigation and pronunciation                                   | NOT RUN; owner acceptance follow-up, no conformance claim |

## SEO, links and content fidelity

- Eight real content routes, two error pages, one logical h1 per content route.
- Canonicals and sitemap use `https://elbruno.com/`; reciprocal EN/ES/x-default
  pairs and localized descriptions are preserved.
- Both generated production and staging output were verified. Production has
  no staging robots/meta/header restrictions on content pages; error pages
  remain noindex. **Final local dist has been restored to safe staging mode.**
- Live Azure robots follows its configured trailing-slash 301 to `/robots.txt/`,
  then returns 200 with `Disallow: /`. Both responses carry noindex. The saved
  initial zero-byte 301 body was not mistaken for the final crawler policy.
- OG/Twitter use a real approved shared illustration with alt text; descriptions
  and titles match. Person uses verified Cloud Advocate and Microsoft, with
  existing public sameAs URLs. No unverified Event/recording metadata added.
- WordPress and podcast popups preserve destinations, have null opener,
  noopener/noreferrer and localized new-tab notices. Internal links remain same-tab.
- **Zero missing translation keys**, verified by nested shape parity. Feed
  publications intentionally retain their original language; this is not a
  claim of native-speaker linguistic review.
- **Zero broken visible images** or capture browser errors. Local linked routes
  and downloads return 200 in the suite.
- All **40 unique external anchor destinations** were independently reachable
  in this run after following redirects. Six NuGet URLs returned HEAD 404 but
  GET 200; these were confirmed as method-specific responses, not broken links.
- The official .NET Conf agenda was reread and snippets saved: November 10
  12:00-12:30 PST and November 11 16:00-16:30 PST, both Bruno sessions.
  Clock tests cover upcoming/live/past and leave-open transitions. No recordings
  or unsupported career facts were invented.
- Historic feed refresh times were not recorded. UI now explicitly says this,
  rather than inventing a recent timestamp. Successful initial/material refreshes
  record a truthful source timestamp; failures retain prior entries/timestamp.
- NuGet source dates, stale warning, missing-metric behavior and last-good
  dashboard fallbacks remain unchanged and tested.

### Live social-preview checklist, intentionally pending

- [ ] After owner-authorized publication, inspect EN/ES Home/About/Projects/
      Speaker Kit in LinkedIn Post Inspector.
- [ ] Inspect X large-image card, title, description and cached refresh behavior.
- [ ] Paste into an approved Teams draft and inspect the link preview without
      sending it. Confirm absolute image fetch, caption and correct language.
- [ ] Verify crawlers can fetch the production host but staging stays noindex.

No private URL or unpublished image was submitted to a preview service.

## Real Lighthouse measurements

Lighthouse **13.6.0**, real headless Chromium **156.0.0.0**, Windows,
Node **26.13.0**, loopback Astro **production preview**, no dev server.
Three fresh Lighthouse invocations per row; caches/storage reset by Lighthouse.
No other audit/capture job ran concurrently with the measured runs.

Desktop preset: simulated 40ms RTT, 10,240 Kbps, CPU multiplier 1, 1350x940.
Mobile preset: simulated 150ms RTT, 1,638.4 Kbps, CPU multiplier 4; full settings
and timestamps are preserved in JSON. Screenshot viewports are independently
1440x900 and 390x844, not the Lighthouse emulation preset.

| Route / preset    | Performance | Accessibility | Best practices | SEO | Median LCP | CLS (all runs) |
| ----------------- | ----------- | ------------- | -------------- | --- | ---------- | -------------- |
| EN Home / desktop | 100         | 100           | 100            | 100 | 424ms      | 0              |
| EN Home / mobile  | 100         | 100           | 100            | 100 | 1,655ms    | 0              |
| ES Home / desktop | 100         | 100           | 100            | 100 | 423ms      | 0              |
| ES Home / mobile  | 100         | 100           | 100            | 100 | 1,655ms    | 0              |

All 12 runs meet the local LCP <=2.5s and CLS <=0.1 targets. These are **synthetic
local results, not Azure latency, field Core Web Vitals or guaranteed user scores**.
The preview server does not apply SWA headers; hosting-header compatibility was
tested separately using intercepted real responses with the intended CSP, and
the current Azure headers were read directly.

Remaining diagnostics: about 103 KiB desktop / 68 KiB mobile estimated image
delivery savings, a short same-origin dependency chain and small render-blocking
CSS opportunity (around 30ms desktop / 110ms mobile in representative runs).
The approved 960px first hero derivative is larger than a 1x display needs, and
the lazy speaking promo has a larger minimum source than its small desktop slot.
Do not upload new derivatives or radically change image quality to chase scores;
no new assets were introduced. Existing first-image priority, responsive WebP,
on-demand other stories and lazy below-fold imagery already meet local targets.

Crucially, the **first** Lighthouse batch also scored 100 but reported the
unweighted language-label defect. It was reproduced with axe, fixed, and the
entire final 12-run batch was rerun. Scores alone were not accepted as proof.

## Dependency and security triage

Final audits: production **0**; full tree **10 moderate**, **0 high**, **0 critical**.
The remaining development-only chain is minimatch glob-parts amplification
propagating through ESLint/config-array/typescript-eslint/eslint-plugin-astro.
It is build/lint tooling, not shipped static JavaScript or a runtime API.
This lowers exposure, but is not a claim that developer tooling cannot be attacked.

Adding the missing Lighthouse tool initially exposed three additional
glob/Sentry development-chain findings. A compatible non-force audit fix removed
that chain, leaving the previously documented ten moderate tool findings.
Suggested remaining fixes include an incompatible linter/parser downgrade.
No forced fix, broad dependency override or unverified major migration was used.
The advisory JSON contains the exact IDs/ranges/affected nodes for follow-up.

Existing CSP remains same-origin scripts/assets, no objects/frames/forms,
with inline presentation styles only. Header/CSP tests cover theme, carousel,
Speaker Kit and lazy game. No third-party browser API calls or new embeds added.
CI discovers the new regressions automatically, pins staging mode, has a
20-minute bound and an explicitly advisory production audit; no brittle
Lighthouse score hard-fail was introduced. Workflows were not run remotely.

## Visual review and photo privacy

- **57 primary screenshots**: 16 full-page, eight Home/About above-fold,
  24 story states, eight focused talks/projects/GitHub/NuGet sections and one
  dark full-page homepage.
- Three labeled desktop/mobile/carousel contact sheets were generated and
  visually inspected, along with full-size EN desktop, ES mobile, NuGet and
  text-spacing regression captures.
- Two additional real before/after caption regression screenshots are under
  evidence. The "before" is explicitly a controlled reproduction of the old
  fixed-height rule, not a falsely attributed deployed screenshot.
- Capture manifest: zero overflow, broken visible images, clipped default
  captions, carousel viewport failures or browser console/page errors.
- Inventory: **19 existing optimized photographic variants** in the public photo/
  personal/hero directories, all checked for EXIF, XMP and IPTC absence. Machine
  inventory includes dimensions, bytes and SHA-256. No new photo file was created.
- Hero manifest still defines six stories (five photographs and the approved
  developer illustration); official three photo downloads and Speaker ZIP
  remain byte-identical and are not copied as raw files into the review ZIP.
- Git tracked files and reachable history checks found no `tmp/photos/`, `.env`
  or `.env.local` content. This is a reachable-history check, not an assertion
  about inaccessible hosting backups, deleted remote refs or every possible secret.
- Original masters were not opened, processed, committed or uploaded. No AI
  image generation/editing service was used.

## Changed files

- Hosting/CI/privacy: `.github/workflows/ci.yml`, `deploy.yml`,
  `refresh-content.yml`, `.gitignore`, `package.json`, `package-lock.json`,
  `scripts/prepare-hosting.ts`, `src/lib/indexing.ts`.
- Content/markup/styles: `scripts/fetch-content.ts`, `src/lib/feeds/model.ts`,
  `parse.ts`, `refresh.ts`, `src/components/FeedSection.astro`,
  `ResourceLink.astro`, `src/layouts/Layout.astro`, `src/styles/global.css`.
- Reproducible review tooling: `scripts/capture-ux-refinement.ts`,
  `scripts/measure-v07.ts`.
- Tests: `tests/feeds.test.ts`, `tests/indexing.test.ts`,
  `tests/browser/hardening.spec.ts`, `tests/browser/site.spec.ts`.
- Documentation: `README.md`, `docs/content-sources.md`,
  `docs/release/LAUNCH_RUNBOOK.md`, four requested V07 reports/checklists;
  supplied V07 plan has formatting-only changes.
- Local-only outputs: `screenshots/v07-review/`, `v07-review.zip`.

No routes, portfolio selections, photos, biographies or visual tokens were replaced.

## Deliverable locations and remaining gates

- [Review matrix](V07_REVIEW_RECONCILIATION.md)
- [WordPress readiness](V07_WORDPRESS_MIGRATION_READINESS.md)
- [Owner approvals](../editorial/V07_OWNER_APPROVALS.md)
- Local screenshot inventory: `D:\elbruno\elbruno-web\screenshots\v07-review\README.md`
- Local summary: `D:\elbruno\elbruno-web\screenshots\v07-review\QA_SUMMARY.md`
- Local archive: `D:\elbruno\elbruno-web\v07-review.zip`

Original report text, native screen-reader listening, real production social
previews and field performance remain outside the verified evidence. Actual
WordPress/Cloudflare/Azure/DNS changes, legacy redirect rehearsal and rollback
remain approval-gated. These are not represented as completed operations.
