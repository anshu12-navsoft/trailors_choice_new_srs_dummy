import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(4),
  },

  skip: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#111827',
  },

  content: {
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(40),
  },

  title: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    color: '#111827',
    marginBottom: moderateScale(24),
  },

  sectionLabel: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#111827',
    marginBottom: moderateScale(8),
  },

  uploadBox: {
    width: '100%',
    height: moderateScale(110),
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(20),
    overflow: 'hidden',
  },

  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  uploadPlaceholder: {
    fontSize: moderateScale(14),
    color: '#9CA3AF',
  },

  textArea: {
    backgroundColor: '#fff',
    marginBottom: moderateScale(28),
    minHeight: moderateScale(140),
  },

  textAreaOutline: {
    borderRadius: moderateScale(10),
    borderColor: '#D1D5DB',
  },

  textAreaContent: {
    fontSize: moderateScale(14),
    textAlignVertical: 'top',
    paddingTop: moderateScale(10),
  },

  saveBtn: {
    backgroundColor: '#000',
    borderRadius: moderateScale(10),
  },

  uploadInner: {
    alignItems: 'center',
    gap: moderateScale(6),
  },

  declareRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(10),
    marginBottom: moderateScale(24),
  },

  checkbox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(4),
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(1),
    flexShrink: 0,
  },

  checkboxActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },

  declareText: {
    flex: 1,
    fontSize: moderateScale(13),
    color: '#374151',
    lineHeight: moderateScale(20),
  },
});
