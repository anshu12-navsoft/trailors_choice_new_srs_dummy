import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { styles } from '../stylesheets/MyRecentBookings.style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../../Components/Buttons/CustomButton';
import colors from '../../../Constants/Colors';
import CustomHeader from '../../../Components/Header/CustomHeader';

const MOCK_BOOKINGS = [
  {
    id: '1',
    name: 'James Wilson',
    date: '24 Feb - 28 Feb',
    status: 'requested',
    extra: '7 Days Rental',
  },
  {
    id: '2',
    name: 'James Wilson',
    date: '24 Feb - 28 Feb',
    status: 'in_progress',
    extra: 'Return Tomorrow',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    date: '28 Feb - 5 Mar',
    status: 'confirmed',
    extra: '3 Days Rental',
  },
  {
    id: '4',
    name: 'Michael Johnson',
    date: '5 Mar - 10 Mar',
    status: 'cancelled',
  },
  {
    id: '5',
    name: 'Michael Johnson',
    date: '10 Mar - 15 Mar',
    status: 'completed',
    extra: '3 Days Rental',
  },
];

const BookingRow = ({ item }) => {
  const renderStatus = () => {
    switch (item.status) {
      case 'requested':
        return <Text style={{ color: '#2563EB' }}>Requested</Text>;

      case 'in_progress':
        return <Text style={{ color: '#2563EB' }}>In Progress</Text>;

      case 'confirmed':
        return <Text style={{ color: 'green' }}>Confirmed</Text>;

      case 'cancelled':
        return <Text style={{ color: 'red' }}>Cancelled</Text>;

      case 'completed':
        return <Text style={{ color: 'green' }}>Completed</Text>;

      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (item.status) {
      case 'requested':
        return (
          <View style={styles.actionRow}>
            <Pressable style={styles.acceptBtn}>
              <Text style={styles.acceptText}>Accept</Text>
            </Pressable>
            <Pressable style={styles.declineBtn}>
              <Text style={styles.declineText}>Decline</Text>
            </Pressable>
          </View>
        );

      case 'in_progress':
        return (
          <Pressable style={styles.singleBtn}>
            <Text style={styles.singleBtnText}>Confirm Return</Text>
          </Pressable>
        );

      case 'confirmed':
        return (
          <Pressable style={styles.singleBtn}>
            <Text style={styles.singleBtnText}>Confirm Pickup</Text>
          </Pressable>
        );

      case 'completed':
        return (
          <View style={styles.ratingRow}>
            <Text>⭐ ⭐ ⭐ ⭐ ⭐</Text>
            <Text style={styles.rateText}>Rate Renter</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      {/* Top */}
      <View style={styles.row}>
        <View style={styles.avatar} />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          {renderStatus()}
          {item.extra && <Text style={styles.extra}>{item.extra}</Text>}
        </View>
      </View>

      {/* Bottom */}
      {renderActions()}
    </View>
  );
};

const MyRecentBookingScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState('All');

  // 🔥 FUTURE: API CALL BASED ON TAB
  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      let status = '';

      switch (activeTab) {
        case 'Active':
          status = 'active';
          break;
        case 'Upcoming':
          status = 'upcoming';
          break;
        case 'Completed':
          status = 'completed';
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
      setBookings(MOCK_BOOKINGS);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FILTER LOGIC (for now until API fully used)
  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'Active':
        return bookings.filter(t => t.status === 'active');

      case 'Upcoming':
        return bookings.filter(t => t.status === 'upcoming');

      case 'Completed':
        return bookings.filter(t => t.status === 'completed');

      case 'All':
      default:
        return bookings;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <CustomHeader title="Manage Trailer" onBack={() => navigation.goBack()} />

      {/* 🔥 Tabs */}
      <View style={styles.toggle}>
        {['All', 'Active', 'Upcoming', 'Completed'].map(tab => (
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

export default MyRecentBookingScreen;
