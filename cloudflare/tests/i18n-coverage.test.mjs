import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const runtime = readFileSync(new URL('i18n-safe.js', root), 'utf8');
const dictionarySource = readFileSync(new URL('site-language-v2.js', root), 'utf8');

test('shared language runtime and dictionary assignments parse', () => {
  assert.ok(dictionarySource.includes('const M='), 'dictionary declaration must exist');
  assert.ok(dictionarySource.includes('Object.assign(M,'), 'additional dictionary entries must be merged into the shared dictionary');
  assert.ok(dictionarySource.includes('const original=new WeakMap();'), 'original-text tracker must follow the dictionary');
  assert.doesNotThrow(() => Function(dictionarySource), 'complete language runtime must parse as JavaScript');
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

test('safe translation loader parses merged dictionaries and covers progress/profile UI', () => {
  const safeRuntime = readFileSync(new URL('i18n-safe.js', root), 'utf8');
  assert.match(safeRuntime, /Function\(src\.slice\(start,end\)\+';return M;'\)\(\)/, 'loader must parse the full dictionary declaration and merged entries');
  assert.match(safeRuntime, /\^\(Beginner\|Intermediate\|Advanced\) · Lesson /, 'dynamic learning progress labels must be translated');
  for (const key of [
    'Statistics',
    'Completed stages',
    'Certificate of Achievement',
    'Download / Print Certificate',
    'Complete your first quiz.',
    'Your profile'
  ]) {
    assert.ok(safeRuntime.includes(JSON.stringify(key) + ':'), 'missing profile translation: ' + key);
  }
});

test('language runtime retains all three supported language codes and RTL direction', () => {
  assert.match(runtime, /const LANG=\{en:\{dir:'ltr',label:'English'\},ar:\{dir:'rtl',label:'العربية'\},he:\{dir:'rtl',label:'עברית'\}\}/);
  assert.match(runtime, /document\.documentElement\.dir=LANG\[l\]\.dir/);
  assert.match(runtime, /window\.ChemLang=window\.ChemistryI18n/);
});


const expandedRuntime = readFileSync(new URL('lesson-content-i18n.js', root), 'utf8');

test('expanded translation runtime parses and contains lesson, quiz, and account coverage', () => {
  assert.doesNotThrow(() => Function(expandedRuntime), 'expanded translation runtime must parse');
  const match = expandedRuntime.match(/const rows=(\[[\s\S]*?\]);const M=/);
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
    'No completed sessions yet. Finish a practice or quiz session and it will appear here.',
    'A detailed beginner path for understanding chemical equations and learning how to balance them.',
    'A chemical formula tells you which elements are present and how many atoms of each element are in one particle of the substance. A small number written after an element is a subscript.',
    'Quiz history',
    'Best results and accuracy are stored locally.',
    'Sign in to access your saved scores and progress.',
    'This code can be used to reset your password if you forget it. Save it somewhere safe. It will not be shown again unless you generate a new one.',
    'Passwords do not match.',
    'Draw a chemical equation, tap Recognize, check the transcription, then balance it.',
    'Step 1',
    'Step 2',
    'Generating a new recovery code…',
    'Copy failed',
    'Result copied',
    '⭐ Level',
    'Copy full result',
    'Copied ✓',
    'Select and copy',
    'Continue →',
    '✗ Not yet — the equation is balanced, but the coefficients can be reduced.',
    'Today\'s Daily Challenge is complete.',
    'You can review your answers or come back tomorrow for a new challenge.',
    'Delete your account and saved account data? This cannot be undone.',
    'Enter your password to confirm account deletion:',
    'The server did not return a recovery code.',
    'Manage your session and password securely.',
    'Create an account to keep your learning progress associated with your username.',
    'This equation cannot be balanced with positive whole-number coefficients.'
  ]) {
    const row = dictionary.get(key);
    assert.ok(row, 'missing expanded translation entry: ' + key);
    assert.ok(row[1] && row[2], 'Arabic and Hebrew must both be present: ' + key);
  }
  assert.ok(expandedRuntime.includes('Daily practice streak: (\\d+)'));
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
    assert.match(html, /lesson-content-i18n\.js(?:\?v=[^\"']+)?/, page + ' must load the expanded translation runtime');
  }
});
