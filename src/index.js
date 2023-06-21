import { PixabayAPI } from "./js/PixabayAPI";
import getRefs from "./js/get-refs";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const pixabay = new PixabayAPI;
const refs = getRefs();
const NUMBER_PER_PAGE = 9;  

const lightboxGallary = new SimpleLightbox(".gallery__inner a", {
    captionsData: "alt",
    captionDelay: 250,
    captionPosition: "bottom",
});

refs.form.addEventListener('submit', onSubmit);
refs.buttonMore.addEventListener('click', onClick);

function onSubmit(e) {
    e.preventDefault();
    cleanGallery();
    disableMoreBtn();
    pixabay.query = refs.input.value;
    pixabay.page = 1;
    pixabay.fetchImages(NUMBER_PER_PAGE)
        .then(data => {
            const markUp = data.hits.map(pixabay.createMarkup).join('');
            refs.gallery.insertAdjacentHTML('beforeend', markUp);
            lightboxGallary.refresh();
            if (pixabay.isNewPageExist(data.total, NUMBER_PER_PAGE)) {
                enableMoreBtn();
            };
        })
}


function onClick(e) {
    e.preventDefault();
    pixabay.page++;
    pixabay.fetchImages(NUMBER_PER_PAGE)
        .then(data => {
            const markUp = data.hits.map(pixabay.createMarkup).join("");
            refs.gallery.insertAdjacentHTML('beforeend', markUp);
            lightboxGallary.refresh();
            if (pixabay.isNewPageExist(data.total, NUMBER_PER_PAGE)) {
                enableMoreBtn();
            };
        })
}


function enableMoreBtn() {
    refs.buttonMore.classList.remove('gallery__btn-more--hidden');
}

function disableMoreBtn() {
    refs.buttonMore.classList.add('gallery__btn-more--hidden');
}

function cleanGallery() {
    refs.gallery.innerHTML = '';
}


