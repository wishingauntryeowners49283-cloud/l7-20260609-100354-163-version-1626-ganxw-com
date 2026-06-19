(function() {
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    callback();
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function() {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var active = 0;

    function show(index) {
      active = index;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        show(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function() {
        show((active + 1) % slides.length);
      }, 5600);
    }
  }

  function setupLocalFilters() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-local-filter]'));
    forms.forEach(function(form) {
      var input = form.querySelector('input[type="search"]');
      var list = document.querySelector('[data-filter-list]');
      if (!input || !list) {
        return;
      }
      var items = Array.prototype.slice.call(list.children);

      function applyFilter() {
        var query = input.value.trim().toLowerCase();
        items.forEach(function(item) {
          var text = item.textContent.toLowerCase();
          item.style.display = text.indexOf(query) === -1 ? 'none' : '';
        });
      }

      form.addEventListener('submit', function(event) {
        event.preventDefault();
        applyFilter();
      });
      input.addEventListener('input', applyFilter);
    });
  }

  function setupSearchPage() {
    var form = document.querySelector('[data-site-search-form]');
    var results = document.querySelector('[data-search-results]');
    var title = document.querySelector('[data-search-title]');
    if (!form || !results || !window.siteSearchItems) {
      return;
    }
    var input = form.querySelector('input[name="q"]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    if (input && initialQuery) {
      input.value = initialQuery;
      render(initialQuery);
    }

    function card(item) {
      return [
        '<a class="movie-card movie-card-standard" href="./' + item.file + '">',
        '<div class="poster-frame"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy"></div>',
        '<div class="movie-card-body">',
        '<div class="card-tags"><span>' + escapeHtml(item.genre) + '</span></div>',
        '<h3>' + escapeHtml(item.title) + '</h3>',
        '<p>' + escapeHtml(item.line) + '</p>',
        '<div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
        '</div>',
        '</a>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function render(query) {
      var normalized = query.trim().toLowerCase();
      if (!normalized) {
        return;
      }
      var matched = window.siteSearchItems.filter(function(item) {
        return item.text.indexOf(normalized) !== -1;
      }).slice(0, 120);
      results.innerHTML = matched.map(card).join('');
      if (title) {
        title.textContent = matched.length ? '搜索结果' : '未找到相关影片';
      }
    }

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      if (input) {
        render(input.value);
        var url = new URL(window.location.href);
        url.searchParams.set('q', input.value.trim());
        window.history.replaceState({}, '', url.toString());
      }
    });
  }

  function setupImages() {
    Array.prototype.slice.call(document.querySelectorAll('img')).forEach(function(image) {
      image.addEventListener('error', function() {
        image.classList.add('image-missing');
      });
    });
  }

  onReady(function() {
    setupMobileMenu();
    setupHero();
    setupLocalFilters();
    setupSearchPage();
    setupImages();
  });
})();
