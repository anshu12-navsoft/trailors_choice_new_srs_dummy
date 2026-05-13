import api from '../api'; 

export const fetchNotificationsAPI = () => api.get('/notifications');

export const markNotificationReadAPI = notificationId =>
  api.patch(`/notifications/${notificationId}/read`);

export const notificationActionAPI = (notificationId, action) =>
  api.post(`/notifications/${notificationId}/action`, {
    action,
  });
