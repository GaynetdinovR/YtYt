'use strict'


if (window.innerWidth < 1025) {
    let btn = document.querySelector('.header__login-btn').cloneNode(true);

    document.querySelector('.header__nav').append(btn);

    document.querySelector('.header__nav').style.display = 'none'
}

document.querySelector('#close').addEventListener('click', () => {
    document.querySelector('.header__nav').style.display = 'none'
})

document.querySelector('#phone-menu-btn').addEventListener('click', () => {
    document.querySelector('.header__nav').style.display = 'flex'
})