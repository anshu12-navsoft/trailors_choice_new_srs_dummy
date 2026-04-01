import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const CustomChip = ({
  label,
  selected = false,
  onPress,
  disabled = false,
  leftIcon,
  style,
  textStyle,
}) => (
  <Chip
    selected={selected}
    onPress={onPress}
    disabled={disabled}
    icon={leftIcon ? () => leftIcon : undefined}
    style={[styles.chip, style]}
    textStyle={textStyle}
  >
    {label}
  </Chip>
);

const styles = StyleSheet.create({
  chip: {
    marginRight: moderateScale(8),
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(20),
  },
});

export default CustomChip;
