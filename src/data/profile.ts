export const profile = {
  name: 'Bruno Capuano',
  role: 'Cloud Advocate',
  employer: 'Microsoft',
  focus: ['AI Agents', 'AI', '.NET', 'Azure', 'GitHub'],
  github: 'https://github.com/elbruno',
  linkedin: 'https://www.linkedin.com/in/elbruno/',
  youtube: 'https://www.youtube.com/channel/UCyHCkJ4lsphfhu_ljRws6aA',
  blog: 'https://elbruno.com',
  podcast: 'https://notienenombre.com',
  source: 'https://github.com/elbruno/elbruno-web',
} as const;

export const strategicResources = [
  { name: 'NuGet portfolio dashboard', url: 'https://elbruno.github.io/nuget-repo-dashboard/' },
  { name: 'New Year New Bot', url: 'https://aka.ms/newyearnewbot' },
  { name: '.NET + Foundry: Better Together', url: 'https://aka.ms/netfoundry-bt' },
  { name: 'Generative AI for .NET', url: 'https://aka.ms/genainet' },
] as const;

// Pending owner-supplied materials: headshots, CV, career dates, contact and approved bios.
export const projects = [
  {
    name: 'New Year New Bot',
    slug: 'new-year-new-bot',
    url: 'https://github.com/elbruno/new-year-new-bot',
    art: 'bot',
    tags: ['AI', '.NET', 'Hardware'],
    en: 'An AI desk companion experiment with M5Stack StackChan and .NET. A little hardware, a lot of possibility.',
    es: 'Un experimento de compañero de escritorio con IA, M5Stack StackChan y .NET. Un poco de hardware y muchas posibilidades.',
    status: { en: 'Coming soon', es: 'Próximamente' },
  },
  {
    name: 'PromptDot',
    slug: 'PromptDot',
    url: 'https://github.com/elbruno/PromptDot',
    art: 'prompt',
    tags: ['C#', 'Desktop', 'Local-first'],
    en: 'A tiny, resizable teleprompter that lives under your webcam. Local-first, cross-platform, and offline.',
    es: 'Un pequeño teleprompter ajustable que vive debajo de tu cámara. Multiplataforma, local y sin conexión.',
    status: { en: 'Open source', es: 'Código abierto' },
  },
] as const;
