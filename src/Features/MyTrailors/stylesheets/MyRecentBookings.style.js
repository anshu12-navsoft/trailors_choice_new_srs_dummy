import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import colors from '../../../Constants/Colors';
import Fonts from '../../../Theme/Fonts';

const THUMB_SIZE = Dimensions.get('window').width * 0.27;
const BOOKING_THUMB = moderateScale(58);
const AVATAR_SIZE = moderateScale(50);

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  scrollContent: {
    paddingBottom: moderateScale(32),
    margin: moderateScale(10),
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
  backgroundColor: '#D1D5DB',
  marginRight: 10,
},

name: {
  fontSize: 15,
  fontWeight: '600',
},

date: {
  fontSize: 13,
  color: '#6B7280',
},

extra: {
  fontSize: 12,
  color: '#6B7280',
},

actionRow: {
  flexDirection: 'row',
  marginTop: 12,
  gap: 10,
},

acceptBtn: {
  flex: 1,
  backgroundColor: '#1E3A5F',
  padding: 10,
  borderRadius: 20,
  alignItems: 'center',
},

declineBtn: {
  flex: 1,
  backgroundColor: '#FEE2E2',
  padding: 10,
  borderRadius: 20,
  alignItems: 'center',
},

acceptText: {
  color: '#fff',
  fontWeight: '600',
},

declineText: {
  color: '#DC2626',
  fontWeight: '600',
},

singleBtn: {
  marginTop: 12,
  backgroundColor: '#E5E7EB',
  padding: 10,
  borderRadius: 20,
  alignItems: 'center',
},

singleBtnText: {
  fontWeight: '600',
  color: '#2563EB',
},

ratingRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 12,
},

rateText: {
  color: '#2563EB',
  fontWeight: '500',
},

  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10),
    padding: moderateScale(4),
    marginBottom: moderateScale(10),
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
  topSection: {
    flexDirection: 'row',
  },

  bookingSection: {
    alignItems: 'center',
    paddingVertical: moderateScale(10),
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginBottom: moderateScale(6),
  },

  bookingText: {
    fontSize: moderateScale(12),
    color: '#2563EB',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#F9FAFB', // 🔥 light grey like screenshot
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },

  topSection: {
    padding: 12,
  },

  row: {
    flexDirection: 'row',
  },

  thumbWrapper: {
    position: 'relative',
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: -3,
    left: -3,
    borderWidth: 2,
    borderColor: '#fff',
  },

  body: {
    marginLeft: 12,
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  earnings: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#374151',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12, // 🔥 inset divider like screenshot
  },

  bottomStrip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookingText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
    marginRight: 4,
  },
});
