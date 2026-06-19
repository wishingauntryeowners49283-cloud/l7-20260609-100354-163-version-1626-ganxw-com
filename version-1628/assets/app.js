(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function activate(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('is-active', idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === current);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        activate(current + 1);
      }, 5200);
    }

    if (slides.length > 1) {
      if (prev) {
        prev.addEventListener('click', function () {
          activate(current - 1);
          restart();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          activate(current + 1);
          restart();
        });
      }
      dots.forEach(function (dot, idx) {
        dot.addEventListener('click', function () {
          activate(idx);
          restart();
        });
      });
      restart();
    }
  }

  var librarySearch = document.querySelector('.library-search');
  var library = document.querySelector('[data-library]');

  if (librarySearch && library) {
    var cards = Array.prototype.slice.call(library.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function filterCards(value) {
      var query = normalize(value);
      cards.forEach(function (card) {
        var title = normalize(card.getAttribute('data-title'));
        var meta = normalize(card.getAttribute('data-meta'));
        var visible = !query || title.indexOf(query) !== -1 || meta.indexOf(query) !== -1;
        card.style.display = visible ? '' : 'none';
      });
    }

    if (initial) {
      librarySearch.value = initial;
      filterCards(initial);
    }

    librarySearch.addEventListener('input', function () {
      filterCards(librarySearch.value);
    });
  }
})();
