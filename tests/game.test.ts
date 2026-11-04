import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fire, HEIGHT, newGame, tick, WIDTH } from '../src/lib/game/engine';
test('movement is bounded and frame jumps do not skip the playfield', () => {
  const state = newGame();
  for (let i = 0; i < 200; i++) tick(state, 0.016, -1);
  assert.equal(state.x, 18);
  for (let i = 0; i < 200; i++) tick(state, 0.016, 1);
  assert.equal(state.x, WIDTH - 18);
  const x = state.x;
  tick(state, 999, -1);
  assert.equal(state.x, x - 15);
});
test('shooting has a cooldown and collisions earn points once', () => {
  const state = newGame();
  state.bugs = [{ x: state.x, y: HEIGHT - 50, alive: true }];
  fire(state);
  fire(state);
  assert.equal(state.shots.length, 1);
  tick(state, 0.02, 0);
  assert.equal(state.score, 10);
  assert.equal(state.shots.length, 0);
  tick(state, 0.02, 0);
  assert.equal(state.wave, 2);
  assert.ok(state.bugs.length > 16);
});
test('bugs reaching the ship cost lives and eventually end the game', () => {
  const state = newGame();
  for (let i = 0; i < 3; i++) {
    state.bugs = [{ x: 100, y: HEIGHT - 40, alive: true }];
    tick(state, 0.02, 0);
  }
  assert.equal(state.lives, 0);
  assert.equal(state.over, true);
  fire(state);
  assert.equal(state.shots.length, 0);
});
