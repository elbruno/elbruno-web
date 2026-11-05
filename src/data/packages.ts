import type { Locale } from '../i18n';

type CuratedPackage = {
  packageId: string;
  category: 'ai' | 'dotnet' | 'tooling';
  featured: boolean;
  repositoryUrl: string;
  description: Record<Locale, string>;
};

export const packageSources = {
  dashboard: 'https://elbruno.github.io/nuget-repo-dashboard/',
  nuget: 'https://elbruno.github.io/nuget-repo-dashboard/data/data.nuget.json',
  repositories: 'https://elbruno.github.io/nuget-repo-dashboard/data/data.repositories.json',
} as const;

// Editorial order, not a download ranking. Associations are checked against both source payloads.
export const curatedPackages: readonly CuratedPackage[] = [
  {
    packageId: 'ElBruno.LocalEmbeddings',
    category: 'ai',
    featured: true,
    repositoryUrl: 'https://github.com/elbruno/elbruno.localembeddings',
    description: {
      en: 'Generate embeddings locally in .NET with ONNX Runtime and Microsoft.Extensions.AI.',
      es: 'Genera embeddings de forma local en .NET con ONNX Runtime y Microsoft.Extensions.AI.',
    },
  },
  {
    packageId: 'ElBruno.LocalLLMs',
    category: 'ai',
    featured: true,
    repositoryUrl: 'https://github.com/elbruno/ElBruno.LocalLLMs',
    description: {
      en: 'Run local LLM chat completions through IChatClient with ONNX Runtime GenAI.',
      es: 'Ejecuta conversaciones con LLM locales mediante IChatClient y ONNX Runtime GenAI.',
    },
  },
  {
    packageId: 'ElBruno.Text2Image',
    category: 'ai',
    featured: true,
    repositoryUrl: 'https://github.com/elbruno/ElBruno.Text2Image',
    description: {
      en: 'Generate images from text in .NET using local Stable Diffusion models and ONNX Runtime.',
      es: 'Genera imágenes a partir de texto en .NET con modelos locales de Stable Diffusion y ONNX Runtime.',
    },
  },
  {
    packageId: 'ElBruno.MarkItDotNet',
    category: 'ai',
    featured: false,
    repositoryUrl: 'https://github.com/elbruno/ElBruno.MarkItDotNet',
    description: {
      en: 'Convert documents to Markdown for AI pipelines, documentation and developer tools.',
      es: 'Convierte documentos a Markdown para flujos de IA, documentación y herramientas de desarrollo.',
    },
  },
  {
    packageId: 'ElBruno.HuggingFace.Downloader',
    category: 'tooling',
    featured: false,
    repositoryUrl: 'https://github.com/elbruno/ElBruno.HuggingFace.Downloader',
    description: {
      en: 'Download models and other files from Hugging Face Hub with caching and progress reporting.',
      es: 'Descarga modelos y otros archivos de Hugging Face Hub con caché e información de progreso.',
    },
  },
  {
    packageId: 'ElBruno.Speech.Abstractions',
    category: 'dotnet',
    featured: false,
    repositoryUrl: 'https://github.com/elbruno/ElBruno.Speech',
    description: {
      en: 'Audio types, provider contracts and session interfaces for the ElBruno.Speech runtime.',
      es: 'Tipos de audio, contratos de proveedores e interfaces de sesión para ElBruno.Speech.',
    },
  },
];

export const packageUrl = (packageId: string) =>
  `https://www.nuget.org/packages/${encodeURIComponent(packageId)}`;
