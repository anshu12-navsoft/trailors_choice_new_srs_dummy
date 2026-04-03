import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './MyRentals.style';
const STATUS_CONFIG = {
  ongoing: { label: 'ONGOING', color: '#16A34A', bg: '#DCFCE7' },
  coming: { label: 'COMING', color: '#2563EB', bg: '#EFF6FF' },
  booked: { label: 'BOOKED', color: '#7C3AED', bg: '#EDE9FE' },
  completed: { label: 'COMPLETED', color: '#6B7280', bg: '#F3F4F6' },
  rejected: { label: 'REJECTED', color: '#DC2626', bg: '#FEE2E2' },
};

const MOCK_BOOKINGS = [
  {
    id: 'B001',
    status: 'ongoing',
    title: 'Utility Trailer 5×8',
    startDate: 'Feb 25',
    endDate: 'Feb 28, 2026',
    price: 120,
  },
  {
    id: 'B002',
    status: 'coming',
    title: '20ft Enclosed Cargo',
    startDate: 'Apr 1',
    endDate: 'Apr 5, 2026',
    price: 240,
  },
  {
    id: 'B003',
    status: 'booked',
    title: 'Car Hauler 18ft',
    startDate: 'Apr 10',
    endDate: 'Apr 11, 2026',
    price: 115,
  },
  {
    id: 'B004',
    status: 'completed',
    title: 'Utility Trailer 5×8',
    startDate: 'Feb 25',
    endDate: 'Feb 28, 2026',
    price: 120,
  },
  {
    id: 'B005',
    status: 'rejected',
    title: 'Utility Trailer 5×8',
    startDate: 'Feb 25',
    endDate: 'Feb 28, 2026',
    price: 120,
  },
  {
    id: 'B006',
    status: 'completed',
    title: '16ft Flatbed Trailer',
    startDate: 'Mar 10',
    endDate: 'Mar 12, 2026',
    price: 190,
  },
];

const BookingCard = ({ item, onDetails }) => {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.upcoming;

  return (
    <View style={styles.card}>
      {/* Top row: info + image */}
      <View style={styles.cardTop}>
        <View style={styles.cardInfo}>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>
              {cfg.label}
            </Text>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.dateRow}>
            <Icon
              name="calendar-month-outline"
              size={moderateScale(14)}
              color="#6B7280"
            />
            <Text style={styles.dateText}>
              {item.startDate} - {item.endDate}
            </Text>
          </View>
        </View>

        {/* Image placeholder */}
        <View style={styles.imagePlaceholder}>
          <Icon name="image-outline" size={moderateScale(24)} color="#9CA3AF" />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom row: price + details */}
      <View style={styles.cardBottom}>
        <Text style={styles.price}>${item.price}.00</Text>
        <Pressable style={styles.detailsBtn} onPress={onDetails}>
          <Text style={styles.detailsText}>Details</Text>
          <Icon name="chevron-right" size={moderateScale(16)} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
};

const MyRentals = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const filtered = MOCK_BOOKINGS.filter(b =>
    activeTab === 'Upcoming'
      ? ['ongoing', 'coming', 'booked'].includes(b.status)
      : ['completed', 'rejected'].includes(b.status),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Rental History</Text>
        <View style={{ width: moderateScale(22) }} />
      </View>

      {/* Segmented toggle */}
      <View style={styles.toggleWrapper}>
        <View style={styles.toggle}>
          {['Upcoming', 'Past'].map(tab => (
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
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            onDetails={() =>
              navigation.navigate('BookingDetail', { booking: item })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon
              name="inbox-outline"
              size={moderateScale(48)}
              color="#D1D5DB"
            />
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} bookings
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default MyRentals;
