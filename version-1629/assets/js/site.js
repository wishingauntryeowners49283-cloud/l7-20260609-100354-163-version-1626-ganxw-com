
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
  });
}

const heroSlider = document.querySelector('[data-hero-slider]');

if (heroSlider) {
  const slides = Array.from(heroSlider.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(heroSlider.querySelectorAll('[data-hero-dot]'));
  const prevButton = heroSlider.querySelector('[data-hero-prev]');
  const nextButton = heroSlider.querySelector('[data-hero-next]');
  let currentIndex = 0;
  let timer = null;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentIndex);
    });
  };

  const startTimer = () => {
    stopTimer();
    timer = window.setInterval(() => showSlide(currentIndex + 1), 5200);
  };

  const stopTimer = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.heroDot));
      startTimer();
    });
  });

  prevButton?.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    startTimer();
  });

  nextButton?.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    startTimer();
  });

  heroSlider.addEventListener('mouseenter', stopTimer);
  heroSlider.addEventListener('mouseleave', startTimer);
  startTimer();
}

const filterPanel = document.querySelector('[data-filter-panel]');

if (filterPanel) {
  const input = filterPanel.querySelector('[data-filter-input]');
  const regionSelect = filterPanel.querySelector('[data-filter-region]');
  const typeSelect = filterPanel.querySelector('[data-filter-type]');
  const yearSelect = filterPanel.querySelector('[data-filter-year]');
  const resetButton = filterPanel.querySelector('[data-filter-reset]');
  const countNode = filterPanel.querySelector('[data-filter-count]');
  const emptyNode = document.querySelector('[data-filter-empty]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

  const applyFilters = () => {
    const keyword = (input?.value || '').trim().toLowerCase();
    const region = regionSelect?.value || '';
    const type = typeSelect?.value || '';
    const year = yearSelect?.value || '';
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.tags,
        card.dataset.genre,
      ].join(' ').toLowerCase();

      const matchedKeyword = !keyword || text.includes(keyword);
      const matchedRegion = !region || card.dataset.region === region;
      const matchedType = !type || card.dataset.type === type;
      const matchedYear = !year || card.dataset.year === year;
      const visible = matchedKeyword && matchedRegion && matchedType && matchedYear;

      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (countNode) {
      countNode.textContent = String(visibleCount);
    }

    if (emptyNode) {
      emptyNode.hidden = visibleCount !== 0;
    }
  };

  [input, regionSelect, typeSelect, yearSelect].forEach((node) => {
    node?.addEventListener('input', applyFilters);
    node?.addEventListener('change', applyFilters);
  });

  resetButton?.addEventListener('click', () => {
    if (input) {
      input.value = '';
    }
    if (regionSelect) {
      regionSelect.value = '';
    }
    if (typeSelect) {
      typeSelect.value = '';
    }
    if (yearSelect) {
      yearSelect.value = '';
    }
    applyFilters();
  });

  applyFilters();
}
