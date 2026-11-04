export type Bug = { x: number; y: number; alive: boolean };
export type Shot = { x: number; y: number };
export type GameState = {
  x: number;
  score: number;
  wave: number;
  lives: number;
  bugs: Bug[];
  shots: Shot[];
  direction: number;
  cooldown: number;
  over: boolean;
};
export const WIDTH = 640;
export const HEIGHT = 360;
export function makeWave(wave: number): Bug[] {
  const rows = Math.min(4, 1 + wave);
  return Array.from({ length: rows * 8 }, (_, i) => ({
    x: 70 + (i % 8) * 65,
    y: 35 + Math.floor(i / 8) * 38,
    alive: true,
  }));
}
export function newGame(): GameState {
  return {
    x: WIDTH / 2,
    score: 0,
    wave: 1,
    lives: 3,
    bugs: makeWave(1),
    shots: [],
    direction: 1,
    cooldown: 0,
    over: false,
  };
}
export function fire(state: GameState) {
  if (state.cooldown <= 0 && !state.over) {
    state.shots.push({ x: state.x, y: HEIGHT - 37 });
    state.cooldown = 0.2;
  }
}
export function tick(state: GameState, delta: number, movement: number) {
  if (state.over) return;
  const dt = Math.min(Math.max(0, delta), 0.05);
  state.x = Math.min(WIDTH - 18, Math.max(18, state.x + movement * dt * 300));
  state.cooldown = Math.max(0, state.cooldown - dt);
  const living = state.bugs.filter((bug) => bug.alive);
  if (!living.length) {
    state.wave += 1;
    state.bugs = makeWave(state.wave);
    state.shots = [];
    return;
  }
  const speed = 23 + Math.min(state.wave, 12) * 8;
  const move = dt * speed * state.direction;
  if (living.some((bug) => bug.x + move < 20 || bug.x + move > WIDTH - 20)) {
    state.direction *= -1;
    living.forEach((bug) => {
      bug.y += 15;
    });
  } else
    living.forEach((bug) => {
      bug.x += move;
    });
  for (const shot of state.shots) {
    shot.y -= dt * 430;
    const hit = state.bugs.find(
      (bug) => bug.alive && Math.abs(shot.x - bug.x) < 18 && Math.abs(shot.y - bug.y) < 15,
    );
    if (hit) {
      hit.alive = false;
      shot.y = -10;
      state.score += 10;
    }
  }
  state.shots = state.shots.filter((shot) => shot.y >= 0);
  if (living.some((bug) => bug.alive && bug.y > HEIGHT - 56)) {
    state.lives -= 1;
    state.over = state.lives <= 0;
    state.bugs = makeWave(state.wave);
    state.shots = [];
  }
}
