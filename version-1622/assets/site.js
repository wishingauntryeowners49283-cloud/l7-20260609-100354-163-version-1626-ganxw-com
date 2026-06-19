(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function one(selector, root) {
    return (root || document).querySelector(selector);
  }

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupMenu() {
    var toggle = one("[data-menu-toggle]");
    var nav = one("[data-site-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slides = all("[data-hero-slide]");
    var dots = all("[data-hero-dot]");
    if (!slides.length || !dots.length) {
      return;
    }
    var active = 0;
    function show(index) {
      active = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show((active + 1) % slides.length);
    }, 6200);
  }

  function setupFilters() {
    var input = one("[data-local-filter]");
    var grid = one("[data-filter-grid]");
    if (!input || !grid) {
      return;
    }
    var cards = all(".movie-card", grid);
    input.addEventListener("input", function () {
      var value = normalize(input.value);
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.textContent
        ].join(" "));
        card.style.display = !value || text.indexOf(value) >= 0 ? "" : "none";
      });
    });
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        """: "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function renderCard(item, index) {
    var rank = item.rank ? '<em class="rank-badge">' + item.rank + '</em>' : '';
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="' + escapeHtml(item.link) + '" aria-label="' + escapeHtml(item.title) + '">',
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      rank,
      '<span class="poster-year">' + escapeHtml(item.year || '精选') + '</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<p class="movie-meta">' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</p>',
      '<h3><a href="' + escapeHtml(item.link) + '">' + escapeHtml(item.title) + '</a></h3>',
      '<p>' + escapeHtml(item.oneLine) + '</p>',
      '<div class="tag-list"><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(item.genre || item.type) + '</span></div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function setupSearch() {
    var form = one("[data-search-form]");
    var input = one("[data-search-input]");
    var results = one("[data-search-results]");
    var count = one("[data-search-count]");
    var movies = window.SEARCH_MOVIES || [];
    if (!form || !input || !results || !movies.length) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;
    function draw(value) {
      var query = normalize(value);
      var matched = query ? movies.filter(function (item) {
        var text = normalize([
          item.title,
          item.year,
          item.region,
          item.type,
          item.genre,
          item.tags,
          item.category,
          item.oneLine
        ].join(" "));
        return text.indexOf(query) >= 0;
      }) : movies.slice(0, 12);
      results.innerHTML = matched.length ? matched.map(renderCard).join("") : '<div class="empty-state">没有找到匹配影片，换一个关键词试试。</div>';
      if (count) {
        count.textContent = query ? '找到 ' + matched.length + ' 部影片' : '推荐影片';
      }
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = input.value.trim();
      var next = value ? '?q=' + encodeURIComponent(value) : window.location.pathname;
      window.history.replaceState(null, "", next);
      draw(value);
    });
    input.addEventListener("input", function () {
      draw(input.value);
    });
    if (initial) {
      draw(initial);
    }
  }

  window.SitePlayer = {
    play: function (video, layer, url) {
      if (!video || !url) {
        return;
      }
      if (video.dataset.ready !== "yes") {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          video._hls = hls;
        } else {
          video.src = url;
        }
        video.dataset.ready = "yes";
      }
      if (layer) {
        layer.classList.add("is-hidden");
      }
      video.play().catch(function () {});
    }
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearch();
  });
}());
