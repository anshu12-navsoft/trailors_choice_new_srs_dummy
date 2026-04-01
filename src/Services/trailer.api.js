import api from './api';

export const searchTrailersAPI = (params) =>
  api.get('/trailers/search', { params });

export const fetchFeaturedListingsAPI = () =>
  api.get('/trailers/featured');

export const fetchTrailerByIdAPI = (id) =>
  api.get(`/trailers/${id}`);

export const checkAvailabilityAPI = (trailerId, startDate, endDate) =>
  api.get(`/trailers/${trailerId}/availability`, { params: { startDate, endDate } });
