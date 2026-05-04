import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtpApi, verifyOtpApi, resendOtpApi } from '../../../Services/ApiList/auth.api';

/* ------------------ THUNKS ------------------ */

// 📤 SEND OTP
export const sendOtp = createAsyncThunk(
  'otp/sendOtp',
  async ({ mobile, cc }, { rejectWithValue }) => {
    console.log('Country Code===>>', cc);
    try {
      const res = await sendOtpApi({ mobile, cc });
      console.log('Response for making login while sending otp===>>', res);
      return { mobile, cc, isNewUser: res?.data?.isNewUser ?? false };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  },
);

// ✅ VERIFY OTP
export const verifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async ({ mobile, otp, cc }, { rejectWithValue }) => {
    try {
      const res = await verifyOtpApi({ mobile, otp, cc });
      console.log('verifyOtpApi raw response:', JSON.stringify(res, null, 2));
      const token        = res?.access  ?? null;
      const refreshToken = res?.refresh ?? null;
      const userId       = res?.user_id ?? null;
      const isNewUser    = !(res?.profile_status?.basic_info ?? true);
      const hasDocuments = res?.profile_status?.has_documents ?? true;
      await Promise.all([
        token        ? AsyncStorage.setItem('ACCESS_TOKEN',  token)        : null,
        refreshToken ? AsyncStorage.setItem('REFRESH_TOKEN', refreshToken) : null,
      ].filter(Boolean));
      console.log('Stored → access:', token, '| refresh:', refreshToken, '| userId:', userId, '| hasDocuments:', hasDocuments);
      return { isNewUser, token, refreshToken, userId, hasDocuments };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  },
);

// 🔁 RESEND OTP
export const resendOtp = createAsyncThunk(
  'otp/resendOtp',
  async ({ mobile, cc }, { rejectWithValue }) => {
    try {
      const res = await resendOtpApi({ mobile, cc });
      console.log('resendOtpApi response:', JSON.stringify(res, null, 2));
      return { mobile, cc };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  },
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
    clearOtpError: state => {
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder

      /* -------- SEND OTP -------- */
      .addCase(sendOtp.pending, state => {
        state.loading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.phoneNumber = `${action.payload.cc}${action.payload.mobile}`;
        state.isNewUser = action.payload.isNewUser;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- VERIFY OTP -------- */
      .addCase(verifyOtp.pending, state => {
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
      })

      /* -------- RESEND OTP -------- */
      .addCase(resendOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, state => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(resendOtp.rejected, (state, action) => {
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
