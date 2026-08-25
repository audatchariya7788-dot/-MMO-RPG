(() => {
  // MMA : RPG emergency boot guard.
  // Keeps the loading screen from trapping the player when a runtime module
  // fails or when a cached/slow Codespaces asset delays initialization.
  const hide = el => el && el.classList.add('hidden');
  const show = el => el && el.classList.remove('hidden');

  function wire() {
    const loading = document.getElementById('loading');
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');

    // If the normal application boot completed, do not interfere.
    if (game && !game.classList.contains('hidden')) {
      hide(loading);
      return true;
    }

    // Release the loading screen and expose the main menu.
    hide(loading);
    show(menu);

    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (!el || el.dataset.bootBound) return;
      el.dataset.bootBound = '1';
      el.addEventListener('click', ev => {
        ev.preventDefault();
        if (typeof window[fn] === 'function') window[fn]();
      });
    };

    bind('newGameBtn', 'newGame');
    bind('continueBtn', 'openGame');
    bind('loadGameBtn', 'load');
    bind('menuBtn', 'menu');
    bind('saveBtn', 'save');
    bind('loadBtn', 'load');

    // If app.js is healthy, render the menu state. If not, show a useful
    // diagnostic instead of leaving the browser on an infinite loading page.
    if (typeof window.render === 'function') {
      try { window.render(); } catch (_) {}
      return true;
    }

    return false;
  }

  // Give the normal scripts a moment, then guarantee a usable screen.
  window.addEventListener('load', () => {
    setTimeout(wire, 250);
    setTimeout(() => {
      const ok = wire();
      if (!ok) {
        const menu = document.getElementById('menu');
        const content = menu?.querySelector('.menu-content');
        if (content && !content.querySelector('.boot-warning')) {
          const warning = document.createElement('p');
          warning.className = 'boot-warning';
          warning.textContent = 'Runtime กำลังเริ่มต้นใหม่… หากปุ่มไม่ทำงาน ให้รีเฟรชด้วย Ctrl + Shift + R';
          warning.style.cssText = 'color:#ffd66c;font-size:12px;margin-top:14px';
          content.appendChild(warning);
        }
      }
    }, 1800);
  });
})();
