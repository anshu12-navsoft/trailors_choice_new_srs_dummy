import api from '../api';

export const addTrailerAPI = data =>
  api.post('/trailers/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateTrailerAPI = (id, data) =>
  api.put(`/trailers/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteTrailerAPI = id =>
  api.delete(`/trailers/${id}`);

export const fetchMyTrailersAPI = ({ status = '', page = 1, limit = 10 } = {}) => {
  const params = { page, limit };
  if (status) params.trailer_status = status;
  return api.get('/trailers/my/', { params });
};

export const fetchTrailerDetailAPI = id => api.get(`/trailers/${id}/`);
