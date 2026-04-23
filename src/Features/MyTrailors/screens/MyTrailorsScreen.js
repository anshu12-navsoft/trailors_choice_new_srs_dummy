import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { styles } from '../stylesheets/MyTrailor.style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../../Components/Buttons/CustomButton';
import colors from '../../../Constants/Colors';
import CustomHeader from '../../../Components/Header/CustomHeader';

const MOCK_TRAILERS = [
  {
    id: '1',
    name: 'Tandem Axel',
    earnings: 1236.0,
    status: 'pending',
    rating: null,
    reviewCount: null,
    thumbnail: null,
  },
  {
    id: '2',
    name: 'Tandem Axel',
    earnings: 1236.0,
    status: 'active',
    rating: 4.5,
    reviewCount: 55,
    thumbnail: null,
  },
];

const MOCK_BOOKINGS = [
  {
    id: '1',
    personName: 'James Wilson',
    dateRange: '24 Feb - 28 Feb',
    personAvatar: null,
    trailerThumbnail: null,
  },
  {
    id: '2',
    personName: 'Michael Johnson',
    dateRange: '5 Mar - 10 Mar',
    personAvatar: null,
    trailerThumbnail: null,
  },
];

const STATUS_CFG = {
  pending: { label: 'PENDING', bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
  active: { label: 'ACTIVE', bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  inactive: {
    label: 'INACTIVE',
    bg: '#F3F4F6',
    text: '#6B7280',
    dot: '#EF4444',
  },
};

const TrailerRow = ({ item, onPress }) => {
  const cfg = STATUS_CFG[item.status] ?? STATUS_CFG.inactive;
  const earningsLabel = `$${item.earnings.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  })}`;

  return (
    <Pressable style={styles.trailerRow} onPress={onPress}>
      <View style={styles.thumbWrapper}>
        <View style={styles.thumb}>
          {item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            <Icon name="image" size={moderateScale(22)} color="#C4C4C4" />
          )}
        </View>
        <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      </View>

      <View style={styles.body}>
        <Text style={styles.trailerName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.earnings}>Earnings: {earningsLabel}</Text>
        <View style={styles.bottomRow}>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.text }]}>
              {cfg.label}
            </Text>
          </View>
          {item.status === 'active' && item.rating !== null && (
            <View style={styles.ratingRow}>
              <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {item.rating} ({item.reviewCount})
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const BookingRow = ({ item, onAccept, onDecline }) => {
  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingTopRow}>
        <View style={styles.personAvatarWrap}>
          {item.personAvatar ? (
            <Image
              source={{ uri: item.personAvatar }}
              style={styles.personAvatarImg}
              resizeMode="cover"
            />
          ) : (
            <Icon
              name="account-circle"
              size={moderateScale(52)}
              color="#C4C4C4"
            />
          )}
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.personName}>{item.personName}</Text>
          <Text style={styles.bookingDates}>{item.dateRange}</Text>
        </View>
        <View style={styles.bookingThumb}>
          {item.trailerThumbnail ? (
            <Image
              source={{ uri: item.trailerThumbnail }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            <Icon name="image" size={moderateScale(20)} color="#C4C4C4" />
          )}
        </View>
      </View>

      <View style={styles.bookingActions}>
        <Pressable style={styles.acceptBtn} onPress={onAccept}>
          <Text style={styles.acceptBtnText}>Accept</Text>
        </Pressable>
        <Pressable style={styles.declineBtn} onPress={onDecline}>
          <Text style={styles.declineBtnText}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
};

const MyTrailorsScreen = ({ navigation }) => {
  const [trailers] = useState(MOCK_TRAILERS);
  const [bookings] = useState(MOCK_BOOKINGS);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <CustomHeader title="Manage Trailer" onBack={() => navigation.goBack()} />
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.businessName}>Dump Trailer</Text>
          <Text style={styles.businessLocation}>Dallas, TX 75201</Text>
        </View>
        <View style={styles.headerRatingContainer}>
          <Icon name="star" size={moderateScale(14)} color="#F59E0B" />
          <Text style={styles.headerRatingText}> 4.5 (55) | 60%</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add New Trailer button */}
        <CustomButton
          title="+ Add New Trailer"
          onPress={() => navigation.navigate('AddTrailor')}
          variant="primary"
          size="medium"
          buttonColor="#E53935"
          style={styles.addBtn}
        />

        {/* Lifetime Earning card */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>LIFETIME EARNING</Text>
          <Text style={styles.earningsValue}>$4,800.00</Text>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsRow}>
            <View style={styles.earningsCol}>
              <Text style={styles.payoutLabel}>TOTAL PAYOUT</Text>
              <Text style={styles.payoutValue}>$4,800.00</Text>
            </View>
            <View style={styles.earningsColDivider} />
            <View style={styles.earningsCol}>
              <Text style={styles.payoutLabel}>PENDING PAYOUT</Text>
              <Text style={styles.payoutValue}>$1200.00</Text>
            </View>
          </View>
        </View>
        <Divider
          style={{
            marginTop: moderateScale(12),
            marginLeft: moderateScale(16),
            marginRight: moderateScale(16),
            marginBottom: moderateScale(0),
          }}
        />
        {/* Download links */}
        <Pressable style={styles.downloadRow}>
          <Text style={styles.downloadText}>Download Payout Statement</Text>
          <Icon
            name="chevron-right"
            size={moderateScale(20)}
            color={colors.primary}
          />
        </Pressable>
        <Divider
          style={{
            marginLeft: moderateScale(16),
            marginRight: moderateScale(16),
          }}
        />
        <Pressable style={styles.downloadRow}>
          <Text style={styles.downloadText}>Download Invoice</Text>
          <Icon
            name="chevron-right"
            size={moderateScale(20)}
            color={colors.primary}
          />
        </Pressable>
        <Divider
          style={{
            marginLeft: moderateScale(16),
            marginRight: moderateScale(16),
          }}
        />
        {/* Rating & Trust Score card */}
        <View style={styles.ratingInfoCard}>
          <View style={styles.ratingSection}>
            <Text style={styles.ratingInfoLabel}>RATING</Text>
            <View style={styles.ratingValueRow}>
              <Icon name="star" size={moderateScale(20)} color="#F59E0B" />
              <Text style={[styles.ratingInfoValue, { color: '#F59E0B' }]}>
                {' '}
                4.9/5
              </Text>
            </View>
          </View>
          <View style={styles.ratingCardDivider} />
          <View style={styles.ratingSection}>
            <Text style={styles.ratingInfoLabel}>TRUST SCORE</Text>
            <Text style={[styles.ratingInfoValue, { color: '#F59E0B' }]}>
              60%
            </Text>
          </View>
        </View>

        {/* My Trailers section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Trailers</Text>
          <Pressable
            hitSlop={8}
            onPress={() => {
              navigation.navigate('MyTrailorsList');
            }}
          >
            <Text style={styles.viewAllText}>View All ›</Text>
          </Pressable>
        </View>

        {trailers.map(item => (
          <TrailerRow
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate('TrailerDetail', { trailer: item })
            }
          />
        ))}

        {/* Recent Bookings section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <Pressable
            hitSlop={8}
            onPress={() => {
              navigation.navigate('MyRecentBooking');
            }}
          >
            <Text style={styles.viewAllText}>View All ›</Text>
          </Pressable>
        </View>

        {bookings.map(item => (
          <BookingRow
            key={item.id}
            item={item}
            onAccept={() => {}}
            onDecline={() => {}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyTrailorsScreen;
