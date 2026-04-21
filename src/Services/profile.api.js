import api from './api';

// returns profile + rentalHistory + wishlist in one response
export const fetchProfileAPI = () =>
  api.get('/users/profile');

// multipart/form-data — handles text fields + optional avatar in one call
export const updateProfileAPI = formData =>
  api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const toggleWishlistAPI = trailerId =>
  api.post(`/users/wishlist/${trailerId}`);
