# elbruno.com — v0.2 Implementation Plan for GitHub Copilot

**Repository:** https://github.com/elbruno/elbruno-web

**Date:** 2026-11-04

**Type:** Incremental implementation plan on top of existing v0.1

**Branch suggestion:** `feature/v02-visual-identity-speaker-kit`

> **North star:** Within 10 seconds, visitors should understand who Bruno Capuano is: a Microsoft Cloud Advocate working with AI, .NET, Azure and GitHub, an open-source maker, a speaker and community contributor with a playful personality. The site should be clean, fast, bilingual and genuinely useful as an online CV and event organizer resource.

## 1. Instructions to Copilot Agent

1. **DO NOT start from scratch.** Read `README.md`, `ELBRUNO_COM_PROJECT_SPEC.md`, `design-reference.png`, existing code, components, tests, and `PHOTO_SELECTION.md` if present. Inspect the current implementation before planning edits.
2. The v0.1 README describes working Astro + TypeScript, EN/ES routes, feed snapshots, About, Projects, Speaker Kit, the interactive robot, Bug Invaders, Playwright tests and Azure preview infrastructure. **Preserve working features**. Fix only what must change for v0.2.
3. Inspect actual photos in `tmp/photos/`; verify existence, original dimensions, cropping opportunities and EXIF/GPS metadata. The three official event photos below are the latest authoritative inputs.
4. **Discover and read the actual `t2i` skill instructions before invoking it.** This skill may generate AND edit images, but v0.1's README reports it was unavailable to the earlier agent. Do not invent command names or claim it ran. If unavailable, preserve existing illustrations, document the blocker and continue with non-`t2i` work.
5. Make incremental, reviewable changes on a feature branch, not an unrelated rewrite; test and document what you change.
6. Do not deploy to the production `elbruno.com` domain or modify DNS, WordPress, or Cloudflare in this pass.

## 2. v0.2 priorities and design rules

- Keep the approved visual direction: inspired by .NET purple, subtle gradients, crisp readable typography, light/dark themes, friendly rounded corners and restrained decorative elements.
- The first viewport clearly communicates **Bruno Capuano**, **Cloud Advocate at Microsoft**, **AI + .NET + Azure + GitHub** and a clear path to projects, speaking and blog.
- Preserve a hoodie-wearing illustration, small cute robot and humor, but avoid visual noise. Prefer one dominant hero image, not a photo and an illustration competing at the same scale.
- Real photos demonstrate real work and personality. Generated art expresses creative personality. Never present generated imagery as a photograph of a real event.
- Keep English default and full Spanish translations for headings, image descriptions, buttons, download labels and user feedback.
- No invented metrics, career dates, job history, event attendance, follower counts or awards. Existing bios remain drafts until owner approval.
- Use source photography selectively. Aim for **3–4 authentic photos across the homepage**, with more on `/about/` and `/speaking/`.

## 3. Exact filenames: official Speaker Kit media

These **three literal filenames supersede any older review that says a headshot is missing**. All source paths are relative to repo root, not to a local `D:\\` directory. Preserve the exact spelling `Podioum` and spaces in filenames.

| Exact source path                                  | Role                                | Placement                                                          |
| -------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| `tmp/photos/21-11 Bruno Headshot for Msft.jpg`     | **Official headshot**               | Primary speaker photo, press/organizer downloads, optionally About |
| `tmp/photos/22-01 Bruno speaking in Podioum 1.jpg` | Speaking photo 1, expressive/casual | Speaker Kit and `/speaking/` gallery                               |
| `tmp/photos/22-01 Bruno speaking in Podioum 2.jpg` | Speaking photo 2, gesturing/action  | Speaker Kit and `/speaking/` gallery                               |

**Non-negotiable requirements:**

- Do not overwrite, rename or generatively replace the source files.
- Generate web-optimized previews and multiple crops separately, while retaining correct links to high-quality downloads.
- Provide prominent individual download actions and an **entire Speaker Kit ZIP** with these **three official** photos, approved or clearly marked draft biographies in EN and ES, and a small media-usage README. Don't accidentally include other files from `tmp/photos/`.
- Inspect metadata; keep originals intact as masters, but remove GPS/sensitive EXIF from the **publicly downloadable copy** and web derivatives. Preserve real-world context in photos.
- Describe the headshot as the official headshot; label podium photos appropriately rather than as headshots.
- Do not assume publicly visible personal images are licensed under the site's open-source code license; document media rights separately.
- Verify exact paths exist. If any of these images is missing in the agent's environment, report the missing path and continue with other tasks, rather than creating a substitute.

## 4. Existing 25-photo library: editorial placements

All are repo-relative paths under `tmp/photos/`. Verify paths before using them; `PHOTO_SELECTION.md` contains the full review when available.

| Photo (literal source filename)              | Recommended placement                            | Why                                                                         |
| -------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| `26-11-bruno hold stackchan.jpg`             | Hero candidate or About                          | Bruno with a real robot; personal, immediately recognizable, maker identity |
| `25-10-AITour Ottawa.jpg`                    | Homepage Speaking teaser and `/speaking/` banner | Speaker presenting at real event                                            |
| `20-09-Bruno-Mina Clavero.jpg`               | Speaking/community                               | Real audience and accessible personality                                    |
| `25-09 bruno bsas data day.jpg`              | About/community                                  | Human, real event context                                                   |
| `23-05 bruno at london reactor.jpg`          | Speaking gallery                                 | Stage and developer community                                               |
| `24-10-bruno ai tour new york.jpg`           | Speaking gallery                                 | Audience perspective                                                        |
| `26-09-bruno mina clavero AI Day.jpg`        | Optional community gallery                       | Event collaboration; avoid unsupported identification of others             |
| `26-06-Bruno Ultra Runner 50K.jpg`           | About/Beyond the Code                            | Running and endurance                                                       |
| `24-11 Bruno finishied Chicago Marathon.jpg` | About/Beyond the Code optional                   | Personal achievement                                                        |
| `23-09 bruno with ace best pup ever.jpg`     | About/Beyond the Code                            | Warm, personal moment with Ace                                              |

The **preferred starting hero** is the real StackChan photo, with the hoodie illustration reduced to a small visual accent or used on About. However, compare actual desktop/mobile compositions and choose whichever better communicates Bruno's role in the first 10 seconds. Do not use all 25 images or make a large auto-playing gallery.

## 5. `t2i`: creation **and editing** workflow

### 5.1 Skill discovery

- Find `t2i` via the environment's documented skill discovery process and read its actual instructions.
- Determine whether the available skill supports image generation, image editing/reference images, transparency and output constraints. Use only supported operations.
- The previous agent reported `t2i` not installed; **if it remains unavailable**, document exactly what was attempted and use existing illustrations / deterministic photo processing. Never fake an image generation run or block all other work waiting for the skill.

### 5.2 Generation requests, when supported

- A cohesive illustrated **Bruno-inspired character wearing a hoodie** and friendly tiny desktop robot, in the approved .NET-purple style. Illustrated, not a synthetic official headshot.
- Robot expressions (happy, idle, curious, debugging) with a unified recognizable design, only if they improve current components.
- Optional arcade assets for Bug Invaders (spaceship, cartoon bugs, explosions), maintaining the existing game mechanics, accessibility and lazy loading.
- Tasteful small visual accents and social/Open Graph visual(s). Avoid decorative image overload, incorrect generated text or fabricated logos.

### 5.3 Image editing requests, when supported

`t2i` may edit **copies** of real photographs to harmonize presentation, while retaining authenticity:

- **Official headshot:** restrained exposure/white balance improvement, background tidying and 1:1 / 4:5 variants, keeping facial identity, expression, skin texture and professional credibility.
- **Podium photos:** crop, straightening and subtle lighting/contrast; keep real backdrop, people, gestures, podium and visible event context. Do not invent attendees or remove identifying evidence.
- **StackChan hero:** test landscape/square composition for responsive layout; preserve Bruno's appearance and the actual robot; do not fabricate a different office/event.
- **Running and Ace photos:** faithful crops/color harmonization while retaining real environment and participants.

For simple exact crops/resizing/color correction, deterministic image processing may be more reliable than generative editing. **Never modify the source photo in place**. Evaluate the resulting edit visually and discard artifacts or materially misleading changes. Label outputs as edited/derived in an asset manifest.

### 5.4 Asset technical requirements

- Reuse `design-reference.png` for style and layout reference. Suggested accent starting point: `.NET purple #512BD4`, refined for contrast and light/dark usage.
- Preserve original photographs and generated source assets. Put optimized output in the existing project asset conventions, for example `src/assets/photos/` and organizer downloads in `public/downloads/speaker/` if suitable.
- Prefer Astro optimized image handling when compatible; generate responsive WebP/AVIF variants as appropriate, `srcset`, `sizes`, dimensions and bilingual meaningful alt text.
- Avoid upscaling as a default, strip sensitive EXIF/GPS from public outputs, prioritize hero/LCP and lazy-load below-fold photos.
- Add `docs/photo-asset-manifest.md`: original source, derivative(s), dimensions, role/route, original vs edited vs generated, alt EN/ES, usage rights/credits and processing notes.
- Do not include personal photos in the repository's general code license by implication. Explain event organizer use separately in `docs/media-usage.md`.

## 6. Speaker Resources: v0.2 quality bar

Work on the existing `/speaking/` and corresponding actual Spanish route after inspecting routing (do not guess localized slug).

- Clear **For Event Organizers / Recursos para organizadores** navigation or prominent link.
- Speaker card: verified name and Microsoft Cloud Advocate role, focused short summary and official headshot.
- Three individual **real photo** previews with visible and keyboard-accessible download actions, dimensions/file sizes where useful.
- Reproducible **Speaker Kit ZIP** with exactly the three official photos, 50/100/200-word bios in both languages, instructions and verified public URLs. If bios are still drafts, clearly note approval status in the bundle; don't imply final editorial sign-off.
- Six existing EN/ES copyable bios: retain and improve presentation, verify content and approximate word counts, robust clipboard/fallback and accessible announcement.
- Speaking topics, verified past presentations, a usable organizer contact path. No guessed personal email or dead forms.
- Clear licensing/usage notes, download naming and photo authenticity. Limit downloads to explicitly intended images.
- Do not invent talk counts, conference stats or job-history details.

## 7. Homepage / About / Projects refinements

**Homepage**: preserve “Bruno in 30 seconds” and strong intro. Lead with one visual focal point and high-clarity text. Use real Speaking photo teaser and maybe a small personal teaser. Keep the robot and hidden game unobtrusive. Validate both languages and 320px mobile first.

**About / Online CV**: verify timeline; avoid fictitious roles or years. Add an intentional real photo story (speaking/community, running, Ace, robot maker). Only offer a downloadable CV if an approved actual CV file exists; otherwise don't render a broken or imaginary PDF link.

**Projects**: keep real repository links and real descriptions, project technology, contribution and proof. Avoid made-up stars/view counts or fake screenshots.

**Easter eggs**: preserve current trigger paths, game input methods, reduced-motion behavior and lazy-loaded JavaScript. Visual updates must not regress functional play or degrade accessibility.

## 8. Phased implementation and acceptance

### Phase 0: Audit first

- [ ] Examine package scripts, source tree, current UI, tests, README and existing assets.
- [ ] Check exact existence, size and metadata of the three official files and selected 25-photo inputs.
- [ ] Record whether `t2i` can actually be discovered and invoked for generation and edits.
- [ ] Baseline desktop/mobile screenshots and tests before visual modifications when possible.

### Phase 1: Speaking Kit first

- [ ] Build real official headshot and podium photo previews, safe web/download variants, localization, and appropriate attribution/rights notes.
- [ ] Provide individual photo downloads and reproducible ZIP with correct three images plus EN/ES bios.
- [ ] Verify archive contents, filename behavior with spaces, data integrity and no leaked GPS metadata.
- [ ] Add meaningful automated tests for organizer downloads and routes.

### Phase 2: Authentic personal visual identity

- [ ] Decide and implement a clean hero composition using StackChan photo or hoodie illustration as the main visual, not competing giant portraits.
- [ ] Place selected Speaking, community, running and Ace photos sparingly in intended sections.
- [ ] Update bilingual alt text, mobile cropping, performance settings and dark/light theme visual coherence.

### Phase 3: Optional `t2i` enhancement

- [ ] Generate small cohesive mascot/illustration/game/social assets if useful and skill genuinely available.
- [ ] Edit derived photos faithfully when this improves quality, document real vs edited assets.
- [ ] If unavailable, save optional prompts, preserve working visuals and report the limitation.

### Phase 4: Verification and documentation

- [ ] Run the actual scripts in `package.json`; v0.1 README documents `npm ci`, `npm run validate`, `npm run build`, `npm run format:check`, `npm run test:e2e` (after Playwright browser installation).
- [ ] Check width 320/390/768/1024/1440, focus/keyboard behavior, theme toggle, locale switch, downloads, copy controls, robot and Bug Invaders.
- [ ] Check no unexpected CLS, oversized hero image or eagerly loaded heavy images. Report measured results, don't invent Lighthouse scores.
- [ ] Document asset lineage, photo rights, pending biography approvals, real CV status and actual `t2i` usage.
- [ ] Provide screenshots of home, About, Speaking for EN/ES and mobile/desktop when practical.
- [ ] Avoid DNS, domain cutover, production deployment or new paid services.

### Definition of done

1. A first-time visitor identifies Bruno and his AI/.NET/Cloud work in under 10 seconds.
2. All 3 **exact official photos** are present on Speaker Kit, with real individual downloads and correctly populated ZIP (or precise file-missing blockers).
3. The homepage is uncluttered, uses photography authentically and preserves purple/hoodie/robot identity.
4. EN/ES, responsive/mobile, accessibility and existing v0.1 features remain functional.
5. Source photo masters are unchanged, public derivatives/downloads do not leak GPS metadata, photo rights are documented separately from code license.
6. All generated/edited assets have traceable provenance; `t2i` usage is truthful and documented.
7. The existing tests and build pass, or failures are reported with exact commands/logs.

## 9. Copilot final response requirements

Report: (1) files changed and visual decisions; (2) exact photos found/missing, uses and output paths; (3) Speaker Kit ZIP content and download path; (4) `t2i` skill availability and exactly which generation/edit operations were performed; (5) tests/validation and screenshots; (6) remaining user-editorial approvals (bios, career timeline, image rights, CV, contact). Create commits or PR if supported, but **do not publish to production**.

## 10. Content and implementation priority

Do not let `t2i` generation distract from a working official Speaker Kit and a clear homepage. The best v0.2 is a trustworthy, polished evolution of v0.1, not a large new gallery or a rewritten app.
