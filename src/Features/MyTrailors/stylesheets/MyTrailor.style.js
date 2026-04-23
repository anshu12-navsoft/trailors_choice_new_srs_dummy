import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import colors from '../../../Constants/Colors';
import Fonts from '../../../Theme/Fonts';

const THUMB_SIZE = Dimensions.get('window').width * 0.27;
const BOOKING_THUMB = moderateScale(58);
const AVATAR_SIZE = moderateScale(50);

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  scrollContent: { paddingBottom: moderateScale(32) },

  /* ── Page Header ─────────────────────────────────────────────────── */
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
   
  },
  backBtn: {
    padding: moderateScale(4),
    marginRight: moderateScale(8),
  },
  headerInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: Fonts.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  businessLocation: {
    fontSize: Fonts.size.sm,
    color: colors.textSecondary,
    marginTop: moderateScale(1),
  },
  headerRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRatingText: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: '#F59E0B',
  },

  /* ── Add Button ──────────────────────────────────────────────────── */
  addBtn: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    marginBottom: moderateScale(4),
    borderRadius: moderateScale(10),
  },

  /* ── Lifetime Earnings card ──────────────────────────────────────── */
  earningsCard: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    backgroundColor: '#E8F0FE',
    borderRadius: moderateScale(14),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(16),
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: moderateScale(6),
  },
  earningsValue: {
    fontSize: Fonts.size.xxxl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  earningsDivider: {
   
    
    // marginTop: moderateScale(14),
    marginBottom: moderateScale(14),
  },
  earningsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  earningsCol: {
    flex: 1,
    alignItems: 'center',
  },
  earningsColDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#BFDBFE',
  },
  payoutLabel: {
    fontSize: moderateScale(9),
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: moderateScale(4),
  },
  payoutValue: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  /* ── Download links ──────────────────────────────────────────────── */
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
  },
  downloadText: {
    fontSize: Fonts.size.sm,
    fontWeight: '500',
    color: colors.primary,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: moderateScale(16),
  },

  /* ── Rating & Trust Score card ───────────────────────────────────── */
  ratingInfoCard: {
    flexDirection: 'row',
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(20),
    marginBottom: moderateScale(8),
   backgroundColor: '#E8F0FE',
    borderRadius: moderateScale(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: moderateScale(25),
  },
  ratingSection: {
    flex: 1,
    alignItems: 'center',
  },
  ratingInfoLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: moderateScale(6),
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingInfoValue: {
   fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ratingCardDivider: {
    width:1,
    backgroundColor: colors.border,
  },

  /* ── Section headers ─────────────────────────────────────────────── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(30),
    paddingBottom: moderateScale(18),
  },
  sectionTitle: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: colors.primaryDark,
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

  /* ── Booking card ────────────────────────────────────────────────── */
  bookingCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: moderateScale(14),
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(10),
    padding: moderateScale(14),
    gap: moderateScale(12),
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  personAvatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  personAvatarImg: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  bookingInfo: {
    flex: 1,
    gap: moderateScale(3),
  },
  personName: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bookingDates: {
    fontSize: Fonts.size.sm,
    color: colors.textSecondary,
  },
  bookingThumb: {
    width: BOOKING_THUMB,
    height: BOOKING_THUMB,
    borderRadius: moderateScale(8),
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: moderateScale(10),
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    borderRadius: moderateScale(24),
    paddingVertical: moderateScale(10),
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: '#fff',
  },
  declineBtn: {
    flex: 1,
    backgroundColor: '#FFE4E6',
    borderRadius: moderateScale(24),
    paddingVertical: moderateScale(10),
    alignItems: 'center',
  },
  declineBtnText: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: '#E53935',
  },
});
