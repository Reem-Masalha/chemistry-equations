(() => {
  'use strict';

  const KEY = 'chemistryTheme';

  const loadScript = src => {
    const existing = document.querySelector(`script[src^="${src}"]`);
    if (existing) return Promise.resolve();
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = resolve;
      (document.head || document.documentElement).appendChild(script);
    });
  };

  const read = () => {
    try {
      return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  };

  const apply = mode => {
    const dark = mode === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.body?.classList.toggle('dark', dark);
    const button = document.getElementById('themeToggle');
    if (button) {
      button.textContent = dark ? '☀️ Light' : '🌙 Dark';
      button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
      button.setAttribute('aria-pressed', String(dark));
    }
  };

  const setNavigation = () => {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    const routes = [
      ['Learn', 'index.html'],
      ['Quiz', 'personal-quiz.html'],
      ['Challenges', 'challenges.html'],
      ['Balancer', 'balancer.html'],
      ['Checker', 'checker.html']
    ];
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const active = page === 'learn.html' || page === 'index.html' || page.includes('lesson')
      ? 'index.html'
      : routes.some(([, href]) => href === page) ? page : 'index.html';

    [...nav.querySelectorAll('a')].slice(0, routes.length).forEach((anchor, index) => {
      const [label, href] = routes[index];
      anchor.href = href;
      anchor.textContent = label;
      anchor.classList.toggle('active', href === active);
    });
    nav.setAttribute('dir', 'ltr');
    const brand = document.querySelector('.brand');
    if (brand) brand.href = 'index.html';
  };

  const installThemeButton = () => {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    let button = document.getElementById('themeToggle');
    if (!button) {
      button = document.createElement('button');
      button.id = 'themeToggle';
      button.className = 'secondary';
      button.type = 'button';
      topbar.appendChild(button);
    }
    button.onclick = () => {
      const next = read() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch {}
      apply(next);
    };
    apply(read());
  };

  const reorderControls = () => {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    ['accountTopBtn', 'logoutTopBtn', 'site-language-control', 'themeToggle'].forEach(id => {
      const element = document.getElementById(id);
      if (element) topbar.appendChild(element);
    });
  };

  const ensureLanguageSystem = async () => {
    await loadScript('i18n-core.js?v=20260906-static-design-system');
    window.ChemistryI18n?.apply?.();
    reorderControls();
  };

  const init = () => {
    setNavigation();
    installThemeButton();
    reorderControls();
    ensureLanguageSystem();
    window.addEventListener('chemistryI18nReady', reorderControls);
    window.addEventListener('chemistryLanguageChanged', reorderControls);
    window.addEventListener('load', reorderControls, { once: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
