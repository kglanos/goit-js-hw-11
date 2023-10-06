import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImg } from './gallery-api';

const search = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('load-more');

let searchQuery = ' ';
let page = 1;
let perPage = 40;

