import api from '../api';

export const fetchCitiesApi = async (stateCode) => {
  const response = await api.get('cities/', { params: { state: stateCode } });
  return response.data;
};
