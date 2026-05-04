import api from '../api';

export const fetchWishlistAPI = (page = 1, limit = 10) =>
  api.get('/users/wishlist/', { params: { page, limit } });

// POST toggles: responds with { saved: true } when added, { saved: false } when removed
export const removeFromWishlistAPI = trailerId =>
  api.post(`/users/wishlist/${trailerId}`);
