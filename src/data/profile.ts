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
    name: 'MarkItDotNet',
    slug: 'ElBruno.MarkItDotNet',
    url: 'https://github.com/elbruno/ElBruno.MarkItDotNet',
    art: 'documents',
    tags: ['.NET', 'Markdown', 'AI'],
    en: 'Convert documents to Markdown for AI pipelines. Built for .NET developers working with real-world data and AI workflows.',
    es: 'Convierte documentos a Markdown para pipelines de IA. Pensado para developers .NET que trabajan con datos reales y flujos de IA.',
    status: { en: 'Open source', es: 'Código abierto' },
  },
  {
    name: 'LocalEmbeddings',
    slug: 'elbruno.localembeddings',
    url: 'https://github.com/elbruno/elbruno.localembeddings',
    art: 'embeddings',
    tags: ['.NET', 'ONNX', 'Microsoft.Extensions.AI'],
    en: 'Generate embeddings locally with .NET, ONNX and Microsoft.Extensions.AI. No cloud API required.',
    es: 'Genera embeddings localmente con .NET, ONNX y Microsoft.Extensions.AI. Sin depender de una API en la nube.',
    status: { en: 'Open source', es: 'Código abierto' },
  },
  {
    name: 'OllamaMonitor',
    slug: 'ElBruno.OllamaMonitor',
    url: 'https://github.com/elbruno/ElBruno.OllamaMonitor',
    art: 'monitor',
    tags: ['.NET', 'Ollama', 'Windows'],
    en: 'Keep an eye on your local AI models and Ollama runtime with a lightweight Windows tray utility.',
    es: 'Supervisa tus modelos de IA locales y Ollama con una herramienta ligera para la bandeja de Windows.',
    status: { en: 'Open source', es: 'Código abierto' },
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

export const featuredProjects = projects.filter((project) => project.slug !== 'PromptDot');
export const curatedRepositories = [
  featuredProjects[1],
  featuredProjects[2],
  featuredProjects[3],
  featuredProjects[0],
];
