import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../../Theme/ThemeContext';
import { styles } from '../stylesheets/OwnerReview.style';
const REVIEWS = [
  {
    id: 'RV001',
    renterName: 'Alex Johnson',
    renterInitial: 'A',
    rating: 5,
    trailerName: 'Heavy Duty Flatbed',
    date: 'Mar 24, 2025',
    text: 'John was fantastic! The trailer was exactly as described, clean and well-maintained. Pickup and return were smooth. Will definitely book again!',
    helpful: 3,
  },
  {
    id: 'RV002',
    renterName: 'Maria Lopez',
    renterInitial: 'M',
    rating: 4,
    trailerName: 'Enclosed Cargo 7x14',
    date: 'Mar 12, 2025',
    text: 'Great experience overall. The trailer was in excellent condition. John responded quickly to all my messages. Minor issue with the latch but nothing major.',
    helpful: 1,
  },
  {
    id: 'RV003',
    renterName: 'Sandra Kim',
    renterInitial: 'S',
    rating: 5,
    trailerName: 'Heavy Duty Flatbed',
    date: 'Mar 2, 2025',
    text: 'Perfect trailer for our move. Very spacious and easy to tow. John provided detailed pickup instructions which made everything seamless.',
    helpful: 5,
  },
  {
    id: 'RV004',
    renterName: 'Chris Park',
    renterInitial: 'C',
    rating: 4,
    trailerName: 'Dump Trailer 14ft',
    date: 'Feb 25, 2025',
    text: 'Solid trailer, worked perfectly for our landscaping project. Fair price and easy process.',
    helpful: 0,
  },
  {
    id: 'RV005',
    renterName: 'Tom Wilson',
    renterInitial: 'T',
    rating: 3,
    trailerName: 'Enclosed Cargo 7x14',
    date: 'Feb 15, 2025',
    text: 'Trailer was fine but pickup was slightly confusing. Communication could be clearer about directions.',
    helpful: 0,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 18, percentage: 0.72 },
  { stars: 4, count: 5, percentage: 0.2 },
  { stars: 3, count: 1, percentage: 0.04 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 1, percentage: 0.04 },
];

const StarRow = ({ rating, filled = false }) => (
  <View style={staticStyles.starRow}>
    {[1, 2, 3, 4, 5].map(i => (
      <Icon
        key={i}
        name={i <= rating ? 'star' : 'star-border'}
        size={moderateScale(filled ? 18 : 14)}
        color="#F59E0B"
      />
    ))}
  </View>
);

const staticStyles = StyleSheet.create({
  starRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
});

const ReviewCard = ({ item }) => {
  const { t } = useTranslation();
  const colors = useColors();

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
        <Icon
          name="thumb-up-outline"
          size={moderateScale(14)}
          color={colors.textSecondary}
        />
        <Text style={styles.helpfulText}>
          {item.helpful > 0
            ? t('found_helpful', { count: item.helpful })
            : t('be_first_helpful')}
        </Text>
      </View>
    </View>
  );
};

const OwnerReviewsScreen = ({ navigation }) => {
  const colors = useColors();

  const { t } = useTranslation();
  const avgRating = (
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
  ).toFixed(1);
  const totalReviews = REVIEWS.length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon
            name="arrow-back"
            size={moderateScale(22)}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('my_reviews_title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Overall Rating */}
        <View style={styles.overallCard}>
          <View style={styles.overallLeft}>
            <Text style={styles.overallRating}>{avgRating}</Text>
            <StarRow rating={Math.round(Number(avgRating))} filled />
            <Text style={styles.overallCount}>
              {t('reviews_count', { count: totalReviews })}
            </Text>
          </View>
          <View style={styles.overallRight}>
            {RATING_BREAKDOWN.map(item => (
              <View key={item.stars} style={styles.breakdownRow}>
                <Text style={styles.breakdownStar}>{item.stars}</Text>
                <Icon name="star" size={moderateScale(12)} color="#F59E0B" />
                <View style={styles.breakdownBar}>
                  <View
                    style={[
                      styles.breakdownFill,
                      { width: `${item.percentage * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.breakdownCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trust Score */}
        <View style={styles.trustCard}>
          <Icon
            name="verified"
            size={moderateScale(24)}
            color={colors.success}
          />
          <View style={styles.trustInfo}>
            <Text style={styles.trustTitle}>
              {t('trust_score_label', { score: 94 })}
            </Text>
            <Text style={styles.trustSubtitle}>
              {t('trust_score_subtitle')}
            </Text>
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

export default OwnerReviewsScreen;
