import api from './api';

const propertyService = {
    getAll: (params) => api.get('/properties', { params }),
    getFeatured: () => api.get('/properties/featured'),
    getBySlug: (slug) => api.get(`/properties/${slug}`),
    getMyProperties: () => api.get('/properties/mine'),
    getSaved: () => api.get('/saved-properties'),
    toggleSaved: (id) => api.post(`/properties/${id}/save`),
    create: (data) => api.post('/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.post(`/properties/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/properties/${id}`),
    toggleFeatured: (id) => api.post(`/admin/properties/${id}/toggle-featured`),
};

export default propertyService;
