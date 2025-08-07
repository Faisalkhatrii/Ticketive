import api from './api';

export const authService = {
  login: (credentials) => {
    return api.post('/auth/login/', credentials);
  },

  register: (userData) => {
    return api.post('/auth/register/', userData);
  },

  logout: () => {
    return api.post('/auth/logout/');
  },

  checkAuth: () => {
    return api.get('/auth/check-auth/');
  },

  getProfile: () => {
    return api.get('/auth/profile/');
  }
};