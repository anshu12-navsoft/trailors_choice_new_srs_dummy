import api from '../api';

export const fetchCategoriesAPI = () => api.get('/categories/');

export const fetchCategoryAttributesAPI = (categoryId) =>
  api.get(`/categories/${categoryId}/attributes/`);
