const { test, expect } = require('@playwright/test');

const routes = [
  'index.html',
  'learn.html',
  'personal-quiz.html',
  'challenges.html',
  'checker.html',
];
const languages = [
  { code: 'en', dir: 'ltr', learn: 'Learn' },
  { code: 'ar', dir: 'rtl', learn: 'تعلّم' },
  { code: 'he', dir: 'rtl', learn: 'למידה' },
];

async function prepare(page, lang, width = 390) {
  await page.setViewportSize({ width, height: 844 });
  await page.addInitScript(({ language }) => {
    try {
      localStorage.setItem('chemistryLanguage', language);
      localStorage.setItem('chemistryTheme', 'light');
    } catch (_) {}
  }, { language: lang });
}

for (const route of routes) {
  for (const language of languages) {
    test(`${route} renders in ${language.code} with correct direction and no mobile overflow`, async ({ page }) => {
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await prepare(page, language.code);
      await page.goto('/' + route, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });

      await expect(page.locator('html')).toHaveAttribute('lang', language.code);
      await expect(page.locator('html')).toHaveAttribute('dir', language.dir);
      await expect(page.locator('#site-language-control select')).toHaveValue(language.code);
      await expect(page.locator('.main-nav a[href="learn.html"]')).toContainText(language.learn);

      const widths = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(Math.max(widths.document, widths.body), JSON.stringify(widths))
        .toBeLessThanOrEqual(widths.viewport + 2);
      expect(pageErrors, pageErrors.join('\n')).toEqual([]);
    });
  }
}

for (const language of languages.filter(item => item.code !== 'en')) {
  test(`dynamic and recently reported labels translate to ${language.code}`, async ({ page }) => {
    await prepare(page, language.code);
    await page.goto('/learn.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });

    await page.evaluate(() => {
      const host = document.createElement('section');
      host.id = 'i18n-regression-fixture';
      host.innerHTML = [
        'Continue where left off',
        'Beginner · Lesson 6',
        'Quick access',
        'Start basics',
        'Your progress',
      ].map(text => '<p>' + text + '</p>').join('');
      document.body.appendChild(host);
      window.ChemistryI18n.refresh();
    });

    const text = await page.locator('#i18n-regression-fixture').innerText();
    for (const english of [
      'Continue where left off',
      'Beginner · Lesson 6',
      'Quick access',
      'Start basics',
      'Your progress',
    ]) expect(text).not.toContain(english);
  });
}

for (const language of languages) {
  test(`balancer produces correct coefficients in ${language.code}`, async ({ page }) => {
    await prepare(page, language.code);
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });
    await page.locator('#equationEditor').fill('H2 + O2 -> H2O');
    await page.locator('#balanceBtn').click();
    await expect(page.locator('#balanceResult')).toBeVisible();
    await expect(page.locator('#balanceResult')).toContainText('2');
    await expect(page.locator('#balanceResult')).toContainText('H');
  });

  test(`checker returns a result in ${language.code}`, async ({ page }) => {
    await prepare(page, language.code);
    await page.goto('/checker.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });
    await page.locator('#checkInput').fill('2H2 + O2 -> 2H2O');
    await page.locator('#checkBtn').click();
    await expect(page.locator('#checkResult')).toBeVisible();
    await expect.poll(() => page.locator('#checkResult').innerText().then(text => text.trim().length))
      .toBeGreaterThan(10);
  });

  test(`dark mode remains available in ${language.code}`, async ({ page }) => {
    await prepare(page, language.code);
    await page.goto('/learn.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });
    await page.locator('#themeToggle').click();
    await expect(page.locator('body')).toHaveClass(/dark/);
    const surface = await page.locator('.card').first().evaluate(el => getComputedStyle(el).backgroundColor);
    expect(surface).not.toBe('rgb(255, 255, 255)');
  });
}

test('RTL layout remains within the viewport at 320px', async ({ page }) => {
  await prepare(page, 'ar', 320);
  await page.goto('/learn.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(Math.max(widths.document, widths.body), JSON.stringify(widths))
    .toBeLessThanOrEqual(widths.viewport + 2);
});
