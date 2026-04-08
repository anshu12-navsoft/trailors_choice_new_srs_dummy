import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import colors from '../../../Constants/Colors';
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  headerBtn: { width: moderateScale(36) },
  headerTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  scroll: { paddingBottom: moderateScale(40) },

  // carousel
  carousel: { height: verticalScale(220), marginTop: moderateScale(20) },
  photoSlide: {
    width: CARD_WIDTH,
    height: verticalScale(220),
    backgroundColor: colors.surface,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%' },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(16) },

  // name row
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(4),
  },
  trailerName: {
    fontSize: Fonts.size.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  activeBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeBadgeText: {
    fontSize: Fonts.size.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },

  address: {
    fontSize: Fonts.size.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dimensions: {
    fontSize: Fonts.size.sm,
    color: colors.textSecondary,
    marginBottom: moderateScale(12),
  },

  // pricing
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },

  // cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(10),
  },
  cardRow: { gap: moderateScale(12) },
  cardLeft: { flex: 1 },
  cardTitle: {
    fontSize: Fonts.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardSub: {
    fontSize: Fonts.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // section
  section: {
    marginTop: moderateScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
  },
  sectionTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  periodPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  periodText: { fontSize: Fonts.size.sm, color: colors.textSecondary },

  perfBox: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    marginTop: moderateScale(10),
  },

  // stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: moderateScale(4),
    marginBottom: moderateScale(8),
  },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: {
    width: 1,
    height: moderateScale(32),
    backgroundColor: colors.border,
  },
  statLabel: {
    fontSize: Fonts.size.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: Fonts.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  chartBox: {
    marginTop: moderateScale(8),
  },

  // bookings
  bookingsList: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // view all specs
  viewAllBtn: {
    marginTop: moderateScale(12),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
