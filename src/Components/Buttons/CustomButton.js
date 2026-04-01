import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

/**
 * CustomButton — backed by react-native-paper's Button.
 *
 * variant prop maps to Paper's mode:
 *   'primary'   → contained
 *   'secondary' → contained-tonal
 *   'outline'   → outlined
 *   'text'      → text
 *
 * size prop adjusts label font size and vertical padding.
 */
const SIZE_STYLES = {
  small:  { fontSize: 12, paddingVertical: 2 },
  medium: { fontSize: 15, paddingVertical: 6 },
  large:  { fontSize: 18, paddingVertical: 10 },
};

const VARIANT_MODE = {
  primary:   'contained',
  secondary: 'contained-tonal',
  outline:   'outlined',
  text:      'text',
};

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  size = 'medium',
  style,
  textStyle,
  leftIcon,
  children,
}) => {
  const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES.medium;
  const mode = VARIANT_MODE[variant] ?? 'contained';

  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={leftIcon ? () => leftIcon : undefined}
      contentStyle={[
        styles.content,
        { paddingVertical: moderateScale(sizeStyle.paddingVertical) },
      ]}
      labelStyle={[
        { fontSize: moderateScale(sizeStyle.fontSize) },
        textStyle,
      ]}
      style={[styles.base, style]}
    >
      {children ?? title}
    </Button>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: moderateScale(12),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomButton;
