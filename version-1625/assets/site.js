(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        showSlide(0);
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-area]")).forEach(function (panel) {
        var scope = panel.parentElement || document;
        var input = panel.querySelector("[data-search-input]");
        var typeSelect = panel.querySelector("[data-type-filter]");
        var sortSelect = panel.querySelector("[data-sort-select]");
        var grid = scope.querySelector("[data-card-grid]");
        var empty = scope.querySelector("[data-empty-state]");

        if (!grid) {
            return;
        }

        var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));

        function normalize(text) {
            return String(text || "").toLowerCase().trim();
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : "");
            var typeValue = normalize(typeSelect ? typeSelect.value : "");
            var visible = 0;

            cards.forEach(function (card) {
                var searchText = normalize(card.getAttribute("data-search"));
                var cardType = normalize(card.getAttribute("data-type"));
                var keywordOk = !keyword || searchText.indexOf(keyword) !== -1;
                var typeOk = !typeValue || cardType.indexOf(typeValue) !== -1;
                var ok = keywordOk && typeOk;

                card.classList.toggle("hidden", !ok);
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }

        function applySort() {
            var value = sortSelect ? sortSelect.value : "rank";
            var sorted = cards.slice();

            sorted.sort(function (a, b) {
                if (value === "year") {
                    return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
                }

                if (value === "title") {
                    return normalize(a.getAttribute("data-title")).localeCompare(normalize(b.getAttribute("data-title")), "zh-Hans-CN");
                }

                return Number(a.getAttribute("data-rank") || 99999) - Number(b.getAttribute("data-rank") || 99999);
            });

            sorted.forEach(function (card) {
                grid.appendChild(card);
            });

            applyFilter();
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        if (typeSelect) {
            typeSelect.addEventListener("change", applyFilter);
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", applySort);
        }

        applySort();
    });
})();
