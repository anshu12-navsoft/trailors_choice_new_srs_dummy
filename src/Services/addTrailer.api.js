import api from './api';

export const addTrailerAPI = data =>
  api.post('/trailers', data);

export const updateTrailerAPI = (id, data) =>
  api.put(`/trailers/${id}`, data);

export const deleteTrailerAPI = id =>
  api.delete(`/trailers/${id}`);

export const fetchMyTrailersAPI = () =>
  api.get('/trailers/mine');
