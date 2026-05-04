import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStatesApi } from '../../../Services/ApiList/state.api';

/* ------------------ THUNK ------------------ */

export const fetchStates = createAsyncThunk(
  'state/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchStatesApi();
      return res?.data ?? res ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        'Failed to fetch states'
      );
    }
  }
);

/* ------------------ INITIAL STATE ------------------ */

const initialState = {
  states: [],
  loading: false,
  error: null,
};

/* ------------------ SLICE ------------------ */

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    resetStates: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

/* ------------------ EXPORTS ------------------ */

export const { resetStates } = stateSlice.actions;
export default stateSlice.reducer;

// API Contract
// GET /states/?name=United States
// Response: { "data": [{ "id": 1, "name": "Alabama" }, ...] }
