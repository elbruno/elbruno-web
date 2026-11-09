# Content verification and editorial approvals

This summary separates owner-supplied information from repository-backed project details and items still needing Bruno's confirmation. No career dates, prior roles, education, achievements, talk metrics, or CV details have been inferred. See the [detailed editorial approval checklist](editorial/CONTENT_APPROVAL_CHECKLIST.md) for all six draft biographies and owner decisions.

## Facts used on the site

### Upcoming streams, verified November 8, 2026

The [current official .NET Conf agenda](https://www.dotnetconf.net/agenda) now
lists one Bruno Capuano session: [.NET + Foundry: Better Together](https://www.dotnetconf.net/agenda#session-D2T20261111040000),
November 11, 2026, 16:00-16:30 PST. The former November 10 listing is now a
different speaker's session, and Beyond Localhost is no longer listed. This
verification supersedes the older two-session schedule documented below.

Home and Speaker Kit now group online appearances into three cards:

- **.NET Conf 2026:** the single currently listed session and official agenda.
- **[.NET + Foundry: Better Together](https://aka.ms/netfoundry-bt):**
  [episode 03](https://developer.microsoft.com/en-us/reactor/events/27632/),
  November 12, 2026, and
  [episode 04](https://developer.microsoft.com/en-us/reactor/events/27634/),
  December 3, 2026. Reactor confirms 17:00-18:00 UTC for both, displayed as
  09:00-10:00 PST. Each links to registration and its published episode resource
  page. Specific topics remain unconfirmed. October episodes are not promoted as
  future sessions.
- **[New Year, New Bot](https://aka.ms/newyearnewbot):** three proposed episode
  themes from the public series page, progressing from StackChan hardware to a
  .NET/Aspire AI backend and an agentic companion. Dates, streaming channel, and
  collaboration details are not confirmed. No dates or individual episode URLs
  are invented: the sessions link targets the existing `#series` section.

All scheduled dates use Pacific Time with explicit PST labels. Browser status
updates cover the conference and both Reactor sessions, including leave-open
transitions. Once all confirmed sessions end, the section becomes "Streams &
series"; proposed robot episodes remain explicitly marked as proposals. No
recording availability is inferred. Without JavaScript, status reflects build
time. Titles of external episodes retain their published English wording.

### V06 UX refinement, verified November 5, 2026

The official agenda was checked again. Both titles, dates, session fragments and
PST times in the table below remain confirmed. The conference is now the primary
heading, with a single primary event CTA and a secondary agenda link. After both
sessions end it remains a .NET Conf speaking highlight, without recording claims.

The GitHub API and repository READMEs confirm the following homepage selection:

1. [New Year New Bot](https://github.com/elbruno/new-year-new-bot): coming-soon
   StackChan and .NET maker project.
2. [MarkItDotNet](https://github.com/elbruno/ElBruno.MarkItDotNet): converts
   documents and file formats to Markdown for AI pipelines.
3. [LocalEmbeddings](https://github.com/elbruno/elbruno.localembeddings): local
   ONNX Runtime embeddings with Microsoft.Extensions.AI, without cloud API calls.
4. [OllamaMonitor](https://github.com/elbruno/ElBruno.OllamaMonitor): Windows
   system-tray utility for local Ollama status, models and resource usage.

From GitHub uses its own stable order: MarkItDotNet, LocalEmbeddings,
OllamaMonitor, New Year New Bot. Cards use API descriptions, language, stars and
update dates when available. Missing metadata leaves a working repository link
without fabricated metrics. PromptDot remains in Projects and historical data,
but is not promoted on Home. NuGet statistics remain a separate integration.

External absolute blog links use the shared ResourceLink policy, with an isolated
new tab and a localized screen-reader notice. Internal routes retain same-tab
navigation. Existing podcast new-tab behavior is unchanged.

Refresh just repository metadata with
`npm run refresh-content -- --repositories-only`, without changing feed or NuGet
snapshots. Existing non-curated historical repository metadata is retained.

### V05 update, verified November 5, 2026

The owner supplied the current positioning: Cloud Advocate at GitHub / Microsoft,
focused on AI Agents, AI and .NET. No employer dates or additional roles are inferred.

The [official .NET Conf website](https://www.dotnetconf.net/) lists November 10-13, 2026. The [official agenda](https://www.dotnetconf.net/agenda) confirms Bruno Capuano:

| Session                                  | Date              | Official time   | Agenda                                                                       |
| ---------------------------------------- | ----------------- | --------------- | ---------------------------------------------------------------------------- |
| .NET + Foundry: Better Together          | November 10, 2026 | 12:00-12:30 PST | [Day 1 session](https://www.dotnetconf.net/agenda#session-D1T20261110120000) |
| Beyond Localhost: .NET Agents in Foundry | November 11, 2026 | 16:00-16:30 PST | [Day 2 session](https://www.dotnetconf.net/agenda#session-D2T20261111040000) |

Session summaries are concise adaptations of the official abstracts, translated
into Spanish. No recordings are claimed. Status is evaluated at build time and
refreshed in the browser on load, every 30 seconds, and on visibility changes.
After both sessions finish, the heading becomes a speaking highlight, not an
upcoming invitation. JavaScript-disabled pages reflect their last build date.

The three-country story and winter caption are owner-supplied bilingual copy.
The four strategic resource URLs are maintained in `src/data/profile.ts` and linked
once each in the Speaker Kit. The existing NuGet dashboard links remain intact.

| Published fact                                                                                    | Source                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bruno Capuano is a Cloud Advocate at Microsoft.                                                   | Owner-supplied launch brief and `src/data/profile.ts`; [public profile](https://www.linkedin.com/in/elbruno/) returned HTTP 999 during this audit, so its contents could not be independently confirmed. |
| His stated focus includes AI and .NET, with Azure, GitHub, and developer communities.             | `src/data/profile.ts`; `V03_IMPLEMENTATION_PLAN.md`                                                                                                                                                      |
| New Year New Bot and PromptDot are public projects.                                               | [New Year New Bot](https://github.com/elbruno/new-year-new-bot); [PromptDot](https://github.com/elbruno/PromptDot)                                                                                       |
| No Tiene Nombre is a Spanish-language technology podcast.                                         | [No Tiene Nombre](https://notienenombre.com/); `src/data/profile.ts`                                                                                                                                     |
| Bruno's blog is at elbruno.com.                                                                   | [elbruno.com](https://elbruno.com/); `src/data/profile.ts`                                                                                                                                               |
| The site uses owner-supplied StackChan, community, running, Ace, headshot, and event photographs. | `docs/photo-asset-manifest.md`; original files under `tmp/photos/`                                                                                                                                       |

Career data is maintained in `src/data/cv.ts`. The current position has no displayed date range because no verified start date was supplied. Only that current role is listed. `New Year New Bot` is presented as coming soon, matching its repository description.

## Bruno's approval or source material needed

- Start and end dates for the Microsoft role; prior employers, roles, dates, and descriptions.
- Education, certifications, measurable achievements, and any claims of impact.
- Links to specific talks, session recordings, event names, and approved talk descriptions.
- A current CV document, reviewed and approved for public download.
- Editorial approval of all six English and Spanish Speaker Kit biography drafts.
- Written confirmation of photo reuse permissions and any required photographer/event credits.
- Confirmation that the selected-project descriptions remain accurate and representative.

Until approved materials are supplied, the site does not publish a downloadable CV, claim an employment timeline beyond the current role, list unverified talks, or label photographs as rights-cleared. The six extended bios are not rendered by the site or packaged in the ZIP, but remain in source and the editorial checklist. Since this repository is public, they are readable by repository visitors and are not confidential.
