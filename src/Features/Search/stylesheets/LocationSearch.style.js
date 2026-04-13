import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(8),
    paddingTop: moderateScale(4),
  },
  searchWrapper: {
    marginTop:moderateScale(20),
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(8),
  },
  listContent: {
    paddingHorizontal: moderateScale(16),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(12),
    gap: moderateScale(14),
  },
  iconBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: moderateScale(2),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: moderateScale(54),
  },
});