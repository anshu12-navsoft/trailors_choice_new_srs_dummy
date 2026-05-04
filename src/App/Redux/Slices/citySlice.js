import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCitiesApi } from '../../../Services/ApiList/city.api';

export const fetchCities = createAsyncThunk(
  'city/fetchCities',
  async (stateCode, { rejectWithValue }) => {
    console.log('StateCode=====>>>>', stateCode);
    try {
      const res = await fetchCitiesApi(stateCode);
      return res?.data ?? res ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data ||
          error.message ||
          'Failed to fetch cities',
      );
    }
  },
);

const initialState = {
  cities: [],
  loading: false,
  error: null,
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    resetCities: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCities.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetCities } = citySlice.actions;
export default citySlice.reducer;

// API Contract
// GET /cities/?state=US-NY
// Response: { "data": [{ "id": 1, "name": "New York City" }, ...] }
