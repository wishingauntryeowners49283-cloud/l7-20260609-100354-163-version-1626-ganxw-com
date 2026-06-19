(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');

  if (menuButton && siteNav) {
    menuButton.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
    const prev = carousel.querySelector('[data-hero-prev]');
    const next = carousel.querySelector('[data-hero-next]');
    let activeIndex = 0;
    let timer = null;

    const activate = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    };

    const start = () => {
      timer = window.setInterval(() => activate(activeIndex + 1), 5200);
    };

    const restart = () => {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    prev?.addEventListener('click', () => {
      activate(activeIndex - 1);
      restart();
    });

    next?.addEventListener('click', () => {
      activate(activeIndex + 1);
      restart();
    });

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        activate(dotIndex);
        restart();
      });
    });

    start();
  }

  const panels = Array.from(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach((panel) => {
    const scope = panel.nextElementSibling;
    const cards = Array.from(scope?.querySelectorAll('[data-search-card]') || []);
    const emptyState = scope?.querySelector('[data-empty-state]');
    const input = panel.querySelector('[data-search-input]');
    const typeFilter = panel.querySelector('[data-type-filter]');
    const yearFilter = panel.querySelector('[data-year-filter]');
    const resetButton = panel.querySelector('[data-filter-reset]');

    const normalize = (value) => String(value || '').trim().toLowerCase();

    const apply = () => {
      const keyword = normalize(input?.value);
      const typeValue = normalize(typeFilter?.value || 'all');
      const yearValue = normalize(yearFilter?.value || 'all');
      let visibleCount = 0;

      cards.forEach((card) => {
        const text = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.tags
        ].join(' '));
        const type = normalize(card.dataset.type);
        const year = normalize(card.dataset.year);
        const matchesKeyword = !keyword || text.includes(keyword);
        const matchesType = typeValue === 'all' || type === typeValue;
        const matchesYear = yearValue === 'all' || year === yearValue;
        const isVisible = matchesKeyword && matchesType && matchesYear;

        card.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    };

    input?.addEventListener('input', apply);
    typeFilter?.addEventListener('change', apply);
    yearFilter?.addEventListener('change', apply);
    resetButton?.addEventListener('click', () => {
      if (input) {
        input.value = '';
      }
      if (typeFilter) {
        typeFilter.value = 'all';
      }
      if (yearFilter) {
        yearFilter.value = 'all';
      }
      apply();
    });
  });
})();
