import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerApi } from '../../../Services/auth.api';

/* ------------------ THUNK ------------------ */

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      // API call (multipart/form-data)
      const res = await registerApi(formData);

      /**
       * Expected response:
       * {
       *   success: true,
       *   message: "Registered successfully",
       *   data: {
       *     user: {...},
       *     token: "abc123" // optional
       *   }
       * }
       */

      const { user, token } = res?.data || {};

      // 🔐 Store token if backend sends it (auto-login)
      if (token) {
        await AsyncStorage.setItem('ACCESS_TOKEN', token);
      }

      return {
        user: user || null,
        token: token || null,
        message: res?.message || 'Registered successfully',
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        'Registration failed'
      );
    }
  }
);

/* ------------------ INITIAL STATE ------------------ */

const initialState = {
  loading: false,
  success: false,
  error: null,
  userData: null,
  token: null,
  message: null,
};

/* ------------------ SLICE ------------------ */

const registerSlice = createSlice({
  name: 'register',
  initialState,

  reducers: {
    resetRegister: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.userData = null;
      state.token = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------- PENDING -------- */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })

      /* -------- SUCCESS -------- */
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.userData = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })

      /* -------- ERROR -------- */
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

/* ------------------ EXPORTS ------------------ */

export const { resetRegister } = registerSlice.actions;
export default registerSlice.reducer;


// Payload Structure
// const formData = new FormData();

// // 🧾 Basic fields
// formData.append('name', 'Anshu Singh');
// formData.append('email', 'anshu@email.com');
// formData.append('password', '123456');
// formData.append('phone', '9876543210');

// // 📸 Profile Image
// formData.append('profile_image', {
//   uri: imageUri,
//   name: 'profile.jpg',
//   type: 'image/jpeg',
// });

// // 📄 Document (PDF / DOC)
// formData.append('document', {
//   uri: docUri,
//   name: 'aadhaar.pdf',
//   type: 'application/pdf',
// });

// // 🎥 Video
// formData.append('video', {
//   uri: videoUri,
//   name: 'intro.mp4',
//   type: 'video/mp4',
// });


// PRACTICE RESPONSE
// {
//   "success": true,
//   "message": "User registered successfully",
//   "data": {
//     "user": {
//       "id": "123",
//       "name": "Anshu Singh",
//       "email": "anshu@email.com",
//       "phone": "9876543210",

//       "profile_image": "https://cdn.yourapp.com/images/profile.jpg",
//       "document": "https://cdn.yourapp.com/docs/aadhaar.pdf",
//       "video": "https://cdn.yourapp.com/videos/intro.mp4",

//       "createdAt": "2026-04-20T10:00:00Z"
//     },

//     "token": "jwt_token_here"
//   }
// }