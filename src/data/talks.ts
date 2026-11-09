import type { Locale } from '../i18n';

export const conference = {
  name: '.NET Conf 2026',
  url: 'https://www.dotnetconf.net/',
  agenda: 'https://www.dotnetconf.net/agenda',
  verifiedOn: '2026-11-08',
};

export const talks = [
  {
    title: '.NET + Foundry: Better Together',
    start: '2026-11-11T16:00:00-08:00',
    end: '2026-11-11T16:30:00-08:00',
    url: `${conference.agenda}#session-D2T20261111040000`,
    summary: {
      en: 'A demo-packed tour of the latest Microsoft Foundry features and services, and how to get the most out of them with .NET.',
      es: 'Un recorrido con demos por las novedades y servicios de Microsoft Foundry y cómo aprovecharlos con .NET.',
    },
  },
] as const;

export const foundrySeries = {
  title: '.NET + Foundry: Better Together',
  url: 'https://aka.ms/netfoundry-bt',
  verifiedOn: '2026-11-08',
  summary: {
    en: 'Live C# demos and practical explorations of Microsoft Foundry, on the .NET Channel and Microsoft Reactor.',
    es: 'Demos en vivo con C# y exploraciones prácticas de Microsoft Foundry, en el canal de .NET y Microsoft Reactor.',
  },
  sessions: [
    {
      episode: '03',
      start: '2026-11-12T17:00:00Z',
      end: '2026-11-12T18:00:00Z',
      url: 'https://developer.microsoft.com/en-us/reactor/events/27632/',
      resources: 'https://elbruno.github.io/NETFoundry-BetterTogether/episodes/03-2026-11-12/',
    },
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
  sessionsUrl: 'https://elbruno.github.io/new-year-new-bot/#series',
  verifiedOn: '2026-11-08',
  summary: {
    en: 'Three proposed sessions, one tiny desk robot: from StackChan hardware to a .NET backend and an AI companion.',
    es: 'Tres sesiones propuestas y un pequeño robot de escritorio: de StackChan a un backend .NET y un compañero con IA.',
  },
  episodes: [
    'Bring Your AI Desk Robot to Life',
    'Build Its AI Brain with .NET and Aspire',
    'Give Your Bot an Agentic Brain',
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
