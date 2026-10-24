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
    'Today\'s challenge',
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
  assert.match(runtime, /const LANG=\{en:\{dir:'ltr',label:'English'\},ar:\{dir:'rtl',label:'العربية'\},he:\{dir:'rtl',label:'עברית'\}\}/);
  assert.match(runtime, /document\.documentElement\.dir=LANG\[l\]\.dir/);
  assert.match(runtime, /window\.ChemLang=window\.ChemistryI18n/);
});


const expandedRuntime = readFileSync(new URL('lesson-content-i18n.js', root), 'utf8');

test('expanded translation runtime parses and contains lesson, quiz, and account coverage', () => {
  assert.doesNotThrow(() => Function(expandedRuntime), 'expanded translation runtime must parse');
  const match = expandedRuntime.match(/const rows=(\\[[\\s\\S]*?\\]);const M=/);
  assert.ok(match, 'translation rows must be extractable for coverage checks');
  const rows = JSON.parse(match[1]);
  const dictionary = new Map(rows.map(row => [row[0], row]));
  assert.ok(rows.length >= 400, 'translation coverage should remain broad');
  for (const key of [
    'A chemical equation is a model of what happens in a reaction. Before balancing, the formulas identify the substances involved; balancing then makes the atom counts agree with conservation of mass.',
    'Polyatomic ions are groups of atoms that carry an overall charge, such as SO₄²⁻, NO₃⁻ and OH⁻. In many equations, the same polyatomic ion appears unchanged on both sides. When that happens, treating the group as one unit can make balancing easier.',
    'Why is oxygen usually left until last?',
    'Why must charge be checked in an ionic equation?',
    'Before starting Intermediate, check the five basics below.',
    'Solo Practice and Multiplayer Challenge are separate experiences. In a challenge, both players get the same questions and race against the clock.',
    'Set a new password',
    'Could not set the password.',
    'No completed sessions yet. Finish a practice or quiz session and it will appear here.'
  ]) {
    const row = dictionary.get(key);
    assert.ok(row, 'missing expanded translation entry: ' + key);
    assert.ok(row[1] && row[2], 'Arabic and Hebrew must both be present: ' + key);
  }
  assert.match(expandedRuntime, /Daily practice streak: \\(\\d\+\\)/);
  assert.match(expandedRuntime, /Coefficient for /);
});

test('all user-facing learning, quiz, challenge, checker, and account pages load expanded translations', () => {
  for (const page of [
    'beginner-lessons.html',
    'intermediate-lessons.html',
    'advanced-lessons.html',
    'learn.html',
    'personal-quiz.html',
    'challenges.html',
    'index.html',
    'checker.html',
    'profile.html',
    'set-password.html'
  ]) {
    const html = readFileSync(new URL(page, root), 'utf8');
    assert.match(html, /lesson-content-i18n\\.js/, page + ' must load expanded translation runtime');
  }
});
