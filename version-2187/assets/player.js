import { H as Hls } from './hls.js';

(function () {
  var root = document.querySelector('[data-player]');

  if (!root) {
    return;
  }

  var video = root.querySelector('[data-hls-video]');
  var cover = root.querySelector('[data-player-cover]');
  var status = root.querySelector('[data-player-status]');
  var hls = null;
  var started = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function startPlayer() {
    if (!video) {
      return;
    }

    if (started) {
      video.play().catch(function () {});
      return;
    }

    started = true;
    var source = video.getAttribute('data-src');

    if (cover) {
      cover.classList.add('is-hidden');
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().then(function () {
        setStatus('正在播放');
      }).catch(function () {
        setStatus('点击播放器继续播放');
      });
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().then(function () {
          setStatus('正在播放');
        }).catch(function () {
          setStatus('点击播放器继续播放');
        });
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus('播放源连接中断，请刷新页面后重试');
        }
      });

      return;
    }

    setStatus('当前浏览器暂不支持 HLS 播放');
  }

  if (cover) {
    cover.addEventListener('click', startPlayer);
  }

  if (video) {
    video.addEventListener('click', startPlayer);
    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
