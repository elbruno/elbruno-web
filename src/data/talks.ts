import type { Locale } from '../i18n';

export const conference = {
  name: '.NET Conf 2026',
  url: 'https://www.dotnetconf.net/',
  agenda: 'https://dotnet.microsoft.com/en-us/conf/2026/agenda',
  verifiedOn: '2026-11-16',
};

export const talks = [
  {
    title: 'Small Models, Big .NET Energy',
    start: '2026-11-10T18:30:00-08:00',
    end: '2026-11-10T19:00:00-08:00',
    url: 'https://dotnet.microsoft.com/en-us/conf/2026/agenda/brk037',
    videoUrl: 'https://youtu.be/ongDevKLRxM',
    summary: {
      en: 'A practical look at running small AI models locally with Foundry Local and .NET.',
      es: 'Una mirada práctica a cómo ejecutar modelos pequeños de IA localmente con Foundry Local y .NET.',
    },
  },
  {
    title: '.NET + Foundry: Better Together',
    start: '2026-11-11T16:00:00-08:00',
    end: '2026-11-11T16:30:00-08:00',
    url: 'https://dotnet.microsoft.com/en-us/conf/2026/agenda/brk007',
    videoUrl: 'https://www.youtube.com/watch?v=o2RUf9npgns',
    summary: {
      en: 'A 30-minute .NET Conf session exploring the latest Microsoft Foundry features and how to use them with .NET.',
      es: 'Una sesión de 30 minutos en .NET Conf para explorar las novedades de Microsoft Foundry y cómo usarlas con .NET.',
    },
  },
  {
    title: 'Beyond Localhost: .NET Agents in Foundry',
    start: '2026-11-11T17:00:00-08:00',
    end: '2026-11-11T17:30:00-08:00',
    url: 'https://dotnet.microsoft.com/en-us/conf/2026/agenda/brk031',
    videoUrl: 'https://youtu.be/Dq8fcig5-Gk',
    summary: {
      en: 'A demo-led look at moving .NET agents from local development to managed hosting in Microsoft Foundry.',
      es: 'Una demostración de cómo pasar agentes .NET del desarrollo local al alojamiento administrado en Microsoft Foundry.',
    },
  },
  {
    title: 'Give Your .NET Agent a Face: Building an AI Desk Companion with M5Stack',
    start: '2026-11-11T19:00:00-08:00',
    end: '2026-11-11T19:30:00-08:00',
    url: 'https://dotnet.microsoft.com/en-us/conf/2026/agenda/brk040',
    videoUrl: 'https://youtu.be/7EXrTrcJ7zA',
    summary: {
      en: 'A demo of connecting an M5Stack desk companion to a .NET backend, Aspire, and AI services.',
      es: 'Una demostración de cómo conectar un compañero de escritorio M5Stack con un backend .NET, Aspire y servicios de IA.',
    },
  },
] as const;

export const foundrySeries = {
  title: '.NET + Foundry: Better Together',
  url: 'https://aka.ms/netfoundry-bt',
  verifiedOn: '2026-11-16',
  summary: {
    en: 'A biweekly live series with C# demos and practical explorations of Microsoft Foundry, on the .NET Channel and Microsoft Reactor.',
    es: 'Una serie en vivo cada dos semanas, con demos en C# y exploraciones prácticas de Microsoft Foundry, en .NET Channel y Microsoft Reactor.',
  },
  sessions: [
    {
      episode: '04',
      start: '2026-12-03T17:00:00Z',
      end: '2026-12-03T18:00:00Z',
      url: 'https://developer.microsoft.com/en-us/reactor/events/27634/',
      resources: 'https://elbruno.github.io/NETFoundry-BetterTogether/episodes/04-2026-12-03/',
    },
  ],
} as const;

export const botSeries = {
  title: 'New Year, New Bot',
  url: 'https://aka.ms/newyearnewbot',
  verifiedOn: '2026-11-16',
  summary: {
    en: 'Three sessions, one tiny desk robot: from StackChan hardware to a .NET backend and an AI companion.',
    es: 'Tres sesiones y un pequeño robot de escritorio: de StackChan a un backend .NET y un compañero con IA.',
  },
  sessions: [
    {
      title: 'Bring Your AI Desk Robot to Life',
      start: '2026-11-24T18:00:00Z',
      end: '2026-11-24T19:00:00Z',
      url: 'https://aka.ms/newyearnewbot/1',
    },
    {
      title: 'Build Its AI Brain with .NET and Aspire',
      start: '2026-12-01T18:00:00Z',
      end: '2026-12-01T19:00:00Z',
      url: 'https://aka.ms/newyearnewbot/2',
    },
    {
      title: 'Give Your Bot an Agentic Brain',
      start: '2026-12-08T18:00:00Z',
      end: '2026-12-08T19:00:00Z',
      url: 'https://aka.ms/newyearnewbot/3',
    },
  ],
} as const;

export function talkStatus(start: string, end: string, now = Date.now()) {
  if (now < Date.parse(start)) return 'upcoming';
  return now < Date.parse(end) ? 'live' : 'past';
}

export function talkDate(start: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    dateStyle: 'long',
    timeZone: 'America/Los_Angeles',
  }).format(new Date(start));
}

export function talkTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'America/Los_Angeles',
  }).format(new Date(value));
}
