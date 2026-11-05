# v0.4 content approval

Review date: 2026-11-04. **Verified facts are not a substitute for owner approval of emphasis and wording.**
No new career claims, speaking metrics, image permissions, or professional achievements have been inferred.

## Selection and evidence

The [NuGet owner profile](https://www.nuget.org/profiles/elbruno) lists all six selected package IDs.
The dashboard discovers packages with `owner:elbruno`, but can also merge manually tracked packages:
membership in the entire dashboard alone is not proof of ownership or AI relevance.
Each selection below was checked against the owner profile, package metadata, tracked repository
mapping, and source repository README. Every NuGet page returned HTTP 200.

| Exact package ID               | Category / placement        | Verified NuGet destination                                    | Verified source                                           | Evidence for category                                                                                 |
| ------------------------------ | --------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ElBruno.LocalEmbeddings        | AI; Home + Projects         | https://www.nuget.org/packages/ElBruno.LocalEmbeddings        | https://github.com/elbruno/elbruno.localembeddings        | Local embedding generation, ONNX Runtime, Microsoft.Extensions.AI                                     |
| ElBruno.LocalLLMs              | AI; Home + Projects         | https://www.nuget.org/packages/ElBruno.LocalLLMs              | https://github.com/elbruno/ElBruno.LocalLLMs              | Local LLM chat completions, IChatClient, ONNX Runtime GenAI                                           |
| ElBruno.Text2Image             | AI; Home + Projects         | https://www.nuget.org/packages/ElBruno.Text2Image             | https://github.com/elbruno/ElBruno.Text2Image             | NuGet metadata and README explicitly describe text-to-image generation using Stable Diffusion/ONNX    |
| ElBruno.MarkItDotNet           | AI workflow; Projects       | https://www.nuget.org/packages/ElBruno.MarkItDotNet           | https://github.com/elbruno/ElBruno.MarkItDotNet           | Document-to-Markdown conversion for AI pipelines; not a claim that every converter performs inference |
| ElBruno.HuggingFace.Downloader | Developer tooling; Projects | https://www.nuget.org/packages/ElBruno.HuggingFace.Downloader | https://github.com/elbruno/ElBruno.HuggingFace.Downloader | Downloads model assets and other Hub files; not itself an inference engine                            |
| ElBruno.Speech.Abstractions    | .NET; Projects              | https://www.nuget.org/packages/ElBruno.Speech.Abstractions    | https://github.com/elbruno/ElBruno.Speech                 | Audio types and provider/session contracts; not itself a speech model                                 |

Text2Image's GitHub repository description still mentions image captioning, whereas its NuGet
description and canonical README describe text-to-image generation. The card follows the latter two
sources and deliberately describes the base package's local capability, not every separate provider
package. Review the repository description independently if it needs correction.

The broader dashboard includes unrelated utilities and retired packages. For example, AotMapper is a
DTO/source-generator utility, not automatically AI; it has no tracked repository association in the
audited snapshot and is not included here. CopilotCLIMonitor and its Core package are explicitly
retired in the dashboard configuration and are not promoted. This is a curated selection, not the
complete portfolio, a popularity ranking, or an ongoing maintenance/support guarantee.

## Exact bilingual card copy

| Package                        | English                                                                                    | Español                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| ElBruno.LocalEmbeddings        | Generate embeddings locally in .NET with ONNX Runtime and Microsoft.Extensions.AI.         | Genera embeddings de forma local en .NET con ONNX Runtime y Microsoft.Extensions.AI.              |
| ElBruno.LocalLLMs              | Run local LLM chat completions through IChatClient with ONNX Runtime GenAI.                | Ejecuta conversaciones con LLM locales mediante IChatClient y ONNX Runtime GenAI.                 |
| ElBruno.Text2Image             | Generate images from text in .NET using local Stable Diffusion models and ONNX Runtime.    | Genera imágenes a partir de texto en .NET con modelos locales de Stable Diffusion y ONNX Runtime. |
| ElBruno.MarkItDotNet           | Convert documents to Markdown for AI pipelines, documentation and developer tools.         | Convierte documentos a Markdown para flujos de IA, documentación y herramientas de desarrollo.    |
| ElBruno.HuggingFace.Downloader | Download models and other files from Hugging Face Hub with caching and progress reporting. | Descarga modelos y otros archivos de Hugging Face Hub con caché e información de progreso.        |
| ElBruno.Speech.Abstractions    | Audio types, provider contracts and session interfaces for the ElBruno.Speech runtime.     | Tipos de audio, contratos de proveedores e interfaces de sesión para ElBruno.Speech.              |

## Section and About copy

- EN Home: **AI & .NET libraries**. Projects: **Packages & libraries**.
- ES Home: **Librerías de IA y .NET**. Projects: **Paquetes y librerías**.
- EN introduction: “Reusable .NET building blocks for local AI, document workflows and developer tools.”
- ES introduction: “Componentes reutilizables para .NET: IA local, flujos de documentos y herramientas de desarrollo.”
- EN About: “I also maintain open-source .NET libraries, from local AI to developer tools.”
- ES About: “También mantengo librerías .NET de código abierto, desde IA local hasta herramientas de desarrollo.”
- EN dashboard CTA: “Open full NuGet dashboard.”
- ES dashboard CTA: “Abrir el dashboard completo de NuGet.”

No navigation item was added. About and Home link to the localized Projects `#libraries` anchor.

## Metrics and lifecycle choices

The committed snapshot was fetched at **2026-11-04T17:33:45.307Z**. Both dashboard payloads report
**2026-11-04T17:13:30.877Z**. The [QA report](../release/V04_QA_REPORT.md) records exact values and schemas.
Displayed version/download values are timestamped dashboard data, not a live NuGet query.
The latest-version field is displayed as “Snapshot version / Versión en la captura,” not a promise of
the latest available stable release.

Downloads are lifetime package downloads across versions, **not people, active users, or installations**.
The collector uses the higher total from two NuGet search shards; if its upstream count requests fail,
the collector can emit zero. The website cannot recover missing provenance from that zero. Invalid,
null, negative, fractional or unsafe numeric values are omitted rather than replaced with zero.
No aggregate “portfolio users” or sum of related package-family downloads is claimed.

All six selected entries were listed, not retired, and associated with non-archived repositories in
this snapshot. That observation does not certify future maintenance. Retired, unlisted, unknown-status
or archived entries are excluded from Home and qualified in the directory.

The owner-review default is to show lifetime downloads on both Home and Projects, with a shared date
and snapshot disclaimer. A warning appears when the older of the package/repository snapshot dates is
more than seven days old **at build time**. No live browser API calls were added. Failed or regressed
refreshes retain last-good data, including its original timestamps.

## Owner decisions still required

- [ ] Approve the six-package selection, editorial order, categories, and three Home spotlights.
- [ ] Approve the EN/ES card, section, CTA and About wording above.
- [ ] Approve lifetime downloads on Home, or request that detailed counts appear only on Projects.
- [ ] Review the [actual screenshots](../../screenshots/v04-review/README.md), especially mobile card density and both themes.
- [ ] Accept/defer the remaining moderate development-tooling advisory described in the QA report, or require an upstream fix before release.
- [ ] Authorize any staging publication separately; this task did not deploy.

Existing production gates remain in [CONTENT_APPROVAL_CHECKLIST.md](CONTENT_APPROVAL_CHECKLIST.md):
current professional title and career dates, any extended biography/CV publication, project wording,
photo reuse permissions/credits, organizer usage terms, and hosting/migration/rollback decisions.
V0.4 implementation did not wait for missing personal facts and did not publish new invented ones.

**Status:** ready for owner/local staging-design review; editorial approval pending; production **NO-GO**.
