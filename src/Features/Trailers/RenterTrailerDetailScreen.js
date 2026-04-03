import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../App/Redux/Slices/trailerSlice';
import colors from '../../Constants/Colors';
import { styles } from './RenterTrailorDetail.style';
const PHOTO_COLORS = ['#DBEAFE', '#D1FAE5', '#FEF3C7', '#EDE9FE'];

const SPECS = [
  { label: 'Length', value: '20 ft', icon: 'straighten' },
  { label: 'Max Load', value: '7,000 lbs', icon: 'fitness-center' },
  { label: 'Hitch Type', value: 'Class III', icon: 'link' },
  { label: 'Axles', value: '2 axles', icon: 'settings' },
];

const RenterTrailerDetailScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const trailer = route.params?.trailer ?? {};
  const [photoIndex, setPhotoIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.trailer.favorites);
  const isFavorite = favorites.includes(trailer.id);

  const pricePerDay = trailer.pricePerDay ?? 45;
  const platformFee = Math.round(pricePerDay * 0.12);
  const deposit = 150;

  const handleBook = () => {
    navigation.navigate('Booking', { trailer });
  };

  const handleTowingCheck = () => {
    navigation.navigate('TowingCompatibility', {
      trailer: { ...trailer, hitchType: 'Class III', weightCapacity: 7000 },
    });
  };

  const handleMessage = () => {
    Alert.alert('Message Owner', 'Messaging feature coming soon.');
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
        {/* Dot indicators */}
        <View style={styles.dotRow}>
          {PHOTO_COLORS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === photoIndex && styles.dotActive]}
            />
          ))}
        </View>
        {/* Back & Favorite */}
        <SafeAreaView edges={['top']} style={styles.overlayControls}>
          <TouchableOpacity
            style={styles.overlayBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={moderateScale(20)} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.overlayBtn}
            onPress={() => dispatch(toggleFavorite(trailer.id))}
          >
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={moderateScale(20)}
              color={isFavorite ? '#EF4444' : '#fff'}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Block */}
        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.trailerTitle}>
              {trailer.title ?? '20ft Utility Trailer'}
            </Text>
            {trailer.instantBook && (
              <View style={styles.instantChip}>
                <Icon name="bolt" size={moderateScale(12)} color="#fff" />
                <Text style={styles.instantText}>{t('instant_book')}</Text>
              </View>
            )}
          </View>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {trailer.category ?? 'Utility'}
              </Text>
            </View>
            <View style={styles.ratingRow}>
              <Icon name="star" size={moderateScale(14)} color="#F59E0B" />
              <Text style={styles.ratingText}>{trailer.rating ?? 4.8}</Text>
              <Text style={styles.reviewCount}>
                ({trailer.reviewCount ?? 24} reviews)
              </Text>
            </View>
            <View style={styles.distRow}>
              <Icon
                name="place"
                size={moderateScale(14)}
                color={colors.textSecondary}
              />
              <Text style={styles.distText}>
                {trailer.distance ?? 2.3} mi away
              </Text>
            </View>
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
                {trailer.ownerName ?? 'John D.'}
              </Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={moderateScale(12)} color="#F59E0B" />
                <Text style={styles.ownerRating}>
                  {trailer.ownerRating ?? 4.9} · 127 reviews
                </Text>
              </View>
              <Text style={styles.responseTime}>Responds within 1 hour</Text>
            </View>
            <TouchableOpacity style={styles.msgBtn} onPress={handleMessage}>
              <Icon
                name="chat-bubble-outline"
                size={moderateScale(16)}
                color={colors.primary}
              />
              <Text style={styles.msgText}>{t('message_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pricing Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pricing</Text>
          <View style={styles.priceGrid}>
            <View style={styles.priceItem}>
              <Text style={styles.priceBig}>${pricePerDay}</Text>
              <Text style={styles.priceLabel}>per day</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceItem}>
              <Text style={styles.priceBig}>${pricePerDay * 6}</Text>
              <Text style={styles.priceLabel}>per week</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceItem}>
              <Text style={styles.priceBig}>${deposit}</Text>
              <Text style={styles.priceLabel}>deposit</Text>
            </View>
          </View>
          <View style={styles.feeRow}>
            <Icon
              name="info-outline"
              size={moderateScale(14)}
              color={colors.textSecondary}
            />
            <Text style={styles.feeText}>
              Platform fee ~${platformFee}/day · Deposit refunded on return
            </Text>
          </View>
        </View>

        {/* Specs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Specifications</Text>
          <View style={styles.specsGrid}>
            {SPECS.map(spec => (
              <View key={spec.label} style={styles.specItem}>
                <Icon
                  name={spec.icon}
                  size={moderateScale(20)}
                  color={colors.primary}
                />
                <Text style={styles.specValue}>{spec.value}</Text>
                <Text style={styles.specLabel}>{spec.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text
            style={styles.description}
            numberOfLines={expanded ? undefined : 3}
          >
            This well-maintained utility trailer is perfect for hauling
            equipment, furniture, or landscaping materials. Features a sturdy
            steel frame, treated wood floor, and tie-down loops throughout. Easy
            loading with the rear ramp gate. Lights and reflectors are fully
            compliant with state regulations.
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.expandText}>
              {expanded ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rental Rules */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rental Rules</Text>
          {[
            'Maximum towing distance: 200 miles per day',
            'No off-road use',
            'Return clean or cleaning fee applies',
            "Renter must have valid driver's license",
            'No overloading beyond rated capacity',
          ].map(rule => (
            <View key={rule} style={styles.ruleRow}>
              <Icon
                name="check-circle-outline"
                size={moderateScale(16)}
                color={colors.success}
              />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* Cancellation Policy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cancellation Policy</Text>
          <Text style={styles.description}>
            Free cancellation up to 48 hours before pickup. After that, a 50%
            cancellation fee applies. No refund for no-shows.
          </Text>
        </View>

        {/* Towing Compatibility */}
        <TouchableOpacity style={styles.towingCard} onPress={handleTowingCheck}>
          <View style={styles.towingLeft}>
            <Icon
              name="rv-hookup"
              size={moderateScale(24)}
              color={colors.primary}
            />
            <View>
              <Text style={styles.towingTitle}>Towing Compatibility</Text>
              <Text style={styles.towingSubtitle}>
                Check if your vehicle can tow this trailer
              </Text>
            </View>
          </View>
          <Icon
            name="chevron-right"
            size={moderateScale(22)}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={{ height: moderateScale(100) }} />
      </ScrollView>

      {/* Sticky Book Now */}
      <View style={styles.bookBar}>
        <View>
          <Text style={styles.bookPrice}>
            ${pricePerDay}
            <Text style={styles.bookPerDay}>/day</Text>
          </Text>
          <Text style={styles.bookNote}>
            + ${platformFee} fee · ${deposit} deposit
          </Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
          <Text style={styles.bookBtnText}>Book Now</Text>
          <Icon name="arrow-forward" size={moderateScale(18)} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RenterTrailerDetailScreen;
