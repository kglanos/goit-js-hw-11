import axios from 'axios';

const API_KEY = '20024521-fb937c8208773011b51cef6d9';
const URL = 'https://pixabay.com/api/';

async function fetchImg(searchQuery, page, perPage) {
    const response = await axios.get(
        `${URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response.data;
}
export { fetchImg };