# v0.4 visual review

Actual Chromium captures of the local production build. No mockups or generated artwork.

- Reproduce: `npm run build`, start `npm run preview -- --host 127.0.0.1 --port 4322`, then `node screenshots/v04-review/capture.mjs`.
- Desktop 1440×900; mobile 390×844; device scale 1; EN/ES; light/dark.
- Fonts and image decoding awaited, lazy images loaded, site controls exercised, animations disabled.
- 32 screenshots, two lightweight contact sheets, and [machine-readable audits](qa-results.json).
- [Desktop contact sheet](contact-sheet-desktop.png) / [Mobile contact sheet](contact-sheet-mobile.png).
- Local unthrottled timing samples are diagnostic, not Lighthouse or field performance scores.

## Issues

No horizontal overflow, broken images, missing package translations, local HTTP failures or browser console/page errors found in the capture matrix. Automated checks do not replace owner visual approval.

## Screenshot inventory

| Screenshot                                                                                       | Route         | Viewport | Theme | Capture   |
| ------------------------------------------------------------------------------------------------ | ------------- | -------- | ----- | --------- |
| [desktop/home-en-light-desktop-full.png](desktop/home-en-light-desktop-full.png)                 | /             | 1440x900 | light | Full page |
| [desktop/home-en-light-desktop-viewport.png](desktop/home-en-light-desktop-viewport.png)         | /             | 1440x900 | light | Viewport  |
| [desktop/projects-en-light-desktop-full.png](desktop/projects-en-light-desktop-full.png)         | /projects/    | 1440x900 | light | Full page |
| [desktop/projects-en-light-desktop-viewport.png](desktop/projects-en-light-desktop-viewport.png) | /projects/    | 1440x900 | light | Viewport  |
| [desktop/home-es-light-desktop-full.png](desktop/home-es-light-desktop-full.png)                 | /es/          | 1440x900 | light | Full page |
| [desktop/home-es-light-desktop-viewport.png](desktop/home-es-light-desktop-viewport.png)         | /es/          | 1440x900 | light | Viewport  |
| [desktop/projects-es-light-desktop-full.png](desktop/projects-es-light-desktop-full.png)         | /es/projects/ | 1440x900 | light | Full page |
| [desktop/projects-es-light-desktop-viewport.png](desktop/projects-es-light-desktop-viewport.png) | /es/projects/ | 1440x900 | light | Viewport  |
| [desktop/home-en-dark-desktop-full.png](desktop/home-en-dark-desktop-full.png)                   | /             | 1440x900 | dark  | Full page |
| [desktop/home-en-dark-desktop-viewport.png](desktop/home-en-dark-desktop-viewport.png)           | /             | 1440x900 | dark  | Viewport  |
| [desktop/projects-en-dark-desktop-full.png](desktop/projects-en-dark-desktop-full.png)           | /projects/    | 1440x900 | dark  | Full page |
| [desktop/projects-en-dark-desktop-viewport.png](desktop/projects-en-dark-desktop-viewport.png)   | /projects/    | 1440x900 | dark  | Viewport  |
| [desktop/home-es-dark-desktop-full.png](desktop/home-es-dark-desktop-full.png)                   | /es/          | 1440x900 | dark  | Full page |
| [desktop/home-es-dark-desktop-viewport.png](desktop/home-es-dark-desktop-viewport.png)           | /es/          | 1440x900 | dark  | Viewport  |
| [desktop/projects-es-dark-desktop-full.png](desktop/projects-es-dark-desktop-full.png)           | /es/projects/ | 1440x900 | dark  | Full page |
| [desktop/projects-es-dark-desktop-viewport.png](desktop/projects-es-dark-desktop-viewport.png)   | /es/projects/ | 1440x900 | dark  | Viewport  |
| [mobile/home-en-light-mobile-full.png](mobile/home-en-light-mobile-full.png)                     | /             | 390x844  | light | Full page |
| [mobile/home-en-light-mobile-viewport.png](mobile/home-en-light-mobile-viewport.png)             | /             | 390x844  | light | Viewport  |
| [mobile/projects-en-light-mobile-full.png](mobile/projects-en-light-mobile-full.png)             | /projects/    | 390x844  | light | Full page |
| [mobile/projects-en-light-mobile-viewport.png](mobile/projects-en-light-mobile-viewport.png)     | /projects/    | 390x844  | light | Viewport  |
| [mobile/home-es-light-mobile-full.png](mobile/home-es-light-mobile-full.png)                     | /es/          | 390x844  | light | Full page |
| [mobile/home-es-light-mobile-viewport.png](mobile/home-es-light-mobile-viewport.png)             | /es/          | 390x844  | light | Viewport  |
| [mobile/projects-es-light-mobile-full.png](mobile/projects-es-light-mobile-full.png)             | /es/projects/ | 390x844  | light | Full page |
| [mobile/projects-es-light-mobile-viewport.png](mobile/projects-es-light-mobile-viewport.png)     | /es/projects/ | 390x844  | light | Viewport  |
| [mobile/home-en-dark-mobile-full.png](mobile/home-en-dark-mobile-full.png)                       | /             | 390x844  | dark  | Full page |
| [mobile/home-en-dark-mobile-viewport.png](mobile/home-en-dark-mobile-viewport.png)               | /             | 390x844  | dark  | Viewport  |
| [mobile/projects-en-dark-mobile-full.png](mobile/projects-en-dark-mobile-full.png)               | /projects/    | 390x844  | dark  | Full page |
| [mobile/projects-en-dark-mobile-viewport.png](mobile/projects-en-dark-mobile-viewport.png)       | /projects/    | 390x844  | dark  | Viewport  |
| [mobile/home-es-dark-mobile-full.png](mobile/home-es-dark-mobile-full.png)                       | /es/          | 390x844  | dark  | Full page |
| [mobile/home-es-dark-mobile-viewport.png](mobile/home-es-dark-mobile-viewport.png)               | /es/          | 390x844  | dark  | Viewport  |
| [mobile/projects-es-dark-mobile-full.png](mobile/projects-es-dark-mobile-full.png)               | /es/projects/ | 390x844  | dark  | Full page |
| [mobile/projects-es-dark-mobile-viewport.png](mobile/projects-es-dark-mobile-viewport.png)       | /es/projects/ | 390x844  | dark  | Viewport  |
