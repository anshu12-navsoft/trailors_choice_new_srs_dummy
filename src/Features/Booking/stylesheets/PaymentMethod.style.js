import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import colors from '../../../Constants/Colors';
export const styles = StyleSheet.create({
  footerTotal: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: colors.textPrimary,
    paddingBottom: moderateScale(10),
  },
 screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
     backgroundColor:colors.surface
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  form: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor:colors.surface
  },

  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },

  outline: {
    borderRadius: 10,
    borderColor: '#D1D5DB',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  footer:{
    paddingHorizontal:moderateScale(15)
  }
});
