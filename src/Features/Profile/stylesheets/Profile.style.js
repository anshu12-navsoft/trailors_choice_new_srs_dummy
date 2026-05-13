import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingBottom: moderateScale(32),
  },

  /* Profile header */
  profileSection: {
    alignItems: 'center',
    paddingTop: moderateScale(24),
    paddingBottom: moderateScale(20),
    paddingHorizontal: moderateScale(16),
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: moderateScale(12),
  },
  avatar: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    backgroundColor: '#D9D9D9',
  },
  avatarImage: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
  },
  pencilBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#111827',
    marginBottom: moderateScale(4),
  },
  memberSince: {
    fontSize: moderateScale(13),
    color: '#6B7280',
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: moderateScale(16),
  },

  /* Menu */
  menuGroup: {
    paddingVertical: moderateScale(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(6),
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(14),
  },
  iconBox: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(8),
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: moderateScale(15),
    color: '#111827',
    fontWeight: '500',
  },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(24),
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#E53935',
  },
});
