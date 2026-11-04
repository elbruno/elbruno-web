import type { Locale } from '../i18n';

export type BioLength = '50' | '100' | '200';
// Drafts use only facts supplied in the project specification or verified repository descriptions.
// Owner editorial approval is required before labeling these as approved event biographies.
const englishShort =
  'Bruno Capuano is a Cloud Advocate at Microsoft focused on AI and .NET. He helps developers build with Azure and GitHub, shares practical demos and open-source experiments, and speaks about developer tools. He also podcasts in Spanish with No Tiene Nombre, connecting technology, code and community through conversation.';
const englishMedium = `${englishShort}

His technical interests include AI agents, C#, cloud development and GitHub Copilot. His public projects include New Year New Bot, an experiment with an AI desk companion, and PromptDot, a local-first desktop teleprompter. He shares what he builds through his blog, repositories and speaking. This mix of code, writing and conversation brings a practical developer perspective to the topics he explores.`;
const englishLong = `${englishMedium}

For event organizers, his core topic areas are practical AI and agents, .NET and C#, Azure and cloud development, and GitHub Copilot and developer tools. His speaker resources are available in English and Spanish, alongside links to his public projects and writing.

Outside the code, his interests include small robots, hardware tinkering, running and podcasting. No Tiene Nombre offers another way to explore technology through Spanish-language conversations.

His website connects these different parts of his work: a professional profile, projects built in public, resources for organizers and links to the original publications. The emphasis is on practical examples, shared curiosity and making room for the next experiment.`;

const spanishShort =
  'Bruno Capuano es Cloud Advocate en Microsoft, enfocado en IA y .NET. Ayuda a desarrolladores a crear con Azure y GitHub, comparte demos prácticas y experimentos de código abierto, y da charlas sobre herramientas de desarrollo. También participa en No Tiene Nombre, un podcast en español sobre tecnología.';
const spanishMedium = `${spanishShort}

Sus áreas de interés incluyen agentes de IA, C#, desarrollo en la nube y GitHub Copilot. Entre sus proyectos públicos están New Year New Bot, un experimento de compañero de escritorio con IA, y PromptDot, un teleprompter de escritorio que funciona sin conexión. Comparte lo que construye a través de su blog, repositorios y charlas. Código y conversación forman parte de esa misma curiosidad.`;
const spanishLong = `${spanishMedium}

Para organizadores de eventos, sus principales temas son IA práctica y agentes, .NET y C#, Azure y desarrollo en la nube, y GitHub Copilot y herramientas de desarrollo. Sus recursos para charlas incluyen biografías en inglés y español, junto con enlaces a sus proyectos y artículos públicos.

Más allá del código, le interesan los pequeños robots, los experimentos con hardware, el running y el podcasting. No Tiene Nombre es otra forma de explorar la tecnología mediante conversaciones en español.

Su sitio reúne estas facetas: un perfil profesional, proyectos construidos en público, recursos para eventos y enlaces a las publicaciones originales. El punto de partida son los ejemplos prácticos, la curiosidad compartida y las ganas de seguir explorando nuevas ideas.`;

export const bios: Record<Locale, Record<BioLength, string>> = {
  en: { '50': englishShort, '100': englishMedium, '200': englishLong },
  es: { '50': spanishShort, '100': spanishMedium, '200': spanishLong },
};
