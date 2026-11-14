// Lifecycle regression checks for components/motion/storyRail.ts (the homepage chapter
// indicator). Runs the real module with Node's TypeScript stripping and counting fakes for
// window listeners, ScrollTrigger listeners and animation frames.
//   node --experimental-strip-types --test tests/motion/
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { setupStoryRail } from '../../components/motion/storyRail.ts';

const SECTIONS = ['hero', 'insights', 'challenges', 'roles', 'learning', 'final-cta', 'footer'];

function element(top = 0, pinned = false) {
  const node = {
    textContent: '',
    top,
    parentElement: null,
    classList: { contains: () => false },
    getBoundingClientRect() { return { top: node.top }; },
  };
  if (pinned) {
    node.parentElement = { classList: { contains: (c) => c === 'pin-spacer' }, getBoundingClientRect: () => ({ top: node.top }) };
  }
  return node;
}

let env;

function install({ withRail = true } = {}) {
  const listeners = { window: new Map(), scrollTrigger: new Map() };
  const add = (map, type, fn) => { if (!map.has(type)) map.set(type, new Set()); map.get(type).add(fn); };
  const remove = (map, type, fn) => { map.get(type)?.delete(fn); };
  const frames = new Map();
  let nextFrame = 1;
  const nodes = {
    '[data-motion-story-progress]': withRail ? element() : null,
    '[data-motion-story-progress-fill]': withRail ? element() : null,
    '[data-motion-story-index]': withRail ? element() : null,
    '[data-motion-story-label]': withRail ? element() : null,
  };
  // Sections laid out 1000 px apart, measured from the current scroll position.
  const sections = SECTIONS.map((name, i) => [name, element(i * 1000, name === 'insights')]);
  sections.forEach(([name, node]) => { nodes[`[data-px='${name}']`] = node; });

  globalThis.window = {
    innerHeight: 800,
    addEventListener: (type, fn) => add(listeners.window, type, fn),
    removeEventListener: (type, fn) => remove(listeners.window, type, fn),
  };
  globalThis.document = { querySelector: (selector) => nodes[selector] ?? null };
  globalThis.requestAnimationFrame = (cb) => { const id = nextFrame++; frames.set(id, cb); return id; };
  globalThis.cancelAnimationFrame = (id) => { frames.delete(id); };

  const gsap = { to() {}, set() {}, fromTo() {} };
  const ScrollTrigger = {
    addEventListener: (type, fn) => add(listeners.scrollTrigger, type, fn),
    removeEventListener: (type, fn) => remove(listeners.scrollTrigger, type, fn),
  };
  const counts = () => ({
    scroll: listeners.window.get('scroll')?.size ?? 0,
    resize: listeners.window.get('resize')?.size ?? 0,
    refresh: listeners.scrollTrigger.get('refresh')?.size ?? 0,
    frames: frames.size,
  });
  const fire = (map, type) => [...(map.get(type) ?? [])].forEach((fn) => fn());
  const scrollTo = (y) => sections.forEach(([, node], i) => { node.top = i * 1000 - y; });
  env = { gsap, ScrollTrigger, counts, frames, nodes, listeners, fire, scrollTo };
  return env;
}

const BASELINE = { scroll: 0, resize: 0, refresh: 0, frames: 0 };
const ONE_SET = { scroll: 1, resize: 1, refresh: 1, frames: 0 };

beforeEach(() => install());

test('setup registers one set of listeners and cleanup returns to the baseline', () => {
  assert.deepEqual(env.counts(), BASELINE);
  const cleanup = setupStoryRail(env.gsap, env.ScrollTrigger);
  assert.deepEqual(env.counts(), ONE_SET);
  env.fire(env.listeners.window, 'scroll');
  env.fire(env.listeners.window, 'scroll'); // coalesced into one pending frame
  assert.equal(env.counts().frames, 1);
  cleanup();
  assert.deepEqual(env.counts(), BASELINE);
});

test('repeated mount/unmount cycles leave nothing behind; a remount has exactly one set', () => {
  for (let cycle = 0; cycle < 3; cycle += 1) {
    const cleanup = setupStoryRail(env.gsap, env.ScrollTrigger);
    env.fire(env.listeners.window, 'resize'); // leave a frame pending at unmount
    assert.equal(env.counts().frames, 1);
    cleanup();
    assert.deepEqual(env.counts(), BASELINE, `after cycle ${cycle + 1}`);
  }
  const cleanup = setupStoryRail(env.gsap, env.ScrollTrigger);
  assert.deepEqual(env.counts(), ONE_SET);
  cleanup();
  assert.deepEqual(env.counts(), BASELINE);
});

test('a callback already queued before cleanup does not update detached elements', () => {
  const cleanup = setupStoryRail(env.gsap, env.ScrollTrigger);
  const index = env.nodes['[data-motion-story-index]'];
  assert.equal(index.textContent, '01 / 07');
  env.scrollTo(3000); // roles section now above the viewport centre
  env.fire(env.listeners.window, 'scroll');
  const [queued] = [...env.frames.values()];
  const refresh = [...env.listeners.scrollTrigger.get('refresh')][0];
  cleanup();
  queued(); // a browser may still run a frame callback it had already dispatched
  refresh();
  assert.equal(index.textContent, '01 / 07');
  assert.deepEqual(env.counts(), BASELINE);
});

test('chapter follows the layout while mounted (scroll frame and refresh)', () => {
  const cleanup = setupStoryRail(env.gsap, env.ScrollTrigger);
  const index = env.nodes['[data-motion-story-index]'];
  const label = env.nodes['[data-motion-story-label]'];
  env.scrollTo(3000);
  env.fire(env.listeners.window, 'scroll');
  [...env.frames.values()].forEach((cb) => cb());
  assert.equal(`${index.textContent} — ${label.textContent}`, '04 / 07 — No Upfront Price');
  env.scrollTo(6000);
  env.fire(env.listeners.scrollTrigger, 'refresh');
  assert.equal(index.textContent, '07 / 07');
  cleanup();
});

test('missing rail elements: no listeners and a safe no-op cleanup', () => {
  install({ withRail: false });
  const cleanup = setupStoryRail(env.gsap, env.ScrollTrigger);
  assert.equal(typeof cleanup, 'function');
  assert.deepEqual(env.counts(), BASELINE);
  cleanup();
  cleanup();
  assert.deepEqual(env.counts(), BASELINE);
});

test('cleanup is idempotent', () => {
  const cleanup = setupStoryRail(env.gsap, env.ScrollTrigger);
  cleanup();
  cleanup();
  assert.deepEqual(env.counts(), BASELINE);
});
