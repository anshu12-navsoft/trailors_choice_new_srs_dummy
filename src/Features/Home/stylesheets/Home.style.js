import { StyleSheet, useWindowDimensions } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    // paddingTop: 0,
    paddingBottom: moderateScale(6),
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoT: {
    fontSize: moderateScale(26),
    fontWeight: '900',
    color: '#E53935',
    letterSpacing: -1,
  },
  logoC: {
    fontSize: moderateScale(26),
    fontWeight: '900',
    color: '#1565C0',
    letterSpacing: -1,
  },

  /* Search */
  searchBar: {
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(16),
  },

  /* Categories */
  categoriesRow: {
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(12),
    paddingBottom: moderateScale(8),
  },
  categoryItem: {
    alignItems: 'center',
    width: moderateScale(100),
  },
  categoryImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(10),
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(6),
  },
  categoryLabel: {
    textAlign: 'center',
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(12),
  },

  /* Grid */
  gridContainer: {
    paddingHorizontal: moderateScale(12),
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: moderateScale(12),
  },

  /* Trailer card */
  trailerCard: {
    width: '48%',
    padding: 0,
  },
  trailerImage: {
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: moderateScale(8),
  },
  caption: {
    paddingHorizontal: moderateScale(4),
    paddingBottom: moderateScale(4),
    gap: moderateScale(2),
  },
  trailerTitle: {
    fontWeight: '700',
    marginBottom: moderateScale(2),
  },
  priceRow: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginTop: moderateScale(4),
  },
  priceBold: {
    fontWeight: '700',
  },
});
