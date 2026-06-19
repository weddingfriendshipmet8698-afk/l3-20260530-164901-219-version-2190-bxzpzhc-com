(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    active = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === active);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === active);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');

  function renderSearch(items) {
    if (!results) {
      return;
    }

    results.innerHTML = '';

    if (!items.length) {
      results.classList.remove('is-open');
      return;
    }

    items.slice(0, 10).forEach(function (item) {
      var link = document.createElement('a');
      link.href = item.url;
      link.innerHTML = '<strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.region + '</span>';
      results.appendChild(link);
    });

    results.classList.add('is-open');
  }

  if (input && results && window.SEARCH_DATA) {
    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();

      if (value.length < 1) {
        renderSearch([]);
        return;
      }

      var matched = window.SEARCH_DATA.filter(function (item) {
        return item.title.toLowerCase().indexOf(value) !== -1 ||
          item.tags.toLowerCase().indexOf(value) !== -1 ||
          item.genre.toLowerCase().indexOf(value) !== -1 ||
          item.region.toLowerCase().indexOf(value) !== -1;
      });

      renderSearch(matched);
    });
  }
})();
