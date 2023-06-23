export default function getRefs() {
    return {
        header: document.querySelector('.header'),
        form: document.querySelector('.header__form'),
        infCheck: document.querySelector('[name="chBoxInfScroll"]'),
        main: document.querySelector('main'),
        input: document.querySelector('[name="searchQuery"]'),
        gallery: document.querySelector('.gallery'),
        buttonMore: document.querySelector('[name="moreButton"]'),
        endMessage: document.querySelector('.gallery__message'),
    }
}