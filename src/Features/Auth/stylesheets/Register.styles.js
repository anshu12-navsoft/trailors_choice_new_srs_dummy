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
    marginBottom: moderateScale(20),
  },

  /* ── Tab switcher ── */
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10),
    padding: moderateScale(4),
    marginBottom: moderateScale(24),
  },

  tab: {
    flex: 1,
    paddingVertical: moderateScale(9),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },

  tabText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: '#6B7280',
  },

  tabTextActive: {
    fontWeight: '700',
    color: '#111827',
  },

  /* ── Fields ── */
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

  /* ── Upload box (owner logo) ── */
  uploadBox: {
    borderRadius: moderateScale(10),
    backgroundColor: '#EEF2FF',
    height: moderateScale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadPlaceholder: {
    alignItems: 'center',
    gap: moderateScale(6),
  },

  uploadLabel: {
    fontSize: moderateScale(13),
    color: '#3B5BDB',
    fontWeight: '500',
  },

  uploadedText: {
    fontSize: moderateScale(13),
    color: '#374151',
    paddingHorizontal: moderateScale(16),
  },

  /* ── Terms ── */
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
    marginTop: moderateScale(4),
  },

  /* ── State / type picker modal ── */
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
