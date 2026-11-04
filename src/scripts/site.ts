const toggle = document.querySelector<HTMLButtonElement>('.mobile-toggle');
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(expanded));
  document.querySelector('#primary-nav')?.classList.toggle('is-open', expanded);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    toggle.setAttribute('aria-expanded', 'false');
    document.querySelector('#primary-nav')?.classList.remove('is-open');
    toggle.focus();
  }
});
const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle');
const updateThemeButton = () =>
  themeButton?.setAttribute(
    'aria-pressed',
    String(document.documentElement.dataset.theme === 'dark'),
  );
updateThemeButton();
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* Storage is optional. */
  }
  updateThemeButton();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  try {
    if (localStorage.getItem('theme')) return;
  } catch {
    /* Follow the system without storage. */
  }
  document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
  updateThemeButton();
});
const robot = document.querySelector<HTMLButtonElement>('[data-robot]');
let robotClicks = 0;
robot?.addEventListener('click', () => {
  const messages: string[] = JSON.parse(robot.dataset.messages ?? '[]');
  const output = document.querySelector('[data-robot-message]');
  robotClicks += 1;
  if (output && messages.length) output.textContent = messages[robotClicks % messages.length];
  robot.dataset.expression = String(robotClicks % 4);
  const image = robot.querySelector('img');
  if (image)
    image.src = `/assets/robot/${['desk-robot', 'curious', 'surprised', 'sleeping'][robotClicks % 4]}.svg`;
});

let gameModule: Promise<typeof import('../lib/game/invaders')> | undefined;
async function openGame() {
  gameModule ??= import('../lib/game/invaders');
  try {
    (await gameModule).openGame();
  } catch {
    gameModule = undefined;
  }
}
document
  .querySelectorAll('[data-open-game]')
  .forEach((button) => button.addEventListener('click', openGame));
let clicks: number[] = [];
document.querySelector('#terminal-trigger')?.addEventListener('click', () => {
  const now = Date.now();
  clicks = [...clicks.filter((time) => now - time < 2500), now];
  if (clicks.length >= 5) {
    clicks = [];
    void openGame();
  }
});
const sequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];
let progress = 0;
document.addEventListener('keydown', (event) => {
  if (
    event.target instanceof HTMLElement &&
    (event.target.closest('input, textarea, select, dialog') || event.target.isContentEditable)
  )
    return;
  if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  progress = key === sequence[progress] ? progress + 1 : key === sequence[0] ? 1 : 0;
  if (progress === sequence.length) {
    progress = 0;
    void openGame();
  }
});
