import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },

  backBtn: {
    marginTop: moderateScale(12),
    marginLeft: moderateScale(20),
    alignSelf: 'flex-start',
  },

  content: {
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(40),
  },

  title: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    color: '#111827',
    marginBottom: moderateScale(24),
  },

  field: {
    marginBottom: moderateScale(16),
  },

  fieldHalf: {
    flex: 1,
  },

  label: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#111827',
    marginBottom: moderateScale(6),
  },

  row: {
    flexDirection: 'row',
    gap: moderateScale(10),
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(8),
    height: moderateScale(50),
    paddingHorizontal: moderateScale(14),
    fontSize: moderateScale(14),
    color: '#111827',
    backgroundColor: '#fff',
  },

  halfInput: {
    flex: 1,
  },

  iconInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(8),
    height: moderateScale(50),
    paddingHorizontal: moderateScale(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  inputText: {
    fontSize: moderateScale(14),
    color: '#111827',
    flex: 1,
  },

  placeholder: {
    color: '#9CA3AF',
  },

  terms: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    lineHeight: moderateScale(18),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(20),
  },

  termsBold: {
    fontWeight: '700',
    color: '#111827',
  },

  continueBtn: {
    backgroundColor: '#000',
    borderRadius: moderateScale(10),
  },

  /* State modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    maxHeight: '60%',
    paddingTop: moderateScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: moderateScale(12),
  },
  stateItem: {
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(24),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  stateItemText: {
    fontSize: moderateScale(14),
    color: '#374151',
  },
  stateItemActive: {
    fontWeight: '700',
    color: '#111827',
  },
});
