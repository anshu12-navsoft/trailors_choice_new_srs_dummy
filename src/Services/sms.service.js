import axios from 'axios';

const TWILIO_FUNCTION_URL =
  'https://trailorschoiceee-communication-3666.twil.io/path_1';

export const sendSMS = async (to, message) => {
  try {
    const response = await axios.post(TWILIO_FUNCTION_URL, {
      to,
      message,
    });

    return response.data;
  } catch (error) {
    console.log('SMS Service Error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
