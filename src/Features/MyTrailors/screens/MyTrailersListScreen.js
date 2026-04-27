import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../../../Components/Header/CustomHeader';
import { styles } from '../stylesheets/MyTrailerList.style';

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

const STATUS_CFG = {
  pending: { label: 'DRAFT', bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
  active: { label: 'ACTIVE', bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  inactive: {
    label: 'INACTIVE',
    bg: '#F3F4F6',
    text: '#6B7280',
    dot: '#EF4444',
  },
};

const TrailerRow = ({ item, onPress, onBookingsPress }) => {
  const cfg = STATUS_CFG[item.status] ?? STATUS_CFG.inactive;

  const earningsLabel = `$${item.earnings.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  })}`;

  const activeBookingsCount = item.activeBookings || 10;

  return (
    <View style={styles.card}>
      {/* 🔹 TOP SECTION */}
      <Pressable onPress={onPress} style={styles.topSection}>
        <View style={styles.row}>
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
            <Text style={styles.title}>{item.name}</Text>

            <Text style={styles.earnings}>Earnings: {earningsLabel}</Text>

            <View style={styles.bottomRow}>
              <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.badgeText, { color: cfg.text }]}>
                  {cfg.label}
                </Text>
              </View>

              {item.status === 'active' && item.rating !== null && (
                <View style={styles.ratingRow}>
                  <Icon name="star" size={14} color="#F97316" />
                  <Text style={styles.ratingText}>
                    {item.rating} ({item.reviewCount})
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>

      {/* 🔹 BOTTOM STRIP */}
      {item.status === 'active' && (
        <>
          <View style={styles.divider} />

          <Pressable onPress={onBookingsPress} style={styles.bottomStrip}>
            <View style={styles.bookingRow}>
              <Text style={styles.bookingText}>
                {activeBookingsCount} Active Bookings
              </Text>

              <Icon name="chevron-right" size={18} color="#2563EB" />
            </View>
          </Pressable>
        </>
      )}
    </View>
  );
};
const MyTrailorsListScreen = ({ navigation }) => {
  const [trailers, setTrailers] = useState(MOCK_TRAILERS);
  const [activeTab, setActiveTab] = useState('All');

  // 🔥 FUTURE: API CALL BASED ON TAB
  useEffect(() => {
    fetchTrailers();
  }, [activeTab]);

  const fetchTrailers = async () => {
    try {
      let status = '';

      switch (activeTab) {
        case 'Active':
          status = 'active';
          break;
        case 'Inactive':
          status = 'inactive';
          break;
        case 'Draft':
          status = 'pending';
          break;
        case 'All':
        default:
          status = '';
      }

      // 🔥 Uncomment when API is ready
      /*
      const res = await fetch(`/api/trailers?status=${status}`);
      const data = await res.json();
      setTrailers(data);
      */

      // TEMP: keep mock data
      setTrailers(MOCK_TRAILERS);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FILTER LOGIC (for now until API fully used)
  const getFilteredTrailers = () => {
    switch (activeTab) {
      case 'Active':
        return trailers.filter(t => t.status === 'active');

      case 'Inactive':
        return trailers.filter(t => t.status === 'inactive');

      case 'Draft':
        return trailers.filter(t => t.status === 'pending');

      case 'All':
      default:
        return trailers;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <CustomHeader title="Manage Trailer" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 🔥 Tabs */}
        <View style={styles.toggle}>
          {['All', 'Active', 'Inactive', 'Draft'].map(tab => (
            <Pressable
              key={tab}
              style={[
                styles.toggleTab,
                activeTab === tab && styles.toggleTabActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.toggleText,
                  activeTab === tab && styles.toggleTextActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 🔥 Trailer List */}
        {getFilteredTrailers().map(item => (
          <TrailerRow
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate('TrailerDetail', { trailer: item })
            }
            onBookingsPress={() =>
              navigation.navigate('MyRecentBooking', { trailerId: item.id })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyTrailorsListScreen;
