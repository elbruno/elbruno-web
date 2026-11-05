# Content verification and editorial approvals

This summary separates owner-supplied information from repository-backed project details and items still needing Bruno's confirmation. No career dates, prior roles, education, achievements, talk metrics, or CV details have been inferred. See the [detailed editorial approval checklist](editorial/CONTENT_APPROVAL_CHECKLIST.md) for all six draft biographies and owner decisions.

## Facts used on the site

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
