(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  var heroSearch = document.querySelector('[data-hero-search]');
  if (heroSearch) {
    heroSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = heroSearch.querySelector('input');
      var keyword = input ? input.value.trim() : '';
      var target = heroSearch.getAttribute('data-target') || './search.html';
      window.location.href = keyword ? target + '?q=' + encodeURIComponent(keyword) : target;
    });
  }

  var filterForm = document.querySelector('[data-filter-form]');
  if (filterForm) {
    var input = filterForm.querySelector('[data-search-input]');
    var select = filterForm.querySelector('[data-filter-select]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q');
    if (initial && input) {
      input.value = initial;
    }
    var applyFilter = function () {
      var query = input ? input.value.trim().toLowerCase() : '';
      var category = select ? select.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardCategory = card.getAttribute('data-category') || '';
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchCategory = !category || cardCategory === category;
        var show = matchQuery && matchCategory;
        card.classList.toggle('hidden-card', !show);
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    };
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });
    if (input) {
      input.addEventListener('input', applyFilter);
    }
    if (select) {
      select.addEventListener('change', applyFilter);
    }
    applyFilter();
  }
})();
