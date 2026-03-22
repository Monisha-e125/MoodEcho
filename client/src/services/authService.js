import api from '../api/axios';

const authService = {
  register: (data) =>
    api.post('/auth/register', {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password
    }),

  login: (data) =>
    api.post('/auth/login', {
      email: data.email.trim().toLowerCase(),
      password: data.password
    }),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data) => api.put('/auth/profile', data),

  deleteAccount: () => api.delete('/auth/account'),

  exportData: () => api.get('/auth/export')
};

export default authService;