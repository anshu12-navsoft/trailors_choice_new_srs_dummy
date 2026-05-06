import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi, saveDocumentsApi } from '../../../Services/ApiList/auth.api';

/* ------------------ THUNK ------------------ */

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      console.log('registerUser payload:', JSON.stringify(payload, null, 2));
      const res = await registerApi(userId, payload);
      console.log('registerApi raw response:', JSON.stringify(res, null, 2));
      return {
        user: res?.data?.user ?? null,
        message: res?.message ?? 'Registered successfully',
        verification_url: res?.data?.verification_url ?? res?.verification_url ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        'Registration failed'
      );
    }
  }
);

export const saveDocuments = createAsyncThunk(
  'register/saveDocuments',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await saveDocumentsApi(formData);
      console.log('[saveDocuments] response:', JSON.stringify(res.data, null, 2));
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        'Failed to save documents'
      );
    }
  }
);

/* ------------------ INITIAL STATE ------------------ */

const initialState = {
  loading: false,
  success: false,
  error: null,
  userData: null,
  token: null,
  message: null,
  verification_url: null,
};

/* ------------------ SLICE ------------------ */

const registerSlice = createSlice({
  name: 'register',
  initialState,

  reducers: {
    resetRegister: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.userData = null;
      state.token = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------- PENDING -------- */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })

      /* -------- SUCCESS -------- */
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userData = action.payload.user;
        state.message = action.payload.message;
      })

      /* -------- ERROR -------- */
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Something went wrong';
      })

      /* -------- SAVE DOCUMENTS -------- */
      .addCase(saveDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.verification_url = action.payload?.verification_url ?? null;
      })
      .addCase(saveDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

/* ------------------ EXPORTS ------------------ */

export const { resetRegister } = registerSlice.actions;
export default registerSlice.reducer;


