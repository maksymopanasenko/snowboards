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

    

    const getData = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    getData('http://localhost:3000/snowboards')
        .then(data => {
            data.forEach(({img, alt, name, number, price}) => {
                new Snowboard(img, alt, name, number, price).render();
            })
        })
        .then(() => {
            const slides = document.querySelectorAll('.snowboards__slider__item'),
                  slidesField = document.querySelector('.snowboards__slider__inner');

            
            slides.forEach(item => {
                const width = window.getComputedStyle(item).width;
                counter = width.slice(0, width.length-2) * slides.length;
                item.style.opacity = 0.4;
                item.classList.remove('price');
            });
        
            slidesField.style.cssText = `width: ${counter} + "px"; left: -41%`;
        
            slides[2].style.opacity = 1;
            slides[2].classList.add('price');
            
        });
    

    // slider


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


    arrowPrev.addEventListener('click', (e) => getItem(e.target.offsetParent));

    arrowNext.addEventListener('click', (e) => getItem(e.target.offsetParent));


    // adding goods to shopping cart

    const btnAddToCart = document.querySelector('.snowboards__btn'),
          quantity = document.querySelector('.header__basket__bag span'),
          amount = document.querySelector('.header__basket__amount span');
    const arrItems = [];

    function getDataItem() {
        const items = document.querySelectorAll('.snowboards__slider__item');
        
        items.forEach(item => {
            if (item.classList.contains('price')) {
                const img = item.querySelector('img').getAttribute('src'),
                      alt = item.querySelector('img').getAttribute('alt'),
                      name = item.querySelector('.snowboards__slider__item-title span').innerHTML,
                      price = item.querySelector('.snowboards__slider__item-price span').innerHTML;


                const obj = {
                    img: img,
                    alt: alt,
                    name: name,
                    price: price
                }
                arrItems.push(obj);
            }
        });
    }


    btnAddToCart.addEventListener('click', () => {
        const price = document.querySelectorAll('.snowboards__slider__item-price span');

        quantity.innerHTML = slideIndex;
        price.forEach(item => {
            console.log();
            if (item.parentElement.parentElement.parentElement.classList.contains('price')) {
                amount.innerHTML = parseInt(amount.innerHTML) + parseInt(item.innerHTML.slice(0, item.innerHTML.length-2));
            };
        });
        slideIndex++;

        getDataItem();
    });


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

    const slidesInterval = setInterval(() => {
        hideSlides();
        showCurrentSlide(bgSlideIndex);

        bgSlideIndex++;

        if (bgSlideIndex > 2) {
            bgSlideIndex = 0;
        }
    }, 8000);


    // modal 

    const modal = document.querySelector('.modal'),
          shoppingCart = document.querySelector('.header__basket__bag-icon');

    function openModal(selector) {
        selector.classList.add('show');
    }

    function closeModal(selector) {
        selector.classList.remove('show');
    }


    shoppingCart.addEventListener('click', () => {
        openModal(modal);

        function calcTotal(price, selector) {
            const total = document.querySelector(selector);

            total.innerHTML = parseInt(total.innerHTML) + parseInt(price.slice(0, price.length-2));
        }
        
        const wrappElement = modal.querySelector('.modal__content__items');

        arrItems.forEach(({img, alt, name, price}, i) => {
            const toDelete = wrappElement.querySelector('.delete');
            toDelete.style.display = 'none';

            
            document.querySelector('.modal__content__total').style.display = 'flex';
            document.querySelector('.modal__content__btn').style.display = 'block';

            const newElem = document.createElement('div');
            newElem.classList.add('modal__content__item');

            newElem.innerHTML = `
                <div class="modal__content__item-number">${i+1}.</div>
                <div class="modal__content__item-img">
                    <img src="${img}" alt="${alt}">
                </div>
                <div class="modal__content__item__wrapper">
                    <div class="modal__content__item-name">${name}</div>
                    <div class="modal__content__item-price">${price}</div>
                </div>
            `;

            wrappElement.append(newElem);

            calcTotal(price, '.modal__content__total span');
        });
    });

    const closeBtn = document.querySelector('.modal__content__close');

    closeBtn.addEventListener('click', () => {
        closeModal(modal);
        
        const items = document.querySelectorAll('.modal__content__item'),
              total = document.querySelector('.modal__content__total span');

        items.forEach(item => item.remove());
        total.innerHTML = 0;
    });















});