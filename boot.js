(() => {
  // MMA : RPG emergency boot guard + V5 runtime health bootstrap.
  const hide = el => el && el.classList.add('hidden');
  const show = el => el && el.classList.remove('hidden');

  function installRuntimeHealth() {
    if (!document.querySelector('link[data-mma-favicon]')) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = './assets/favicon.svg?v=20260826v1';
      link.dataset.mmaFavicon = '1';
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-mma-health]')) {
      const s = document.createElement('script');
      s.src = './v5-runtime-health.js?v=20260826health1';
      s.async = false;
      s.dataset.mmaHealth = '1';
      document.head.appendChild(s);
    }
  }

  function wire() {
    installRuntimeHealth();
    const loading = document.getElementById('loading');
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');

    if (game && !game.classList.contains('hidden')) {
      hide(loading);
      return true;
    }

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

    if (typeof window.render === 'function') {
      try { window.render(); } catch (_) {}
      return true;
    }
    return false;
  }

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
