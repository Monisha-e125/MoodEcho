import api from '../api/axios';

const wellnessService = {
  getExercises: (type) =>
    api.get('/wellness/exercises', { params: type ? { type } : {} }),

  logActivity: (data) => api.post('/wellness/log', data),

  getHistory: () => api.get('/wellness/history'),

  getStats: () => api.get('/wellness/stats')
};

export default wellnessService;