import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../../services/auth.api';

/* ------------------ THUNKS ------------------ */

// 🔐 LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await loginApi(payload);

      // expected response structure
      // {
      //   data: {
      //     user: {...},
      //     token: "abc123"
      //   }
      // }

      const { user, token } = res.data;

      // store token locally
      await AsyncStorage.setItem('ACCESS_TOKEN', token);

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

// 🔓 LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await AsyncStorage.removeItem('ACCESS_TOKEN');
    return true;
  }
);

// 🔁 AUTO LOGIN (App start)
export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');

      if (!token) return null;

      // optionally call profile API here
      return { token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ------------------ STATE ------------------ */

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

/* ------------------ SLICE ------------------ */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    loginSuccess: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------- LOGIN -------- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- LOGOUT -------- */
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
      })

      /* -------- AUTO LOGIN -------- */
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload?.token) {
          state.token = action.payload.token;
          state.isLoggedIn = true;
        }
      });
  },
});

/* ------------------ EXPORTS ------------------ */

export const { clearError, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;


// Payload Structure
// {
//   "email": "user@example.com",
//   "password": "123456"
// }

// Expected API Response
// {
//   "success": true,
//   "data": {
//     "user": {
//       "id": "1",
//       "name": "Anshu",
//       "email": "user@example.com"
//     },
//     "token": "jwt_token_here"
//   }
// }