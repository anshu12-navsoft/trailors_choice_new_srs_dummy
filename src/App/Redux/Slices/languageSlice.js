import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../../Services/bilingual_il8n/index';
import api from '../../../Services/api';

const LANGUAGE_KEY = 'APP_LANGUAGE';

// keeps the axios default header in sync — called after every language change
// so all subsequent API responses come back in the right language
const syncAxiosLanguageHeader = code => {
  api.defaults.headers.common['Accept-Language'] = code;
};

// ── Async Thunks ──────────────────────────────────────────────────────────

// Called once at app start — restores previously saved language
export const loadLanguage = createAsyncThunk(
  'language/load',
  async (_, { rejectWithValue }) => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      const code = saved ?? 'en';
      await i18n.changeLanguage(code);
      syncAxiosLanguageHeader(code);
      return code;
    } catch (err) {
      return rejectWithValue('Failed to load language preference');
    }
  }
);

// Called when user picks a language and taps Continue
export const setLanguage = createAsyncThunk(
  'language/set',
  async (code, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, code);
      await i18n.changeLanguage(code);
      syncAxiosLanguageHeader(code);
      return code;
    } catch (err) {
      return rejectWithValue('Failed to save language preference');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    selectedCode: 'en',   // active language code
    loading: false,
    error: null,
  },
  reducers: {
    clearError: state => { state.error = null; },
  },
  extraReducers: builder => {
    builder

      // loadLanguage
      .addCase(loadLanguage.pending, state => { state.loading = true; })
      .addCase(loadLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCode = action.payload;
      })
      .addCase(loadLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // setLanguage
      .addCase(setLanguage.pending, state => { state.loading = true; state.error = null; })
      .addCase(setLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCode = action.payload;
      })
      .addCase(setLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = languageSlice.actions;
export default languageSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD STRUCTURES & EXPECTED RESPONSES
// ─────────────────────────────────────────────────────────────────────────────

// ── NO API CALL ───────────────────────────────────────────────────────────
//
// Language selection is a LOCAL-ONLY operation.
// No HTTP request is made — preference is stored in AsyncStorage only.
//
// AsyncStorage key:  "APP_LANGUAGE"
// AsyncStorage value: "en" | "es"           // language code string

// ── loadLanguage ──────────────────────────────────────────────────────────
//
// WHEN called:  App entry point (App.js / RootNavigator) on first render
//
// INPUT:   none
//
// FLOW:
//   1. Read "APP_LANGUAGE" from AsyncStorage
//   2. Falls back to "en" if key is missing
//   3. Calls i18n.changeLanguage(code) to apply immediately
//   4. Stores code in state.selectedCode
//
// STATE AFTER:
//   selectedCode: "en"   // or "es" if previously saved

// ── setLanguage ───────────────────────────────────────────────────────────
//
// WHEN called:  User taps a language card + presses Continue
//               dispatch(setLanguage("es"))
//
// INPUT:
//   code: "en" | "es"              // language code from LANGUAGES constant
//
// FLOW:
//   1. Saves code to AsyncStorage under "APP_LANGUAGE"
//   2. Calls i18n.changeLanguage(code) — updates all t() calls app-wide instantly
//   3. Stores code in state.selectedCode
//
// STATE AFTER:
//   selectedCode: "es"

// ── If backend sync is needed in future ──────────────────────────────────
//
// Add a PATCH /users/preferences call inside setLanguage thunk:
//
// PAYLOAD  →  PATCH /users/preferences
// {
//   language: "es"                 // ISO 639-1 code
// }
//
// EXPECTED RESPONSE  →  200 OK
// {
//   success: true,
//   data: {
//     language: "es"
//   }
// }
//
// ERROR RESPONSE
// {
//   success: false,
//   message: "Human-readable error string"
// }
