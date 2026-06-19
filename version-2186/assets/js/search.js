
(function () {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();
    const input = document.querySelector('[data-search-page-input]');
    const status = document.querySelector('[data-search-status]');
    const results = document.querySelector('[data-search-results]');
    const index = Array.isArray(window.MOVIE_INDEX) ? window.MOVIE_INDEX : [];

    if (input) {
        input.value = query;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function card(movie) {
        const tags = (movie.tags || []).slice(0, 2).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
            '<article class="movie-card">',
            '    <a href="video/' + movie.id + '.html" class="movie-cover" aria-label="查看' + escapeHtml(movie.title) + '">',
            '        <img src="' + movie.coverNo + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="cover-region">' + escapeHtml(movie.region) + '</span>',
            '        <span class="cover-type">' + escapeHtml(movie.type) + '</span>',
            '    </a>',
            '    <div class="movie-card-body">',
            '        <h3><a href="video/' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p>' + escapeHtml(movie.oneLine) + '</p>',
            '        <div class="card-meta">',
            '            <span>' + escapeHtml(movie.year) + '</span>',
            '            <span>' + escapeHtml(movie.genre) + '</span>',
            '            <span>评分 ' + escapeHtml(movie.rating) + '</span>',
            '        </div>',
            '        <div class="tag-row">' + tags + '</div>',
            '    </div>',
            '</article>'
        ].join('\n');
    }

    function runSearch() {
        if (!results || !status) {
            return;
        }

        if (!query) {
            status.textContent = '请输入关键词开始搜索。';
            results.innerHTML = '';
            return;
        }

        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        const matches = index.filter(function (movie) {
            const haystack = [
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                movie.oneLine,
                (movie.tags || []).join(' ')
            ].join(' ').toLowerCase();

            return terms.every(function (term) {
                return haystack.includes(term);
            });
        }).slice(0, 120);

        status.textContent = '关键词“' + query + '”找到 ' + matches.length + ' 个结果，最多显示前 120 个。';
        results.innerHTML = matches.map(card).join('\n');

        results.querySelectorAll('img').forEach(function (image) {
            image.addEventListener('error', function () {
                image.classList.add('is-missing-image');
            }, { once: true });
        });
    }

    runSearch();
})();
