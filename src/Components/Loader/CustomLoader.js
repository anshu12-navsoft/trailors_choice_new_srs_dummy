import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale } from 'react-native-size-matters';

/**
 * CustomLoader
 *
 * Props:
 *   icon    — MaterialCommunityIcons name (default: 'calendar-month')
 *   size    — icon size (default: 48)
 *   label   — optional text below the icon
 */
const CustomLoader = ({ icon = 'calendar-month', size = moderateScale(48), label }) => {
  const { colors } = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Icon name={icon} size={size} color={colors.primary} />
      </Animated.View>
      {label && (
        <Text variant="labelMedium" style={[styles.label, { color: colors.onSurfaceVariant }]}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(12),
  },
  label: {
    textAlign: 'center',
  },
});

export default CustomLoader;
