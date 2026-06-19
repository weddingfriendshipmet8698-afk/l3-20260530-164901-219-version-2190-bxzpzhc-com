(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var prev = hero.querySelector(".hero-prev");
      var next = hero.querySelector(".hero-next");
      var index = 0;
      var timer;
      if (!slides.length) {
        return;
      }
      function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
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
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-slide")) || 0);
          start();
        });
      });
      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          start();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          start();
        });
      }
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    });
  }

  function initFilters() {
    document.querySelectorAll("[data-search-scope]").forEach(function (panel) {
      var container = panel.parentElement || document;
      var input = panel.querySelector(".search-input");
      var select = panel.querySelector(".type-filter");
      var items = Array.prototype.slice.call(container.querySelectorAll("[data-filter-item]"));
      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var type = select ? select.value : "";
        items.forEach(function (item) {
          var text = [
            item.getAttribute("data-title") || "",
            item.getAttribute("data-tags") || "",
            item.getAttribute("data-category") || "",
            item.getAttribute("data-type") || "",
            item.getAttribute("data-year") || "",
            item.getAttribute("data-region") || ""
          ].join(" ").toLowerCase();
          var itemType = item.getAttribute("data-type") || "";
          var matchText = !query || text.indexOf(query) !== -1;
          var matchType = !type || itemType.indexOf(type) !== -1 || text.indexOf(type.toLowerCase()) !== -1;
          item.hidden = !(matchText && matchType);
        });
      }
      if (input) {
        input.addEventListener("input", apply);
      }
      if (select) {
        select.addEventListener("change", apply);
      }
    });
  }

  function attachHls(video, source, callback) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      callback();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (video._hlsPlayer) {
        video._hlsPlayer.destroy();
      }
      var hls = new window.Hls({ enableWorker: true });
      video._hlsPlayer = hls;
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, callback);
      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (data && data.fatal) {
          try {
            hls.destroy();
          } catch (err) {}
          video.src = source;
          callback();
        }
      });
      return;
    }
    video.src = source;
    callback();
  }

  function initPlayers() {
    document.querySelectorAll("[data-player]").forEach(function (box) {
      var video = box.querySelector("video");
      var cover = box.querySelector(".play-cover");
      if (!video) {
        return;
      }
      var source = video.getAttribute("data-stream");
      var loaded = false;
      function begin() {
        if (!source) {
          return;
        }
        if (cover) {
          cover.classList.add("is-hidden");
        }
        if (loaded) {
          video.play().catch(function () {});
          return;
        }
        loaded = true;
        attachHls(video, source, function () {
          video.play().catch(function () {});
        });
      }
      if (cover) {
        cover.addEventListener("click", begin);
      }
      video.addEventListener("click", function () {
        if (!loaded) {
          begin();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
