(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            var open = mobileNav.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", open ? "true" : "false");
            menuButton.textContent = open ? "×" : "☰";
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
            slide.classList.toggle("active", itemIndex === currentSlide);
        });
        dots.forEach(function (dot, itemIndex) {
            dot.classList.toggle("active", itemIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    var searchInput = document.querySelector("[data-filter-search]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var noResults = document.querySelector(".no-results");

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }
        var keyword = normalize(searchInput && searchInput.value);
        var type = normalize(typeSelect && typeSelect.value);
        var year = normalize(yearSelect && yearSelect.value);
        var visibleCount = 0;

        cards.forEach(function (card) {
            var content = [
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.year,
                card.dataset.genre,
                card.dataset.category
            ].join(" ").toLowerCase();
            var matchedKeyword = !keyword || content.indexOf(keyword) !== -1;
            var matchedType = !type || normalize(card.dataset.type) === type;
            var matchedYear = !year || normalize(card.dataset.year) === year;
            var visible = matchedKeyword && matchedType && matchedYear;
            card.style.display = visible ? "" : "none";
            if (visible) {
                visibleCount += 1;
            }
        });

        if (noResults) {
            noResults.classList.toggle("show", visibleCount === 0);
        }
    }

    [searchInput, typeSelect, yearSelect].forEach(function (control) {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });

    var backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", function () {
            backToTop.classList.toggle("show", window.scrollY > 420);
        });
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
})();
