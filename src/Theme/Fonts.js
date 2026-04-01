import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Base width reference (iPhone 11 / Android mid-size)
 */
const guidelineBaseWidth = 375;

/**
 * Responsive font size
 */
const scaleFont = size => {
  const scale = width / guidelineBaseWidth;
  return Math.round(moderateScale(size * scale));
};

const Fonts = {
  family: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  size: {
    xs: scaleFont(10),
    sm: scaleFont(12),
    md: scaleFont(14),
    lg: scaleFont(16),
    xl: scaleFont(18),
    xxl: scaleFont(22),
    xxxl: scaleFont(26),
  },

  lineHeight: size => verticalScale(size + 6),
};

export default Fonts;
