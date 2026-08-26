// Force browsers to revalidate the current static assets after each deployment.
// This does not require users to manually clear their cache.
(() => {
  const build = document.querySelector('meta[name="site-build"]')?.content || 'current';
  const key = 'chemistry-equations-build';
  try {
    const previous = localStorage.getItem(key);
    if (previous && previous !== build) {
      // Reload once when a new site build is detected.
      localStorage.setItem(key, build);
      const url = new URL(window.location.href);
      url.searchParams.set('v', build);
      window.location.replace(url.toString());
      return;
    }
    localStorage.setItem(key, build);
  } catch (_) {}
})();
