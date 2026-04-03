import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import colors from '../../Constants/Colors';
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  backBtn: { width: moderateScale(36) },
  headerTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  content: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(40),
  },

  sectionHeader: {
    fontSize: Fonts.size.xs,
    fontWeight: '700',
    color: colors.textDisabled,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: verticalScale(24),
    marginBottom: verticalScale(8),
    marginLeft: moderateScale(4),
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(13),
    gap: moderateScale(12),
    backgroundColor: colors.surface,
  },
  rowPressed: { backgroundColor: colors.border },
  iconWrap: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(10),
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDanger: { backgroundColor: '#FEE2E2' },
  rowBody: { flex: 1 },
  rowLabel: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rowSub: {
    fontSize: Fonts.size.xs,
    color: colors.textSecondary,
    marginTop: moderateScale(2),
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: moderateScale(60),
  },

  version: {
    textAlign: 'center',
    fontSize: Fonts.size.xs,
    color: colors.textDisabled,
    marginTop: verticalScale(32),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(36),
    paddingTop: moderateScale(12),
  },
  modalHandle: {
    width: moderateScale(40),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: moderateScale(16),
  },
  modalTitle: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: moderateScale(12),
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(14),
  },
  langOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  langOptionLeft: { gap: moderateScale(2) },
  langLabel: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  langNative: {
    fontSize: Fonts.size.xs,
    color: colors.textSecondary,
  },
});
