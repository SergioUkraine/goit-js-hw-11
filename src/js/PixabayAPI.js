    export { PixabayAPI };

    import axios from 'axios';
    import { API_URL, API_KEY } from './config';

    class PixabayAPI {

        constructor({ query, page, numberPerPage }) {
            this._query = query;
            this._page = page;
            this._numberPerPage = numberPerPage;
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
        
        get numberPerPage() {
            return this._numberPerPage;
        }

        set numberPerPage(value) {
            this._numberPerPage = value;
        }


        async fetchImages() {
            const parameters = `&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this._numberPerPage}`;
            const url = `${API_URL}?key=${API_KEY}` + parameters;
            try {
                const response = await axios.get(url);
                return response.data;
            } catch (error) {
                console.log(error);
                return error;
            }
        }

        createMarkup(obj) { 
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

        isNewPageExist(totalNumber) {
            return (totalNumber - (this.page * this._numberPerPage)) > 0;
        }
    }