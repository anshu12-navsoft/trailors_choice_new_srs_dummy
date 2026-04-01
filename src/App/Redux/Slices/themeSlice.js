import { createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

const systemIsDark = Appearance.getColorScheme() === 'dark';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'system',           // 'light' | 'dark' | 'system'
    isDark: systemIsDark,
  },
  reducers: {
    setThemeMode(state, action) {
      const mode = action.payload; // 'light' | 'dark' | 'system'
      state.mode = mode;
      if (mode === 'system') {
        state.isDark = Appearance.getColorScheme() === 'dark';
      } else {
        state.isDark = mode === 'dark';
      }
    },
    toggleTheme(state) {
      state.isDark = !state.isDark;
      state.mode = state.isDark ? 'dark' : 'light';
    },
  },
});

export const { setThemeMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
