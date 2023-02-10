'use strict';







document.addEventListener('DOMContentLoaded', () => {

    const arrowNext = document.querySelector('#arrow-next'),
    arrowPrev = document.querySelector('#arrow-prev'),
    slides = document.querySelectorAll('.snowboards__slider__item'),
    slidesField = document.querySelector('.snowboards__slider__inner');

    const btnAddToCart = document.querySelector('.snowboards__btn'),
    quantity = document.querySelector('.header__basket__bag span'),
    amount = document.querySelector('.header__basket__amount span');
    const arrItems = [];


    let counter;


    class Snowboard {
        constructor(img, alt, title, number, price, available) {
            this.img = img;
            this.alt = alt;
            this.title = title;
            this.number = number;
            this.price = price;
            this.available = available;
        }

        makeVisible() {
            if (this.available) {
                return `
                    <div class="snowboards__slider__item-number">
                        Identity nr: <span>${this.number}</span>
                    </div>
                    <div class="snowboards__slider__item-price">
                        Price: <span>${this.price} €</span>
                    </div>
                `;
            } else {
                return `
                    <div class="snowboards__slider__item-unavailable">
                        Unfortunatelly, the product is not available
                    </div>                            
                `;
            }
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
                    ${this.makeVisible()}
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
            data.forEach(({img, alt, name, number, price, available}) => {
                new Snowboard(img, alt, name, number, price, available).render();
            })
        })
        .then(shop);
    

    function shop() {
        const slides = document.querySelectorAll('.snowboards__slider__item'),
                  slidesField = document.querySelector('.snowboards__slider__inner');


            slides.forEach(item => {
                const width = window.getComputedStyle(item).width;
                counter = width.slice(0, width.length-2) * slides.length;
                item.style.opacity = 0.4;
            });
            
            addUnavailable();
        
            slidesField.style.cssText = `width: ${counter} + "px"; left: -41%`;
            

            slides[2].style.opacity = 1;
            slides[2].classList.add('price');

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
                    slidesSettings(slides, 3);
                }

                if (arrow == arrowPrev) {
                    other.innerHTML = slides[slides.length-1].innerHTML;
                    slidesField.insertAdjacentElement('afterbegin', other);
                    slides[slides.length-1].remove();
                    slidesSettings(slides, 1);
                }
            }

            function addUnavailable() {
                const unTest = document.querySelectorAll('.snowboards__slider__item-unavailable');

                unTest.forEach(item => {
                    item.parentElement.parentElement.classList.add('unavailable');
                    item.classList.remove('price');
                });
            }

            function slidesSettings(arr, i) {
                
                addUnavailable();

                arr[i].style.opacity = 1;
                arr[i].classList.add('price');
                if (arr[i].classList.contains('unavailable')) {
                    arr[i].classList.remove('price');
                }
            }


            arrowPrev.addEventListener('click', (e) => getItem(e.target.offsetParent));

            arrowNext.addEventListener('click', (e) => getItem(e.target.offsetParent));


            // adding goods to shopping cart

        
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

            // button

            btnAddToCart.addEventListener('click', () => {
                const parents = document.querySelectorAll('.snowboards__slider__item');
            
                
                parents.forEach(item => {
                    const priceItem = item.querySelector('.snowboards__slider__item-price span');

                    if (item.classList.contains('price')) {
                        quantity.innerHTML = arrItems.length + 1;
                        amount.innerHTML = parseInt(amount.innerHTML) + parseInt(priceItem.innerHTML.slice(0, priceItem.innerHTML.length-2));
                
                        getDataItem();
                    } else if (item.classList.contains('unavailable')) {
                        return;
                    }

                });
            });


            // modal 

            const modal = document.querySelector('.modal'),
                shoppingCart = document.querySelector('.header__basket__bag-icon');

            function openModal(selector) {
                selector.classList.add('show');
            }

            function closeModal(selector) {
                selector.classList.remove('show');
            }

            function calcTotal(price, selector) {
                const total = document.querySelector(selector);

                total.innerHTML = parseInt(total.innerHTML) + parseInt(price.slice(0, price.length-2));
            }

                
            const wrappElement = modal.querySelector('.modal__content__items');
            const toDelete = wrappElement.querySelector('.delete'),
                totalBlock = document.querySelector('.modal__content__total'),
                orderBtn = document.querySelector('.modal__content__btn');

            function buildListItem() {
                arrItems.forEach(({img, alt, name, price}, i) => {
                    toDelete.style.display = 'none';
                    totalBlock.style.display = 'flex';

                    orderBtn.classList.add('order');
                    orderBtn.textContent = 'Make an order';

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
                        <img src="../icons/trash.png" alt="trash" class="modal__content__item-trash">
                    `;

                    wrappElement.append(newElem);

                    calcTotal(price, '.modal__content__total span');
                });
            }

            function doIt() {
                buildListItem();

                const trashBtns = document.querySelectorAll('.modal__content__item-trash');
                
                trashBtns.forEach(item => {
                    item.addEventListener('click', (e) => {
                        deleteItem(e.target);
                        doIt();
                    });
                    
                });
            }


            function closeModalByBtn() {
                if (orderBtn.classList.contains('order')) {

                    // here must be a code related to payment process instead "return"
                    return;
                } else {
                    closeModal(modal);
                }
            }

            // delete item from cart

            function deleteItem(elem) {
                const totalPrice = document.querySelector('.modal__content__total span'),
                        items = document.querySelectorAll('.modal__content__item');

                items.forEach((item, i) => {

                    const price = item.querySelector('.modal__content__item-price');

                    if (elem.parentElement == item) {
                        arrItems.splice(i, 1);
                        quantity.innerHTML = arrItems.length;
                        totalPrice.innerHTML = 0;
                        amount.innerHTML = parseInt(amount.innerHTML) - parseInt(price.innerHTML.slice(0, price.innerHTML.length-2));
                        item.remove();
                    }
                    if (totalPrice.innerHTML == 0) {
                        toDelete.style.display = 'block';
                        totalBlock.style.display = 'none';

                        orderBtn.classList.remove('order');
                        orderBtn.textContent = 'Go to shop';
                    }
                    item.remove();
                });
            }


            shoppingCart.addEventListener('click', () => {
                openModal(modal);

                doIt();
            });

            const closeBtn = document.querySelector('.modal__content__close');

            closeBtn.addEventListener('click', () => {
                closeModal(modal);
                
                const items = document.querySelectorAll('.modal__content__item'),
                    total = document.querySelector('.modal__content__total span');

                items.forEach(item => item.remove());
                total.innerHTML = 0;
            });

            orderBtn.addEventListener('click', closeModalByBtn);

    }

    // read more in descr

    const showMoreBtn = document.querySelector('.description__content-btn'),
          textContent = document.querySelector('.description__content-text');

    showMoreBtn.addEventListener('click', () => {
        textContent.classList.toggle('more');
        
        if (textContent.classList.contains('more')) {
            showMoreBtn.textContent = 'Hide';
        } else {
            showMoreBtn.textContent = 'Read more';
            textContent.scrollTop = 0;
        }
    });



    // server connection

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


    // bg autoslider

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

    // language

    const language = document.querySelector('.footer__undercontent__lang'),
          langItem = language.querySelector('.footer__undercontent__lang-item'),
          langList = document.querySelector('.footer__undercontent__lang-list');

    language.addEventListener('mouseenter', (e) => {
        const target = e.target;
        if (target && target.className == "footer__undercontent__lang") {
            langList.classList.add('choose');
        }
    });

    language.addEventListener('mouseleave', () => {
        langList.classList.remove('choose');
    });


    langList.addEventListener('click', () => {
        langList.classList.remove('choose');
        if (langItem.classList.contains('pl')) {
            langItem.classList.remove('pl');
            langItem.classList.add('eng');
            langItem.innerText = "Change language";
            langList.innerText = "Polish";
        } else {
            langItem.classList.remove('eng');
            langItem.classList.add('pl');
            langItem.innerText = "Zmień język";
            langList.innerText = "English";
        }
    });




    







});

