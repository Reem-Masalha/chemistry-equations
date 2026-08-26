// Deployment cache guard.
// The script deliberately uses a short-lived cache-busting redirect so a browser
// that has an older GitHub Pages HTML document can reach the current deployment.
(() => {
  const build = document.querySelector('meta[name="site-build"]')?.content || 'current';
  const key = 'chemistry-equations-build';
  try {
    const previous = localStorage.getItem(key);
    localStorage.setItem(key, build);
    if (previous && previous !== build) {
      const url = new URL(window.location.href);
      url.searchParams.set('site-build', build);
      window.location.replace(url.toString());
    }
  } catch (_) {}
})();
