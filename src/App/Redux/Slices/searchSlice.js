import { createSlice } from '@reduxjs/toolkit';

/* ── Initial State ─────────────────────────────────────────────────────── */

const initialState = {
  location: null,        // { name, lat, lng, address }
  startDate: null,       // "YYYY-MM-DD"
  endDate: null,         // "YYYY-MM-DD"
  startTime: null,       // "10:00 AM"
  endTime: null,         // "10:00 AM"
};

/* ── Slice ─────────────────────────────────────────────────────────────── */

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },

    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },

    setTimeRange: (state, action) => {
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
    },

    resetSearch: () => initialState,
  },
});

export const {
  setLocation,
  setDateRange,
  setTimeRange,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;