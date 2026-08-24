import "../scss/style.scss";

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