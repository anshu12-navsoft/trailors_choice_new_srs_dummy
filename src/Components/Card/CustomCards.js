import { Card } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

/**
 * CustomCards — backed by react-native-paper's Card.
 *
 * variant prop maps to Paper's mode:
 *   'default'  → elevated
 *   'outlined' → outlined
 *   'flat'     → contained (no shadow)
 */
const VARIANT_MODE = {
  default:  'elevated',
  outlined: 'outlined',
  flat:     'contained',
};

const CustomCards = ({
  children,
  onPress,
  variant = 'default',
  style,
  contentStyle,
}) => (
  <Card
    mode={VARIANT_MODE[variant] ?? 'elevated'}
    onPress={onPress}
    style={[{ borderRadius: moderateScale(14) }, style]}
    contentStyle={[{ padding: moderateScale(14) }, contentStyle]}
  >
    {children}
  </Card>
);

export default CustomCards;
