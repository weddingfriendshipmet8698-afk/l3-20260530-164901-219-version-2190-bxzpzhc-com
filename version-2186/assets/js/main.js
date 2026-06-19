
(function () {
    const menuButton = document.querySelector('[data-menu-button]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('img').forEach(function (image) {
        image.addEventListener('error', function () {
            image.classList.add('is-missing-image');
            image.setAttribute('aria-hidden', 'true');
        }, { once: true });
    });

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const next = hero.querySelector('[data-hero-next]');
        const prev = hero.querySelector('[data-hero-prev]');
        let index = 0;
        let timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.dataset.heroDot || 0));
                start();
            });
        });

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    const filterInput = document.querySelector('[data-filter-input]');
    const sortSelect = document.querySelector('[data-sort-select]');
    const grid = document.querySelector('.list-section .movie-grid');

    function applyFilterAndSort() {
        if (!grid) {
            return;
        }

        const cards = Array.from(grid.querySelectorAll('[data-card]'));
        const keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';

        cards.forEach(function (card) {
            const haystack = [
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.year
            ].join(' ').toLowerCase();
            card.classList.toggle('is-hidden', keyword && !haystack.includes(keyword));
        });

        if (sortSelect) {
            const value = sortSelect.value;
            const sorted = cards.slice().sort(function (a, b) {
                if (value === 'year-desc') {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                }
                if (value === 'rating-desc') {
                    return Number((b.textContent.match(/评分\s*([0-9.]+)/) || [0, 0])[1]) - Number((a.textContent.match(/评分\s*([0-9.]+)/) || [0, 0])[1]);
                }
                if (value === 'views-desc') {
                    return 0;
                }
                if (value === 'title-asc') {
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
                }
                return 0;
            });

            sorted.forEach(function (card) {
                grid.appendChild(card);
            });
        }
    }

    if (filterInput) {
        filterInput.addEventListener('input', applyFilterAndSort);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilterAndSort);
    }
})();
