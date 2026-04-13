import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#111827',
  },

  toggleWrapper: {
    marginTop:moderateScale(20),
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(12),
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10),
    padding: moderateScale(4),
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

  list: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(20),
    gap: moderateScale(12),
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTop: {
    flexDirection: 'row',
    padding: moderateScale(14),
    gap: moderateScale(12),
  },
  cardInfo: {
    flex: 1,
    gap: moderateScale(6),
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#111827',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  dateText: {
    fontSize: moderateScale(13),
    color: '#6B7280',
  },
  imagePlaceholder: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(8),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: { height: 1, backgroundColor: '#F3F4F6' },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
  },
  price: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#111827',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },

  empty: {
    alignItems: 'center',
    paddingTop: moderateScale(60),
    gap: moderateScale(10),
  },
  emptyText: {
    fontSize: moderateScale(15),
    color: '#9CA3AF',
  },
});
