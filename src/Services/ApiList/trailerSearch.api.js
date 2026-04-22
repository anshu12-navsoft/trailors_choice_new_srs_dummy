import api from '../api';

export const searchTrailersAPI = payload =>
  api.post('/trailers/search', payload);

export const fetchFiltersAPI = () => api.get('/trailers/filters');
