import api from './api';

const blogService = {
    getPosts: (page = 1) => api.get(`/posts?page=${page}`),
    getPost: (slug) => api.get(`/posts/${slug}`),
    getCategories: () => api.get('/post-categories'),
    getSaved: () => api.get('/saved-posts'),
    toggleSaved: (id) => api.post(`/posts/${id}/save`),
};

export default blogService;
