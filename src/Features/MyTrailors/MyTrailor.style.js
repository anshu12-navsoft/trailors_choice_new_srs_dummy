import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  addBtn: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    marginBottom: moderateScale(16),
    backgroundColor: '#000',
    borderRadius: moderateScale(8),
  },

  statsRow: {
    flexDirection: 'row',
    gap: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(20),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: moderateScale(4),
  },
  statValue: {
    fontSize: Fonts.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  inventoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(10),
  },
  inventoryTitle: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
  },
  countBadgeText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#6B7280',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },

  listContent: { paddingBottom: moderateScale(32) },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },

  /* Trailer row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
    gap: moderateScale(12),
  },
  dot: {
    position: 'absolute',
    top: -moderateScale(1.2),
    left: -moderateScale(1.2),
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
    borderRadius: moderateScale(6),
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
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(8),
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
    color: colors.textPrimary,
  },
  actionText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  /* Empty */
  empty: {
    alignItems: 'center',
    paddingTop: moderateScale(60),
    gap: moderateScale(8),
  },
  emptyTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: Fonts.size.sm,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: moderateScale(40),
  },
});
