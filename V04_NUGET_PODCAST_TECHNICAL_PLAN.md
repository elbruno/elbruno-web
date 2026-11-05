# elbruno.com — v0.4 implementation plan

**Working title:** NuGet portfolio, podcast navigation, and technical hardening
**Target repository:** `https://github.com/elbruno/elbruno-web`
**Local repository (owner machine):** `D:\elbruno\elbruno-web`
**Status:** Implementation specification for GitHub Copilot Agent; not a claim that changes have been made.
**Date:** 2026-11-04

> **Primary goal:** Make Bruno's published .NET / C# libraries for AI development a visible, verifiable part of his professional identity, fix podcast navigation to open external destinations in a new tab, and close the remaining technical-quality gaps without disrupting the existing v0.3 site.

## 0. Operating principles

1. **Work in the existing repository.** Review current source, docs, tests, workflows, and `package.json` before edits. Preserve Astro static generation, EN/ES, the .NET-inspired purple visual style, real photography, StackChan hero, Speaker Kit, validated feeds, robot, and Bug Invaders.
2. **Make real changes, not just a design proposal.** Complete the implementation and run tests locally; report anything that could not be executed.
3. **Do not invent library titles, descriptions, download totals, ownership, package-to-repo associations, dates, author bios, or professional claims.** Only show data that can be verified from the NuGet dashboard, its source dataset, or NuGet itself.
4. **Do not confuse all of Bruno's tracked NuGet packages with AI packages.** The dashboard monitors a broader NuGet/GitHub portfolio. AI relevance must be explicitly curated from verified projects/metadata. Never relabel unrelated packages as AI.
5. **Do not alter DNS, WordPress, Cloudflare, Network Solutions, Azure production, or publish a new staging site without an explicit owner decision.** No production deployment in this task.
6. **Use external links safely.** For requested new tabs, set `target="_blank"` plus `rel="noopener noreferrer"`; preserve internal navigation in the same tab.
7. **Avoid unnecessary dependencies and browser API calls.** Collect/normalize any dynamic package metrics at build or scheduled refresh time, not on each visitor page load.
8. **Existing photographs are authentic.** This work should not require image generation. If visual assets are genuinely needed, inspect the installed `t2i` skill and use it for original decorative artwork or careful edits to copies, preserving masters. Prefer current icon/design components.

## 1. Verified reference systems and canonical URLs

- Personal site source: `https://github.com/elbruno/elbruno-web`
- Live NuGet & GitHub portfolio dashboard: `https://elbruno.github.io/nuget-repo-dashboard/`
- Dashboard source: `https://github.com/elbruno/nuget-repo-dashboard`
- NuGet author/profile to verify: `https://www.nuget.org/profiles/elbruno`
- Primary public GitHub profile: `https://github.com/elbruno`
- No Tiene Nombre podcast site: `https://notienenombre.com/`
- Current site release documents: `docs/release/QA_REPORT.md`, `docs/release/LAUNCH_RUNBOOK.md`
- Previous owner-approval checklist: `docs/editorial/CONTENT_APPROVAL_CHECKLIST.md`

### Dashboard facts checked in the source repository

The dashboard is a **.NET 10** collector and a separately deployed GitHub Pages dashboard. It:

- Discovers NuGet packages by an owner search (`owner:elbruno`), merges optional tracked mappings, and excludes ignored packages.
- Collects package versions/downloads and GitHub repository metadata.
- Produces `data/latest/data.nuget.json` and `data/latest/data.repositories.json`, with dated historical snapshots.
- Tracks active/retired lifecycle; active and retired metrics are not equivalent.
- Provides a full browser-based dashboard with package filtering, trends, repository metadata and other portfolio views.

**Important:** The live dashboard loads client-side and could not be used here to verify current individual package totals or package identities. Copilot must inspect the real data payloads and schemas before implementation. Do not copy illustrative values or assume all package JSON fields without inspection.

## 2. User-facing product change — visibility of .NET/AI libraries

### 2.1 Homepage: one compact feature, not a new wall of cards

Add a polished, visually quiet **"AI & .NET Libraries"** section to the home page near **Building in public / From GitHub**, before the feed-heavy areas. This should make visitors understand, at a glance, that Bruno publishes reusable NuGet libraries for .NET/C# developers working with AI and related scenarios.

**Layout goal:** A short introductory statement; at most **three featured verified packages** (or two if that is all that is verifiably AI-related); and one clear button/link to the comprehensive dashboard. Use the existing purple design tokens and reusable card components. Maintain the airy visual hierarchy and the 10-second identity requirement.

Possible EN copy (edit to fit verified portfolio):

- Eyebrow: `OPEN SOURCE · NUGET`
- Heading: `AI & .NET libraries`
- Body: `I publish .NET libraries and developer tools that turn experiments into reusable building blocks. Explore the packages, source code and download trends.`
- CTA: `Explore my NuGet packages`
- Secondary contextual label: `Packages, versions, downloads & GitHub repos`

Possible ES copy:

- Eyebrow: `CÓDIGO ABIERTO · NUGET`
- Heading: `Librerías de IA y .NET`
- Body: `Publico librerías y herramientas para .NET que convierten experimentos en componentes reutilizables. Explora los paquetes, el código y su evolución de descargas.`
- CTA: `Explorar mis paquetes NuGet`
- Secondary contextual label: `Paquetes, versiones, descargas y repositorios`

**Editorial nuance:** The heading can describe the curated subsection as AI/.NET only when its featured packages are actually AI-related. If the available curated items include broader .NET utilities, use `NuGet & .NET libraries` / `Librerías NuGet y .NET` or separate clearly marked categories. Do not imply that every tracked package is about AI.

### 2.2 Featured package card anatomy

For a verified featured package show, where available:

- Exact NuGet package ID and a short factual sentence explaining its purpose.
- A category such as `AI`, `.NET`, `Developer tooling`, only when editorially justified.
- Current version, optional; include `Updated` date only if the source supports it.
- Lifetime total downloads with locale-aware formatting, **only** if collected and timestamped.
- Direct link to NuGet package page.
- Direct source repository link, only if association is verifiable.
- A small `Data updated ...` context if the figure is time-dependent; avoid a silent stale metric.

Never turn package-download counts into claims about users or active installs. No artificial counters, fake stars, or estimates.

**Fallback:** If data is unavailable, keep the section and dashboard CTA, but render no fabricated numbers. Show curated packages with safe static descriptions if verified. If fewer than two suitable packages are verified, use a single intro + dashboard link rather than padded placeholders.

### 2.3 Projects page: richer directory

Add a **Packages & libraries** sub-section to `/projects/` and `/es/projects/` (or whatever established translated route is appropriate). It should complement the existing featured projects, **not** replace them or clone the entire external dashboard.

- Show a curated collection, ideally 4–8 verified packages if enough exist.
- Permit lightweight category filters only if worthwhile; skip a heavy client-side framework.
- Direct links to NuGet and GitHub; prominently expose `Open full NuGet dashboard`.
- If package lists exceed the curated display count, route visitors to the external dashboard for complete metrics and filtering.
- Do not introduce new nav items without good reason. Prefer a Projects anchor/link and a compact homepage highlight.
- For professional profile/About, add one short sentence about maintaining .NET open-source libraries with a link to the directory or dashboard, avoiding unsupported impact statements.

### 2.4 Presentation notes

- Use existing typography, spacing, icons, purple gradient accents, borders, and dark/light palettes.
- No new generated portraits; no heavy screenshots or iframe of the dashboard.
- Avoid cumulative layout shift and bloated mobile layout. On 390px width, cards stack cleanly; consider a compact 2-row information hierarchy.
- Maintain heading hierarchy, meaningful labels, accessible focus states, and text contrast.
- Any external dashboard link must be descriptive and should preferably open in a new tab with safe `rel` values.

## 3. Data integration plan — one source of truth

### 3.1 First inspect the real data and deployment paths

In `https://github.com/elbruno/nuget-repo-dashboard`, inspect:

- `README.md`, `config/dashboard-config.json`, and `config/tracked-packages.json`.
- `data/latest/data.nuget.json` and `data/latest/data.repositories.json` as available.
- Published GitHub Pages data paths under `site/`, its deployment workflow, and any public `/data/` assets.
- Lifecycle conventions, actual JSON schema, download count semantics, valid package URLs, version and timestamp data.

Use the already-published, public JSON snapshot if a stable URL and CORS are available. Otherwise fetch the public source JSON from a stable GitHub raw/repository endpoint as part of a build workflow or reuse a validated committed snapshot. Do not assume a URL is published until verified. Do not require authenticated GitHub API calls in visitor browsers.

### 3.2 Suggested implementation (adapt to existing code)

- Extend the current content-refresh pipeline, rather than adding a second scheduled job if not needed.
- Define a **typed, allowlisted curated package list** in the existing source-data module, containing package IDs and editorial descriptions/tags in EN/ES. This is a **selection**, not a hardcoded download count list.
- Fetch and normalize latest NuGet dashboard metrics at refresh time. Validate JSON shape and numbers at runtime. Join by **exact normalized package ID**; reject collisions/missing IDs.
- Keep an immutable **last-known-good snapshot** with `fetchedAt` and (if provided by source) `sourceUpdatedAt`; avoid committing secrets.
- Preserve old snapshot if fetch fails; log a warning. Distinguish network failures from schema changes. Do not publish empty or corrupted card data.
- Verify statuses; mark retired packages accurately, and do not present unsupported packages as actively maintained.
- Sort package cards by explicit editorial priority, not just download rank (for relevance and stability).
- The static site build must succeed offline using committed snapshots.
- Refresh should be deterministic and idempotent: no commit if public content is unchanged.
- Prefer server/build-time fetches with timeouts and a bounded retry policy. Avoid needless scraping of HTML.

### 3.3 Suggested types (illustrative, adapt to actual payload)

```ts
interface FeaturedPackageConfig {
  packageId: string;
  category: 'ai' | 'dotnet' | 'tooling';
  description: { en: string; es: string };
  sortOrder: number;
}

interface PackageSummary {
  packageId: string;
  version?: string;
  totalDownloads?: number;
  packageUrl: string;
  repositoryUrl?: string;
  lifecycle?: 'active' | 'retired' | 'unknown';
  fetchedAt?: string;
}
```

This is not a contract for the dashboard. Inspect the source JSON and map carefully.

### 3.4 Data test cases

- Successful source parsing and exact package ID mapping.
- Missing selected package is skipped (not fabricated).
- Null/invalid/negative counts never appear as metrics.
- Retired and archived entries are properly qualified.
- Offline build with last-known-good snapshot.
- Network failure retains prior valid state.
- Identical refresh does not modify the snapshot.
- Dates/time zones and number formatting work in EN/ES.
- Every NuGet URL resolves to the correct package ID; every source link is verified.

## 4. Podcast navigation — MUST open external links in a new tab

### 4.1 Behavior definition

All links that **leave elbruno.com for the No Tiene Nombre podcast** must open in a **new browser tab**. Apply consistently to:

- The homepage podcast feature CTA.
- Every latest-episode card (all three or however many are shown).
- Header, footer and Elsewhere podcast links.
- Any About, Projects, or Speaker Kit podcast mentions with external URLs.
- Podcast links in Spanish and English variants, including mobile navigation.
- Any link to an external episode page, podcast player, listening platform, or `https://notienenombre.com/`.

For each external podcast `<a>`:

```html
<a href="https://notienenombre.com/" target="_blank" rel="noopener noreferrer">
  Listen to No Tiene Nombre
</a>
```

For dynamically rendered episode links, preserve the **real external URL** from the feed. Do not replace episode URLs with the podcast homepage unless the source item genuinely points there.

Do **not** force internal paths (`/podcast`, same-origin redirect pages, locale changes, etc.) into new tabs unless they are **explicit outbound redirect triggers** and the actual final destination is external. Prefer that visible podcast CTAs link directly to external URLs, so new-tab behavior is reliable even when a browser follows redirects.

### 4.2 Robust implementation

- Locate centralized link components, social link data, feed cards and any location where an anchor is built dynamically.
- Prefer a small reusable outbound-link helper/component if it reduces duplication, but avoid a broad change that opens _every_ internal/external link in a new tab.
- In new-tab anchors, add `rel="noopener noreferrer"`. Consider an accessible cue, such as visually hidden text `opens in a new tab`, localized as needed. Do not overpopulate the interface with external-link icons.
- For any `window.open`, it must be invoked by a direct user interaction with `noopener,noreferrer` and retain keyboard semantics; ordinary `<a>` is strongly preferred.
- Audit all EN/ES and mobile variants, plus dynamic feed cards.

### 4.3 Playwright acceptance test

For every representative podcast link, in both languages and at desktop/mobile viewports:

- Assert `target === '_blank'` and `rel` includes `noopener` and `noreferrer`.
- Confirm `href` is nonempty, absolute HTTPS, and points to the expected podcast/episode destination.
- When practical, click the link and assert that a new page event occurs while the original homepage remains on the same URL. Do not require third-party content to load successfully in CI.
- Assert internal About/Projects and locale navigation still open in the same tab.
- Test all three episode cards rather than only the first.

## 5. Technical cleanup and security hardening

### 5.1 Format/quality gate

The previous QA report observed repository-wide formatting failures on supplied Markdown plans and an earlier screenshot README. Fix these **mechanically and minimally**, not by deleting audit evidence or ignoring entire directories without justification.

- Check current `npm run format:check` first; treat the historical list as a starting point, not guaranteed current state.
- Use configured Prettier and `prettier-plugin-astro` as appropriate.
- Format offending files or adjust deliberate exceptions narrowly and document why.
- Make `npm run format:check` pass across the expected repository scope.
- Keep `git diff --check`, ESLint, Astro type checks and unit tests green.

### 5.2 Dependency vulnerability triage

Previous QA: `npm audit --omit=dev` reported **0 production vulnerabilities**; full `npm audit` reported **12 advisories (11 moderate, 1 high)**, mainly dev dependencies. This must be re-checked, not repeated as a new fact.

- Run `npm ci`, `npm audit --json` (or equivalent), and `npm audit --omit=dev`.
- Record packages, advisory severity, dependency path, whether prod/dev, and whether used during build or local tests.
- Apply **compatible, nonbreaking upgrades** where supported, committing `package-lock.json` with `package.json`.
- Do **not** blindly run `npm audit fix --force`, remove Playwright/security checks, or make surprise major Astro/Node upgrades.
- For advisories that cannot safely be resolved, document precise residual risk and mitigating factors. Treat build-time tooling exposure seriously, not as automatically irrelevant.
- Re-run full validation after updates, especially Playwright.

### 5.3 Practical extra safeguards

- Verify outbound links, URLs and `rel` attributes; no `javascript:` or untrusted destination injection.
- Confirm public JSON ingestion cannot inject markup, scripts, or unsafe URL schemes into HTML.
- Audit new CTA semantics, keyboard focus, screen reader names, and contrast in both themes.
- Verify images remain optimized, no extra heavy JS is loaded at startup, and new cards do not shift the hero.
- Preserve existing CSP, locale routes, canonical URLs, structured data, sitemap, content feeds, robots, and Azure staging precautions.
- Check `npm run validate`, `npm run test:e2e`, `npm run format:check`, `npm run build`, and `git diff --check`.

## 6. Concrete execution phases

### Phase A — audit and inventory

1. Read current repo and current QA/release documents.
2. Locate all podcast links and their generation path.
3. Inspect dashboard data, discover actual AI-relevant package IDs and package metadata.
4. Produce a compact implementation map of touched source/data/tests.

### Phase B — content and integration

1. Add curated bilingual AI/.NET library copy and package selection to existing data modules.
2. Integrate validated dashboard-derived metrics into refresh/snapshot pipeline.
3. Implement clean homepage highlight + fuller Projects section.
4. Add About cross-link and full dashboard CTA.
5. Ensure graceful no-data handling and correct retired labels.

### Phase C — podcast behavior

1. Implement `target="_blank"` with `rel="noopener noreferrer"` on **every outbound podcast destination**, including feed cards.
2. Audit both locales and mobile links.
3. Write Playwright and/or unit tests.

### Phase D — quality and cleanup

1. Resolve format check failures.
2. Audit vulnerabilities and apply safe remediations.
3. Verify EN/ES copy, accessible controls, no broken links.
4. Preserve light/dark, game, feeds, Speaker Kit, photos and routes.

### Phase E — final QA handoff

1. Run all project scripts and report real outputs, including warnings and unaddressed risks.
2. Capture actual Playwright screenshots of the changed **Home and Projects** views, EN/ES, desktop 1440×900 and mobile 390×844, both viewport and full-page when useful; optionally one podcast-link behavior demonstration from Playwright logs.
3. Provide `docs/release/V04_QA_REPORT.md` with screenshot paths, source schema observations, package selection and verifications, actual test counts, audit before/after, and blockers.
4. Provide `docs/editorial/V04_CONTENT_APPROVAL.md` listing package cards, bilingual descriptions, metrics freshness and any uncertain status/credits.
5. Produce a concise owner summary of changed files, preserved features, commits, and explicit staging/production GO/NO-GO.
6. Do not deploy, alter DNS, move WordPress, change Cloudflare, or change registrar settings.

## 7. Acceptance criteria

- [ ] Homepage visibly establishes that Bruno publishes .NET/C# NuGet libraries, without diluting the hero or first-glance identity.
- [ ] A compact featured-library section links to `https://elbruno.github.io/nuget-repo-dashboard/`.
- [ ] Projects contains an organized, verified packages/libraries section with exact package URLs.
- [ ] Displayed download/versions are from valid current/last-good source snapshots, with freshness context.
- [ ] No invented package names, descriptions, downloads, ownership or AI classification.
- [ ] Active/retired status is accurate and does not falsely imply maintenance.
- [ ] English and Spanish copy are natural, accurate and complete.
- [ ] All external podcast and episode links, in all layouts/locales, open a **new tab** securely.
- [ ] Same-site links and language switching are not changed to new tabs.
- [ ] Existing blog/podcast/YouTube feed counts and offline snapshots still work.
- [ ] Formatting check passes (or precise justified exception documented and approved).
- [ ] Dependency audit re-run, safely fixable issues resolved, residuals documented.
- [ ] Existing tests and new tests pass without regressions.
- [ ] Desktop/mobile screenshots, content approvals and QA report created.
- [ ] No production/staging deployment or infrastructure changes performed.

## 8. Owner approval items

Ask the owner only for **decisions that require personal judgment**, not implementation details:

- Confirm that the selected package list and descriptions fairly represent the AI/.NET portfolio.
- Decide whether to spotlight lifetime downloads in the homepage or keep detailed counts on Projects only.
- Approve headline/body wording in both languages.
- Approve staging publication separately, after the work passes QA.

Do **not** block on full CV/career-history or photograph-permission tasks from earlier launch readiness; retain them as explicit existing production gates in the final report.

## 9. Suggested final report format

```text
V0.4 RESULT
- Implemented:
- Libraries featured (package IDs + source links):
- Data source/schema and snapshot time:
- Podcast outbound links tested:
- Dependency audit before / after:
- Format/validate/E2E results:
- Screenshots / visual review paths:
- Editorial approvals still needed:
- Staging status / production status:
- Commit hash (if committed):
```

## 10. Source documentation

- NuGet dashboard: https://elbruno.github.io/nuget-repo-dashboard/
- Dashboard collector README: https://github.com/elbruno/nuget-repo-dashboard
- Website repository: https://github.com/elbruno/elbruno-web
- Prior QA report: https://github.com/elbruno/elbruno-web/blob/main/docs/release/QA_REPORT.md
- npm audit: https://docs.npmjs.com/cli/v11/commands/npm-audit/
- Astro editor/Prettier guidance: https://docs.astro.build/en/editor-setup/
- Outbound new-tab link safety: https://developer.chrome.com/docs/lighthouse/best-practices/external-anchors-use-rel-noopener/

**Final implementation philosophy:** The site stays an approachable personal homepage, not another metrics dashboard. The NuGet dashboard remains the canonical detailed view; elbruno.com tells visitors why Bruno's libraries matter and gives them a fast path to explore the code and the packages.
