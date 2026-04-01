import { View, StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * CustomHeader
 *
 * Props:
 *  title        — string displayed in center
 *  onBack       — if provided, back arrow is shown and called on press
 *  rightActions — array of up to 2 action objects:
 *                   { icon: string, onPress: fn, accessibilityLabel?: string }
 */
const CustomHeader = ({ title, onBack, rightActions = [] }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Appbar.Header
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          paddingTop: insets.top,
        },
      ]}
    >
      {onBack && (
        <Appbar.BackAction onPress={onBack} color={colors.onSurface} />
      )}

      <Appbar.Content
        title={title}
        titleStyle={[styles.title, { color: colors.onSurface }]}
      />

      {rightActions.slice(0, 2).map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          color={colors.onSurface}
          accessibilityLabel={action.accessibilityLabel}
        />
      ))}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 2,
  },
  title: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomHeader;
