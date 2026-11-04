# elbruno.com | v0.3 Launch-Readiness & Editorial Completion Plan

**Repository:** https://github.com/elbruno/elbruno-web

**Baseline:** current v0.3 implementation, not a rewrite

**Owner:** Bruno Capuano

**Status:** pre-production checklist and implementation brief for GitHub Copilot Agent

**Scope:** editorial accuracy, About/CV completeness, Speaker Kit readiness, functional QA, accessible/responsive polish, and _staging_ deployment readiness.

> **Product principle:** A visitor should understand who Bruno is and what he does in 10 seconds. An event organizer should be able to retrieve trustworthy, approved bios and authentic photos in under 2 minutes. Keep the .NET-purple aesthetic, StackChan personality, clean layout, and bilingual EN/ES experience.

## 1. Read this first: preservation, safety and scope

- **Audit the repository before editing.** Read project instructions, existing plans (particularly `V03_IMPLEMENTATION_PLAN.md` if present), actual Astro components/routes, data/content files, package scripts, tests, `.github/workflows`, asset sources, and screenshot automation.
- Preserve the existing site structure and working functions: home, About, Projects, Speaker Kit, English default `/`, Spanish `/es/`, theme toggle, dynamic-at-build blog/podcast/YouTube/GitHub content, lazy-loaded StackChan/robot interactions, Bug Invaders, and existing links.
- **Do not redesign from scratch.** Prefer small focused changes and reuse current styling/components. Preserve the hero photo with StackChan and .NET-inspired purple gradients.
- **Do not invent** former employers, job titles, job dates, education, awards, speaking metrics, testimonials, event participation, CV entries, email addresses, or photo permissions.
- **Never silently treat AI-written bios as approved.** Approval must come from Bruno. Prepare editable draft copy and an explicit review checklist.
- Do not change registrar/DNS, Cloudflare rules, WordPress domains, the live `elbruno.com` site, or any production setting. A staging preview is permitted **only if an existing staging workflow/credentials are already configured and executing it is safe and explicitly part of the local workflow; otherwise prepare but do not deploy**. Never make a production cutover.
- Keep raw images unchanged. Avoid committing sensitive photo metadata or additional third-party photos without clear rights. Open-source code licensing does not automatically grant reuse rights to personal photography.
- The `t2i` skill can **generate and edit** images; discover and read its actual instructions if visual changes are genuinely necessary. Preserve photo identity and real-world event context; do not fabricate headshots/events. This task is primarily editorial and QA, so do not generate art unnecessarily.
- Do not add fictional content, placeholder links or misleading visible TODOs to a public site. Use private/editorial documents for unresolved facts.

## 2. What was observed in the v0.3 screenshot review

Source screenshots supplied by Bruno as `v03-review-screenshots.zip` (Copilot may find matching `screenshots/v03-review/` in the repo). The capture report states Playwright checked 8 localized routes at 1440x900 and 390x844, with no broken images, horizontal overflow, missing localized headings or browser console errors during those captures. **These are screenshot checks, not proof of all functionality or accessibility.**

### Strengths to retain

- Hero clearly introduces Bruno, with a strong authentic StackChan photo.
- Clean typography, light theme and purple developer identity.
- Responsive two-language route structure.
- Speaker Kit has working-looking EN/ES bio selection and original-photo download UI.
- Homepage surfaces projects, GitHub, podcasts, video and blog content.

### Remaining gaps

1. **About is not yet a complete professional CV.** It mainly describes Bruno's current Microsoft role rather than verified career history. Build a useful evidence-backed timeline without making up missing entries.
2. **Speaker biography approval notices** appear in screenshots. Review actual status; do not remove the notices or claim approved bios until Bruno approves. Replace visible review copy with approved final text once approved.
3. **Media permissions** need a clear policy. Separate the ability to download from authorization to reuse; include a proposed usage note pending Bruno approval.
4. Projects page is relatively sparse; enrich **only with verified** real projects and links.
5. Mobile homepage is lengthy. Make small targeted compactness improvements after measuring, without hiding any of the three latest feed items.
6. Test actual interactions and production build, not just layout screenshots.

## 3. Priority P0: editorial data, About and CV

### 3.1 Content source audit

Check the repository's current data and available public sources. Useful **candidate** sources, not proof of all career claims:

- https://www.linkedin.com/in/elbruno/
- https://github.com/elbruno
- https://github.com/elbruno/new-year-new-bot
- https://github.com/elbruno/PromptDot
- https://notienenombre.com/

If a source is inaccessible, note that limitation. Do **not** reverse-engineer prior employers/dates from guesses, screenshots, unverified snippets or sample marketing copy.

Create/update `docs/editorial/CONTENT_APPROVAL_CHECKLIST.md`, with a table for every personal claim: claim, source, verified/unverified, approval needed, page, proposed action. Include a clear **BLOCKED BY OWNER** list for missing historical employment dates, prior roles, official career accomplishments and final CV PDF, when missing.

### 3.2 About as a professional story

Keep the current clean layout and official headshot, but improve the content model:

- Headline in English and idiomatic Spanish. Consider EN `Developer by trade. Curious by default.` and ES `Desarrollador. Curioso por naturaleza.` if not already used.
- A concise personal introduction focused on AI, .NET/C#, Azure, GitHub, developer advocacy and hands-on public experiments.
- **Career & Experience** section backed by structured bilingual data (organization, title, dates, description, verified source). Show verified records only. Current known role is Cloud Advocate at Microsoft, focused on AI and .NET. **Do not manufacture a career timeline from only one role.** If older entries are not verified, show a useful current-role section and leave a private editorial task.
- **Selected Work / Impact:** 2-4 demonstrated outcomes with verifiable links to projects, sessions, videos, writings, community work. Avoid counts without verified source.
- **Technical focus:** AI agents, .NET/C#, Azure/cloud, GitHub Copilot, dev communities; no proficiency levels unless grounded.
- **Beyond the Code:** keep real personal photos and authentic running/robot/Ace copy; keep it compact and human.
- Only add a `Download CV` control if an actual reviewed CV PDF is supplied or generated from fully verified/approved data. Otherwise no dead control and note the missing CV in checklist.

### 3.3 Professional facts vs approval

Output two clearly labeled groups: `Verified and safe to publish` and `Requires Bruno approval`. Do not present `publicly findable` as equivalent to `approved personal bio`.

## 4. Priority P0: Speaker Kit editorial and licensing readiness

### 4.1 Official photos, exact paths

Use these existing repo-relative source files (do not rename or change original bytes):

- `tmp/photos/21-11 Bruno Headshot for Msft.jpg`
- `tmp/photos/22-01 Bruno speaking in Podioum 1.jpg`
- `tmp/photos/22-01 Bruno speaking in Podioum 2.jpg`

**`Podioum` is intentionally preserved in original filenames.** Derived web-optimized filenames may be normalized; map back to sources. Do not replace photos with `t2i` images. Confirm displayed previews, full-size downloads, responsive crops, dimensions and ZIP contents.

### 4.2 Six copyable biography variants

Keep 50/100/200-word versions in **English and Spanish**, including switcher, copy button, and (if implemented) copy-introduction and copy-speaker-details actions. Verify their word counts are reasonable and their facts accurate. Treat existing texts as **drafts** until owner approval. Store text centrally and make it easy for Bruno to edit. Provide an editorial approval file containing all six variants without introducing invented career details.

**Do not remove approval notices just to make screenshots look finished.** Instead, if unapproved, decide on one of these non-misleading states:

1. Keep a short factual public introduction and make longer drafts internal-only until approval; **or**
2. Keep clearly labeled draft bios only on the private staging environment, not in public release output.

Record chosen approach and release blocker. After Bruno explicitly approves the final text, remove unnecessary visitor-facing editorial banners and use those approved versions.

### 4.3 Photographer rights and usage guidance

Do not assert that images are free to use. Draft a neutral concise `Speaker media usage` statement for Bruno to approve (e.g. event organizers may request permission and attribution details; use requires appropriate rights). Do not add a license or permission grant without Bruno's decision. The ZIP should include an accurate README noting image ownership/usage **only as approved**. Test download and extraction of the ZIP. Maintain separation between code license and personal visual assets.

### 4.4 Speaker Kit UX

- Preserve compact desktop grid for three official photos; use original headshot aspect ratio without cropping chin/forehead awkwardly.
- Verify mobile layout for biography selector, copy controls, full-size downloads and ZIP.
- Make it easy to copy a selected approved bio and an absolute headshot URL, where permitted.
- Keep clear link to Bruno's professional profile: https://www.linkedin.com/in/elbruno/.
- Confirm all links resolve correctly in both languages.

## 5. Priority P1: Projects, homepage and mobile improvements

- Keep the hero and its existing visual language. Do not introduce additional giant portraits, animation-heavy backgrounds or unnecessary cards.
- Improve Projects **only** with existing, verifiable public repositories and meaningful brief explanations. Prioritize `New Year New Bot` and `PromptDot`; add other projects only where repo evidence supports them. Remove invented stars, results, technologies or roadmap statuses.
- In mobile view, target actual unnecessary whitespace, padding and overly long card summaries. Do not hide a feed item behind inaccessible carousels or sacrifice 44px-ish touch target comfort.
- Preserve all 3 most recent podcast episodes, 3 blog posts, 3 videos, and the GitHub curated/updated content as currently designed. Verify live build-time feed failure and fallback behavior if feasible, without calling external APIs from browser unnecessarily.
- Preserve small playful details, robot and Bug Invaders without front-loading game assets. Avoid prominent game links if they undermine the easter-egg concept.
- Polish EN/ES copy for natural language; no em dashes in new site copy.

## 6. P0 functional QA and release gates

Run commands that **actually exist** in `package.json` and document exact output. Do not claim tests passed without executing them. At minimum inspect and run where configured:

1. Install dependencies with lockfile-respecting command.
2. Production Astro build and type checks; lint if configured.
3. Playwright test suite; expand targeted tests for actual _behavior_:
   - EN/ES language toggle preserves equivalent route when possible, correct `html[lang]`, labels and links.
   - Theme toggle persists/works as implemented and maintains contrast.
   - Mobile menu opens/closes, keyboard focus is visible, Escape handling where relevant.
   - Speaker bio length and language selector work; clipboard copies expected current text.
   - Each photo download returns expected original and correct MIME/size; ZIP returns 200, extracts, and contains all three unchanged photos and approved materials only.
   - External links use correct destinations and no dead placeholders.
   - Bug Invaders can launch, accepts input, can close, and does not trap keyboard focus.
   - Robot interaction works and respects reduced-motion preference.
   - RSS/build-time content and fallback show three items where sources make them available; errors are handled gracefully.
4. Run an accessibility test (axe or available equivalent) on EN/ES Home, About, Projects, Speaking; manually evaluate headings, alt text, language, focus, keyboard and color contrast. No critical/serious violations before staging release.
5. Perform a basic Lighthouse or equivalent performance audit on production build, at minimum mobile homepage, checking LCP, CLS and large image downloads. Avoid fabricated scores. Report actual metrics and test environment.
6. Playwright screenshot comparisons on `/`, `/es/`, `/about/`, `/es/about/`, `/speaking/`, `/es/speaking/`, `/projects/`, `/es/projects/` at desktop 1440x900 and mobile 390x844. Check dark theme (at least home and Speaking) and visually review actual crops and spacing. Reuse `screenshots/v03-review/capture.mjs` if available; save results to `screenshots/launch-review/`.
7. Validate SEO basics: canonical URLs for each localized route, `hreflang` EN/ES where applicable, titles/descriptions, OG preview imagery, sitemap/robots behavior, no false metadata. Staging must be clearly excluded from indexing when appropriate; do not accidentally set production `noindex`.
8. Confirm no console/page errors, broken images, failed same-origin requests or horizontal overflow in tested routes.

Where testing is unavailable due to missing browser binaries, credentials or external feeds, report **NOT RUN / BLOCKED** with reproduction steps, not a pass.

## 7. Staging and legacy URLs: prepare, don't cut over

Intended architecture remains:

- `elbruno.com`: Astro frontend on Azure Static Web Apps.
- `blog.elbruno.com`: existing WordPress blog **after** controlled domain migration.
- `notienenombre.com`: independent podcast.
- Domain registrar: Network Solutions; Cloudflare Free planned for DNS/redirects.

This brief does **not** authorize a DNS change or a live deployment. Prepare a separate `docs/release/LAUNCH_RUNBOOK.md` with:

- Existing hosting/build configuration and environment requirements.
- Steps to validate **temporary staging URL** (if available) without switching domain.
- Site smoke checks and an explicit owner go/no-go sign-off.
- Pre-migration inventory of old WordPress URLs and RSS URLs; preservation of article path/query/SEO with audited HTTP 301 redirects. Do not assume a blanket catch-all 301 is correct because the new homepage also claims paths. Include a conflict/allowlist analysis and rollback plan.
- Cloudflare nameserver cutover caution: preserve/export existing DNS records, especially email MX, SPF, DKIM, DMARC, and any services; do not instruct users to flip nameservers as part of the code task.
- Confirm actual WordPress hosting and availability of custom subdomain and current permalink behavior before any changes.
- Post-cutover verification checklist for canonical, robots, redirects, feeds, HTTPS and search indexing.

No production changes in this run.

## 8. Deliverables to commit

1. Small, focused code/content improvements for the issues above, with EN/ES parity.
2. `docs/editorial/CONTENT_APPROVAL_CHECKLIST.md` with verified claims, pending facts, six bio texts for review, permissions questions and owner decisions needed.
3. `docs/release/LAUNCH_RUNBOOK.md` with staging smoke tests, preflight, migration/rollback plans **without executing production migration**.
4. Automated behavior/accessibility tests and updated screenshot artifacts in `screenshots/launch-review/` (or configured artifact outputs; avoid huge binaries if repo policy excludes them).
5. `docs/release/QA_REPORT.md` with exact commands, test results, verified links, known gaps, performance findings, and risks.
6. Optional `docs/editorial/CV_SOURCE_DATA.md` template for Bruno to complete, clearly distinguishing verified facts and blank required history. **Do not generate a placeholder CV PDF.**

## 9. Definition of done / acceptance criteria

- [ ] The existing v0.3 visual identity, language routes, hero photo and content feeds are preserved.
- [ ] About has more useful verified material; missing previous roles are documented instead of invented.
- [ ] Speaker Kit official three photos are present with working individual/ZIP download and unmodified original bytes.
- [ ] All six bios are internally reviewable; approval status is explicit and not misrepresented publicly.
- [ ] Media reuse/credits language is not invented; owner permissions questions are captured.
- [ ] Every public claim, achievement and new project is backed by a verified source.
- [ ] EN/ES text and navigation pass QA; mobile content is readable and functional.
- [ ] Actual interaction tests, image/download checks and accessible keyboard flows have run (or blockers are clearly recorded).
- [ ] Production build and configured tests run with exact outputs in QA report.
- [ ] Fresh EN/ES desktop/mobile screenshots are captured and reviewed.
- [ ] No production, Cloudflare, DNS, WordPress or registrar changes occur.
- [ ] A **GO / NO-GO** checklist is left for Bruno, with explicit owner approvals blocking launch where required.

## 10. Required Copilot final report

Return these headings:

- **Implemented:** files/routes changed and why.
- **Validated:** actual commands, pass/fail results and URLs checked.
- **Screenshots:** real file paths to contact sheets and individual captures.
- **Facts verified:** source links.
- **Needs Bruno's approval:** career history, CV facts, biography text, image usage/credits, any unverified talk/project claims.
- **Release decision:** `READY FOR STAGING REVIEW`, `BLOCKED`, or `READY FOR OWNER GO/NO-GO`, with specific reasons.
- **No production changes:** confirm that live infrastructure was untouched.

Never claim production-ready merely because screenshots look good. Prioritize a reliable, truthful, maintainable personal site over visual novelty.
