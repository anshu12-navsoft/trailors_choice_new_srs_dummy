import { StyleSheet, Platform } from 'react-native';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(24),
    justifyContent: 'space-between',
    paddingBottom: verticalScale(24),
  },

  /* ── Logo ── */
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(20),
    gap: moderateScale(12),
  },
  logoIconWrapper: {
    width: moderateScale(52),
    height: moderateScale(52),
    backgroundColor: '#1A2B6D',
    borderRadius: moderateScale(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTC: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '800',
    letterSpacing: 1,
  },
  logoTextWrapper: {
    flex: 1,
  },
  logoTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  logoTrailer: {
    color: '#1A2B6D',
    fontWeight: '800',
  },
  logoChoices: {
    color: '#E53935',
    fontWeight: '800',
    fontStyle: 'italic',
  },
  logoRegistered: {
    color: '#1A2B6D',
    fontSize: moderateScale(10),
    fontWeight: '400',
  },
  logoTaglineEn: {
    fontSize: moderateScale(10),
    color: '#444',
    marginTop: verticalScale(2),
  },
  logoTaglineEs: {
    fontSize: moderateScale(9),
    color: '#888',
    fontStyle: 'italic',
  },

  /* ── Hero ── */
  heroWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(16),
    gap: moderateScale(16),
  },
  trailerPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: moderateScale(8),
  },
  trailerLeft: {
    width: scale(130),
    height: verticalScale(110),
  },
  trailerRight: {
    width: scale(120),
    height: verticalScale(100),
  },
  placeholderText: {
    fontSize: moderateScale(48),
  },

  /* ── Language ── */
  languageRow: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    backgroundColor: '#fff',
  },
  langButtonSelected: {
    borderColor: '#1A2B6D',
    backgroundColor: '#EEF1FB',
  },
  flagEmoji: {
    fontSize: moderateScale(20),
  },
  langLabel: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#333',
  },
  langLabelSelected: {
    color: '#1A2B6D',
    fontWeight: '700',
  },

  /* ── Continue Button ── */
  continueButton: {
    backgroundColor: '#E53935',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E53935',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  continueButtonPressed: {
    backgroundColor: '#C62828',
  },
  continueLabel: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});