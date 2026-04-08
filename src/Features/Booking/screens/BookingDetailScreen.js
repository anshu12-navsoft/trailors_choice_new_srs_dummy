import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomMapView from '../../../Components/Map/MapView';
import { styles } from '../stylesheets/BookingDetail.style';

const STATUS_CONFIG = {
  ongoing: { label: 'ONGOING', color: '#16A34A', bg: '#DCFCE7' },
  coming: { label: 'COMING', color: '#2563EB', bg: '#EFF6FF' },
  booked: { label: 'BOOKED', color: '#7C3AED', bg: '#EDE9FE' },
  completed: { label: 'COMPLETED', color: '#6B7280', bg: '#F3F4F6' },
  rejected: { label: 'REJECTED', color: '#DC2626', bg: '#FEE2E2' },
};

const MOCK_IMAGES = [{ id: '1' }, { id: '2' }, { id: '3' }];

const BookingDetailScreen = ({ navigation, route }) => {
  const booking = route.params?.booking ?? {
    id: 'B001',
    status: 'completed',
    title: 'Utility Trailer 5×8',
    subtitle: "5'x3', 2000 lbs",
    ownerName: 'Michael Jordan',
    pickupDate: 'Feb 18, 2026',
    pickupTime: '9:00 AM',
    returnDate: 'Mar 18, 2026',
    returnTime: '10:00 AM',
    address: '1500 Marilla St, Dallas, TX 75201',
    latitude: 32.7767,
    longitude: -96.797,
    days: 4,
    pricePerDay: 50,
    taxes: 150.12,
  };

  const [rating, setRating] = useState(0);

  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.completed;
  const rentalCost = booking.days * booking.pricePerDay;
  const total = rentalCost + booking.taxes;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Rental Detail</Text>
        <View style={{ width: moderateScale(22) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Horizontal image slider */}
        <FlatList
          data={MOCK_IMAGES}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.imageList}
          renderItem={() => (
            <View style={styles.imagePlaceholder}>
              <Icon
                name="image-outline"
                size={moderateScale(28)}
                color="#9CA3AF"
              />
            </View>
          )}
          snapToInterval={moderateScale(300) + moderateScale(10)}
          decelerationRate="fast"
        />

        <View style={styles.content}>
          {/* Status + Receipt */}
          <View style={styles.statusRow}>
            <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.badgeText, { color: cfg.color }]}>
                {cfg.label}
              </Text>
            </View>
            <Pressable
              style={styles.receiptBtn}
              onPress={() => Alert.alert('Receipt', 'Downloading receipt...')}
            >
              <Icon
                name="download-outline"
                size={moderateScale(15)}
                color="#374151"
              />
              <Text style={styles.receiptText}>Receipt</Text>
            </Pressable>
          </View>

          {/* Title & subtitle */}
          <Text style={styles.title}>{booking.title}</Text>
          <Text style={styles.subtitle}>{booking.subtitle}</Text>

          <View style={styles.divider} />

          {/* Hosted by */}
          <View style={styles.hostRow}>
            <View style={styles.avatar} />
            <Text style={styles.hostText}>
              Hosted by <Text style={styles.hostName}>{booking.ownerName}</Text>
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Review */}
          {booking.status === 'completed' && (
            <View style={styles.reviewBox}>
              <Text style={styles.reviewQuestion}>
                How was your experience?
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Pressable
                    key={star}
                    onPress={() => setRating(star)}
                    hitSlop={6}
                  >
                    <Icon
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={moderateScale(30)}
                      color={star <= rating ? '#F59E0B' : '#9CA3AF'}
                    />
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => Alert.alert('Review', 'Write a review')}
                >
                  <Text style={styles.leaveReview}>Leave a review</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Rental Info */}
          <Text style={styles.sectionTitle}>Rental Info</Text>

          {/* Pickup */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Pickup</Text>
            <Text style={styles.infoValue}>
              {booking.pickupDate}
              {'    '}
              {booking.pickupTime}
            </Text>
          </View>

          {/* Return */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Return</Text>
            <Text style={styles.infoValue}>
              {booking.returnDate}
              {'    '}
              {booking.returnTime}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoAddress}>{booking.address}</Text>
            <CustomMapView
              latitude={booking.latitude}
              longitude={booking.longitude}
              title={booking.title}
              description={booking.address}
              style={styles.map}
              scrollEnabled={false}
              zoomEnabled={false}
            />
          </View>

          {/* Price Details */}
          <Text style={styles.sectionTitle}>Price Details</Text>

          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {booking.days} days x ${booking.pricePerDay}
              </Text>
              <Text style={styles.priceValue}>${rentalCost.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Taxes/fees</Text>
              <Text style={styles.priceValue}>${booking.taxes.toFixed(2)}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={{ height: moderateScale(30) }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetailScreen;
