let slideIndex = 1;

showSlides(slideIndex);

function plusSlides(n){
    showSlides(slideIndex += n);
}

function currentSlide(n){
    showSlides(slideIndex = n);
}

function showSlides(n){

    const slides = document.querySelectorAll(".ecspostion__slideshow");
    const dots = document.querySelectorAll(".dot");

    if(n > slides.length){
        slideIndex = 1;
    }

    if(n < 1){
        slideIndex = slides.length;
    }

    slides.forEach(slide => {
        slide.style.display = "none";
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active");
}


function plusSlides(n){

    showSlides(slideIndex += n);

}

function currentSlide(n){

    showSlides(slideIndex = n);

}

function showSlides(n){

    let i;

    let slides = document.getElementsByClassName("ecspostion__slideshow");

    let dots = document.getElementsByClassName("dot");

    if(n > slides.length){

        slideIndex = 1;

    }

    if(n < 1){

        slideIndex = slides.length;

    }

    for(i = 0; i < slides.length; i++){

        slides[i].style.display = "none";

    }

    for(i = 0; i < dots.length; i++){

        dots[i].className = dots[i].className.replace(" active","");

    }

    slides[slideIndex - 1].style.display = "block";

    dots[slideIndex - 1].className += " active";

}

function myFunction(x) {
  x.classList.toggle("change");
}

const burger = document.querySelector('.header__nav');
const menu = document.querySelector('.header__list');

burger.addEventListener('click', () => {
    menu.classList.toggle('active');
});