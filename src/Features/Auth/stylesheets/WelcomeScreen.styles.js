import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  /* Hero */
  hero: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'flex-start',
    paddingTop: moderateScale(48),
    paddingHorizontal: moderateScale(20),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  logoText: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  logoTrailer: {
    color: '#1A1A2E',
  },
  logoChoices: {
    color: '#CC2229',
    fontStyle: 'italic',
  },

  /* Sheet */
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(28),
    gap: moderateScale(12),
  },
  heading: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    color: '#111827',
    lineHeight: moderateScale(34),
    marginBottom: moderateScale(8),
  },

  phoneBtn: {
    backgroundColor: '#000',
    borderRadius: moderateScale(10),
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    marginVertical: moderateScale(2),
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D1D5DB',
  },
  orText: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    fontWeight: '500',
  },

  socialBtn: {
    borderRadius: moderateScale(10),
    borderColor: '#D1D5DB',
  },
});
