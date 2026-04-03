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
  title: {
    flex: 1,
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#111',
  },
  createBtn: {
    backgroundColor: '#E53935',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
  },
  createBtnDisabled: { backgroundColor: '#ccc' },
  createBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: moderateScale(13),
  },

  nameInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(10),
    height: moderateScale(44),
  },
  nameInput: { flex: 1, fontSize: moderateScale(14), color: '#333' },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: moderateScale(12),
    paddingBottom: moderateScale(8),
    gap: moderateScale(6),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  chipText: { color: '#fff', fontSize: moderateScale(12), fontWeight: '500' },

  sectionLabel: {
    fontSize: moderateScale(12),
    color: '#999',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
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
  avatarText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(16) },
  name: { flex: 1, fontSize: moderateScale(15), color: '#222' },

  checkbox: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: '#E53935', borderColor: '#E53935' },

  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: moderateScale(72),
  },
});
