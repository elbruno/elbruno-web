# Public content sources

Verified on November 4, 2026. Data is retrieved at build/refresh time, never from visitors' browsers.

| Source       | Verified location and evidence                                                                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WordPress    | `https://elbruno.com/feed/`, advertised by the current homepage's RSS alternate link; successfully parsed                                                                   |
| Podcast      | `https://feeds.ivoox.com/feed_fg_f1277993_filtro_1.xml`, canonical feed returned by Apple Podcasts lookup for the show linked from `notienenombre.com`; successfully parsed |
| YouTube      | `UCyHCkJ4lsphfhu_ljRws6aA`, canonical channel URL in the YouTube page linked as `youtube.com/elbruno` from the podcast site's public application                            |
| YouTube feed | `https://www.youtube.com/feeds/videos.xml?channel_id=UCyHCkJ4lsphfhu_ljRws6aA`; successfully parsed                                                                         |
| GitHub       | Public REST `repos/elbruno/new-year-new-bot` and `repos/elbruno/PromptDot`, checked against actual repository descriptions                                                  |
| Identity     | Owner-provided project specification, section 15                                                                                                                            |

The current blog host is **not** `blog.elbruno.com`. That host is a migration candidate, not an established fact. Do not switch feeds, outbound URLs or canonical post URLs before verifying the WordPress migration.

PromptDot is a desktop teleprompter. The mockup's example description as a prompt organizer was not used. New Year New Bot is an in-development AI desk companion experiment, not a claimed released product. Only two featured repositories were verified and selected; no third one was invented.

## Pipeline

`npm run refresh-content` requests each source with a 20-second timeout and a streaming 2 MB response limit. Only HTTPS endpoints are accepted. XML DTD/entity declarations and invalid XML are rejected. Snippets become bounded plain text; third-party HTML is never rendered. Entries need usable titles, HTTPS links and valid, nonfuture publication dates.

Normalization removes duplicates, sorts by actual publication time and keeps three entries per source. Tie ordering is deterministic. A failed or empty source retains its old entries and old source metadata. Repository failures retain the previous matching repository. Snapshots are runtime-validated before writing and before rendering.

The committed JSON is sufficient for offline builds. There is intentionally no generated-at timestamp that would cause meaningless refresh commits. Titles and snippets retain the publication's original language. GitHub descriptions retain source wording.

## Automation and manual operation

The refresh GitHub Actions workflow runs at minute 17 every six hours and supports manual dispatch. Only changed normalized JSON is committed. A changed snapshot triggers a preview deployment only when Azure has been explicitly enabled. Bot commits do not themselves trigger ordinary push workflows, so refresh deployment is explicit.

```powershell
npm run refresh-content
npm run validate-content
npm run build
```

Environment overrides are optional and documented in `.env.example`. The TypeScript CLI reads process environment variables, not `.env` files automatically. Default sources require no token. If unauthenticated GitHub API requests are rate-limited, old metadata is preserved. Add a scoped read-only token only if observed limits justify it; never send that token to non-GitHub sources.

GitHub schedules can be delayed or disabled after inactivity. Monitor workflow execution and warnings, verify publication dates in snapshots periodically, and manually dispatch after a long pause. A green run with outage warnings means the last-known-good content remains, not that every source refreshed successfully.

## External content and images

Only original publication links, titles, short plain-text excerpts and metadata are stored. No third-party photos or thumbnails are rehosted. The site currently uses its own artwork rather than making visitors fetch external images. This avoids unverified image rights, tracking pixels, unstable thumbnail URLs and third-party embeds.

There are no invented stars, view counts, durations or podcast episode numbers. Any numbers in source titles are the publication's original title, not a site-generated claim.
