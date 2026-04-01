import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi } from '../../../Services/auth.api';

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  userData: null,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegister: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRegister } = registerSlice.actions;
export default registerSlice.reducer;
