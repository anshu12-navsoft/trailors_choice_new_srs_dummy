import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: moderateScale(12),
  },
  title: { fontSize: moderateScale(18), fontWeight: '600', color: '#111' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(10),
    height: moderateScale(40),
  },
  searchInput: { flex: 1, fontSize: moderateScale(14), color: '#333' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: moderateScale(4),
  },

  avatar: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  groupAvatar: { backgroundColor: '#7C3AED' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(16) },

  name: { flex: 1, fontSize: moderateScale(15), color: '#222' },
  groupLabel: {
    flex: 1,
    fontSize: moderateScale(15),
    color: '#222',
    fontWeight: '500',
  },

  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: moderateScale(72),
  },
});
