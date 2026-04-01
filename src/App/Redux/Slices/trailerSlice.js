import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchTrailersAPI, fetchFeaturedListingsAPI } from '../../../Services/trailer.api';

export const searchTrailers = createAsyncThunk(
  'trailer/search',
  async (params, { rejectWithValue }) => {
    try {
      const res = await searchTrailersAPI(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchFeaturedListings = createAsyncThunk(
  'trailer/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchFeaturedListingsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load listings');
    }
  }
);

const trailerSlice = createSlice({
  name: 'trailer',
  initialState: {
    searchQuery: '',
    searchLocation: '',
    searchRadius: 25,
    filters: {
      category: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      instantBook: false,
    },
    sortBy: 'relevance',
    listings: [],
    featuredListings: [],
    selectedTrailer: null,
    favorites: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    setSearchLocation: (state, action) => { state.searchLocation = action.payload; },
    setSearchRadius: (state, action) => { state.searchRadius = action.payload; },
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters: (state) => {
      state.filters = { category: null, minPrice: null, maxPrice: null, minRating: null, instantBook: false };
    },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setSelectedTrailer: (state, action) => { state.selectedTrailer = action.payload; },
    setListings: (state, action) => { state.listings = action.payload; },
    setFeaturedListings: (state, action) => { state.featuredListings = action.payload; },
    toggleFavorite: (state, action) => {
      const id = action.payload;
      const idx = state.favorites.indexOf(id);
      if (idx >= 0) {
        state.favorites.splice(idx, 1);
      } else {
        state.favorites.push(id);
      }
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTrailers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchTrailers.fulfilled, (state, action) => { state.loading = false; state.listings = action.payload; })
      .addCase(searchTrailers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFeaturedListings.pending, (state) => { state.loading = true; })
      .addCase(fetchFeaturedListings.fulfilled, (state, action) => { state.loading = false; state.featuredListings = action.payload; })
      .addCase(fetchFeaturedListings.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const {
  setSearchQuery, setSearchLocation, setSearchRadius,
  setFilters, resetFilters, setSortBy, setSelectedTrailer,
  setListings, setFeaturedListings, toggleFavorite,
  setLoading, setError,
} = trailerSlice.actions;

export default trailerSlice.reducer;
