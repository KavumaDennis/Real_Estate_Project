import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const blogService = {
    getPosts: (page = 1) => axios.get(`${API_URL}/posts?page=${page}`),
    getPost: (slug) => axios.get(`${API_URL}/posts/${slug}`),
    getCategories: () => axios.get(`${API_URL}/post-categories`),
};

export default blogService;
