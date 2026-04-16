import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../Theme/Fonts';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },

  backBtn: {
    marginTop: moderateScale(12),
    marginLeft: moderateScale(20),
    alignSelf: 'flex-start',
  },

  content: {
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(24),
  },

  title: {
    fontSize: Fonts.size.xxl,
    fontWeight: '800',
    color: '#111827',
    marginBottom: moderateScale(24),
  },

  label: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#374151',
    marginBottom: moderateScale(8),
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: moderateScale(52),
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRightWidth: 0,
    borderTopLeftRadius: moderateScale(8),
    borderBottomLeftRadius: moderateScale(8),
    backgroundColor: '#fff',
    gap: moderateScale(4),
  },

  callingCode: {
    fontSize: moderateScale(15),
    color: '#111827',
    fontWeight: '500',
  },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    height: moderateScale(52),
  },
  inputOutline: {
    borderRadius: 0,
    borderTopRightRadius: moderateScale(8),
    borderBottomRightRadius: moderateScale(8),
    borderColor: '#D1D5DB',
  },
  inputContent: {
    fontSize: moderateScale(15),
  },

  hint: {
    fontSize: moderateScale(11),
    color: '#9CA3AF',
    marginTop: moderateScale(6),
    marginBottom: moderateScale(16),
    textAlign: 'right',
  },

  continueBtn: {
    backgroundColor: '#000',
    borderRadius: moderateScale(10),
    marginTop:moderateScale(20)
  },
});
