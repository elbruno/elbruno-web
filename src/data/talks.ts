import type { Locale } from '../i18n';

export const conference = {
  name: '.NET Conf 2026',
  url: 'https://www.dotnetconf.net/',
  agenda: 'https://www.dotnetconf.net/agenda',
  verifiedOn: '2026-11-05',
};

export const talks = [
  {
    title: '.NET + Foundry: Better Together',
    start: '2026-11-10T12:00:00-08:00',
    end: '2026-11-10T12:30:00-08:00',
    url: `${conference.agenda}#session-D1T20261110120000`,
    summary: {
      en: 'A demo-packed tour of the latest Microsoft Foundry features and services, and how to get the most out of them with .NET.',
      es: 'Un recorrido con demos por las novedades y servicios de Microsoft Foundry y cómo aprovecharlos con .NET.',
    },
  },
  {
    title: 'Beyond Localhost: .NET Agents in Foundry',
    start: '2026-11-11T16:00:00-08:00',
    end: '2026-11-11T16:30:00-08:00',
    url: `${conference.agenda}#session-D2T20261111040000`,
    summary: {
      en: 'A practical look at hosted agents in Microsoft Foundry, what changes beyond localhost, and what a managed home unlocks for C# developers.',
      es: 'Una mirada práctica a los agentes hospedados en Microsoft Foundry, qué cambia al salir de localhost y qué ofrece un entorno administrado a quienes desarrollan en C#.',
    },
  },
] as const;

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
