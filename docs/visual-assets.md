# Visual assets and provenance

## Generation availability, November 4, 2026

The requested `t2i` skill was invoked by name through the skill loader. It returned **Skill "t2i" not found**. The loader's installed skill list did not contain it. The user-level Copilot, agents and plugin skill locations were checked; no `t2i` documentation was found. No command syntax, model or parameters were invented, and no unrelated image model was substituted.

The project specification explicitly permits tasteful vector placeholders when this skill is unavailable. All shipped artwork is original hand-authored SVG. It is not `t2i` output and does not depict a real person's likeness. The approved reference guides palette, whitespace, friendliness and composition, not copied pixels or mockup facts.

## Asset inventory

| Asset under `public\assets`            | Dimensions | Purpose                                            |
| -------------------------------------- | ---------- | -------------------------------------------------- |
| `illustration\developer-workspace.svg` | 760 x 600  | Hero desk, laptop, coffee and robot, no portrait   |
| `robot\desk-robot.svg`                 | 240 x 260  | Happy base mascot                                  |
| `robot\curious.svg`                    | 240 x 260  | Curious eyes, same silhouette                      |
| `robot\surprised.svg`                  | 240 x 260  | Surprised face, same silhouette                    |
| `robot\sleeping.svg`                   | 240 x 260  | Closed eyes, same silhouette                       |
| `illustration\project-bot.svg`         | 640 x 320  | Desk companion project                             |
| `illustration\project-prompt.svg`      | 640 x 320  | Desktop teleprompter project                       |
| `game\sprites.svg`                     | 128 x 32   | Original ship, bug, projectile and explosion cells |
| `illustration\social-card.svg`         | 1200 x 630 | Editable social card with real text                |
| `illustration\social-card.png`         | 1200 x 630 | Raster social-sharing version                      |

The sprite sheet has four 32 x 32 cells. The game uses the first two cells and simple vector projectiles. Artwork has no external font or image dependencies. Informative hero illustrations have localized alt text. Repeated project art, button icons and the button mascot use empty alt text because adjacent labels supply meaning.

## Pending `t2i` requests

When the skill is installed, first read its actual documentation. Adapt the following prompts to that documented interface; these are design briefs, not runnable commands:

1. **Hero:** Original premium editorial illustration of a cozy developer workspace, hoodie on a chair or a non-identifying illustrated developer, laptop, coffee and tiny robot. Lavender, rich violet and subtle teal. Soft lighting, clean silhouettes, transparent or uncluttered background, composition to the right of real HTML copy. No words, corporate logos or photorealistic likeness.
2. **Mascot:** A compact smiling desktop robot with a rounded lavender-white shell, dark visor and cyan eyes. Provide happy, curious, surprised and sleeping versions with the same silhouette and transparent background. Legible at 64px.
3. **Project art:** Coordinated illustrations of an AI desk companion and a webcam-adjacent desktop teleprompter. No embedded text or product claims.
4. **Sprites:** Original 32px pixel-art ship, silly software bugs, projectile and explosion. Violet/cyan family, no proprietary game characters, no flashing effects.
5. **Share art:** Coordinated robot/workspace background for a 1200 x 630 card. Composite the accurate site title and real role separately rather than asking an image model to render them.

Record the actual tool, model, date, exact prompts, source references, outputs and usage terms here when generation is possible. Keep originals outside the deployed assets if they are large.

## Reproducible optimization

SVG is resolution-independent and small, so no unnecessary raster conversion is used. Retain the viewBox, remove unused paths and metadata, and check rendering after optimization. For future raster assets, use Sharp or Astro image transforms to provide WebP/AVIF and appropriate sizes, then compare quality and dimensions.

Rebuild the social card after editing its SVG:

```powershell
node --input-type=module -e "import sharp from 'sharp'; await sharp('public/assets/illustration/social-card.svg').png().toFile('public/assets/illustration/social-card.png');"
```

There are no approved photographs. The supplied `design-reference.png` remains reference material, not a distributable photo or finished website screenshot. License approval for code, original assets and supplied material remains separate and pending.
