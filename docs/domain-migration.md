# Domain migration, separate owner-approved track

**No DNS, registrar, WordPress, redirect or Azure custom-domain settings were changed.** The current implementation is for review at a temporary Azure Static Web Apps hostname. Network Solutions remains the registrar and current DNS remains untouched.

## Observed current state

On November 4, 2026, `https://elbruno.com` served WordPress and advertised `https://elbruno.com/feed/`. Its feed identified WordPress.com as generator. This does not establish the hosting plan, paid features, custom-domain eligibility or email DNS configuration.

The podcast remains at `https://notienenombre.com`. The repository and build configuration do not provision Azure resources, configure Cloudflare or move publications.

## Prerequisites and staged plan

1. Obtain owner access and approval for an inventory-only audit. Export current Network Solutions DNS, including MX, SPF, DKIM, DMARC, verification and other service records. Record TTLs. Confirm domain ownership and renewal status without changing registrar.
2. Verify WordPress hosting type and plan, existing canonical URL, custom domain/subdomain support and permalink structure. Export posts, sitemap indexes, category/tag/archive URLs, media URLs and a crawl of important inbound links.
3. Build the site on a separate Azure Static Web Apps resource/temporary hostname. Configure the GitHub deployment secret and opt-in variable as described in README. Confirm temporary hostname, TLS, caching, response headers, eight bilingual content routes and 404 behavior. Preview deployments stay `noindex`.
4. In a separate approved maintenance window, configure and verify the actual WordPress publication at `blog.elbruno.com` if its hosting permits. Test RSS, media, post permalinks, comments, canonical URLs and sitemaps before redirecting anything.
5. Design a reviewed URL mapping from the historical inventory. Audit each collision with the new site: `/about/`, `/projects/`, `/speaking/`, `/blog`, `/podcast`, `/feed/`, `/es/` and asset paths. Do not assume old `/about/` should become the new homepage biography. Keep ambiguous paths out of deployed rules until resolved.
6. Choose Cloudflare's simplest supported path-aware facility after checking the actual account's current plan and limits. Exact path mappings can use redirect/bulk rules where suitable; conditional path routing may require a Worker. DNS alone does not route by URL path. No rule syntax or availability is assumed here.
7. Reproduce the full DNS zone at the planned provider, verify mail and service records, then perform an owner-approved nameserver change. Registrar stays Network Solutions. Configure Azure custom-domain verification/certificate using current Azure instructions, and check proxy/TLS compatibility before enabling Cloudflare proxying.
8. Apply only reviewed legacy redirects, update website blog links/feed configuration and WordPress canonical hosts, remove preview indexing restrictions only on production, then validate Search Console and sitemaps.

## Testable redirect mapping strategy

Create a reviewed CSV with `legacyUrl,targetUrl,expectedStatus,reason`, based on actual exported URLs, not guessed articles. Keep unresolved collisions in a separate list. For dated posts, preserve the exact path and query behavior at the new host. Include category/tag archives, `/feed/`, attachment pages, `/wp-content/`, media and custom routes in the inventory.

For each approved row, issue a no-follow request, compare status and exact `Location`, then follow to confirm a successful canonical target without loops. Test at least:

| Case                                   | Expected outcome                                                       |
| -------------------------------------- | ---------------------------------------------------------------------- |
| New `/`, `/es/` and six content routes | New site, HTTP 200, no legacy redirect                                 |
| Verified historical dated post         | One permanent redirect to the exact new WordPress path                 |
| Verified historical media and feed     | Explicit approved behavior, intact data                                |
| Unknown path                           | Actual HTTP 404, never an SPA homepage with status 200                 |
| Redirect target itself                 | HTTP 200, no redirect back to the old host                             |
| Query string and encoded paths         | Preserved or deliberately normalized according to the reviewed mapping |
| Colliding old/new route                | Owner-selected behavior documented and tested                          |

Use `curl.exe -I --max-redirs 0 <reviewed-url>` for initial headers and `curl.exe -IL --max-redirs 5 <reviewed-url>` for chain checks. Automate the same table over a staging routing setup before release. Never add a blanket `/*` redirect.

The code currently adds **no outbound shortcut redirects**, because legacy collisions have not been inventoried. Navigation uses verified direct external URLs instead.

## Cutover checklist

Record an approved window and responsible owner. Save DNS/routing/WordPress exports. Confirm temporary-host QA, content snapshot, Azure certificate, mail records, reviewed mapping tests, monitoring and rollback permissions. Ensure production canonical/alternate/sitemap URLs and robots settings agree. Check historic samples and email before declaring success.

## Rollback

Retain the previous DNS zone, nameservers, WordPress domain settings and edge rule exports. If routing fails, disable only the newly introduced redirect rules first. Restore prior publication/domain settings and DNS from verified exports as appropriate. Do not point WordPress at the new site or reverse redirects blindly. Account for cached DNS and permanent redirects; test with fresh requests and communicate any recovery window.

Stop the cutover if certificate issuance, mail validation, mapping correctness or owner permissions are unresolved. Keep the old site serving until the staged checks succeed.
