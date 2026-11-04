import { fire, HEIGHT, newGame, tick, WIDTH } from './engine';
import { t, type Locale } from '../../i18n';

let initialized = false;
let activate: (() => void) | undefined;
export function openGame() {
  if (!initialized) initialize();
  activate?.();
}
function initialize() {
  const dialog = document.querySelector<HTMLDialogElement>('#game-dialog')!;
  const canvas = dialog.querySelector('canvas')!;
  const context = canvas.getContext('2d');
  if (!context) return;
  const ctx = context;
  const text = t(dialog.dataset.locale as Locale);
  const status = dialog.querySelector<HTMLElement>('[data-game-status]')!;
  const pause = dialog.querySelector<HTMLButtonElement>('[data-game-pause]')!;
  let state = newGame();
  let running = false;
  let paused = false;
  let previous = 0;
  let frame = 0;
  let lastAnnouncement = '';
  let previousFocus: HTMLElement | null = null;
  const keys = new Set<string>();
  const touchMovement = new Set<number>();
  let touchFire = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sprite = new Image();
  sprite.src = '/assets/game/sprites.svg';
  const start = dialog.querySelector<HTMLButtonElement>('[data-game-start]')!;

  function announce() {
    const bugLabel = ['NullReferenceException', '404', 'Works on my machine'][(state.wave - 1) % 3];
    const message = `${text.score}: ${state.score} · ${text.wave}: ${state.wave} · ${text.lives}: ${state.lives} · ${bugLabel}${state.over ? `. ${text.gameOver}` : ''}${paused ? `. ${text.gamePaused}` : ''}`;
    if (message !== lastAnnouncement) {
      status.textContent = message;
      lastAnnouncement = message;
    }
  }
  function draw() {
    ctx.fillStyle = '#211b32';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#65527e';
    for (let i = 0; i < 35; i++) ctx.fillRect((i * 193) % WIDTH, (i * 83) % HEIGHT, 2, 2);
    for (const bug of state.bugs) {
      if (!bug.alive) continue;
      if (sprite.complete && sprite.naturalWidth)
        ctx.drawImage(sprite, 32, 0, 32, 32, bug.x - 16, bug.y - 16, 32, 32);
      else {
        ctx.fillStyle = '#c9a1f2';
        ctx.fillRect(bug.x - 12, bug.y - 9, 24, 18);
      }
    }
    ctx.fillStyle = '#7ce4ea';
    state.shots.forEach((shot) => ctx.fillRect(shot.x - 2, shot.y, 4, 12));
    if (sprite.complete && sprite.naturalWidth)
      ctx.drawImage(sprite, 0, 0, 32, 32, state.x - 16, HEIGHT - 37, 32, 32);
    else {
      ctx.fillStyle = '#a5eff1';
      ctx.beginPath();
      ctx.moveTo(state.x, HEIGHT - 38);
      ctx.lineTo(state.x - 15, HEIGHT - 10);
      ctx.lineTo(state.x + 15, HEIGHT - 10);
      ctx.fill();
    }
    if (!running || paused || state.over) {
      ctx.fillStyle = '#211b32bd';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = '#f2e9ff';
      ctx.font = '18px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(
        state.over ? text.gameOver : paused ? text.gamePaused : text.gameReady,
        WIDTH / 2,
        HEIGHT / 2,
      );
    }
  }
  function loop(now: number) {
    if (!running || paused || !dialog.open) return;
    const delta = previous ? (now - previous) / 1000 : 0;
    previous = now;
    let movement = 0;
    if (keys.has('ArrowLeft') || keys.has('a') || touchMovement.has(-1)) movement -= 1;
    if (keys.has('ArrowRight') || keys.has('d') || touchMovement.has(1)) movement += 1;
    tick(state, delta * (reduced ? 0.65 : 1), movement);
    if (keys.has(' ') || touchFire) fire(state);
    draw();
    announce();
    if (!state.over) frame = requestAnimationFrame(loop);
    else {
      running = false;
      pause.disabled = true;
    }
  }
  function stopInputs() {
    keys.clear();
    touchMovement.clear();
    touchFire = false;
  }
  function setPaused(value: boolean) {
    if (!running) return;
    paused = value;
    previous = 0;
    cancelAnimationFrame(frame);
    stopInputs();
    pause.textContent = paused ? text.resume : text.pause;
    pause.setAttribute('aria-pressed', String(paused));
    if (!paused) frame = requestAnimationFrame(loop);
    draw();
    announce();
  }
  start.addEventListener('click', () => {
    cancelAnimationFrame(frame);
    state = newGame();
    running = true;
    paused = false;
    previous = 0;
    stopInputs();
    pause.disabled = false;
    pause.textContent = text.pause;
    pause.setAttribute('aria-pressed', 'false');
    canvas.focus();
    frame = requestAnimationFrame(loop);
  });
  pause.addEventListener('click', () => setPaused(!paused));
  dialog.querySelector('[data-game-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    running = false;
    stopInputs();
    cancelAnimationFrame(frame);
    document.documentElement.style.overflow = '';
    previousFocus?.focus();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setPaused(true);
  });
  window.addEventListener('blur', () => {
    if (dialog.open) setPaused(true);
  });
  dialog.addEventListener('keydown', (event) => {
    if (!running || (event.target instanceof HTMLElement && event.target.closest('details')))
      return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (['ArrowLeft', 'ArrowRight', 'a', 'd', ' '].includes(key)) {
      if (key === ' ' && event.target instanceof HTMLButtonElement) return;
      event.preventDefault();
      keys.add(key);
    }
  });
  dialog.addEventListener('keyup', (event) => {
    keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
  });
  dialog
    .querySelectorAll<HTMLButtonElement>('[data-game-move], [data-game-fire]')
    .forEach((button) => {
      const direction = Number(button.dataset.gameMove);
      button.addEventListener('pointerdown', (event) => {
        button.setPointerCapture(event.pointerId);
        if (button.hasAttribute('data-game-fire')) {
          touchFire = true;
          fire(state);
        } else touchMovement.add(direction);
      });
      const release = () => {
        if (button.hasAttribute('data-game-fire')) touchFire = false;
        else touchMovement.delete(direction);
      };
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
      button.addEventListener('click', () => {
        if (button.hasAttribute('data-game-fire')) fire(state);
        else state.x = Math.max(18, Math.min(WIDTH - 18, state.x + direction * 24));
        draw();
      });
    });
  dialog.querySelector('[data-game-fix]')?.addEventListener('click', () => {
    cancelAnimationFrame(frame);
    running = false;
    paused = false;
    stopInputs();
    pause.disabled = true;
    state.over = false;
    state.score += 1;
    const bug = state.bugs.find((item) => item.alive);
    if (bug) bug.alive = false;
    else {
      state.wave += 1;
      state.bugs = newGame().bugs;
    }
    draw();
    announce();
  });
  sprite.addEventListener('load', draw);
  activate = () => {
    if (dialog.open) return;
    previousFocus = document.activeElement as HTMLElement;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    status.textContent = text.gameReady;
    start.focus();
    draw();
  };
  initialized = true;
}
