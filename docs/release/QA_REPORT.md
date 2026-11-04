# v0.3 launch-readiness QA report

## Decision

**READY FOR STAGING REVIEW** on a temporary, access-controlled, noindex hostname after its owner confirms the target and deployment access. Local production-preview QA is complete. A hosted staging smoke test was **NOT RUN** because no staging hostname or authorized deployment target was verified.

**Production release: NO-GO.** Bruno's confirmation of career facts, the public introduction and extended bios, photo reuse/credit terms, selected project descriptions, and any final CV remain open. No production deployment or infrastructure change was made.

## Implemented and audited

- The About page remains a useful bilingual profile and evidence-linked CV snapshot. It shows the owner-supplied current role and selected work, without inventing employment dates, earlier roles, accomplishments, or a CV download.
- New Year New Bot now says **Coming soon / Próximamente**, in line with its repository description. No unverified project was added.
- The Speaker Kit publishes only a concise English or Spanish introduction and copy controls. Its ZIP contains the three official photos plus an accurate README; all six extended biography drafts are omitted from the site output and ZIP, and are documented for review in `docs/editorial/CONTENT_APPROVAL_CHECKLIST.md`.
- The existing photo downloads and source masters were not edited by this task. The package checks confirm each ZIP photo matches its standalone JPEG byte-for-byte and has no EXIF metadata. No `t2i` generation or image editing was needed.
- English/Spanish feeds, route structure, theme, mobile navigation, robot, and Bug Invaders remain covered by tests. No feed items were hidden.
- `docs/release/LAUNCH_RUNBOOK.md` records the temporary-host procedure, owner gates, legacy WordPress URL/feed inventory, DNS/email cautions, and rollback outline.

## Commands and results

| Command                                                          | Result                                                                                                                                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci --registry=https://registry.npmjs.org`                   | Passed; installed 389 packages. npm reported 12 advisories in the complete dependency tree (11 moderate, 1 high).                                                            |
| `npm audit --omit=dev`                                           | Passed; 0 production-dependency vulnerabilities reported. The development-tree advisories were not auto-fixed.                                                               |
| `npm run build-speaker-kit`                                      | Passed; regenerated a four-file ZIP: three official photos and `README.txt`.                                                                                                 |
| `npm run validate`                                               | Passed: Astro check (0 errors, 0 warnings; 2 existing `XMLValidator` deprecation hints), ESLint, 16/16 unit tests, content snapshot validation, and static build (10 pages). |
| `npm run test:e2e`                                               | Passed: 28/28 Chromium desktop/mobile cases.                                                                                                                                 |
| `npx prettier --check` on changed source, docs, and QA artifacts | Passed.                                                                                                                                                                      |
| `git diff --check`                                               | Passed.                                                                                                                                                                      |

### Functional, accessibility, and SEO coverage

Follow-up packaging check: `npm run format:check` passes after formatting the supplied plans and earlier visual-review README for inclusion in GitHub. No website behavior changed during that follow-up.

- All eight localized routes returned HTTP 200 in the local production preview. Tests verify `html[lang]`, one main `h1`, canonical URLs, EN/ES and `x-default` alternates, non-empty descriptions, Open Graph image metadata, no accidental page-level `noindex`, and successful same-origin links.
- The sitemap index and localized sitemap entries were checked. Production `robots.txt` allows indexing and links the sitemap; the Azure preview workflow injects noindex rules at deployment time. Hosted preview headers and robots behavior were not exercised.
- Axe checks passed without WCAG 2 A/AA or WCAG 2.1 AA violations for the eight routes in light and dark themes. Tests check image `alt` attributes, localized navigation, mobile menu Escape behavior and keyboard focus, clipboard success/fallback, photo and ZIP responses, and game/robot interactions.
- The build-time snapshot displays three entries each for blog, podcast, and YouTube, plus two selected GitHub repositories. The suite verifies the counts and existing parser/snapshot validation tests cover invalid-feed handling; no external feed refresh was run.
- Each individual photo download returned HTTP 200 with `image/jpeg` and matched its source download bytes. The ZIP returned HTTP 200 with `application/zip` and matched the generated archive. ZIP contents and metadata were unit-tested.
- Public-link HEAD checks returned 200 for [New Year New Bot](https://github.com/elbruno/new-year-new-bot), [PromptDot](https://github.com/elbruno/PromptDot), [No Tiene Nombre](https://notienenombre.com/), and [elbruno.com](https://elbruno.com/). LinkedIn returned HTTP 999, an anti-bot response; its profile contents could not be verified and this does not establish that the link is broken.

## Screenshots and browser review

Captured from the running **local production build**, not generated mockups:

- [Screenshot inventory and route audit](../../screenshots/launch-review/README.md)
- [Desktop contact sheet](../../screenshots/launch-review/contact-sheet-desktop.jpg)
- [Mobile contact sheet](../../screenshots/launch-review/contact-sheet-mobile.jpg)
- [Raw browser and performance results](../../screenshots/launch-review/audit-results.json)

The package contains 32 PNGs: all eight routes in both languages at 1440x900 desktop and 390x844 mobile, Home/About above-the-fold views, and dark Home/Speaker Kit full-page captures. Fonts were awaited; lazy images were scrolled into view and decoded; animations were disabled. Across 24 route/theme/viewport combinations the capture reported no broken images, horizontal overflow, console/page errors, bad HTTP responses, or failed same-origin requests. Representative Home, About, Speaker Kit, Projects, and contact-sheet images were visually inspected; no clipping or layout defect was observed.

## Local performance sample (not Lighthouse)

One unthrottled Playwright Chromium 156.0.8078.4 sample of the production preview at `http://127.0.0.1:4322/`, 390x844, light theme:

| Measurement              |                                                   Result |
| ------------------------ | -------------------------------------------------------: |
| DOMContentLoaded         |                                                    26 ms |
| Load event               |                                                    28 ms |
| Largest Contentful Paint |                                                   120 ms |
| Cumulative Layout Shift  |                                                   0.0000 |
| Resource count           |                                                        7 |
| Initial transfer bytes   |                                                  147,670 |
| Image transfer bytes     |                                                  139,443 |
| Largest image resources  | StackChan hero 84,110 bytes; AI Tour teaser 53,708 bytes |

These are local single-run measurements without mobile network/CPU throttling. They are not Lighthouse scores, field data, or a prediction of Azure performance.

## Remaining risks and owner actions

- The public profile was blocked from automated inspection (HTTP 999); the current title/focus are treated as owner-supplied, not independently verified.
- Confirm role dates, earlier career, education, achievements, approved talk references, and a reviewed CV if desired.
- Approve or revise the short public introduction and all six extended bios before using them as event-ready copy.
- Confirm photo permissions, photographer/event credits, and acceptable reuse terms in writing. Public download is not permission.
- Verify project descriptions and status, and approve or edit all public content.
- **Repository visibility caveat:** the repository is public. Although long bios are no longer rendered on the website or included in the ZIP, their source and review text remain readable in GitHub. The checklist states this explicitly; treat them as drafts, not private material.
- A real staging hostname, Azure response headers, TLS, noindex behavior, CDN behavior, and deployment credentials remain unverified. Follow the runbook only after an owner approves a staging target.
- Production redirect behavior, old WordPress permalink/feed inventory, Cloudflare, DNS/mail records, and rollback have not been exercised or changed.

## Infrastructure boundary

No Azure deployment, production or staging upload, DNS or nameserver action, Cloudflare setting, WordPress migration, or registrar change occurred. The local preview was stopped after captures.
