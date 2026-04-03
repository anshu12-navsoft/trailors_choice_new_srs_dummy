import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import colors from '../../Constants/Colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
  },
  headerSide: {
    width: moderateScale(36),
  },
  headerTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(24),
    paddingBottom: moderateScale(16),
  },
  continueBtn: {
    marginTop: moderateScale(4),
  },
});
