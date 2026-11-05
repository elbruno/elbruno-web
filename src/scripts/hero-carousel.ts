const INTERVAL = 6500;

export function initHeroCarousel(root: HTMLElement) {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-story]')];
  const indicators = [...root.querySelectorAll<HTMLButtonElement>('[data-story-index]')];
  const controls = root.querySelector<HTMLElement>('.story-controls')!;
  const play = root.querySelector<HTMLButtonElement>('.story-play')!;
  const announcement = root.querySelector<HTMLElement>('[data-story-announcement]')!;
  const frame = root.querySelector<HTMLElement>('.story-slides')!;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let paused = false;
  let hovered = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let request = 0;
  let loading = false;

  function canRotate() {
    return (
      !paused &&
      !hovered &&
      !root.contains(document.activeElement) &&
      !document.hidden &&
      !motion.matches &&
      !loading
    );
  }
  function schedule() {
    clearTimeout(timer);
    const rotating = canRotate();
    root.dataset.rotating = String(rotating);
    play.disabled = motion.matches;
    play.textContent = motion.matches
      ? root.dataset.reduced!
      : paused
        ? root.dataset.play!
        : root.dataset.pause!;
    play.setAttribute('aria-label', motion.matches ? root.dataset.reducedLabel! : play.textContent);
    if (rotating) timer = setTimeout(() => void select(index + 1, false), INTERVAL);
  }
  function stopManually() {
    paused = true;
    schedule();
  }
  async function select(target: number, manual = true, reset = false) {
    if (manual) stopManually();
    const next = (target + slides.length) % slides.length;
    const token = ++request;
    if (next === index) {
      loading = false;
      schedule();
      return;
    }
    loading = true;
    schedule();
    const image = slides[next].querySelector<HTMLImageElement>('img')!;
    if (!image.getAttribute('src')) {
      if (image.dataset.srcset) image.srcset = image.dataset.srcset;
      image.src = image.dataset.src!;
    }
    try {
      await image.decode();
    } catch (error) {
      if (token !== request) return;
      loading = false;
      paused = true;
      announcement.textContent = root.dataset.unavailable!;
      console.error('Hero story image failed to load', image.dataset.src, error);
      schedule();
      return;
    }
    if (token !== request) return;
    loading = false;
    if (!manual && !reset && !canRotate()) {
      schedule();
      return;
    }
    slides[index].hidden = true;
    root.dataset.changed = 'true';
    slides[next].hidden = false;
    indicators[index].removeAttribute('aria-current');
    indicators[next].setAttribute('aria-current', 'true');
    index = next;
    root.dataset.activeSlide = String(index + 1);
    if (manual)
      announcement.textContent = `${slides[index].getAttribute('aria-label')}. ${slides[index].querySelector('figcaption p')!.textContent}`;
    schedule();
  }

  const firstImage = slides[0].querySelector<HTMLImageElement>('img')!;
  function firstImageFailed() {
    firstImage.hidden = true;
    slides[0].querySelector<HTMLElement>('.story-fallback')!.hidden = false;
    paused = true;
    announcement.textContent = root.dataset.unavailable!;
    console.error('Initial hero photograph failed to load', firstImage.dataset.src);
    schedule();
  }
  firstImage.addEventListener('error', firstImageFailed, { once: true });
  if (firstImage.complete && firstImage.naturalWidth === 0) firstImageFailed();

  root.querySelector('.story-previous')!.addEventListener('click', () => void select(index - 1));
  root.querySelector('.story-next')!.addEventListener('click', () => void select(index + 1));
  indicators.forEach((button, target) =>
    button.addEventListener('click', () => void select(target)),
  );
  play.addEventListener('click', () => {
    paused = !paused;
    schedule();
  });
  root.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      hovered = true;
      schedule();
    }
  });
  root.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') {
      hovered = false;
      schedule();
    }
  });
  root.addEventListener('focusin', schedule);
  root.addEventListener('focusout', () => queueMicrotask(schedule));
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      void select(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  let touchStart: { x: number; y: number; id: number } | undefined;
  frame.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    touchStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    stopManually();
  });
  frame.addEventListener('pointerup', (event) => {
    if (!touchStart || event.pointerId !== touchStart.id) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = undefined;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5)
      void select(index + (dx < 0 ? 1 : -1));
  });
  frame.addEventListener('pointercancel', () => {
    touchStart = undefined;
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', schedule);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      paused = false;
      void select(0, false, true);
    }
  });
  root.dataset.activeSlide = '1';
  controls.hidden = false;
  schedule();
}
