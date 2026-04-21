import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendOtpApi, verifyOtpApi } from '../../services/auth.api';

/* ------------------ THUNKS ------------------ */

// 📤 SEND OTP
export const sendOtp = createAsyncThunk(
  'otp/sendOtp',
  async ({ phoneNumber }, { rejectWithValue }) => {
    try {
      const res = await sendOtpApi({ phoneNumber });
      // expected response: { data: { message: 'OTP sent', isNewUser: true/false } }
      return { phoneNumber, isNewUser: res.data.isNewUser };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

// ✅ VERIFY OTP
export const verifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async ({ phoneNumber, otp }, { rejectWithValue }) => {
    try {
      const res = await verifyOtpApi({ phoneNumber, otp });
      // expected response: { data: { isNewUser: true/false, token: '...' (only for existing users) } }
      return { isNewUser: res.data.isNewUser, token: res.data.token ?? null };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

/* ------------------ STATE ------------------ */

const initialState = {
  phoneNumber: null,
  isNewUser: null,
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,
};

/* ------------------ SLICE ------------------ */

const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    resetOtp: () => initialState,
    clearOtpError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------- SEND OTP -------- */
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.phoneNumber = action.payload.phoneNumber;
        state.isNewUser = action.payload.isNewUser;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- VERIFY OTP -------- */
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.isNewUser = action.payload.isNewUser;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* ------------------ EXPORTS ------------------ */

export const { resetOtp, clearOtpError } = otpSlice.actions;
export default otpSlice.reducer;


// ── API Contract ──────────────────────────────────────────────────────────────

// sendOtpApi  POST /auth/send-otp
// Request:  { "phoneNumber": "+11234567890" }
// Response: { "success": true, "data": { "message": "OTP sent", "isNewUser": true } }

// verifyOtpApi  POST /auth/verify-otp
// Request:  { "phoneNumber": "+11234567890", "otp": "123456" }
// Response (existing user): { "success": true, "data": { "isNewUser": false, "token": "jwt_token" } }
// Response (new user):      { "success": true, "data": { "isNewUser": true,  "token": null } }
