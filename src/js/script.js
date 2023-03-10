
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

  await getImgs(query, page)
      .then(data => {
        
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
         galleryCreation(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
          Notiflix.Notify.success(`We found ${data.totalHits} images.`);

             if (data.totalHits > 40) {
               loadMore.classList.remove('is-hidden');
             } else {
               loadMore.classList.add('is-hidden');
             }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
        searchForm.reset();   
    });     
    
}

const onLoadMoreClick = async () => {
    page += 1;
    const data = await getImgs(query, page);
 
    galleryCreation(data.hits);

};
loadMore.addEventListener('click', onLoadMoreClick);


