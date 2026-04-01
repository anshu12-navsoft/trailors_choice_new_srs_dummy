import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createBookingAPI,
  fetchMyBookingsAPI,
  cancelBookingAPI,
  modifyBookingAPI,
} from '../../../Services/booking.api';

export const createBooking = createAsyncThunk(
  'booking/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createBookingAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Booking failed');
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchMyBookingsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load bookings');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await cancelBookingAPI(bookingId);
      return { bookingId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Cancellation failed');
    }
  }
);

export const modifyBooking = createAsyncThunk(
  'booking/modify',
  async (data, { rejectWithValue }) => {
    try {
      const res = await modifyBookingAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Modification failed');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    selectedBooking: null,
    bookingDraft: {
      trailerId: null,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      paymentMethodId: null,
      notes: '',
    },
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setBookingDraft: (state, action) => { state.bookingDraft = action.payload; },
    updateBookingDraft: (state, action) => { state.bookingDraft = { ...state.bookingDraft, ...action.payload }; },
    clearBookingDraft: (state) => {
      state.bookingDraft = { trailerId: null, startDate: null, endDate: null, startTime: null, endTime: null, paymentMethodId: null, notes: '' };
    },
    setSelectedBooking: (state, action) => { state.selectedBooking = action.payload; },
    setBookings: (state, action) => { state.bookings = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    setSuccessMessage: (state, action) => { state.successMessage = action.payload; },
    clearMessages: (state) => { state.error = null; state.successMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.successMessage = 'Booking confirmed!';
      })
      .addCase(createBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload; })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(cancelBooking.pending, (state) => { state.loading = true; })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.bookings.findIndex(b => b.id === action.payload.bookingId);
        if (idx >= 0) state.bookings[idx].status = 'cancelled';
        state.successMessage = 'Booking cancelled.';
      })
      .addCase(cancelBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(modifyBooking.pending, (state) => { state.loading = true; })
      .addCase(modifyBooking.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.bookings.findIndex(b => b.id === action.payload.id);
        if (idx >= 0) state.bookings[idx] = action.payload;
        state.successMessage = 'Booking updated.';
      })
      .addCase(modifyBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const {
  setBookingDraft, updateBookingDraft, clearBookingDraft,
  setSelectedBooking, setBookings, setLoading, setError,
  setSuccessMessage, clearMessages,
} = bookingSlice.actions;

export default bookingSlice.reducer;
