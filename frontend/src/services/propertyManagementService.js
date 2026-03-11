import api from './api';

const propertyManagementService = {
    getMyRequests: (params) => api.get('/property-management-requests', { params }),
    createRequest: (data) => api.post('/property-management-requests', data),
    cancelRequest: (id) => api.patch(`/property-management-requests/${id}/cancel`),
    getAdminRequests: (params) => api.get('/admin/property-management-requests', { params }),
    updateStatus: (id, data) => api.patch(`/admin/property-management-requests/${id}/status`, data),
};

export default propertyManagementService;

