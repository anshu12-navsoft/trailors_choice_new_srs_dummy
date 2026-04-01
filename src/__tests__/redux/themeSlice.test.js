import { Appearance } from 'react-native';
import reducer, { setThemeMode, toggleTheme } from '../../App/Redux/Slices/themeSlice';

// Force light mode for deterministic initial state
jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');

describe('themeSlice', () => {
  const initialState = { mode: 'system', isDark: false };

  it('returns initial state with system mode', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.mode).toBe('system');
  });

  it('setThemeMode("light") sets isDark false', () => {
    const state = reducer(initialState, setThemeMode('light'));
    expect(state.mode).toBe('light');
    expect(state.isDark).toBe(false);
  });

  it('setThemeMode("dark") sets isDark true', () => {
    const state = reducer(initialState, setThemeMode('dark'));
    expect(state.mode).toBe('dark');
    expect(state.isDark).toBe(true);
  });

  it('setThemeMode("system") reads from Appearance', () => {
    Appearance.getColorScheme.mockReturnValue('dark');
    const state = reducer(initialState, setThemeMode('system'));
    expect(state.mode).toBe('system');
    expect(state.isDark).toBe(true);
    Appearance.getColorScheme.mockReturnValue('light'); // reset
  });

  it('toggleTheme flips isDark and updates mode', () => {
    const light = { mode: 'light', isDark: false };
    const dark = reducer(light, toggleTheme());
    expect(dark.isDark).toBe(true);
    expect(dark.mode).toBe('dark');

    const backToLight = reducer(dark, toggleTheme());
    expect(backToLight.isDark).toBe(false);
    expect(backToLight.mode).toBe('light');
  });
});
