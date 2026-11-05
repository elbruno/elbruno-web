# V06 hero story assets

On November 5, 2026, the owner approved all six selected assets, bilingual captions,
incidental details/credits and relevant editorial/licensing content for public
repository publication and deployment to the existing staging Static Web App.
The owner also accepted the 10 documented moderate development-dependency audit
findings for this staging deployment. This approval does not grant third-party
reuse rights or authorize production deployment.
Source masters stay under the Git-ignored `tmp/photos/` directory, unchanged.
No source photograph was sent to an AI service or external image editor.

| Order | Source basename                                  | Web derivative(s), relative to `public/`                                 | Dimensions            | Bytes            | Approval                                                              |
| ----- | ------------------------------------------------ | ------------------------------------------------------------------------ | --------------------- | ---------------- | --------------------------------------------------------------------- |
| 1     | `26-11-bruno hold stackchan.jpg`                 | `assets/photos/hero-stackchan-960.webp`, `hero-stackchan-1280.webp`      | 960 x 720; 1280 x 960 | 83,810; 122,404  | Existing derivatives; approved for repository/staging publication     |
| 2     | `22-01 Bruno speaking in Podioum 1.jpg`          | `assets/photos/speaker-podium-1-960.webp`, `speaker-podium-1-1440.webp`  | 960 x 440; 1440 x 660 | 47,448; 87,986   | Existing derivatives; incidental details/credits approved for staging |
| 3     | Existing hand-authored `developer-workspace.svg` | `assets/illustration/developer-workspace.svg`                            | 760 x 600             | Original SVG     | Existing illustration; approved for repository/staging publication    |
| 4     | `24-12-Bruno running with ACE snow.jpg`          | `images/personal/canadian-winters-600.webp`, `canadian-winters-908.webp` | 600 x 200; 908 x 302  | 23,854; 43,590   | V05 derivatives; approved for repository/staging publication          |
| 5     | `26-06-Bruno Ultra Runner 50K.jpg`               | `assets/photos/about-ultra-run-600.webp`, `about-ultra-run-900.webp`     | 600 x 800; 900 x 1200 | 131,878; 280,856 | Existing derivatives; incidental details/credits approved for staging |
| 6     | `26-06-BusAllForMyself.png`                      | `images/hero/hero-bus-480.webp`, `hero-bus-900.webp`                     | 480 x 640; 900 x 1200 | 34,294; 77,256   | Local Sharp derivatives; approved for repository/staging publication  |

The original bus image is 2736 x 3648. Its SHA-256 before and after processing:
`077a0552194d02a3b81aa748fc4119f42cbe5e00969fd5e20d079b2ae8aa8045`.
Regenerate only its selected derivatives using
`npx tsx scripts/prepare-hero-photos.ts`. The script auto-orients, resizes without
enlargement, re-encodes WebP at quality 78, checks metadata and verifies the
unchanged source hash. The full bus composition and authentic expression remain.
The owner's staging approval includes the cabin sign and exterior scene.

All raster variants have been checked for absence of EXIF (including GPS), IPTC
and XMP. Every variant is under 300,000 bytes. No raw image or full-resolution
master is copied into the site or the V06 visual-review ZIP.

## Placement and captions

The homepage carousel uses the six entries in `src/data/hero-stories.ts`, in the
fixed order above. That file is the bilingual caption and alt-text source of
truth. The plan's supplied micro-titles and captions are retained exactly.
Only StackChan has a network image source on first paint. The remaining image
sources are assigned on demand, decoded before switching, and cached by the
browser. The consistent media frame is 16:11. StackChan uses cover with a 50% 40%
focal position, preserving Bruno's face and the robot. The speaker, winter, runner
and bus photographs remain completely contained above a blurred, enlarged CSS
background of the very same approved derivative. No new photographs, AI editing,
source processing or derivative files are needed. Portraits and the panoramic
winter photo retain their complete composition without plain lavender bands.

Captions occupy a compact 100px, fixed-height, high-contrast panel. Controls sit
inside the media area, with 44px targets, white icons and dark translucent
backgrounds. There is no toolbar below the caption. Changes are atomic
with the active figure. The 500ms fade applies only to photographs, never to the
caption text, and is disabled for reduced motion. A failed next image keeps the
current story; a failed first photo has an inline icon/text fallback.

Autoplay uses 6500ms intervals, stops after manual navigation and explicit pause,
and suspends for mouse hover, focus within the carousel and hidden tabs.
Reduced motion disables autoplay, including its play control. Manual buttons,
keyboard arrows and swipe navigation remain usable. Pause is not persisted.
Returning from the browser back/forward cache resets to StackChan.

## Publication gates

- STAGING GO for the existing preview Static Web App, subject to successful CI and
  deployment verification. The owner explicitly approved publication and accepted
  the documented development-tool findings.
- PRODUCTION NO-GO. Production deployment, domain cutover and DNS changes are not
  authorized; production sign-off remains separate from this staging approval.
