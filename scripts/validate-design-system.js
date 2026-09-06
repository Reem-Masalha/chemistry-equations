const fs = require('fs');

const corePages = [
  'index.html',
  'balancer.html',
  'checker.html',
  'personal-quiz.html',
  'challenges.html',
  'beginner-lessons.html',
  'intermediate-lessons.html',
  'advanced-lessons.html'
];

const canonicalStylesheet = 'site-design-system.css';
const canonicalStylesheetVersion = 'site-design-system.css?v=20260906-mobile-header-2';
const legacyStylesheets = ['modern-refresh.css', 'site-shell.css', 'site-unified-v13.css', 'site-unified-v14.css'];
const errors = [];

for (const page of corePages) {
  const html = fs.readFileSync(page, 'utf8');
  const stylesheetMatches = [...html.matchAll(/<link[^>]+href="([^"]+\.css[^"]*)"[^>]*>/g)];
  const stylesheets = stylesheetMatches.map(match => match[1]);
  const canonicalIndexes = stylesheets
    .map((href, index) => href.startsWith(canonicalStylesheet) ? index : -1)
    .filter(index => index >= 0);

  if (canonicalIndexes.length !== 1) {
    errors.push(`${page}: expected exactly one ${canonicalStylesheet} link`);
  } else if (canonicalIndexes[0] !== stylesheets.length - 1) {
    errors.push(`${page}: ${canonicalStylesheet} must be the final stylesheet`);
  }

  if (!stylesheets.includes(canonicalStylesheetVersion)) {
    errors.push(`${page}: does not load ${canonicalStylesheetVersion}`);
  }

  for (const legacy of legacyStylesheets) {
    if (stylesheets.some(href => href.startsWith(legacy))) {
      errors.push(`${page}: still loads legacy shared stylesheet ${legacy}`);
    }
  }

  for (const required of ['class="topbar"', 'class="brand"', 'class="main-nav"', 'id="accountTopBtn"', '<footer>']) {
    if (!html.includes(required)) errors.push(`${page}: missing shared shell marker ${required}`);
  }

  if (!/theme\.js\?v=20260906-root-design-19/.test(html)) {
    errors.push(`${page}: does not load the current behavior-only theme script`);
  }
}

const themeScript = fs.readFileSync('theme.js', 'utf8');
for (const forbidden of ['modern-refresh.css', 'site-shell.css', 'site-unified-v14.css', 'siteShellParity', 'MutationObserver']) {
  if (themeScript.includes(forbidden)) errors.push(`theme.js: still contains runtime styling mechanism ${forbidden}`);
}

const designSystem = fs.readFileSync(canonicalStylesheet, 'utf8');
for (const required of [
  '@media (max-width: 1100px)',
  'flex: 1 0 100%',
  'overflow-x: auto',
  'text-overflow: ellipsis'
]) {
  if (!designSystem.includes(required)) {
    errors.push(`${canonicalStylesheet}: missing responsive header rule ${required}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Design-system validation passed for ${corePages.length} core pages.`);
