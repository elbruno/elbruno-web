import type { Locale } from '../i18n';

type StoryText = { title: string; caption: string; alt: string };
export interface HeroStory {
  id: string;
  src: string;
  srcset?: string;
  width: number;
  height: number;
  fit: 'cover' | 'contain';
  text: Record<Locale, StoryText>;
}

export const heroStories: HeroStory[] = [
  {
    id: 'maker',
    src: '/assets/photos/hero-stackchan-960.webp',
    srcset:
      '/assets/photos/hero-stackchan-960.webp 960w, /assets/photos/hero-stackchan-1280.webp 1280w',
    width: 1280,
    height: 960,
    fit: 'cover',
    text: {
      en: {
        title: 'The maker 🤖',
        caption: 'Building tiny robots, exploring AI agents, and sometimes creating new bugs.',
        alt: 'Bruno holding StackChan, a small desktop robot, in his home workspace.',
      },
      es: {
        title: 'El maker 🤖',
        caption: 'Robots pequeños, agentes de IA y, de vez en cuando, bugs nuevos.',
        alt: 'Bruno con StackChan, un pequeño robot de escritorio, en su espacio de trabajo.',
      },
    },
  },
  {
    id: 'speaker',
    src: '/assets/photos/speaker-podium-1-960.webp',
    srcset:
      '/assets/photos/speaker-podium-1-960.webp 960w, /assets/photos/speaker-podium-1-1440.webp 1440w',
    width: 960,
    height: 440,
    fit: 'contain',
    text: {
      en: {
        title: 'The speaker 🎤',
        caption: 'Sometimes I leave Visual Studio and talk to humans.',
        alt: 'Bruno speaking at a podium in front of an event display.',
      },
      es: {
        title: 'El speaker 🎤',
        caption: 'A veces salgo de Visual Studio para hablar con humanos.',
        alt: 'Bruno hablando desde un podio frente a una pantalla del evento.',
      },
    },
  },
  {
    id: 'developer',
    src: '/assets/illustration/developer-workspace.svg',
    width: 760,
    height: 600,
    fit: 'contain',
    text: {
      en: {
        title: 'The developer 💻',
        caption: 'AI agents, C# and .NET. From first experiments to working demos.',
        alt: 'Original illustration of a robot beside a laptop with stylized code, not a screenshot.',
      },
      es: {
        title: 'El developer 💻',
        caption:
          'Agentes de IA, C# y .NET. De los primeros experimentos a las demos que funcionan.',
        alt: 'Ilustración original de un robot junto a una portátil con código estilizado, no una captura.',
      },
    },
  },
  {
    id: 'winter',
    src: '/images/personal/canadian-winters-908.webp',
    srcset:
      '/images/personal/canadian-winters-600.webp 600w, /images/personal/canadian-winters-908.webp 908w',
    width: 908,
    height: 302,
    fit: 'contain',
    text: {
      en: {
        title: 'Canadian winters ❄️',
        caption: "Running in the snow with Ace. Apparently running wasn't hard enough.",
        alt: 'Bruno and Ace running along a snow-covered trail, both visible in the winter landscape.',
      },
      es: {
        title: 'Inviernos canadienses ❄️',
        caption: 'Corriendo en la nieve con Ace. Parece que correr no era suficientemente difícil.',
        alt: 'Bruno y Ace corriendo por un sendero nevado, ambos visibles en el paisaje invernal.',
      },
    },
  },
  {
    id: 'runner',
    src: '/assets/photos/about-ultra-run-600.webp',
    srcset:
      '/assets/photos/about-ultra-run-600.webp 600w, /assets/photos/about-ultra-run-900.webp 900w',
    width: 600,
    height: 800,
    fit: 'contain',
    text: {
      en: {
        title: 'The runner 🏃',
        caption: '50K on the trails. Some debugging sessions still feel longer.',
        alt: 'Bruno holding his medal at the 50K trail running finish, with the finish arch visible.',
      },
      es: {
        title: 'El runner 🏃',
        caption: '50K por senderos. Algunas sesiones de debugging se sienten más largas.',
        alt: 'Bruno con su medalla en la meta de los 50K de trail, con el arco de llegada visible.',
      },
    },
  },
  {
    id: 'traveler',
    src: '/images/hero/hero-bus-480.webp',
    srcset: '/images/hero/hero-bus-480.webp 480w, /images/hero/hero-bus-900.webp 900w',
    width: 480,
    height: 640,
    fit: 'contain',
    text: {
      en: {
        title: 'The traveler 🚌',
        caption: 'Booked a conference trip. Somehow got the VIP bus. All to myself.',
        alt: 'Bruno alone inside a bus, with rows of empty seats behind him.',
      },
      es: {
        title: 'El viajero 🚌',
        caption: 'Viajé para una conferencia y me tocó el autobús VIP. ¡Para mí solo!',
        alt: 'Bruno solo en un autobús, con filas de asientos vacíos detrás.',
      },
    },
  },
];

export const carouselText = {
  en: {
    label: 'Six stories about Bruno',
    carousel: 'carousel',
    slide: 'slide',
    previous: 'Previous story',
    next: 'Next story',
    pause: 'Pause stories',
    play: 'Play stories',
    reduced: 'Autoplay off',
    reducedLabel: 'Automatic rotation is disabled for reduced motion',
    show: 'Show story',
    of: 'of',
    unavailable: 'This story image could not load. The current story is still available.',
    fallback: 'Photo unavailable. Bruno builds with AI agents, C# and .NET.',
  },
  es: {
    label: 'Seis historias de Bruno',
    carousel: 'carrusel',
    slide: 'diapositiva',
    previous: 'Historia anterior',
    next: 'Siguiente historia',
    pause: 'Pausar historias',
    play: 'Reproducir historias',
    reduced: 'Sin reproducción',
    reducedLabel: 'La rotación automática está desactivada para reducir el movimiento',
    show: 'Mostrar historia',
    of: 'de',
    unavailable: 'No se pudo cargar esta imagen. La historia actual sigue disponible.',
    fallback: 'Foto no disponible. Bruno crea con agentes de IA, C# y .NET.',
  },
} satisfies Record<Locale, Record<string, string>>;
