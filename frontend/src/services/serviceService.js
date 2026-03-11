import api from './api';

const serviceService = {
    getAll: () => api.get('/services'),
    getById: (id) => api.get(`/services/${id}`),
    requireService: (id, payload) => api.post(`/services/${id}/requirements`, payload),
    getAdminRequirements: (params) => api.get('/admin/service-requirements', { params }),
    updateAdminRequirement: (id, payload) => api.patch(`/admin/service-requirements/${id}`, payload),
};

export default serviceService;
