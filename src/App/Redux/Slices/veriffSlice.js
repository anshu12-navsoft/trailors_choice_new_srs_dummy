import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { veriffWebhookApi } from '../../../Services/ApiList/auth.api';

export const triggerVeriffWebhook = createAsyncThunk(
  'veriff/triggerWebhook',
  async (_, { getState, rejectWithValue }) => {
    try {
      const verification = getState().register.verification;
      const res = await veriffWebhookApi(verification);
      console.log('[veriffWebhook] response:', JSON.stringify(res, null, 2));
      return res;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        'Veriff webhook failed'
      );
    }
  }
);

const veriffSlice = createSlice({
  name: 'veriff',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetVeriff: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(triggerVeriffWebhook.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(triggerVeriffWebhook.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(triggerVeriffWebhook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetVeriff } = veriffSlice.actions;
export default veriffSlice.reducer;