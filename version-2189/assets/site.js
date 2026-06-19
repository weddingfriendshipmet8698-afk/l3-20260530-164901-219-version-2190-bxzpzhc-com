(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  ready(function () {
    var navButton = document.querySelector("[data-nav-toggle]");
    var navMenu = document.querySelector("[data-nav-menu]");

    if (navButton && navMenu) {
      navButton.addEventListener("click", function () {
        navMenu.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        if (timer || slides.length < 2) {
          return;
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5600);
      }

      function restart() {
        window.clearInterval(timer);
        timer = null;
        start();
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          restart();
        });
      }

      start();
    }

    var focusButtons = document.querySelectorAll("[data-player-focus]");
    focusButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        var player = document.querySelector("[data-player]");
        if (player) {
          event.preventDefault();
          player.scrollIntoView({ behavior: "smooth", block: "center" });
          var startButton = player.querySelector(".player-start");
          if (startButton) {
            window.setTimeout(function () {
              startButton.click();
            }, 320);
          }
        }
      });
    });

    var searchBox = document.getElementById("search-results");
    if (searchBox && window.MovieSearchData) {
      var params = new URLSearchParams(window.location.search);
      var query = (params.get("q") || "").trim();
      var form = document.querySelector("[data-search-page-form]");
      var input = form ? form.querySelector("input[name='q']") : null;

      if (input) {
        input.value = query;
      }

      if (query) {
        var needle = query.toLowerCase();
        var results = window.MovieSearchData.filter(function (movie) {
          return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags]
            .join(" ")
            .toLowerCase()
            .indexOf(needle) !== -1;
        }).slice(0, 120);

        if (results.length) {
          var cards = results.map(function (movie) {
            return "<a class=\"movie-card\" href=\"" + escapeHTML(movie.url) + "\">" +
              "<span class=\"poster-wrap\">" +
              "<img src=\"" + escapeHTML(movie.cover) + "\" alt=\"" + escapeHTML(movie.title) + "\" loading=\"lazy\">" +
              "<span class=\"card-duration\">" + escapeHTML(movie.duration) + "</span>" +
              "<span class=\"card-play\">▶</span>" +
              "</span>" +
              "<span class=\"movie-card-body\">" +
              "<strong>" + escapeHTML(movie.title) + "</strong>" +
              "<small>" + escapeHTML([movie.region, movie.type, movie.year].filter(Boolean).join(" · ")) + "</small>" +
              "<span>" + escapeHTML(movie.oneLine) + "</span>" +
              "</span>" +
              "</a>";
          }).join("");

          searchBox.innerHTML = "<div class=\"section-heading\"><div><h2>搜索结果</h2><p>关键词：“" + escapeHTML(query) + "”</p></div></div><div class=\"movie-grid\">" + cards + "</div>";
        } else {
          searchBox.innerHTML = "<div class=\"section-heading\"><div><h2>没有找到相关影片</h2><p>可以更换片名、地区、类型或标签重新搜索。</p></div></div>";
        }
      }
    }
  });
})();
