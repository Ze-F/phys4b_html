/* ============================================================
   PHYS 4B Review — Theme switcher (light / dark)
   - On load: read localStorage('phys4b-theme'); fall back to OS preference
   - Inject a floating toggle button in the bottom-right corner
   - Persist user choice
   ============================================================ */
(function () {
  const KEY = 'phys4b-theme';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
    }
    updateButton(theme);
  }

  function updateButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = theme === 'dark' ? '☀' : '☾';
    btn.title = theme === 'dark' ? '切换浅色' : '切换深色';
    btn.setAttribute('aria-label', btn.title);
  }

  function createButton() {
    if (document.getElementById('theme-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    btn.onclick = function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    };
    document.body.appendChild(btn);
    updateButton(currentTheme());
  }

  // Apply theme immediately to prevent flash-of-light-content
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
  const sysDark = window.matchMedia &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (sysDark ? 'dark' : 'light');
  setTheme(initial, false);

  // Inject the button once <body> is parsed
  if (document.body) {
    createButton();
  } else {
    document.addEventListener('DOMContentLoaded', createButton);
  }

  // Track system preference changes when user has not explicitly chosen
  if (window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = function (e) {
      let stored = null;
      try { stored = localStorage.getItem(KEY); } catch (err) { /* ignore */ }
      if (!stored) setTheme(e.matches ? 'dark' : 'light', false);
    };
    if (mql.addEventListener) mql.addEventListener('change', listener);
    else if (mql.addListener) mql.addListener(listener);
  }
})();
