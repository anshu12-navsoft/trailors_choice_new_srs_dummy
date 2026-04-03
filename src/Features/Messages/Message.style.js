import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  title: { fontSize: moderateScale(20), fontWeight: '600', flex: 1 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    backgroundColor: '#fff',
  },

  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(16) },

  body: { flex: 1 },
  bodyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bodyBottom: { flexDirection: 'row', alignItems: 'center' },

  name: { fontWeight: '600', fontSize: moderateScale(14), flex: 1 },
  time: { fontSize: moderateScale(11), color: '#999' },
  preview: { fontSize: moderateScale(13), color: '#666', flex: 1 },

  badge: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  badgeText: { color: '#fff', fontSize: moderateScale(10), fontWeight: '700' },

  separator: { height: 1, backgroundColor: '#F5F5F5', marginLeft: moderateScale(76) },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#999', fontSize: moderateScale(14) },

  avatarGroup: { backgroundColor: '#7C3AED' },

  fab: {
    position: 'absolute',
    bottom: moderateScale(24),
    right: moderateScale(20),
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});