# Speaker kit editorial workflow

## Available now

The speaker kit has an introduction and six factual **draft** biographies: English and Spanish at approximately 50, 100 and 200 words. All six come from `src\data\speaking.ts`. Language and length selectors, copy controls, a selectable fallback and a no-JavaScript biography library are implemented.

Drafts use owner-provided identity and role facts, focus areas, the podcast, and verified project purposes. They are labeled as awaiting editorial approval in both languages. These are not claimed to be previously approved conference biographies.

## Required owner materials

- Review and approve the six biography variants, including nuanced Spanish phrasing.
- Supply actual approved headshots and the rights/credit instructions for each.
- Supply a maintained CV PDF or approve a CV generated solely from verified data.
- Supply actual career employers, positions and dates for a chronological timeline.
- Supply selected session/recording/slide URLs and a verified event invitation method.

Until then, the UI shows an honest photo-pending state, omits CV downloads and history, links the public LinkedIn profile, and does not invent an email or contact form.

## Adding real photographs

Store approved originals and web/download variants under `public\assets\speaking\`. Suggested filename convention: `bruno-capuano-headshot-01-1200.jpg`. Keep a local provenance record identifying the approval, photographer, required credit, allowed uses and source file. Do not infer permission from a photo merely being online.

Provide a useful organizer download resolution and a small optimized gallery thumbnail. Include dimensions, file type and descriptive alt text. Make downloads link to real files, and verify status codes, names and image dimensions before exposing them. If a rights field or approval is unknown, do not publish that photo.

Keep website illustrations in a clearly separate section. No generated face, avatar or robot can substitute for an approved professional photograph.

## Approval checklist

Confirm facts against provided primary sources; do not extend a bio with invented awards, appearances, dates or metrics. Have the owner review EN/ES versions. Remove the public draft notice only after approval is recorded. Keep the existing length and clipboard tests, then test obtaining the 100-word Spanish bio and an approved photo in under one minute.
