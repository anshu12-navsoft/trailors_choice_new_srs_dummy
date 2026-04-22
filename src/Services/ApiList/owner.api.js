import api from './api';

export const fetchOwnerDashboardAPI = () =>
  api.get('/owner/dashboard');

export const fetchBookingRequestsAPI = () =>
  api.get('/owner/booking-requests');

export const approveBookingRequestAPI = (requestId) =>
  api.post(`/owner/booking-requests/${requestId}/approve`);

export const rejectBookingRequestAPI = (requestId, reason) =>
  api.post(`/owner/booking-requests/${requestId}/reject`, { reason });

export const fetchOwnerBookingsAPI = () =>
  api.get('/owner/bookings');

export const confirmReturnAPI = (bookingId, data) =>
  api.post(`/owner/bookings/${bookingId}/confirm-return`, data);

export const fetchAvailabilityAPI = (trailerId) =>
  api.get(`/owner/trailers/${trailerId}/availability`);

export const updateAvailabilityAPI = (trailerId, data) =>
  api.put(`/owner/trailers/${trailerId}/availability`, data);

export const fetchEarningsAPI = () =>
  api.get('/owner/earnings');

export const fetchPayoutSettingsAPI = () =>
  api.get('/owner/payout-settings');

export const updatePayoutSettingsAPI = (data) =>
  api.put('/owner/payout-settings', data);

export const fetchOwnerReviewsAPI = () =>
  api.get('/owner/reviews');

export const submitOwnerVerificationAPI = (data) =>
  api.post('/owner/verification', data);
