(function () {
  var shell = document.querySelector('[data-player]');
  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var button = shell.querySelector('[data-player-start]');
  if (!video || !button) {
    return;
  }

  var stream = video.getAttribute('data-stream');
  var ready = false;
  var hls = null;

  var attach = function () {
    if (ready || !stream) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }
    shell.classList.add('player-active');
  };

  var start = function () {
    attach();
    var request = video.play();
    if (request && typeof request.catch === 'function') {
      request.catch(function () {});
    }
  };

  button.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function () {
    shell.classList.add('player-active');
  });
  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
})();
