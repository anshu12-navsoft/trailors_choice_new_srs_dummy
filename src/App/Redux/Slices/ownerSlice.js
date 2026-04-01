import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchBookingRequestsAPI,
  approveBookingRequestAPI,
  rejectBookingRequestAPI,
  fetchOwnerBookingsAPI,
  fetchEarningsAPI,
} from '../../../Services/owner.api';

export const fetchBookingRequests = createAsyncThunk(
  'owner/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchBookingRequestsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load requests');
    }
  }
);

export const approveRequest = createAsyncThunk(
  'owner/approveRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await approveBookingRequestAPI(requestId);
      return { requestId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Approval failed');
    }
  }
);

export const rejectRequest = createAsyncThunk(
  'owner/rejectRequest',
  async ({ requestId, reason }, { rejectWithValue }) => {
    try {
      const res = await rejectBookingRequestAPI(requestId, reason);
      return { requestId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Rejection failed');
    }
  }
);

export const fetchOwnerBookings = createAsyncThunk(
  'owner/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchOwnerBookingsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load bookings');
    }
  }
);

export const fetchEarnings = createAsyncThunk(
  'owner/fetchEarnings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchEarningsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load earnings');
    }
  }
);

const ownerSlice = createSlice({
  name: 'owner',
  initialState: {
    bookingRequests: [],
    bookings: [],
    earnings: null,
    verificationStatus: 'not_submitted', // not_submitted | pending | approved | rejected
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setVerificationStatus: (state, action) => { state.verificationStatus = action.payload; },
    setBookingRequests: (state, action) => { state.bookingRequests = action.payload; },
    setBookings: (state, action) => { state.bookings = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    setSuccessMessage: (state, action) => { state.successMessage = action.payload; },
    clearMessages: (state) => { state.error = null; state.successMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchBookingRequests.fulfilled, (state, action) => { state.loading = false; state.bookingRequests = action.payload; })
      .addCase(fetchBookingRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(approveRequest.fulfilled, (state, action) => {
        const idx = state.bookingRequests.findIndex(r => r.id === action.payload.requestId);
        if (idx >= 0) state.bookingRequests[idx].status = 'approved';
        state.successMessage = 'Booking approved!';
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const idx = state.bookingRequests.findIndex(r => r.id === action.payload.requestId);
        if (idx >= 0) state.bookingRequests[idx].status = 'rejected';
        state.successMessage = 'Booking rejected.';
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => { state.bookings = action.payload; })
      .addCase(fetchEarnings.fulfilled, (state, action) => { state.earnings = action.payload; });
  },
});

export const {
  setVerificationStatus, setBookingRequests, setBookings,
  setLoading, setError, setSuccessMessage, clearMessages,
} = ownerSlice.actions;

export default ownerSlice.reducer;
