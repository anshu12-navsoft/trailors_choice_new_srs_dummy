import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let _onUnauthorized = null;
export const setUnauthorizedHandler = (cb) => { _onUnauthorized = cb; };

const api = axios.create({
  baseURL: 'http://44.212.136.38:4290/api/v1/', // 🔁 change later
  //  baseURL: 'http://192.168.0.55:8000/api/v1', // localhost
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* -------- Request Interceptor -------- */
api.interceptors.request.use(
  async config => {
    const [token, language] = await Promise.all([
      AsyncStorage.getItem('ACCESS_TOKEN'),
      AsyncStorage.getItem('APP_LANGUAGE'),
    ]);

    const isPublicEndpoint = config.url?.includes('auth/user/send-otp') || config.url?.includes('auth/user/verify-otp');
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // tells the backend which language to use for translatable fields
    config.headers['Accept-Language'] = language ?? 'en';

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
  async error => {
    console.log('❌ API ERROR:', error?.response?.data || error.message);

    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['ACCESS_TOKEN', 'REFRESH_TOKEN']);
      if (_onUnauthorized) _onUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;
