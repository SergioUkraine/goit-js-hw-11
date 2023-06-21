import { PixabayAPI } from "./js/PixabayAPI";
import getRefs from "./js/get-refs";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';


const refs = getRefs();
const params = {
    page: 1,
    numberPerPage: 9,
}   

const pixabay = new PixabayAPI(params);
const lightboxGallary = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
    captionPosition: "bottom",
});

refs.form.addEventListener('submit', onSubmit);
refs.buttonMore.addEventListener('click', onClick);

function onSubmit(e) {
    e.preventDefault();
    cleanGallery();
    enableMoreBtn();
    pixabay.query = refs.input.value;
    pixabay.page = 1;
    getImages();
}


function onClick(e) {
    e.preventDefault();
    pixabay.page++;
    getImages();
}

async function getImages() {
    try {
        const data = await pixabay.fetchImages();
        if (pixabay.page === 1 ) {
            showCountResults(data);
        }
        const markUp = data.hits.map(pixabay.createMarkup).join('');
        refs.gallery.insertAdjacentHTML('beforeend', markUp);
        lightboxGallary.refresh(); 
        if (!pixabay.isNewPageExist(data.total)) {
            disableMoreBtn();
            refs.gallery.insertAdjacentHTML('afterend', "<div class='gallery__message'> We're sorry, but you've reached the end of search results.</div>")
        }
    } catch (error) {
        handleError(error)
    }
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

function showCountResults(obj) {
    if (obj.totalHits > 0) {
        console.log(obj.totalHits)
        Notify.success(`Total number of results:  ${obj.totalHits}`);
        return;
    }
    else if (obj.totalHits === 0){
        Notify.failure('Sorry, no results were found');
    }
}

function handleError(err) {
    Report.failure(
        'Oops!',
        'Something went wrong! Try reloading the page!',
        'Reload!',
        function () {
            window.location.reload();
        }
    );
    console.log('Error caught: ' + err);
}


