import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const runtime = readFileSync(new URL('i18n-safe.js', root), 'utf8');
const dictionarySource = readFileSync(new URL('site-language-v2.js', root), 'utf8');

test('shared language dictionary has a valid extraction boundary', () => {
  const start = dictionarySource.indexOf('const M=');
  const end = dictionarySource.indexOf(';\nconst original', start);
  assert.notEqual(start, -1, 'dictionary declaration must exist');
  assert.notEqual(end, -1, 'dictionary must end before the original-text tracker');
  const objectSource = dictionarySource.slice(start + 'const M='.length, end);
  assert.doesNotThrow(() => Function('return (' + objectSource + ')')(), 'dictionary must parse as a JavaScript object');
});

test('recently added learning and daily-challenge UI has Arabic and Hebrew translations', () => {
  const required = [
    'Start with the basics',
    'Already know the basics? Take a quiz',
    'Go straight to the balancer',
    'Continue learning',
    'Your current lesson will be saved so you can continue where you left off.',
    'Start your learning path',
    'Mini-course structure',
    'A new chemistry challenge every day',
    'Today\\'s challenge',
    'Share result',
    'Result copied',
    'Sharing unavailable',
    'Select and copy the result',
    'Review Daily Quiz Answers',
    'Daily practice streak is unavailable right now.'
  ];
  for (const key of required) {
    assert.ok(runtime.includes(JSON.stringify(key) + ':['), 'missing localization entry: ' + key);
  }
  assert.match(runtime, /function translateDynamic\(base,l\)/, 'dynamic daily streak text must be localized');
});

test('language runtime retains all three supported language codes and RTL direction', () => {
  assert.match(runtime, /v==='ar'\|\|v==='he'/);
  assert.match(runtime, /document\.documentElement\.dir=LANG\[l\]\.dir/);
  assert.match(runtime, /window\.ChemLang=window\.ChemistryI18n/);
});
