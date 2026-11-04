# Contributing

Use Node 24, run `npm ci`, and work in a focused branch. Before submitting a change, run:

```powershell
npm run format
npm run validate
npm run test:e2e
```

Install the Playwright Chromium browser if the runner reports it is missing. Do not commit `dist`, local secrets, browser traces or dependency directories.

## Content

Keep factual data separate from UI translations. Add projects in `src\data\profile.ts` only after verifying the actual repository, purpose and URL. Featured ordering is editorial, not star-based. Preserve original titles in external feeds. Do not copy fictional statistics or example projects from the design mockup.

Profile facts require an owner-provided or linked primary source. Never invent work dates, employers, awards, speaking appearances or contact information. Keep unknown data omitted from the public UI and tracked in the relevant documentation.

## Languages and accessibility

Update both dictionaries in `src\i18n\index.ts`, including labels, error states and metadata. Reuse shared components, and preserve equivalent routes on language changes. Spanish external titles are not automatically translated. Have nuanced biography changes reviewed.

Keep semantic headings, visible focus, touch targets, reduced-motion support and keyboard access. Test narrow screens, both themes and unavailable clipboard/storage APIs. New interactive behavior needs focused tests, not a second UI framework.

## Bios and photos

Follow `docs\speaker-assets.md`. Keep bios marked as drafts until Bruno approves them. Only upload approved real photographs with known usage permissions. Artwork must never be presented as a real headshot. Do not create a broken CV download or imply that unapproved photos exist.

## Feeds and links

Add a source's provenance to `docs\content-sources.md` before configuring it. Parse and validate at ingestion time, not in visitors' browsers. Use fixture tests, bounded requests and last-known-good fallbacks. Builds must continue to work offline.

Before a migration or new shortcut, check historical WordPress collisions. Never edit production DNS, add blanket redirects or change publication canonical hosts as part of an ordinary website contribution.

## Reporting issues

Include the route, language, viewport, theme, steps to reproduce and expected behavior. Screenshots must not expose private information. Share security-sensitive reports privately through an owner-approved channel rather than posting credentials in an issue.

## License gate

The owner has not yet selected a code or asset license. MIT is proposed for code. Do not add a license or grant rights to photographs or supplied design material without approval.
