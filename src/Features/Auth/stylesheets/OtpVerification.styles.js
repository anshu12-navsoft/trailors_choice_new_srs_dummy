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
    marginBottom: moderateScale(10),
  },

  subtitle: {
    fontSize: moderateScale(14),
    color: '#374151',
    lineHeight: moderateScale(22),
    marginBottom: moderateScale(28),
  },

  phone: {
    fontWeight: '600',
    color: '#111827',
  },

  otpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(12),
    height: moderateScale(56),
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(20),
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  otpSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otpChar: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 0,
  },

  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(24),
  },

  resendLabel: {
    fontSize: moderateScale(13),
    color: '#374151',
  },

  resendLink: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#111827',
  },

  resendDisabled: {
    color: '#9CA3AF',
    fontWeight: '400',
  },

  continueBtn: {
    backgroundColor: '#000',
    borderRadius: moderateScale(10),
  },
});
