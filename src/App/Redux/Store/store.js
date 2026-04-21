import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../Slices/authSlice"
import trailerReducer from "../Slices/trailerSlice"
import bookingReducer from "../Slices/bookingSlice"
import ownerReducer from "../Slices/ownerSlice"
import chatReducer from "../Slices/chatSlice"
import themeReducer from "../Slices/themeSlice"
import otpReducer from "../Slices/otpSlice"
import addTrailerReducer from "../Slices/addTrailerSlice"
import profileReducer from "../Slices/profileSlice"
import languageReducer from "../Slices/languageSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    otp: otpReducer,
    trailer: trailerReducer,
    booking: bookingReducer,
    owner: ownerReducer,
    chat: chatReducer,
    theme: themeReducer,
    addTrailer: addTrailerReducer,
    profile: profileReducer,
    language: languageReducer,
  },
});
