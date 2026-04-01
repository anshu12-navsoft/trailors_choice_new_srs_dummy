import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

/**
 * CustomIconButton — backed by react-native-paper's IconButton.
 *
 * variant prop maps to Paper's mode:
 *   'primary'   → contained
 *   'secondary' → contained-tonal
 *   'outline'   → outlined
 *   'ghost'     → default (no background)
 *
 * icon: icon name string (MaterialCommunityIcons) or render function ({ size, color }) => ReactNode
 */
const VARIANT_MODE = {
  primary:   'contained',
  secondary: 'contained-tonal',
  outline:   'outlined',
  ghost:     undefined,
};

const CustomIconButton = ({
  icon,
  onPress,
  variant = 'ghost',
  disabled = false,
  loading = false,
  style,
}) => {
  const mode = VARIANT_MODE[variant];

  return (
    <IconButton
      icon={icon}
      mode={mode}
      size={moderateScale(24)}
      onPress={onPress}
      disabled={disabled || loading}
      loading={loading}
      style={[styles.base, style]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: moderateScale(12),
    margin: 0,
  },
});

export default CustomIconButton;
