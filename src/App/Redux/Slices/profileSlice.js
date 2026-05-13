import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchProfileAPI,
  updateProfileAPI,
  toggleWishlistAPI,
} from '../../../Services/profile.api';

// ── Async Thunks ──────────────────────────────────────────────────────────

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchProfileAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateProfileAPI(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'profile/toggleWishlist',
  async (trailerId, { rejectWithValue }) => {
    try {
      const res = await toggleWishlistAPI(trailerId);
      return { trailerId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

export const logoutProfile = createAsyncThunk(
  'profile/logout',
  async () => {
    await AsyncStorage.removeItem('ACCESS_TOKEN');
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,            // { id, firstName, lastName, email, phone, avatarUrl, memberSince, role }
    rentalHistory: [],     // array of booking objects
    wishlist: [],          // array of trailer objects
    loading: false,
    updateLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: state => {
      state.error = null;
      state.successMessage = null;
    },
    clearProfile: state => {
      state.user = null;
      state.rentalHistory = [];
      state.wishlist = [];
    },
  },
  extraReducers: builder => {
    builder

      // fetchProfile — splits one response into user / rentalHistory / wishlist
      .addCase(fetchProfile.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { user, rentalHistory, wishlist } = action.payload;
        state.user = user;
        state.rentalHistory = rentalHistory;
        state.wishlist = wishlist;
      })
      .addCase(fetchProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // updateProfile — response returns updated user only
      .addCase(updateProfile.pending, state => { state.updateLoading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = { ...state.user, ...action.payload };
        state.successMessage = 'Profile updated successfully!';
      })
      .addCase(updateProfile.rejected, (state, action) => { state.updateLoading = false; state.error = action.payload; })

      // toggleWishlist — optimistic: add if saved, remove if not
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { trailerId, saved } = action.payload;
        if (saved) {
          if (!state.wishlist.find(t => t.id === trailerId))
            state.wishlist.push({ id: trailerId });
        } else {
          state.wishlist = state.wishlist.filter(t => t.id !== trailerId);
        }
      })

      // logout — wipe all profile state
      .addCase(logoutProfile.fulfilled, state => {
        state.user = null;
        state.rentalHistory = [];
        state.wishlist = [];
        state.error = null;
        state.successMessage = null;
      });
  },
});

export const { clearMessages, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD STRUCTURES & EXPECTED API RESPONSES
// ─────────────────────────────────────────────────────────────────────────────

// ── fetchProfile ──────────────────────────────────────────────────────────
//
// PAYLOAD  →  GET /users/profile       // no body, auth token in header
//
// EXPECTED RESPONSE  →  200 OK
// {
//   success: true,
//   data: {
//     user: {
//       id:          "user_xyz789",
//       firstName:   "Anand",
//       lastName:    "Shaw",
//       email:       "anand@example.com",
//       phone:       "+1 512-000-0000",
//       avatarUrl:   "https://cdn.example.com/avatars/user_xyz789.jpg",
//       memberSince: "2026-03-01T00:00:00.000Z",
//       role:        "renter",           // "renter" | "owner" | "both"
//     },
//
//     rentalHistory: [                  // array of booking objects
//       {
//         id:          "booking_001",
//         trailerId:   "trailer_abc",
//         trailerName: "Big Tex 14LP",
//         thumbUrl:    "https://cdn.example.com/photos/thumb.jpg",
//         startDate:   "2026-03-10T00:00:00.000Z",
//         endDate:     "2026-03-13T00:00:00.000Z",
//         totalPrice:  255,
//         status:      "completed",      // "completed" | "cancelled" | "upcoming"
//       },
//       // ...
//     ],
//
//     wishlist: [                       // array of saved trailer objects
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
//   }
// }

// ── updateProfile ─────────────────────────────────────────────────────────
//
// PAYLOAD  →  PUT /users/profile   (multipart/form-data)
//
// FormData {
//   firstName: "Anand",             // optional — send only changed fields
//   lastName:  "Shaw",
//   phone:     "+1 512-000-0000",
//   avatar:    <File>,              // optional — image file, omit if not changing
// }
//
// EXPECTED RESPONSE  →  200 OK
// {
//   success: true,
//   data: {
//     id:          "user_xyz789",
//     firstName:   "Anand",
//     lastName:    "Shaw",
//     email:       "anand@example.com",
//     phone:       "+1 512-000-0000",
//     avatarUrl:   "https://cdn.example.com/avatars/user_xyz789_updated.jpg",
//     memberSince: "2026-03-01T00:00:00.000Z",
//     role:        "renter",
//   }
// }

// ── toggleWishlist ────────────────────────────────────────────────────────
//
// PAYLOAD  →  POST /users/wishlist/:trailerId
//   trailerId: "trailer_abc"        // in URL — no request body
//
// EXPECTED RESPONSE  →  200 OK
// {
//   success: true,
//   saved:   true    // true = added, false = removed
// }

// ── logoutProfile ─────────────────────────────────────────────────────────
//
// No API call — only removes ACCESS_TOKEN from AsyncStorage and wipes state.

// ── Error Response  (all endpoints) ──────────────────────────────────────
// {
//   success: false,
//   message: "Human-readable error string"
// }
