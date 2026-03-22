import api from '../api/axios';

const moodService = {
  create: (data) => api.post('/mood', data),

  getHistory: (params = {}) =>
    api.get('/mood', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        days: params.days || 30
      }
    }),

  getById: (id) => api.get(`/mood/${id}`),

  getToday: () => api.get('/mood/today'),

  delete: (id) => api.delete(`/mood/${id}`)
};

export default moodService;