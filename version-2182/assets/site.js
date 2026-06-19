
(function () {
  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function initMenu() {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }

  function initHero() {
    const hero = document.querySelector('[data-hero]');
    if (!hero) return;
    const slides = $$('.hero-slide', hero);
    if (slides.length <= 1) return;
    let active = 0;
    const setActive = (next) => {
      active = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
      const dots = $$('.hero-dot', hero);
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
    };
    const autoplay = window.setInterval(() => setActive(active + 1), 5000);
    hero.addEventListener('mouseenter', () => window.clearInterval(autoplay), { once: true });
    hero.addEventListener('click', (e) => {
      const dot = e.target.closest('.hero-dot');
      if (dot) setActive(Number(dot.dataset.index || 0));
    });
    setActive(0);
  }

  function initPlayer() {
    const shells = $$('[data-player]');
    shells.forEach((shell) => {
      const video = shell.querySelector('video');
      const overlay = shell.querySelector('[data-overlay]');
      const playButton = shell.querySelector('[data-play]');
      if (!video) return;
      const hlsSrc = shell.dataset.m3u8 || '';
      const mp4Src = shell.dataset.mp4 || '';
      const poster = shell.dataset.poster || '';
      if (poster) video.setAttribute('poster', poster);
      let hasSource = false;
      const nativeHls = video.canPlayType('application/vnd.apple.mpegurl');
      if (hlsSrc && window.Hls && window.Hls.isSupported()) {
        try {
          const hls = new window.Hls({ enableWorker: true });
          hls.loadSource(hlsSrc);
          hls.attachMedia(video);
          hasSource = true;
        } catch (err) {
          console.warn('HLS init failed, fallback to MP4', err);
        }
      }
      if (!hasSource) {
        if (hlsSrc && nativeHls) {
          video.src = hlsSrc;
        } else if (mp4Src) {
          video.src = mp4Src;
        }
      }
      const play = async () => {
        try {
          await video.play();
          if (overlay) overlay.style.display = 'none';
        } catch (err) {
          console.warn(err);
        }
      };
      if (playButton) playButton.addEventListener('click', play);
      if (overlay) overlay.addEventListener('click', play);
      video.addEventListener('play', () => { if (overlay) overlay.style.display = 'none'; });
      video.addEventListener('pause', () => { if (overlay) overlay.style.display = 'grid'; });
    });
  }

  function matches(movie, query) {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const hay = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine, movie.bucketName, movie.searchText]
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).every((part) => hay.includes(part));
  }

  function renderCard(movie) {
    const c = movie._colors || ['#d56f2e', '#9a5a34', '#3c2f28'];
    const initial = movie.title ? movie.title.trim().slice(0, 1) : '片';
    const escaped = (s) => String(s || '').replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    return `
      <a class="card movie-card" href="movies/${movie.slug}" style="--c1:${c[0]};--c2:${c[1]};--c3:${c[2]}">
        <div class="art">
          <span class="mark">${escaped(movie.bucketName)}</span>
          <div class="title-chip">${escaped(movie.title)}</div>
        </div>
        <div class="card-body">
          <h3>${escaped(movie.title)}</h3>
          <div class="meta"><span>${escaped(movie.year)}</span><span>${escaped(movie.region)}</span><span>${escaped(movie.type)}</span></div>
          <p>${escaped(movie.oneLine || movie.genre || '')}</p>
          <div class="inline-actions"><span class="small-link">立即查看</span></div>
        </div>
      </a>`;
  }

  function initSearch() {
    const root = document.querySelector('[data-search-page]');
    if (!root || !window.MOVIE_DATA) return;
    const input = root.querySelector('[data-search-input]');
    const results = root.querySelector('[data-search-results]');
    const hint = root.querySelector('[data-search-hint]');
    const chips = $$('.js-search-chip', root);
    const sortButtons = $$('.js-sort-btn', root);
    let sortMode = 'score';
    const bucketColors = {
      0: ['#e88c45', '#8f4b28', '#33261f'],
      1: ['#6e8efb', '#3d5aa9', '#1f2b4d'],
      2: ['#b53a6f', '#7d2749', '#321621'],
      3: ['#52b3d9', '#2d5e88', '#183047'],
      4: ['#f0a0a7', '#8e5a67', '#35242d'],
      5: ['#d96b34', '#8c4125', '#2d1d18'],
      6: ['#b17c4e', '#6d5036', '#261b15'],
      7: ['#74b06c', '#40663a', '#1f2d1c'],
      8: ['#f3c96d', '#98743a', '#2c2414'],
      9: ['#8d9db7', '#4d5a72', '#1c2230'],
    };
    const data = window.MOVIE_DATA.map((m) => ({ ...m, _colors: bucketColors[m.bucket] || bucketColors[0] }));

    function render() {
      const q = (input?.value || '').trim().toLowerCase();
      let items = data.filter((m) => matches(m, q));
      if (sortMode === 'year') {
        items.sort((a, b) => Number(b.year) - Number(a.year) || b.score - a.score);
      } else if (sortMode === 'title') {
        items.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
      } else {
        items.sort((a, b) => b.score - a.score);
      }
      if (hint) hint.textContent = `共找到 ${items.length} 条结果`;
      results.innerHTML = items.slice(0, 180).map(renderCard).join('');
    }
    input?.addEventListener('input', render);
    chips.forEach((chip) => chip.addEventListener('click', () => {
      if (input) input.value = chip.dataset.value || '';
      render();
    }));
    sortButtons.forEach((btn) => btn.addEventListener('click', () => {
      sortMode = btn.dataset.sort || 'score';
      sortButtons.forEach((b) => b.classList.toggle('primary-btn', b === btn));
      sortButtons.forEach((b) => b.classList.toggle('ghost-btn', b !== btn));
      render();
    }));
    render();
  }

  ready(() => {
    initMenu();
    initHero();
    initPlayer();
    initSearch();
  });
})();
