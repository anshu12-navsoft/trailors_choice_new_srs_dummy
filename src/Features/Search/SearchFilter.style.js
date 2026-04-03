import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
export const styles = StyleSheet.create({
  safe: { flex: 1 },
  closeRow: {
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(8),
    paddingTop: moderateScale(4),
  },
  content: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(8),
    gap: moderateScale(20),
  },
  fieldLabel: {
    fontWeight: '600',
    marginBottom: moderateScale(6),
  },
  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
    alignItems: 'flex-end',
  },
  halfField: { flex: 1 },
  triggerWrapper: { flex: 1 },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    height: moderateScale(48),
    backgroundColor: '#fff',
  },
  footer: { padding: moderateScale(16) },
  searchBtn: {
    borderRadius: moderateScale(8),
    backgroundColor: '#000',
  },
});
