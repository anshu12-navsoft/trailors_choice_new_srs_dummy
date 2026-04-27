import api from '../api';

export const sendOtpApi = async ({ mobile, cc }) => {
  const response = await api.post('auth/user/send-otp/', { mobile, cc });
  console.log("SendOtpApi======>>>>",sendOtpApi)
  return response.data;
};

export const verifyOtpApi = async ({ mobile, otp, cc }) => {
  const response = await api.post('auth/user/verify-otp/', { mobile, otp, cc });
  return response.data;
};

export const resendOtpApi = async ({ mobile, cc }) => {
  const response = await api.post('auth/user/resend-otp/', { mobile, cc });
  return response.data;
};

export const loginApi = async (payload) => {
  const response = await api.post('auth/user/send-otp/', payload);
  return response.data;
};

export const registerApi = async (userId, payload) => {
  const isFormData = payload instanceof FormData;
  const response = await api.patch(`user/register/${userId}/`, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};





export const logoutApi = async (refresh) => {
  const response = await api.post('user/logout/', { refresh });
  return response.data;
};