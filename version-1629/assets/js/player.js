
import { H as Hls } from './hls-dru42stk.js';

const video = document.querySelector('[data-hls-video]');
const statusNode = document.querySelector('[data-player-status]');
const playButtons = Array.from(document.querySelectorAll('[data-player-play]'));
const shell = video?.closest('.video-shell');
let hlsInstance = null;
let sourceReady = false;
let sourceLoading = false;

const setStatus = (message) => {
  if (statusNode) {
    statusNode.textContent = message;
  }
};

const loadHlsSource = () => {
  if (!video || sourceReady || sourceLoading) {
    return;
  }

  const source = video.dataset.src;

  if (!source) {
    setStatus('没有找到可用片源。');
    return;
  }

  sourceLoading = true;

  if (Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    });

    hlsInstance.loadSource(source);
    hlsInstance.attachMedia(video);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      sourceReady = true;
      sourceLoading = false;
      setStatus('高清片源已就绪，点击播放即可观看。');
    });

    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      if (!data?.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        setStatus('网络加载中断，正在重新连接片源。');
        hlsInstance.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        setStatus('媒体播放异常，正在自动恢复。');
        hlsInstance.recoverMediaError();
      } else {
        setStatus('当前片源暂时无法播放，请稍后重试。');
        hlsInstance.destroy();
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    sourceReady = true;
    sourceLoading = false;
    setStatus('浏览器原生支持 HLS，点击播放即可观看。');
  } else {
    sourceLoading = false;
    setStatus('当前浏览器不支持 HLS 播放。');
  }
};

const playVideo = async () => {
  loadHlsSource();

  if (!video) {
    return;
  }

  try {
    await video.play();
    shell?.classList.add('is-playing');
    setStatus('正在播放高清片源。');
  } catch (error) {
    setStatus('浏览器需要再次点击播放按钮才能开始播放。');
  }
};

playButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    playVideo();
  });
});

if (video) {
  loadHlsSource();

  video.addEventListener('play', () => {
    shell?.classList.add('is-playing');
  });

  video.addEventListener('pause', () => {
    shell?.classList.remove('is-playing');
  });

  video.addEventListener('ended', () => {
    shell?.classList.remove('is-playing');
    setStatus('播放已结束。');
  });
}

window.addEventListener('beforeunload', () => {
  if (hlsInstance) {
    hlsInstance.destroy();
  }
});
