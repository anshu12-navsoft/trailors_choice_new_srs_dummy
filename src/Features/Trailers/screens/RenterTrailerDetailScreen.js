import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../../App/Redux/Slices/trailerSlice';
import colors from '../../../Constants/Colors';
import { styles } from '../stylesheets/RenterTrailorDetail.style';
import { Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CustomCalender from '../../../Components/Calender/CustomCalender';
import Fonts from '../../../Theme/Fonts';
import CustomButton from '../../../Components/Buttons/CustomButton';

const PHOTO_COLORS = ['#DBEAFE', '#D1FAE5', '#FEF3C7', '#EDE9FE'];

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

const formatDateTime = (dateStr, time) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(day, 10)} ${
    MONTHS[parseInt(month, 10) - 1]
  } ${year}, ${time}`;
};

const RATING_CATEGORIES = [
  { label: 'Cleanliness', value: 4.5 },
  { label: 'Maintenance', value: 5.0 },
  { label: 'Communication', value: 4.5 },
  { label: 'Convenience', value: 4.7 },
  { label: 'Accuracy', value: 4.0 },
];

const INFO_TABS = [
  { key: 'cancellation', label: 'Cancellation Policy' },
  { key: 'payment', label: 'Payment Option' },
  { key: 'report', label: 'Report Listing' },
];

const CANCELLATION_RULES = [
  {
    icon: 'event-available',
    text: 'Free cancellation up to 24 hours before pickup.',
  },
  {
    icon: 'event-busy',
    text: '50% refund if cancelled within 24 hours of pickup.',
  },
  { icon: 'money-off', text: 'No refund for cancellations after pickup time.' },
  {
    icon: 'info-outline',
    text: 'Security deposit is fully refundable upon return.',
  },
];

const PAYMENT_OPTIONS = [
  {
    icon: 'credit-card',
    label: 'Credit / Debit Card',
    sub: 'Visa, Mastercard, Amex accepted',
  },
  {
    icon: 'account-balance',
    label: 'Bank Transfer',
    sub: 'ACH direct transfer available',
  },
  {
    icon: 'phone-iphone',
    label: 'Apple Pay / Google Pay',
    sub: 'Tap-to-pay on checkout',
  },
];

const REPORT_REASONS = [
  'Inaccurate listing information',
  'Fraudulent or scam listing',
  'Inappropriate content',
  'Prohibited item or trailer type',
  'Other',
];

const SIMILAR_TRAILERS = [
  {
    id: 's1',
    name: 'Tandem Axel',
    distance: '2.4 miles · E 8th St.',
    specs: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
    bg: '#DBEAFE',
  },
  {
    id: 's2',
    name: 'Tandem Axel',
    distance: '2.4 miles · E 8th St.',
    specs: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
    bg: '#D1FAE5',
  },
  {
    id: 's3',
    name: 'Tandem Axel',
    distance: '2.4 miles · E 8th St.',
    specs: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
    bg: '#FEF3C7',
  },
  {
    id: 's4',
    name: 'Tandem Axel',
    distance: '2.4 miles · E 8th St.',
    specs: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
    bg: '#EDE9FE',
  },
];

const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Michael Jordan',
    date: 'February 02, 2025',
    rating: 5,
    photo: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' },
    text: 'Vivamus sed rhoncus ipsum, id viverra est. Aliquam a ullamcorper tellus, sit amet interdum velit. Phasellus blandit, nibh vitae placerat condimentum,',
  },
  {
    id: '2',
    author: 'Sarah Mitchell',
    date: 'January 28, 2025',
    rating: 5,
    photo: { uri: 'https://randomuser.me/api/portraits/women/44.jpg' },
    text: 'Vivamus sed rhoncus ipsum, id viverra est. Aliquam a ullamcorper tellus, sit amet interdum velit. Phasellus blandit, nibh vitae placerat condimentum,',
  },
  {
    id: '3',
    author: 'James Carter',
    date: 'January 15, 2025',
    rating: 5,
    photo: { uri: 'https://randomuser.me/api/portraits/men/47.jpg' },
    text: 'Vivamus sed rhoncus ipsum, id viverra est. Aliquam a ullamcorper tellus, sit amet interdum velit. Phasellus blandit, nibh vitae placerat condimentum,',
  },
  {
    id: '4',
    author: 'Carlos Vega',
    date: 'December 30, 2024',
    rating: 5,
    photo: { uri: 'https://randomuser.me/api/portraits/men/52.jpg' },
    text: 'Vivamus sed rhoncus ipsum, id viverra est. Aliquam a ullamcorper tellus, sit amet interdum velit. Phasellus blandit, nibh vitae placerat condimentum,',
  },
  {
    id: '5',
    author: 'Nina Williams',
    date: 'December 12, 2024',
    rating: 4,
    photo: { uri: 'https://randomuser.me/api/portraits/women/63.jpg' },
    text: 'Great trailer, very clean and easy to hitch. Owner was super responsive and helpful throughout the whole process.',
  },
  {
    id: '6',
    author: 'Mark Lewis',
    date: 'November 20, 2024',
    rating: 4,
    photo: { uri: 'https://randomuser.me/api/portraits/men/76.jpg' },
    text: 'Solid trailer, worked perfectly for our move. Would definitely rent again next time.',
  },
  {
    id: '7',
    author: 'Emily Roberts',
    date: 'November 05, 2024',
    rating: 5,
    photo: { uri: 'https://randomuser.me/api/portraits/women/21.jpg' },
    text: 'Exactly as described. Pickup and drop-off were smooth. Trailer was in excellent condition.',
  },
  {
    id: '8',
    author: 'Tyler Brooks',
    date: 'October 18, 2024',
    rating: 4,
    photo: { uri: 'https://randomuser.me/api/portraits/men/88.jpg' },
    text: 'Great trailer for hauling furniture. Everything went smoothly from start to finish.',
  },
];

const SPECS = [
  { label: 'Length', value: '20 ft', icon: 'straighten' },
  { label: 'Max Load', value: '7,000 lbs', icon: 'fitness-center' },
  { label: 'Hitch Type', value: 'Class III', icon: 'link' },
  { label: 'Axles', value: '2 axles', icon: 'settings' },
];

const MOCK_TRAILER = {
  id: '1',
  name: 'Tandem Axel',
  status: 'active',
  address: '1500 Marilla St, Dallas, TX 75201',
  dimensions: "5'x3', 2000 lbs",
  pricing: { daily: 50, weekly: 150, monthly: 450 },
  photos: [null, null],
  listingVisible: true,
  availability: '3 Mar - 31 Mar, 10 Apr - 20 Apr, 1 May - 21 May ...',
  specs: [
    { label: 'Length', value: "8'" },
    { label: 'Width', value: "5'" },
    { label: 'Height off the ground', value: "6'" },
    { label: 'Total height', value: '100kg' },
    { label: 'Weight Capacity', value: '500lb' },
    { label: 'Tounge Weight', value: '200lb' },
    { label: 'Make and Model', value: 'CAT 23658' },
    { label: 'Hitch Type', value: 'Bumper Pull' },
    { label: 'Hitch Class', value: 'Class I, II' },
    { label: 'Ball Type', value: '1-7/8" Ball' },
    { label: 'Ball size', value: '1-7/8" Ball' },
  ],
};

const SpecRow = ({ label, value, dimmed }) => (
  <View style={sp.row}>
    <Text style={[sp.label, dimmed && sp.dimmed]}>{label}</Text>
    <Text style={[sp.value, dimmed && sp.dimmed]}>{value}</Text>
  </View>
);

const sp = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(6),
  },
  label: { fontSize: Fonts.size.sm, color: colors.textSecondary, flex: 1 },
  value: {
    fontSize: Fonts.size.sm,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  dimmed: { color: colors.textDisabled },
});

const RenterTrailerDetailScreen = ({ navigation, route }) => {
  const trailer = route.params?.trailer ?? {};
  console.log('Trailor======>>>>>', trailer);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState(null);
  const [selectedReportReason, setSelectedReportReason] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.trailer.favorites);
  const isFavorite = favorites.includes(trailer.id);

  const pricePerDay = trailer.pricePerDay ?? 45;
  const platformFee = Math.round(pricePerDay * 0.12);
  const deposit = 150;

  const handleBook = () => {
    navigation.navigate('Booking', { trailer });
  };

  const REVIEWS_PREVIEW = 5;
  const displayedReviews = showAllReviews
    ? MOCK_REVIEWS
    : MOCK_REVIEWS.slice(0, REVIEWS_PREVIEW);
  const PREVIEW_SPECS = 6;
  const displayedSpecs = showAllSpecs
    ? MOCK_TRAILER.specs
    : MOCK_TRAILER.specs.slice(0, PREVIEW_SPECS);

  const TrailerCard = ({ item, onPress }) => {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const imageSize = (width - moderateScale(12) * 2 - moderateScale(8)) / 2;

    return (
      <CustomCards
        variant="flat"
        onPress={onPress}
        style={styles.trailerCard}
        contentStyle={{ padding: 0 }}
      >
        {/* Image */}
        <View
          style={[
            styles.trailerImage,
            { width: imageSize, height: imageSize * 0.8 },
          ]}
        >
          <Icon name="image" size={moderateScale(32)} color="#C0C0C0" />
        </View>

        {/* Caption */}
        <View style={styles.caption}>
          <Text variant="titleSmall" style={styles.trailerTitle}>
            {item.title}
          </Text>
          <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
            {item.distance} - {item.address}
          </Text>
          <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
            {item.dims}
          </Text>
          <View style={styles.priceRow}>
            <Text variant="labelMedium">
              <Text style={styles.priceBold}>${item.priceDay}</Text>
              <Text style={{ color: colors.onSurfaceVariant }}>/day</Text>
            </Text>
            <Text variant="labelMedium">
              <Text style={styles.priceBold}>${item.priceWeek}</Text>
              <Text style={{ color: colors.onSurfaceVariant }}>/week</Text>
            </Text>
          </View>
        </View>
      </CustomCards>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Photo Carousel */}
      <View style={styles.photoCarousel}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width,
            );
            setPhotoIndex(idx);
          }}
        >
          {PHOTO_COLORS.map((bg, i) => (
            <View key={i} style={[styles.photoSlide, { backgroundColor: bg }]}>
              <Icon
                name="local-shipping"
                size={moderateScale(60)}
                color="#9CA3AF"
              />
            </View>
          ))}
        </ScrollView>

        {/* Top overlay: white bar with back, search input, share, heart */}
        <SafeAreaView edges={['top']} style={styles.overlayControls}>
          <View style={styles.overlayBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="arrow-back"
                size={moderateScale(20)}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.overlaySearch}
              placeholder="Search trailers..."
              placeholderTextColor={colors.textSecondary}
            />

            <TouchableOpacity>
              <Icon
                name="share"
                size={moderateScale(20)}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dispatch(toggleFavorite(trailer.id))}
            >
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={moderateScale(20)}
                color={isFavorite ? '#EF4444' : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Bottom pill: photo count */}
        <TouchableOpacity
          style={styles.photoCountPill}
          onPress={() => setPhotoModalVisible(true)}
        >
          <Text style={styles.photoCountText}>
            {photoIndex + 1}/{PHOTO_COLORS.length} Photos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photo list modal */}
      <Modal
        visible={photoModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.photoModalContainer}>
          <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
            <View style={styles.photoModalHeader}>
              <Text style={styles.photoModalTitle}>
                All Photos ({PHOTO_COLORS.length})
              </Text>
              <TouchableOpacity
                style={styles.photoModalClose}
                onPress={() => setPhotoModalVisible(false)}
              >
                <Icon
                  name="close"
                  size={moderateScale(22)}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={PHOTO_COLORS}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={styles.photoModalList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: bg, index }) => (
                <View style={[styles.photoModalItem, { backgroundColor: bg }]}>
                  <Icon
                    name="local-shipping"
                    size={moderateScale(50)}
                    color="#9CA3AF"
                  />
                  <Text style={styles.photoModalIndex}>Photo {index + 1}</Text>
                </View>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Block */}
        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.trailerTitle}>
              {trailer.trailorTitle ?? '20ft Utility Trailer'}
            </Text>
            <View style={styles.DescratingRow}>
              <Icon name="star" size={moderateScale(14)} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {trailer.rating ?? 4.8} ({trailer.reviewCount ?? 24})
              </Text>
            </View>
            {/* {trailer.instantBook && (
              <View style={styles.instantChip}>
                <Icon name="bolt" size={moderateScale(12)} color="#fff" />
                <Text style={styles.instantText}>{t('instant_book')}</Text>
              </View>
            )} */}
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {trailer.street} - {trailer.distanceCapacity}
            </Text>
            <Text style={styles.categoryText}>{trailer.specs}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text>
              <Text style={styles.pricingAmount}>$50</Text>
              <Text style={styles.pricingUnit}>/Daily</Text>
            </Text>
            <Text>
              <Text style={styles.pricingAmount}>$150</Text>
              <Text style={styles.pricingUnit}>/Weekly</Text>
            </Text>
            <Text>
              <Text style={styles.pricingAmount}>$450</Text>
              <Text style={styles.pricingUnit}>/Monthly</Text>
            </Text>
          </View>
        </View>

        {/* Owner Card */}
        <View style={styles.card}>
          <View style={styles.ownerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(trailer.ownerName ?? 'J')[0]}
              </Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>
                Hosted by {trailer.ownerName ?? 'John D.'}
              </Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ownerRating}>
                  {trailer.ownerRating ?? 23} Trailors -{' '}
                  {trailer.ownerRating ?? 'Joined Jul 2025'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Divider />
        {/* Specs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rent Info</Text>
          <View style={styles.specsGrid}>
            {/* ── Scheduled Availability ── */}
            <Pressable
              style={[styles.Rentercard, styles.RentercardRow]}
              onPress={() => setCalendarVisible(true)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.RentercardTitle}>Start & End Date</Text>
                <Text style={styles.RentercardSub} numberOfLines={1}>
                  {startDate && endDate
                    ? `${formatDateTime(
                        startDate,
                        '9:00 am',
                      )} - ${formatDateTime(endDate, '9:00 pm')}`
                    : trailer.availability ?? 'Select dates'}
                </Text>
              </View>
              <Icon
                name="edit"
                size={moderateScale(18)}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        {/* Pickup & Return Location */}
        <View style={styles.locationCard}>
          <Text style={styles.locationCardTitle}>
            Pickup &amp; Return Location
          </Text>
          <View style={styles.locationAddressRow}>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {trailer.address ?? '1500 Marilla St, Dallas, TX 75201'}
            </Text>
            <TouchableOpacity>
              <Icon
                name="edit"
                size={moderateScale(18)}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {/* Map placeholder */}
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapStreetH1} />
            <View style={styles.mapStreetH2} />
            <View style={styles.mapStreetV1} />
            <View style={styles.mapStreetV2} />
            <View style={styles.mapPinWrapper}>
              <Icon
                name="location-on"
                size={moderateScale(36)}
                color="#E53935"
              />
            </View>
          </View>
        </View>
        <Divider style={{ marginTop: moderateScale(16) }} />

        {/* ── Trailer Specification ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('trailer_specification')}</Text>
          <View style={{ marginTop: moderateScale(14) }}>
            {displayedSpecs.map((s, i) => (
              <SpecRow
                key={i}
                label={s.label}
                value={s.value}
                dimmed={
                  i === displayedSpecs.length - 1 &&
                  !showAllSpecs &&
                  trailer.specs.length > PREVIEW_SPECS
                }
              />
            ))}
          </View>
          {trailer.specs.length > PREVIEW_SPECS && (
            <Pressable
              style={styles.viewAllBtn}
              onPress={() => setShowAllSpecs(v => !v)}
            >
              <Text style={styles.viewAllText}>
                {showAllSpecs ? t('view_less_specs') : t('view_all_specs')}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Rating & Reviews */}
        <View style={styles.Ratingcard}>
          <Text style={styles.RatingcardTitle}>Rating & Reviews</Text>
          <View style={styles.RatingReviewsRow}>
            <Icon name="star" size={moderateScale(14)} color="#F59E0B" />
            <Text style={styles.ratingText}>
              {trailer.rating ?? 4.5} ({trailer.reviewCount ?? 55})
            </Text>
          </View>
        </View>

        {/* Rating Breakdown */}
        <View style={styles.ratingBreakdownCard}>
          {RATING_CATEGORIES.map(({ label, value }) => (
            <View key={label} style={styles.ratingBreakdownRow}>
              <Text style={styles.ratingBreakdownLabel}>{label}</Text>
              <View style={styles.ratingBarTrack}>
                <View
                  style={[
                    styles.ratingBarFill,
                    { width: `${(value / 5) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.ratingBreakdownValue}>
                {value.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsSection}>
          {displayedReviews.map((review, index) => (
            <View key={review.id}>
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image source={review.photo} style={styles.reviewAvatar} />
                  <View style={styles.reviewAuthorInfo}>
                    <Text style={styles.reviewAuthorName}>{review.author}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.reviewStarsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      name={i < review.rating ? 'star' : 'star-border'}
                      size={moderateScale(14)}
                      color="#F59E0B"
                    />
                  ))}
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
              {index < displayedReviews.length - 1 && (
                <Divider style={styles.reviewDivider} />
              )}
            </View>
          ))}
          {MOCK_REVIEWS.length > REVIEWS_PREVIEW && (
            <Pressable
              style={styles.showAllReviewsBtn}
              onPress={() => setShowAllReviews(v => !v)}
            >
              <Text style={styles.showAllReviewsText}>
                {showAllReviews
                  ? 'Show fewer reviews'
                  : `Show all ${MOCK_REVIEWS.length} reviews`}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Info Tabs: Cancellation Policy / Payment Option / Report Listing */}
        <View style={styles.infoTabsWrapper}>
          {/* Tab Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.infoTabBar}
          >
            {INFO_TABS.map(tab => (
              <Pressable
                key={tab.key}
                style={styles.infoTabItem}
                onPress={() =>
                  setActiveInfoTab(prev => (prev === tab.key ? null : tab.key))
                }
              >
                <Text
                  style={[
                    styles.infoTabLabel,
                    activeInfoTab === tab.key && styles.infoTabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {activeInfoTab === tab.key && (
                  <View style={styles.infoTabUnderline} />
                )}
              </Pressable>
            ))}
          </ScrollView>

          {/* Tab Content — only visible when a tab is selected */}
          {activeInfoTab === 'cancellation' && (
            <View style={styles.infoTabContent}>
              {CANCELLATION_RULES.map((rule, i) => (
                <View key={i} style={styles.infoRuleRow}>
                  <Icon
                    name={rule.icon}
                    size={moderateScale(20)}
                    color={colors.primary}
                  />
                  <Text style={styles.infoRuleText}>{rule.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Payment Option Content */}
          {activeInfoTab === 'payment' && (
            <View style={styles.infoTabContent}>
              {PAYMENT_OPTIONS.map((opt, i) => (
                <View key={i} style={styles.infoPaymentRow}>
                  <View style={styles.infoPaymentIcon}>
                    <Icon
                      name={opt.icon}
                      size={moderateScale(20)}
                      color={colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.infoPaymentLabel}>{opt.label}</Text>
                    <Text style={styles.infoPaymentSub}>{opt.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Report Listing Content */}
          {activeInfoTab === 'report' && (
            <View style={styles.infoTabContent}>
              <Text style={styles.infoReportHeading}>
                Why are you reporting this listing?
              </Text>
              {REPORT_REASONS.map((reason, i) => (
                <Pressable
                  key={i}
                  style={styles.infoReportRow}
                  onPress={() => setSelectedReportReason(reason)}
                >
                  <View style={styles.infoReportRadio}>
                    {selectedReportReason === reason && (
                      <View style={styles.infoReportRadioFill} />
                    )}
                  </View>
                  <Text style={styles.infoReportText}>{reason}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {activeInfoTab !== null && <Divider style={styles.infoTabDivider} />}
        </View>

        <Divider />
        {/* Similar Trailers */}
        <View style={styles.similarSection}>
          <Text style={styles.similarTitle}>
            Similar trailers for your dates
          </Text>
          <View style={styles.similarGrid}>
            {SIMILAR_TRAILERS.map(item => (
              <TouchableOpacity key={item.id} style={styles.similarCard}>
                <View
                  style={[styles.similarImageBox, { backgroundColor: item.bg }]}
                >
                  <Icon
                    name="local-shipping"
                    size={moderateScale(36)}
                    color="#9CA3AF"
                  />
                </View>
                <Text style={styles.similarName}>{item.name}</Text>
                <Text style={styles.similarDistance}>{item.distance}</Text>
                <Text style={styles.similarSpecs}>{item.specs}</Text>
                <Text style={styles.similarPrice}>
                  <Text style={styles.similarPriceAmount}>
                    ${item.priceDay}
                  </Text>
                  <Text style={styles.similarPriceUnit}>/day </Text>
                  <Text style={styles.similarPriceWeekAmount}>
                    ${item.priceWeek}
                  </Text>
                  <Text style={styles.similarPriceUnit}>/week</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: moderateScale(100) }} />
      </ScrollView>

      {/* Availability Calendar */}
      <CustomCalender
        visible={calendarVisible}
        startDate={startDate}
        endDate={endDate}
        onChange={({ startDate: s, endDate: e }) => {
          setStartDate(s);
          setEndDate(e);
        }}
        onClose={() => setCalendarVisible(false)}
      />

      {/* Sticky Book Now */}
      <View style={styles.bookBar}>
        <View>
          <Text style={styles.bookPrice}>${pricePerDay} Total</Text>
          <Text style={styles.bookNote}>Before Taxes</Text>
        </View>
        <CustomButton
          title="Rent Now"
          onPress={handleBook}
          variant="primary"
          size="small"
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
};

export default RenterTrailerDetailScreen;
