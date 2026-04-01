import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://api.yourdomain.com', // 🔁 change later
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* -------- Request Interceptor -------- */
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('➡️ API REQUEST:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => Promise.reject(error)
);

/* -------- Response Interceptor -------- */
api.interceptors.response.use(
  response => {
    console.log('✅ API RESPONSE:', response.config.url);
    return response;
  },
  error => {
    console.log('❌ API ERROR:', error?.response?.data || error.message);

    if (error.response?.status === 401) {
      // 🔐 token expired → logout later
    }

    return Promise.reject(error);
  }
);

export default api;
