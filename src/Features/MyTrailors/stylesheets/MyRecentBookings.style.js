import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10),
    padding: moderateScale(4),
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(10),
    marginTop: moderateScale(10),
  },
  toggleTab: {
    flex: 1,
    paddingVertical: moderateScale(8),
    alignItems: 'center',
    borderRadius: moderateScale(8),
  },
  toggleTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toggleText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#9CA3AF',
  },
  toggleTextActive: {
    color: '#111827',
    fontWeight: '700',
  },

  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(32),
    paddingTop: moderateScale(4),
  },

  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#D1D5DB',
  },

  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  date: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  extra: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  statusRequested: { color: '#2563EB', fontWeight: '600', fontSize: 13 },
  statusInProgress: { color: '#2563EB', fontWeight: '600', fontSize: 13 },
  statusConfirmed: { color: '#16A34A', fontWeight: '600', fontSize: 13 },
  statusCancelled: { color: '#EF4444', fontWeight: '600', fontSize: 13 },
  statusCompleted: { color: '#16A34A', fontWeight: '600', fontSize: 13 },

  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },

  acceptBtn: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    paddingVertical: 11,
    borderRadius: 24,
    alignItems: 'center',
  },

  declineBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 11,
    borderRadius: 24,
    alignItems: 'center',
  },

  acceptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  declineText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },

  singleBtn: {
    marginTop: 12,
    backgroundColor: '#EFF2F7',
    paddingVertical: 11,
    borderRadius: 24,
    alignItems: 'center',
  },

  singleBtnText: {
    fontWeight: '600',
    color: '#2563EB',
    fontSize: 14,
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },

  rateText: {
    color: '#2563EB',
    fontWeight: '500',
    fontSize: 13,
  },
});
