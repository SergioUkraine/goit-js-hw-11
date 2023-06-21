export default function getRefs() {
    return {
        form: document.querySelector('.header__form'),
        input: document.querySelector('[name="searchQuery"]'),
        buttonMore: document.querySelector('[name="moreButton"]'),
        gallery: document.querySelector('.gallery__inner'),
    }
}