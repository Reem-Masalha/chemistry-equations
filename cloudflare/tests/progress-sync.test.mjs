import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(new URL('../../progress-sync.js', import.meta.url));
const source = fs.readFileSync(scriptPath, 'utf8');

function makeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
    clear() { data.clear(); },
  };
}

function bootProgressSync({ local = {}, remoteByToken = {} } = {}) {
  const localStorage = makeStorage(local);
  const sessionStorage = makeStorage();
  const listeners = new Map();
  const posts = [];
  const window = {
    CHEMISTRY_API_WORKER: 'https://api.test',
    addEventListener(type, fn) {
      const list = listeners.get(type) || [];
      list.push(fn);
      listeners.set(type, list);
    },
    dispatchEvent(event) {
      for (const fn of listeners.get(event.type) || []) fn(event);
      return true;
    },
  };
  const document = {
    readyState: 'complete',
    getElementById() { return null; },
  };
  const location = {
    pathname: '/learn.html',
    href: 'https://site.test/learn.html',
    reload() {},
  };
  const fetch = async (url, init = {}) => {
    const token = new Headers(init.headers || {}).get('authorization') || '';
    if ((init.method || 'GET').toUpperCase() === 'POST') {
      posts.push({ token, progress: JSON.parse(init.body).progress });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ progress: remoteByToken[token] || null }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
  vm.runInNewContext(source, {
    window, document, localStorage, sessionStorage, location,
    fetch, Headers, Response, CustomEvent, URL, URLSearchParams,
    AbortSignal, history: { replaceState() {} }, console,
  }, { filename: scriptPath });
  return { window, localStorage, sessionStorage, posts, listeners };
}

test('learning progress is isolated when a different account signs in', async () => {
  const userA = { id: 'user-a', username: 'alice', token: 'token-a' };
  const userB = { id: 'user-b', username: 'bob', token: 'token-b' };
  const localProgress = {
    beginner: [1],
    intermediate: [],
    advanced: [],
    current: { level: 'beginner', index: 1 },
    updatedAt: '2026-10-20T10:00:00.000Z',
    privateMarkerForA: 'alice-only',
  };
  const remoteByToken = {
    'Bearer token-a': {
      beginner: [0],
      intermediate: [],
      advanced: [],
      current: { level: 'beginner', index: 0 },
      updatedAt: '2026-10-19T10:00:00.000Z',
    },
    'Bearer token-b': {
      beginner: [],
      intermediate: [2],
      advanced: [],
      current: { level: 'intermediate', index: 2 },
      updatedAt: '2026-10-21T10:00:00.000Z',
      privateMarkerForB: 'bob-only',
    },
  };
  const env = bootProgressSync({
    local: {
      chemistryCurrentUser: JSON.stringify(userA),
      chemistryCourseProgress: JSON.stringify(localProgress),
    },
    remoteByToken,
  });

  await env.window.ChemistryProgressSync.sync();
  assert.deepEqual(JSON.parse(env.localStorage.getItem('chemistryCourseProgress')).beginner, [0, 1]);
  assert.equal(env.localStorage.getItem('chemistryCourseProgressOwner'), 'user-a');

  env.localStorage.setItem('chemistryCurrentUser', JSON.stringify(userB));
  env.window.dispatchEvent(new CustomEvent('chemistry:account-changed'));
  await env.window.ChemistryProgressSync.sync();

  const bobProgress = JSON.parse(env.localStorage.getItem('chemistryCourseProgress'));
  assert.deepEqual(bobProgress.beginner, []);
  assert.deepEqual(bobProgress.intermediate, [2]);
  assert.equal(bobProgress.privateMarkerForA, undefined);
  assert.equal(bobProgress.privateMarkerForB, 'bob-only');
  assert.equal(env.localStorage.getItem('chemistryCourseProgressOwner'), 'user-b');

  const bobPosts = env.posts.filter(post => post.token === 'Bearer token-b');
  assert.ok(bobPosts.length > 0, 'Bob progress should be saved to the server');
  assert.equal(bobPosts.at(-1).progress.privateMarkerForA, undefined);
  assert.deepEqual(bobPosts.at(-1).progress.beginner, []);
  assert.deepEqual(JSON.parse(env.localStorage.getItem('chemistryCourseProgress:user-a')).beginner, [0, 1]);
});
