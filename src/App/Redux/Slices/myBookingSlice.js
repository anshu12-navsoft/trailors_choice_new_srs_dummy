import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getBookingsAPI,
  getBookingDetailsAPI,
  downloadInvoiceAPI,
} from '../../../Services/ApiList/myBookings.api';

// ─────────────────────────────────────────────
// STATUS MAPPING (UI Tabs → API Filters)
// ─────────────────────────────────────────────
const TAB_STATUS_MAP = {
  upcoming: ['ongoing', 'coming', 'booked'],
  past: ['completed', 'cancelled', 'rejected'],
};

// ─────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────

// Fetch bookings list
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async ({ tab = 'upcoming' }, { rejectWithValue }) => {
    try {
      const statuses = TAB_STATUS_MAP[tab];

      const response = await getBookingsAPI({
        statuses,
      });

      return {
        data: response.data,
        tab,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Something went wrong');
    }
  },
);

// Fetch booking details
export const fetchBookingDetails = createAsyncThunk(
  'bookings/fetchBookingDetails',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await getBookingDetailsAPI(bookingId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch details');
    }
  },
);

// Download invoice
export const downloadInvoice = createAsyncThunk(
  'bookings/downloadInvoice',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await downloadInvoiceAPI(bookingId);

      return {
        blob: response.data,
        bookingId,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Invoice download failed');
    }
  },
);

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────
const initialState = {
  activeTab: 'upcoming',

  bookings: {
    upcoming: [],
    past: [],
  },

  loading: false,
  error: null,

  selectedBooking: null,
  detailsLoading: false,

  invoiceLoading: false,
};

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────
const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    clearBookingDetails: state => {
      state.selectedBooking = null;
    },
  },

  extraReducers: builder => {
    builder

      // ───── FETCH BOOKINGS LIST ─────
      .addCase(fetchBookings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;

        const { tab, data } = action.payload;
        state.bookings[tab] = data.results || data;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───── FETCH DETAILS ─────
      .addCase(fetchBookingDetails.pending, state => {
        state.detailsLoading = true;
      })
      .addCase(fetchBookingDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingDetails.rejected, state => {
        state.detailsLoading = false;
      })

      // ───── DOWNLOAD INVOICE ─────
      .addCase(downloadInvoice.pending, state => {
        state.invoiceLoading = true;
      })
      .addCase(downloadInvoice.fulfilled, state => {
        state.invoiceLoading = false;
      })
      .addCase(downloadInvoice.rejected, state => {
        state.invoiceLoading = false;
      });
  },
});

export const { setActiveTab, clearBookingDetails } = bookingSlice.actions;
export default bookingSlice.reducer;

// List API (GET /bookings/)
// {
//   "results": [
//     {
//       "id": 1,
//       "status": "ongoing",
//       "trailer_name": "Heavy Duty Trailer",
//       "image": "https://...",
//       "date": "2026-04-22",
//       "price": 12000
//     }
//   ]
// }

// Details API (GET /bookings/:id)
// {
//   "id": 1,
//   "status": "ongoing",
//   "images": ["url1", "url2"],
//   "trailer_name": "Heavy Duty Trailer",
//   "owner_name": "Rahul Sharma",
//   "load_capacity": "20 tons",
//   "booking_date": "2026-04-20",
//   "return_date": "2026-04-25",
//   "location": "Delhi",
//   "price_breakdown": {
//     "base_price": 10000,
//     "tax": 2000
//   },
//   "total_amount": 12000
// }
