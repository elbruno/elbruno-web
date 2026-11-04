# Speaker Kit editorial workflow

## Available now

The English `/speaking/` and Spanish `/es/speaking/` routes include:

- Bruno's verified name and Cloud Advocate at Microsoft role, the official headshot and a concise organizer profile.
- Three authentic photo previews with individual downloads. The podium images are labeled as speaking photos, not headshots.
- A concise English or Spanish public introduction with copy controls for the introduction and speaker details.
- A complete downloadable archive at `public/downloads/speaker/speaker-kit.zip`. It contains exactly the three official photos and `README.txt`. The archive can be rebuilt with `npm run build-speaker-kit`.
- Speaking topics, media-use notes and a public LinkedIn contact route. No unverified event list, CV, personal email or dead form is shown.

The three individual photo downloads keep their exact source filenames. High-quality public copies preserve source dimensions and have EXIF/GPS metadata removed. The source masters remain unchanged. The archive explains that photo reuse rights and credits must be confirmed before publication. The six extended biography drafts remain in `src/data/speaking.ts` and `docs/editorial/CONTENT_APPROVAL_CHECKLIST.md` for review; they are not served on the website or included in the archive. The repository is public, so those draft files are still publicly readable.

## Required owner approvals

- Review and approve the six biography variants, including Spanish wording.
- Confirm photo rights, photographer credits and organizer reuse terms.
- Supply URLs for selected past sessions, recordings or slides if they should be listed.
- Supply a maintained CV or approve a CV based only on verified facts.
- Supply verified career history and dates before adding a timeline.
- Confirm the preferred organizer invitation/contact process.

Do not remove the biography draft notice or the photo-rights notice until the corresponding owner approvals are recorded. See `docs/photo-asset-manifest.md` and `docs/media-usage.md` for source paths, processing, rights status and alt text.
