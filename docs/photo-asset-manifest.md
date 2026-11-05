# Photo asset manifest

The source paths below are relative to the repository root. Masters under `tmp/photos/` are never edited in place. Website derivatives and public download copies are separate outputs. All photo rights and required credits remain subject to owner confirmation; repository visibility is not a license.

On November 5, 2026, the owner approved the V05 winter derivatives and the six
V06 carousel assets/captions, including incidental details and credits, for public
repository publication and the existing staging Static Web App. See the
[scoped carousel approval](hero-asset-manifest.md). This does not authorize
production deployment or grant third-party reuse rights.

## V05 selected winter photograph

- Private source: `tmp/photos/24-12-Bruno running with ACE snow.jpg`, 908 x 302.
- Public derivatives: `public/images/personal/canadian-winters-600.webp` (600 x 200)
  and `public/images/personal/canadian-winters-908.webp` (908 x 302).
- Regenerate locally with `npx tsx scripts/prepare-personal-photo.ts`.
  Sharp auto-orients, resizes without enlargement and encodes WebP at quality 82.
  The derivatives preserve the full panorama, without generated or retouched content.
  The desktop card crops side scenery with CSS while keeping Bruno and Ace visible;
  the mobile card displays the full panorama.
  No EXIF, GPS, XMP or IPTC metadata is retained.
- Source SHA-256: `6fe504a17712ef3c20008314e3b043bfaf9f30da4a1a1a9be90719c7868f0b61`.
  The script verifies that the original remains unchanged.
- English alt: Bruno running with Ace along a snow-covered trail in a Canadian winter landscape.
- Spanish alt: Bruno corriendo con Ace por un sendero cubierto de nieve en un paisaje invernal canadiense.
- Owner explicitly selected this photograph for the About page. This website use
  does not grant third-party reuse rights. No other private source was processed.
- `tmp/photos/`, V05 screenshots and the local V05 review ZIP are Git-ignored.
  The source photograph must never be staged, uploaded to editing services or
  included in the review ZIP. Only the two optimized derivatives are new public assets.

## Existing photography (unchanged by V05)

| Source photo                                        | Source dimensions | Derivatives and route                                                                                     | Type and processing                                                                                                                          | English alt text                                                       | Texto alternativo en español                                                   | Rights / credit                                                               |
| --------------------------------------------------- | ----------------: | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `tmp/photos/21-11 Bruno Headshot for Msft.jpg`      |       3072 x 4096 | `public/assets/photos/speaker-headshot-480.webp`, `speaker-headshot-960.webp`; About, Speaker Kit and ZIP | Authentic official headshot; deterministic resize and crop for WebP previews. Full-size JPEG download keeps dimensions and has EXIF removed. | Official headshot of Bruno Capuano.                                    | Retrato oficial de Bruno Capuano.                                              | Owner-supplied source; reuse rights and required credit pending confirmation. |
| `tmp/photos/22-01 Bruno speaking in Podioum 1.jpg`  |       4608 x 2112 | `public/assets/photos/speaker-podium-1-960.webp`, `speaker-podium-1-1440.webp`; Speaker Kit and ZIP       | Authentic event photo; resized to WebP for previews. High-quality full-dimension JPEG download has EXIF removed.                             | Bruno speaking at a podium in front of an event display.               | Bruno hablando desde un podio frente a una pantalla del evento.                | Owner-supplied source; reuse rights and required credit pending confirmation. |
| `tmp/photos/22-01 Bruno speaking in Podioum 2.jpg`  |       4608 x 2112 | `public/assets/photos/speaker-podium-2-960.webp`, `speaker-podium-2-1440.webp`; Speaker Kit and ZIP       | Authentic event photo; resized to WebP for previews. High-quality full-dimension JPEG download has EXIF removed.                             | Bruno speaking and gesturing at a podium during an event.              | Bruno hablando y gesticulando desde el podio durante un evento.                | Owner-supplied source; reuse rights and required credit pending confirmation. |
| `tmp/photos/26-11-bruno hold stackchan.jpg`         |        1280 x 960 | `public/assets/photos/hero-stackchan-960.webp`, `hero-stackchan-1280.webp`; homepage hero                 | Authentic personal photo of Bruno with StackChan; deterministic WebP resizing only.                                                          | Bruno holding StackChan, a small desktop robot, in his home workspace. | Bruno con StackChan, un pequeño robot de escritorio, en su espacio de trabajo. | Owner-supplied source; reuse rights and required credit pending confirmation. |
| `tmp/photos/25-10-AITour Ottawa.jpg`                |        1280 x 960 | `public/assets/photos/home-ai-tour-800.webp`, `home-ai-tour-1280.webp`; homepage speaking teaser          | Authentic event photo; deterministic WebP resizing only.                                                                                     | Bruno speaking on stage at an AI Tour event in Ottawa.                 | Bruno hablando en el escenario de un evento AI Tour en Ottawa.                 | Owner-supplied source; reuse rights and required credit pending confirmation. |
| `tmp/photos/25-09 bruno bsas data day.jpg`          |       2048 x 1536 | `public/assets/photos/about-community-960.webp`; About                                                    | Authentic community photo; deterministic WebP resizing only.                                                                                 | Bruno at Buenos Aires Data Day, with the audience in the room.         | Bruno en Buenos Aires Data Day, con el público en la sala.                     | Owner-supplied source; reuse rights and required credit pending confirmation. |
| `tmp/photos/26-06-Bruno Ultra Runner 50K.jpg`       |       1500 x 2000 | `public/assets/photos/about-ultra-run-600.webp`, `about-ultra-run-900.webp`; About                        | Authentic personal photo; deterministic WebP resizing and crop for responsive presentation.                                                  | Bruno at a trail race finish, medal in hand.                           | Bruno al llegar a la meta de una carrera de trail, con su medalla.             | Owner-supplied source; reuse rights and required credit pending confirmation. |
| `tmp/photos/23-09 bruno with ace best pup ever.jpg` |       3000 x 4000 | `public/assets/photos/about-ace-600.webp`, `about-ace-900.webp`; About                                    | Authentic personal photo with Ace; deterministic WebP resizing and crop for responsive presentation.                                         | Bruno spending time outdoors with Ace.                                 | Bruno pasando tiempo al aire libre con Ace.                                    | Owner-supplied source; reuse rights and required credit pending confirmation. |

The three official organizer downloads preserve the literal source filenames, including spaces and `Podioum` spelling:

- `public/downloads/speaker/21-11 Bruno Headshot for Msft.jpg` (3072 x 4096, 1.6 MiB)
- `public/downloads/speaker/22-01 Bruno speaking in Podioum 1.jpg` (4608 x 2112, 1.7 MiB)
- `public/downloads/speaker/22-01 Bruno speaking in Podioum 2.jpg` (4608 x 2112, 1.8 MiB)

The JPEGs are high-quality Sharp re-encodings. Their pixel dimensions are preserved and EXIF, including the GPS blocks present in all three source masters, is removed. No event or person is added, removed or generated in any photo derivative. The complete kit is `public/downloads/speaker/speaker-kit.zip`, generated by `npm run build-speaker-kit`.
