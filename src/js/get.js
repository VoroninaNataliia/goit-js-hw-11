import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34265983-c679b67e6e799979f0bbd59de';


export async function getImgs(query, page) {
  const data = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
    return data.data;
}

console.log(getImgs)
