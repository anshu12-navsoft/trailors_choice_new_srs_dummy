import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import colors from '../../Constants/Colors';


export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  // top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  backBtn: { width: moderateScale(36) },
  topBarTitle: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  scroll: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(40),
  },

  // status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(16),
    paddingHorizontal: moderateScale(4),
  },
  statusLabel: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(20),
    gap: moderateScale(5),
  },
  statusDot: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: moderateScale(4),
  },
  statusText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },

  // photo
  photoSection: {
    alignItems: 'center',
    marginTop: moderateScale(20),
    marginBottom: moderateScale(4),
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: moderateScale(88),
    height: moderateScale(88),
    borderRadius: moderateScale(44),
  },
  avatarPlaceholder: {
    width: moderateScale(88),
    height: moderateScale(88),
    borderRadius: moderateScale(44),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  photoHint: {
    marginTop: moderateScale(8),
    fontSize: moderateScale(12),
    color: colors.textSecondary,
  },

  // address row
  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  halfInput: { flex: 1 },

  // DOB wrapper — normalise width/margin from DateTimePicker's own styles
  dobWrapper: {
    width: '100%',
    marginBottom: moderateScale(4),
  },

  saveBtn: { marginTop: moderateScale(28) },
});
