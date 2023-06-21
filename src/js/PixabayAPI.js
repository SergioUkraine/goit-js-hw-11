export { PixabayAPI };

class PixabayAPI {

    static API_URL = 'https://pixabay.com/api/';
    static API_KEY = '37350877-77f32dcceabb953f1945ab0af';

    constructor(query, page) {
        this._query = query;
        this._page = page;
    }
    
    get query() {
        return this._query;
    }

    set query(value) {
        this._query = value;
    }
    
    get page() {
        return this._page;
    }

    set page(value) {
        this._page = value;
    }


    fetchImages(perPage) {
        const { API_URL, API_KEY } = PixabayAPI;
        const parameters = `&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${perPage}`;
        const url = `${API_URL}?key=${API_KEY}`+parameters;
        return fetch(url)
            .then(r => r.json())
    }

    createMarkup(obj) {
        console.log(obj);
        return `
            <div class="gallery__item">            
                <a class="gallery__link" href="${obj.largeImageURL}">
                    <img 
                        class="gallery__image" 
                        src="${obj.largeImageURL}"
                        alt="${obj.tags}"
                        title="${obj.tags}"
                        loading="lazy"
                    />
                    <div class="gallery__info">
                        <p class="gallery__info-item">
                        <b class="gallery__title">Likes</b>
                        ${obj.likes}
                        </p>
                        <p class="gallery__info-item">
                        <b class="gallery__title">Views</b>
                        ${obj.views}
                        </p>
                        <p class="gallery__info-item">
                        <b class="gallery__title">Comments</b>
                        ${obj.comments}
                        </p>
                        <p class="gallery__info-item">
                        <b class="gallery__title">Downloads</b>
                        ${obj.downloads}
                        </p>
                    </div>
                </a>
            </div>`
    }

    isNewPageExist(totalNumber, numberPerPage) {
        return (totalNumber - (this.page * numberPerPage)) > 0;
    }
}