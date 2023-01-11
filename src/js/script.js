'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    const arrowNext = document.querySelector('#arrow-next'),
          arrowPrev = document.querySelector('#arrow-prev'),
          slides = document.querySelectorAll('.snowboards__slider__item'),
          slidesWrapper = document.querySelector('.snowboards__slider__collection'),
          slidesField = document.querySelector('.snowboards__slider__inner');

    let slideIndex = 0;

    slides.forEach(item => {
        item.style.opacity = 0.4; 
     });        
    slides[Math.floor(slides.length/2)].style.opacity = 1;

    function getItem(arrow) {
        const slides = document.querySelectorAll('.snowboards__slider__item');
        slides.forEach(item => {
            item.style.opacity = 0.4; 
         });

        const other = document.createElement('div');
        other.classList.add('snowboards__slider__item');
        other.style.opacity = 0.4;

        if (arrow == arrowPrev) {
            other.innerHTML = slides[0].innerHTML;
            slidesField.append(other);
            slides[0].remove();
            slides[Math.floor(slides.length/2)+1].style.opacity = 1;
        }

        if (arrow == arrowNext) {
            other.innerHTML = slides[slides.length-1].innerHTML;
            slidesField.insertAdjacentElement('afterbegin', other);
            slides[slides.length-1].remove();
            slides[Math.floor(slides.length/2)-1].style.opacity = 1;
        }
    }


    arrowPrev.addEventListener('click', () => {
        getItem(arrowPrev);
    });

    arrowNext.addEventListener('click', () => {
        getItem(arrowNext);
    });















});