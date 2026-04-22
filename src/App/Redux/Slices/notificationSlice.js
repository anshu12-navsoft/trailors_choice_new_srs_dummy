import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchNotificationsAPI,
  markNotificationReadAPI,
  notificationActionAPI,
} from '../../../Services/ApiList/notification.api';

/* ── Async Thunks ───────────────────────────────────────────────────────── */

// 📥 FETCH NOTIFICATIONS
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchNotificationsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch notifications'
      );
    }
  }
);

// ✅ MARK AS READ
export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await markNotificationReadAPI(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark as read'
      );
    }
  }
);

// ⚡ HANDLE ACTION (Accept / Decline / View etc.)
export const handleNotificationAction = createAsyncThunk(
  'notifications/action',
  async ({ notificationId, action }, { rejectWithValue }) => {
    try {
      const res = await notificationActionAPI(notificationId, action);
      return { notificationId, action, ...res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Action failed'
      );
    }
  }
);

/* ── Initial State ───────────────────────────────────────────────────────── */

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

/* ── Slice ───────────────────────────────────────────────────────────────── */

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: state => {
      state.notifications = [];
    },
  },

  extraReducers: builder => {
    builder

      /* -------- FETCH -------- */
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- MARK AS READ -------- */
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload;
        const item = state.notifications.find(n => n.id === id);
        if (item) item.read = true;
      })

      /* -------- ACTION -------- */
      .addCase(handleNotificationAction.fulfilled, (state, action) => {
        const { notificationId, action: actionType } = action.payload;

        const item = state.notifications.find(n => n.id === notificationId);
        if (!item) return;

        // Example behavior
        if (actionType === 'accept') {
          item.status = 'accepted';
        } else if (actionType === 'decline') {
          item.status = 'declined';
        }

        item.read = true;
      });
  },
});

/* ── Exports ───────────────────────────────────────────────────────────── */

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD STRUCTURES & EXPECTED API RESPONSES
// ─────────────────────────────────────────────────────────────────────────────


// ── fetchNotifications ───────────────────────────────────────────────────
//
// PAYLOAD → GET /notifications
//
// EXPECTED RESPONSE → 200 OK
// {
//   success: true,
//   data: [
//     {
//       id: "notif_001",
//       type: "booking_request",
//       title: "New Booking Available",
//       message: "User wants to rent your trailer",
//       time: "2026-04-21T10:30:00Z",
//       read: false,
//       status: "pending",   // optional
//       actions: [
//         { label: "Accept", action: "accept" },
//         { label: "Decline", action: "decline" }
//       ]
//     }
//   ]
// }


// ── markNotificationRead ─────────────────────────────────────────────────
//
// PAYLOAD → PATCH /notifications/:id/read
//
// EXPECTED RESPONSE → 200 OK
// {
//   success: true,
//   message: "Marked as read"
// }


// ── handleNotificationAction ─────────────────────────────────────────────
//
// PAYLOAD → POST /notifications/:id/action
// {
//   action: "accept" | "decline" | "view"
// }
//
// EXPECTED RESPONSE → 200 OK
// {
//   success: true,
//   status: "accepted"   // or "declined"
// }


// ── Error Response (all APIs) ─────────────────────────────────────────────
// {
//   success: false,
//   message: "Human-readable error"
// }