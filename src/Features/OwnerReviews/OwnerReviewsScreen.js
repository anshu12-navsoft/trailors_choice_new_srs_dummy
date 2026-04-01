import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';

const REVIEWS = [
  { id: 'RV001', renterName: 'Alex Johnson', renterInitial: 'A', rating: 5, trailerName: 'Heavy Duty Flatbed', date: 'Mar 24, 2025', text: 'John was fantastic! The trailer was exactly as described, clean and well-maintained. Pickup and return were smooth. Will definitely book again!', helpful: 3 },
  { id: 'RV002', renterName: 'Maria Lopez', renterInitial: 'M', rating: 4, trailerName: 'Enclosed Cargo 7x14', date: 'Mar 12, 2025', text: 'Great experience overall. The trailer was in excellent condition. John responded quickly to all my messages. Minor issue with the latch but nothing major.', helpful: 1 },
  { id: 'RV003', renterName: 'Sandra Kim', renterInitial: 'S', rating: 5, trailerName: 'Heavy Duty Flatbed', date: 'Mar 2, 2025', text: 'Perfect trailer for our move. Very spacious and easy to tow. John provided detailed pickup instructions which made everything seamless.', helpful: 5 },
  { id: 'RV004', renterName: 'Chris Park', renterInitial: 'C', rating: 4, trailerName: 'Dump Trailer 14ft', date: 'Feb 25, 2025', text: 'Solid trailer, worked perfectly for our landscaping project. Fair price and easy process.', helpful: 0 },
  { id: 'RV005', renterName: 'Tom Wilson', renterInitial: 'T', rating: 3, trailerName: 'Enclosed Cargo 7x14', date: 'Feb 15, 2025', text: 'Trailer was fine but pickup was slightly confusing. Communication could be clearer about directions.', helpful: 0 },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 18, percentage: 0.72 },
  { stars: 4, count: 5, percentage: 0.20 },
  { stars: 3, count: 1, percentage: 0.04 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 1, percentage: 0.04 },
];

const StarRow = ({ rating, filled = false }) => (
  <View style={staticStyles.starRow}>
    {[1, 2, 3, 4, 5].map(i => (
      <Icon key={i} name={i <= rating ? 'star' : 'star-border'} size={moderateScale(filled ? 18 : 14)} color="#F59E0B" />
    ))}
  </View>
);

const staticStyles = StyleSheet.create({
  starRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
});

const ReviewCard = ({ item }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.reviewAvatar}>
        <Text style={styles.reviewAvatarText}>{item.renterInitial}</Text>
      </View>
      <View style={styles.reviewMeta}>
        <Text style={styles.reviewRenterName}>{item.renterName}</Text>
        <View style={styles.reviewRatingRow}>
          <StarRow rating={item.rating} />
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <Text style={styles.reviewTrailer}>{item.trailerName}</Text>
      </View>
    </View>
    <Text style={styles.reviewText}>{item.text}</Text>
    <View style={styles.helpfulRow}>
      <Icon name="thumb-up-outline" size={moderateScale(14)} color={colors.textSecondary} />
      <Text style={styles.helpfulText}>{item.helpful > 0 ? t('found_helpful', { count: item.helpful }) : t('be_first_helpful')}</Text>
    </View>
  </View>
  );
};

const OwnerReviewsScreen = ({ navigation }) => {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
  const totalReviews = REVIEWS.length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('my_reviews_title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Overall Rating */}
        <View style={styles.overallCard}>
          <View style={styles.overallLeft}>
            <Text style={styles.overallRating}>{avgRating}</Text>
            <StarRow rating={Math.round(Number(avgRating))} filled />
            <Text style={styles.overallCount}>{t('reviews_count', { count: totalReviews })}</Text>
          </View>
          <View style={styles.overallRight}>
            {RATING_BREAKDOWN.map(item => (
              <View key={item.stars} style={styles.breakdownRow}>
                <Text style={styles.breakdownStar}>{item.stars}</Text>
                <Icon name="star" size={moderateScale(12)} color="#F59E0B" />
                <View style={styles.breakdownBar}>
                  <View style={[styles.breakdownFill, { width: `${item.percentage * 100}%` }]} />
                </View>
                <Text style={styles.breakdownCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trust Score */}
        <View style={styles.trustCard}>
          <Icon name="verified" size={moderateScale(24)} color={colors.success} />
          <View style={styles.trustInfo}>
            <Text style={styles.trustTitle}>{t('trust_score_label', { score: 94 })}</Text>
            <Text style={styles.trustSubtitle}>{t('trust_score_subtitle')}</Text>
          </View>
        </View>

        {/* Reviews List */}
        <Text style={styles.sectionTitle}>{t('all_reviews_section')}</Text>
        {REVIEWS.map(item => (
          <ReviewCard key={item.id} item={item} />
        ))}

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), gap: 12, borderBottomWidth: 1, borderColor: colors.border },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: moderateScale(18), fontWeight: '700', color: colors.textPrimary },
  content: { padding: moderateScale(16) },
  overallCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: moderateScale(14), padding: moderateScale(16), marginBottom: moderateScale(12), borderWidth: 1, borderColor: colors.border },
  overallLeft: { alignItems: 'center', justifyContent: 'center', paddingRight: moderateScale(16), borderRightWidth: 1, borderColor: colors.border, marginRight: moderateScale(16) },
  overallRating: { fontSize: moderateScale(48), fontWeight: '900', color: colors.textPrimary, lineHeight: moderateScale(52) },
  overallCount: { fontSize: moderateScale(12), color: colors.textSecondary },
  overallRight: { flex: 1, justifyContent: 'center', gap: 4 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  breakdownStar: { fontSize: moderateScale(12), color: colors.textSecondary, width: moderateScale(10) },
  breakdownBar: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  breakdownFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 },
  breakdownCount: { fontSize: moderateScale(11), color: colors.textSecondary, width: moderateScale(20), textAlign: 'right' },
  trustCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F0FDF4', borderRadius: moderateScale(14), padding: moderateScale(14), marginBottom: moderateScale(20), borderWidth: 1, borderColor: '#BBF7D0' },
  trustInfo: { flex: 1 },
  trustTitle: { fontSize: moderateScale(15), fontWeight: '700', color: colors.success },
  trustSubtitle: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  sectionTitle: { fontSize: moderateScale(16), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(12) },
  reviewCard: { backgroundColor: '#fff', borderRadius: moderateScale(14), padding: moderateScale(14), marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  reviewAvatar: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: '#fff', fontSize: moderateScale(16), fontWeight: '700' },
  reviewMeta: { flex: 1 },
  reviewRenterName: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary },
  reviewRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  reviewDate: { fontSize: moderateScale(11), color: colors.textSecondary },
  reviewTrailer: { fontSize: moderateScale(12), color: colors.primary, fontWeight: '500', marginTop: 2 },
  reviewText: { fontSize: moderateScale(13), color: colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  helpfulRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  helpfulText: { fontSize: moderateScale(11), color: colors.textSecondary },
});

export default OwnerReviewsScreen;
