# elbruno.com — v0.3 Implementation Plan

**Repository:** https://github.com/elbruno/elbruno-web

**Baseline:** existing v0.2 implementation

**Primary goal:** evolve the existing personal homepage into a clearer, more memorable, bilingual professional identity and useful online CV, while preserving its clean .NET-purple design.

> This document is an implementation brief for GitHub Copilot Agent. Audit the repository first. Do not rebuild the app or assume a particular existing component/file structure. Adapt to the actual code, routing, data, styles and tests.

## 0. Core product promise

A first-time visitor should understand **who Bruno Capuano is, what he does, and why his work matters within 10 seconds**. A visitor who stays 2 minutes should find projects, talks, content and contact details. An event organizer should be able to obtain approved biographies and official photographs with minimal effort.

Personality: _Professional enough to trust. Geeky enough to explore. Fun enough to remember._

Keep the site:

- clean, modern, readable, accessible and fast;
- unmistakably inspired by .NET purple/lavender gradients;
- professionally credible without corporate stiffness;
- gently playful (hoodie, StackChan robot, small easter eggs), never visually overwhelming;
- fully localized: English default at `/`, Spanish under `/es/`, with equivalent pages and working language switching.

## 1. Non-negotiable preservation rules

1. **Inspect the current v0.2** before writing code. Read existing project docs, relevant instructions, source files, assets, data sources, tests, screenshot tooling and package scripts.
2. Preserve working Astro + TypeScript architecture, GitHub Actions, Azure Static Web Apps setup, current routing, redirects, SEO, RSS build-time content, GitHub/YouTube feeds, and bilingual behavior.
3. Preserve functional StackChan/robot interactions and Bug Invaders. Do not load heavy game code during initial page render.
4. Keep real data real: **do not invent previous employers, employment dates, education, career achievements, speaking events, number of talks, awards, followers, CV details, testimonials or performance metrics**.
5. Do not invent photo licenses, speaker usage permissions or contact addresses.
6. Do not deploy to production, change DNS/Cloudflare, migrate WordPress, or change external accounts.
7. Keep the source open source while clarifying that personal photographs/biographical materials do **not automatically inherit the source-code license**.
8. Minimize additional dependencies; prefer existing components and data structures.
9. Do not introduce unnecessary AI graphics just to fill space. Original photos should remain recognizable and authentic.
10. Use real content and links when verified, otherwise use clearly identified internal editorial placeholders (not published as facts).

## 2. Inputs and existing assets

### Official speaker photographs — exact repository-relative source paths

- `tmp/photos/21-11 Bruno Headshot for Msft.jpg` — official portrait/headshot.
- `tmp/photos/22-01 Bruno speaking in Podioum 1.jpg` — expressive / informal speaking photograph.
- `tmp/photos/22-01 Bruno speaking in Podioum 2.jpg` — gesturing / action speaking photograph.

**Important:** retain the exact spelling `Podioum` and spaces in source filenames. Reference them safely using proper quoting/URL encoding or generate sanitized _derived_ filenames, without renaming the originals.

The repo also has a collection of other authentic photographs in `tmp/photos/`, including Bruno with StackChan, community/conference events, trail running and Ace. Inspect available files and any previous photo selection docs. Prefer the existing approved StackChan picture for the home hero. Use the official headshot for /about and Speaker Kit, and authentic event photos for speaking.

### `t2i` skill

Copilot has access to a skill named `t2i` that may support **both generating and editing images**. Discover its actual instructions/tool interface before use. If unavailable in the running environment, document the limitation and continue using approved existing images. Never claim an image was generated/edited if it was not.

Appropriate uses: cohesive little robot expressions, subtle .NET-purple motifs, optional tasteful illustrated accents, properly edited copies of supplied photos for color harmony/light/crop/background cleanup, Open Graph artwork and Bug Invaders sprites. Preserve likeness, factual setting and original files. **Do not generate synthetic professional headshots or fake conferences.** Record source-to-output mappings and avoid repeated unnecessary asset generation. Optimize derivatives (responsive WebP/AVIF and proper dimensions), but retain official downloadable originals.

## 3. Workstream A — About page as a genuinely useful online CV (highest priority)

### Problem observed in v0.2 screenshots

The `/about` page is visually clean but currently repeats the homepage role summary. It does not yet convey a useful professional history, selected accomplishments or career evidence.

### Required changes

- Keep a short, distinctive headline, for example:
  - EN: **“Developer by trade. Curious by default.”**
  - ES: **“Desarrollador. Curioso por naturaleza.”**
    These are proposed copy, not mandatory literal wording. Keep the subtitle describing AI, .NET, Azure, GitHub and developer advocacy.
- Replace repeated boilerplate with a concise human-readable **Professional story**: what Bruno focuses on today, how he works (code, experiments, talks and communities), and what kinds of collaboration he does.
- Add **Career & Experience** as a structured timeline powered by _editable content data_, not hardcoded scattered JSX. Entries should have organization, role, date range, short impact statement and optional verified links. Render only entries whose factual details have been verified.
- Add **Selected Work / Impact** with 2–4 evidence-backed examples and clear links to projects, community content, recorded talks or technical resources; do not invent numbers or awards.
- Add **Skills / Areas of expertise** with AI and agents, C#/.NET, Azure/cloud, GitHub Copilot/developer tools, developer advocacy/community. Avoid exaggerated proficiency claims.
- Add **Download CV** only when a real reviewed document is present. If CV isn't available, make a build-ready feature or a hidden editorial TODO and surface the gap in the final report; do **not** ship a dummy PDF or dead button.
- Maintain **Beyond the Code** with authentic photos (running, robots, Ace, and community when appropriate). Move community event photographs to Speaking if that keeps this section more truly personal; no need to remove the human element.
- Use the official headshot in the About page. Preserve a comfortable, flattering crop and enough whitespace around the face.
- Prefer content that is scannable: short paragraphs, meaningful headings, small cards and clear external links. About must feel like a narrative professional profile, not a dense résumé pasted on a page.

### Research and approval boundary

You may inspect user-provided docs and linked public profiles _if tool access is available_, such as https://www.linkedin.com/in/elbruno/ and current repo materials. Do not bypass restrictions and do not infer dates or previous positions from vague descriptions. Create `docs/content-verification.md` (or the project's equivalent), listing facts used, source URLs and factual items still requiring Bruno's approval. If source information is insufficient, build the components with verified present-day facts and mark missing fields internally as editorial tasks; do not fill fictional career data.

## 4. Workstream B — Speaking experience and Speaker Kit

### Goals

Make it easy for two audiences: a curious developer exploring real talks, and an organizer downloading accurate assets and copy.

### Home / Speaking entry point

- Give **Speaking & Community** a little more visual weight on the homepage. Use a real stage photo, short personality-led line, a clear action to open speaker resources, and optionally a verified recorded talk.
- Suggested playful line: **“Sometimes I leave Visual Studio and talk to humans.”** Include an idiomatic Spanish counterpart rather than word-for-word translation.
- Do not display unverified counts of sessions, views or countries.
- Where feasible, distinguish **Explore talks** from **Get speaker resources**; reuse existing routes and minimize extra navigation complexity. If a separate Talks page is out of scope, use a compact curated talks section inside existing Speaking or About content.

### Speaker Kit `/speaking` or existing equivalent

- Preserve the functional ZIP download, the official photos, copy-to-clipboard controls and selectable EN/ES biographies in **50 / 100 / 200 words** (approximately, with honest word counts).
- Keep the bilingual bio selector independently usable even on the English/Spanish site versions.
- **Remove editorial-review warnings from the visitor-facing UI once the corresponding copy is approved.** If the biographies have _not_ yet been approved, keep that fact visible in the internal content verification checklist and do not silently claim approval; publish only vetted short factual copy or explicitly request review prior to final release.
- Improve the desktop layout: the photo column is much taller than the biography column. Arrange the three photo previews in a compact responsive grid or balanced stack and separate downloads from long-form bio controls.
- Avoid excessively close cropping of the headshot; inspect all breakpoints and use suitable aspect ratios / `object-position`.
- Each photo should have a simple accurate label, preview, dimensions if known, and working original-file download.
- ZIP contents: source-quality official headshot, two authentic speaking photos, reviewed EN/ES bio variants, and concise usage/readme notes. Validate the archive and links. Don't include non-official synthetic pictures as headshots.
- Add a small **Copy intro** control for stage introduction and optionally a **Copy speaker details** control that copies the selected bio + an absolute URL to the public official headshot. Avoid a control that only _pretends_ to copy/download.
- Add verified talk topics: practical AI/agents, C#/.NET, Azure, GitHub Copilot, developer experience/community. Include prior session links only if verified.
- Provide an obvious professional contact route, using an existing public link (e.g. https://www.linkedin.com/in/elbruno/) unless an approved email is supplied.
- Keep official professional resources prominent and avoid unrelated decorative sections below them.

## 5. Workstream C — Homepage clarity and mobile refinement

The v0.2 home hero and StackChan photo are strengths. Preserve their general composition and palette.

### Desktop

- Maintain hero hierarchy: **Bruno, what he does, why that matters**, then 1–2 primary actions.
- Keep StackChan photo large and authentic. Preserve clean negative space; don't introduce competing portraits or busy generated backgrounds.
- Strengthen speaking/community with real event photography without overwhelming the other content.
- Preserve `Bruno in 30 seconds`, `What I do`, featured projects, GitHub, 3 recent podcast episodes, 3 recent videos, 3 recent blog posts and social links.
- Avoid repeating identical summary sentences in the hero, quick bio and About link.

### Mobile

- In the first screen, prioritize title, profession, one concise sentence, key CTA and at least part of the hero image where reasonably possible.
- Reduce excessive vertical gaps in hero, About and Speaking intro while maintaining readable type and touch target sizes.
- Use **one primary CTA** plus a secondary action as appropriate. Keep Blog accessible but visually subordinate.
- Preserve all 3 recent items per feed. Reduce perceived long scrolling with tighter cards, simple horizontal/compact layouts or an accessible scroller **only if it is genuinely usable and doesn't hide essential content**.
- No horizontal overflow, clipped text, inaccessible accordions or tiny clickable areas.
- Speaker Kit mobile: ensure bio selector, copying and original-image downloads remain clear without unmanageable scrolling.
- Account for keyboard navigation, accessible focus state, reduced-motion preference and no JavaScript failure cases when possible.

## 6. Workstream D — Natural bilingual copy and personality

- Review all newly changed EN/ES text with a natural, non-literal voice. Spanish should feel native and human, not mechanically translated.
- Proposed labels to consider: EN `Speaker Kit` / `Speaking resources`; ES `Recursos para eventos` or `Recursos para organizadores`. Existing `/es/` URL paths should remain stable.
- Preserve names of products, technical terms and official projects where they are actually proper names.
- Add small lines of Bruno-style humor only in suitable places (Speaking, robot, Beyond the Code, footer). **No em dashes** in drafted copy.
- The robot can deliver a few witty lines; don't turn it into a persistent animation or heavy visual distraction.
- Keep the discovered game a secret or subtle optional footer action; never interrupt content or accessibility.
- Review content hierarchy so the site reads like Bruno rather than a generic agency template.

## 7. Workstream E — SEO, assets, performance and verification

- Preserve metadata, canonical URLs, Open Graph, person/profile structured data, accessible alt text EN/ES, theme toggle and route translations.
- Add structured career/profile content to metadata only where supported by real facts. No false structured data.
- Ensure external links have accurate full URLs; no placeholders to unrelated profiles.
- For originals and derivative photos, check privacy-sensitive metadata stripping where appropriate for web _derivatives_. Do not modify source originals without permission.
- Implement responsive sizes / lazy loading for below-the-fold images; do not lazy-load hero content if it hurts LCP. Avoid massive downloads.
- Ensure automated feed updates still show 3 current items when feeds succeed and maintain fallback behavior on failure. Do not rewrite feeds without need.
- Validate all copy/download controls and ZIP. Run Astro build, TypeScript checks, lint and project tests using actual repository scripts.
- If feasible, run Playwright responsive screenshot checks at **desktop (~1440px)** and **mobile (~390px)** for EN and ES on home, About and Speaking; test both light and dark themes when available. Inspect screenshots for crops and spacing.
- Report any accessibility, build or test issues instead of claiming everything passed.

## 8. Suggested implementation order

1. **Audit & baseline:** inspect code, existing tests, actual assets, documentation and exact routes. Capture baseline screenshots. Inventory verified content and unresolved biography/CV facts.
2. **About / CV:** implement content model, career timeline, selected evidence, language parity and photo. Avoid fabricated data. Provide useful present-day content even if older experience is pending.
3. **Speaker Kit:** rebalance layout, photo previews, copy tools, package verification, editorial warning policy and topic links.
4. **Home / mobile:** improve Speaking prominence, consolidate copy, hero/mobile hierarchy and feed cards while preserving functional data integrations.
5. **Visual assets:** use existing photos first, optionally the actual `t2i` skill for subtle original robot/illustration or careful derivatives only when beneficial. Document derivatives.
6. **QA & screenshots:** run checks and compare desktop/mobile EN/ES views. Fix regressions.

## 9. Acceptance criteria (definition of done)

- [ ] Existing v0.2 pages and interactions still work; no major rewrite.
- [ ] First view immediately communicates Bruno's role and focus; no unnecessary visual clutter.
- [ ] `/about` has meaningfully richer CV-style content with a verified professional timeline _or explicitly documented missing records, without invented entries_.
- [ ] About tells a coherent human story and links to credible work and public profiles.
- [ ] CV download appears only when an actual reviewed PDF exists; no fake artifact.
- [ ] Homepage Speaking & Community is visually stronger and uses authentic imagery.
- [ ] Speaker Kit retains 6 bilingual biography variants, real photos and a valid downloadable ZIP.
- [ ] Official images derive from the exact three source paths above, and downloadable originals remain unchanged.
- [ ] Speaker Kit layout is balanced on desktop and easy to use on mobile.
- [ ] All copy controls work and provide accurate feedback.
- [ ] EN and ES versions are natural, complete and consistently navigable.
- [ ] 3 latest blog posts, podcast episodes and YouTube items still display correctly; GitHub projects and all links still work.
- [ ] Robot interaction and Bug Invaders still work, and no new heavy first-load scripts were introduced.
- [ ] No invented facts, metrics, roles, speaking history or photographic scenes.
- [ ] Builds and relevant tests pass, with failures clearly documented.
- [ ] Desktop and mobile screenshot evidence exists for home, About and Speaking in both languages.
- [ ] No changes deployed to production and no DNS/Cloudflare/WordPress changes.

## 10. Required Copilot handoff

At the end of implementation, provide:

1. concise summary of changed routes, components, content and visual assets;
2. actual verification commands and results, including any failures;
3. before/after screenshot paths for home, About and Speaker Kit at desktop/mobile, EN/ES;
4. explicit **verified facts vs. Bruno approval needed** checklist, particularly career dates, bio copy and CV;
5. list of official source images and generated/edited derivatives, including whether `t2i` was actually used;
6. any outstanding UI/technical work, with specific next actions;
7. confirmation that nothing was deployed or migrated.

## 11. Editorial guardrails

- **Bruno Capuano** is currently a Cloud Advocate at Microsoft, focused on AI and .NET, working with Azure, GitHub and developer communities.
- He builds public projects including `New Year New Bot` (https://github.com/elbruno/new-year-new-bot) and `PromptDot` (https://github.com/elbruno/PromptDot). Check current repo metadata before stating implementation progress or features.
- He participates in the Spanish podcast _No Tiene Nombre_ (https://notienenombre.com/).
- His professional public profile: https://www.linkedin.com/in/elbruno/.
- The homepage is a personal site, not an official Microsoft publication. Keep this distinction in the footer or appropriate legal copy.
- The domain's actual production cutover is a separate future task involving Network Solutions, Cloudflare Free and the WordPress blog's preserved legacy article links.

**Do not treat screenshot prototypes, placeholder metrics or previous AI-generated example text as independently verified professional facts.**
