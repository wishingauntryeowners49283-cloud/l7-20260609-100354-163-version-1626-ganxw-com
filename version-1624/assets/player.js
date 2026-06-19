(() => {
  const players = Array.from(document.querySelectorAll('[data-player]'));

  players.forEach((box) => {
    const video = box.querySelector('video');
    const playButton = box.querySelector('[data-play-button]');
    const stream = box.dataset.stream;
    let attached = false;
    let hls = null;

    const attach = () => {
      if (!video || !stream || attached) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        attached = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        attached = true;
        return;
      }

      video.src = stream;
      attached = true;
    };

    const play = async () => {
      attach();
      try {
        await video.play();
      } catch (error) {
        box.classList.remove('is-playing');
      }
    };

    playButton?.addEventListener('click', play);
    video?.addEventListener('click', () => {
      if (video.paused) {
        play();
      }
    });
    video?.addEventListener('play', () => box.classList.add('is-playing'));
    video?.addEventListener('pause', () => box.classList.remove('is-playing'));
    video?.addEventListener('ended', () => box.classList.remove('is-playing'));
    window.addEventListener('pagehide', () => {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
