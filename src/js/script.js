'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const arrowNext = document.querySelector('#arrow-next'),
    arrowPrev = document.querySelector('#arrow-prev'),
    slides = document.querySelectorAll('.snowboards__slider__item'),
    slidesField = document.querySelector('.snowboards__slider__inner');

    let slideIndex = 1,
    counter;


    class Snowboard {
        constructor(img, alt, title, number, price) {
            this.img = img;
            this.alt = alt;
            this.title = title;
            this.number = number;
            this.price = price;
        }

        render() {
            const elem = document.createElement('div');
            elem.classList.add('snowboards__slider__item');
            elem.innerHTML = `
                <img src=${this.img} alt=${this.alt}>
                <div class="snowboards__slider__item__descr">
                    <div class="snowboards__slider__item-title">
                        Article: <span>${this.title}</span>
                    </div>
                    <div class="snowboards__slider__item-number">
                        Identity nr: <span>${this.number}</span>
                    </div>
                    <div class="snowboards__slider__item-price">
                        Price: <span>${this.price} €</span>
                    </div>
                </div>
            `;

            slidesField.append(elem);
        }
    }

    

    // const getData = async (url) => {
    //     const res = await fetch(url);

    //     if (!res.ok) {
    //         throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    //     }
    
    //     return await res.json();
    // }

    // getData('http://localhost:3000/snowboards')
    //     .then(data => {
    //         data.forEach(({img, alt, name, number, price}) => {
    //             new Snowboard(img, alt, name, number, price).render();
    //         });
    //     });

    new Snowboard(
        'img/snowboards/board_6.png',
        'snowboard_6',
        'Black And White',
        '22-506',
        40
    ).render();

    


    // slider

    
    slides.forEach(item => {
        const width = window.getComputedStyle(item).width;
        counter = width.slice(0, width.length-2) * slides.length;
        item.style.opacity = 0.4;
        item.classList.remove('price');
    });

    slidesField.style.cssText = `width: ${counter} + "px"; left: -41%`

    slides[2].style.opacity = 1;
    slides[2].classList.add('price');
    


    function getItem(arrow) {
        const slides = document.querySelectorAll('.snowboards__slider__item');
        
        slides.forEach(item => {
            item.style.opacity = 0.4;
            item.classList.remove('price');
         });

        const other = document.createElement('div');
        other.classList.add('snowboards__slider__item');
        other.style.opacity = 0.4;

        if (arrow == arrowNext) {
            other.innerHTML = slides[0].innerHTML;
            slidesField.append(other);
            slides[0].remove();
            slides[3].style.opacity = 1;
            slides[3].classList.add('price');
        }

        if (arrow == arrowPrev) {
            other.innerHTML = slides[slides.length-1].innerHTML;
            slidesField.insertAdjacentElement('afterbegin', other);
            slides[slides.length-1].remove();
            slides[1].style.opacity = 1;
            slides[1].classList.add('price');
        }
    }


    arrowPrev.addEventListener('click', () => getItem(arrowPrev));

    arrowNext.addEventListener('click', () => getItem(arrowNext));

    const buttonCart = document.querySelector('.snowboards__btn'),
          quantity = document.querySelector('.header__basket__bag span'),
          amount = document.querySelector('.header__basket__amount span');


    buttonCart.addEventListener('click', () => {
        const price = document.querySelectorAll('.snowboards__slider__item-price span');
        quantity.innerHTML = slideIndex;
        price.forEach(item => {
            console.log();
            if (item.parentElement.parentElement.parentElement.classList.contains('price')) {
                amount.innerHTML = parseInt(amount.innerHTML) + parseInt(item.innerHTML.slice(0, item.innerHTML.length-2));
            };
        });
        slideIndex++;
    });

    // function final() {


    // }


    // server
    
    const form = document.querySelector('form');

    bindPostData(form);

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
             
            const postData = async (url, data) => {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: data
                });
            
                return await response.json();
            };
        
            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
            })
            .catch(() =>{
                console.log('error');
            })
            .finally(form.reset());

        });
    }


    // bg slider auto

    const bgSlides = document.querySelectorAll('.promo__bg img');
          
    let bgSlideIndex = 0;

    function hideSlides() {
        bgSlides.forEach(item => {
            item.classList.remove('show');
            item.classList.add('hide');
        });
    }


    function showCurrentSlide(index) {
        bgSlides[index].classList.remove('hide');
        bgSlides[index].classList.add('show', 'fade');
    }

    // hideSlides();
    // showCurrentSlide();

    // function changeBgSlides(index) {
        
    // }

    // changeBgSlides(bgSlideIndex);
    const slidesInterval = setInterval(() => {
        hideSlides();
        showCurrentSlide(bgSlideIndex);

        bgSlideIndex++;

        if (bgSlideIndex > 2) {
            bgSlideIndex = 0;
        }
    }, 8000);















});