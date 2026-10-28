const { test, expect } = require('@playwright/test');

const routes = [
  'index.html',
  'learn.html',
  'personal-quiz.html',
  'challenges.html',
  'checker.html',
  'chemistry-reference.html',
  'beginner-lessons.html',
  'intermediate-lessons.html',
  'advanced-lessons.html',
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

      const layout = await page.evaluate(() => {
        const offenders = [...document.querySelectorAll('body *')].map(el => {
          const r = el.getBoundingClientRect();
          return { tag: el.tagName, id: el.id, cls: typeof el.className === 'string' ? el.className.slice(0, 80) : '', left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) };
        }).filter(el => el.right > innerWidth + 2 || el.left < -2 || el.width > innerWidth + 2)
          .sort((a, b) => b.right - a.right).slice(0, 12);
        const scrollers = [...document.querySelectorAll('body *')].map(el => {
          const r = el.getBoundingClientRect();
          return { tag: el.tagName, id: el.id, cls: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
            left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
            clientWidth: el.clientWidth, scrollWidth: el.scrollWidth };
        }).filter(el => el.scrollWidth > el.clientWidth + 2).sort((a, b) => b.scrollWidth - a.scrollWidth).slice(0, 12);
        const checker = document.querySelector('.checker-card');
        const children = checker ? [...checker.children].map(el => {
          const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
          return { tag: el.tagName, id: el.id, cls: el.className, left: Math.round(r.left), right: Math.round(r.right),
            width: Math.round(r.width), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth,
            boxSizing: cs.boxSizing, cssWidth: cs.width, padding: cs.padding, margin: cs.margin };
        }) : [];
        return { viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, offenders, scrollers, children };
      });
      expect(Math.max(layout.document, layout.body), JSON.stringify(layout))
        .toBeLessThanOrEqual(layout.viewport + 2);
      expect(pageErrors, pageErrors.join('\n')).toEqual([]);
    });
  }
}

test('translation dictionary has Arabic and Hebrew for every entry', async ({ page }) => {
  await prepare(page, 'en');
  await page.goto('/learn.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });
  const audit = await page.evaluate(() => window.ChemistryI18nDictionaryAudit);
  expect(audit.entries).toBeGreaterThan(600);
  expect(audit.missing).toEqual([]);
});

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


for (const language of languages) {
  test(`profile achievements and certificate preview are localized in ${language.code}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(({ language }) => {
      localStorage.setItem('chemistryLanguage', language);
      localStorage.setItem('chemistryTheme', 'light');
      localStorage.setItem('chemistryCurrentUser', JSON.stringify({
        id: 'playwright-user', username: 'TestUser', name: 'Test User', token: 'playwright-token'
      }));
    }, { language: language.code });
    await page.route('https://chemistry-equations-api.reemkhmasalha.workers.dev/api/scores', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ scores: [] }) }));
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto('/profile.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#profileContent .profile-dashboard')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', language.code);
    await expect(page.locator('html')).toHaveAttribute('dir', language.dir);
    await page.locator('#previewAchievements').click();
    await expect(page.locator('#achievements .achievement')).toHaveCount(5);
    await expect(page.locator('#certificatePreviewOverlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#certificateArea .certificate')).toBeVisible();
    if (language.code !== 'en') {
      for (const english of ['Certificate of Achievement', 'Overall score', 'Equations solved', 'Download / Print Certificate']) {
        await expect(page.locator('#certificateArea')).not.toContainText(english);
      }
    }
    await expect(pageErrors, pageErrors.join('\\n')).toEqual([]);
    if (language.code !== 'en') {
      await expect(page.locator('#certificatePreviewOverlay .certificate-preview-title')).not.toContainText('Certificate Preview');
    }
  });
}

for (const language of languages.filter(item => item.code !== 'en')) {
  test(`dynamic profile achievement cards translate to ${language.code}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.addInitScript(({ language }) => {
      localStorage.setItem('chemistryLanguage', language);
      localStorage.setItem('chemistryCurrentUser', JSON.stringify({
        id: 'playwright-user', username: 'TestUser', name: 'Test User', token: 'playwright-token'
      }));
    }, { language: language.code });
    await page.route('https://chemistry-equations-api.reemkhmasalha.workers.dev/api/scores', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ scores: [] }) }));
    await page.goto('/profile.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#profileContent .profile-dashboard')).toBeVisible();
    await page.locator('#previewAchievements').click();
    const cards = await page.locator('#achievements').innerText();
    for (const english of ['First Quiz', 'Complete your first quiz.', '10 in a Row', 'Complete all learning stages.']) {
      expect(cards, 'Untranslated achievement text: ' + english).not.toContain(english);
    }
    const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    expect(Math.max(widths.document, widths.body), JSON.stringify(widths)).toBeLessThanOrEqual(widths.viewport + 2);
  });
}


for (const language of languages) {
  test(`practice session starts and renders answer choices in ${language.code}`, async ({ page }) => {
    await prepare(page, language.code);
    await page.goto('/personal-quiz.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });
    await page.locator('#newQuiz').click();
    await expect(page.locator('#quizArea .practice-choice')).toHaveCount(4);
    await expect(page.locator('#quizArea')).toContainText('→');
    const questionMeta = await page.locator('.practice-question-meta').innerText();
    if (language.code !== 'en') {
      expect(questionMeta, 'Untranslated practice metadata: ' + questionMeta).not.toMatch(/\b(basic balancing|coefficients|diatomic elements|already-balanced equations|tricky formulas|parentheses|polyatomic ions|combustion|redox|ionic equations|beginner|intermediate|advanced|easy|medium|hard)\b/i);
    }
    await expect(page.locator('#cancelQuiz')).toBeVisible();
    await page.locator('#cancelQuiz').click();
    await expect(page.locator('#quizArea')).toContainText(language.code === 'ar' ? 'تم إلغاء الاختبار' : language.code === 'he' ? 'החידון בוטל' : 'Quiz cancelled');
  });
}


for (const language of languages) {
  test(`practice feedback hints are localized in ${language.code}`, async ({ page }) => {
    await prepare(page, language.code);
    await page.goto('/personal-quiz.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.ChemistryI18nReady === true, null, { timeout: 15000 });
    await page.locator('input[name="qtype"][value="coefficients"]').check();
    await page.locator('#newQuiz').click();
    const coefficients = page.locator('#quizArea [data-coef]');
    await expect(coefficients.first()).toBeVisible();
    await coefficients.first().fill('99');
    for (let i = 1; i < await coefficients.count(); i++) await coefficients.nth(i).fill('1');
    await page.locator('#quizArea .practice-submit').click();
    await expect(page.locator('#answerFeedback')).toBeVisible();
    const hint = await page.locator('#answerFeedback .muted').innerText();
    expect(hint.trim().length).toBeGreaterThan(5);
    if (language.code === 'ar') expect(hint, 'Arabic feedback hint expected').toMatch(/[\u0600-\u06FF]/);
    if (language.code === 'he') expect(hint, 'Hebrew feedback hint expected').toMatch(/[\u0590-\u05FF]/);
  });
}
