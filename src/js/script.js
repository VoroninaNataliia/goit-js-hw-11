
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImgs } from './get';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const msgEndText = document.querySelector('.msg-end-text');

let query = '';
let page = 1;

function galleryCreation(images) {
    const markup = images
        .map(image => {
            const {
                id,
                largeImageURL,
                webformatURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            } = image;
            return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
        })
        .join('');
    gallery.insertAdjacentHTML('beforeend', markup)
}

searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(e) {
    try {
      e.preventDefault();
      page = 1;
      query = e.target.elements.searchQuery.value.trim();
      gallery.innerHTML = '';

      if (query === '') {
        Notiflix.Notify.failure(
          'The search string cannot be empty. Please specify your search query.'
        );
        return;
      }

        const searchImgs = await getImgs(query, page)

          if (searchImgs.totalHits === 0) {
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          } else {
            galleryCreation(searchImgs.hits);
            simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            Notiflix.Notify.success(`We found ${searchImgs.totalHits} images.`);

            if (searchImgs.totalHits >= 40) {
              loadMore.classList.remove('is-hidden');
            } else {
              loadMore.classList.add('is-hidden');
            }
          }
        }
        
    catch (error) {
    console.warn(error)
    }


const onLoadMoreClick = async () => {
    try {
          page += 1;
          const data = await getImgs(query, page);

          galleryCreation(data.hits);
        
    } catch (error) {
        console.warn(error)
    }
  
};
loadMore.addEventListener('click', onLoadMoreClick);


