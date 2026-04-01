import { View, StyleSheet } from 'react-native';
import { Checkbox, Text, TouchableRipple, useTheme } from 'react-native-paper';

const CustomCheckbox = ({
  value,
  onValueChange,
  label,
  labelComponent,
  error,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableRipple onPress={() => onValueChange(!value)} style={styles.container}>
      <View style={styles.row}>
        <Checkbox
          status={value ? 'checked' : 'unchecked'}
          onPress={() => onValueChange(!value)}
          color={error ? colors.error : colors.primary}
          uncheckedColor={error ? colors.error : undefined}
        />

        <View style={styles.labelContainer}>
          {labelComponent ?? (
            <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
              {label}
            </Text>
          )}
        </View>
      </View>
    </TouchableRipple>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    marginLeft: 4,
    flex: 1,
  },
});
