import api from '../api';

export const fetchCategoriesAPI = () => api.get('/categories/');
