import api from './api';

export const createBookingAPI = (data) =>
  api.post('/bookings', data);

export const fetchMyBookingsAPI = () =>
  api.get('/bookings/my');

export const fetchBookingByIdAPI = (id) =>
  api.get(`/bookings/${id}`);

export const cancelBookingAPI = (bookingId) =>
  api.post(`/bookings/${bookingId}/cancel`);

export const modifyBookingAPI = ({ id, ...data }) =>
  api.put(`/bookings/${id}`, data);
