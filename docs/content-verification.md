# Content verification and editorial approvals

This summary separates owner-supplied information from repository-backed project details and items still needing Bruno's confirmation. No career dates, prior roles, education, achievements, talk metrics, or CV details have been inferred. See the [detailed editorial approval checklist](editorial/CONTENT_APPROVAL_CHECKLIST.md) for all six draft biographies and owner decisions.

## Facts used on the site

### .NET Conf recordings and upcoming streams, verified November 16, 2026

The [official .NET Conf speaker profile](https://dotnet.microsoft.com/en-us/conf/2026/speakers/bruno-capuano)
lists four sessions, with official details and on-demand recordings:

- [Small Models, Big .NET Energy](https://dotnet.microsoft.com/en-us/conf/2026/agenda/brk037),
  November 10, 18:30-19:00 PST, [recording](https://youtu.be/ongDevKLRxM).
- [.NET + Foundry: Better Together](https://dotnet.microsoft.com/en-us/conf/2026/agenda/brk007),
  November 11, 16:00-16:30 PST, [recording](https://www.youtube.com/watch?v=o2RUf9npgns).
- [Beyond Localhost: .NET Agents in Foundry](https://dotnet.microsoft.com/en-us/conf/2026/agenda/brk031),
  November 11, 17:00-17:30 PST, [recording](https://youtu.be/Dq8fcig5-Gk).
- [Give Your .NET Agent a Face: Building an AI Desk Companion with M5Stack](https://dotnet.microsoft.com/en-us/conf/2026/agenda/brk040),
  November 11, 19:00-19:30 PST, [recording](https://youtu.be/7EXrTrcJ7zA).

The BRK007 YouTube oEmbed metadata confirms the video title and official
[@dotnet channel](https://www.youtube.com/@dotnet). Bruno supplied its URL.
The other three recording URLs are listed in the matching public
[session repositories](https://github.com/dotnetConf/2026/tree/main/Technical).

The .NET + Foundry: Better Together livestream is a separate series that airs
every two weeks on the .NET Channel and Microsoft Reactor. The similarly named
BRK007 is a one-time, 30-minute .NET Conf session.

The homepage and Speaker Kit separate upcoming events from the four-session .NET Conf
recording highlights. Upcoming events include [Foundry series episode 04](https://developer.microsoft.com/en-us/reactor/events/27634/)
on December 3, and the three [New Year, New Bot](https://aka.ms/newyearnewbot)
sessions on November 24, December 1, and December 8. Reactor confirms 17:00-18:00
UTC (09:00-10:00 PST) for episode 04 and 18:00-19:00 UTC (10:00-11:00 PST) for
the bot sessions. The series cadence and channels are owner-supplied. Past
livestream dates are no longer shown as upcoming.

Conference titles link to official session details, with separate recording
links when published. Future livestream entries disappear from the live list
after they end. Scheduled times use Pacific Time; status updates run on page
load, every 30 seconds, and when the page becomes visible. Without JavaScript,
status reflects build time. Upcoming sessions are ordered chronologically, rather
than by series, and only the four conference recordings appear as past highlights
on Home. Both presentations link to the full Events directory.

### Events and RSS local review, November 17, 2026

The bilingual `/events/` and `/es/events/` directory reuses the existing
conference and series data. The local review catalogue now also includes 29
independently verified public appearances: 11 .NET AI Community Standups, four
Spanish-language Copilot sessions at Reactor, .NET Day on Agentic Modernization,
the Reactor modernization-skills session, Latino NET Online, Foundry episode 03,
and .NET Conf in Mississauga. Further public-source verification added six
scheduled Reactor broadcasts, Foundry episodes 01 and 02, and the Global AI
Sarasota keynote. On November 17 this produces **32 past events and
five upcoming events**, rather than an archive restricted to four .NET Conf talks.
Twenty-two archived appearances have public recording links. Distinct scheduled
broadcasts keep their own event pages and times; simultaneous video mirrors do
not create extra entries. The Sarasota video is labeled as a full-event recording,
not a session-specific cut.

Public YouTube descriptions establish participation for the standups and
Latino NET Online; their broadcast metadata establishes dates. The linked
Reactor and Meetup pages establish speakers and schedules for the other
additions. Recording-only sources retain date-only precision rather than
turning video runtime into a claimed session schedule. A recording link and
an event-details link are not shown as separate actions when they are the same
destination.

The six additional Reactor schedules are publicly documented at events
[26649](https://developer.microsoft.com/en-us/reactor/events/26649/),
[26648](https://developer.microsoft.com/en-us/reactor/events/26648/),
[27028](https://developer.microsoft.com/en-us/reactor/events/27028/),
[27029](https://developer.microsoft.com/en-us/reactor/events/27029/),
[26752](https://developer.microsoft.com/en-us/reactor/events/26752/) and
[26753](https://developer.microsoft.com/en-us/reactor/events/26753/).
The public [Foundry series resources](https://elbruno.github.io/NETFoundry-BetterTogether/)
name Bruno and link the first two episodes; the
[Sarasota agenda](https://globalai.community/e/9hlij6cs) names his keynote and
its November 13, 14:15-14:45 EST slot.

Additional records need public evidence of both participation and date.
On November 17, the owner approved the expanded catalogue and all reviewed site
changes for GitHub publication and deployment to the existing Azure site.
Domain binding, DNS changes and WordPress migration remain outside this update.
The archive is a growing curated selection, not a claim to cover every career
appearance. Year/type filters compose with upcoming/past views; without
JavaScript, both lists remain available as built. Completed sessions move to the
archive while the page remains open, without inventing recording links. Home
still has only the four .NET Conf recordings as past highlights; the larger
archive belongs on Events.

Dates with confirmed times use Pacific time for display and exact instants for
classification. Future date-only records display the verified event/broadcast
date, retain a separate Today state, and change status at midnight UTC rather
than inventing a session time.

The public WordPress and podcast feeds were successfully refreshed locally.
The latest returned publications were the November 16 firmware fine-tuning blog
post and `NTN 598 - Agentes: el pasante con root`. Home now displays two entries
from each source and a compact latest-podcast strip below navigation. YouTube
still displays three entries; repository and NuGet selection remain unchanged.

Daily RSS automation is scheduled for 06:17 UTC. The deploy job now checks out
the exact snapshot commit produced by refresh. The existing opt-in Azure preview
gate is retained; the approved update uses that existing deployment workflow.

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
