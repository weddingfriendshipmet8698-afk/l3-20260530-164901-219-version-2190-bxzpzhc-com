
import { H as Hls } from './hls-vendor-dru42stk.js';

function initPlayer(shell) {
    const video = shell.querySelector('.js-video-player');
    const playButton = shell.querySelector('[data-play-button]');

    if (!video || !playButton) {
        return;
    }

    const source = video.dataset.src;
    let hls = null;
    let loaded = false;

    function showMessage(message) {
        playButton.classList.remove('is-hidden');
        playButton.innerHTML = '<span class="play-icon">!</span><strong>' + message + '</strong><em>请稍后刷新或更换网络环境</em>';
    }

    function loadSource() {
        if (loaded) {
            return Promise.resolve();
        }

        if (!source) {
            showMessage('播放源未配置');
            return Promise.reject(new Error('Missing HLS source'));
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return Promise.resolve();
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    showMessage('视频加载失败');
                    hls.destroy();
                }
            });

            return new Promise(function (resolve) {
                hls.on(Hls.Events.MANIFEST_PARSED, resolve);
            });
        }

        showMessage('浏览器不支持 HLS');
        return Promise.reject(new Error('HLS is not supported'));
    }

    function play() {
        loadSource()
            .then(function () {
                playButton.classList.add('is-hidden');
                return video.play();
            })
            .catch(function () {
                playButton.classList.remove('is-hidden');
            });
    }

    playButton.addEventListener('click', play);

    video.addEventListener('play', function () {
        playButton.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (!video.ended) {
            playButton.classList.remove('is-hidden');
        }
    });
}

document.querySelectorAll('[data-player]').forEach(initPlayer);
