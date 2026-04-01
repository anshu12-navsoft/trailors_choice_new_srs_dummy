import api from './api';

export const loginApi = data => {
  return api.post('/login', data);
};

export const registerApi = data => {
  return api.post('/register', data);
};

export const profileApi = () => {
  return api.get('/profile');
};
