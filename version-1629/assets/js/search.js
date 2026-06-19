
const root = document.body.dataset.root || '';
const input = document.querySelector('[data-search-page-input]');
const button = document.querySelector('[data-search-page-button]');
const statusNode = document.querySelector('[data-search-status]');
const resultsNode = document.querySelector('[data-search-results]');
let movies = [];

const setStatus = (message) => {
  if (statusNode) {
    statusNode.textContent = message;
  }
};

const escapeHtml = (value) => {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

const createMovieCard = (movie) => {
  const tagText = Array.isArray(movie.tags) ? movie.tags.join(' ') : '';
  return `
<article class="movie-card" data-movie-card data-title="${escapeHtml(movie.title)}" data-region="${escapeHtml(movie.region)}" data-type="${escapeHtml(movie.type)}" data-year="${escapeHtml(movie.year)}" data-tags="${escapeHtml(tagText)}" data-genre="${escapeHtml(movie.genre)}">
  <a class="poster-link" href="${root}${escapeHtml(movie.url)}" aria-label="观看 ${escapeHtml(movie.title)}">
    <div class="poster-wrap">
      <img src="${root}${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}高清封面" loading="lazy">
      <div class="poster-overlay">
        <span class="play-ring" aria-hidden="true">▶</span>
      </div>
      <span class="badge badge-region">${escapeHtml(movie.region)}</span>
      <span class="badge badge-type">${escapeHtml(movie.type)}</span>
    </div>
    <div class="card-body">
      <h3>${escapeHtml(movie.title)}</h3>
      <p>${escapeHtml(movie.oneLine)}</p>
      <div class="card-meta">
        <span>${escapeHtml(movie.year)}</span>
        <span>${escapeHtml(movie.genre || movie.type)}</span>
      </div>
    </div>
  </a>
</article>`;
};

const renderResults = (query) => {
  if (!resultsNode) {
    return;
  }

  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    resultsNode.innerHTML = '';
    setStatus('请输入关键词开始搜索。');
    return;
  }

  const matched = movies.filter((movie) => {
    const text = [
      movie.title,
      movie.region,
      movie.type,
      movie.year,
      movie.genre,
      movie.oneLine,
      ...(movie.tags || []),
    ].join(' ').toLowerCase();
    return text.includes(keyword);
  }).slice(0, 120);

  resultsNode.innerHTML = matched.map(createMovieCard).join('');
  setStatus(`找到 ${matched.length} 部相关影片${matched.length === 120 ? '，已显示前 120 部' : ''}。`);
};

const runSearch = () => {
  renderResults(input?.value || '');
};

const params = new URLSearchParams(window.location.search);
const initialQuery = params.get('q') || '';

if (input) {
  input.value = initialQuery;
  input.addEventListener('input', runSearch);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      runSearch();
    }
  });
}

button?.addEventListener('click', runSearch);

fetch(`${root}data/movies.json`)
  .then((response) => response.json())
  .then((data) => {
    movies = data;
    renderResults(initialQuery);
  })
  .catch(() => {
    setStatus('影片数据加载失败，请确认 data/movies.json 存在。');
  });
