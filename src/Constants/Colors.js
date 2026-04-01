/**
 * Base palette — do NOT use directly in UI
 */
const palette = {
  white: '#FFFFFF',
  black: '#000000',

  gray50:  '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  primary500: '#2563EB',
  primary600: '#1D4ED8',

  success500: '#16A34A',
  warning500: '#F59E0B',
  error500:   '#DC2626',
};

/**
 * Light theme semantic colors
 */
export const lightColors = {
  background:    palette.white,
  surface:       palette.gray50,
  surfaceElevated: palette.white,

  textPrimary:   palette.gray900,
  textSecondary: palette.gray600,
  textDisabled:  palette.gray400,

  primary:       palette.primary500,
  primaryDark:   palette.primary600,

  border:        palette.gray200,
  divider:       palette.gray100,

  success: palette.success500,
  warning: palette.warning500,
  error:   palette.error500,

  /* chat */
  bubbleMine:    '#E53935',
  bubbleTheirs:  '#F1F1F1',
  bubbleTextMine: palette.white,
  bubbleTextTheirs: palette.gray900,
};

/**
 * Dark theme semantic colors
 */
export const darkColors = {
  background:    palette.gray900,
  surface:       palette.gray800,
  surfaceElevated: palette.gray700,

  textPrimary:   palette.white,
  textSecondary: palette.gray300,
  textDisabled:  palette.gray500,

  primary:       palette.primary500,
  primaryDark:   palette.primary600,

  border:        palette.gray700,
  divider:       palette.gray800,

  success: palette.success500,
  warning: palette.warning500,
  error:   palette.error500,

  /* chat */
  bubbleMine:    '#E53935',
  bubbleTheirs:  palette.gray700,
  bubbleTextMine: palette.white,
  bubbleTextTheirs: palette.white,
};

/**
 * Returns the correct color set for a given dark-mode flag.
 */
export const getColors = (isDark = false) => isDark ? darkColors : lightColors;

/**
 * Static default export for backward compatibility.
 * Screens that haven't adopted useColors() yet will still compile.
 * They'll render in light mode until migrated.
 */
export default lightColors;
