import api from './api';

const agentService = {
    getAll: () => api.get('/agents'),
    getById: (id) => api.get(`/agents/${id}`),
    contact: (id, data) => api.post(`/agents/${id}/contact`, data),
};

export default agentService;
