# Visual assets and provenance

## Generated artwork

On November 4, 2026, the installed `t2i` v1.7.0 CLI generated the original social-sharing illustration with provider `foundry-gpt-image-25-flare` and model `gpt-image-2.5-flare`. The generated 1792 x 1024 PNG source is retained at `src/assets/generated/v02-social-art-source.png`. A deterministic crop and JPEG conversion produces `public/assets/illustration/v02-social-art.jpg` at 1200 x 630 for Open Graph and Twitter cards.

Prompt:

> A polished original editorial illustration for the open graph preview of a personal developer website. Landscape 1200 by 630 composition, warm ivory background and a few soft lavender and violet geometric curves. On the right third only, one simple friendly rounded desktop robot with a smooth plain white shell, dark blank visor and two cyan eyes, seated beside a closed unmarked laptop. Flat clean graphic shapes with subtle paper texture. Keep the entire left half empty and uncluttered for real HTML text added separately. Strictly no other objects or scenery. No text, no writing, no letters, no numbers, no signs, no posters, no books, no emblems, no stars, no flags, no circles resembling a shield, no brands, no logos, no recognizable characters, no watermark. This is an illustration, never a photograph.

The illustration is artwork, not a photograph of Bruno or an event. It contains no embedded copy or logos.

## Photo editing trial

The `t2i` image-editing workflow was tested on a separate copy of the official headshot using `foundry-gpt-image-2` with high input fidelity. The result changed facial detail and skin texture, so it was rejected and deleted. No generatively edited photo is published. The original photograph was not changed.

## Existing illustrations

The original hand-authored SVG artwork remains in place for the desk robot, project cards, game sprites and older social card. These illustrations are not portraits. The homepage now leads with an authentic StackChan photograph instead of enlarging the desk illustration; the robot remains a small playful detail.

## Processing and validation

Real photographs were processed with Sharp for deterministic resizing, cropping and WebP/JPEG encoding only. Outputs do not retain EXIF metadata. The official download copies retain their source dimensions and have no EXIF block; the originals in `tmp/photos/` remain unchanged. `docs/photo-asset-manifest.md` records source paths, derivatives, bilingual descriptions, placements and rights status.

Do not treat personal photographs or supplied reference material as covered by the website's code license. Rights and required photo credits need owner confirmation. See `docs/media-usage.md`.
