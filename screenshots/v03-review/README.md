# v0.3 Visual Review Screenshots

Captured from the running local Astro application at `http://127.0.0.1:4322` with Playwright Chromium. Each page was checked for the expected localized heading, document language, horizontal overflow, broken images, failed local requests, and browser/page console errors. Fonts were awaited; lazy images were scrolled into view and decoded before capture. Animations were disabled.

## Contact sheets

- [Desktop contact sheet](contact-sheet-desktop.jpg)
- [Mobile contact sheet](contact-sheet-mobile.jpg)

## Screenshots

| File                                    | Tested route    | Viewport | Capture        |
| --------------------------------------- | --------------- | -------- | -------------- |
| `desktop/home-en-desktop-full.png`      | `/`             | 1440x900 | Full page      |
| `desktop/home-en-desktop-viewport.png`  | `/`             | 1440x900 | Above the fold |
| `desktop/home-es-desktop-full.png`      | `/es/`          | 1440x900 | Full page      |
| `desktop/home-es-desktop-viewport.png`  | `/es/`          | 1440x900 | Above the fold |
| `desktop/about-en-desktop-full.png`     | `/about/`       | 1440x900 | Full page      |
| `desktop/about-en-desktop-viewport.png` | `/about/`       | 1440x900 | Above the fold |
| `desktop/about-es-desktop-full.png`     | `/es/about/`    | 1440x900 | Full page      |
| `desktop/about-es-desktop-viewport.png` | `/es/about/`    | 1440x900 | Above the fold |
| `desktop/speaking-en-desktop-full.png`  | `/speaking/`    | 1440x900 | Full page      |
| `desktop/speaking-es-desktop-full.png`  | `/es/speaking/` | 1440x900 | Full page      |
| `desktop/projects-en-desktop-full.png`  | `/projects/`    | 1440x900 | Full page      |
| `desktop/projects-es-desktop-full.png`  | `/es/projects/` | 1440x900 | Full page      |
| `mobile/home-en-mobile-full.png`        | `/`             | 390x844  | Full page      |
| `mobile/home-en-mobile-viewport.png`    | `/`             | 390x844  | Above the fold |
| `mobile/home-es-mobile-full.png`        | `/es/`          | 390x844  | Full page      |
| `mobile/home-es-mobile-viewport.png`    | `/es/`          | 390x844  | Above the fold |
| `mobile/about-en-mobile-full.png`       | `/about/`       | 390x844  | Full page      |
| `mobile/about-en-mobile-viewport.png`   | `/about/`       | 390x844  | Above the fold |
| `mobile/about-es-mobile-full.png`       | `/es/about/`    | 390x844  | Full page      |
| `mobile/about-es-mobile-viewport.png`   | `/es/about/`    | 390x844  | Above the fold |
| `mobile/speaking-en-mobile-full.png`    | `/speaking/`    | 390x844  | Full page      |
| `mobile/speaking-es-mobile-full.png`    | `/es/speaking/` | 390x844  | Full page      |
| `mobile/projects-en-mobile-full.png`    | `/projects/`    | 390x844  | Full page      |
| `mobile/projects-es-mobile-full.png`    | `/es/projects/` | 390x844  | Full page      |

## Automated audit results

- Routes tested: `/`, `/es/`, `/about/`, `/es/about/`, `/speaking/`, `/es/speaking/`, `/projects/`, `/es/projects/`.
- Viewports: desktop 1440x900; mobile 390x844.
- Screenshot files: 24.
- Browser console/page errors and failed same-origin requests: none.
- Horizontal overflow: none.
- Broken images: none.
- Localized page headings and `html[lang]`: verified for all routes.
- Visual issues observed by automated checks: none.
- Manual visual review: screenshot contact sheets and representative EN/ES desktop/mobile captures inspected; no clipping or layout defects observed. The existing Speaker Kit biography and media-permission review notices remain visible by design pending editorial approval.

## Reproduce

From the repository root, build and start the production preview with `npm run build` and `npm run preview -- --host 127.0.0.1 --port 4322`, then run:

```powershell
node screenshots\v03-review\capture.mjs
```

Set `BASE_URL` to capture from another local Astro server URL.
