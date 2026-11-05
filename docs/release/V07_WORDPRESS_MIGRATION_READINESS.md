# v0.7 WordPress migration readiness

**DOCUMENTATION ONLY. PRODUCTION NO-GO.** No Azure, Cloudflare, Network
Solutions, WordPress, registrar, nameserver or redirect changes were made.

## Intended architecture and observed state

- Network Solutions remains registrar. No transfer or renewal change is proposed.
- Cloudflare Free is the planned DNS/edge provider, subject to verified account
  capability and explicit approval.
- Azure Static Web Apps would serve `https://elbruno.com/` and eight Astro routes.
- The existing WordPress publication would use `https://blog.elbruno.com/`.
- `https://notienenombre.com/` remains independent.

Read-only checks on November 5, 2026 found the current root returning HTTP 200
with WordPress.com headers and its WordPress API discovery link. Root robots
advertises `/sitemap.xml` and `/news-sitemap.xml`. The proposed blog hostname
failed Windows TLS certificate validation (`SEC_E_WRONG_PRINCIPAL`). Certificate
checks were not bypassed. It is **not a verified working destination**.

The three dated article paths below are in the committed feed snapshot. The
`/tag/artificial-intelligence/` link and `/wp-content/uploads/2026/11/image.png?w=1024`
were observed on the current November 4 article. Archives, authors, categories,
pagination, attachments, legacy pages and all historical URLs still need an
authoritative export/crawl. Examples are not an assertion that every route exists.

## Required inventory before routing decisions

Export public permalink and sitemap inventories, important landing pages and
backlinks. An owner-authorized WordPress export must establish:

1. Dated posts, Unicode/percent-encoded slugs, case and trailing slash behavior.
2. Year/month archives, categories, tags and author archives, including pagination.
3. RSS/Atom, comments feeds and category feeds, `/page/N/` and feed pagination.
4. `wp-content/uploads`, attachment pages, CDN URLs and image transformation queries.
5. Query forms such as `?p=43780`, `?s=...`, `?feed=rss2`, tracking parameters,
   comment anchors and any existing canonical redirects.
6. Custom pages and collisions with `/`, `/es/`, `/about/`, `/projects/`,
   `/speaking/`, all localized counterparts and local asset/download paths.

Create an approved mapping with
`legacyUrl,targetUrl,expectedStatus,reason,ownerApproval`.
Keep unresolved collisions out of release rules. In particular, do not assume
an old `/about/` should be discarded or that all unknown paths are WordPress.
Fragments are client-side and are not sent in HTTP requests; verify that browser
navigation retains them separately.

## Redirect-layer decision, not a deployment recipe

| Candidate                            | Verified documentation / constraint                                                                                 | Disposition                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Single Redirects          | Supports dynamic/wildcard targets and 301; preserve-query option is **off by default**                              | First candidate for a small approved pattern inventory; explicitly enable query preservation and test plan/account limits |
| Cloudflare Bulk Redirects            | Candidate for exact historical mappings                                                                             | Verify account limits, subpath/query behavior and collisions before selecting                                             |
| Cloudflare Worker                    | Can express a precise allowlist and reserve new Astro paths, but adds code, quota and operations                    | Fallback only if rule capabilities prove insufficient; test on a separate approved host                                   |
| SWA route redirects                  | Ordered first-match routes; documented wildcards match suffixes, not a proven arbitrary capture/substitution engine | Exact rules may work for a small map; do not assume path/query substitution                                               |
| navigationFallback to Azure Function | No API exists in this project; may introduce loops, API cost/availability and wrong soft-404 behavior               | Not accepted as ready-to-copy code; no Function or fallback added                                                         |

**Selection remains provisional until actual routing-product rehearsal.** This
task cannot prove a rule installed in an account without modifying infrastructure,
which is prohibited here. The simplest documented candidate is Cloudflare
Single Redirects for verified non-colliding patterns, with exact mappings for
exceptions. No account-plan availability, quotas or live redirects are claimed.

Decision order for the future approved rehearsal:

1. Restrict rules to the apex/www publication hosts, never `blog.elbruno.com`.
2. Reserve exact new Astro routes and local assets, downloads, robots and sitemap.
3. Redirect only inventoried legacy paths/query forms, preserving the **entire**
   path and query to the blog host. Do not add a blanket catch-all.
4. Unknown nonlegacy paths must reach a real 404, never an SPA homepage.
5. Verify the destination is 200 with correct WordPress canonical host, not a
   redirect back to the apex. Apply HTTP/www normalization without multi-hop loops.

## Future acceptance commands with exact expected outcomes

These are **post-rehearsal expectations, not executed migration results**.
The blog target is currently unready. Run on an approved isolated routing setup
first, then on the real host only after approval. Each command is a separate
no-follow initial response check. Header-name casing is immaterial.

| Command                                                                                                                                           | Expected status and exact Location                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/2026/11/04/local-ai-in-github-copilot-plenty-of-ram-still-out-of-memory/"`                       | 301; `https://blog.elbruno.com/2026/11/04/local-ai-in-github-copilot-plenty-of-ram-still-out-of-memory/`                       |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/2026/10/31/from-zero-to-production-build-an-ai-agent-in-c-with-microsoft-agent-framework/"`      | 301; `https://blog.elbruno.com/2026/10/31/from-zero-to-production-build-an-ai-agent-in-c-with-microsoft-agent-framework/`      |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/2026/10/25/c-ollama-give-your-app-a-voice-with-phonon/"`                                         | 301; `https://blog.elbruno.com/2026/10/25/c-ollama-give-your-app-a-voice-with-phonon/`                                         |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/2026/11/04/local-ai-in-github-copilot-plenty-of-ram-still-out-of-memory/?utm_source=legacy&x=1"` | 301; `https://blog.elbruno.com/2026/11/04/local-ai-in-github-copilot-plenty-of-ram-still-out-of-memory/?utm_source=legacy&x=1` |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/feed/"`                                                                                          | 301; `https://blog.elbruno.com/feed/`                                                                                          |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/feed/?paged=2"`                                                                                  | 301; `https://blog.elbruno.com/feed/?paged=2`                                                                                  |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/tag/artificial-intelligence/"`                                                                   | 301; `https://blog.elbruno.com/tag/artificial-intelligence/`                                                                   |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/wp-content/uploads/2026/11/image.png?w=1024"`                                                    | 301; `https://blog.elbruno.com/wp-content/uploads/2026/11/image.png?w=1024`                                                    |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/2026/"`                                                                                          | After archive inventory approval: 301; `https://blog.elbruno.com/2026/`                                                        |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/2026/11/"`                                                                                       | After archive inventory approval: 301; `https://blog.elbruno.com/2026/11/`                                                     |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/?p=43780"`                                                                                       | After legacy-query collision approval: 301; `https://blog.elbruno.com/?p=43780`                                                |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/"`                                                                                               | 200; no Location                                                                                                               |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/es/"`                                                                                            | 200; no Location                                                                                                               |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/about/"`                                                                                         | 200; no Location                                                                                                               |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/projects/"`                                                                                      | 200; no Location                                                                                                               |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/es/speaking/"`                                                                                   | 200; no Location                                                                                                               |
| `curl.exe -I --max-redirs 0 "https://elbruno.com/v07-deliberately-missing-route/"`                                                                | 404; no Location                                                                                                               |
| `curl.exe -I --max-redirs 0 "https://blog.elbruno.com/2026/11/04/local-ai-in-github-copilot-plenty-of-ram-still-out-of-memory/"`                  | 200; no reverse redirect; canonical equals this URL                                                                            |

Also test the approved category/author/page inventory, encoded paths such as
`%C3%B1`, duplicated query keys and query values containing `%2F`/`%26`.
Never invent a legacy slug to satisfy a passing test.
Follow every actual mapping with `curl.exe -IL --max-redirs 5 "<approved-url>"`,
then GET the destination and compare content. Some servers handle HEAD
differently: this review observed NuGet HEAD 404 but GET 200, so investigate
HEAD failures rather than declaring every such URL broken.

## DNS, WordPress and cutover prerequisites

- Export the complete current zone and TTLs from the actual DNS operator.
  Preserve MX, SPF, all DKIM selectors, DMARC, TXT verification, CAA, SRV,
  autodiscover, mail and service-specific records. Do not publish private exports.
- Confirm actual WordPress.com plan, owner account, backup/export recovery,
  subdomain eligibility, permalink preservation and primary-domain behavior.
  WordPress.com documents subdomain connection on supported paid plans; do not
  assume the current account has one.
- Reproduce and compare the entire zone in Cloudflare before any approved
  nameserver change at Network Solutions. Plan DNSSEC/DS changes with the
  operator; avoid a stale DS record that invalidates DNS.
- Keep mail records DNS-only as required. Verify incoming/outgoing mail and
  SPF/DKIM/DMARC with the owner. Do not proxy mail records.
- Establish and test blog TLS, posts, RSS, media, comments, canonical URLs,
  sitemap and admin/login paths before moving the apex. Keep the old site available.
- Separately verify SWA apex/custom-domain validation, TLS and CAA compatibility,
  Cloudflare proxy mode and strict TLS behavior. Never choose flexible TLS to
  bypass origin certificate problems.
- Rehearse route reservation, redirects, exact query preservation, real 404s,
  loop prevention, edge cache and rollback on a nonproduction hostname.
- After approval, update profile/blog hosts and RSS discovery together. Current
  blog/feed links intentionally remain on the working WordPress apex until then.
- Remove staging robots/meta/header restrictions only from the explicit
  production build. Check the real apex and the Azure review host separately.
- After successful cutover, update Search Console/Bing ownership/sitemaps,
  inspect representative old/new URLs, crawl errors and canonicalization.
  Preserve legacy redirect coverage and monitor mail/TLS/404s.

## Rollback and stop conditions

Record a named decision owner, maintenance window, monitoring checks and rollback
authority before starting. Retain private verified exports of DNS/nameservers,
DNSSEC state, WordPress domains/permalinks, rules and the previous SWA artifact.

If any mail, TLS, canonical, route or redirect check fails, stop. Disable only
the newly introduced edge rules first, then restore the prior host/domain
settings and DNS zone/nameservers as appropriate to the failure. Keep the
previous origin live; verify its certificate and content before routing back.
Recheck mail and legacy/new URL samples after rollback. DNS TTLs and cached
301s can outlive a rollback; use fresh clients, communicate the recovery window
and never create reciprocal apex/blog redirects.

Photo assets remain separately gated. Public optimized derivatives and existing
official Speaker Kit downloads are not a grant of third-party reuse rights.
Do not expose original masters, private metadata, unapproved biographies or
unapproved photographer/event credits during migration.

## Sources checked, November 5, 2026

- [Cloudflare Single Redirect settings](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/)
- [Azure SWA configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
- [WordPress.com subdomain connection](https://wordpress.com/support/domains/connect-subdomain/)
- [Existing domain plan](../domain-migration.md)
- Current public root/robots/article and the committed feed snapshot.

**Exit gate:** production remains NO-GO until blog availability, complete approved
mapping, actual product rehearsal, full DNS/mail inventory, editorial/photo
approvals, explicit cutover authorization and tested rollback all exist.
