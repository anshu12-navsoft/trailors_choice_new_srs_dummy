import { moderateScale } from 'react-native-size-matters';
import { StyleSheet } from 'react-native';
import colors from '../../../Constants/Colors';
export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  /* Images */
  imageList: {
    marginTop:20,
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(10),
  },
  imagePlaceholder: {
    width: moderateScale(300),
    height: moderateScale(250),
    backgroundColor: '#E5E7EB',
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
  },

  /* Status row */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
  },
  badge: {
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
  },
  badgeText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  receiptText: {
    fontSize: moderateScale(14),
    color: colors.bubbleMine,
  },

  title: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: '#111827',
    marginBottom: moderateScale(4),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: moderateScale(16),
  },

  /* Host */
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  avatar: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: '#D1D5DB',
  },
  hostText: {
    fontSize: moderateScale(14),
    color: '#374151',
  },
  hostName: {
    fontWeight: '700',
    color: '#111827',
  },

  /* Review */
  reviewBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    marginBottom: moderateScale(24),
  },
  reviewQuestion: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#111827',
    marginBottom: moderateScale(5),
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(2),
  },
  leaveReview: {
    fontSize: moderateScale(13),
    color: colors.primaryDark,
    marginLeft: moderateScale(6),
  },

  /* Section title */
  sectionTitle: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    color: '#111827',
    marginBottom: moderateScale(12),
  },

  /* Info cards */
  infoCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: moderateScale(10),
    padding: moderateScale(14),
    marginBottom: moderateScale(10),
  },
  infoLabel: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#111827',
    marginBottom: moderateScale(6),
  },
  infoValue: {
    fontSize: moderateScale(14),
    color: '#374151',
  },
  infoAddress: {
    fontSize: moderateScale(13),
    color: '#374151',
    marginBottom: moderateScale(12),
  },
  map: {
    height: moderateScale(150),
    borderRadius: moderateScale(8),
  },

  /* Price card */
  priceCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
  },
  priceLabel: {
    fontSize: moderateScale(14),
    color: '#374151',
  },
  priceValue: {
    fontSize: moderateScale(14),
    color: '#374151',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: moderateScale(15),
    fontWeight: '800',
    color: '#111827',
  },
  totalValue: {
    fontSize: moderateScale(15),
    fontWeight: '800',
    color: '#111827',
  },
});