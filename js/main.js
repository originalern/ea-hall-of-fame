import "../scss/style.scss";

const wavePalette = [
    ["#6cf05d", "#27c58b", "#2468e8"],
    ["#bd9aff", "#bb37dc", "#e33ab2"],
    ["#ff69a4", "#ff795f", "#ffb64c"],
    ["#72ecf2", "#28b8d7", "#2780e4"],
    ["#c5ff78", "#5ce54c", "#2cab57"],
];

const populatePlayerWaveCharts = () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const ratingWavePaths = [
        "M35 850 C65 730 85 610 145 585 C195 560 225 685 270 750 C300 800 330 830 355 850 Z",
        "M185 850 C225 755 260 625 325 605 C385 585 415 735 460 850 Z",
        "M365 850 C405 730 445 585 505 565 C570 545 600 735 650 850 Z",
        "M575 850 C600 765 625 665 680 665 C735 665 760 775 795 850 Z",
        "M745 850 C775 700 800 585 850 570 C900 555 925 730 965 850 Z",
    ];
    const ratingScoreAnchors = [
        [145, 555], [325, 575], [505, 535], [680, 635], [850, 540],
    ];

    document.querySelectorAll(".football-review__chart--waves").forEach((chart, chartIndex) => {
        const review = chart.closest(".football-review");
        if (!review) return;

        const legendItems = [...review.querySelectorAll(".football-review__legend-item")];
        const metrics = legendItems.map((item) => ({
            value: item.querySelector(".prosent strong")?.textContent.trim(),
            label: item.querySelector("h3")?.textContent.trim().replace(/^\s*[\d.,]+\s*[—–-]\s*/, ""),
        })).filter((metric) => metric.value).slice(0, ratingWavePaths.length);
        if (!metrics.length) return;

        const defs = document.createElementNS(svgNS, "defs");
        const graph = document.createElementNS(svgNS, "g");
        graph.setAttribute("class", "football-review__wave-graph");

        metrics.forEach((metric, index) => {
            const value = metric.value;
            const score = Number.parseFloat(value.replace(",", "."));
            const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
            const [topColor, middleColor, baseColor] = wavePalette[index % wavePalette.length];
            const gradientId = `player-wave-${chartIndex}-${index}`;
            const gradient = document.createElementNS(svgNS, "linearGradient");
            gradient.setAttribute("id", gradientId);
            gradient.setAttribute("x1", "0");
            gradient.setAttribute("y1", "0");
            gradient.setAttribute("x2", "0");
            gradient.setAttribute("y2", "1");
            [
                ["0%", topColor, "0.98"],
                ["58%", middleColor, "0.74"],
                ["100%", baseColor, "0.05"],
            ].forEach(([offset, color, opacity]) => {
                const stop = document.createElementNS(svgNS, "stop");
                stop.setAttribute("offset", offset);
                stop.setAttribute("stop-color", color);
                stop.setAttribute("stop-opacity", opacity);
                gradient.append(stop);
            });
            defs.append(gradient);

            const group = document.createElementNS(svgNS, "g");
            group.setAttribute("class", `football-review__wave-metric football-review__wave-metric--${index + 1}`);
            const shape = document.createElementNS(svgNS, "g");
            shape.setAttribute("class", "football-review__wave-shape");
            shape.setAttribute("transform", `translate(0 600) scale(1 ${safeScore / 100}) translate(0 -850)`);
            const wave = document.createElementNS(svgNS, "path");
            wave.setAttribute("class", "football-review__wave");
            wave.setAttribute("fill", `url(#${gradientId})`);
            wave.setAttribute("d", ratingWavePaths[index]);
            shape.append(wave);

            const [x, originalY] = ratingScoreAnchors[index];
            const scoreText = document.createElementNS(svgNS, "text");
            scoreText.setAttribute("class", "football-review__wave-score");
            scoreText.setAttribute("x", String(x));
            scoreText.setAttribute("y", String(600 + (originalY - 850) * safeScore / 100));
            scoreText.textContent = value;
            const title = document.createElementNS(svgNS, "title");
            title.textContent = `${metric.label || `Характеристика ${index + 1}`}: ${value}`;
            group.append(title, shape, scoreText);
            graph.append(group);
        });

        chart.setAttribute("role", "img");
        chart.setAttribute("aria-label", `Диаграмма игровых характеристик: ${metrics.map(({ label, value }) => `${label || "Характеристика"} ${value}`).join(", ")}`);
        chart.replaceChildren(defs, graph);

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    chart.classList.add("is-visible");
                    observer.disconnect();
                }
            }, { threshold: 0.15 });
            observer.observe(chart);
        } else {
            chart.classList.add("is-visible");
        }
    });
};

populatePlayerWaveCharts();

if (document.querySelector("#gallery-grid")) {
    import("./gallery.js");
}

const biographyGallery = document.querySelector(".bio-photo-gallery .gallery-grid");
if (biographyGallery) {
    const lightbox = document.createElement("dialog");
    lightbox.className = "gallery-lightbox";
    lightbox.setAttribute("aria-label", "Просмотр фотографии");
    lightbox.innerHTML = '<button class="gallery-lightbox__close" type="button" aria-label="Закрыть фотографию">×</button><img alt="">';
    document.body.append(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const lightboxClose = lightbox.querySelector("button");

    biographyGallery.addEventListener("click", (event) => {
        const card = event.target.closest("a.gallery-card");
        if (!card) return;

        event.preventDefault();
        const image = card.querySelector("img");
        lightboxImage.src = image?.currentSrc || image?.src || card.href;
        lightboxImage.alt = image?.alt || "Фотография спортсмена";
        lightbox.showModal();
        lightboxClose.focus();
    });

    lightboxClose.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
    });
}

let slideIndex = 1;

showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.querySelectorAll(".ecspostion__slideshow");
    const dots = document.querySelectorAll(".dot");

    if (slides.length === 0) {
        return;
    }

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    slides.forEach(slide => {
        slide.style.display = "none";
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    slides[slideIndex - 1].style.display = "block";

    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
}


function myFunction(x) {
    x.classList.toggle("change");
}


const burger = document.querySelector(".header__nav");
const menu = document.querySelector(".header__list");

if (burger && menu) {
    burger.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
}

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Прокрутить страницу наверх");
backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
document.body.append(backToTop);

const updateBackToTop = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 400);
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
updateBackToTop();

const trophyBackLink = document.querySelector("[data-history-back]");
if (trophyBackLink) {
    trophyBackLink.addEventListener("click", (event) => {
        const referrer = document.referrer;
        if (referrer && new URL(referrer).origin === window.location.origin && window.history.length > 1) {
            event.preventDefault();
            window.history.back();
        }
    });
}
