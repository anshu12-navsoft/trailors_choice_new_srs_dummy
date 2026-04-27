import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import colors from '../../../Constants/Colors';
import Fonts from '../../../Theme/Fonts';

const THUMB_SIZE = Dimensions.get('window').width * 0.27;
const BOOKING_THUMB = moderateScale(58);
const AVATAR_SIZE = moderateScale(50);

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  scrollContent: {
    paddingBottom: moderateScale(32),
    margin: moderateScale(10),
  },

  /* ── Trailer row ─────────────────────────────────────────────────── */
  trailerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(14),
    gap: moderateScale(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: moderateScale(14),
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(10),
  },
  dot: {
    position: 'absolute',
    top: -moderateScale(1.5),
    left: -moderateScale(1.5),
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    borderWidth: 2,
    borderColor: '#fff',
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: moderateScale(8),
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: moderateScale(4),
  },
  trailerName: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  earnings: {
    fontSize: Fonts.size.sm,
    color: '#6B7280',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(3),
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(6),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
  },
  ratingText: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: '#F59E0B',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10),
    padding: moderateScale(4),
    marginBottom: moderateScale(10),
  },
  toggleTab: {
    flex: 1,
    paddingVertical: moderateScale(8),
    alignItems: 'center',
    borderRadius: moderateScale(8),
  },
  toggleTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toggleText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#9CA3AF',
  },
  toggleTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  topSection: {
    flexDirection: 'row',
  },

  bookingSection: {
    alignItems: 'center',
    paddingVertical: moderateScale(10),
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginBottom: moderateScale(6),
  },

  bookingText: {
    fontSize: moderateScale(12),
    color: '#2563EB',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#F9FAFB', // 🔥 light grey like screenshot
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },

  topSection: {
    padding: 12,
  },

  row: {
    flexDirection: 'row',
  },

  thumbWrapper: {
    position: 'relative',
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },

  body: {
    marginLeft: 12,
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  earnings: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#374151',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12, // 🔥 inset divider like screenshot
  },

  bottomStrip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookingText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
    marginRight: 4,
  },
});
