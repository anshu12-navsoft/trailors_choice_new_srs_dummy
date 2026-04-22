import api from '../api';

export const loginApi = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const registerApi = async (formData) => {
  const response = await api.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};





export const logoutApi = async () => {
  // optional (if backend logout exists)
  return true;
};