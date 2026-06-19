(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var links = document.querySelector("[data-nav-links]");

        if (!toggle || !links) {
            return;
        }

        toggle.addEventListener("click", function () {
            links.classList.toggle("is-open");
            toggle.textContent = links.classList.contains("is-open") ? "×" : "☰";
        });

        links.addEventListener("click", function (event) {
            if (event.target.tagName === "A") {
                links.classList.remove("is-open");
                toggle.textContent = "☰";
            }
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");

        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function activate(target) {
            if (!slides.length) {
                return;
            }

            index = (target + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                activate(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                activate(dotIndex);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                activate(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                activate(index + 1);
                restart();
            });
        }

        activate(0);
        restart();
    }

    function initSearchScopes() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-search-scope]"));

        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
            var empty = scope.querySelector("[data-empty-state]");

            if (!input || !cards.length) {
                return;
            }

            input.addEventListener("input", function () {
                var keyword = normalize(input.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize(card.textContent + " " + card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-category"));
                    var matched = !keyword || haystack.indexOf(keyword) !== -1;

                    card.classList.toggle("is-filtered-out", !matched);

                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            });
        });
    }

    window.initMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        var hls = null;
        var prepared = false;
        var requested = false;

        if (!video || !overlay || !options.source) {
            return;
        }

        function requestPlay() {
            var result = video.play();

            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        function prepare() {
            if (prepared) {
                return;
            }

            prepared = true;
            video.controls = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = options.source;
                video.addEventListener("loadedmetadata", function () {
                    if (requested) {
                        requestPlay();
                    }
                }, { once: true });
                video.load();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(options.source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    if (requested) {
                        requestPlay();
                    }
                });
                return;
            }

            video.src = options.source;
            video.load();
        }

        function start() {
            requested = true;
            overlay.classList.add("is-hidden");
            prepare();
            requestPlay();
        }

        overlay.addEventListener("click", start);

        video.addEventListener("click", function () {
            if (!prepared) {
                start();
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };

    ready(function () {
        initMenu();
        initHero();
        initSearchScopes();
    });
})();
