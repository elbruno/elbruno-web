import type { Locale } from '../i18n';

type LocalizedText = Record<Locale, string>;

export const careerEntries = [
  {
    verified: true,
    organization: 'Microsoft',
    role: { en: 'Cloud Advocate', es: 'Cloud Advocate' } satisfies LocalizedText,
    period: null,
    summary: {
      en: 'Focuses on AI and .NET, working with Azure, GitHub and developer communities.',
      es: 'Enfocado en IA y .NET, con trabajo en Azure, GitHub y comunidades de desarrollo.',
    } satisfies LocalizedText,
    source: 'https://www.linkedin.com/in/elbruno/',
  },
] as const;

export const selectedWork = [
  {
    name: 'New Year New Bot',
    type: { en: 'Open-source project', es: 'Proyecto de código abierto' } satisfies LocalizedText,
    description: {
      en: 'An AI desk-companion experiment built with M5Stack StackChan and .NET.',
      es: 'Un experimento de compañero de escritorio con IA, M5Stack StackChan y .NET.',
    } satisfies LocalizedText,
    href: 'https://github.com/elbruno/new-year-new-bot',
  },
  {
    name: 'PromptDot',
    type: { en: 'Open-source project', es: 'Proyecto de código abierto' } satisfies LocalizedText,
    description: {
      en: 'A small, local-first desktop teleprompter designed to sit below a webcam.',
      es: 'Un pequeño teleprompter de escritorio, local y pensado para usar debajo de una cámara.',
    } satisfies LocalizedText,
    href: 'https://github.com/elbruno/PromptDot',
  },
  {
    name: 'No Tiene Nombre',
    type: { en: 'Spanish-language podcast', es: 'Podcast en español' } satisfies LocalizedText,
    description: {
      en: 'Conversations about AI and technology.',
      es: 'Conversaciones sobre IA y tecnología.',
    } satisfies LocalizedText,
    href: 'https://notienenombre.com/',
  },
  {
    name: 'elbruno.com',
    type: { en: 'Writing', es: 'Artículos' } satisfies LocalizedText,
    description: {
      en: 'Technical notes and articles shared on Bruno’s blog.',
      es: 'Notas técnicas y artículos publicados en el blog de Bruno.',
    } satisfies LocalizedText,
    href: 'https://elbruno.com/',
  },
] as const;
