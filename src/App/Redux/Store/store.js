import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../Slices/authSlice"
import trailerReducer from "../Slices/trailerSlice"
import bookingReducer from "../Slices/bookingSlice"
import ownerReducer from "../Slices/ownerSlice"
import chatReducer from "../Slices/chatSlice"
import themeReducer from "../Slices/themeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trailer: trailerReducer,
    booking: bookingReducer,
    owner: ownerReducer,
    chat: chatReducer,
    theme: themeReducer,
  },
});
