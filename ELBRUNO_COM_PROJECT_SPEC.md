# elbruno.com — Master Project Specification for GitHub Copilot

> **Status:** Approved product and visual direction, implementation-ready specification  
> **Project:** Open-source personal homepage, professional profile, speaker resources, and developer playground  
> **Primary domain:** `https://elbruno.com`  
> **Default language:** English (`/`)  
> **Second language:** Spanish (`/es/`)  
> **Design reference:** `design-reference.png` (place alongside this document in the repository)  
> **Audience for this document:** GitHub Copilot coding agent, maintainers, and contributors

## 0. Instructions to GitHub Copilot

Build a real, deployable, production-quality website from this specification. **Do not stop at a wireframe or a static picture of a webpage.** Implement the site with working navigation, responsive layouts, real content models, accessibility, a bilingual UI, and automated content updates. Use the design reference as aesthetic inspiration, not as a pixel-perfect specification.

**First:** inspect the repository, existing scripts, available tools, and existing agent instructions. If the repository is empty, scaffold the application. Create a short implementation plan, then work through the phases in §17. Prefer small logical commits or independently reviewable changes. Build and test locally before declaring a phase complete.

**Crucial: this environment includes an image-generation skill called `t2i`.** Discover and read its actual instructions before invoking it. Use `t2i` to generate original, stylistically consistent visual assets identified in §11. Do **not** assume its command syntax, location, model, or parameters. Use the installed skill as documented. All generated assets must be committed under `public/assets/` with meaningful names, sizes optimized for the web, and descriptive alt text. If the skill is unavailable or fails, use tasteful CSS/vector placeholders and record the pending assets; do not block the implementation. Do not invent real photos of Bruno or falsely present a generated portrait as an authentic headshot.

**Accuracy guardrails:** Do not invent previous employers, dates, speaking appearances, certifications, awards, GitHub star counts, podcast episode numbers, view counts, professional metrics, biographies with unsupported facts, or contact details. Use verified provided facts and actual linked data. Unknown personal data should be represented by clearly labeled content TODOs or omitted from the public UI, never fictional filler. No em dashes in authored copy. Avoid misleading Microsoft endorsement/branding.

## 1. Product vision

`elbruno.com` is **Bruno on the Internet**: the canonical public entry point for Bruno Capuano, a Cloud Advocate working with developers and focusing on AI, .NET, Azure, and GitHub. It should be a fast, polished personal homepage, a trustworthy online CV, a useful resource for event organizers, and a playful place to discover projects and experiments.

The existing WordPress blog remains a separate publication. The Spanish-language podcast **No Tiene Nombre** retains its independent home. The new site connects these, GitHub, YouTube, LinkedIn, community work, and speaking appearances.

**One-sentence design north star:** *Professional enough to trust. Geeky enough to explore. Fun enough to remember.*

### Three reading depths

1. **10 seconds:** Visitors understand who Bruno is, his role, his technical focus, and where to go next.
2. **2 minutes:** Visitors see projects, speaking, blog, podcast, and real developer-community work.
3. **10 minutes:** Visitors explore the CV, speaker kit, videos, projects, personal interests, and hidden easter eggs.

**Priority:** The top viewport must remain **calm, legible, uncluttered, and immediately understandable**. Put discovery, features, and humor below the first impression. Do not overwhelm the first screen with stats, cards, animations, or feeds.

## 2. Audiences and jobs to be done

- **Developer:** Find AI/.NET/Azure/GitHub demos, projects, repos, technical posts, videos.
- **Event organizer:** Copy a correct English or Spanish bio, download approved headshots, find topics, prior talks, and a professional contact.
- **Community member:** Discover talks, streams, events, podcast, and ways to connect.
- **Recruiter / collaborator:** Understand professional background, skills, experience, impact, and obtain a current CV.
- **First-time visitor:** Quickly discover both professional competence and Bruno's playful personality.

## 3. Approved technical architecture

| Area | Decision |
|---|---|
| UI / site generation | Astro, modern TypeScript, semantic HTML, component-based styles |
| Rendering | Static site generation (SSG) by default; no always-on server |
| Styling | Well-organized CSS with design tokens, minimal dependencies; add a library only when justified |
| Hosting | Azure Static Web Apps |
| Source control | Public GitHub repository, open source |
| CI/CD | GitHub Actions: lint, type checks, tests, build, deploy |
| Domain registration | Network Solutions remains registrar |
| DNS and URL routing | Planned Cloudflare Free, with careful legacy redirect rules |
| Existing blog | Keep WordPress; desired future host `https://blog.elbruno.com` (subject to verified WordPress setup) |
| Podcast | Link to existing `https://notienenombre.com` |
| Languages | English default; Spanish equivalent with `/es/` prefixes |
| Dynamic content | Retrieve feeds / APIs at scheduled build time; publish static snapshots |
| Easter eggs | Lightweight client-side TypeScript, lazy-loaded |
| Content | Markdown, JSON, YAML, or typed data files in repository; no CMS/database in V1 |
| Analytics | Privacy-conscious, optional, disabled until configured |

Astro and the hosting workflow must be verified against current official documentation when implementing. Pin versions via a lockfile rather than guessing latest library versions.

### Proposed repository layout (adjust if existing conventions differ)

```text
/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── refresh-content.yml
├── public/
│   ├── assets/
│   │   ├── illustration/
│   │   ├── robot/
│   │   ├── game/
│   │   └── speaking/          # only verified and approved photo assets
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   ├── fetch-content.ts
│   └── validate-content.ts
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   ├── speaking.astro
│   │   └── es/
│   │       ├── index.astro
│   │       ├── about.astro
│   │       ├── projects.astro
│   │       └── speaking.astro
│   ├── styles/
│   │   └── tokens.css
│   ├── i18n/
│   ├── content/
│   ├── data/
│   │   ├── profile.ts
│   │   ├── featured-projects.ts
│   │   ├── speaking.ts
│   │   ├── social.ts
│   │   └── feeds/            # validated build-time snapshots
│   └── lib/
│       ├── feeds/
│       ├── seo/
│       └── game/
├── tests/
├── astro.config.mjs
├── package.json
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── design-reference.png
└── PROJECT_SPEC.md
```

## 4. Visual direction

**Reference:** previously approved full-page mockup (`design-reference.png`). Aim for its overall design language: spacious layout, lavender / .NET-inspired purple accents, subtle gradients, rounded cards, friendly technical illustrations, excellent typography, and professional clarity.

### Design characteristics

- Authentic **.NET purple** influence, with an original complementary palette: deep ink text, warm off-white or cool neutral surfaces, lavender cards, occasional cyan/blue/teal highlights.
- Light mode is the primary design; polished dark mode with a persistent-in-session/system-preference-friendly toggle.
- Elegant readable typography, restrained motion, strong contrast, clear visual hierarchy.
- Hoodie-clad **illustrated Bruno** plus a small friendly desk robot; this is expressive artwork, **not** an official portrait/headshot. For professional identity, include a real photo only once supplied/approved.
- Smaller playful details: robot, coffee, code, microphone, tiny space motifs; no cartoon overload.
- Cards and small metadata chips are appropriate below the fold; avoid a dashboard-like hero.
- Respect `prefers-reduced-motion`. Never autoplay distracting animations or audio.
- Use a responsive layout: large desktop, tablet, narrow/mobile. No horizontal overflow.
- Use real text for headings and body copy; do not bake content text into generated images.
- Avoid excessive terminal aesthetics, noisy gradients, heavy glass effects, or corporate-template clichés.

### Suggested starter tokens (tune during implementation)

```css
:root {
  --brand-600: #6336b5;
  --brand-500: #7948cf;
  --brand-100: #efe8fb;
  --accent-cyan: #4aa7c9;
  --surface: #fcfbff;
  --surface-soft: #f5f1fc;
  --text: #202037;
  --text-muted: #58576d;
  --radius-card: 1.25rem;
}
```

These values are design suggestions, not an official Microsoft/.NET brand identity. Ensure accessible contrast in both themes.

## 5. Information architecture and routes

### Actual pages

- `/` and `/es/`: homepage, English and Spanish.
- `/about/` and `/es/about/`: detailed professional biography, work history, CV, personal interests.
- `/projects/` and `/es/projects/`: curated projects with repositories, demos, technology tags, and context.
- `/speaking/` and `/es/speaking/`: Speaker Kit / Resources for Event Organizers.
- A friendly, properly localized 404 experience.

### Friendly outbound shortcuts (implement only after checking legacy URL collisions)

- `/blog` → WordPress blog host.
- `/podcast` → `https://notienenombre.com`.
- `/github` → `https://github.com/elbruno`.
- `/linkedin` → `https://www.linkedin.com/in/elbruno/`.
- `/youtube` → actual verified channel URL (configure, do not guess).

Outbound shortcuts should be implemented using hosting/edge redirects as appropriate, not broken client-side fallback pages. When routes collide with historical blog URLs, favor preserving old article links and use alternative new routes.

### Navigation

Logo: `elbruno.com`. Minimal main nav: **About, Projects, Speaking, Podcast, Blog**; an obvious **Contact** action if a verified method exists. Do not put every external platform in the top nav; place social destinations elsewhere. EN | ES switch must preserve the equivalent route where available. Mobile nav must be fully accessible.

## 6. Homepage content, in exact priority order

### 6.1 Above the fold: hero

Primary title: **Hi, I'm Bruno 👋**

Role line: **Cloud Advocate. Developer. Speaker. Podcaster. Professional tinkerer.**

Short overview (editable draft):

> I help developers build with AI, .NET, Azure and GitHub. I share practical demos, build things in public, and occasionally break them on stage.

Prominent actions: **Explore projects**, **Speaking resources**, **Read the blog**. Secondary visible links to GitHub / YouTube / LinkedIn can be compact and accessible.

An illustrated Bruno (hoodie) with desk robot may appear alongside the text without competing with the message. Display a small actual-photo avatar if an approved real image is provided. Optional tiny rotating personality descriptor, only if subtle and reduced-motion safe.

### 6.2 Bruno in 30 seconds

A concise paragraph plus four clear identity facts, e.g. **Cloud Advocate at Microsoft**, **AI + .NET**, **Speaker & community contributor**, **No Tiene Nombre podcaster**. These are descriptions, not inflated numerical metrics. Link to `/about/`.

### 6.3 What I do

Four focused cards: **AI & Agents**, **.NET & C#**, **Azure & Cloud**, **Developer Community / GitHub**. Each has one succinct human-readable explanation. Distinguish employer from technologies without making the page look like an official Microsoft site.

### 6.4 Featured work / Building in public

Curated cards for authentic projects, initially:

- **New Year New Bot** — https://github.com/elbruno/new-year-new-bot
- **PromptDot** — https://github.com/elbruno/PromptDot
- Other AI + .NET projects: choose only verified actual repos; make the third configurable.

Each card: meaningful description, why it exists, tags, GitHub link, optional demo, and relevant original art. Editorially curated ordering; do not sort featured projects solely by stars.

### 6.5 Speaking & Community

Short friendly introduction, e.g. **Sometimes I leave Visual Studio and talk to humans.** Link to the full Speaker Kit. Show 1–3 verified talks or official recordings when supplied. Only use counts (talks, countries, livestreams) if backed by trustworthy data.

### 6.6 Latest from GitHub

Show three chosen or recently active **real** repositories, pulling selected metadata when possible (description, language, stars, updated date). Never show made-up counts. Label the difference between curated repos and most recent activity. Cache data and provide graceful empty states.

### 6.7 Listen: No Tiene Nombre

Show the **three most recent podcast episodes**, derived from an actual verified podcast RSS feed. Titles remain in their original language, with localized surrounding UI. Each card: title, publication date, episode artwork if present, short plain-text summary, optional duration, and original listening link. Highlight podcast identity without recreating its branding inaccurately. Link to https://notienenombre.com.

### 6.8 Watch

Show three most recent public videos from Bruno's verified YouTube channel when available, with thumbnail, title and official link. May optionally distinguish livestream archives from uploads. Avoid fabricated views/dates/lengths. Graceful fallback to a featured manually curated video list or simple channel call-to-action if a feed fails.

### 6.9 Read

Show **three most recent WordPress blog posts**, derived from its real RSS feed. Each card: original title, date, brief sanitized summary, featured image when available and authorized, full original URL. When content is fetched after domain migration, use canonical targets at the new blog host; historic redirects must still work.

### 6.10 Beyond the Code

Short lighthearted personal-interest panel: tiny robots / hardware tinkering, running, podcasting. Keep it warm, human, and optional for visitors primarily seeking professional info.

### 6.11 Elsewhere + footer

Verified social / professional links: GitHub, LinkedIn, YouTube, WordPress blog, podcast, and other currently maintained profiles. Include an accessible contact option only when the actual address/form is approved. Footer can say:

> Built with coffee, C#, AI and questionable amounts of GitHub Copilot.

Avoid tracking by default. Add source link to the open-source website repository once its URL is known.

## 7. `/about/`: the online CV

This must work as a credible professional profile, without looking like a traditional corporate résumé template.

Required components:

- Two-paragraph long bio with verified career facts.
- Current role and technical specialization.
- Chronological experience timeline (actual employers / positions / dates supplied later; hide missing records).
- Technical skills grouped by practical domains rather than dozens of decorative skill bars.
- Selected notable engineering projects, community work, talks, podcasts, and publications.
- A brief **Beyond the code** section with personal interests.
- Verified, maintained **Download CV (PDF)** link. If no CV PDF has been provided or generated from verified data, omit/disable the link with a documented TODO, not a broken download.
- Links to GitHub, LinkedIn, speaking resources, and approved contact.

Separate factual profile content from UI translations so it can be updated easily. No invented biographical timeline.

## 8. `/speaking/`: Speaker Kit / Event Organizer Resources (high priority)

This section is a **first-class product feature**, not a generic speaking gallery. An organizer should find, copy and download approved materials with almost no friction.

### 8.1 Biography library

Provide six ready-to-copy **verified** biography entries:

- English: ~50, ~100 and ~200 words.
- Spanish: ~50, ~100 and ~200 words.

Offer language and length controls plus a working **Copy bio** button, with accessible feedback. Use a single source of truth for all bios and do not mechanically translate nuanced content without review. Initial bios can be clearly marked draft in source files but must not display inaccurate claims in production.

### 8.2 Headshots and media

- Thumbnail gallery of **actual, organizer-approved Bruno photographs**.
- Download formats / sizes appropriate for event sites, presentations, and social graphics. Include a useful naming convention and alt text.
- Never substitute AI-generated facial images as real media-kit portraits. If original photos are absent, show a friendly **Photos coming soon** state in the speaker kit and create a maintainer TODO.
- Optional event-safe illustrated avatar and robot mascot in a separate **Illustrations** area, clearly labeled as artwork.
- Image usage guidance (credit line if needed) and contact for special requests.

### 8.3 Other resources

- Short professional title / introduction in EN and ES.
- Speaking topics: AI agents, .NET, Azure, GitHub Copilot, developer tools and related verified focus areas.
- Links to selected actual past talks, videos, slide decks, or session catalog when supplied.
- Contact / invitation instructions with verified link only.
- One-click copy for title and bio text; meaningful downloads for media.

**Quality gate:** An event organizer should obtain a usable 100-word Spanish bio and suitable photo in under a minute, assuming the photo is available.

## 9. Internationalization (i18n)

- Default English at `/`; Spanish at `/es/`.
- Localized navigation, page headings, descriptive UI text, calls to action, metadata, dates, accessible labels, error states, speaker bios, and easter egg text.
- Use one robust typed localization strategy (Astro built-in routing where appropriate) and maintain translation parity.
- Preserve the visitor's current page on language toggle when a translation exists.
- Proper `lang` attribute, `hreflang` + canonical tags, locale-aware dates, and accessible language controls.
- Preserve the original language of blog-post titles, podcast episode titles and external video titles; do not falsely imply translated source content.
- Avoid duplicated layout logic for both languages.

## 10. Automated feeds and data reliability

The public website remains **statically generated**. Use a scheduled GitHub Actions workflow, approximately every six hours, plus `workflow_dispatch`, to fetch and validate content. Rebuild and redeploy **only when normalized content changes** where practical.

### Required sources

1. WordPress RSS: last three valid posts (real feed URL must be confirmed; after migration, `https://blog.elbruno.com/feed/` is only a candidate).
2. No Tiene Nombre podcast RSS: last three episodes (discover/verify the actual canonical RSS feed; do not guess its URL).
3. YouTube: last three verified public channel videos via channel feed or supported API; identify actual channel ID first.
4. GitHub public metadata: chosen/featured repos and optionally recently updated repos; use the official public API, with a read-only token only if needed to handle API limits.

### Data requirements

- Keep snapshot data in validated, typed JSON files so local builds and previews work without the network.
- Fetch remotely in a scheduled/pre-build ingestion step, **not** from every visitor's browser.
- Sort correctly by actual publication date, filter malformed/duplicate entries, limit to three.
- Normalize, sanitize, and safely truncate feed snippets. Avoid rendering arbitrary third-party HTML. Parse XML defensively, with timeouts and sensible response limits.
- Preserve last known good snapshot if a source is unavailable; log a clear warning and keep the site usable.
- Avoid committing secrets. Configure environment variables and document setup.
- Make content update scripts deterministic and idempotent. Include fixture-based tests.
- Show honest states when nothing has been configured yet. No dummy cards posing as published content.
- Do not rely exclusively on the scheduled workflow: scheduled GitHub Actions in public repos may delay or disable after long inactivity. Provide manual dispatch and clear monitoring/documentation.
- RSS content might refer to external assets. Use stable source URLs, sensible image fallbacks, and an explicit policy for remote images.

### Example normalized types (illustrative)

```ts
type ExternalEntry = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  summary?: string;
  imageUrl?: string;
  durationSeconds?: number;
  source: 'blog' | 'podcast' | 'youtube';
};

type RepositorySummary = {
  name: string;
  url: string;
  description?: string;
  language?: string;
  stars?: number;
  updatedAt?: string;
};
```

## 11. `t2i` skill: original visual assets

**Copilot must inspect and use the available `t2i` skill** to create visual elements when it is actually available. Treat these as a curated set, not permission to flood the entire site with stock-like images.

### Design language for all generated assets

Modern editorial vector/soft-3D illustration aesthetic with friendly shapes, clean silhouettes, .NET-inspired violet/lavender gradient palette, subtle teal highlights, high contrast, consistent soft lighting, uncluttered backgrounds, legible at small sizes. The images should visually belong to **one coordinated family**.

### Required assets to request from `t2i`

1. **Hero illustration:** friendly hoodie-wearing developer advocate in a cozy developer workspace with laptop/monitor, coffee, and a tiny friendly robot. Professional yet playful. Keep composition designed to sit to the **right of real HTML hero copy**. **Illustration, not a claimed faithful headshot.** Avoid unverifiable likeness if no user reference image is supplied.
2. **Robot mascot, base:** compact smiling desktop robot inspired by personal maker projects, original design, preferably transparent background. Must work at ~64px and larger.
3. **Robot expressions:** happy, curious, surprised, sleeping; use a consistent character design and dimensions, or derive variants from one character sheet. If the skill supports it, request transparent PNG/WebP.
4. **Bug Invaders sprites:** tiny original space ship, amusing bug enemies, projectile, explosion and optional pixel UI effects. Consistent pixel-art style suitable for lightweight Canvas drawing. Do not copy proprietary game art.
5. **Project illustrations:** subtle thumbnails for New Year New Bot, PromptDot, AI + .NET demos. Use distinct but harmonious motifs.
6. **Share image:** Open Graph/social card artwork for `elbruno.com`, without fake portraits or made-up achievements; use real text via HTML/SVG/image compositing if accuracy matters.

### Asset acceptance rules

- Appropriate transparent backgrounds where needed.
- Good visual consistency; consistent robot silhouette and face across variants.
- Optimize to WebP/AVIF or other web-efficient formats where supported, with responsive dimensions.
- Descriptive alt text for informative images; empty alt for purely decorative imagery.
- Never use generated illustrations as event headshots. Real event photos must come from Bruno.
- Track image-generation instructions and assets in `docs/visual-assets.md` for reproducibility.
- Prefer CSS icons / original SVG over generated images for tiny UI controls.

### Example prompt for t2i (adapt to documented syntax)

> Create a premium, warm, modern illustration for a developer advocate homepage. A friendly coder wearing a hoodie at a desk with a tiny expressive robot, coffee mug, and subtle developer tools. Lavender and rich .NET-inspired purple accents, gentle cyan highlights, clean backgrounds, cohesive contemporary editorial illustration, generous negative space for headline text placed separately in HTML, accessible contrast, no embedded words, no corporate logos, not a photorealistic portrait.

## 12. Easter eggs: two working hidden experiences

### 12.1 Bug Invaders (priority)

A small **original** arcade shooter: move a tiny space ship, shoot silly software bugs, earn points, survive escalating waves. Funny enemy labels / status messages referencing `NullReferenceException`, `404`, `Build Failed`, `Works on my machine`, etc. Keep gameplay fun rather than an enormous separate game.

**Discoverability:** secret activation by clicking the little terminal logo `>_` five times within a short period, and optionally the classic Konami Code (`↑ ↑ ↓ ↓ ← → ← → B A`). Avoid interfering with normal navigation and screen-reader use. Include a hidden but accessible path to start the game for users unable to execute key sequences, e.g. documented accessible control/shortcut reachable by assistive tech.

**Implementation:** TypeScript + Canvas 2D or lightweight DOM, **lazy-load on activation**. Keyboard controls (arrows / A-D, Space) plus large clear on-screen touch controls; pause/resume, restart, close, sound off by default, clear focus management in modal. No external trackers or leaderboard service. Local storage only for optional high score and theme preferences, with privacy-friendly handling.

**Accessibility:** Escape closes; reduced motion setting; descriptive instructions; accessible alternate interaction / game summary for people who cannot play twitch games. Avoid flashing rapidly. Keep the main homepage fully usable while the game is closed.

**Sample intro:**

```text
> initializing secret project...
> bugs detected 👾
> deploying tiny spaceship...
> PRESS SPACE TO START
```

### 12.2 Interactive robot mascot

A subtly discoverable robot in hero or footer. On click/tap, robot reacts and shows concise witty messages in the current language. Multiple interactions unlock additional expressions. No patronizing or overly chatty personality, no disturbing navigation, no chat backend required. Ensure button semantics, keyboard support, and reduced-motion behavior.

Optional footer note on About page:

> This is the professional version of my story. For the slightly less professional version, try clicking the robot.

## 13. SEO, social sharing, accessibility and performance

- Clear title/description per localized route; correct canonical and `hreflang` metadata.
- Open Graph and Twitter/X preview cards with an original consistent image.
- Structured data (`Person`, possibly `ProfilePage` where applicable), using real identity / verified `sameAs` links only. Avoid schema spam.
- Sitemap and robots.txt; correct 404s and no accidental indexing of placeholders or previews.
- Semantic headings, accessible landmarks, meaningful links, tab order, visible focus, WCAG AA color-contrast target, alt text, keyboard navigation, responsive touch targets.
- Mobile-first and responsive to small phones, tablets and desktops.
- Minimize shipped JavaScript; interactive game, robot effects, and other noncritical widgets load on demand. Avoid large framework hydration for static sections.
- Respect reduced motion, system color scheme, and reasonable data usage.
- Aim for strong Lighthouse accessibility, best practices, SEO, and performance; measure and document instead of promising arbitrary 100 scores.
- External links use safe `rel` settings where appropriate; clearly communicate outbound destinations.
- Content-Security-Policy and other hosting headers should be reviewed and applied without breaking feeds/assets.
- If using a contact form, require a concrete secure service and anti-spam approach; do not invent a functioning form.

## 14. Domain cutover and historical WordPress URLs: separate migration track

**Do not change live DNS as part of the initial code generation.** Existing public blog content currently uses `elbruno.com`, and historical links must be protected.

Target architecture:

```text
Network Solutions (domain registrar)
    │
    └── Cloudflare Free (planned authoritative DNS and edge routing)
         ├── elbruno.com         → Azure Static Web Apps homepage
         ├── blog.elbruno.com    → existing WordPress, if hosting/plan permits
         └── legacy blog paths  → path-preserving HTTP 301 redirects

notienenombre.com             → existing independent podcast home
```

### Migration prerequisites

1. Identify WordPress hosting type, plan, current canonical URL, sitemap, RSS and permalinks.
2. Export/inventory historical URL patterns, including old posts, `/category/`, `/tag/`, archives, media, `/feed/`, `/wp-content/`, and custom routes.
3. Check whether existing site uses email DNS records or services that must remain intact after moving DNS.
4. Move/reconfigure WordPress to `blog.elbruno.com` in a separately verified maintenance window.
5. Design **selective** redirect rules: old WordPress URLs must be redirected to their new exact path, **without redirecting the new homepage routes or causing loops**.
6. Decide and test any route collisions, especially historical `/about`, `/blog`, `/podcast` and asset paths.
7. Ensure new canonical links, WordPress sitemap, internal links, and cross-domain feed references are correct.
8. Configure Azure custom domain and certificate; test Cloudflare compatibility and routing.
9. Run a sampled and automated migration QA suite over historic URLs and status codes, then update Search Console properties/sitemaps.
10. Maintain redirects for the long term. Avoid a blanket `/*` redirect that would swallow the new site.

Do not assume DNS alone can route by URL path. Decide whether Cloudflare Redirect Rules / Bulk Redirects or a Worker is required after verifying patterns and current plan limits. Prefer the simplest correct setup. DNS remains at Network Solutions until a separately approved cutover; registrar continues to be Network Solutions afterward.

**Migration deliverables:** `docs/domain-migration.md`, testable redirect mapping strategy, rollback notes, DNS checklist, and cutover checklist. Do not attempt live account changes without explicit owner permission.

## 15. Content and factual-source inventory

Known sources / anchors:

- Public professional identity: **Bruno Capuano**.
- Current role: **Cloud Advocate** focused on **AI and .NET** at Microsoft; Azure / GitHub developer work.
- GitHub profile: https://github.com/elbruno
- LinkedIn: https://www.linkedin.com/in/elbruno/
- New Year New Bot: https://github.com/elbruno/new-year-new-bot
- PromptDot: https://github.com/elbruno/PromptDot
- Podcast home: https://notienenombre.com
- Current top-level domain: https://elbruno.com

**Require confirmation / discovery:** exact YouTube channel URL and ID, podcast RSS feed URL, current WordPress feed and hosting, real speaker headshot files, actual career timeline, event portfolio links, verified speaking session URLs, email/contact, approved 50/100/200 word bios, and downloadable CV.

Never ship fictional filler data; use a truthful omission or explicitly marked editorial TODO in source data.

### Content authoring style

- Professional but friendly, conversational, concise.
- First person is preferred for homepage copy.
- Short paragraphs and clear section headers; humor as a subtle second layer.
- No em dashes in public copy.
- Avoid fake enthusiasm and exaggerated achievements.
- Do not over-index on being a Microsoft employee; show the broader maker / community / developer identity.
- Keep English and Spanish copy idiomatic rather than literal machine translation.

## 16. Documentation and open-source contributor experience

Create:

- `README.md`: what this site is, tech stack, setup, environment variables, build/test, deployment, data refresh, i18n, contribution guide, and screenshot.
- `CONTRIBUTING.md`: adding projects, changing bios/photos, adding translations, verifying links, and reporting bugs.
- `LICENSE`: propose a suitable open-source code license but get owner approval before selecting; explain whether design assets / personal photographs have a separate license.
- `docs/visual-assets.md`: prompts used with t2i, provenance, and compression instructions.
- `docs/content-sources.md`: RSS/API sources, refresh pipeline, fallbacks, and manual refresh instructions.
- `docs/domain-migration.md`: staged domain migration, current-state audit, rules, and rollback.
- `docs/speaker-assets.md`: photo management and speaker kit editorial workflow.
- `.env.example`: only non-secret placeholders for necessary configuration.

Ensure no private contact details, access tokens, or unapproved photo licenses appear in the public repository.

## 17. Implementation plan: ordered milestones

### Phase A: Foundation, design system and bilingual skeleton

- Inspect repository, set up Astro/TypeScript, tests and linting.
- Create theme tokens, layout primitives, header/footer, EN/ES routing and metadata.
- Build polished responsive hero, “Bruno in 30 seconds,” “What I do,” and real-link navigation.
- Add static verified project and social data.
- Generate and integrate consistent `t2i` artwork as available.
- **Deliverable:** useful polished homepage, not a blank template.

### Phase B: Complete professional identity

- Create `/about`, `/projects`, `/speaking` and translated equivalents.
- Implement editable data schemas and copy-to-clipboard speaker bios (EN/ES, 50/100/200 words).
- Build real photo-download gallery using assets only when supplied.
- Implement verified CV and talking resources or honest pending states.
- **Deliverable:** a functional speaker resource page and online CV framework.

### Phase C: Automated content

- Discover and validate real RSS URLs, YouTube ID, and GitHub API fields.
- Implement feed ingestion, schemas, local snapshots, fallback and tests.
- Show last three blog articles, podcast episodes and videos; metadata-backed GitHub repos.
- Add scheduled/manual GitHub Actions refresh and conditional deploy.
- **Deliverable:** automated fresh content without a runtime backend.

### Phase D: Playful experiences

- Design original `t2i` sprite set and expressive robot assets.
- Implement lazy-loaded Bug Invaders and its two hidden activation paths.
- Implement click-reactive robot and bilingual one-liners.
- Add keyboard, touch, pause/close, and accessibility testing.
- **Deliverable:** delightful easter eggs that do not impair the core site.

### Phase E: Production polish and deployment

- Audit accessibility, SEO, privacy, responsiveness, bundle sizes and broken links.
- Add Azure Static Web Apps deployment via GitHub Actions and required documentation.
- Test on temporary hosting URL; do not cut over the live domain.
- Produce migration guide for Cloudflare / Network Solutions / WordPress legacy URLs.
- **Deliverable:** preview deployment ready for owner review before DNS cutover.

## 18. Acceptance criteria (definition of done)

- [ ] On first view, a visitor can identify Bruno, his role, and AI/.NET/Azure/GitHub focus in under 10 seconds.
- [ ] Homepage is visually clean, professional, funny in small ways, and close in spirit to approved design reference.
- [ ] English is the default; all required pages have idiomatic Spanish equivalents.
- [ ] Responsive across phones/tablets/desktops; light and dark themes work.
- [ ] Real projects, social links and professional facts; zero invented metrics or fake content.
- [ ] About page is an accurate online CV and offers verified professional information.
- [ ] Speaker Kit supports copyable 50/100/200-word EN/ES bios and approved downloadable headshots once supplied.
- [ ] Blog section shows the three newest valid RSS posts and their direct links.
- [ ] Podcast section shows the three newest valid episodes and their direct listening links.
- [ ] YouTube section shows the three newest verified public videos or an honest fallback.
- [ ] GitHub section uses real repository data and cached fallbacks.
- [ ] Scheduled content refresh works, can be manually dispatched, and survives source outages.
- [ ] `t2i` assets are original, cohesive and optimized; asset usage and provenance documented.
- [ ] Robot reacts on keyboard/touch and displays bilingual short messages.
- [ ] Bug Invaders is genuinely playable, discoverable, lazy-loaded, and does not block navigation.
- [ ] SEO metadata, sitemap, structured data, keyboard access, reduced motion and useful alt text are present.
- [ ] CI checks, tests, static build and Azure SWA preview deployment work.
- [ ] No production DNS changes, WordPress migration, or live redirect changes were performed without explicit approval.
- [ ] Domain migration document provides a credible plan to preserve historical blog URLs.
- [ ] Repo documentation allows another developer to run and contribute to the site.

## 19. Immediate Copilot task

Start with **Phase A**, but scaffold the architecture with the full product specification in mind. Establish the visual system and bilingual structure first. **Read the `t2i` skill documentation and generate the hero illustration and robot mascot early**, using the approved mockup as a visual reference. Implement real, accessible Astro components, not an image-based site. Maintain clear TODOs for unverified personal content. Then continue through phases B–E as far as the working environment allows, building and testing between phases.

When you encounter a missing credential, real photograph, unverified feed, career detail, or domain access, do not guess. Keep progressing on unrelated work and report precisely what information is needed to finish that part.

---

**Human-approved outcome:** a public, open-source, lightweight bilingual personal website that introduces Bruno quickly, showcases real developer work and community contribution, helps event organizers, automatically surfaces recent content, and rewards curious visitors with a tiny robot and a secret arcade game.
