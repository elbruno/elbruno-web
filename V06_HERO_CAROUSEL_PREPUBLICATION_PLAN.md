# elbruno.com — V0.6 Hero Story Carousel and Pre-Publication QA

**Status:** implementation brief for GitHub Copilot Agent

**Target repo:** `D:\elbruno\elbruno-web` / `https://github.com/elbruno/elbruno-web`

**Current staging reference:** `https://ambitious-island-06cc6160f.3.azurestaticapps.net/`

**Execution rule:** Work on the EXISTING Astro project; do not rebuild, deploy, push, or modify DNS without the owner's explicit approval.

## 0. Mission

Make the existing homepage more memorable by replacing **only the static photo area on the right of the hero** with a compact, accessible, gently rotating **photo-and-caption story carousel**. The hero's LEFT-side professional introduction, call-to-action buttons, and overall .NET-purple design remain stationary. Implement six narrative slides using authentic photos and existing designs, with proper bilingual captions. Preserve privacy of the local photo masters. Execute comprehensive pre-publication QA and package real Playwright screenshots and reports into a ZIP for editorial review.

**Primary user promise:** At first glance, visitors understand who Bruno is: a **Cloud Advocate at GitHub / Microsoft, focusing on AI Agents, AI and .NET**. The photo carousel is supplemental, never the primary message.

## 1. First audit: repository and current experience

1. Inspect README, package.json, Astro routes, layout, i18n content, current hero image markup, images pipeline, existing photograph derivatives, feeds, NuGet integration, robot, Bug Invaders, Speaker Kit, tests and GitHub Actions. Follow current repository conventions and existing build scripts.
2. Check `git status`, `.gitignore`, `git ls-files tmp/photos`, and `git check-ignore -v tmp/photos/26-06-BusAllForMyself.png`. If a source photo is tracked, STOP any push and flag privacy as a blocker. Avoid committing hidden/private originals, even if previously tracked.
3. Find whether the existing local hero photo `tmp/photos/26-11-bruno hold stackchan.jpg` already has a compliant optimized public derivative. Prefer reuse to needless reprocessing.
4. Inspect source photos and current assets locally. Do not assume exact filenames for any photo other than those explicitly supplied below.
5. Inspect skill discovery instructions for `t2i` if new illustrations are needed; do **not** use t2i merely to render screenshots or create synthetic photographs of Bruno.
6. Keep existing routes, automatic data updates, speaker photo downloads, PDF/ZIP resources, SEO, navigation and bilingual interactions intact.

## 2. Photo privacy and asset publication — non-negotiable

Source masters reside ONLY on Bruno's Windows machine under `D:\elbruno\elbruno-web\tmp\photos\`. **None of these originals is authorized to be uploaded or included in public Git history.**

- All source images, raw editor outputs, full-resolution masters, temp contact sheets, unredacted private paths and source ZIPs stay local and ignored by Git.
- Web display requires publishing **only the selected, deliberately approved, compressed derivatives** of the chosen photographs. Treat these derived images as publicly accessible and do not commit them until you have checked their contents for personal/private details (faces of bystanders, signs, travel or identity data) and secured owner's approval to publish.
- Use local `sharp`, Astro image transforms, or equivalent offline tools for cropping, metadata removal, sizing and WebP/AVIF conversion. Original source byte-for-byte unchanged. Strip EXIF/GPS/IPTC/XMP from derived assets. Do not enlarge a low-resolution source beyond its useful native detail.
- A local `t2i` skill may support generation **and edits**, but if an edit sends source photographs to an external service, do not transmit private source photos without explicit user permission. For this change, ordinary local processing is preferred.
- Name public derivatives descriptively under existing image asset conventions, e.g. `public/images/hero/hero-bus.webp`; if the repo uses `src/assets/` with Astro's pipeline, follow that pattern instead.
- Maintain an asset manifest documenting source basename, derivative basename, size/dimensions, intended placement and publication approval status. Do not reveal absolute local Windows paths in public content.
- Ensure the screenshot review ZIP contains screenshots and QA text only; **never include raw source photo files**. Screenshots will naturally contain the displayed images and should be treated as shareable previews.
- If a source file is absent, skip only that slide and report the blocker, rather than replacing Bruno with a fabricated human image or adding placeholder broken images.

## 3. Six-slide carousel: fixed ordering and editorial intent

Start **always** on slide 1 (StackChan). Do not shuffle. Slides are authentic narratives, not generic stock images.

| Order | Theme              | Exact source / selection                                                                                                                                                     | EN micro-title      | EN caption                                                                  | ES micro-title           | ES caption                                                                        |
| ----- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------- |
| 1     | Maker / AI         | `tmp/photos/26-11-bruno hold stackchan.jpg`, or existing optimized hero derivative                                                                                           | The maker 🤖        | Building tiny robots, exploring AI agents, and sometimes creating new bugs. | El maker 🤖              | Robots pequeños, agentes de IA y, de vez en cuando, bugs nuevos.                  |
| 2     | Speaking           | Prefer `tmp/photos/22-01 Bruno speaking in Podioum 1.jpg` if available locally; alternatively choose an already-used approved event photo where Bruno is clearly visible.    | The speaker 🎤      | Sometimes I leave Visual Studio and talk to humans.                         | El speaker 🎤            | A veces salgo de Visual Studio para hablar con humanos.                           |
| 3     | Development / code | Prefer an existing original project/demos illustration/screenshot; create an **illustration** via t2i only if needed and if permitted, never synthetic evidence of an event. | The developer 💻    | AI agents, C# and .NET. From first experiments to working demos.            | El developer 💻          | Agentes de IA, C# y .NET. De los primeros experimentos a las demos que funcionan. |
| 4     | Canadian winter    | `tmp/photos/24-12-Bruno running with ACE snow.jpg`                                                                                                                           | Canadian winters ❄️ | Running in the snow with Ace. Apparently running wasn't hard enough.        | Inviernos canadienses ❄️ | Corriendo en la nieve con Ace. Parece que correr no era suficientemente difícil.  |
| 5     | Trail running      | `tmp/photos/26-06-Bruno Ultra Runner 50K.jpg`                                                                                                                                | The runner 🏃       | 50K on the trails. Some debugging sessions still feel longer.               | El runner 🏃             | 50K por senderos. Algunas sesiones de debugging se sienten más largas.            |
| 6     | Travel / humor     | `tmp/photos/26-06-BusAllForMyself.png`                                                                                                                                       | The traveler 🚌     | Booked a conference trip. Somehow got the VIP bus. All to myself.           | El viajero 🚌            | Viajé para una conferencia y me tocó el autobús VIP. ¡Para mí solo!               |

Notes:

- The StackChan photo should be the image in the first paint (LCP candidate). Maintain its recognizable appearance and positioning.
- Slide 2 must communicate **Bruno speaking**, not just an audience. The separate local photo `tmp/photos/26-06-FullRoom.png` is for the Speaking page/gallery if it genuinely helps; it is not an ideal hero slide because the speaker may be hard to see.
- Slide 3 can use source-code imagery without showing secrets, API keys, identifiable customer data or fake Microsoft/GitHub endorsements. Prefer screenshots of actual open-source code or the existing illustrations. Overlay readable labels in HTML/CSS, not baked text in a generated bitmap.
- Slide 4's source is panoramic and may have a low aspect ratio: create an appropriate contained crop or designed canvas with tasteful background treatment **without cutting out Bruno or Ace**. Do not upscale excessively.
- Slide 5 is the previously supplied medal/race photo. Preserve recognizable race and finish context.
- Slide 6 is deliberately funny. Place it last as the surprise; do not displace the professional image on the initial load.
- `tmp/photos/26-06-BreakFastSevilla-Typical.png` may be used in the About Spain/personal story if it fits; `tmp/photos/26-06-Clima en Madrid.jpg` is a possible _future easter egg_ only, not a hero slide. Don't add extra slides.
- Text above is suggested editorial copy; keep witty, short, locally natural EN/ES. Do not use em dashes.

## 4. Interaction and UI specification

### Layout

- Desktop: keep existing 2-column hero: fixed name, role, focus, intro and CTAs LEFT; rotating media RIGHT. Preserve the approved .NET lavender/purple visual language, clean negative space, rounded corners, accessible contrast and above-the-fold clarity.
- Mobile: introduction first, carousel image next, compact caption beneath. Avoid massive vertical growth, text overlap and horizontal scrolling.
- A small **separate caption panel below** each image (or a consistently high-contrast on-photo caption with a safe area) is preferable to low-contrast text over complex photos. Explicitly fix the old StackChan caption issue on mobile. Caption must change atomically with image.
- Stable image frame and stable caption minimum height to avoid layout shifts. Use appropriate `object-fit` and per-image focal-position metadata. Do not cut off face, robot, dog, medal or funny expression.
- Maintain existing links, navigation, robot easter egg and CTA functionality.

### Behavior

- Autoplay every **6–7 seconds**; transition **400–600ms** with subtle fade, not dramatic movement or continuous sliding.
- Stop or pause on hover, keyboard focus within carousel, manual interaction, when browser tab is not visible, and under `prefers-reduced-motion: reduce`. For reduced motion, disable auto advance entirely and use instant/manual changes.
- Include explicit **Play/Pause** toggle and previous/next arrow buttons, plus accessible slide indicators. Buttons must work and have descriptive `aria-label`s in both languages.
- Touch swipe should be supported on mobile without hijacking vertical scrolling; manual buttons remain usable without swipe. Focus must remain logical and no hidden slides should be tab-reachable.
- Announce manual slide changes politely to assistive technology; avoid announcing every automatic rotation (no repeated screen-reader disruption).
- Remember **manual pause only during this page visit**, unless existing site preference semantics require more. Never persist movement without a reason.
- Ensure initial content is meaningful with JavaScript disabled: render first image and caption statically, and hide nonfunctional controls. Progressive enhancement preferred.
- Provide sensible failure fallback if an image does not load; never leave the hero blank.

### Performance

- First slide responsive sizes (`srcset`/`sizes`); prioritize loading for LCP and keep below-the-fold extras lazy.
- Other slides should be lazy or preloaded shortly before use; don't download all six original-size images immediately.
- Prefer WebP/AVIF with JPEG fallback if necessary. Optimize mobile and desktop without losing recognizable human detail.
- Avoid heavy carousel dependencies if existing lightweight TypeScript can provide robust accessibility.
- Add `width`, `height`, or aspect ratio to eliminate CLS. Use modern responsive HTML image handling and no autoplay video.
- Record real Lighthouse / Lighthouse CI measurements if tooling is available; do not invent scores or pretend local results represent hosted Azure performance.

## 5. Related content preservation and secondary changes

- Identity everywhere should be accurately stated as **Cloud Advocate at GitHub / Microsoft; focus on AI Agents, AI and .NET**. Avoid representing Microsoft and GitHub as separate simultaneous employers if the actual title/relationship is not confirmed; prefer the user-approved phrasing or flag editorial review.
- Preserve four featured work items, with correct category placement, correct factual descriptions, and the exact authoritative links:
  - Open Source / AI & .NET Libraries: `https://elbruno.github.io/nuget-repo-dashboard/`
  - Maker / New Year New Bot: `https://aka.ms/newyearnewbot` (retain verified Coming soon status if still applicable)
  - Demos / .NET + Foundry Better Together: `https://aka.ms/netfoundry-bt`
  - Learning / Generative AI for Beginners .NET: `https://aka.ms/genainet`
- Preserve About's **Three countries. One heart.** (Argentina, Spain, Canada) and current photo cards, including Ace and Canadian winters. Avoid duplicating this personal story in the hero text.
- Preserve two verified .NET Conf 2026 speaking entries. For November 10/11, date/time labels should be correct and relative status dynamic or consistently date-based. Do not claim event recordings are already available without proof.
- Preserve three-item live feed snapshots for blog and podcast; GitHub and YouTube sections; NuGet package stats from the existing verified data pipeline; future-proof stale data handling.
- **All external podcast URLs** (episode cards, CTAs, navigation and footer links) must open with `target="_blank" rel="noopener noreferrer"`, including EN/ES and mobile. Internal navigation remains same-tab.
- Keep Speaker Kit downloadable ZIP exactly using three official original photo copies and existing approved licensing notes. The following exact filenames must remain recognized (even if sources remain private and ZIP build uses a controlled local build process):
  - `21-11 Bruno Headshot for Msft.jpg`
  - `22-01 Bruno speaking in Podioum 1.jpg`
  - `22-01 Bruno speaking in Podioum 2.jpg`
- Do not publish biographies labeled as drafts. Do not invent unverified career history, conference metrics, image reuse permissions or package downloads.

## 6. Automated tests to create or extend

Add to existing unit / Playwright suite, not a parallel throwaway test rig:

1. EN/ES desktop (1440x900), mobile (390x844) hero starts on StackChan; left-side text/CTAs do not rotate.
2. All six photos and captions are correct and paired, in correct order; arrow and indicators select expected slides; wrap-around is correct.
3. Pause button works, hover/focus pause, tab visibility pause, manual intervention behavior, reduced-motion autoplay disabled.
4. Keyboard and touchscreen: focus order, Enter/Space activations, touch swipe, no trapped focus, no horizontal overflow.
5. No JavaScript fallback displays first hero slide.
6. Responsive `img` sizes, lazy loading, no broken images, useful EN/ES alt text; image framing in representative viewports.
7. No visible image/caption overlap on mobile, no unexpected CLS; screenshot comparison where possible.
8. About retains winter/three-countries section; Speaking retains verified conference details; Projects retains featured links.
9. Podcast external URLs uniformly open new tab securely across all route variations.
10. Speaker Kit ZIP downloads, contains only permitted originals and factual README. Verify the downloadable bytes but never place sensitive source masters into the visual-review ZIP.
11. Run existing `npm run validate`, `npm run build`, `npm run test:e2e`, `npm run format:check` (if present), `git diff --check`; inspect CI. Adapt if scripts differ; report exact commands and actual outcomes.
12. Run `npm audit` and `npm audit --omit=dev` (or local equivalent), log outstanding vulnerabilities with severity and package paths. No forced upgrades.
13. Check keyboard and WCAG basics (contrast, accessible names, focus visibility), links, SEO/meta and canonical URLs, robots/noindex for preproduction as appropriate.
14. Validate presence/absence of private photo masters with `git ls-files`; record changed public derivatives and verify metadata removal with an appropriate tool.

## 7. Automatic visual review package (MANDATORY)

After implementation and validation, use an **actual local production build and `astro preview` / existing project preview script** with Playwright. No synthetic screenshots and no t2i mockups. Check lazy-loaded media, fonts and hydration. Stabilize test fixtures and disable only nondeterministic motion for screenshot capture.

Create these inside `screenshots/v06-carousel-review/`:

- **Full-page screenshots** for `Home`, `About`, `Projects`, `Speaking / Speaker Kit`, each in EN and ES, each at desktop **1440×900** and mobile **390×844**: **16** images.
- **First viewport screenshots** for Home and About, EN/ES, both desktop/mobile: **8** images.
- **Carousel slide-specific viewport screenshots** for ALL SIX slides in BOTH EN and ES at BOTH viewport sizes: **24** images, taken by programmatically selecting the target slide and waiting for images to finish loading. Ensure the matching caption is visible.
- **Dark-mode hero spot checks** for EN and ES on desktop and mobile, slide 1 + slide 6: **8** images.
- **TOTAL: 56 screenshots**. If one cannot be captured, log exactly why and deliver the rest; never claim 56 if fewer files exist.
- `contact-sheet-desktop.jpg`: legible desktop overview with slide names.
- `contact-sheet-mobile.jpg`: legible mobile overview with slide names.
- `contact-sheet-carousel.jpg`: all slides side by side or in a labeled grid (in both languages where space permits).
- `README.md`: exact screenshot inventory with route, language, viewport, theme, slide index and local file path, actual counts, plus summary of any discovered visual issues.
- `QA_SUMMARY.md`: command list, test pass/fail counts, image pipeline and privacy checks, accessibility/performance findings, podcast and download checks, and **STAGING GO/NO-GO** versus **PRODUCTION GO/NO-GO** with factual reasons.

Use predictable names such as `home-en-desktop-full.png`, `about-es-mobile-full.png`, `hero-slide-06-es-mobile.png`, `hero-slide-01-en-desktop-dark.png`. Preserve conventions and ensure unique names, no overwrites.

Create **local-only** `v06-carousel-review.zip` containing the 56 images, three contact sheets, README and QA summary (plus small machine-readable review manifest if useful). Do not include `tmp/photos`, full-resolution originals, personal EXIF, `.env` files, private staging secrets, dependency trees, or other secrets. Keep ZIP untracked and print its precise absolute local path in final output.

## 8. Publication gate and deployment safeguards

**DO NOT** deploy, publish to Azure, open a production release, push a branch, modify `elbruno.com`, change DNS, Cloudflare, WordPress, or Network Solutions settings. Do not modify the existing staging site without explicit authorization. The user will review the local screenshot ZIP first.

**Staging GO candidate** only if:

- all six slides are approved, functional and appropriately captioned in both languages;
- all images are optimized, originals private, metadata stripped, no unapproved people/details revealed;
- no serious mobile layout/accessibility regressions;
- tests/build/format and security audits are executed and findings documented;
- links, feeds, Speaker Kit and Easter eggs still work;
- visual review ZIP and QA report are complete.

**Production remains NO-GO** until owner explicitly signs off on all relevant editorial/licensing/career/CV/bio items, external links and staging validation. Do not silently change these decisions.

## 9. Reporting format

Return a concise completion summary with:

- branch, uncommitted state, changed files and new public derivatives;
- each of six slide sources and captions;
- source privacy checks and metadata stripping evidence;
- actual unit, build, E2E, format and audit command results;
- actual counts and absolute paths of 56 screenshots / contact sheets / ZIP;
- verified preservation of the four featured links, external podcast behavior and Speaker Kit;
- all unresolved blockers/editorial decisions;
- explicit staging GO/NO-GO recommendation and production NO-GO until approved.

**Do the work. Do not stop after outlining a plan. Do not declare success on unexecuted checks.**
