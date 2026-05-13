import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  searchTrailersAPI,
  fetchFiltersAPI,
} from '../../../Services/trailerSearch.api';

/* ── Thunks ─────────────────────────────────────────────────── */

// 🔍 SEARCH
export const searchTrailers = createAsyncThunk(
  'trailerSearch/search',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await searchTrailersAPI(payload);
      return { data: res.data, payload };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Search failed'
      );
    }
  }
);

// 🎛 FETCH FILTER OPTIONS
export const fetchFilters = createAsyncThunk(
  'trailerSearch/fetchFilters',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchFiltersAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load filters'
      );
    }
  }
);

/* ── Initial State ───────────────────────────────────────────── */

const initialState = {
  results: [],
  loading: false,
  error: null,

  // 🔥 Selected filters (user applied)
  selectedFilters: {
    category: null,
    capacity: null,
    priceRange: null,
    rating: null,
    instantBook: false,
  },

  // 🔥 Filter options from API
  filterOptions: {
    categories: [],
    capacities: [],
    priceRange: { min: 0, max: 0 },
    ratings: [],
  },

  filtersLoading: false,

  lastSearchPayload: null,
};

/* ── Slice ─────────────────────────────────────────────────── */

const trailerSearchSlice = createSlice({
  name: 'trailerSearch',
  initialState,
  reducers: {

    /* -------- SELECT FILTERS -------- */
    setFilters: (state, action) => {
      state.selectedFilters = {
        ...state.selectedFilters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.selectedFilters = initialState.selectedFilters;
    },

    clearResults: (state) => {
      state.results = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------- SEARCH -------- */
      .addCase(searchTrailers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(searchTrailers.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data;
        state.lastSearchPayload = action.payload.payload;
      })

      .addCase(searchTrailers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- FETCH FILTERS -------- */
      .addCase(fetchFilters.pending, (state) => {
        state.filtersLoading = true;
      })

      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.filtersLoading = false;
        state.filterOptions = action.payload;
      })

      .addCase(fetchFilters.rejected, (state, action) => {
        state.filtersLoading = false;
        state.error = action.payload;
      });
  },
});

/* ── Exports ─────────────────────────────────────────────── */

export const {
  setFilters,
  resetFilters,
  clearResults,
} = trailerSearchSlice.actions;

export default trailerSearchSlice.reducer;


// POST /trailers/search

// {
//   location: { name, lat, lng },
//   startDate: "2026-03-18",
//   endDate: "2026-03-28",
//   startTime: "10:00 AM",
//   endTime: "10:00 AM",

//   filters: {
//     category: "flatbed",
//     capacity: "2000",
//     priceRange: { min: 50, max: 150 },
//     rating: 4.5,
//     instantBook: true
//   }
// }


// GET /trailers/filters

// RESPONSE
// {
//   success: true,
//   data: {
//     categories: [
//       { label: "Utility", value: "utility" },
//       { label: "Car Hauler", value: "car_hauler" }
//     ],

//     capacities: [
//       { label: "1000 lbs", value: "1000" },
//       { label: "2000 lbs", value: "2000" }
//     ],

//     priceRange: {
//       min: 0,
//       max: 500
//     },

//     ratings: [3, 4, 4.5, 5]
//   }
// }