function initMoviePlayer(videoId, coverId, sourceUrl) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var started = false;

    if (!video || !sourceUrl) {
        return;
    }

    function bindSource() {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(sourceUrl);
            hls.attachMedia(video);
            return new Promise(function (resolve) {
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
            });
        }

        video.src = sourceUrl;
        return Promise.resolve();
    }

    function start() {
        if (started) {
            video.play();
            return;
        }
        started = true;
        bindSource().then(function () {
            if (cover) {
                cover.classList.add("hidden");
            }
            video.controls = true;
            video.play();
        }).catch(function () {
            if (cover) {
                cover.classList.add("hidden");
            }
            video.controls = true;
            video.play();
        });
    }

    video.addEventListener("click", start);
    if (cover) {
        cover.addEventListener("click", start);
    }
}
