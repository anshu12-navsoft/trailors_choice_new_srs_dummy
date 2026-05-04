import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchWishlistAPI,
  removeFromWishlistAPI,
} from '../../../Services/ApiList/wishlist.api';

// ── Async Thunks ──────────────────────────────────────────────────────────

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const res = await fetchWishlistAPI(page);
      return { ...res.data, page };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load wishlist',
      );
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (trailerId, { rejectWithValue }) => {
    try {
      const res = await removeFromWishlistAPI(trailerId);
      return { trailerId, ...res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove from wishlist',
      );
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],           // array of trailer objects
    hasMore: true,
    page: 1,
    loading: false,
    removeLoadingId: null, // trailerId whose remove button is in progress
    error: null,
    successMessage: null,
  },
  reducers: {
    clearWishlistMessages: state => {
      state.error = null;
      state.successMessage = null;
    },
    resetWishlist: state => {
      state.items = [];
      state.hasMore = true;
      state.page = 1;
    },
  },
  extraReducers: builder => {
    builder

      // fetchWishlist — appends on page > 1, replaces on page 1 (pull-to-refresh)
      .addCase(fetchWishlist.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const { items, hasMore, page } = action.payload;
        if (page === 1) {
          state.items = items;
        } else {
          state.items = [...state.items, ...items];
        }
        state.hasMore = hasMore;
        state.page = page;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // removeFromWishlist — optimistic: pull item out immediately, restore on failure
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.removeLoadingId = action.meta.arg;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.removeLoadingId = null;
        state.items = state.items.filter(t => t.id !== action.payload.trailerId);
        state.successMessage = 'Removed from wishlist';
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.removeLoadingId = null;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistMessages, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD STRUCTURES & EXPECTED API RESPONSES
// ─────────────────────────────────────────────────────────────────────────────

// ── fetchWishlist ─────────────────────────────────────────────────────────
//
// PAYLOAD  →  GET /users/wishlist/?page=1&limit=10   (auth token in header)
//
// EXPECTED RESPONSE  →  200 OK
// {
//   success: true,
//   data: {
//     items: [
//       {
//         id:        "trailer_abc",
//         makeModel: "Big Tex 14LP",
//         category:  "flatbed",
//         thumbUrl:  "https://cdn.example.com/photos/thumb.jpg",
//         pricing:   { daily: "85" },
//         address:   "Austin, TX",
//         rating:    4.8,
//       },
//       // ...
//     ],
//     hasMore: true,   // false when last page reached
//   }
// }

// ── removeFromWishlist ────────────────────────────────────────────────────
//
// PAYLOAD  →  POST /users/wishlist/:trailerId   (no request body)
//   trailerId: "trailer_abc"    // passed as thunk argument → goes into URL
//
// EXPECTED RESPONSE  →  200 OK
// {
//   success: true,
//   saved:   false    // must be false — item was already saved, so toggle removes it
// }

// ── Error Response  (all endpoints) ──────────────────────────────────────
// {
//   success: false,
//   message: "Human-readable error string"
// }
