import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImg } from './gallery-api';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.load-more');

let searchQuery = ' ';
let page = 1;
let perPage = 40;

loader.style.display = 'none';

form.addEventListener('submit', onFormSearch);
loader.addEventListener('click', onLoadMore);

function onFormSearch(picture) {
    picture.preventDefault();
    page = 1;
    gallery.innerHTML = '';
    searchQuery = picture.target.searchQuery.value.trim();
    if(searchQuery === '') {
        Notiflix.Notify.failure('Error! The search string must not be empty.');
        loader.style.display = 'block';
        return;
    }

    fetchImg(searchQuery, page, perPage)
    .then(data => {
        if(data.totalHits === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
        } else {
            createMarkup(data.hits);
            new SimpleLightbox('.gallery a').refresh();
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
    })
    .catch(error => {
        Notiflix.Notify.failure(
            'Oops! Something went wrong! Try reloading the page!'
        );
        console.error(error);
    })
    .finally(() => {
        form.reset();
    });
}

function createMarkup(img) {
    const markup = img
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
            return `<div class="photo-card" id="${id}">
        <a class="gallery-item" href="${largeImageURL}">
        <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
        <p class="info-item">
            <b>Likes</b>
            ${likes}
        </p>
        <p class="info-item">
            <b>Views</b>
            ${views}
        </p>
        <p class="info-item">
            <b>Comments</b>
            ${comments}
        </p>
        <p class="info-item">
            <b>Downloads</b>
            ${downloads}
        </p>
        </div>
        </div>`;
    })
    .join(' ');
    gallery.insertAdjacentHTML('beforeend', markup);
    loader.style.display = 'block';
}

function onLoadMore() {
    page += 1;

    fetchImg(searchQuery, page, perPage)
    .then(result => {
        const endPage = Math.ceil(result.totalHits / perPage);
        if(page <= endPage) {
            createMarkup(result.hits);
            new SimpleLightbox('.gallery a').refresh();
        } else {
            Notiflix.Notify.failure(
                "We're sorry, but you've reached the end of search results."
                );
                loader.style.display = 'none';
        }
    })
    .catch(error => console.log(error));
}

function smoothScroll() {
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}

const scrolling = document.querySelector('.scrolling');
scrolling.addEventListener('click', topFunction)

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if(document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        scrolling.style.display = 'block';
    } else {
        scrolling.style.display = 'none';
    }
}

function topFunction() {
    document.documentElement.scrollTop = 0;
}