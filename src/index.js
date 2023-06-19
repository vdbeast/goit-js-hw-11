import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

const perPage = 40;
let currentPage = 1;
let currentQuery = '';

// Form

async function handlerSearch(event) {
    event.preventDefault();
    gallery.innerHTML = '';

    const searchQuery = formEl.firstElementChild.value.trim();

    if (searchQuery === '') {
        return
    }

    currentQuery = searchQuery;
    currentPage = 1;

    getImages(currentPage, currentQuery);
}


formEl.addEventListener('submit', handlerSearch)


//Axios

async function getImages(page, query) {
    try {
        const responce = await axios
            .get('https://pixabay.com/api/', {
                params: {
                    key: '37409826-b0d240e7599af91354a714518',
                    q: query,
                    image_type: 'photo',
                    orientation: 'horizontal',
                    safesearch: true,
                    per_page: perPage,
                    page: page
                }
            })
        const data = responce.data;

        if (data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            loadBtn.style.display = 'none';
        } else {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            appendImages(data.hits);
            loadBtn.style.display = 'block';
        }

        if (data.totalHits <= page * perPage) {
            loadBtn.style.display = 'none';
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
    }
    catch(err) {
        console.error('err')
    }
}


// Load more BTN

loadBtn.addEventListener('click', () => {
    currentPage++;
    getImages(currentPage, currentQuery);
})

// Map arr

function appendImages(images) {
    const cards = images.map((image) => createImageCard(image));
    gallery.append(...cards);
    refreshSimpleLightbox();
}
// Create imageCard

function createImageCard(image) {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const link = document.createElement('a');
    link.classList.add('photo-link');
    link.href = image.largeImageURL;
    link.setAttribute('data-lightbox', 'gallery')

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';
    img.style.width = '100%';
    img.style.height = '200px';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments</b> ${image.comments}`;
    
    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads</b> ${image.downloads}`;

    info.append(likes, views, comments, downloads);
    link.append(img); 
    card.append(link, info);
 
    return card;
}

//SimpleLightBox

function refreshSimpleLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  lightbox.refresh();
}
