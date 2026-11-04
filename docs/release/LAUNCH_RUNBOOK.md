# Staging and launch runbook

This runbook prepares a review; it does not authorize or perform a deployment, domain binding, DNS change, Cloudflare change, WordPress migration, or registrar change. Production remains on the existing service until Bruno gives a separate, explicit go-ahead.

## Current build and hosting

- Static Astro output is produced by `npm run build` in `dist/`.
- The site hostname is set to `https://elbruno.com` in `astro.config.mjs`; canonical URLs and the sitemap therefore target the production domain even in a local preview.
- Azure Static Web Apps is the planned host. `.github/workflows/deploy.yml` deploys a prebuilt `dist/` only when repository variable `AZURE_SWA_ENABLED` is exactly `true` and `AZURE_STATIC_WEB_APPS_API_TOKEN` is configured. The workflow adds preview `robots.txt` disallow rules and `X-Robots-Tag: noindex, nofollow`.
- `public/staticwebapp.config.json` defines CSP/security headers, cached static assets, trailing-slash handling, and a real localized 404 response. It does not itself add `noindex`; use the preview workflow's injected preview controls on a review hostname only.
- Local review requires Node.js 22.23.4 or newer and npm. No secrets or network are needed for the static build, content snapshot, or local Playwright suite.
- No preview credentials or deployed temporary hostname have been verified as available for this review. Do not enable the repository variable or dispatch a workflow based on this document alone.

## Local preflight and staging smoke test

Run from the repository root:

```powershell
npm ci
npm run format:check
npm run validate
npm run test:e2e
npm run build
npm run preview -- --host 127.0.0.1 --port 4322
```

In another terminal, open `http://127.0.0.1:4322/` and run the Playwright capture/QA script documented in `screenshots/launch-review/README.md`. The local preview is not a staging hostname and its canonical metadata still names `elbruno.com`.

Before any authorized staging upload, the owner/operator must confirm the Azure resource and subscription, the preview hostname, access controls, deployment environment approvals, secret availability, and the staging-specific noindex response. Use an isolated temporary Azure Static Web Apps hostname; do not attach `elbruno.com`. Keep the site's canonical-domain configuration under review, since a local build currently emits production canonical URLs.

At the temporary hostname, verify:

1. `/`, `/about/`, `/projects/`, `/speaking/` and their `/es/` equivalents return 200; unknown paths return a real 404.
2. HTTP response headers include the intended CSP, `X-Content-Type-Options`, referrer policy, permissions policy, and `X-Robots-Tag: noindex, nofollow`; `/robots.txt` disallows indexing on the preview host.
3. EN/ES language switching, titles, document language, canonical/alternate links, sitemap behavior, both themes, mobile navigation, keyboard focus, clipboard controls, robot, and Bug Invaders work.
4. All three photo downloads and the ZIP return 200 with correct MIME types and the expected bytes. Photo reuse permissions remain unapproved.
5. The latest committed content snapshot renders three blog, podcast, and video entries, plus the curated GitHub entries. Confirm no same-origin asset failures, broken images, console errors, or mobile overflow.
6. Axe checks show no critical/serious findings on the eight localized content routes in light and dark themes. Manual keyboard, focus, contrast, language, image-alt, and responsive review is still required.
7. Page performance measurements and screenshots are recorded in the QA report, with the tested hostname, viewport, date, and browser identified.

Do not treat temporary staging success as a production sign-off.

## Required owner go/no-go

Record a separate decision and date before any production change:

- [ ] Approve English and Spanish public introduction and all six extended bios, or specify approved edits.
- [ ] Confirm image reuse rights, photographer credits, event-mark terms, and organizer usage boundaries.
- [ ] Supply verified career history/dates and approved accomplishments, or approve omission; review/supply a public CV PDF if desired.
- [ ] Confirm selected project descriptions and `Coming soon / Próximamente` status.
- [ ] Review the eight localized routes, screenshot set, QA report, and staging smoke-test evidence.
- [ ] Approve an actual staging-to-production plan, owner, maintenance window, and rollback authority.
- **Decision:** `NO-GO` until all applicable owner gates are resolved. Record approver, decision, date, and conditions here before changing the status.

## Legacy WordPress and URL inventory (separate project)

No old WordPress URL list or redirect mapping is included in this repository. Before a migration, export and review:

- WordPress posts and exact permalink paths, query-string behavior, categories, tags, archives, pagination, attachment pages, uploaded media paths, custom routes, and canonical URLs.
- WordPress RSS/feed endpoints, including the current `https://elbruno.com/feed/`, plus any category or podcast feeds and inbound feed consumers.
- A crawl of important linked/indexed URLs, sitemaps, Search Console landing pages, and representative backlinks.
- Hosting provider, current WordPress plan, custom-domain/subdomain support, permalink behavior, admin access, backups, and the intended `blog.elbruno.com` target.
- The complete Network Solutions DNS zone, TTLs and service-verification records. Include MX, SPF, DKIM, DMARC, mail/autodiscover and all third-party service records.

Create a reviewed mapping file with columns `legacyUrl,targetUrl,expectedStatus,reason,ownerApproval`. Test each mapped row without following redirects, then follow chains and check for loops, query loss, encoded-path changes, wrong canonical hosts, and content mismatches. Keep unresolved collisions out of deployment. In particular, inventory paths that collide with the new `/`, `/about/`, `/projects/`, `/speaking/`, `/es/`, asset, blog, podcast, and feed paths. Do not use a blanket catch-all redirect or assume that a missing article should become the new homepage.

Only after a separate approval, test 301 behavior for every allowlisted historical URL, preserve post paths where intended, and verify explicit behavior for media, feeds, archives, unknown paths, and query parameters. The independent `notienenombre.com` podcast remains separate.

## DNS and Cloudflare caution

Do not change nameservers as part of staging. Before a separately approved DNS migration, export and compare the entire existing zone with the target zone, especially all email and validation records. Verify mail delivery and critical services on the target provider before any owner-authorized nameserver change. DNS does not implement path-based URL redirects; choose and test a supported routing product against the reviewed URL map. Registrar and renewal settings also remain outside this code task.

## Production rollback outline (not an execution instruction)

1. Retain verified backups of the old WordPress site, its domain/permalink settings, the DNS zone, and all edge redirect/routing rules.
2. Keep the prior origin available throughout any future cutover.
3. If an approved release fails, disable only the newly introduced redirect/routing rules first, then restore the last-known-good host/domain settings and DNS from the reviewed export as appropriate.
4. Recheck TLS, canonical URLs, robots, feeds, representative old/new routes, email, and external services. Account for cached DNS and permanent-redirect caching; do not create reciprocal redirects or blindly repoint WordPress.
5. Stop and roll back if certificates, mail, route mapping, or owner approvals fail. Record the incident, affected URL samples, and recovery decision.

No staging or production deployment, DNS action, Cloudflare change, WordPress migration, or registrar change has been performed by this task.
