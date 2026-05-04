import api from '../api';

export const fetchStatesApi = async () => {
  const response = await api.get('states/', { params: { name: 'United_States' } });
  return response.data;
};
