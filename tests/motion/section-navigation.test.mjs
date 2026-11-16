// Regression checks for components/motion/sectionNavigation.ts (in-page navigation that
// lands on revealed content). Runs the real module with Node's TypeScript stripping and
// deterministic fakes for animation frames, timers, history and scrolling.
//   node --experimental-strip-types --test tests/motion/
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { setupSectionNavigation } from '../../components/motion/sectionNavigation.ts';

// Document positions of the destinations (no pinned sections in these checks).
const POSITIONS = { faq: 2000, brokers: 500, advisors: 1200 };

let env;

function install() {
  const log = [];
  const frames = new Map();
  const timers = new Map();
  const scheduled = []; // every callback ever queued, cancelled or not
  const listeners = { document: new Map(), window: new Map() };
  let nextId = 1;
  let scrollTriggerUpdates = 0;

  const on = (map) => (type, fn) => map.set(type, fn);
  const off = (map) => (type, fn) => { if (map.get(type) === fn) map.delete(type); };

  const elements = new Map(
    Object.entries(POSITIONS).map(([id, position]) => [id, {
      id,
      attributes: new Map(),
      closest: () => null,
      getBoundingClientRect: () => ({ top: position - win.scrollY }),
      hasAttribute(name) { return this.attributes.has(name); },
      setAttribute(name, value) { this.attributes.set(name, value); },
      focus() {},
    }]),
  );

  const win = {
    scrollY: 0,
    location: { hash: '' },
    scrollTo({ top }) {
      log.push(`scroll:${top}`);
      win.scrollY = top;
    },
    setTimeout(fn) {
      const id = nextId++;
      timers.set(id, fn);
      scheduled.push(fn);
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
    addEventListener: on(listeners.window),
    removeEventListener: off(listeners.window),
  };

  globalThis.window = win;
  globalThis.document = {
    getElementById: (id) => elements.get(id) ?? null,
    addEventListener: on(listeners.document),
    removeEventListener: off(listeners.document),
  };
  globalThis.history = {
    pushState(_state, _title, url) {
      log.push(`push:${url}`);
      win.location.hash = url;
    },
  };
  globalThis.requestAnimationFrame = (fn) => {
    const id = nextId++;
    frames.set(id, fn);
    scheduled.push(fn);
    return id;
  };
  globalThis.cancelAnimationFrame = (id) => { frames.delete(id); };

  const ScrollTrigger = {
    getAll: () => [],
    update: () => { scrollTriggerUpdates += 1; },
  };

  const runFrames = () => { const queued = [...frames.values()]; frames.clear(); queued.forEach((fn) => fn()); };
  const runTimers = () => { const queued = [...timers.values()]; timers.clear(); queued.forEach((fn) => fn()); };

  env = {
    ScrollTrigger,
    log,
    listeners,
    win,
    runFrames,
    runTimers,
    // A browser can still deliver a callback queued before it was cancelled or before
    // cleanup ran in the same task; replay every callback ever scheduled.
    runEverythingEverQueued: ({ newestFirst = false } = {}) => {
      const queued = scheduled.splice(0);
      (newestFirst ? queued.reverse() : queued).forEach((fn) => fn());
    },
    scrolls: () => log.filter((entry) => entry.startsWith('scroll:')).length,
    updates: () => scrollTriggerUpdates,
    click(href) {
      const link = { getAttribute: () => href };
      let prevented = false;
      listeners.document.get('click')?.({
        defaultPrevented: false,
        button: 0,
        target: { closest: () => link },
        preventDefault: () => { prevented = true; },
      });
      return prevented;
    },
  };
}

beforeEach(() => install());

afterEach(() => {
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.history;
  delete globalThis.requestAnimationFrame;
  delete globalThis.cancelAnimationFrame;
});

test('a delayed FAQ landing cannot override a newer Brokers navigation (frames first)', () => {
  const navigation = setupSectionNavigation(env.ScrollTrigger);
  navigation.goTo('#faq', { updateHistory: false });
  navigation.goTo('#brokers', { updateHistory: true });

  env.runFrames();
  env.runTimers();

  assert.equal(env.win.location.hash, '#brokers');
  assert.equal(env.win.scrollY, POSITIONS.brokers);
  navigation.cleanup();
});

test('a delayed FAQ landing cannot override a newer Brokers navigation (timer first)', () => {
  const navigation = setupSectionNavigation(env.ScrollTrigger);
  navigation.goTo('#faq', { updateHistory: false });
  navigation.goTo('#brokers', { updateHistory: true });

  env.runTimers();
  env.runFrames();

  assert.equal(env.win.scrollY, POSITIONS.brokers);
  navigation.cleanup();
});

test('callbacks queued by a superseded navigation do nothing even if delivered', () => {
  const navigation = setupSectionNavigation(env.ScrollTrigger);
  navigation.goTo('#faq', { updateHistory: false });
  navigation.goTo('#brokers', { updateHistory: true });

  // The newer navigation's frame first, then the old FAQ timer and frame.
  env.runEverythingEverQueued({ newestFirst: true });

  assert.equal(env.win.scrollY, POSITIONS.brokers);
  navigation.cleanup();
});

test('callbacks delivered after cleanup perform no scrolling or animation updates', () => {
  const navigation = setupSectionNavigation(env.ScrollTrigger);
  navigation.goTo('#faq', { updateHistory: false });
  const scrolls = env.scrolls();
  const updates = env.updates();

  navigation.cleanup();
  env.runEverythingEverQueued();

  assert.equal(env.scrolls(), scrolls);
  assert.equal(env.updates(), updates);
});

test('ordinary navigation pushes history before scrolling and lands on the destination', () => {
  const navigation = setupSectionNavigation(env.ScrollTrigger);

  assert.equal(env.click('#advisors'), true);
  assert.deepEqual(env.log.slice(0, 2), ['push:#advisors', `scroll:${POSITIONS.advisors}`]);

  env.runFrames();
  env.runTimers();
  assert.equal(env.win.scrollY, POSITIONS.advisors);
  assert.equal(env.win.location.hash, '#advisors');

  // Back/Forward: land on the restored hash without a new history entry.
  env.win.location.hash = '#brokers';
  env.listeners.window.get('popstate')();
  env.runFrames();
  env.runTimers();
  assert.equal(env.win.scrollY, POSITIONS.brokers);
  assert.equal(env.log.filter((entry) => entry.startsWith('push:')).length, 1);

  navigation.cleanup();
});

test('cleanup removes listeners and can run more than once', () => {
  const navigation = setupSectionNavigation(env.ScrollTrigger);
  navigation.cleanup();
  navigation.cleanup();

  assert.equal(env.listeners.document.has('click'), false);
  assert.equal(env.listeners.window.has('popstate'), false);
  assert.equal(navigation.goTo('#faq', { updateHistory: true }), false);
  assert.equal(env.scrolls(), 0);
});
