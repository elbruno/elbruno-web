# elbruno.com — v0.7 Consolidated Review & Launch Hardening Plan

**Status:** Implementation specification for GitHub Copilot Agent

**Date:** 2026-11-05

**Repository:** https://github.com/elbruno/elbruno-web

**Current staging URL:** https://ambitious-island-06cc6160f.3.azurestaticapps.net/

**Future production:** https://elbruno.com/

**Sources:** `elbruno-com-review-v01.md` (Claude) and `reporte_de_revisi_n_y_mejoras_nuevo_sitio_personal_elbruno_com.md` (Gemini), plus the previously approved v0.6 UX changes.

## 0. Operating instructions (READ FIRST)

This plan is a **verification-first implementation task**. **Do not rebuild the site or change its visual identity.** Review the current code, current staging commit, and the two supplied reports before implementing.

The first task is **deployment/version reconciliation**: as inspected on November 5, the published staging page still showed PromptDot in featured projects and the older Upcoming Talks design, even though the local v0.6 UX review showed their replacements. Identify the exact Git commit deployed in Azure vs the local branch; report whether staging is stale. **Do not treat stale staging issues as new source-code defects.**

The source documents are advisory and sometimes conflict. Claude explicitly did not visually access staging; treat its accessibility and performance suggestions as audit targets, not established bugs. Gemini saw the interface but its findings require reproducible tests. Reconcile them with actual source and browser evidence. Record `Already compliant`, `Confirmed issue`, `Not applicable`, or `Needs owner decision` per item.

### Non-negotiable project decisions

- Keep the .NET-inspired purple visual language, soft gradients, clear layout, bilingual EN/ES, humor, hoodie, and robot.
- Keep the **six-story hero carousel** (StackChan, speaker, developer, snowy Canada with Ace, 50K runner, funny bus). Preserve embedded image controls and refinements from v0.6. Do not replace it with a static hero.
- Hero copy clearly communicates: **Cloud Advocate at GitHub / Microsoft; AI Agents, AI, and .NET**. Do not silently change the title to "Principal" until approved by the owner and verified.
- Preserve real photography, the Speaker Kit, Bug Invaders, feed integrations, four curated featured resources, NuGet dashboard, and the previously agreed external new-tab behavior for WordPress and podcast links.
- Preserve GitHub curation: New Year New Bot, MarkItDotNet, LocalEmbeddings, OllamaMonitor. PromptDot remains available in Projects/history but is not promoted in homepage curated sections.
- Original photos are **local-only**, under `tmp/photos/`, and must not be committed, pushed, uploaded to external image-editing tools, or included in review ZIPs. Publish only already approved, metadata-stripped derivatives; do not introduce new public photos without explicit approval.
- Do not deploy, commit, push, change DNS, move WordPress, or alter Cloudflare/Network Solutions without explicit approval.
- Avoid em dashes in authored site copy.

## 1. Phase A — Evidence and baseline audit (P0)

1. Inspect branch, working tree, recent commits, Azure deployment workflow and deployment information. Compare local `main`/working version to what currently renders on staging.
2. Read both uploaded reviews from their repository location if present. If unavailable, use this document's consolidation and record that limitation.
3. Audit existing tests, Astro routes, `staticwebapp.config.json`, crawler rules, canonical URLs, robots, sitemap, headers, feeds and screenshot tools.
4. Make a source-backed matrix for every recommendation from the two reviews, including source report section/ID, current implementation evidence, reproduction method, resolution or reason to reject.
5. Save `docs/release/V07_REVIEW_RECONCILIATION.md` with a short list of confirmed defects vs preferences vs items already fixed.
6. Record **actual deployed commit SHA** when accessible. If not observable, report "unknown", not a guess.

**Acceptance:** No code changes are justified solely by a generic review recommendation; each has a specific verified issue or agreed user requirement.

## 2. Phase B — Accessibility, responsive UX and carousel verification (P1)

Audit to **WCAG 2.2 AA** wherever applicable, in both languages, desktop and mobile, light/dark themes.

- Semantic landmarks (`header`, `nav`, `main`, `footer`), clear heading order and one logical page `h1`.
- First focusable skip link, visible focus, keyboard-only navigation, focus not obscured by sticky navigation.
- Correct `lang` on EN/ES pages and proper `lang` for inline podcast titles in another language where helpful.
- Link names and icon-only button accessible labels; descriptive alt or empty alt for decorative images; accessible language switch.
- Contrast and focus colors; check muted labels, NuGet download metrics, dates, pill badges and both themes.
- Responsive checks at **320, 375, 390, 768, 1440 px** plus 200% browser zoom and text-spacing changes; prevent badge overflow, horizontal scroll and clipped cards.
- Hero carousel: keyboard Prev/Next/Pause/Play; discoverable names; accurate current-slide state (`aria-current` or equivalent for indicators, not misuse of `aria-expanded`); autoplay paused on user control and reduced motion; no unexpected focus movement or continuously announced slide changes. For screen readers, avoid a noisy `aria-live` region on automatic rotation. Test touch/swipe and pointer.
- Bug Invaders: keyboard access, escape/close behavior, visible focus, and a non-game alternative for people who cannot play.
- Optional hover effects on cards only if subtle and disabled under reduced motion; no new animation framework.

**Tests:** axe or equivalent automated checks plus a documented manual keyboard checklist. Do not claim formal WCAG conformance on automated checks alone. Provide issue IDs and screenshots for actual failures.

## 3. Phase C — SEO, indexing and social previews (P0/P1)

- **Environment-specific robots/indexing:** Staging and PR previews should remain `noindex`/blocked as appropriate; production must not accidentally inherit staging's crawler restrictions. Confirm the hosting hostnames and generated `robots.txt` rather than unconditionally enabling bots. This is an important control, not necessarily a staging bug.
- Canonical URLs: all production pages should have absolute `https://elbruno.com/...` canonical targets. Validate interactions with staging noindex and the final production host, and handle EN/ES page pairs correctly.
- `hreflang`: reciprocal `en`, `es`, `x-default` links on matched routes; no automatic language redirect.
- Verify titles/descriptions, Open Graph/Twitter card tags, accessible descriptions and real OG image files for Home, About, Projects, Speaker Kit. Ensure any preview image uses approved publicly shareable assets.
- Check `Person` JSON-LD: verified identity, `worksFor`, public `sameAs`; avoid unsupported job-title or location claims. Event markup only for verified talks and correct future/past status.
- Generate and verify sitemap with correct URLs; ensure RSS discovery where applicable.
- Validate external WordPress/blog links and external podcast links open in a new tab with `rel="noopener noreferrer"`, but preserve internal route behavior. Provide an accessible indication when links open a new tab.
- Optionally add `llms.txt` only if a clear benefit, low maintenance, and no misleading claim of official crawler standard. Not launch-blocking.

**Acceptance:** Automated markup tests confirm canonical/hreflang/OG/JSON-LD and env-specific indexing rules; document a live link-preview verification checklist for LinkedIn, X and Teams.

## 4. Phase D — Data reliability and content fidelity (P1)

- Audit current GitHub, NuGet, WordPress RSS, podcast RSS, and YouTube data refresh pipelines. Favor cached, build-time/scheduled data already implemented rather than creating duplicate APIs or live browser calls.
- On network failure, retain last-known-good data with visible "last updated" metadata where appropriate. Never show invented metrics, falsely current data or empty cards if a known-good snapshot exists.
- Sanitize excerpt HTML and avoid odd blog teasers such as "Hi!". Prefer an editorial override with explicit source; do not fabricate article summaries.
- Test graceful fallback for GitHub API rate limiting, RSS timeout, missing fields and malformed data.
- Confirm evergreen featured project order and actual repository ownership/contribution, not only recent commit sorting.
- Audit EN/ES translations and external link destinations.
- Confirm current .NET Conf dates and session status. Nov 10 and Nov 11, 2026 are in the future as of this specification; the component must become accurate after each date.
- Keep the Speaker Kit as **approved short introduction only** until owner approves six draft bios. Do not publish draft bios or career details just because another reviewer suggested prose. Preserve unchanged official downloadable photos and their permissions/credit caveats.

## 5. Phase E — Security, performance and CI (P1)

- Run `npm ci`, existing `npm run validate`, `npm run build`, `npm run test:e2e`, `npm run format:check`, `git diff --check`, dependency audit (full and production-only). Do not claim a pass unless actually executed.
- Run Lighthouse on a production **preview build** for both language homepages on desktop/mobile, reporting actual scores, LCP, CLS, major diagnostics and test conditions. Prefer real repeatable data to arbitrary minimum-score promises. Target LCP <=2.5s, CLS <=0.1 where realistic, but record field vs synthetic distinctions.
- Confirm hero first slide is prioritized and other slides loaded efficiently; next-slide preloading should not hurt LCP. Use responsive derivatives with `sizes`, dimensions, WebP/AVIF and appropriate lazy-loading.
- Confirm security headers and CSP are actually compatible with theme initialization, assets, game, feeds and required external links. Avoid untested CSP snippets pasted from reviews.
- Triage remaining development dependency advisories (previous report: 10 moderate). Do not use blind `npm audit fix --force`; document advisories and whether patches are safe.
- Add relevant regression tests to GitHub Actions; avoid expensive/fragile Lighthouse hard-fails until thresholds are baseline-calibrated.
- Guard `.env*`, private photos, local automation/MCP/agent configs and review ZIPs from commits, but **do not blanket-ignore `.github/` or legitimate repo Copilot instructions**. Check history for accidentally committed private files without making unverified claims.

## 6. Phase F — WordPress migration readiness, documentation ONLY (P0 for production)

We have agreed on a future architecture:

- Network Solutions remains domain registrar.
- Cloudflare Free is planned for DNS/redirects.
- New Astro site: `https://elbruno.com/` on Azure Static Web Apps.
- Existing WordPress blog: `https://blog.elbruno.com/`, once verified and reconfigured.
- Podcast remains independent at `https://notienenombre.com/`.

**Do not perform migration or DNS changes in v0.7.**

1. Inventory historical WordPress URL patterns: dated posts `/YYYY/MM/DD/...`, year/month archives, tags, categories, author archives, RSS, pagination, media URLs, query strings, and any custom legacy pages.
2. Document 301 mapping rules preserving the entire path and query strings, while reserving new Astro routes (`/`, `/es/`, `/about`, `/projects`, `/speaking`, etc.).
3. Choose the redirect layer after **testing** actual Cloudflare rules/Worker vs Azure SWA options. The Claude review suggests a navigationFallback-to-Azure-Function approach; treat as unverified, NOT as copy-paste-ready code. Check for fallback loops and API availability/cost. Prefer the simplest verified solution that preserves old URLs without breaking Astro routing.
4. Plan hostname changes with WordPress.com and Cloudflare DNS, preserving existing MX, SPF, DKIM, DMARC, TXT, CAA and other records. Document rollback and test matrix.
5. Document 10+ representative `curl -I` tests with exact expected 301 Location and status for nonlegacy 404s; plan Google Search Console/Bing updates after cutover.
6. Document restrictions and risks for publicly available optimized photos and approved Speaker Kit files.

Deliver `docs/release/V07_WORDPRESS_MIGRATION_READINESS.md`. Mark **production NO-GO** until user approval, proven redirects, blog availability, editorial and photo use approvals, and tested rollback.

## 7. Do NOT implement without explicit owner agreement

- Replace .NET purple with Claude's green "avocado" palette.
- Remove the carousel or ban autoplay categorically; retain existing reduced-motion and pause controls.
- Create new routes `/now` or `/contact` solely because suggested; log as P2 candidates.
- Publish unverified titles (e.g. "Principal"), old experience dates, claimed awards, unapproved long bios or unsupported metrics.
- Invent event recordings, awards, speaking counts, project ownership, or career timelines.
- Change infrastructure, DNS or hosting, or make staging publicly indexable.
- Send private `tmp/photos/` originals to t2i or outside services.

## 8. Automated review package (required)

Use **real Playwright screenshots** of a local production build, not AI-generated mockups.

- Routes: Home, About, Projects, Speaker Kit in EN and ES.
- Desktop 1440x900 and mobile 390x844, full-page screenshots: **16**.
- Above-fold Home and About at both viewports and languages: **8**.
- All six carousel slides in EN/ES and desktop/mobile: **24**.
- Focused screenshots: .NET Conf talks, Featured Projects, From GitHub and NuGet on both viewport types, plus 1 dark-mode homepage: **9 minimum**.
- Generate labeled contact sheets (desktop, mobile, carousel), screenshot inventory README and `QA_SUMMARY.md`.
- Save `screenshots/v07-review/`; package `v07-review.zip` locally only; EXCLUDE original photos, secrets, node_modules, `.env`, private configs and raw/full-resolution image files.

This visual package supports comparison; it cannot prove clicking behavior, accessibility or real network performance by itself. Attach automated test logs and evidence.

## 9. Deliverables and gates

Write:

- `docs/release/V07_REVIEW_RECONCILIATION.md`
- `docs/release/V07_QA_REPORT.md`
- `docs/release/V07_WORDPRESS_MIGRATION_READINESS.md`
- `docs/editorial/V07_OWNER_APPROVALS.md`
- `screenshots/v07-review/README.md`
- `screenshots/v07-review/QA_SUMMARY.md`
- `v07-review.zip` (LOCAL ONLY)

Include a traceability matrix: `Review source + section/ID → observed evidence → priority → change → test → status`.

### Staging GO criteria

- Confirm deployed vs intended Git version; tests and build pass; no critical known security or accessibility defects; user approves publishable derivatives; QA package is complete. Staging deployment itself must be separately authorized.

### Production GO criteria

- All above plus editorial approval for job title/bios, photo rights, CV, WordPress host relocation, path-preserving legacy 301s, Cloudflare/DNS cutover rehearsal, canonical/robots verification and rollback readiness. Until then: **NO-GO**.

## 10. Completion summary format

Report:

1. Current local SHA and staging deployed SHA (or "unknown"), and any mismatch.
2. Each source review's confirmed vs rejected findings and why.
3. Files changed and evidence of tests actually run.
4. Number of routes, screenshots, missing translations, broken images/links, and accessibility issues.
5. Lighthouse scores and explicit measurement environment.
6. Dependency vulnerabilities by production/development severity and remediation status.
7. Original photo privacy verification and published derivative inventory.
8. Exact paths to reports, screenshots and local review ZIP.
9. Owner approvals and explicit staging / production GO/NO-GO.
10. Do not commit, push or deploy without approval.

**Core principle:** Make elbruno.com more trustworthy, accessible, findable and reliable while preserving the current design that communicates who Bruno is in under 10 seconds.
