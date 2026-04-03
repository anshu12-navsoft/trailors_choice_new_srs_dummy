import { StyleSheet } from 'react-native';
import colors from '../../Constants/Colors';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  scroll: {
    padding: moderateScale(20),
    paddingBottom: moderateScale(40),
  },

  // Header
  header: {
    marginBottom: moderateScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    marginTop: moderateScale(4),
  },

  // Amount card
  amountCard: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  amountValue: {
    color: '#FFFFFF',
    fontSize: moderateScale(22),
    fontWeight: '700',
  },

  // Card preview
  cardPreview: {
    backgroundColor: colors.primaryDark,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: moderateScale(24),
    minHeight: moderateScale(160),
    justifyContent: 'space-between',
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  cardPreviewBank: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardTypeLabel: {
    color: '#FFFFFF',
    fontSize: moderateScale(13),
    fontWeight: '700',
    letterSpacing: 2,
    opacity: 0.9,
  },
  cardPreviewNumber: {
    color: '#FFFFFF',
    fontSize: moderateScale(18),
    letterSpacing: 3,
    fontWeight: '500',
    marginBottom: moderateScale(20),
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: moderateScale(9),
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardPreviewValue: {
    color: '#FFFFFF',
    fontSize: moderateScale(13),
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Form
  form: {
    marginBottom: moderateScale(24),
  },
  label: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: moderateScale(6),
    marginTop: moderateScale(14),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    fontSize: moderateScale(15),
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  halfField: {
    flex: 1,
  },

  // Pay button
  payButton: {
    marginBottom: moderateScale(12),
  },
  secureNote: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: moderateScale(12),
  },
});