import { StyleSheet } from 'react-native';
import colors from '../../../Constants/Colors';
import { moderateScale, verticalScale } from 'react-native-size-matters';
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // header
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

  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(40),
  },

  // status banner
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(10),
    padding: moderateScale(14),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(20),
  },
  statusTextWrap: { flex: 1 },
  statusLabel: {
    fontSize: Fonts.size.sm,
    fontWeight: '700',
    marginBottom: moderateScale(2),
  },
  statusHint: {
    fontSize: Fonts.size.xs,
    color: colors.textSecondary,
    lineHeight: Fonts.lineHeight(12),
  },

  // steps
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(24),
  },
  stepItem: { alignItems: 'center', gap: moderateScale(4) },
  stepDot: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepDotDone: { backgroundColor: colors.success, borderColor: colors.success },
  stepNum: {
    fontSize: Fonts.size.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepLabel: { fontSize: Fonts.size.xs, color: colors.textDisabled },
  stepLabelActive: { color: colors.textPrimary, fontWeight: '600' },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: moderateScale(4),
    marginBottom: moderateScale(14),
  },
  stepLineDone: { backgroundColor: colors.success },

  // section
  sectionTitle: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: moderateScale(4),
  },
  sectionSub: {
    fontSize: Fonts.size.xs,
    color: colors.textSecondary,
    marginBottom: moderateScale(16),
    lineHeight: Fonts.lineHeight(12),
  },

  // upload cards
  uploadRow: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginBottom: moderateScale(20),
  },
  uploadCard: {
    flex: 1,
    height: verticalScale(130),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
    padding: moderateScale(10),
  },
  uploadPreview: { width: '100%', height: '100%' },
  uploadLabel: {
    fontSize: Fonts.size.xs,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  uploadSublabel: {
    fontSize: Fonts.size.xs,
    color: colors.textDisabled,
    textAlign: 'center',
  },
  uploadEditBadge: {
    position: 'absolute',
    bottom: moderateScale(6),
    right: moderateScale(6),
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // expiry
  fieldLabel: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: moderateScale(8),
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    marginBottom: moderateScale(20),
    backgroundColor: colors.surface,
  },
  expiryInput: {
    flex: 1,
    fontSize: Fonts.size.md,
    color: colors.textPrimary,
  },

  // requirements
  requirementsBox: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    marginBottom: moderateScale(16),
    gap: moderateScale(8),
  },
  requirementsTitle: {
    fontSize: Fonts.size.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: moderateScale(4),
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  requirementText: {
    fontSize: Fonts.size.xs,
    color: colors.textSecondary,
    flex: 1,
  },

  // restriction notice
  restrictionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    backgroundColor: '#FEF3C7',
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: moderateScale(20),
  },
  restrictionText: {
    flex: 1,
    fontSize: Fonts.size.xs,
    color: '#92400E',
    lineHeight: Fonts.lineHeight(12),
  },

  submitBtn: { marginBottom: moderateScale(12) },

  // approved footer
  approvedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    padding: moderateScale(16),
  },
  approvedText: {
    fontSize: Fonts.size.sm,
    color: colors.success,
    fontWeight: '600',
  },
});
