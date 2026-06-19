(function () {
    function mount(id, streamUrl) {
        var player = document.getElementById(id);

        if (!player) {
            return;
        }

        var video = player.querySelector('video');
        var cover = player.querySelector('.player-cover');
        var ready = false;
        var hls = null;

        if (!video || !cover || !streamUrl) {
            return;
        }

        function attach() {
            if (ready) {
                return;
            }

            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                return;
            }

            video.src = streamUrl;
        }

        function play() {
            attach();
            player.classList.add('playing');
            video.controls = true;
            var action = video.play();

            if (action && typeof action.catch === 'function') {
                action.catch(function () {});
            }
        }

        cover.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('ended', function () {
            player.classList.remove('playing');
        });
        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    window.CinemaPlayer = {
        mount: mount
    };
}());
