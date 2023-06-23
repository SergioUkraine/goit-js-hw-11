import { PixabayAPI } from "./js/PixabayAPI";
import getRefs from "./js/get-refs";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const refs = getRefs();

const params = {
    numberPerPage: 40,
};
const pixabay = new PixabayAPI(params);

const lightboxGallary = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
    captionPosition: "bottom",
});
Notify.init({
    width: '300px',
    position: 'right-top',
    distance: '5px',
    useIcon: true,
});

refs.form.addEventListener('submit', onSubmit);
refs.buttonMore.addEventListener('click', onClick);
refs.infCheck.addEventListener('change', onCheckBoxChange);

function onSubmit(e) {
    e.preventDefault();
    cleanGallery();
    preLaunchPrep();

    if (refs.input.value.trim() === '') {
        Notify.failure('Search query cannot be empty');
        return;
    }

    pixabay.query = refs.input.value;
    pixabay.page = 1;

    getImages();
}


function onClick(e) {
    e.preventDefault();
    pixabay.page++;
    getImages();
}


function onCheckBoxChange() {
    
    if (refs.infCheck.checked) {
        setAltColorTheme();
        addScrollListener();
        hideMoreBtn();
        return;
    }
    cancelAltColorTheme();
    removeScrollListener();
    if (pixabay.isNewPageExist()) {
        
        showMoreBtn();
    }
}


async function getImages() {
    try {
        showLoader();
        const data = await pixabay.fetchImages();
        if (pixabay.page === 1) {
            showCountResults(pixabay.totalHits);
        }

        const markUp = data.hits.map(pixabay.createMarkup).join('');
        refs.gallery.insertAdjacentHTML('beforeend', markUp);
        lightboxGallary.refresh();

        if (refs.infCheck.checked && pixabay.isNewPageExist()) {
            removeScrollListener();
            addScrollListener();
        }

        if (refs.infCheck.checked && !pixabay.isNewPageExist()) {
            removeScrollListener();
        }

        if (!refs.infCheck.checked && pixabay.isNewPageExist()) {
            if (pixabay.page > 1) smoothScroll();
            if (refs.buttonMore.classList.contains('gallery__btn-more--hidden')) {
                showMoreBtn();
            }
        }

        if (!pixabay.isNewPageExist() && pixabay.totalHits>0) {
            showEndMessage();
            hideMoreBtn();
        }
        hideLoader();

    } catch (error) {
        handleError(error)
    }
}

function smoothScroll() {
    const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
    refs.main.scrollBy({
        top: cardHeight * 2 - 30,
        behavior: "smooth",
    })
}

function cleanGallery() {
    refs.gallery.innerHTML = '';
}

function showMoreBtn() {
    refs.buttonMore.classList.remove('gallery__btn-more--hidden');
}

function hideMoreBtn() {
    refs.buttonMore.classList.add('gallery__btn-more--hidden');
}

function showEndMessage() {
    refs.endMessage.classList.remove('gallery__message--hidden');
}

function hideEndMessage() {
    refs.endMessage.classList.add('gallery__message--hidden');
}

function showLoader() {
    refs.loader.classList.remove('loader--hidden');
}

function hideLoader() {
    refs.loader.classList.add('loader--hidden');
}


function showCountResults(count) {
    if (count > 0) {
        Notify.success(`Total number of results:  ${count}`);
        return;
    }
    else if (count === 0){
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

function handleScroll(e) {
    const scrollHeight = refs.main.scrollHeight;
    const scrollTop = refs.main.scrollTop;
    const clientHeight = refs.main.clientHeight;
    const calculationError = 5;
    
    if (scrollTop + clientHeight + calculationError >= scrollHeight) {
        e.preventDefault();
        pixabay.page++;
        getImages();
    }
}

function addScrollListener() {
    refs.main.addEventListener('scroll', handleScroll);
}

function removeScrollListener() {
    refs.main.removeEventListener('scroll', handleScroll);
}

function setAltColorTheme(){
    refs.header.classList.add('header--js');
    refs.gallery.classList.add('gallery--js');
}

function cancelAltColorTheme(){
    refs.header.classList.remove('header--js');
    refs.gallery.classList.remove('gallery--js');
}

function preLaunchPrep() {
    if (!refs.endMessage.classList.contains('gallery__message--hidden')) {
        hideEndMessage();
    }
    if (!refs.buttonMore.classList.contains('gallery__btn-more--hidden')) {
        hideMoreBtn();
    }
}