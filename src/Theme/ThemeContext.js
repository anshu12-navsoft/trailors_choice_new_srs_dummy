import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { getColors } from '../Constants/Colors';

const ThemeContext = createContext(getColors(false));

/**
 * Build a react-native-paper MD3 theme from our semantic color tokens.
 */
const buildPaperTheme = (base, colors) => ({
  ...base,
  colors: {
    ...base.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceElevated,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
    outline: colors.border,
    secondary: colors.primaryDark,
    onSecondary: '#FFFFFF',
  },
});

/**
 * Wrap your app root with this provider.
 * It reads isDark from Redux and supplies the right color set + Paper theme to all children.
 */
export const ThemeProvider = ({ children }) => {
  const isDark = useSelector(state => state.theme.isDark);
  const colors = getColors(isDark);

  const paperTheme = buildPaperTheme(
    isDark ? MD3DarkTheme : MD3LightTheme,
    colors,
  );

  return (
    <ThemeContext.Provider value={colors}>
      <PaperProvider theme={paperTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Use this hook in any screen / component instead of
 * `import colors from '../../Constants/Colors'`
 *
 * Example:
 *   const colors = useColors();
 *   <View style={{ backgroundColor: colors.background }} />
 */
export const useColors = () => useContext(ThemeContext);

export default ThemeContext;
