(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-button]');
        var menu = document.querySelector('[data-mobile-nav]');

        if (!button || !menu) {
            return;
        }

        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var slider = document.querySelector('[data-hero-slider]');

        if (!slider) {
            return;
        }

        var slides = selectAll('[data-hero-slide]', slider);
        var dots = selectAll('[data-hero-dot]', slider);
        var next = slider.querySelector('[data-hero-next]');
        var prev = slider.querySelector('[data-hero-prev]');
        var index = 0;
        var timer = null;

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
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

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

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                start();
            });
        });

        show(0);
        start();
    }

    function initSearch() {
        var panel = document.querySelector('[data-search-panel]');
        var input = panel ? panel.querySelector('[data-search-input]') : null;
        var emptyState = panel ? panel.querySelector('[data-empty-state]') : null;
        var buttons = panel ? selectAll('[data-filter-button]', panel) : [];
        var cards = selectAll('.movie-card');
        var activeFilter = '';

        if (!panel || !input || !cards.length) {
            return;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().replace(/\s+/g, '');
        }

        function matchFilter(text) {
            if (!activeFilter) {
                return true;
            }

            return activeFilter.split(/\s+/).some(function (part) {
                return part && text.indexOf(normalize(part)) !== -1;
            });
        }

        function apply() {
            var query = normalize(input.value);
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-terms'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year'),
                    card.textContent
                ].join(' '));
                var matched = (!query || text.indexOf(query) !== -1) && matchFilter(text);

                card.classList.toggle('is-hidden', !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.hidden = visible !== 0;
            }
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                button.classList.add('is-active');
                activeFilter = button.getAttribute('data-filter-value') || '';
                apply();
            });
        });

        input.addEventListener('input', apply);
        apply();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initSearch();
    });
}());
