export default function getRefs() {
    return {
        header: document.querySelector('.header'),
        form: document.querySelector('.header__form'),
        input: document.querySelector('[name="searchQuery"]'),
        buttonMore: document.querySelector('[name="moreButton"]'),
        gallery: document.querySelector('.gallery'),
    }
}