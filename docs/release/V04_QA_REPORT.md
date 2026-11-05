# v0.4 QA report

Date: 2026-11-05. Baseline before v0.4 changes: photo-cleanup commit `2f3c06a1bf89131bcd2c04affde28018264f86fc`
plus public-content refresh `d0923599e1ec0825e8b001e5bca6ee06601bb120`.
Validation ran locally on Windows with the existing npm scripts, Astro 7.4.2 and Playwright 1.64.1.
This report records the local v0.4 validation run; deployment has not been performed.

## Result and release decision

**GO for local/staging design review; not authorization to publish staging. Production NO-GO.**

The implementation adds a three-package bilingual Home spotlight, a six-package Projects directory,
and an About cross-link. Dashboard-derived data is integrated into the existing six-hour refresh
workflow, not a duplicate collector. Podcast destinations now consistently open isolated new tabs
with localized accessible cues; internal links remain same-tab.

Existing StackChan hero, authentic photography, purple design, EN/ES routes, feeds, SEO, CSP,
Speaker Kit and ZIP, robot, game and lazy game loading were preserved. No new browser script or
visitor-side dashboard API request was added. No generated/edited imagery was needed; t2i was not
used for v0.4. Original photographs were untouched.

The remaining moderate development-tooling vulnerability and owner approvals below are **not**
being declared resolved. No production readiness claim is made.

## Dashboard audit: real sources and semantics

Repository inspected: <https://github.com/elbruno/nuget-repo-dashboard>.
Audit reference HEAD: `91188c5bd9308ba84ccbd59018e39c5e1b5645bc`.

| Source                                    | Evidence                                                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Dashboard                                 | https://elbruno.github.io/nuget-repo-dashboard/                                                                  |
| Published packages JSON                   | https://elbruno.github.io/nuget-repo-dashboard/data/data.nuget.json                                              |
| Published repositories JSON               | https://elbruno.github.io/nuget-repo-dashboard/data/data.repositories.json                                       |
| Published configuration                   | https://elbruno.github.io/nuget-repo-dashboard/data/dashboard-config.json                                        |
| Owner profile                             | https://www.nuget.org/profiles/elbruno                                                                           |
| Canonical package data in source          | https://github.com/elbruno/nuget-repo-dashboard/blob/main/data/latest/data.nuget.json                            |
| Canonical repository data in source       | https://github.com/elbruno/nuget-repo-dashboard/blob/main/data/latest/data.repositories.json                     |
| Discovery/retirement/ignore configuration | https://github.com/elbruno/nuget-repo-dashboard/blob/main/config/dashboard-config.json                           |
| Package/repository mappings               | https://github.com/elbruno/nuget-repo-dashboard/blob/main/config/tracked-packages.json                           |
| Actual publication paths                  | https://github.com/elbruno/nuget-repo-dashboard/blob/main/.github/workflows/refresh-metrics.yml                  |
| Download collection semantics             | https://github.com/elbruno/nuget-repo-dashboard/blob/main/src/Collector/Services/NuGetCollector.cs               |
| Ownership discovery                       | https://github.com/elbruno/nuget-repo-dashboard/blob/main/src/Collector/Services/NuGetProfileDiscoveryService.cs |

All three published JSON URLs returned HTTP 200 and `Access-Control-Allow-Origin: *`.
Do not use the unverified-looking `/data/latest/data.nuget.json` or `/data.nuget.json` Pages paths:
both returned 404. The deployment workflow copies source `data/latest/` files to public `/data/`.
No authenticated API is needed by site visitors.

Observed payload schemas:

- Packages: `{ generatedAt, packages: [...] }`, 127 entries. Each row has `packageId`, `retired`,
  `latestVersion`, `totalDownloads`, `description`, `authors`, `projectUrl`, `tags`, `listed`,
  `publishedDate`, `releasesLast30Days`, `dependencies`.
- Repositories: `{ generatedAt, repositories: [...], watchList }`, 33 repositories. Association uses
  `fullName` and `htmlUrl`; lifecycle checks use `retired`, `archived`, and `isStub`. Other fields
  include stars, forks, issues/PRs, language, license and maintainability; those are not copied as new site claims.
- Ownership discovery searches `owner:elbruno`; optional tracked mappings can broaden the dashboard.
  The ignore list includes Microsoft.Extensions.AI-related IDs, so dashboard scope must not be
  relabeled as “Bruno's AI libraries” wholesale.
- `totalDownloads` is an aggregate NuGet search count across package versions, not downloads of only
  the displayed version. The collector queries two shards and chooses the higher count. A failed
  upstream count query can yield zero; the site does not reinterpret that as a verified user count.
- `latestVersion` is the dashboard collector's value, not a separate stable-version certification.
  Retirement is a dashboard lifecycle flag, not proof of NuGet deprecation or a support contract.

Both source payload timestamps: **2026-11-04T17:13:30.877Z**.
Normalized snapshot fetched at **2026-11-04T17:33:45.307Z**, committed-file location
`src/data/nuget/snapshot.json` (captured in the implementation commit).

## Exact selected packages and verified links

All six IDs appear on the NuGet owner profile and have matching project URL, tracked mapping and
repository evidence. All six direct NuGet pages returned HTTP 200. Repository metadata/READMEs were
read through the public GitHub API. All were listed, not retired, and associated with non-archived
repositories at audit time. Editorial order is deliberate, not download rank.

| Package ID                     | Placement/category              | Snapshot version | Lifetime downloads | NuGet                                                         | Verified source                                           |
| ------------------------------ | ------------------------------- | ---------------- | ------------------ | ------------------------------------------------------------- | --------------------------------------------------------- |
| ElBruno.LocalEmbeddings        | Home + Projects; AI             | 1.6.6            | 22,749             | https://www.nuget.org/packages/ElBruno.LocalEmbeddings        | https://github.com/elbruno/elbruno.localembeddings        |
| ElBruno.LocalLLMs              | Home + Projects; AI             | 0.24.1           | 6,308              | https://www.nuget.org/packages/ElBruno.LocalLLMs              | https://github.com/elbruno/ElBruno.LocalLLMs              |
| ElBruno.Text2Image             | Home + Projects; AI             | 1.7.1            | 6,889              | https://www.nuget.org/packages/ElBruno.Text2Image             | https://github.com/elbruno/ElBruno.Text2Image             |
| ElBruno.MarkItDotNet           | Projects; AI document workflows | 0.9.3            | 50,023             | https://www.nuget.org/packages/ElBruno.MarkItDotNet           | https://github.com/elbruno/ElBruno.MarkItDotNet           |
| ElBruno.HuggingFace.Downloader | Projects; developer tooling     | 1.6.1            | 30,745             | https://www.nuget.org/packages/ElBruno.HuggingFace.Downloader | https://github.com/elbruno/ElBruno.HuggingFace.Downloader |
| ElBruno.Speech.Abstractions    | Projects; .NET contracts        | 1.6.1            | 4,047              | https://www.nuget.org/packages/ElBruno.Speech.Abstractions    | https://github.com/elbruno/ElBruno.Speech                 |

Text2Image's short GitHub description mentions captioning; its actual NuGet metadata and README
explicitly support the card's text-to-image description. Speech.Abstractions is not mislabeled as
an inference engine, nor is the downloader. AotMapper is not assumed to be AI. Retired
CopilotCLIMonitor packages are not promoted.

## Ingestion and failure behavior

- Existing `npm run refresh-content` now reads both published dashboard payloads via its existing
  HTTPS-only, 20-second, 2 MB bounded request helper. Policy: one attempt per source per refresh,
  no immediate/unbounded retries; the next scheduled/manual refresh retries naturally.
- JSON root/array/date checks reject schema drift, malformed IDs, future source timestamps and
  case-normalized ID collisions. Only six exact allowlisted IDs are selected. Missing selections
  are skipped; a payload with none fails closed.
- Nonnegative safe integers alone become download metrics. Invalid/null values are omitted, not
  coerced. Versions are bounded and validated. Remote descriptions/tags are not rendered as markup.
- Repository links require the configured exact association to agree with the package `projectUrl`
  and non-stub repository `fullName`/`htmlUrl`. Credentials, lookalike domains, other repos and
  unsafe schemes cannot become source anchors.
- Network failure and schema failure have distinct warnings and retain the prior valid snapshot.
  A source timestamp older than last-good data cannot overwrite it.
- Retired, unlisted, unknown-status and archived entries are qualified in Projects and excluded
  from Home. Fewer than two suitable Home items yields intro + dashboard CTA, not padded cards.
- Both payload dates and `fetchedAt` are preserved. Identical normalized content does not advance
  `fetchedAt` or write files. Two real refresh runs produced the same package snapshot SHA-256;
  the second also reported no feed changes.
- A seven-day staleness warning is evaluated at build time using the older source date. Every
  rendered package section always shows the snapshot date and “not live metrics” disclaimer.
- Static rendering reads validated local JSON, not the network. Builds passed using these
  snapshots; injected offline refresh failures are covered in unit tests. No OS-level network
  isolation is claimed for the build command.
- The existing workflow stages only the two normalized snapshots. Deployment conditions were not
  enabled, dispatched or otherwise changed.

## Podcast destination matrix

Preserved destinations:

1. Profile/feature/header/Elsewhere: `https://notienenombre.com` (the existing href, unchanged).
2. About selected work: `https://notienenombre.com/` (existing trailing slash preserved).
3. Episode 592: https://www.ivoox.com/ntn-592-ia-operando-ia-sin-audios-mp3_rf_183238577_1.html
4. Episode 591: https://www.ivoox.com/ntn-591-la-burbuja-la-audios-mp3_rf_183115941_1.html
5. Episode 590: https://www.ivoox.com/ntn-590-especial-halloween-2026-e-audios-mp3_rf_183076292_1.html

The homepage has seven podcast anchors per locale: header, feature CTA, source CTA, three episode
cards and Elsewhere. About has two; Projects and Speaker Kit have one header link each. No separate
podcast footer anchor existed to change. Every existing outbound podcast rendering path was audited.

Playwright checks **44 actual anchor clicks** across eight routes and two device projects, with
third-party destinations intercepted locally so CI does not depend on external players. Every click
opens a new page at the original destination, leaves the originating URL unchanged, and has
`window.opener === null`. Every anchor has `target="_blank" rel="noopener noreferrer"` and an EN/ES
screen-reader new-tab cue. All three episode cards are checked in both languages on both devices.
Internal links, language switches and About/Projects navigation retain same-tab behavior.

Routes: `/`, `/about/`, `/projects/`, `/speaking/`, `/es/`, `/es/about/`, `/es/projects/`, `/es/speaking/`.
This verifies navigation behavior, not the ongoing availability/content of third-party episode pages.

## Actual command results

| Command/check                                     | Result                                                                                                              |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Initial `npm ci --quiet`                          | First attempt hit a Windows file lock from the old local preview; stopped that exact preview and reran successfully |
| `npm install --quiet` after Sharp manifest update | Updated lockfile; removed duplicate vulnerable Sharp 0.34.5                                                         |
| Final `npm ci --quiet`                            | PASS, 387 installed packages                                                                                        |
| `npm run validate`                                | PASS: Astro check, ESLint, 25 unit tests, both content snapshot validators, static build                            |
| `npm run build` explicitly                        | PASS: 10 static pages, sitemap                                                                                      |
| `npm run test:e2e`                                | PASS: 32/32 cases, two workers, 29.9 seconds, no retries                                                            |
| `npm run refresh-content` twice                   | PASS: three entries per feed, two GitHub repos, six packages; identical package snapshot on repeat                  |
| `npm run format:check`                            | PASS after formatting supplied v0.4 plan and generated QA JSON                                                      |
| `git diff --check`                                | PASS                                                                                                                |
| Full `npm audit --json`                           | Initial after Sharp update: 11 moderate; pre-push audit: 10 moderate, 0 high                                        |
| `npm audit --omit=dev` / JSON form                | Before and after: 0 production vulnerabilities                                                                      |
| `node screenshots\v04-review\capture.mjs`         | PASS: 32 PNGs, two contact sheets, README and machine-readable audit                                                |

Astro check has **0 errors, 0 warnings, two existing XMLValidator deprecation hints** in
`src/lib/feeds/parse.ts`. They are not new failures and were not hidden.
The first formatting scan identified only the newly supplied v0.4 plan; historical v0.3 files
were already clean. Generated screenshot JSON was also made reproducibly Prettier-compliant.

Nine new unit cases cover exact ID mapping, missing/colliding/invalid data, qualified lifecycle,
repository URL trust, invalid metrics, network/schema/stale fallback, idempotency, persisted snapshot
validation and EN/ES dates/numbers. Two new browser specifications run on both projects.
Existing automated WCAG 2 A/AA and 2.1 AA scans, dark contrast/narrow layouts, metadata/sitemap,
local-link/download checks, clipboard/fallback, themes/menu/focus, CSP, robot and game cases all pass.
Automated accessibility is not a full manual accessibility certification.
One pre-push full-suite run had a transient mobile Speaker Kit click intercepted while lazy images
were loading. The test now eagerly decodes its page images before interacting; the isolated test
passed three consecutive runs, and the final full browser run passed 32/32.

## Dependency audit: exact residuals

Sharp was updated from **0.34.5 to 0.35.5** using npm, preserving the existing image API use and
deduplicating with Astro's existing Sharp 0.35.5. No Astro, Node, or TypeScript major upgrade,
forced audit fix, advisory suppression or transitive major override was used.

The removed direct development dependency path was `elbruno-web -> sharp@0.34.5`, used by local
asset/contact-sheet scripts. Its high-severity findings were:

- https://github.com/advisories/GHSA-f88m-g3jw-g9cj — libvips inherited vulnerabilities, affected `<0.35.0`.
- https://github.com/advisories/GHSA-rgj7-g3m4-5g8c — libheif vulnerabilities, affected `<0.35.4`.
- https://github.com/advisories/GHSA-wq5f-xc86-pv6w — librsvg use-after-free, affected `<0.35.5`.

**Remaining root advisory:** https://github.com/advisories/GHSA-g3hv-75wg-m249,
**MODERATE**, minimatch globparts amplification denial of service, installed **10.2.6**, affected
`>=7.0.0 <11.0.1`. The 10 audit entries are propagated vulnerable-package entries, not 10 independent
root advisories. All are development-tooling paths; production audit is zero.

Exact resolved dependency paths to the vulnerable leaf:

```text
elbruno-web -> eslint@10.13.0 -> minimatch@10.2.6
elbruno-web -> eslint@10.13.0 -> @eslint/config-array@0.23.5 -> minimatch@10.2.6
elbruno-web -> typescript-eslint@8.72.1 -> @typescript-eslint/typescript-estree@8.72.1 -> minimatch@10.2.6
elbruno-web -> typescript-eslint@8.72.1 -> @typescript-eslint/parser@8.72.1 -> @typescript-eslint/typescript-estree@8.72.1 -> minimatch@10.2.6
elbruno-web -> typescript-eslint@8.72.1 -> @typescript-eslint/utils@8.72.1 -> @typescript-eslint/typescript-estree@8.72.1 -> minimatch@10.2.6
elbruno-web -> typescript-eslint@8.72.1 -> @typescript-eslint/eslint-plugin@8.72.1 -> @typescript-eslint/type-utils@8.72.1 -> @typescript-eslint/typescript-estree@8.72.1 -> minimatch@10.2.6
```

Audit node locations and versions (all **MODERATE**):

| Vulnerable audit entry               | Installed node path/version                                |
| ------------------------------------ | ---------------------------------------------------------- |
| minimatch                            | `node_modules/minimatch` 10.2.6                            |
| eslint                               | `node_modules/eslint` 10.13.0                              |
| @eslint/config-array                 | `node_modules/@eslint/config-array` 0.23.5                 |
| typescript-eslint                    | `node_modules/typescript-eslint` 8.72.1                    |
| @typescript-eslint/eslint-plugin     | `node_modules/@typescript-eslint/eslint-plugin` 8.72.1     |
| @typescript-eslint/parser            | `node_modules/@typescript-eslint/parser` 8.72.1            |
| @typescript-eslint/type-utils        | `node_modules/@typescript-eslint/type-utils` 8.72.1        |
| @typescript-eslint/typescript-estree | `node_modules/@typescript-eslint/typescript-estree` 8.72.1 |
| @typescript-eslint/utils             | `node_modules/@typescript-eslint/utils` 8.72.1             |
| eslint-plugin-astro                  | `node_modules/eslint-plugin-astro` 3.2.1                   |

`@eslint-community/eslint-utils` propagates through its ESLint peer; `eslint-plugin-astro` propagates
through its eslint-utils dependency and ESLint/TypeScript parser peers. There are no additional
unreported runtime package findings in the production audit.

The latest published 10.x minimatch is 10.2.6; ESLint/config-array/typescript-estree require 10.x.
The patched 11.x does not satisfy those ranges. npm's proposed forced fixes include major downgrades
of ESLint and eslint-plugin-astro; neither a forced downgrade nor an unvalidated 11.x override is a
safe compatible remediation. Await patched 10.x or upstream range updates, then rerun the gates.
Risk is build/lint resource exhaustion when processing attacker-controlled glob patterns. Restrict CI
to normal reviewed repository tooling inputs and retain job timeouts; do not treat “dev only” as
irrelevant. Owner risk acceptance or an upstream fix remains a release decision.

## Actual screenshots and performance evidence

Capture root: **`screenshots/v04-review/`**.
Exact paths, routes, viewports, themes and capture type for every image are listed in
[screenshots/v04-review/README.md](../../screenshots/v04-review/README.md).

- `screenshots/v04-review/desktop/`: Home/Projects, EN/ES, light/dark, full + viewport; 16 files.
- `screenshots/v04-review/mobile/`: same matrix; 16 files.
- [Desktop contact sheet](../../screenshots/v04-review/contact-sheet-desktop.png).
- [Mobile contact sheet](../../screenshots/v04-review/contact-sheet-mobile.png).
- [Machine-readable audits](../../screenshots/v04-review/qa-results.json).
- Reproducible script: `screenshots/v04-review/capture.mjs`.

Filename pattern: `{device}/{home|projects}-{en|es}-{light|dark}-{device}-{full|viewport}.png`.
Examples: `desktop/home-en-light-desktop-full.png`,
`mobile/projects-es-light-mobile-full.png`, `mobile/home-es-dark-mobile-viewport.png`.
All are actual running-app Chromium screenshots, not mockups. Capture waits for fonts, decoded/eager
images, stable animation frames and exercised theme controls; screenshot animations are disabled.

Desktop viewport: **1440x900**. Mobile: **390x844**, device scale 1. Sixteen route/device/theme audits
found **0 horizontal overflows, 0 broken images, 0 missing localized package headings, 0 local
HTTP/request failures, 0 console errors and 0 uncaught page errors**. Contact sheets and the Spanish
mobile Projects full-page screenshot were visually inspected: cards stack, IDs wrap, CTAs fit, both
themes retain hierarchy, and existing imagery remains authentic. Owner aesthetic approval is still pending.

Local mobile English Home diagnostic: **LCP 104 ms, CLS 0, 148,776 resource-transfer bytes** after the
capture's eager-image load. Only `/theme.js` and the existing hashed Layout script were loaded as
external scripts. No new client bundle was introduced by package cards. These are unthrottled local
samples, not Lighthouse, production Core Web Vitals, or a field-performance guarantee. Later pages
share a browser context/cache and their transfer values must not be compared as cold loads.

## Changed-file inventory

```text
.github/workflows/refresh-content.yml
V04_NUGET_PODCAST_TECHNICAL_PLAN.md (mechanical formatting of supplied plan)
package.json
package-lock.json
scripts/fetch-content.ts
scripts/validate-content.ts
src/components/PackageSection.astro (new)
src/components/ResourceLink.astro (new)
src/components/Home.astro
src/components/ProfessionalPage.astro
src/components/FeedSection.astro
src/layouts/Layout.astro
src/data/packages.ts (new)
src/data/nuget/snapshot.json (new)
src/lib/packages.ts (new)
src/i18n/index.ts
src/styles/global.css
tests/packages.test.ts (new)
tests/browser/site.spec.ts
screenshots/v04-review/capture.mjs (new)
screenshots/v04-review/README.md (generated)
screenshots/v04-review/qa-results.json (generated)
screenshots/v04-review/contact-sheet-desktop.png (generated composite)
screenshots/v04-review/contact-sheet-mobile.png (generated composite)
screenshots/v04-review/desktop/*.png (16 actual screenshots)
screenshots/v04-review/mobile/*.png (16 actual screenshots)
docs/release/V04_QA_REPORT.md (new)
docs/editorial/V04_CONTENT_APPROVAL.md (new)
```

The public-content refresh that landed on `main` while this work was in progress added the November 4
blog entry and removed an older entry; those upstream feed changes were preserved. No v0.4 feed
collector output changed them. Production hosting configuration, DNS, Cloudflare, Network
Solutions, WordPress, original photographs and existing release evidence were not modified.
Raw local photo masters under `tmp/photos/` remain excluded from this release.

## Owner handoff and launch boundary

See [V04_CONTENT_APPROVAL.md](../editorial/V04_CONTENT_APPROVAL.md) for exact bilingual copy and
selection/metrics approval checkboxes, and the existing [LAUNCH_RUNBOOK.md](LAUNCH_RUNBOOK.md) for
hosting preflight, noindex staging, legacy URL inventory and rollback requirements.

Local reproduction:

```powershell
npm ci
npm run validate
npm run build
npm run test:e2e
npm run format:check
git diff --check
npm run preview -- --host 127.0.0.1 --port 4322
# In a second terminal:
node screenshots\v04-review\capture.mjs
```

Stop an already running preview before `npm ci` or Playwright's own preview on Windows, to avoid
native-module file locks and Astro's per-project preview lock.

**GO:** review the current local build and screenshot package; authorize staging only in a separate
owner decision. **NO-GO for production:** package/copy/metrics approval, remaining tooling-risk
acceptance, prior career/bio/photo-rights gates and staging/hosting/migration/rollback approvals remain
open. No staging, production, DNS, registrar, Cloudflare or WordPress changes were performed.
