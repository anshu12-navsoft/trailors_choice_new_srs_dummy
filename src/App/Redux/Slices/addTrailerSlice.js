import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addTrailerAPI,
  updateTrailerAPI,
  deleteTrailerAPI,
  fetchMyTrailersAPI,
} from '../../../Services/addTrailer.api';

// ── Async Thunks ──────────────────────────────────────────────────────────

export const submitTrailer = createAsyncThunk(
  'addTrailer/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await addTrailerAPI(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add trailer');
    }
  }
);

export const updateTrailer = createAsyncThunk(
  'addTrailer/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateTrailerAPI(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update trailer');
    }
  }
);

export const deleteTrailer = createAsyncThunk(
  'addTrailer/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTrailerAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete trailer');
    }
  }
);

export const fetchMyTrailers = createAsyncThunk(
  'addTrailer/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchMyTrailersAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load your trailers');
    }
  }
);

// ── Initial form draft ────────────────────────────────────────────────────

const INITIAL_DRAFT = {
  // Step 1 — Trailer Details
  category: null,
  makeModel: '',
  year: '',
  licensePlate: '',
  specs: {
    length: '',
    width: '',
    heightGround: '',
    totalHeight: '',
    weightCapacity: '',
    tongueWeight: '',
  },
  features: {
    ramp: false,
    spareTire: false,
    tieDown: false,
    winch: false,
  },
  specsPhoto: null,

  // Step 2 — Media & Documentation
  mediaPhotos: [],
  mediaVideos: [],
  mediaDocuments: [],
  tags: [],

  // Step 3 — Pricing & Location
  pricing: {
    daily: '',
    weekly: '',
    monthly: '',
    deposit: '',
  },
  address: '',
  safety: '',
};

// ── Slice ─────────────────────────────────────────────────────────────────

const addTrailerSlice = createSlice({
  name: 'addTrailer',
  initialState: {
    draft: { ...INITIAL_DRAFT },
    myTrailers: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    updateDraft: (state, action) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    updateDraftSpecs: (state, action) => {
      state.draft.specs = { ...state.draft.specs, ...action.payload };
    },
    updateDraftFeatures: (state, action) => {
      state.draft.features = { ...state.draft.features, ...action.payload };
    },
    updateDraftPricing: (state, action) => {
      state.draft.pricing = { ...state.draft.pricing, ...action.payload };
    },
    toggleDraftTag: (state, action) => {
      const tag = action.payload;
      const idx = state.draft.tags.indexOf(tag);
      if (idx >= 0) {
        state.draft.tags.splice(idx, 1);
      } else {
        state.draft.tags.push(tag);
      }
    },
    addMediaPhoto: (state, action) => {
      state.draft.mediaPhotos.push(...action.payload);
    },
    addMediaVideo: (state, action) => {
      state.draft.mediaVideos.push(...action.payload);
    },
    addMediaDocument: (state, action) => {
      state.draft.mediaDocuments.push(...action.payload);
    },
    resetDraft: state => {
      state.draft = { ...INITIAL_DRAFT };
    },
    clearMessages: state => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      // submitTrailer
      .addCase(submitTrailer.pending, state => { state.loading = true; state.error = null; })
      .addCase(submitTrailer.fulfilled, (state, action) => {
        state.loading = false;
        state.myTrailers.unshift(action.payload);
        state.successMessage = 'Trailer listed successfully!';
        state.draft = { ...INITIAL_DRAFT };
      })
      .addCase(submitTrailer.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // updateTrailer
      .addCase(updateTrailer.pending, state => { state.loading = true; state.error = null; })
      .addCase(updateTrailer.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.myTrailers.findIndex(t => t.id === action.payload.id);
        if (idx >= 0) state.myTrailers[idx] = action.payload;
        state.successMessage = 'Trailer updated successfully!';
      })
      .addCase(updateTrailer.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // deleteTrailer
      .addCase(deleteTrailer.pending, state => { state.loading = true; })
      .addCase(deleteTrailer.fulfilled, (state, action) => {
        state.loading = false;
        state.myTrailers = state.myTrailers.filter(t => t.id !== action.payload);
        state.successMessage = 'Trailer deleted.';
      })
      .addCase(deleteTrailer.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // fetchMyTrailers
      .addCase(fetchMyTrailers.pending, state => { state.loading = true; })
      .addCase(fetchMyTrailers.fulfilled, (state, action) => { state.loading = false; state.myTrailers = action.payload; })
      .addCase(fetchMyTrailers.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const {
  updateDraft,
  updateDraftSpecs,
  updateDraftFeatures,
  updateDraftPricing,
  toggleDraftTag,
  addMediaPhoto,
  addMediaVideo,
  addMediaDocument,
  resetDraft,
  clearMessages,
} = addTrailerSlice.actions;

export default addTrailerSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD STRUCTURES & EXPECTED API RESPONSES
// ─────────────────────────────────────────────────────────────────────────────

// ── submitTrailer / updateTrailer ─────────────────────────────────────────
//
// PAYLOAD  →  POST /trailers  |  PUT /trailers/:id
// {
//   category:      "flatbed",           // string  — trailer type
//   makeModel:     "Big Tex 14LP",      // string
//   year:          "2023",              // string  — 4-digit year
//   licensePlate:  "ABC-1234",          // string  — uppercase
//
//   specs: {
//     length:         "26",             // string  — value in ft
//     width:          "8",
//     heightGround:   "7",
//     totalHeight:    "10",
//     weightCapacity: "14000",          // value in lb
//     tongueWeight:   "1400",
//   },
//
//   features: {
//     ramp:      true,
//     spareTire: false,
//     tieDown:   true,
//     winch:     false,
//   },
//
//   specsPhoto:     "file:///.../spec.jpg",   // local URI  — upload separately
//
//   mediaPhotos:    ["file:///.../p1.jpg", "file:///.../p2.jpg"],
//   mediaVideos:    ["file:///.../v1.mp4"],
//   mediaDocuments: ["file:///.../doc1.pdf"],
//
//   tags: ["Ramp Included", "Tool Box", "Custom Tag"],
//
//   pricing: {
//     daily:   "85",                    // string  — USD, no symbol
//     weekly:  "450",
//     monthly: "1200",
//     deposit: "200",
//   },
//
//   address: "1234 Main St, Austin, TX 78701",
//   safety:  "Requires class III hitch. Max speed 65 mph.",
// }
//
// EXPECTED RESPONSE  →  201 Created  |  200 OK
// {
//   success: true,
//   data: {
//     id:            "trailer_abc123",
//     ownerId:       "user_xyz789",
//     status:        "active",          // "active" | "pending" | "inactive"
//     category:      "flatbed",
//     makeModel:     "Big Tex 14LP",
//     year:          "2023",
//     licensePlate:  "ABC-1234",
//     specs: { length, width, heightGround, totalHeight, weightCapacity, tongueWeight },
//     features:      { ramp, spareTire, tieDown, winch },
//     specsPhotoUrl: "https://cdn.example.com/specs/abc.jpg",
//     mediaPhotoUrls:    ["https://cdn.example.com/photos/p1.jpg", ...],
//     mediaVideoUrls:    ["https://cdn.example.com/videos/v1.mp4"],
//     mediaDocumentUrls: ["https://cdn.example.com/docs/doc1.pdf"],
//     tags:     ["Ramp Included", "Tool Box"],
//     pricing:  { daily, weekly, monthly, deposit },
//     address:  "1234 Main St, Austin, TX 78701",
//     location: { lat: 30.2672, lng: -97.7431 },  // geocoded server-side
//     safety:   "Requires class III hitch.",
//     createdAt: "2026-04-21T10:30:00.000Z",
//     updatedAt: "2026-04-21T10:30:00.000Z",
//   }
// }

// ── deleteTrailer ─────────────────────────────────────────────────────────
//
// PAYLOAD  →  DELETE /trailers/:id
//   id: "trailer_abc123"               // string  — trailer ID
//
// EXPECTED RESPONSE  →  200 OK
// {
//   success: true,
//   message: "Trailer deleted successfully."
// }

// ── fetchMyTrailers ───────────────────────────────────────────────────────
//
// PAYLOAD  →  GET /trailers/mine       // no body, auth token in header
//
// EXPECTED RESPONSE  →  200 OK
// {
//   success: true,
//   data: [
//     {
//       id:           "trailer_abc123",
//       status:       "active",
//       category:     "flatbed",
//       makeModel:    "Big Tex 14LP",
//       year:         "2023",
//       mediaPhotoUrls: ["https://cdn.example.com/photos/thumb.jpg"],
//       pricing:      { daily: "85", weekly: "450", monthly: "1200", deposit: "200" },
//       address:      "1234 Main St, Austin, TX 78701",
//       createdAt:    "2026-04-21T10:30:00.000Z",
//     },
//     // ... more trailers
//   ]
// }

// ── Error Response  (all endpoints) ──────────────────────────────────────
// {
//   success: false,
//   message: "Human-readable error string"   // surfaced via rejectWithValue
// }
